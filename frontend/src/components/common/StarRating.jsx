import React, { useMemo, useState } from 'react';
import './StarRating.css';

function Star({ fillPercent = 0, active, onMouseMove, onMouseLeave, onClick, interactive }) {
  return (
    <button
      type="button"
      className={`star-rating-star ${active ? 'active' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      disabled={!interactive}
      aria-label={interactive ? 'Rate star' : 'Star rating'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id={`star-fill-${fillPercent}`}>
            <stop offset={`${fillPercent}%`} stopColor="currentColor" />
            <stop offset={`${fillPercent}%`} stopColor="rgba(156,163,175,0.35)" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#star-fill-${fillPercent})`}
          d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.58l-5.9 3.1 1.12-6.57-4.78-4.66 6.6-.96L12 2.5z"
        />
      </svg>
    </button>
  );
}

export default function StarRating({ value = 0, onChange, interactive = false, max = 5, className = '' }) {
  const [hoverValue, setHoverValue] = useState(null);
  const displayValue = hoverValue ?? value;

  const stars = useMemo(() => {
    return Array.from({ length: max }, (_, index) => {
      const starNumber = index + 1;
      const fill = Math.min(Math.max(displayValue - index, 0), 1);
      return { starNumber, fillPercent: Math.round(fill * 100) };
    });
  }, [displayValue, max]);

  const handleMove = (event, starNumber) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    setHoverValue(isHalf ? starNumber - 0.5 : starNumber);
  };

  return (
    <div className={`star-rating ${className}`} role="img" aria-label={`Rating ${displayValue} out of ${max}`}>
      {stars.map((star) => (
        <Star
          key={star.starNumber}
          fillPercent={star.fillPercent}
          active={star.fillPercent > 0}
          interactive={interactive}
          onMouseMove={(event) => handleMove(event, star.starNumber)}
          onMouseLeave={() => interactive && setHoverValue(null)}
          onClick={() => interactive && onChange?.(hoverValue ?? star.starNumber)}
        />
      ))}
    </div>
  );
}
