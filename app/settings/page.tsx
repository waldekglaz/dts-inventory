import { Settings as SettingsIcon, Database, Terminal, ShieldCheck, Banknote } from 'lucide-react';
import path from 'path';
import { getSetting } from '@/lib/db';
import { updateCurrency } from './actions';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
    const dbPath = path.join(process.cwd(), 'inventory.db');
    const currentCurrency = getSetting('currency') || 'USD';

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1>Settings</h1>
                <p>System configuration and database status.</p>
            </header>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--primary-dim)', color: 'var(--primary)', borderRadius: '12px' }}>
                            <Banknote size={24} />
                        </div>
                        <div>
                            <h3 style={{ marginBottom: 0 }}>Internationalization</h3>
                            <p style={{ fontSize: '0.85rem' }}>Adjust currency and units for your region.</p>
                        </div>
                    </div>

                    <form action={updateCurrency} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Primary Currency</label>
                            <select
                                name="currency"
                                key={currentCurrency}
                                defaultValue={currentCurrency}
                                style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: '0.6rem', borderRadius: '6px', color: 'white' }}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="PLN">PLN (zł)</option>
                                <option value="JPY">JPY (¥)</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            Save Changes
                        </button>
                    </form>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--primary-dim)', color: 'var(--primary)', borderRadius: '12px' }}>
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 style={{ marginBottom: 0 }}>Database info</h3>
                            <p style={{ fontSize: '0.85rem' }}>Your data is stored locally on this machine.</p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-element)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Engine</span>
                            <span style={{ fontWeight: 600 }}>SQLite 3 (WAL Mode)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Storage Path</span>
                            <code style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{dbPath}</code>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--success-dim)', color: 'var(--success)', borderRadius: '12px' }}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 style={{ marginBottom: 0 }}>Backup & Security</h3>
                            <p style={{ fontSize: '0.85rem' }}>Data safety and recovery.</p>
                        </div>
                    </div>

                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        To backup your data, simply copy the <code style={{ color: 'var(--primary)' }}>inventory.db</code> file from the path above to a USB drive or cloud storage.
                    </p>

                    <div style={{ padding: '1rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Advanced cloud sync coming soon
                    </div>
                </div>
            </div>
        </div>
    );
}
