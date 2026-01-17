'use client'

import { addRecipeItem, deleteRecipeItem } from '@/app/products/actions';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDeleteButton from './ConfirmDeleteButton';

export default function RecipeEditor({ productId, materials, currentRecipe }: { productId: number, materials: any[], currentRecipe: any[] }) {
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [qty, setQty] = useState('');

    const handleAdd = async () => {
        if (!selectedMaterial || !qty) return;
        await addRecipeItem(productId, parseInt(selectedMaterial), parseFloat(qty));
        setSelectedMaterial('');
        setQty('');
    };

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Material Requirements</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {currentRecipe.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', background: 'var(--bg-element)', padding: '0.5rem', borderRadius: '4px' }}>
                        <div>
                            <span>{item.material_name}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: '0.5rem' }}>{item.yield_per_unit} items / {item.unit}</span>
                        </div>
                        <ConfirmDeleteButton
                            action={deleteRecipeItem}
                            id={item.id}
                            buttonStyle={{ padding: '0.2rem', color: 'var(--text-muted)', border: 'none', background: 'transparent' }}
                            iconSize={14}
                        />
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    style={{ flex: 2, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white', fontSize: '0.85rem' }}
                >
                    <option value="">Select Material...</option>
                    {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Yield (pcs/mat)"
                    title="How many products can be made from 1 unit of this material?"
                    style={{ flex: 1.5, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '4px', color: 'white', fontSize: '0.85rem' }}
                />
                <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '0.4rem' }}>
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
