import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import useAppContext from '../../hooks/useAppContext';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.scss';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'fa-grid-2', end: true },
  { to: '/accounts', label: 'Accounts', icon: 'fa-wallet' },
  { to: '/transactions', label: 'Transactions', icon: 'fa-receipt' },
  { to: '/budgets', label: 'Budgets', icon: 'fa-chart-pie' },
  { to: '/categories', label: 'Categories', icon: 'fa-tags' },
  { to: '/loans', label: 'Loans', icon: 'fa-hand-holding-dollar' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { settings } = useAppContext();
  const { logOut } = useAuth();

  // Sync collapsed state to body class — Layout.scss keys off this
  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [collapsed]);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Hamburger */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label="Toggle menu"
      >
        <i className={`fat ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <i className="fat fa-sparkles"></i>
          </div>
          {!collapsed && <span className="brand-name">Finzio</span>}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : ''}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">
                    <i className={`fat ${item.icon}`}></i>
                  </span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom">
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? 'Profile' : ''}
            onClick={handleNavClick}
          >
            <span className="nav-icon">
              <i className="fat fa-user-robot"></i>
            </span>
            {!collapsed && <span className="nav-label">Profile</span>}
          </NavLink>

          <button
            className="nav-item theme-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          >
            <span className="nav-icon">
              <i className={`fat ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </span>
            {!collapsed && (
              <span className="nav-label">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            )}
          </button>

          <button
            className="nav-item logout-btn"
            onClick={logOut}
            title={collapsed ? 'Log out' : ''}
          >
            <span className="nav-icon">
              <i className="fat fa-sign-out-alt"></i>
            </span>
            {!collapsed && <span className="nav-label">Log Out</span>}
          </button>


        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="footer-content">
              Designed & Built by Jahidul Islam Zim
              <br />
              &copy; {new Date().getFullYear()}, All rights reserved.
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
