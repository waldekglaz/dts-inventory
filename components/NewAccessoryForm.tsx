'use client';

import { addAccessory } from '@/app/accessories/actions';
import { useState, useRef } from 'react';
import { Plus, X, Save } from 'lucide-react';

export default function NewAccessoryForm() {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="btn btn-primary">
                <Plus size={18} /> Add Accessory
            </button>
        );
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary-dim)', background: 'var(--bg-element)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Add New Accessory</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <form ref={formRef} action={async (formData) => {
                await addAccessory(formData);
                formRef.current?.reset();
                setIsOpen(false);
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Accessory Name</label>
                        <input name="name" required placeholder="e.g., Shipping Box Large"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Initial Qty</label>
                        <input name="quantity" type="number" step="0.01" required defaultValue="0"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Unit</label>
                        <input name="unit" defaultValue="pcs"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Min Level (Alert)</label>
                        <input name="min_level" type="number" step="0.01" required defaultValue="5"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={() => setIsOpen(false)} className="btn btn-outline">Cancel</button>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} /> Save Accessory
                    </button>
                </div>
            </form>
        </div>
    );
}
