import db from '@/lib/db';
import NewMaterialForm from '@/components/NewMaterialForm';
import EditMaterialRow from '@/components/EditMaterialRow';
import SearchBar from '@/components/SearchBar';
import { Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const query = (await searchParams).q || '';

    const materials = query
        ? db.prepare('SELECT * FROM materials WHERE name LIKE ? ORDER BY name ASC').all(`%${query}%`) as any[]
        : db.prepare('SELECT * FROM materials ORDER BY name ASC').all() as any[];

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Material Inventory</h1>
                    <p>Manage your raw materials and stock levels.</p>
                </div>
                <NewMaterialForm />
            </header>

            <SearchBar placeholder="Search materials by name..." />

            <div className="card">
                {materials.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>{query ? `No materials found matching "${query}"` : 'No materials found. Add your first material to get started.'}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Min Level</th>
                                    <th>Cost / Unit</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((m) => (
                                    <EditMaterialRow key={m.id} m={m} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
