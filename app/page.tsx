import db from '@/lib/db';
import { AlertCircle, ArrowUpRight, Package, ShoppingCart, Activity } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every render

export default function Home() {
  // Execute queries for dashboard stats
  // Using 'as any' casting because better-sqlite3 types can be tricky in this context without explicit interfaces
  // In a full production app, we would define types for query results.

  const stats = {
    materials: (db.prepare('SELECT COUNT(*) as count FROM materials').get() as any).count,
    accessories: (db.prepare('SELECT COUNT(*) as count FROM accessories').get() as any).count,
    lowStock: (db.prepare('SELECT COUNT(*) as count FROM materials WHERE (quantity + quantity_remote) <= min_level').get() as any).count +
      (db.prepare('SELECT COUNT(*) as count FROM accessories WHERE quantity <= min_level').get() as any).count,
    activeOrders: (db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('pending') as any).count,
  };

  const lowStockMats = db.prepare("SELECT id, name, (quantity + quantity_remote) as quantity, min_level, unit, lead_time_days, 'Material' as type FROM materials WHERE (quantity + quantity_remote) <= min_level").all() as any[];
  const lowStockAccs = db.prepare("SELECT id, name, quantity, min_level, unit, lead_time_days, 'Accessory' as type FROM accessories WHERE quantity <= min_level").all() as any[];
  const lowStockItems = [...lowStockMats, ...lowStockAccs].sort((a, b) => (a.quantity / a.min_level) - (b.quantity / b.min_level)).slice(0, 10);

  const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all() as any[];

  return (
    <div>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem' }}>Factory Overview</h1>
          <p style={{ fontSize: '1.1rem' }}>Welcome back. Here is your production summary.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/materials" className="btn btn-outline" style={{ background: 'var(--bg-panel)' }}>
            <Package size={18} /> Inventory
          </Link>
          <Link href="/orders" className="btn btn-primary">
            <ShoppingCart size={18} /> New Order
          </Link>
        </div>
      </header>

      <div className="grid-3">
        {/* Low Stock Alert Card */}
        <div className="card stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '100px', height: '100px',
            background: 'radial-gradient(circle, var(--danger-dim) 0%, transparent 70%)', transform: 'translate(30%, -30%)'
          }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label" style={{ color: stats.lowStock > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>Low Stock Alerts</span>
              <div className="stat-value" style={{ color: stats.lowStock > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
                {stats.lowStock}
              </div>
            </div>
            <div style={{
              padding: '0.75rem', borderRadius: '12px',
              background: stats.lowStock > 0 ? 'var(--danger-dim)' : 'var(--bg-element)',
              color: stats.lowStock > 0 ? 'var(--danger)' : 'var(--text-secondary)'
            }}>
              <AlertCircle size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {stats.lowStock > 0 ? 'Materials & accessories need attention' : 'Inventory levels are healthy'}
          </div>
        </div>

        {/* Total Assets Card */}
        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Total SKUs</span>
              <div className="stat-value">{stats.materials + stats.accessories}</div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--primary-dim)', color: 'var(--primary)' }}>
              <Package size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stats.materials} Materials • {stats.accessories} Accessories</div>
        </div>

        {/* Pending Orders Card */}
        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Pending Orders</span>
              <div className="stat-value" style={{ color: stats.activeOrders > 0 ? 'var(--warning)' : 'var(--text-main)' }}>
                {stats.activeOrders}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(210, 153, 34, 0.15)', color: 'var(--warning)' }}>
              <ShoppingCart size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Orders awaiting production</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

        {/* Unified Low Stock Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
              <AlertCircle size={20} color="var(--danger)" />
              Reorder Requirements
            </h3>
          </div>

          {lowStockItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div style={{ padding: '1rem', background: 'var(--success-dim)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--success)' }}>
                <Activity size={32} />
              </div>
              <p>All stock levels are optimal.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Stock Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item, idx) => (
                    <tr key={`${item.type}-${item.id}-${idx}`}>
                      <td style={{ fontWeight: 500 }}>
                        {item.name}
                        {item.lead_time_days > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning)' }}></span>
                            {item.lead_time_days} day lead time
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'var(--bg-element)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{item.quantity}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ {item.min_level} {item.unit}</span>
                        </div>
                      </td>
                      <td>
                        {item.lead_time_days > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span className="badge badge-danger">Order Now</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Arrives: {new Date(Date.now() + item.lead_time_days * 86400000).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                            </span>
                          </div>
                        ) : (
                          <span className="badge badge-danger">Reorder</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Orders List */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map((order) => (
                <div key={order.id} style={{
                  padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: '8px',
                  display: 'flex', flexDirection: 'column', gap: '0.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{order.customer_name}</span>
                    <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ID: #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Link href="/orders" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }}>View All Orders</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
