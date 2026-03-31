import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Bell, User, LogOut, Home as HomeIcon, Store, HelpCircle } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ cartCount = 0, isAuthenticated = false, userName = 'User', userInitials = 'U' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const lastScrollY = useRef(0);
  const userMenuRef = useRef(null);

  // Headroom behavior - hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (isScrollingDown && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/restaurants', label: 'Restaurants', icon: Store },
    { to: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="navbar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <motion.nav
        className="navbar"
        initial={{ y: 0 }}
        animate={{ y: isHidden ? -80 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-emoji">🍔</span>
            <span className="logo-text">BiteBridge</span>
          </Link>

          {/* Desktop Navigation Pills */}
          <nav className="navbar-nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-pill ${isActive ? 'nav-pill-active' : ''}`
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="navbar-right">
            {/* Cart Icon */}
            <Link to="/cart" className="navbar-icon-btn navbar-cart-btn">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <motion.span
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Notification Bell */}
            <button className="navbar-icon-btn navbar-bell-btn">
              <Bell size={24} />
              {hasUnread && <span className="unread-dot" />}
            </button>

            {isAuthenticated ? (
              // Authenticated User Menu
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <motion.button
                  className="user-avatar"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {userInitials}
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="user-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="dropdown-header">
                        <div className="dropdown-user-avatar">{userInitials}</div>
                        <div>
                          <p className="dropdown-user-name">{userName}</p>
                          <p className="dropdown-user-email">user@example.com</p>
                        </div>
                      </div>

                      <div className="dropdown-divider" />

                      <Link to="/profile" className="dropdown-item">
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <Link to="/orders" className="dropdown-item">
                        <ShoppingCart size={18} />
                        <span>Orders</span>
                      </Link>
                      <Link to="/notifications" className="dropdown-item">
                        <Bell size={18} />
                        <span>Notifications</span>
                      </Link>

                      <div className="dropdown-divider" />

                      <button className="dropdown-item dropdown-logout">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Unauthenticated Auth Buttons
              <div className="auth-buttons-desktop">
                <Link to="/login" className="btn-signin">
                  Sign In
                </Link>
                <Link to="/register" className="btn-signup">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <motion.button
              className="navbar-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Mobile Nav Links */}
            <div className="mobile-nav-links">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Cart & Notifications */}
            <div className="mobile-shortcuts">
              <Link to="/cart" className="mobile-shortcut" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingCart size={20} />
                <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
              </Link>
              <Link to="/notifications" className="mobile-shortcut" onClick={() => setIsMobileMenuOpen(false)}>
                <Bell size={20} />
                <span>Notifications</span>
              </Link>
            </div>

            <div className="mobile-divider" />

            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="mobile-auth">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">{userInitials}</div>
                  <div>
                    <p className="mobile-user-name">{userName}</p>
                    <p className="mobile-user-email">user@example.com</p>
                  </div>
                </div>
                <Link to="/profile" className="mobile-auth-link">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link to="/orders" className="mobile-auth-link">
                  <ShoppingCart size={18} />
                  <span>My Orders</span>
                </Link>
                <button className="mobile-logout-btn">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="btn-mobile-signin">
                  Sign In
                </Link>
                <Link to="/register" className="btn-mobile-signup">
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
