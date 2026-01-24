'use client';

import { useState } from 'react';
import { Edit2, X, Save, Package } from 'lucide-react';
import { updateCustomer, deleteCustomer } from '@/app/customers/actions';
import ConfirmDeleteButton from './ConfirmDeleteButton';
import CustomerProductsModal from './CustomerProductsModal';

export default function EditCustomerRow({ customer, allProducts, linkedProductIds }: { customer: any, allProducts: any[], linkedProductIds: number[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    if (!isEditing) {
        return (
            <tr>
                <td style={{ fontWeight: 500 }}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="btn btn-outline"
                        title="Manage Products"
                        style={{ padding: '0.4rem', fontSize: '0.75rem', marginRight: '0.5rem', color: 'var(--primary)', borderColor: 'var(--primary-dim)' }}
                    >
                        <Package size={14} />
                    </button>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline"
                        title="Edit Details"
                        style={{ padding: '0.4rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                    >
                        <Edit2 size={14} />
                    </button>
                    <ConfirmDeleteButton
                        action={deleteCustomer}
                        id={customer.id}
                        itemName={customer.name}
                        buttonStyle={{ borderColor: 'var(--danger-dim)', color: 'var(--danger)' }}
                    />
                    {isProductModalOpen && (
                        <CustomerProductsModal
                            customer={customer}
                            allProducts={allProducts}
                            linkedProductIds={linkedProductIds}
                            onClose={() => setIsProductModalOpen(false)}
                        />
                    )}
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td colSpan={5}>
                <form action={async (formData) => {
                    await updateCustomer(formData);
                    setIsEditing(false);
                }} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-element)', padding: '0.5rem', borderRadius: '8px' }}>
                    <input type="hidden" name="id" value={customer.id} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <input
                            name="name"
                            defaultValue={customer.name}
                            required
                            placeholder="Name"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <input
                            name="email"
                            defaultValue={customer.email}
                            placeholder="Email"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <input
                            name="phone"
                            defaultValue={customer.phone}
                            placeholder="Phone"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                    </div>

                    <input
                        name="address"
                        defaultValue={customer.address}
                        placeholder="Address"
                        style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                    />

                    <textarea
                        name="notes"
                        defaultValue={customer.notes}
                        placeholder="Notes"
                        rows={2}
                        style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white', fontFamily: 'inherit' }}
                    />

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={14} /> Save
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: '0.4rem' }}>
                            <X size={14} />
                        </button>
                    </div>
                </form>
            </td>
        </tr>
    );
}
