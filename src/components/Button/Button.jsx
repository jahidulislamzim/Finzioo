import React from 'react';
import './Button.scss';

const Button = ({
  children,
  onClick,
  btnType = 'primary', // primary, info, success, warning, error, disabled, transfer
  type = 'button',
  icon,
  className = '',
  iconOnly = false,
  disabled = false,
  isToggled = false,
  toggleSwitch = false,
  loading = false,
  ariaLabel = 'Button',
}) => {
  const isDisabled = disabled || loading;

  // Toggle switch mode
  if (toggleSwitch) {
    return (
      <label className="toggle-switch-component" aria-label={ariaLabel}>
        <input
          type="checkbox"
          checked={isToggled}
          onChange={(e) => onClick?.(e.target.checked)}
          disabled={isDisabled}
        />
        <span className="slider round" aria-hidden="true"></span>
      </label>
    );
  }

  const buttonClasses = [
    'btn',
    `btn-${btnType}`,
    iconOnly && 'icon-only',
    // isDisabled && 'disabled',
    loading && 'loading-btn',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      // aria-busy={loading}
    >
      {loading ? (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
          <span className="spinner-arc"></span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
