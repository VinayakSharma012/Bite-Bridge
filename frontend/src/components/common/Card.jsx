import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

/**
 * Card Component
 * Base container for content with shadow and hover effects
 */
export const Card = React.forwardRef(({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      whileHover={hoverable ? { y: -4 } : {}}
      whileTap={hoverable && onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;
