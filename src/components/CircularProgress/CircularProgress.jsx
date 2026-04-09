import React from 'react';
import './CircularProgress.scss';

const CircularProgress = ({ percentage }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  // Clamp the percentage to a max of 100 for the progress bar calculation
  const clampedPercentage = Math.min(percentage, 100);
  const offset = circumference - (clampedPercentage / 100) * circumference;

  const isExceeded = percentage >= 100;

  return (
    <div className="circular-progress-container">
      <svg className="circular-progress" width="100" height="100">
        <circle
          className="circular-progress-background"
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className={`circular-progress-bar ${isExceeded ? 'exceeded' : ''}`}
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="circular-progress-text">
        <span className={`percentage ${isExceeded ? 'exceeded' : ''}`}>
          {`${Math.round(percentage)}%`}
        </span>
        <span className="progress-label">Progress</span>
      </div>
    </div>
  );
};

export default CircularProgress;