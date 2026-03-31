import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Copy, Plus, Scissors, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import couponService from '../../services/couponService';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/pages/admin/AdminCoupons.css';

const defaultForm = {
  code: '',
  discount: '',
  discountType: 'PERCENTAGE',
  minOrderAmount: '',
  maxDiscount: '',
  validFrom: '',
  validTo: '',
  usageLimit: '',
};

function ManageCoupons() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await couponService.getAllCoupons();
        setCoupons(data || []);
      } catch {
        setError('Failed to load coupons.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      load();
    }
  }, [navigate, user]);

  const preview = useMemo(() => ({
    code: form.code || 'SAVE20',
    discount: form.discount || 20,
    discountType: form.discountType,
    validFrom: form.validFrom || new Date().toISOString().slice(0, 10),
    validTo: form.validTo || new Date().toISOString().slice(0, 10),
  }), [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await couponService.updateCoupon(editingId, form);
      } else {
        await couponService.createCoupon(form);
      }
      const data = await couponService.getAllCoupons();
      setCoupons(data || []);
      setShowModal(false);
      setEditingId('');
      setForm(defaultForm);
    } catch {
      setError('Failed to save coupon.');
    }
  };

  const onCopy = async (id, code) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 800);
  };

  const onDelete = async (id) => {
    try {
      await couponService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError('Failed to delete coupon.');
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <AdminLayout
      title="Manage Coupons"
      subtitle="Craft premium coupon experiences and launch discount campaigns."
      headerAction={
        <button className="admin-gradient-btn" type="button" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Coupon
        </button>
      }
    >
      {error && <div className="admin-alert-error">{error}</div>}

      <section className="coupons-grid-admin">
        {loading ? (
          <div className="admin-loading-card">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="admin-loading-card">No coupons available.</div>
        ) : (
          coupons.map((coupon) => (
            <article key={coupon.id} className="coupon-luxury-card">
              <div className="coupon-stripe" />
              <Scissors size={16} className="coupon-scissor" />
              <div className="coupon-code-row">
                <code>{coupon.code}</code>
                <button
                  type="button"
                  className={`copy-btn ${copiedId === coupon.id ? 'copied' : ''}`}
                  onClick={() => onCopy(coupon.id, coupon.code)}
                >
                  <Copy size={14} />
                  {copiedId === coupon.id ? 'Copied' : 'Copy'}
                </button>
              </div>
              <h3>
                {coupon.discount}
                {coupon.discountType === 'PERCENTAGE' ? '%' : '₹'} OFF
              </h3>
              <p className="coupon-validity">
                <CalendarDays size={14} />
                {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validTo).toLocaleDateString()}
              </p>
              <div className="coupon-actions-row">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(coupon.id);
                    setForm({ ...coupon });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => onDelete(coupon.id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {showModal && (
        <div className="coupon-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="coupon-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="coupon-modal-head">
              <h3>{editingId ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button type="button" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="coupon-modal-grid">
              <form className="coupon-form" onSubmit={handleSubmit}>
                <label>Code<input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></label>
                <label>Discount<input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} required /></label>
                <label>Type
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed</option>
                  </select>
                </label>
                <label>Valid From<input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} required /></label>
                <label>Valid To<input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} required /></label>
                <label>Min Order<input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} /></label>
                <label>Max Discount<input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} /></label>
                <label>Usage Limit<input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} /></label>
                <button type="submit" className="admin-gradient-btn">{editingId ? 'Update' : 'Create'}</button>
              </form>

              <div className="coupon-preview">
                <h4>Live Preview</h4>
                <article className="coupon-luxury-card preview">
                  <div className="coupon-stripe" />
                  <Scissors size={16} className="coupon-scissor" />
                  <div className="coupon-code-row">
                    <code>{preview.code}</code>
                  </div>
                  <h3>
                    {preview.discount}
                    {preview.discountType === 'PERCENTAGE' ? '%' : '₹'} OFF
                  </h3>
                  <p className="coupon-validity">
                    <CalendarDays size={14} />
                    {new Date(preview.validFrom).toLocaleDateString()} - {new Date(preview.validTo).toLocaleDateString()}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ManageCoupons;
