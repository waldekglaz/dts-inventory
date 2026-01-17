import db from '@/lib/db';
import NewProductForm from '@/components/NewProductForm';
import SearchBar from '@/components/SearchBar';
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton';
import { Box, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct } from './actions';
import { getCurrencySymbol } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const query = (await searchParams).q || '';
    const currencySymbol = getCurrencySymbol();

    const products = query
        ? db.prepare('SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC').all(`%${query}%`) as any[]
        : db.prepare('SELECT * FROM products ORDER BY name ASC').all() as any[];

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

            <div className="card">
                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Box size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>{query ? `No products found matching "${query}"` : 'No products defined yet. Create a product to get started.'}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const recipe = db.prepare('SELECT id, yield_per_unit, material_id FROM recipes WHERE product_id = ?').all(product.id) as any[];
                                    const prodAccessories = db.prepare('SELECT id, quantity_per_product, accessory_id FROM product_accessories WHERE product_id = ?').all(product.id) as any[];

                                    let buildable = (recipe.length > 0 || prodAccessories.length > 0) ? Infinity : 0;

                                    recipe.forEach(item => {
                                        const mat = db.prepare('SELECT quantity FROM materials WHERE id = ?').get(item.material_id) as any;
                                        if (mat) {
                                            const possible = Math.floor(mat.quantity * item.yield_per_unit);
                                            buildable = Math.min(buildable, possible);
                                        }
                                    });

                                    prodAccessories.forEach(item => {
                                        const acc = db.prepare('SELECT quantity FROM accessories WHERE id = ?').get(item.accessory_id) as any;
                                        if (acc) {
                                            const possible = Math.floor(acc.quantity / item.quantity_per_product);
                                            buildable = Math.min(buildable, possible);
                                        }
                                    });

                                    const displayBuildable = buildable === Infinity ? 0 : buildable;

                                    return (
                                        <tr key={product.id}>
                                            <td style={{ fontWeight: 600 }}>
                                                <Link href={`/products/${product.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td>{currencySymbol}{product.price.toFixed(2)}</td>
                                            <td>
                                                <span style={{ color: displayBuildable > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                                                    {displayBuildable} units
                                                </span>
                                            </td>
                                            <td>
                                                {displayBuildable > 5 ? (
                                                    <span className="badge badge-success">Available</span>
                                                ) : displayBuildable > 0 ? (
                                                    <span className="badge badge-warning">Low</span>
                                                ) : (
                                                    <span className="badge badge-danger">Out of Stock</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <Link href={`/products/${product.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                                        View Config
                                                    </Link>
                                                    <ConfirmDeleteButton
                                                        action={deleteProduct}
                                                        id={product.id}
                                                        itemName={product.name}
                                                        buttonStyle={{ borderColor: 'var(--danger-dim)', color: 'var(--danger)' }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
