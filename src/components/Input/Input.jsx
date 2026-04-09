import React, { useState } from 'react';
import Select from '../Select/Select';
import './Input.scss';

const Input = ({ label, type = 'text', options, placeholder, className = '', ...props }) => {
  const [selectOpen, setSelectOpen] = useState(false);

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            required
            className="input"
            placeholder={placeholder || 'Enter text...'}
            {...props}
          ></textarea>
        );
      case 'date':
        return (
          <input
            required
            type={props.value ? 'date' : 'text'}
            placeholder={placeholder || 'Select a date'}
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.type = 'text';
              }
            }}
            className="input"
            {...props}
          />
        );
      case 'number': {
        const { onChange } = props;
        const handleNumberChange = (e) => {
          let sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');
          const parts = sanitizedValue.split('.');
          if (parts.length > 2) {
            sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
          }
          e.target.value = sanitizedValue;
          if (onChange) {
            onChange(e);
          }
        };
        return (
          <input
            required
            type="text"
            inputMode="decimal"
            className="input"
            placeholder={placeholder || 'Enter a number'}
            {...props}
            onChange={handleNumberChange}
          />
        );
      }
      case 'select': {
        const { onChange, value, name, required: req } = props;
        return (
          <Select
            options={options}
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            required={req}
          />
        );
      }
      default:
        return (
          <input
            required
            type={type}
            className="input"
            placeholder={placeholder || `Enter ${label?.toLowerCase() || ''}`}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`input-group ${className}`}>
      <label className="label">{label}</label>
      {renderInput()}
    </div>
  );
};

export default Input;
