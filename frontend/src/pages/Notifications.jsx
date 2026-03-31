import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Trash2, Archive, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import useInViewStagger from '../hooks/useInViewStagger';
import notify from '../utils/toast';
import '../styles/pages/Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Order Confirmed!',
      message: 'Your order from Taj Mahal Restaurant has been confirmed',
      time: '5 minutes ago',
      read: false,
      icon: '✓',
    },
    {
      id: 2,
      type: 'delivery',
      title: 'Order On The Way',
      message: 'Your food is on the way with delivery partner Raj Kumar',
      time: '10 minutes ago',
      read: false,
      icon: '🚗',
    },
    {
      id: 3,
      type: 'promo',
      title: 'Special Offer!',
      message: 'Get 30% off on all restaurants near you this weekend',
      time: '1 hour ago',
      read: true,
      icon: '🎉',
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order has been delivered. Please rate your experience',
      time: '2 hours ago',
      read: true,
      icon: '📦',
    },
    {
      id: 5,
      type: 'review',
      title: 'Review Request',
      message: 'Share your experience at Taj Mahal Restaurant',
      time: '3 hours ago',
      read: true,
      icon: '⭐',
    },
  ]);

  const [filterType, setFilterType] = useState('all');
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);
  const [loading, setLoading] = useState(true);
  const listReveal = useInViewStagger();

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [filterType, notifications]);

  const filterNotifications = () => {
    let filtered = notifications;
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }
    setFilteredNotifications(filtered);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    notify.success('Marked all notifications as read.');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    notify.info('Notification removed.');
  };

  const deleteAll = () => {
    setNotifications([]);
    notify.warning('All notifications were cleared.');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'order': return 'info';
      case 'delivery': return 'success';
      case 'promo': return 'warning';
      case 'review': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Navbar />

      <main className="notifications-page page-shell">
        <div className="notifications-container">
          <div className="notifications-header">
            <div className="header-content">
              <h1>Notifications</h1>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} new</span>
              )}
            </div>
            <div className="header-actions">
              {unreadCount > 0 && (
                <Button variant="secondary" size="small" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="danger" size="small" onClick={deleteAll}>
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="notification-filters">
            <div className="filter-label">
              <Filter size={18} /> Filter:
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filterType === 'order' ? 'active' : ''}`}
                onClick={() => setFilterType('order')}
              >
                Orders
              </button>
              <button
                className={`filter-btn ${filterType === 'delivery' ? 'active' : ''}`}
                onClick={() => setFilterType('delivery')}
              >
                Delivery
              </button>
              <button
                className={`filter-btn ${filterType === 'promo' ? 'active' : ''}`}
                onClick={() => setFilterType('promo')}
              >
                Promotions
              </button>
              <button
                className={`filter-btn ${filterType === 'review' ? 'active' : ''}`}
                onClick={() => setFilterType('review')}
              >
                Reviews
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div
            ref={listReveal.ref}
            className={`notifications-list reveal-section ${listReveal.inView ? 'is-visible' : ''}`}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`notification-skeleton-${index}`} className="skeleton-card">
                  <div className="skeleton-line shimmer" />
                  <div className="skeleton-line short shimmer" />
                </div>
              ))
            ) : filteredNotifications.length === 0 ? (
              <div className="empty-notifications">
                <Bell size={48} />
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredNotifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 8, height: 'auto' }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Card
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                  <div className="notification-content">
                    <div className="notification-icon">
                      {notification.icon}
                    </div>
                    <div className="notification-details">
                      <div className="notification-header">
                        <h4>{notification.title}</h4>
                        <Badge variant={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="message">{notification.message}</p>
                      <span className="time">{notification.time}</span>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="action-btn icon-btn"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                        aria-label="Mark notification as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="action-btn delete icon-btn"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Notifications;
