import React from 'react';
import './SummaryCard.scss';

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="summary-card">
      <div className="card-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
