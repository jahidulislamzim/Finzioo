import React, { useState, useRef, useEffect } from 'react';
import './Select.scss';

const Select = ({ options = [], value, onChange, placeholder = 'Select an option...', name, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange?.({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className={`custom-select ${isOpen ? 'open' : ''}`} ref={ref}>
      {/* Hidden real input for form validation */}
      {required && (
        <input
          type="text"
          required
          value={value || ''}
          onChange={() => {}}
          style={{ opacity: 0, position: 'absolute', pointerEvents: 'none', height: 0, width: 0 }}
          tabIndex={-1}
        />
      )}

      {/* Trigger */}
      <button
        type="button"
        className={`select-trigger ${!selectedOption ? 'placeholder' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="trigger-value">
          {selectedOption?.label || placeholder}
        </span>
        <span className={`trigger-chevron ${isOpen ? 'rotated' : ''}`}>
          <i className="fat fa-chevron-down"></i>
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="select-dropdown" role="listbox">
          <div className="dropdown-inner">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  type="button"
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <span className="option-label">{option.label}</span>
                  {isSelected && (
                    <span className="option-check">
                      <i className="fas fa-check"></i>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
