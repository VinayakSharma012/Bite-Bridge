import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CreditCard,
  Download,
  Package,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import analyticsService from '../../services/analyticsService';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/pages/admin/Analytics.css';

const tabs = ['week', 'month', 'quarter', 'year'];

function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [range, setRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [orderData, revenueData, userStats, deliveryData, paymentData] = await Promise.all([
          analyticsService.getOrderAnalytics(range),
          analyticsService.getRevenueAnalytics(range),
          analyticsService.getUserAnalytics(),
          analyticsService.getDeliveryAnalytics(range),
          analyticsService.getPaymentAnalytics(range),
        ]);

        setAnalytics({
          orders: orderData || {},
          revenue: revenueData || {},
          users: userStats || {},
          delivery: deliveryData || {},
          payment: paymentData || {},
        });
      } catch {
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      load();
    }
  }, [navigate, range, user]);

  const revenueSeries = useMemo(
    () =>
      analytics?.revenue?.trend || [
        { label: 'Mon', value: 42000 },
        { label: 'Tue', value: 47000 },
        { label: 'Wed', value: 43500 },
        { label: 'Thu', value: 52000 },
        { label: 'Fri', value: 61000 },
        { label: 'Sat', value: 68000 },
        { label: 'Sun', value: 64000 },
      ],
    [analytics]
  );

  const paymentBreakdown = useMemo(
    () =>
      analytics?.payment?.methods || [
        { name: 'UPI', value: 48 },
        { name: 'Card', value: 27 },
        { name: 'COD', value: 18 },
        { name: 'Wallet', value: 7 },
      ],
    [analytics]
  );

  const ordersByDay = useMemo(
    () =>
      analytics?.orders?.daily || [
        { label: 'Mon', value: 120 },
        { label: 'Tue', value: 132 },
        { label: 'Wed', value: 128 },
        { label: 'Thu', value: 151 },
        { label: 'Fri', value: 184 },
        { label: 'Sat', value: 210 },
        { label: 'Sun', value: 196 },
      ],
    [analytics]
  );

  const stats = [
    { label: 'Revenue', value: `₹${Number(analytics?.revenue?.total || 0).toLocaleString()}`, trend: '+12%', icon: TrendingUp },
    { label: 'Orders', value: Number(analytics?.orders?.totalOrders || 0).toLocaleString(), trend: '+8%', icon: Package },
    { label: 'Users', value: Number(analytics?.users?.total || 0).toLocaleString(), trend: '+5%', icon: Users },
    { label: 'Deliveries', value: Number(analytics?.delivery?.total || 0).toLocaleString(), trend: '+3%', icon: Truck },
    { label: 'Payments', value: `${Number(analytics?.payment?.successRate || 0).toFixed(1)}%`, trend: '+2%', icon: CreditCard },
  ];

  const exportReport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 900);
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <AdminLayout
      title="Analytics"
      subtitle="Track growth trends, conversions and payment behavior."
      headerAction={
        <button type="button" className={`admin-gradient-btn ${exporting ? 'download-pop' : ''}`} onClick={exportReport}>
          <Download size={16} /> Export Report
        </button>
      }
    >
      {error && <div className="admin-alert-error">{error}</div>}

      <div className="date-tabs-row">
        {tabs.map((tab) => (
          <button key={tab} type="button" className={range === tab ? 'active' : ''} onClick={() => setRange(tab)}>
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading-card">Loading chart data...</div>
      ) : (
        <>
          <section className="analytics-stats-grid">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="analytics-stat-card">
                  <span className="stat-icon-wrap"><Icon size={16} /></span>
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                  <span className="stat-trend">{item.trend}</span>
                </article>
              );
            })}
          </section>

          <section className="charts-grid">
            <article className="chart-card">
              <h3>Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueSeries}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#e8004c" strokeWidth={3} dot={false} isAnimationActive />
                </LineChart>
              </ResponsiveContainer>
            </article>

            <article className="chart-card">
              <h3>Payment Methods</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={paymentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={54}>
                    {paymentBreakdown.map((_, index) => (
                      <Cell
                        key={`payment-${index}`}
                        fill={['#E8004C', '#3B82F6', '#10B981', '#F59E0B'][index % 4]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </article>

            <article className="chart-card full">
              <h3>Orders by Day</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ordersByDay}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff6b9d" radius={[8, 8, 0, 0]} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
            </article>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

export default Analytics;
