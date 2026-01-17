'use client'

import { addProductAccessory, deleteProductAccessory } from '@/app/products/actions';
import { Plus, Package } from 'lucide-react';
import { useState } from 'react';
import ConfirmDeleteButton from './ConfirmDeleteButton';

export default function AccessoryEditor({ productId, accessories, currentAccessories }: { productId: number, accessories: any[], currentAccessories: any[] }) {
    const [selectedAccessory, setSelectedAccessory] = useState('');
    const [qty, setQty] = useState('');

    const handleAdd = async () => {
        if (!selectedAccessory || !qty) return;
        await addProductAccessory(productId, parseInt(selectedAccessory), parseFloat(qty));
        setSelectedAccessory('');
        setQty('');
    };

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Fulfillment & Packaging</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {currentAccessories.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', background: 'var(--bg-element)', padding: '0.5rem', borderRadius: '4px' }}>
                        <div>
                            <span>{item.accessory_name}</span>
                            <span style={{ color: 'var(--warning)', fontWeight: 600, marginLeft: '0.5rem' }}>{item.quantity_per_product} {item.unit} / unit</span>
                        </div>
                        <ConfirmDeleteButton
                            action={deleteProductAccessory}
                            id={item.id}
                            buttonStyle={{ padding: '0.2rem', color: 'var(--text-muted)', border: 'none', background: 'transparent' }}
                            iconSize={14}
                        />
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                    value={selectedAccessory}
                    onChange={(e) => setSelectedAccessory(e.target.value)}
                    style={{ flex: 2, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white', fontSize: '0.85rem' }}
                >
                    <option value="">Add packaging/box...</option>
                    {accessories.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.unit})</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Qty"
                    title="How many of this accessory per product unit?"
                    style={{ flex: 1, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white', fontSize: '0.85rem' }}
                />
                <button onClick={handleAdd} className="btn btn-outline" style={{ padding: '0.4rem', borderColor: 'var(--warning)', color: 'var(--warning)' }}>
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
