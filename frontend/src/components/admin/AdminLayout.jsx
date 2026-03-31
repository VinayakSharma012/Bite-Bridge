import React, { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  Store,
  Users,
  TicketPercent,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import '../../styles/pages/admin/AdminLayout.css';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', path: '/admin/orders', icon: ReceiptText },
  { label: 'Restaurants', path: '/admin/restaurants', icon: Store },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

function AdminLayout({ title, subtitle, children, headerAction }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const activeItem = useMemo(
    () => navItems.find((item) => location.pathname.startsWith(item.path)) || navItems[0],
    [location.pathname]
  );

  return (
    <div className={`admin-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <span className="brand-emoji">🍔</span>
            {!collapsed && <span className="brand-name">BiteBridge</span>}
          </div>
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <button className="admin-mobile-toggle" type="button" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      <div className={`admin-mobile-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`admin-mobile-drawer ${mobileOpen ? 'show' : ''}`}>
        <div className="drawer-top">
          <div className="admin-brand">
            <span className="brand-emoji">🍔</span>
            <span className="brand-name">BiteBridge</span>
          </div>
          <button type="button" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="admin-mobile-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-breadcrumb">Admin / {activeItem.label}</p>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {headerAction && <div className="admin-page-action">{headerAction}</div>}
        </header>
        <section className="admin-main-content">{children}</section>
      </main>
    </div>
  );
}

export default AdminLayout;