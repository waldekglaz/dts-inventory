'use client';

import { useState } from 'react';
import { Edit2, X, Save, Trash2, Clock } from 'lucide-react';
import { updateAccessory, deleteAccessory } from '@/app/accessories/actions';
import ConfirmDeleteButton from './ConfirmDeleteButton';

export default function EditAccessoryRow({ acc }: { acc: any }) {
    const [isEditing, setIsEditing] = useState(false);

    if (!isEditing) {
        const isLow = acc.quantity <= acc.min_level;
        return (
            <tr>
                <td>
                    <div style={{ fontWeight: 500 }}>{acc.name}</div>
                    {acc.lead_time_days > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Lead Time">
                                <Clock size={10} /> {acc.lead_time_days}d lead time
                            </span>
                        </div>
                    )}
                </td>
                <td>{acc.quantity} <span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>{acc.unit}</span></td>
                <td>{acc.min_level} <span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>{acc.unit}</span></td>
                <td>
                    {isLow ? (
                        <span className="badge badge-danger">Low Stock</span>
                    ) : (
                        <span className="badge badge-success">OK</span>
                    )}
                </td>
                <td>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                    >
                        <Edit2 size={14} />
                    </button>
                    <ConfirmDeleteButton
                        action={deleteAccessory}
                        id={acc.id}
                        itemName={acc.name}
                        buttonStyle={{ borderColor: 'var(--danger-dim)', color: 'var(--danger)' }}
                    />
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td colSpan={5}>
                <form action={async (formData) => {
                    await updateAccessory(formData);
                    setIsEditing(false);
                }} style={{ background: 'var(--bg-element)', padding: '0.5rem', borderRadius: '8px' }}>
                    <input type="hidden" name="id" value={acc.id} />
                    <input type="hidden" name="unit" value={acc.unit} />

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input
                            name="name"
                            defaultValue={acc.name}
                            required
                            placeholder="Name"
                            style={{ flex: 2, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                            <input
                                name="quantity"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={acc.quantity}
                                required
                                style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{acc.unit}</span>
                        </div>
                        <input
                            name="min_level"
                            type="number"
                            step="0.01"
                            defaultValue={acc.min_level}
                            required
                            placeholder="Min"
                            style={{ flex: 1, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            name="lead_time_days"
                            type="number"
                            min="0"
                            defaultValue={acc.lead_time_days}
                            placeholder="Lead Time (Days)"
                            style={{ flex: 1, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
                                <Save size={14} /> Save
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: '0.4rem' }}>
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </form>
            </td>
        </tr>
    );
}
