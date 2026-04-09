import React, { useEffect, useState } from 'react';
import './Alert.scss';

let addAlert;

export const pushAlert = (options) => {
  if (addAlert) addAlert(options);
};

const AlertContainer = () => {
  const [alert, setAlert] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    addAlert = (options) => {
      setAlert(options);
      setIsClosing(false);
    };
  }, []);

  const handleClose = (result) => {
    setIsClosing(true);
    setTimeout(() => {
      setAlert(null);
      if (alert && alert.resolve) {
        alert.resolve(result);
      }
    }, 700); // Animation duration
  };

  const handleConfirm = () => {
    handleClose({ isConfirmed: true });
  };

  const handleCancel = () => {
    handleClose({ isDismissed: true });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose({ isDismissed: true });
    }
  };

  if (!alert) {
    return null;
  }

  const hasConfirm = alert.showConfirmButton !== false;
  const hasCancel = alert.showCancelButton === true;

  const getIconClass = (icon) => {
    switch (icon) {
      case 'error':
        return 'fas fa-times-circle';
      case 'success':
        return 'fas fa-check-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return null;
    }
  };

  const iconClass = getIconClass(alert.icon);

  const alertStyles = {
    '--confirm-button-color': alert.confirmButtonColor,
    '--cancel-button-color': alert.cancelButtonColor,
  };

  return (
    <div className={`alert-overlay ${isClosing ? 'closing' : ''}`} onClick={handleOverlayClick}>
      <div className="alert" style={alertStyles} onClick={(e) => e.stopPropagation()}>
        {iconClass && <div className={`alert-icon ${alert.icon}`}><i className={iconClass}></i></div>}
        {alert.title && <div className="alert-title">{alert.title}</div>}
        <div className="alert-text">{alert.text}</div>
        <div className="alert-actions">
          {hasConfirm && (
            <button onClick={handleConfirm} className="alert-button confirm">
              {alert.confirmButtonText || 'OK'}
            </button>
          )}
          {hasCancel && (
            <button onClick={handleCancel} className="alert-button cancel">
              {alert.cancelButtonText || 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertContainer;
