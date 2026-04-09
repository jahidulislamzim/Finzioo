import React, { useState, useEffect, useRef } from 'react';
import './Header.scss';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="search-bar">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search transactions, cards, etc..." />
      </div>
      <div className="user-info">
        <div className="icon-container">
          <i className="fas fa-bell icon"></i>
          <span className="icon-label">Notifications</span>
        </div>
        <div className="profile" ref={dropdownRef}>
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Rara Avis" onClick={toggleDropdown} />
            <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
              <div className="dropdown-header">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Rara Avis" />
                <div className="user-details">
                  <span>Rara Avis</span>
                  <span className="username">@raraavis</span>
                </div>
              </div>
              <ul className="dropdown-list">
                <li className="dropdown-item">
                  <i className="fas fa-user dropdown-icon"></i>
                  <span>View Profile</span>
                </li>
                 <li className="dropdown-item">
                  <i className="fas fa-cog dropdown-icon"></i>
                  <span>Settings</span>
                </li>
                <li className="dropdown-item logout">
                  <i className="fas fa-sign-out-alt dropdown-icon"></i>
                  <span>Logout</span>
                </li>
              </ul>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
