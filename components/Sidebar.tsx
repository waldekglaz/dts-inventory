'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Box, ShoppingCart, Settings, Layers } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Overview', icon: Home },
        { href: '/materials', label: 'Materials', icon: Package },
        { href: '/accessories', label: 'Accessories', icon: Layers },
        { href: '/products', label: 'Products', icon: Box },
        { href: '/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, var(--primary), #3b82f6)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
                }}>D</div>
                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.02em' }}>DTS Control</span>
            </div>

            <nav style={{ flex: 1 }}>
                <div style={{ paddingBottom: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Menu
                </div>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span style={{ fontWeight: isActive ? 600 : 400 }}>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--bg-element)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>System Online</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>v1.0.0 • Local Storage</p>
            </div>
        </aside>
    );
}
