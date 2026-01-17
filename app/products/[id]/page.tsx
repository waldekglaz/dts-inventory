import db from '@/lib/db';
import RecipeEditor from '@/components/RecipeEditor';
import AccessoryEditor from '@/components/AccessoryEditor';
import { ChevronLeft, Box, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/lib/currency';
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton';
import { deleteProduct } from '../actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const currencySymbol = getCurrencySymbol();

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;

    if (!product) {
        notFound();
    }

    const materials = db.prepare('SELECT * FROM materials ORDER BY name ASC').all() as any[];
    const accessories = db.prepare('SELECT * FROM accessories ORDER BY name ASC').all() as any[];

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

    // Calculate buildable units
    let buildable = (recipe.length > 0 || prodAccessories.length > 0) ? Infinity : 0;
    recipe.forEach(item => {
        const possible = Math.floor(item.stock_qty * item.yield_per_unit);
        buildable = Math.min(buildable, possible);
    });
    prodAccessories.forEach(item => {
        const possible = Math.floor(item.stock_qty / item.quantity_per_product);
        buildable = Math.min(buildable, possible);
    });

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <ChevronLeft size={16} /> Back to Catalog
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>{product.name}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Product Configuration & Requirements</p>
                    </div>
                    <ConfirmDeleteButton
                        action={deleteProduct}
                        id={product.id}
                        itemName={product.name}
                        buttonStyle={{ borderColor: 'var(--danger-dim)', color: 'var(--danger)' }}
                        iconSize={20}
                    />
                </div>
            </header>

            <div className="grid-2">
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Product Info</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-element)', borderRadius: '8px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Capacity (Based on Stock):</span>
                            <span style={{ fontWeight: 700, color: (buildable > 0 && buildable !== Infinity) ? 'var(--success)' : 'var(--danger)' }}>
                                {buildable === Infinity ? 0 : buildable} units
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-element)', borderRadius: '8px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Unit Selling Price:</span>
                            <span style={{ fontWeight: 600 }}>{currencySymbol}{product.price?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Configuration</h3>
                    <RecipeEditor
                        productId={product.id}
                        materials={materials}
                        currentRecipe={recipe}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <AccessoryEditor
                            productId={product.id}
                            accessories={accessories}
                            currentAccessories={prodAccessories}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
