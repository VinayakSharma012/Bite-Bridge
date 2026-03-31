import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, Star, Truck } from 'lucide-react';
import Card from '../common/Card';
import './RestaurantCard.css';

export const RestaurantCard = ({
  name,
  cuisines,
  image,
  rating,
  deliveryFee,
  deliveryTime,
  isOpen = true,
  onClick,
}) => {
  const cuisineTags = (cuisines || []).slice(0, 3);

  return (
    <Card className="restaurant-card" onClick={onClick} hoverable>
      <div className="restaurant-card-media">
        <img
          src={image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
          alt={name}
          className="restaurant-card-image"
        />
        <span className={`restaurant-card-status ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="restaurant-card-body">
        <div className="restaurant-card-heading">
          <h3>{name}</h3>
          <div className="restaurant-card-rating">
            <Star size={14} fill="currentColor" />
            <span>{rating || '4.8'}</span>
          </div>
        </div>

        <div className="restaurant-card-tags">
          {cuisineTags.length > 0 ? (
            cuisineTags.map((cuisine) => (
              <span key={cuisine} className="restaurant-card-tag">
                {cuisine}
              </span>
            ))
          ) : (
            <span className="restaurant-card-tag">Multi-cuisine</span>
          )}
        </div>

        <div className="restaurant-card-meta">
          <span>
            <Clock3 size={14} />
            <strong>{deliveryTime || 25} mins</strong>
          </span>
          <span>
            <Truck size={14} />
            {deliveryFee === 0 ? 'Free delivery' : `₹${deliveryFee || 30} delivery`}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
