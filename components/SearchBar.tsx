'use client';

import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';

export default function SearchBar({ placeholder = "Search..." }: { placeholder?: string }) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentParams = new URLSearchParams(window.location.search);
            const currentQuery = currentParams.get('q') || '';

            // Only update if the query has actually changed
            if (searchTerm === currentQuery) return;

            const params = new URLSearchParams(window.location.search);
            if (searchTerm) {
                params.set('q', searchTerm);
            } else {
                params.delete('q');
            }

            startTransition(() => {
                replace(`${pathname}?${params.toString()}`);
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, pathname, replace]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '1.5rem' }}>
            <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
            }}>
                <Search size={18} />
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />

            {searchTerm && (
                <button
                    onClick={() => setSearchTerm('')}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <X size={16} />
                </button>
            )}

            {isPending && (
                <div style={{
                    position: 'absolute',
                    right: '40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)'
                }}>
                    Searching...
                </div>
            )}
        </div>
    );
}
