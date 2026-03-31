import React from 'react';
import './Input.css';

/**
 * Input Component
 * With icon support, error states, and focus handling
 */
export const Input = React.forwardRef(({
  id,
  name,
  label,
  placeholder,
  icon: Icon,
  error,
  errorMessage,
  value,
  onChange,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const inputId = id || name || `input-${Math.random().toString(36).slice(2, 8)}`;
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={`input-wrapper ${label ? 'input-floating' : ''} ${hasValue ? 'input-has-value' : ''}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className={`input-container ${error ? 'input-error' : ''}`}>
        {Icon && (
          <div className="input-icon">
            <Icon size={18} />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`input-field ${Icon ? 'input-with-icon' : ''} ${className}`}
          {...props}
        />
      </div>
      {errorMessage && (
        <div className="input-error-msg">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
