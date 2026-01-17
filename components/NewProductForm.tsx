'use client';

import { addProduct } from '@/app/products/actions';
import { useState, useRef } from 'react';
import { Plus, X, Box } from 'lucide-react';

export default function NewProductForm() {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="btn btn-primary">
                <Plus size={18} /> New Product
            </button>
        );
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary-dim)', background: 'var(--bg-element)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Define New Product</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <form ref={formRef} action={async (formData) => {
                await addProduct(formData);
                formRef.current?.reset();
                setIsOpen(false);
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product Name</label>
                        <input name="name" required placeholder="e.g., Dining Table Model X"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Selling Price (Optional)</label>
                        <input name="price" type="number" step="0.01" placeholder="0.00"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={() => setIsOpen(false)} className="btn btn-outline">Cancel</button>
                    <button type="submit" className="btn btn-primary">Create Product</button>
                </div>
            </form>
        </div>
    );
}
