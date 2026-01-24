'use client'

import { createOrder } from '@/app/orders/actions';
import { useState, useRef } from 'react';
import { ShoppingCart, Plus, X, AlertCircle, Calendar } from 'lucide-react';

export default function NewOrderForm({ products, customers, customerProductMap }: { products: any[], customers: any[], customerProductMap: Record<number, number[]> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [report, setReport] = useState<any[] | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    // Filter products based on selected customer
    const availableProducts = selectedCustomerId && customerProductMap[parseInt(selectedCustomerId)] && customerProductMap[parseInt(selectedCustomerId)].length > 0
        ? products.filter(p => customerProductMap[parseInt(selectedCustomerId)].includes(p.id))
        : products;

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

            {report && (
                <div style={{ background: 'rgba(255, 165, 0, 0.1)', border: '1px solid orange', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'orange', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                        <AlertCircle size={18} /> Insufficient Stock Report
                    </h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                        The following items are missing to fulfill this order. Please order them before proceeding.
                    </p>
                    <table style={{ width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Required</th>
                                <th>In Stock</th>
                                <th>Missing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((item, idx) => (
                                <tr key={idx} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '0.4rem 0' }}>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>{item.required.toFixed(2)} {item.unit}</td>
                                    <td>{item.available.toFixed(2)} {item.unit}</td>
                                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{item.missing.toFixed(2)} {item.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <form ref={formRef} action={async (formData) => {
                setError('');
                setReport(null);
                const res = await createOrder(formData);
                if (res?.error) {
                    setError(res.error);
                } else if (res?.report) {
                    setReport(res.report);
                } else {
                    formRef.current?.reset();
                    setSelectedCustomerId(''); // Reset selection
                    setIsOpen(false);
                }
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Customer</label>
                        <select
                            name="customerId"
                            required
                            value={selectedCustomerId}
                            onChange={(e) => setSelectedCustomerId(e.target.value)}
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }}
                        >
                            <option value="">Choose a customer...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Product</label>
                        <select name="productId" key={selectedCustomerId} required style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }}>
                            <option value="">Choose a product...</option>
                            {availableProducts.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        {selectedCustomerId && availableProducts.length < products.length && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Showing {availableProducts.length} filtered products for this customer.
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quantity to Build</label>
                        <input name="quantity" type="number" min="1" required defaultValue="1"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order Date</label>
                        <input name="orderDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]}
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Start Work Date</label>
                        <input name="startDate" type="date"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dispatcher/Completion Date</label>
                        <input name="completionDate" type="date"
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
