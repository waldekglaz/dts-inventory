import db from '@/lib/db';
import NewAccessoryForm from '@/components/NewAccessoryForm';
import EditAccessoryRow from '@/components/EditAccessoryRow';
import SearchBar from '@/components/SearchBar';
import { PackageSearch } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccessoriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const query = (await searchParams).q || '';

    const accessories = query
        ? db.prepare('SELECT * FROM accessories WHERE name LIKE ? ORDER BY name ASC').all(`%${query}%`) as any[]
        : db.prepare('SELECT * FROM accessories ORDER BY name ASC').all() as any[];

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Accessories & Packaging</h1>
                    <p>Monitor stock for non-material items like boxes and hardware.</p>
                </div>
                <NewAccessoryForm />
            </header>

            <SearchBar placeholder="Search accessories by name..." />

            <div className="card">
                {accessories.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <PackageSearch size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>{query ? `No accessories found matching "${query}"` : 'No accessories found. Add your first accessory to get started.'}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Min Level</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accessories.map((acc) => (
                                    <EditAccessoryRow key={acc.id} acc={acc} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
