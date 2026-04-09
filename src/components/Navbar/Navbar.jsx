import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.scss';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <NavLink to="/">
            <i className="fat fa-sparkles logo-icon"></i>
            <span>Finzio</span>
          </NavLink>
        </div>

        <div className="navbar-right">
          <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
            <li><NavLink to="/" end onClick={() => setIsMenuOpen(false)}><i className="fat fa-grid-2"></i> Dashboard</NavLink></li>
            <li><NavLink to="/accounts" onClick={() => setIsMenuOpen(false)}><i className="fat fa-wallet"></i> Accounts</NavLink></li>
            <li><NavLink to="/transactions" onClick={() => setIsMenuOpen(false)}><i className="fat fa-receipt"></i> Transactions</NavLink></li>
            <li><NavLink to="/budgets" onClick={() => setIsMenuOpen(false)}><i className="fat fa-chart-pie"></i> Budgets</NavLink></li>
            <li><NavLink to="/categories" onClick={() => setIsMenuOpen(false)}><i className="fat fa-tags"></i> Categories</NavLink></li>
            <li><NavLink to="/loans" onClick={() => setIsMenuOpen(false)}><i className="fat fa-hand-holding-dollar"></i> Loans</NavLink></li>
            <li><NavLink to="/profile" onClick={() => setIsMenuOpen(false)}><i className="fat fa-user-robot"></i> Profile</NavLink></li>
          </ul>

          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <i className={`fat ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
            <div className="navbar-hamburger" onClick={toggleMenu}>
              <span className={isMenuOpen ? 'active' : ''} />
              <span className={isMenuOpen ? 'active' : ''} />
              <span className={isMenuOpen ? 'active' : ''} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;