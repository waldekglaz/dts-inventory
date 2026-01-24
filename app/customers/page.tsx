import db from '@/lib/db';
import NewCustomerForm from '@/components/NewCustomerForm';
import EditCustomerRow from '@/components/EditCustomerRow';
import SearchBar from '@/components/SearchBar';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const query = (await searchParams).q || '';

    const customers = query
        ? db.prepare('SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? ORDER BY name ASC').all(`%${query}%`, `%${query}%`) as any[]
        : db.prepare('SELECT * FROM customers ORDER BY name ASC').all() as any[];

    const allProducts = db.prepare('SELECT id, name, price FROM products ORDER BY name ASC').all() as any[];

    // This is N+1 but acceptable for small datasets. For larger, we'd fetch all links in one query.
    const customersWithProducts = customers.map(c => {
        const linked = db.prepare('SELECT product_id FROM customer_products WHERE customer_id = ?').all(c.id) as { product_id: number }[];
        return {
            ...c,
            linkedProductIds: linked.map(l => l.product_id)
        };
    });

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Customer Library</h1>
                    <p>Manage your customer database and contact details.</p>
                </div>
                <NewCustomerForm />
            </header>

            <SearchBar placeholder="Search customers..." />

            <div className="card">
                {customers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>{query ? `No customers found matching "${query}"` : 'No customers found. Add your first customer.'}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customersWithProducts.map((customer) => (
                                    <EditCustomerRow
                                        key={customer.id}
                                        customer={customer}
                                        allProducts={allProducts}
                                        linkedProductIds={customer.linkedProductIds}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
