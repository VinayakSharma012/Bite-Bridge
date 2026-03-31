import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Clock3, MapPin, Phone, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import './OrderTracking.css';

const timelineStages = [
  {
    key: 'confirmed',
    label: 'Order confirmed',
    detail: 'Your restaurant has accepted the order.',
  },
  {
    key: 'preparing',
    label: 'Preparing',
    detail: 'The kitchen is assembling your meal.',
  },
  {
    key: 'packed',
    label: 'Packed securely',
    detail: 'Everything is sealed and ready to travel.',
  },
  {
    key: 'out-for-delivery',
    label: 'On the way',
    detail: 'Your rider is heading to your address now.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    detail: 'Your order has reached your door.',
  },
];

const statusMap = {
  confirmed: 0,
  preparing: 1,
  packed: 2,
  'out-for-delivery': 3,
  delivered: 4,
};

const defaultDriver = {
  name: 'Aarav Singh',
  phone: '+91 98765 43210',
  vehicle: 'Bike • MH 12 AB 2401',
  rating: 4.9,
  reviews: 312,
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
};

function formatCurrency(value) {
  return `₹${Math.round(value || 0)}`;
}

function formatEta(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function OrderTracking() {
  const { id } = useParams();
  const location = useLocation();
  const { cartItems, subtotal, deliveryFee, tax, total } = useCart();

  const order = useMemo(() => {
    if (location.state?.order) {
      return location.state.order;
    }

    const fallbackItems =
      cartItems.length > 0
        ? cartItems.map((item) => ({
            name: item.name,
            qty: item.quantity,
            price: item.price,
          }))
        : [
            { name: 'Margherita Pizza', qty: 1, price: 399 },
            { name: 'Garlic Bread', qty: 2, price: 149 },
          ];

    return {
      id: id || 'ORD-2024-001234',
      status: 'out-for-delivery',
      restaurant: 'BiteBridge Select',
      items: fallbackItems,
      estimatedMinutes: 25,
      subtotal: subtotal || 697,
      deliveryFee: deliveryFee || 30,
      tax: tax || 35,
      total: total || 762,
    };
  }, [cartItems, deliveryFee, id, location.state, subtotal, tax, total]);

  const driver = location.state?.driver || defaultDriver;
  const address = location.state?.address;
  const payment = location.state?.payment;

  const initialStatusIndex = statusMap[order.status] ?? 3;
  const [secondsRemaining, setSecondsRemaining] = useState(
    initialStatusIndex === statusMap.delivered ? 0 : (order.estimatedMinutes || 25) * 60
  );

  useEffect(() => {
    if (secondsRemaining <= 0) return undefined;

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((remaining) => Math.max(0, remaining - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [secondsRemaining]);

  const currentStatusIndex = secondsRemaining === 0 ? statusMap.delivered : initialStatusIndex;
  const activeStatus = timelineStages[currentStatusIndex];
  const progressPercent = `${(currentStatusIndex / (timelineStages.length - 1)) * 100}%`;
  const isDelivered = currentStatusIndex === statusMap.delivered;

  return (
    <>
      <Navbar />

      <main className="order-tracking-page page-shell">
        <div className="container tracking-page-shell">
          <header className="tracking-hero">
            <div>
              <span className="tracking-kicker">Live order tracking</span>
              <h1>Order #{order.id}</h1>
              <p>{order.restaurant} is on the move with a premium BiteBridge handoff.</p>
            </div>

            <div className="tracking-eta-card">
              <div className="tracking-eta-label">
                <Clock3 size={18} />
                <span>{isDelivered ? 'Delivered' : 'ETA countdown'}</span>
              </div>
              <strong>{isDelivered ? '00:00' : formatEta(secondsRemaining)}</strong>
            </div>
          </header>

          <div className="tracking-layout">
            <section className="tracking-main-column">
              <div className="tracking-map-card">
                <div className="tracking-map-grid" aria-hidden="true" />
                <svg viewBox="0 0 640 360" className="tracking-route" aria-hidden="true">
                  <path
                    d="M76 274C141 235 182 242 235 196C284 154 338 150 389 131C447 110 482 87 561 74"
                    pathLength="100"
                  />
                </svg>

                <div className="tracking-restaurant-badge">
                  <span>🍽️</span>
                  <span>{order.restaurant}</span>
                </div>

                <motion.div
                  className="tracking-rider-pin"
                  animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🛵
                </motion.div>

                <div className="tracking-destination-pin">
                  <span className="tracking-destination-ring" />
                  <div className="tracking-destination-core">
                    <MapPin size={18} />
                  </div>
                </div>

                <div className="tracking-map-overlay">
                  <div>
                    <span className="tracking-overlay-label">Current status</span>
                    <strong>{activeStatus.label}</strong>
                  </div>
                  <p>{activeStatus.detail}</p>
                </div>
              </div>

              <div className="tracking-driver-card">
                <img src={driver.image} alt={driver.name} className="tracking-driver-avatar" />

                <div className="tracking-driver-copy">
                  <div className="tracking-driver-top">
                    <div>
                      <span className="tracking-section-kicker">Your driver</span>
                      <h2>{driver.name}</h2>
                    </div>
                    <div className="tracking-driver-rating">
                      <Star size={16} fill="currentColor" />
                      <span>{driver.rating}</span>
                    </div>
                  </div>

                  <p>{driver.vehicle}</p>
                  <small>{driver.reviews} completed deliveries with premium routing</small>

                  <div className="tracking-driver-actions">
                    <a href={`tel:${driver.phone}`} className="tracking-call-button">
                      <Phone size={18} />
                      <span>Call driver</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <aside className="tracking-sidebar">
              <div className="tracking-timeline-card">
                <div className="tracking-sidebar-header">
                  <span className="tracking-section-kicker">Timeline</span>
                  <h2>Delivery progress</h2>
                </div>

                <div className="tracking-timeline">
                  <div className="tracking-line-base" />
                  <motion.div
                    className="tracking-line-fill"
                    initial={{ height: 0 }}
                    animate={{ height: progressPercent }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />

                  {timelineStages.map((stage, index) => {
                    const isComplete = index < currentStatusIndex;
                    const isActive = index === currentStatusIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`tracking-stage ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}
                      >
                        <div className="tracking-stage-marker">
                          {isComplete ? '✓' : <span className="tracking-stage-dot" />}
                        </div>
                        <div className="tracking-stage-copy">
                          <strong>{stage.label}</strong>
                          <p>{stage.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="tracking-order-card">
                <div className="tracking-sidebar-header">
                  <span className="tracking-section-kicker">Order details</span>
                  <h2>Your items</h2>
                </div>

                <div className="tracking-order-items">
                  {order.items.map((item) => (
                    <div key={`${item.name}-${item.qty}`} className="tracking-order-item">
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.qty} item{item.qty > 1 ? 's' : ''}</p>
                      </div>
                      <span>{formatCurrency((item.price || 0) * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="tracking-order-breakdown">
                  <div className="tracking-breakdown-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="tracking-breakdown-row">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="tracking-breakdown-row">
                    <span>Delivery fee</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                </div>

                <div className="tracking-total-row">
                  <span>Total</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>

                {(address || payment) && (
                  <div className="tracking-meta-block">
                    {address && (
                      <div className="tracking-meta-item">
                        <span>Delivering to</span>
                        <strong>{address.label}</strong>
                        <p>{address.line1}, {address.city}</p>
                      </div>
                    )}

                    {payment && (
                      <div className="tracking-meta-item">
                        <span>Payment</span>
                        <strong>{payment}</strong>
                      </div>
                    )}
                  </div>
                )}

                <AnimatePresence>
                  {isDelivered && (
                    <motion.div
                      className="tracking-rate-action"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Button variant="primary" size="large" fullWidth>
                        Rate your order <ArrowRight size={18} />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default OrderTracking;
