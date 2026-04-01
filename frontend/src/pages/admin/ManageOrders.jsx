import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, CalendarRange, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/pages/admin/AdminOrders.css';

const statusOptions = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

function ManageOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAllOrders();
        setOrders(data || []);
      } catch {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      load();
    }
  }, [navigate, user]);

  const filteredOrders = useMemo(() => {
    const list = orders
      .filter((order) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
          String(order.id || order._id || '').toLowerCase().includes(term) ||
          String(order.customerName || '').toLowerCase().includes(term) ||
          String(order.restaurantName || '').toLowerCase().includes(term)
        );
      })
      .filter((order) => (statusFilter === 'all' ? true : String(order.status) === statusFilter))
      .filter((order) => {
        if (!fromDate && !toDate) return true;
        const created = new Date(order.createdAt || Date.now()).getTime();
        const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : -Infinity;
        const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : Infinity;
        return created >= from && created <= to;
      })
      .sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        if (sortKey === 'totalAmount') {
          return sortDirection === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
        }
        const left = String(av).toLowerCase();
        const right = String(bv).toLowerCase();
        if (left < right) return sortDirection === 'asc' ? -1 : 1;
        if (left > right) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

    return list;
  }, [fromDate, orders, searchTerm, sortDirection, sortKey, statusFilter, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const pagedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const onSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  const updateStatus = async (status) => {
    if (!selectedOrder) return;
    setError('');
    try {
      await orderService.updateOrderStatus(selectedOrder.id || selectedOrder._id, status);
      setOrders((prev) =>
        prev.map((item) =>
          (item.id || item._id) === (selectedOrder.id || selectedOrder._id) ? { ...item, status } : item
        )
      );
      setSelectedOrder((prev) => ({ ...prev, status }));
    } catch (err) {
      setError(`Failed to update order status: ${err.message || 'Unknown error'}`);
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <AdminLayout title="Manage Orders" subtitle="Filter, inspect and update order lifecycle in real-time.">
      {error && <div className="admin-alert-error">{error}</div>}

      <section className="orders-filters-card">
        <div className="filters-row">
          <label className="field-with-icon">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search order ID, customer, restaurant"
            />
          </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option value={status} key={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <label className="field-with-icon date-field">
            <CalendarRange size={16} />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label className="field-with-icon date-field">
            <CalendarRange size={16} />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="orders-table-card">
        {loading ? (
          <div className="admin-loading-card">Loading orders...</div>
        ) : (
          <>
            <div className="orders-table-wrap">
              <table className="orders-management-table">
                <thead>
                  <tr>
                    <th className="sticky-col">
                      <button type="button" onClick={() => onSort('id')}>
                        Order <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th><button type="button" onClick={() => onSort('customerName')}>Customer <ArrowUpDown size={14} /></button></th>
                    <th><button type="button" onClick={() => onSort('restaurantName')}>Restaurant <ArrowUpDown size={14} /></button></th>
                    <th><button type="button" onClick={() => onSort('totalAmount')}>Amount <ArrowUpDown size={14} /></button></th>
                    <th><button type="button" onClick={() => onSort('status')}>Status <ArrowUpDown size={14} /></button></th>
                    <th><button type="button" onClick={() => onSort('createdAt')}>Date <ArrowUpDown size={14} /></button></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-state">No orders match these filters.</td>
                    </tr>
                  ) : (
                    pagedOrders.map((order) => (
                      <tr key={order.id || order._id} onClick={() => setSelectedOrder(order)}>
                        <td className="sticky-col">#{String(order.id || order._id).slice(0, 8)}</td>
                        <td>{order.customerName || 'Guest User'}</td>
                        <td>{order.restaurantName || 'Partner Outlet'}</td>
                        <td>₹{Number(order.totalAmount || 0).toLocaleString()}</td>
                        <td>
                          <span className={`status-pill status-${String(order.status || 'PENDING').toLowerCase()}`}>
                            {String(order.status || 'PENDING').replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="orders-pagination">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={16} /> Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </section>

      <aside className={`order-detail-drawer ${selectedOrder ? 'open' : ''}`}>
        <div className="drawer-head">
          <h3>Order Detail</h3>
          <button type="button" onClick={() => setSelectedOrder(null)}>×</button>
        </div>

        {selectedOrder && (
          <div className="drawer-body">
            <p><strong>Order:</strong> #{String(selectedOrder.id || selectedOrder._id).slice(0, 8)}</p>
            <p><strong>Customer:</strong> {selectedOrder.customerName || 'Guest User'}</p>
            <p><strong>Restaurant:</strong> {selectedOrder.restaurantName || 'Partner Outlet'}</p>
            <p><strong>Amount:</strong> ₹{Number(selectedOrder.totalAmount || 0).toLocaleString()}</p>
            <p><strong>Address:</strong> {selectedOrder.deliveryAddress || 'N/A'}</p>

            <h4>Change Status</h4>
            <div className="drawer-status-actions">
              {statusOptions.map((status) => (
                <button
                  type="button"
                  className={status === selectedOrder.status ? 'active' : ''}
                  onClick={() => updateStatus(status)}
                  key={status}
                  disabled={['DELIVERED', 'CANCELLED'].includes(selectedOrder.status)}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {!['DELIVERED', 'CANCELLED'].includes(selectedOrder.status) && (
              <button
                type="button"
                className="danger"
                onClick={() => updateStatus('CANCELLED')}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Cancel Order
              </button>
            )}
          </div>
        )}
      </aside>
    </AdminLayout>
  );
}

export default ManageOrders;
