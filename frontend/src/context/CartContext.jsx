import React, { createContext, useState, useCallback, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCoupon(null);
    setDiscountAmount(0);
  }, []);

  const applyCoupon = useCallback((couponData, subtotal) => {
    setCoupon(couponData);
    
    let discount = 0;
    if (couponData.discountType === 'PERCENTAGE') {
      discount = (subtotal * couponData.discount) / 100;
      if (couponData.maxDiscount) {
        discount = Math.min(discount, couponData.maxDiscount);
      }
    } else {
      discount = couponData.discount;
    }
    
    setDiscountAmount(discount);
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setDiscountAmount(0);
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 30; // Default delivery fee
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax - discountAmount;

  const value = {
    cartItems,
    coupon,
    discountAmount,
    subtotal,
    deliveryFee,
    tax,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
