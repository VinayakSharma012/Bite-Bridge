import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load pages to improve performance
const Profile = React.lazy(() => import('./pages/Profile'));
const OrderTracking = React.lazy(() => import('./pages/OrderTracking'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const HelpSupport = React.lazy(() => import('./pages/HelpSupport'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ManageOrders = React.lazy(() => import('./pages/admin/ManageOrders'));
const ManageRestaurants = React.lazy(() => import('./pages/admin/ManageRestaurants'));
const ManageUsers = React.lazy(() => import('./pages/admin/ManageUsers'));
const ManageCoupons = React.lazy(() => import('./pages/admin/ManageCoupons'));
const Analytics = React.lazy(() => import('./pages/admin/Analytics'));

function LoadingFallback() {
  return (
    <div className="app-loading-shell">
      <div className="app-loading-card">
        <h2>Preparing your BiteBridge experience</h2>
        <p>Loading the next view with the new luxury design system.</p>
        <div className="app-loading-bar" />
      </div>
    </div>
  );
}

function AnimatedAppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Profile />
            </React.Suspense>
          } />
          <Route path="/order/:id" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <OrderTracking />
            </React.Suspense>
          } />
          <Route path="/notifications" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Notifications />
            </React.Suspense>
          } />
          <Route path="/help" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <HelpSupport />
            </React.Suspense>
          } />
          <Route path="/admin/dashboard" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <AdminDashboard />
            </React.Suspense>
          } />
          <Route path="/admin/orders" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <ManageOrders />
            </React.Suspense>
          } />
          <Route path="/admin/restaurants" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <ManageRestaurants />
            </React.Suspense>
          } />
          <Route path="/admin/users" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <ManageUsers />
            </React.Suspense>
          } />
          <Route path="/admin/coupons" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <ManageCoupons />
            </React.Suspense>
          } />
          <Route path="/admin/analytics" element={
            <React.Suspense fallback={<LoadingFallback />}>
              <Analytics />
            </React.Suspense>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div id="main-content" tabIndex={-1}>
        <AnimatedAppRoutes />
      </div>
    </Router>
  );
}

export default App;
