import React from 'react';
import './Loader.scss';

const Loader = ({ fullScreen = true }) => {
  return (
    <div className={`money-loader-container ${fullScreen ? 'full-screen' : 'contained'}`}>
      <div className="loader-content">
        <div className="saving-animation">
          <div className="vault-icon">
            <i className="fad fa-vault"></i>
          </div>
          <div className="coin-wrapper">
            <i className="fad fa-coins dropping-coin"></i>
          </div>
          <div className="pulse-glow"></div>
        </div>
        <div className="loader-text-wrapper">
          <p className="loader-text">Securing your finances</p>
          <span className="dot-flashing"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
