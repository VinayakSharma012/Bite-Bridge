import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { User, Mail, Phone, MapPin, Save, LogOut, Edit, Camera } from 'lucide-react';
import userService from '../services/userService';
import orderService from '../services/orderService';
import useInViewStagger from '../hooks/useInViewStagger';
import notify from '../utils/toast';
import '../styles/pages/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const infoReveal = useInViewStagger();
  const ordersReveal = useInViewStagger();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      setError('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setError('');
      setSuccess('');
      await userService.updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
      notify.success('Profile updated successfully.');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err?.message || 'Failed to update profile';
      setError(message);
      notify.error(message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Navbar />

      <main className="profile-page page-shell">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-cover" />
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
              <button type="button" className="avatar-edit" aria-label="Edit profile photo">
                <Camera size={14} />
              </button>
            </div>
            <h1>My Account</h1>
            <p>Manage your profile and order history</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="profile-content">
        {/* Profile Section */}
            <div ref={infoReveal.ref} className={`profile-section reveal-section ${infoReveal.inView ? 'is-visible' : ''}`}>
              <div className="section-header">
                <h2>Personal Information</h2>
                <Button
                  variant={isEditing ? 'danger' : 'secondary'}
                  size="small"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : <Edit size={18} />}
                </Button>
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label><User size={14} /> Full Name {!isEditing && <Edit size={13} className="inline-edit-icon" />}</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={User}
                    />
                  </div>
                  <div className="form-group">
                    <label><Mail size={14} /> Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      icon={Mail}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><Phone size={14} /> Phone Number {!isEditing && <Edit size={13} className="inline-edit-icon" />}</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={Phone}
                    />
                  </div>
                  <div className="form-group">
                    <label><MapPin size={14} /> Delivery Address {!isEditing && <Edit size={13} className="inline-edit-icon" />}</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={MapPin}
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    fullWidth
                  >
                    <Save size={18} /> Save Changes
                  </Button>
                )}
              </div>
            </div>

        {/* Order History Section */}
            <div ref={ordersReveal.ref} className={`profile-section reveal-section ${ordersReveal.inView ? 'is-visible' : ''}`}>
              <div className="section-header">
                <h2>Order History</h2>
                <span className="order-count">{orders.length} orders</span>
              </div>

              {loading ? (
                <div className="loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet</p>
                  <Button variant="primary" onClick={() => navigate('/restaurants')}>
                    Order Now
                  </Button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-item timeline-item">
                      <span className={`timeline-dot status-${order.status?.toLowerCase()}`} aria-hidden="true" />
                      <div className="order-header">
                        <div className="order-info">
                          <h4>Order #{order.id?.substring(0, 8)}</h4>
                          <span className={`status status-${order.status?.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-meta">
                          <span className="date">{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="amount">₹{order.totalAmount}</span>
                        </div>
                      </div>
                      <div className="order-items">
                        {order.items?.map(item => (
                          <span key={item.id} className="item">
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

        {/* Account Actions */}
            <div className="profile-section actions">
              <Button
                variant="secondary"
                size="large"
                fullWidth
                onClick={() => navigate('/change-password')}
              >
                Change Password
              </Button>
              <Button
                variant="danger"
                size="large"
                fullWidth
                onClick={handleLogout}
              >
                <LogOut size={18} /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
