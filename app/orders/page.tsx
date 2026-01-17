import db from '@/lib/db';
import NewOrderForm from '@/components/NewOrderForm';
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton';
import { ShoppingCart, Clock, Trash2 } from 'lucide-react';
import { deleteOrder } from './actions';

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
    const orders = db.prepare(`
    SELECT o.*, oi.quantity, p.name as product_name
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.created_at DESC
  `).all() as any[];

    const products = db.prepare('SELECT id, name FROM products').all() as any[];

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Order History</h1>
                    <p>Track production fulfillment and customer requests.</p>
                </div>
                <NewOrderForm products={products} />
            </header>

            <div className="card">
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Clock size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>No orders processed yet.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>#{o.id}</td>
                                        <td style={{ fontWeight: 600 }}>{o.customer_name}</td>
                                        <td>{o.product_name}</td>
                                        <td>{o.quantity}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td><span className="badge badge-success">{o.status}</span></td>
                                        <td>
                                            <ConfirmDeleteButton
                                                action={deleteOrder}
                                                id={o.id}
                                                itemName={`Order #${o.id} for ${o.customer_name}`}
                                                buttonStyle={{ padding: '0.4rem', color: 'var(--danger)' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
