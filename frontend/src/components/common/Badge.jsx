import React from 'react';
import './Badge.css';

/**
 * Badge / Pill Component
 * Variants: pink, green, orange, red, gray
 */
export const Badge = ({
  children,
  variant = 'pink',
  icon: Icon,
  className = '',
  ...props
}) => {
  const variantMap = {
    primary: 'pink',
    secondary: 'gray',
    success: 'green',
    warning: 'orange',
    danger: 'red',
    error: 'red',
    info: 'blue',
  };
  const resolvedVariant = variantMap[variant] || variant;

  return (
    <span className={`badge badge-${resolvedVariant} ${className}`} {...props}>
      {Icon && <Icon size={14} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
