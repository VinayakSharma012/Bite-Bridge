import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  Plus,
  Store,
  TicketPercent,
  Truck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import analyticsService from '../../services/analyticsService';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/pages/admin/AdminDashboard.css';

function Sparkline({ points = [20, 38, 34, 48, 42, 55, 61] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 120;
      const y = 34 - ((point - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="kpi-sparkline" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={path} />
    </svg>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getDashboardAnalytics();
        setAnalytics(data);
      } catch {
        setError('Unable to load dashboard insights right now.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      load();
    }
  }, [navigate, user]);

  const kpis = useMemo(
    () => [
      {
        key: 'orders',
        label: 'Orders Today',
        value: analytics?.todayOrders ?? analytics?.totalOrders ?? 0,
        trend: analytics?.ordersGrowth ?? 8.4,
        icon: Package,
        tone: 'pink',
        sparkline: [24, 29, 33, 31, 38, 46, 48],
      },
      {
        key: 'revenue',
        label: 'Revenue',
        value: `₹${Number(analytics?.totalRevenue ?? 0).toLocaleString()}`,
        trend: analytics?.revenueGrowth ?? 12.1,
        icon: DollarSign,
        tone: 'blue',
        sparkline: [22, 27, 25, 34, 31, 41, 44],
      },
      {
        key: 'users',
        label: 'Active Users',
        value: analytics?.activeUsers ?? 0,
        trend: analytics?.usersGrowth ?? 5.2,
        icon: Users,
        tone: 'green',
        sparkline: [16, 19, 22, 28, 32, 30, 39],
      },
      {
        key: 'delivery',
        label: 'Delivery SLA',
        value: `${Math.round(analytics?.deliveryRate ?? 94)}%`,
        trend: -1.8,
        icon: Truck,
        tone: 'amber',
        sparkline: [44, 42, 39, 36, 33, 34, 31],
      },
    ],
    [analytics]
  );

  const recentOrders = analytics?.recentOrders ?? [];

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Monitor performance, revenue, and daily operations in one place."
      headerAction={
        <button className="admin-gradient-btn" type="button" onClick={() => navigate('/admin/restaurants')}>
          <Plus size={16} /> Add Restaurant
        </button>
      }
    >
      {error && <div className="admin-alert-error">{error}</div>}

      {loading ? (
        <div className="admin-loading-card">Loading dashboard metrics...</div>
      ) : (
        <>
          <section className="kpi-grid">
            {kpis.map((item, index) => {
              const Icon = item.icon;
              const trendUp = Number(item.trend) >= 0;
              return (
                <article key={item.key} className={`kpi-card tone-${item.tone}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="kpi-top-row">
                    <div className={`kpi-icon kpi-icon-${item.tone}`}>
                      <Icon size={20} />
                    </div>
                    <div className={`kpi-trend ${trendUp ? 'up' : 'down'}`}>
                      {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{Math.abs(Number(item.trend)).toFixed(1)}%</span>
                    </div>
                  </div>
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                  <Sparkline points={item.sparkline} />
                </article>
              );
            })}
          </section>

          <section className="admin-quick-actions">
            <h2>Quick Action Buttons</h2>
            <div className="quick-actions-grid">
              <button type="button" className="quick-action-card" onClick={() => navigate('/admin/orders')}>
                <span className="quick-action-icon pink"><Package size={18} /></span>
                <span>Manage Orders</span>
              </button>
              <button type="button" className="quick-action-card" onClick={() => navigate('/admin/restaurants')}>
                <span className="quick-action-icon blue"><Store size={18} /></span>
                <span>Manage Restaurants</span>
              </button>
              <button type="button" className="quick-action-card" onClick={() => navigate('/admin/users')}>
                <span className="quick-action-icon green"><Users size={18} /></span>
                <span>Manage Users</span>
              </button>
              <button type="button" className="quick-action-card" onClick={() => navigate('/admin/coupons')}>
                <span className="quick-action-icon amber"><TicketPercent size={18} /></span>
                <span>Manage Coupons</span>
              </button>
            </div>
          </section>

          <section className="orders-panel">
            <div className="orders-panel-head">
              <h2>Recent Orders</h2>
              <button type="button" className="subtle-link-btn" onClick={() => navigate('/admin/orders')}>
                View all
              </button>
            </div>
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-state">No recent orders yet.</td>
                    </tr>
                  ) : (
                    recentOrders.slice(0, 8).map((order) => (
                      <tr key={order.id || order._id}>
                        <td>#{String(order.id || order._id).slice(0, 8)}</td>
                        <td>{order.customerName || 'Guest User'}</td>
                        <td>{order.restaurantName || 'BiteBridge Partner'}</td>
                        <td>₹{Number(order.totalAmount || 0).toLocaleString()}</td>
                        <td>
                          <span className={`status-pill status-${String(order.status || 'pending').toLowerCase()}`}>
                            {String(order.status || 'PENDING').replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
