import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useCart } from '../hooks/useCart';
import orderService from '../services/orderService';
import './Checkout.css';

const initialAddresses = [
  {
    id: 'home',
    label: 'Home',
    line1: '18 Palm Residency, Linking Road',
    landmark: 'Near Carter Road',
    city: 'Mumbai',
    zipcode: '400050',
    default: true,
  },
  {
    id: 'work',
    label: 'Work',
    line1: '22 Skyline Towers, BKC',
    landmark: 'Opp. Trade Centre',
    city: 'Mumbai',
    zipcode: '400051',
    default: false,
  },
];

const paymentTabs = [
  { id: 'card', emoji: '💳', label: 'Card' },
  { id: 'upi', emoji: '📱', label: 'UPI' },
  { id: 'wallet', emoji: '👛', label: 'Wallet' },
];

const walletOptions = ['PhonePe Wallet', 'Paytm Wallet', 'Amazon Pay'];

function formatCurrency(value) {
  return `₹${Math.round(value || 0)}`;
}

function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function maskCardNumber(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '••••  ••••  ••••  4242';
  return digits
    .padEnd(16, '•')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, tax, total, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0].id);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardBack, setShowCardBack] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderId] = useState(() => `ORD-${String(Date.now()).slice(-8)}`);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [newAddress, setNewAddress] = useState({
    label: '',
    line1: '',
    landmark: '',
    city: '',
    zipcode: '',
  });
  const [paymentData, setPaymentData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    walletProvider: walletOptions[0],
  });

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const paymentSummary = useMemo(() => {
    if (paymentMethod === 'card') {
      const digits = paymentData.cardNumber.replace(/\D/g, '');
      return digits.length > 0 ? `Card ending in ${digits.slice(-4)}` : 'Card payment';
    }

    if (paymentMethod === 'upi') {
      return paymentData.upiId || 'UPI payment';
    }

    return paymentData.walletProvider || 'Wallet payment';
  }, [paymentMethod, paymentData]);

  const stepItems = useMemo(
    () => [
      { id: 1, label: 'Address' },
      { id: 2, label: 'Payment' },
      { id: 3, label: 'Review' },
    ],
    []
  );

  const isAddressValid = Boolean(selectedAddress);
  const isCardValid =
    paymentData.nameOnCard.trim().length > 1 &&
    paymentData.cardNumber.replace(/\D/g, '').length >= 16 &&
    paymentData.expiryDate.trim().length >= 5 &&
    paymentData.cvv.trim().length >= 3;
  const isUpiValid = paymentData.upiId.includes('@');
  const isWalletValid = Boolean(paymentData.walletProvider);
  const isPaymentValid =
    paymentMethod === 'card'
      ? isCardValid
      : paymentMethod === 'upi'
        ? isUpiValid
        : isWalletValid;

  const canProceed =
    currentStep === 1 ? isAddressValid : currentStep === 2 ? isPaymentValid : cartItems.length > 0;

  const handleNextStep = () => {
    if (!canProceed || currentStep >= 3) return;
    setDirection(1);
    setCurrentStep((step) => Math.min(3, step + 1));
  };

  const handlePrevStep = () => {
    if (currentStep <= 1) return;
    setDirection(-1);
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const handleAddAddress = () => {
    if (!newAddress.label.trim() || !newAddress.line1.trim() || !newAddress.city.trim() || !newAddress.zipcode.trim()) {
      return;
    }

    const id = `address-${Date.now()}`;
    const address = { ...newAddress, id, default: false };
    setAddresses((existing) => [...existing, address]);
    setSelectedAddressId(id);
    setShowAddressForm(false);
    setNewAddress({
      label: '',
      line1: '',
      landmark: '',
      city: '',
      zipcode: '',
    });
  };

  const handlePlaceOrder = async () => {
    if (placingOrder || cartItems.length === 0 || !selectedAddress) {
      return;
    }

    setPlacingOrder(true);
    setCheckoutError('');

    const orderState = {
      order: {
        id: orderId,
        status: 'out-for-delivery',
        restaurant: cartItems[0]?.restaurantName || 'BiteBridge Select',
        items: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price,
        })),
        estimatedMinutes: 25,
        subtotal,
        deliveryFee,
        tax,
        total,
      },
      driver: {
        name: 'Aarav Singh',
        phone: '+91 98765 43210',
        vehicle: 'Bike • MH 12 AB 2401',
        rating: 4.9,
        reviews: 312,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      },
      address: selectedAddress,
      payment: paymentSummary,
    };

    try {
      const createdOrder = await orderService.createOrder({
        restaurantId: cartItems[0]?.restaurantId || 'unknown-restaurant',
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          id: selectedAddress.id,
          label: selectedAddress.label,
          street: `${selectedAddress.line1}${selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ''}`,
          city: selectedAddress.city,
          state: 'NA',
          pincode: selectedAddress.zipcode,
          latitude: 0,
          longitude: 0,
          isDefault: false,
        },
        paymentMethod,
        specialInstructions: '',
        totalAmount: total,
      });

      const createdOrderId = createdOrder?.id || orderId;
      const normalizedStatus = String(createdOrder?.status || 'OUT_FOR_DELIVERY').toLowerCase().replaceAll('_', '-');

      clearCart();
      navigate(`/order/${createdOrderId}`, {
        state: {
          ...orderState,
          order: {
            ...orderState.order,
            id: createdOrderId,
            status: normalizedStatus,
            estimatedMinutes: 25,
          },
        },
      });
    } catch (error) {
      const message = error?.message || error?.response?.data?.message || 'Unable to place order right now. Please try again.';
      setCheckoutError(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <motion.section
          key="address"
          className="checkout-step-panel"
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 70 : -70 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -70 : 70 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <div className="checkout-panel-header">
            <div>
              <span className="checkout-kicker">Step 1</span>
              <h2>Choose your address</h2>
            </div>
          </div>

          <div className="checkout-address-grid">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`checkout-address-card ${selectedAddressId === address.id ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                />

                <div className="checkout-address-copy">
                  <div className="checkout-address-top">
                    <div className="checkout-address-title">
                      <MapPin size={16} />
                      <strong>{address.label}</strong>
                    </div>
                    {address.default && <span className="checkout-address-badge">Default</span>}
                  </div>
                  <p>{address.line1}</p>
                  {address.landmark && <p>{address.landmark}</p>}
                  <p>{address.city} • {address.zipcode}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="checkout-inline-action">
            <button
              type="button"
              className="checkout-add-address-toggle"
              onClick={() => setShowAddressForm((value) => !value)}
            >
              <Plus size={16} />
              <span>{showAddressForm ? 'Hide new address form' : 'Add New Address'}</span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showAddressForm && (
              <motion.div
                className="checkout-new-address"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <div className="checkout-form-grid">
                  <Input
                    label="Label"
                    placeholder="Home, Work, Studio..."
                    value={newAddress.label}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, label: event.target.value }))}
                  />
                  <Input
                    label="City"
                    placeholder="Mumbai"
                    value={newAddress.city}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </div>

                <Input
                  label="Address line"
                  placeholder="Apartment, street, area"
                  value={newAddress.line1}
                  onChange={(event) => setNewAddress((prev) => ({ ...prev, line1: event.target.value }))}
                />

                <div className="checkout-form-grid">
                  <Input
                    label="Landmark"
                    placeholder="Near metro or main road"
                    value={newAddress.landmark}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, landmark: event.target.value }))}
                  />
                  <Input
                    label="PIN code"
                    placeholder="400050"
                    value={newAddress.zipcode}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, zipcode: event.target.value }))}
                  />
                </div>

                <div className="checkout-form-actions">
                  <Button variant="secondary" size="medium" onClick={handleAddAddress}>
                    Save Address
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      );
    }

    if (currentStep === 2) {
      return (
        <motion.section
          key="payment"
          className="checkout-step-panel"
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 70 : -70 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -70 : 70 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <div className="checkout-panel-header">
            <div>
              <span className="checkout-kicker">Step 2</span>
              <h2>Select your payment method</h2>
            </div>
          </div>

          <div className="checkout-payment-tabs">
            {paymentTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`checkout-payment-tab ${paymentMethod === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setPaymentMethod(tab.id);
                  setShowCardBack(false);
                }}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {paymentMethod === 'card' && (
            <div className="checkout-card-mode">
              <div className={`checkout-card-scene ${showCardBack ? 'flipped' : ''}`}>
                <div className="checkout-card-face checkout-card-front">
                  <span className="checkout-card-chip" />
                  <strong>{maskCardNumber(paymentData.cardNumber)}</strong>
                  <div className="checkout-card-footer">
                    <div>
                      <span>Name</span>
                      <p>{paymentData.nameOnCard || 'YOUR NAME'}</p>
                    </div>
                    <div>
                      <span>Expires</span>
                      <p>{paymentData.expiryDate || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
                <div className="checkout-card-face checkout-card-back">
                  <div className="checkout-card-strip" />
                  <div className="checkout-card-cvv">
                    <span>Security code</span>
                    <strong>{paymentData.cvv || '•••'}</strong>
                  </div>
                </div>
              </div>

              <div className="checkout-form-stack">
                <Input
                  label="Name on card"
                  placeholder="Vinayak Sharma"
                  value={paymentData.nameOnCard}
                  onChange={(event) =>
                    setPaymentData((prev) => ({ ...prev, nameOnCard: event.target.value.toUpperCase() }))
                  }
                />
                <Input
                  label="Card number"
                  placeholder="4242 4242 4242 4242"
                  value={paymentData.cardNumber}
                  onChange={(event) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      cardNumber: formatCardNumber(event.target.value),
                    }))
                  }
                />
                <div className="checkout-form-grid">
                  <Input
                    label="Expiry date"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(event) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        expiryDate: event.target.value.slice(0, 5),
                      }))
                    }
                  />
                  <Input
                    label="CVV"
                    type="password"
                    placeholder="123"
                    value={paymentData.cvv}
                    onFocus={() => setShowCardBack(true)}
                    onBlur={() => setShowCardBack(false)}
                    onChange={(event) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        cvv: event.target.value.replace(/\D/g, '').slice(0, 4),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="checkout-alt-payment">
              <Input
                label="UPI ID"
                placeholder="name@upi"
                value={paymentData.upiId}
                onChange={(event) => setPaymentData((prev) => ({ ...prev, upiId: event.target.value }))}
              />
              <div className="checkout-chip-row">
                {['gpay', 'phonepe', 'paytm'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    className="checkout-chip"
                    onClick={() => setPaymentData((prev) => ({ ...prev, upiId: `yourname@${app}` }))}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="checkout-wallet-grid">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet}
                  type="button"
                  className={`checkout-wallet-card ${paymentData.walletProvider === wallet ? 'active' : ''}`}
                  onClick={() => setPaymentData((prev) => ({ ...prev, walletProvider: wallet }))}
                >
                  <span>👛</span>
                  <strong>{wallet}</strong>
                  <p>Fast one-tap checkout</p>
                </button>
              ))}
            </div>
          )}
        </motion.section>
      );
    }

    return (
      <motion.section
        key="review"
        className="checkout-step-panel"
        custom={direction}
        initial={{ opacity: 0, x: direction > 0 ? 70 : -70 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -70 : 70 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div className="checkout-panel-header">
          <div>
            <span className="checkout-kicker">Step 3</span>
            <h2>Review before you confirm</h2>
          </div>
        </div>

        <div className="checkout-review-grid">
          <div className="checkout-review-card">
            <h3>Delivery address</h3>
            <p>{selectedAddress?.label}</p>
            <p>{selectedAddress?.line1}</p>
            {selectedAddress?.landmark && <p>{selectedAddress.landmark}</p>}
            <p>{selectedAddress?.city} • {selectedAddress?.zipcode}</p>
          </div>

          <div className="checkout-review-card">
            <h3>Payment</h3>
            <p>{paymentSummary}</p>
            <p>Protected by BiteBridge secure checkout</p>
          </div>
        </div>

        <div className="checkout-review-card order-items">
          <h3>Order items</h3>
          <div className="checkout-review-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-review-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.quantity} × {formatCurrency(item.price)}</p>
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  };

  return (
    <>
      <Navbar />

      <main className="checkout-page page-shell">
        <div className="container">
          <header className="checkout-hero">
            <div>
              <span className="checkout-kicker">BiteBridge checkout</span>
              <h1>Complete your order</h1>
              <p>Premium delivery details, secure payment, and one final review before we send it your way.</p>
            </div>
          </header>

          {cartItems.length === 0 ? (
            <section className="checkout-empty-state">
              <h2>Your checkout is empty</h2>
              <p>Add something delicious first, then come back to finish the order.</p>
              <Button variant="primary" size="large" onClick={() => navigate('/restaurants')}>
                Explore Restaurants <ArrowRight size={18} />
              </Button>
            </section>
          ) : (
            <>
              <div className="checkout-progress">
                {stepItems.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isComplete = currentStep > step.id;

                  return (
                    <div
                      key={step.id}
                      className={`checkout-progress-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                    >
                      <div className="checkout-progress-node">
                        {isComplete ? <CheckCircle2 size={18} /> : <span>{step.id}</span>}
                      </div>
                      <div className="checkout-progress-copy">
                        <strong>{step.label}</strong>
                        <span>{step.id === 1 ? 'Address details' : step.id === 2 ? 'Payment mode' : 'Final check'}</span>
                      </div>
                      {index < stepItems.length - 1 && <div className="checkout-progress-line" />}
                    </div>
                  );
                })}
              </div>

              <section className="checkout-layout">
                <div className="checkout-main-card">
                  <AnimatePresence mode="wait" initial={false}>
                    {renderStepContent()}
                  </AnimatePresence>

                  <div className="checkout-navigation">
                    <Button
                      variant="ghost"
                      size="large"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft size={18} /> Back
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        variant="primary"
                        size="large"
                        onClick={handleNextStep}
                        disabled={!canProceed}
                      >
                        Continue <ArrowRight size={18} />
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="large"
                        onClick={handlePlaceOrder}
                        disabled={!canProceed || placingOrder}
                      >
                        {placingOrder ? 'Placing Order...' : 'Confirm Order'} <ArrowRight size={18} />
                      </Button>
                    )}
                  </div>

                  {checkoutError && (
                    <p className="checkout-inline-error" role="alert">{checkoutError}</p>
                  )}
                </div>

                <aside className="checkout-summary-card">
                  <div className="checkout-summary-header">
                    <span className="checkout-kicker">Summary</span>
                    <h2>Your total</h2>
                  </div>

                  <div className="checkout-summary-items">
                    {cartItems.map((item) => (
                      <div key={item.id} className="checkout-summary-item">
                        <div>
                          <strong>{item.name}</strong>
                          <p>{item.quantity} item{item.quantity > 1 ? 's' : ''}</p>
                        </div>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-summary-breakdown">
                    <div className="checkout-summary-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="checkout-summary-row">
                      <span>Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="checkout-summary-row">
                      <span>Delivery fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                  </div>

                  <div className="checkout-summary-total">
                    <span>Total</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                </aside>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Checkout;
