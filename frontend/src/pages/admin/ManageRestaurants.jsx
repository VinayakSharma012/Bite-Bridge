import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, View } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import restaurantService from '../../services/restaurantService';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/pages/admin/AdminRestaurants.css';

const defaultForm = {
  name: '',
  description: '',
  cuisines: '',
  deliveryTime: '',
  avgPrice: '',
  address: '',
  city: '',
  zipCode: '',
};

function ManageRestaurants() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const [showDrawer, setShowDrawer] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data || []);
      } catch {
        setError('Failed to load restaurants.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      load();
    }
  }, [navigate, user]);

  const filtered = useMemo(
    () =>
      restaurants.filter((item) => {
        const value = search.trim().toLowerCase();
        if (!value) return true;
        return String(item.name || '').toLowerCase().includes(value);
      }),
    [restaurants, search]
  );

  const updateToggle = async (restaurant) => {
    const newStatus = !restaurant.isOpen;
    setError('');
    setRestaurants((prev) => prev.map((item) => (item.id === restaurant.id ? { ...item, isOpen: newStatus } : item)));
    try {
      await restaurantService.updateRestaurant(restaurant.id, { ...restaurant, isOpen: newStatus });
    } catch (err) {
      setError(`Failed to update restaurant status: ${err.message || 'Unknown error'}`);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await restaurantService.createRestaurant({
        ...form,
        cuisines: form.cuisines.split(',').map((item) => item.trim()).filter(Boolean),
      });
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data || []);
      setShowDrawer(false);
      setStep(1);
      setForm(defaultForm);
    } catch (err) {
      setError(`Unable to create restaurant: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setError('');
    try {
      await restaurantService.deleteRestaurant(deleteId);
      setRestaurants((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(`Unable to delete restaurant: ${err.message || 'Unknown error'}`);
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <AdminLayout
      title="Manage Restaurants"
      subtitle="Luxury card management for all partner restaurants."
      headerAction={
        <button className="admin-gradient-btn" type="button" onClick={() => setShowDrawer(true)}>
          <Plus size={16} /> Add Restaurant
        </button>
      }
    >
      {error && <div className="admin-alert-error">{error}</div>}

      <section className="restaurants-toolbar">
        <label className="field-with-icon">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search restaurants" />
        </label>
      </section>

      <section className="restaurants-grid-admin">
        {loading ? (
          <div className="admin-loading-card">Loading restaurants...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-loading-card">No restaurants found.</div>
        ) : (
          filtered.map((restaurant) => (
            <article key={restaurant.id} className="restaurant-admin-card">
              <img src={restaurant.image || '/placeholder.jpg'} alt={restaurant.name} />
              <div className="restaurant-admin-body">
                <div className="restaurant-head-row">
                  <h3>{restaurant.name}</h3>
                  <label className="status-toggle">
                    <input
                      type="checkbox"
                      checked={Boolean(restaurant.isOpen)}
                      onChange={() => updateToggle(restaurant)}
                    />
                    <span className="slider" />
                  </label>
                </div>
                <p>{restaurant.description || 'Premium taste, curated menu, and speedy delivery.'}</p>
                <div className="restaurant-meta">
                  <span>⭐ {restaurant.rating || '4.5'}</span>
                  <span>{restaurant.deliveryTime || '30-40 min'}</span>
                  <span>{restaurant.cuisines?.slice(0, 2).join(', ') || 'Multi-cuisine'}</span>
                </div>
                <div className="restaurant-actions-row">
                  <button type="button" onClick={() => navigate(`/restaurant/${restaurant.id}`)}><View size={16} /> View</button>
                  <button type="button" onClick={() => setShowDrawer(true)}><Pencil size={16} /> Edit</button>
                  <button type="button" className="danger" onClick={() => setDeleteId(restaurant.id)}><Trash2 size={16} /> Delete</button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <aside className={`restaurant-drawer ${showDrawer ? 'open' : ''}`}>
        <div className="drawer-head">
          <h3>Add Restaurant</h3>
          <button type="button" onClick={() => setShowDrawer(false)}>×</button>
        </div>
        <form className="restaurant-step-form" onSubmit={handleCreate}>
          <div className="step-track">
            <span className={step >= 1 ? 'active' : ''}>1</span>
            <span className={step >= 2 ? 'active' : ''}>2</span>
            <span className={step >= 3 ? 'active' : ''}>3</span>
          </div>

          {step === 1 && (
            <>
              <label>Restaurant Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
              <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            </>
          )}
          {step === 2 && (
            <>
              <label>Cuisines (comma separated)<input value={form.cuisines} onChange={(e) => setForm({ ...form, cuisines: e.target.value })} /></label>
              <label>Delivery Time<input value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} /></label>
              <label>Average Price<input value={form.avgPrice} onChange={(e) => setForm({ ...form, avgPrice: e.target.value })} /></label>
            </>
          )}
          {step === 3 && (
            <>
              <label>Address<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
              <label>City<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
              <label>Zip Code<input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} /></label>
            </>
          )}

          <div className="drawer-form-actions">
            {step > 1 && <button type="button" onClick={() => setStep((prev) => prev - 1)}>Back</button>}
            {step < 3 ? (
              <button type="button" className="primary" onClick={() => setStep((prev) => prev + 1)}>Next</button>
            ) : (
              <button type="submit" className="primary">Create Restaurant</button>
            )}
          </div>
        </form>
      </aside>

      {deleteId && (
        <div className="glass-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="glass-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Restaurant?</h3>
            <p>This action is permanent and will remove menu + order association.</p>
            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteId(null)}>Cancel</button>
              <button type="button" className="danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ManageRestaurants;
