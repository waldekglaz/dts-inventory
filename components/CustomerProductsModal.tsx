'use client';

import { useState } from 'react';
import { Package, X, Check } from 'lucide-react';
import { toggleCustomerProduct } from '@/app/customers/product-actions';

export default function CustomerProductsModal({
    customer,
    allProducts,
    linkedProductIds,
    onClose
}: {
    customer: any,
    allProducts: any[],
    linkedProductIds: number[],
    onClose: () => void
}) {
    const [linkedIds, setLinkedIds] = useState<Set<number>>(new Set(linkedProductIds));
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (productId: number, isChecked: boolean) => {
        setIsLoading(true);
        // Optimistic update
        const newSet = new Set(linkedIds);
        if (isChecked) {
            newSet.add(productId);
        } else {
            newSet.delete(productId);
        }
        setLinkedIds(newSet);

        try {
            await toggleCustomerProduct(customer.id, productId, isChecked);
        } catch (error) {
            console.error('Failed to toggle product', error);
            // Revert on error
            setLinkedIds(new Set(linkedProductIds));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={20} />
                        Authorized Products
                    </h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Select products available for <strong>{customer.name}</strong>.
                        If no products are selected, all products will be available.
                    </p>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                    {allProducts.map(product => {
                        const isLinked = linkedIds.has(product.id);
                        return (
                            <label key={product.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)',
                                background: isLinked ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                cursor: 'pointer', transition: 'background 0.2s'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 500 }}>{product.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{product.id} • ${product.price}</span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="checkbox"
                                        checked={isLinked}
                                        onChange={(e) => handleToggle(product.id, e.target.checked)}
                                        style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                                    />
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn btn-primary">Done</button>
                </div>
            </div>
        </div>
    );
}
