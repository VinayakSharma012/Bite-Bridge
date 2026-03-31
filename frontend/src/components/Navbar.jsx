import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Store,
  Truck,
  User,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import '../styles/components/Navbar.css';

const desktopLinks = [
  { to: '/', label: 'Home' },
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/help', label: 'Help' },
];

function getInitials(name) {
  if (!name) return 'U';

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  const lastScrollY = useRef(0);
  const previousCartCount = useRef(0);
  const userMenuRef = useRef(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const userInitials = getInitials(user?.name);
  const hasUnread = isAuthenticated;

  const isNavActive = (to) => {
    if (to === '/') return location.pathname === '/';
    if (to === '/restaurants') return location.pathname === '/restaurants' || location.pathname.startsWith('/restaurant/');
    return location.pathname === to;
  };

  const mobileLinks = useMemo(() => {
    const links = [
      { to: '/', label: 'Home', icon: Home },
      { to: '/restaurants', label: 'Restaurants', icon: Store },
      { to: '/help', label: 'Help', icon: HelpCircle },
    ];

    if (isAuthenticated) {
      links.push(
        { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount > 0 ? String(cartCount) : '' },
        { to: '/notifications', label: 'Notifications', icon: Bell, dot: hasUnread },
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/order/ORD-2024-001234', label: 'Track Order', icon: Truck }
      );

      if (user?.role === 'ADMIN') {
        links.push({ to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard });
      }
    }

    return links;
  }, [cartCount, hasUnread, isAuthenticated, user?.role]);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (isDrawerOpen || currentScrollY <= 16) {
        setIsHidden(false);
      } else if (delta > 8) {
        setIsHidden(true);
      } else if (delta < -8) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDrawerOpen]);

  useEffect(() => {
    if (cartCount > previousCartCount.current) {
      setCartBounce(true);
      const timeoutId = window.setTimeout(() => setCartBounce(false), 550);
      previousCartCount.current = cartCount;
      return () => window.clearTimeout(timeoutId);
    }

    previousCartCount.current = cartCount;
    return undefined;
  }, [cartCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDrawerOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`navbar ${isHidden ? 'navbar-hidden' : ''}`}
        initial={false}
        animate={{ y: isHidden ? -80 : 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" aria-label="BiteBridge home">
            <span className="navbar-logo-emoji" aria-hidden="true">🍔</span>
            <span className="navbar-brand-text">BiteBridge</span>
          </Link>

          <div className="navbar-center">
            <div className="navbar-nav-pills">
              {desktopLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={() => `navbar-pill ${isNavActive(link.to) ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="navbar-right">
            {!isAuthenticated ? (
              <div className="navbar-auth-actions">
                <Link to="/login" className="navbar-auth-btn navbar-auth-signin">
                  Sign In
                </Link>
                <Link to="/register" className="navbar-auth-btn navbar-auth-signup">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="navbar-user-actions">
                <Link to="/cart" className="navbar-icon-button" aria-label="Cart">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className={`navbar-cart-badge ${cartBounce ? 'bounce' : ''}`}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                <Link to="/notifications" className="navbar-icon-button" aria-label="Notifications">
                  <Bell size={20} />
                  {hasUnread && <span className="navbar-unread-dot" />}
                </Link>

                <div className="navbar-user-menu" ref={userMenuRef}>
                  <button
                    type="button"
                    className="navbar-avatar-button"
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    aria-expanded={isUserMenuOpen}
                    aria-label="Open account menu"
                  >
                    <span className="navbar-avatar">{userInitials}</span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        className="navbar-dropdown"
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                      >
                        <div className="navbar-dropdown-header">
                          <span className="navbar-dropdown-avatar">{userInitials}</span>
                          <div>
                            <p className="navbar-dropdown-name">{user?.name || 'BiteBridge User'}</p>
                            <p className="navbar-dropdown-email">{user?.email || 'user@example.com'}</p>
                          </div>
                        </div>

                        <div className="navbar-dropdown-divider" />

                        <Link to="/profile" className="navbar-dropdown-link">
                          <User size={16} />
                          <span>Profile</span>
                        </Link>
                        <Link to="/notifications" className="navbar-dropdown-link">
                          <Bell size={16} />
                          <span>Notifications</span>
                        </Link>
                        <Link to="/order/ORD-2024-001234" className="navbar-dropdown-link">
                          <Truck size={16} />
                          <span>Track Order</span>
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link to="/admin/dashboard" className="navbar-dropdown-link">
                            <LayoutDashboard size={16} />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="navbar-dropdown-divider" />

                        <button type="button" className="navbar-dropdown-link navbar-dropdown-signout" onClick={handleLogout}>
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <button
              type="button"
              className={`navbar-hamburger ${isDrawerOpen ? 'is-open' : ''}`}
              onClick={() => setIsDrawerOpen((open) => !open)}
              aria-label={isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isDrawerOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.button
              type="button"
              className="navbar-drawer-backdrop"
              aria-label="Close mobile menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => setIsDrawerOpen(false)}
            />

            <motion.aside
              className="navbar-drawer"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="navbar-drawer-header">
                <div>
                  <span className="navbar-drawer-kicker">BiteBridge</span>
                  <h3>Navigate the app</h3>
                </div>
                <button
                  type="button"
                  className="navbar-drawer-close"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <span />
                  <span />
                </button>
              </div>

              {isAuthenticated && (
                <div className="navbar-drawer-user-card">
                  <span className="navbar-drawer-user-avatar">{userInitials}</span>
                  <div>
                    <p>{user?.name || 'BiteBridge User'}</p>
                    <span>{user?.email || 'user@example.com'}</span>
                  </div>
                </div>
              )}

              <div className="navbar-drawer-links">
                {mobileLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={`${link.to}-${link.label}`}
                      to={link.to}
                      className="navbar-drawer-link"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <span className="navbar-drawer-link-icon">
                        <Icon size={18} />
                      </span>
                      <span>{link.label}</span>
                      {link.badge && <span className="navbar-drawer-badge">{link.badge}</span>}
                      {link.dot && <span className="navbar-drawer-dot" />}
                    </Link>
                  );
                })}
              </div>

              <div className="navbar-drawer-footer">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="navbar-drawer-auth navbar-drawer-auth-ghost" onClick={() => setIsDrawerOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/register" className="navbar-drawer-auth navbar-drawer-auth-primary" onClick={() => setIsDrawerOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button type="button" className="navbar-drawer-signout" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
