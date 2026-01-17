'use client'

import { createOrder } from '@/app/orders/actions';
import { useState, useRef } from 'react';
import { ShoppingCart, Plus, X, AlertCircle } from 'lucide-react';

export default function NewOrderForm({ products }: { products: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="btn btn-primary">
                <ShoppingCart size={18} /> Place New Order
            </button>
        );
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary-dim)', background: 'var(--bg-element)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Process Customer Order</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            {error && (
                <div style={{ background: 'var(--danger-dim)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form ref={formRef} action={async (formData) => {
                setError('');
                const res = await createOrder(formData);
                if (res?.error) {
                    setError(res.error);
                } else {
                    formRef.current?.reset();
                    setIsOpen(false);
                }
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customer Name</label>
                        <input name="customerName" required placeholder="Full Name"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Product</label>
                        <select name="productId" required style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }}>
                            <option value="">Choose a product...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quantity to Build</label>
                        <input name="quantity" type="number" min="1" required defaultValue="1"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Note: Finalizing this order will automatically deduct required materials from stock.
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={() => setIsOpen(false)} className="btn btn-outline">Cancel</button>
                    <button type="submit" className="btn btn-primary">Complete Order & Deduct Stock</button>
                </div>
            </form>
        </div>
    );
}
