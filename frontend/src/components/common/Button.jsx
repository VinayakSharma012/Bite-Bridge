import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

/**
 * Button Component
 * Variants: primary, secondary, ghost, danger
 * Sizes: sm, md, lg, xl
 * States: loading, disabled
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const sizeMap = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  };
  const resolvedSize = sizeMap[size] || size;
  const buttonClass = `btn btn-${variant} btn-${resolvedSize} ${fullWidth ? 'btn-full' : ''} ${disabled ? 'btn-disabled' : ''} ${className}`;

  return (
    <motion.button
      ref={ref}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
  whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner">
          <span className="spinner" />
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
