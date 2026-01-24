'use client';

import { addCustomer } from '@/app/customers/actions';
import { useState, useRef } from 'react';
import { Plus, X, Save } from 'lucide-react';

export default function NewCustomerForm() {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="btn btn-primary">
                <Plus size={18} /> Add Customer
            </button>
        );
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary-dim)', background: 'var(--bg-element)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Add New Customer</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <form ref={formRef} action={async (formData) => {
                await addCustomer(formData);
                formRef.current?.reset();
                setIsOpen(false);
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customer Name</label>
                        <input name="name" required placeholder="John Doe"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                        <input name="email" type="email" placeholder="john@example.com"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone</label>
                        <input name="phone" placeholder="+1234567890"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Address</label>
                        <input name="address" placeholder="123 Main St, City, Country"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Notes</label>
                        <textarea name="notes" rows={2} placeholder="Additional notes..."
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white', fontFamily: 'inherit' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={() => setIsOpen(false)} className="btn btn-outline">Cancel</button>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} /> Save Customer
                    </button>
                </div>
            </form>
        </div>
    );
}
