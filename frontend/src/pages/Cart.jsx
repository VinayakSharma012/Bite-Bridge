import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useCart } from '../hooks/useCart';
import './Cart.css';

function formatCurrency(value) {
  return `₹${Math.round(value || 0)}`;
}

function getItemSubtitle(item) {
  if (Array.isArray(item.customizations) && item.customizations.length > 0) {
    return item.customizations.join(' • ');
  }

  if (typeof item.customizations === 'string' && item.customizations.trim()) {
    return item.customizations;
  }

  if (item.restaurantName) {
    return `Prepared by ${item.restaurantName}`;
  }

  return 'Chef-crafted for a smooth BiteBridge delivery';
}

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    coupon,
    discountAmount,
    subtotal,
    deliveryFee,
    tax,
    total,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState(coupon?.code || '');
  const [couponState, setCouponState] = useState(coupon ? 'success' : 'idle');
  const [couponMessage, setCouponMessage] = useState(
    coupon ? `${coupon.code} applied successfully.` : ''
  );
  const [couponShake, setCouponShake] = useState(false);
  const maxItemQuantity = 10;

  useEffect(() => {
    if (coupon?.code) {
      setCouponInput(coupon.code);
      setCouponState('success');
      setCouponMessage(`${coupon.code} applied successfully.`);
    }
  }, [coupon]);

  useEffect(() => {
    if (!couponShake) return undefined;

    const timeoutId = window.setTimeout(() => setCouponShake(false), 420);
    return () => window.clearTimeout(timeoutId);
  }, [couponShake]);

  const itemCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  const preDiscountTotal = subtotal + deliveryFee + tax;

  const handleQuantityChange = (itemId, delta) => {
    const item = cartItems.find((entry) => entry.id === itemId);
    if (!item) return;

    const nextQuantity = item.quantity + delta;
    if (nextQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (nextQuantity > maxItemQuantity) return;

    updateQuantity(itemId, nextQuantity);
  };

  const handleApplyCoupon = () => {
    const normalizedCode = couponInput.trim().toUpperCase();

    if (!normalizedCode || subtotal <= 0) {
      removeCoupon();
      setCouponState('error');
      setCouponMessage('Add items before applying a coupon.');
      setCouponShake(true);
      return;
    }

    if (normalizedCode === 'SAVE50') {
      applyCoupon(
        {
          code: normalizedCode,
          discount: 50,
          discountType: 'PERCENTAGE',
        },
        subtotal
      );
      setCouponState('success');
      setCouponMessage(`SAVE50 applied. You saved ${formatCurrency(subtotal * 0.5)}.`);
      return;
    }

    removeCoupon();
    setCouponState('error');
    setCouponMessage('Coupon not valid. Try SAVE50.');
    setCouponShake(true);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponState('idle');
    setCouponMessage('');
  };

  return (
    <>
      <Navbar />

      <main className="cart-page page-shell">
        <div className="container">
          <header className="cart-hero">
            <div>
              <span className="cart-kicker">Your BiteBridge order</span>
              <h1>Cart</h1>
              <p>{itemCount > 0 ? `${itemCount} items ready for checkout.` : 'A premium meal is just a few taps away.'}</p>
            </div>
          </header>

          {cartItems.length === 0 ? (
            <section className="cart-empty-state">
              <div className="cart-empty-illustration" aria-hidden="true">
                <span className="cart-empty-question">?</span>
                <span className="cart-empty-bowl" />
                <span className="cart-empty-orb orb-left" />
                <span className="cart-empty-orb orb-right" />
              </div>
              <h2>Your cart is waiting</h2>
              <p>Browse premium restaurants, pick your favorites, and we will take care of the rest.</p>
              <Button variant="primary" size="large" onClick={() => navigate('/restaurants')}>
                Start Ordering <ArrowRight size={18} />
              </Button>
            </section>
          ) : (
            <section className="cart-layout">
              <div className="cart-items-column">
                <div className="cart-section-card">
                  <div className="cart-section-header">
                    <div>
                      <span className="cart-section-kicker">Items</span>
                      <h2>Everything you picked</h2>
                    </div>
                    <div className="cart-item-count-badge">
                      <ShoppingCart size={16} />
                      <span>{itemCount}</span>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    <div className="cart-item-list">
                      {cartItems.map((item) => (
                        <motion.article
                          layout
                          key={item.id}
                          className="cart-item-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            x: -80,
                            height: 0,
                            marginBottom: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                          }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          <button
                            type="button"
                            className="cart-remove-button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X size={16} />
                          </button>

                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'
                            }
                            alt={item.name}
                            className="cart-item-image"
                          />

                          <div className="cart-item-content">
                            <div className="cart-item-copy">
                              <div className="cart-item-title-row">
                                <h3>{item.name}</h3>
                                <strong className="cart-item-total">
                                  {formatCurrency(item.price * item.quantity)}
                                </strong>
                              </div>
                              <p className="cart-item-customizations">{getItemSubtitle(item)}</p>
                              <div className="cart-item-meta">
                                <span>{formatCurrency(item.price)} each</span>
                                <span>{item.restaurantId ? `Restaurant #${item.restaurantId}` : 'Curated delivery'}</span>
                              </div>
                            </div>

                            <div className="cart-item-footer">
                              <div className="cart-quantity-stepper">
                                <button
                                  type="button"
                                  className="cart-stepper-button"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  aria-label={`Decrease quantity of ${item.name}`}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>

                                <AnimatePresence mode="wait" initial={false}>
                                  <motion.span
                                    key={item.quantity}
                                    className="cart-stepper-count"
                                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.92 }}
                                    transition={{ duration: 0.18 }}
                                  >
                                    {item.quantity}
                                  </motion.span>
                                </AnimatePresence>

                                <button
                                  type="button"
                                  className="cart-stepper-button"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  aria-label={`Increase quantity of ${item.name}`}
                                  disabled={item.quantity >= maxItemQuantity}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              </div>

              <aside className="cart-summary-column">
                <div className="cart-summary-card">
                  <div className="cart-summary-header">
                    <div>
                      <span className="cart-section-kicker">Summary</span>
                      <h2>Order summary</h2>
                    </div>
                  </div>

                  <div className="cart-summary-rows">
                    <div className="cart-summary-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="cart-summary-row">
                      <span>Tax (5%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="cart-summary-row">
                      <span>Delivery fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                    <div className={`cart-summary-row ${discountAmount > 0 ? 'discount' : ''}`}>
                      <span>Discount</span>
                      <span>{discountAmount > 0 ? `- ${formatCurrency(discountAmount)}` : formatCurrency(0)}</span>
                    </div>
                  </div>

                  <div className={`cart-coupon-panel ${couponShake ? 'shake' : ''}`}>
                    <label className="cart-coupon-label">Coupon code</label>
                    <div className="cart-coupon-form">
                      <Input
                        placeholder="Try SAVE50"
                        value={couponInput}
                        onChange={(event) => {
                          setCouponInput(event.target.value);
                          if (couponState !== 'idle') {
                            setCouponState('idle');
                            setCouponMessage('');
                          }
                        }}
                        error={couponState === 'error'}
                        errorMessage={couponState === 'error' ? couponMessage : ''}
                      />
                      <Button variant="primary" size="medium" onClick={handleApplyCoupon}>
                        Apply
                      </Button>
                    </div>

                    {couponState === 'success' && (
                      <motion.div
                        className="cart-coupon-feedback success"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>{couponMessage}</span>
                        <button type="button" onClick={handleRemoveCoupon}>
                          Remove
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <div className="cart-summary-total">
                    <div>
                      <span>Total</span>
                      <p>Inclusive of taxes and fees</p>
                    </div>
                    <div className="cart-total-stack">
                      {discountAmount > 0 && (
                        <span className="cart-total-original">{formatCurrency(preDiscountTotal)}</span>
                      )}
                      <strong>{formatCurrency(total)}</strong>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    className="cart-checkout-button"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </Button>
                </div>
              </aside>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export default Cart;
