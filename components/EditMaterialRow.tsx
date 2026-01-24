'use client';

import { useState } from 'react';
import { Edit2, X, Save, Trash2, MapPin, Clock } from 'lucide-react';
import { updateMaterial, deleteMaterial } from '@/app/materials/actions';
import ConfirmDeleteButton from './ConfirmDeleteButton';

export default function EditMaterialRow({ m, currencySymbol = '$' }: { m: any, currencySymbol?: string }) {
    const [isEditing, setIsEditing] = useState(false);

    if (!isEditing) {
        const totalQty = m.quantity + m.quantity_remote;
        const isLow = totalQty <= m.min_level;
        return (
            <tr>
                <td>
                    <div style={{ fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                        {m.lead_time_days > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Lead Time">
                                <Clock size={10} /> {m.lead_time_days}d lead time
                            </span>
                        )}
                    </div>
                </td>
                <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div title="Total Stock">{totalQty.toFixed(2)} <span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>{m.unit}</span></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span style={{ color: 'var(--success-dim)' }}>{m.quantity.toFixed(2)} In House</span> •
                            <span style={{ color: 'var(--primary-dim)' }}> {m.quantity_remote.toFixed(2)} Remote</span>
                        </div>
                    </div>
                </td>
                <td>{m.min_level} <span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>{m.unit}</span></td>
                <td>{m.cost_per_unit ? `${currencySymbol}${m.cost_per_unit.toFixed(2)}` : '-'}</td>
                <td>
                    {isLow ? (
                        <span className="badge badge-danger">Low Total</span>
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
                        action={deleteMaterial}
                        id={m.id}
                        itemName={m.name}
                        buttonStyle={{ borderColor: 'var(--danger-dim)', color: 'var(--danger)' }}
                    />
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td colSpan={6}>
                <form action={async (formData) => {
                    await updateMaterial(formData);
                    setIsEditing(false);
                }} style={{ background: 'var(--bg-element)', padding: '0.5rem', borderRadius: '8px' }}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="unit" value={m.unit} />

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input
                            name="name"
                            defaultValue={m.name}
                            required
                            placeholder="Name"
                            style={{ flex: 2, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <input
                            name="min_level"
                            type="number"
                            step="0.01"
                            defaultValue={m.min_level}
                            required
                            placeholder="Min Total"
                            title="Minimum Total Level"
                            style={{ flex: 1, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <input
                            name="cost_per_unit"
                            type="number"
                            step="0.01"
                            defaultValue={m.cost_per_unit}
                            placeholder="Cost"
                            style={{ flex: 1, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '1rem', alignItems: 'center' }}>
                        <input
                            name="quantity"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={m.quantity}
                            required
                            placeholder="In House Qty"
                            title="In House Quantity"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <input
                            name="quantity_remote"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={m.quantity_remote}
                            required
                            placeholder="Remote Qty"
                            title="Remote Quantity"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <input
                            name="lead_time_days"
                            type="number"
                            min="0"
                            defaultValue={m.lead_time_days}
                            placeholder="Lead Time (Days)"
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
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
