import db from '@/lib/db';
import NewProductForm from '@/components/NewProductForm';
import RecipeEditor from '@/components/RecipeEditor';
import AccessoryEditor from '@/components/AccessoryEditor';
import SearchBar from '@/components/SearchBar';
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton';
import { Box, Trash2 } from 'lucide-react';
import { deleteProduct } from './actions';
import { getCurrencySymbol } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const query = (await searchParams).q || '';
    const currencySymbol = getCurrencySymbol();

    const products = query
        ? db.prepare('SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC').all(`%${query}%`) as any[]
        : db.prepare('SELECT * FROM products ORDER BY name ASC').all() as any[];

    const materials = db.prepare('SELECT * FROM materials ORDER BY name ASC').all() as any[];
    const accessories = db.prepare('SELECT * FROM accessories ORDER BY name ASC').all() as any[];

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Production Catalog</h1>
                    <p>Define products, their bill of materials, and packaging requirements.</p>
                </div>
                <NewProductForm currencySymbol={currencySymbol} />
            </header>

            <SearchBar placeholder="Search products by name..." />

            <div className="grid-3">
                {products.map((product) => {
                    const recipe = db.prepare(`
            SELECT r.*, m.name as material_name, m.unit, m.quantity as stock_qty
            FROM recipes r
            JOIN materials m ON r.material_id = m.id
            WHERE r.product_id = ?
          `).all(product.id) as any[];

                    const prodAccessories = db.prepare(`
            SELECT pa.*, a.name as accessory_name, a.unit, a.quantity as stock_qty
            FROM product_accessories pa
            JOIN accessories a ON pa.accessory_id = a.id
            WHERE pa.product_id = ?
          `).all(product.id) as any[];

                    // Calculate how many we can build: Check both Materials AND Accessories
                    let buildable = (recipe.length > 0 || prodAccessories.length > 0) ? Infinity : 0;

                    // Check materials (Yield logic)
                    recipe.forEach(item => {
                        const possible = Math.floor(item.stock_qty * item.yield_per_unit);
                        buildable = Math.min(buildable, possible);
                    });

                    // Check accessories (Qty logic)
                    prodAccessories.forEach(item => {
                        const possible = Math.floor(item.stock_qty / item.quantity_per_product);
                        buildable = Math.min(buildable, possible);
                    });

                    return (
                        <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ marginBottom: 0 }}>{product.name}</h3>
                                <ConfirmDeleteButton
                                    action={deleteProduct}
                                    id={product.id}
                                    itemName={product.name}
                                    buttonClass=""
                                    buttonStyle={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                    iconSize={18}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Capacity (Based on Stock):</span>
                                    <span style={{ fontWeight: 700, color: buildable > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                        {buildable === Infinity ? 0 : buildable} units
                                    </span>
                                </div>

                                {product.price > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Unit Price:</span>
                                        <span>{currencySymbol}{product.price.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <RecipeEditor
                                productId={product.id}
                                materials={materials}
                                currentRecipe={recipe}
                            />

                            <AccessoryEditor
                                productId={product.id}
                                accessories={accessories}
                                currentAccessories={prodAccessories}
                            />
                        </div>
                    );
                })}
            </div>

            {products.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Box size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                    <p>{query ? `No products found matching "${query}"` : 'No products defined yet. Create a product and add its requirements.'}</p>
                </div>
            )}
        </div>
    );
}
