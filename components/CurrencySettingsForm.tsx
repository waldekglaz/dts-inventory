'use client';

import { useState, useEffect } from 'react';
import { updateCurrency } from '@/app/settings/actions';
import { Check } from 'lucide-react';

interface CurrencySettingsFormProps {
    currentCurrency: string;
}

export default function CurrencySettingsForm({ currentCurrency }: CurrencySettingsFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        const result = await updateCurrency(formData);
        setIsSaving(false);
        if (result?.success) {
            setShowSuccess(true);
        }
    }

    return (
        <form action={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Primary Currency</label>
                <select
                    name="currency"
                    key={currentCurrency}
                    defaultValue={currentCurrency}
                    disabled={isSaving}
                    style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }}
                >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="PLN">PLN (zł)</option>
                    <option value="JPY">JPY (¥)</option>
                </select>
            </div>
            <div style={{ position: 'relative', marginTop: '1.5rem' }}>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                    style={{ minWidth: '120px' }}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                {showSuccess && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: 'var(--success)',
                        fontSize: '0.8rem'
                    }}>
                        <Check size={14} /> Saved!
                    </div>
                )}
            </div>
        </form>
    );
}
