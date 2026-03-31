import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  AtSign,
  Earth,
  Globe,
  MapPin,
  Search,
  Star,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import restaurantService from '../services/restaurantService';
import './Home.css';

const cuisineChips = [
  { emoji: 'All', label: 'All' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🍔', label: 'Burgers' },
  { emoji: '🍣', label: 'Sushi' },
  { emoji: '🥗', label: 'Healthy' },
  { emoji: '🍛', label: 'Indian' },
  { emoji: '🍜', label: 'Asian' },
  { emoji: '🍰', label: 'Desserts' },
];

const fallbackRestaurants = [
  {
    id: 'feature-1',
    name: 'Amber Oven',
    cuisines: ['Pizza', 'Italian', 'Wood Fired'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    deliveryFee: 30,
    deliveryTime: 24,
    isOpen: true,
  },
  {
    id: 'feature-2',
    name: 'Crimson Bowl',
    cuisines: ['Sushi', 'Asian', 'Japanese'],
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    deliveryFee: 0,
    deliveryTime: 28,
    isOpen: true,
  },
  {
    id: 'feature-3',
    name: 'Velvet Burger Club',
    cuisines: ['Burgers', 'Fast Food', 'American'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    deliveryFee: 40,
    deliveryTime: 20,
    isOpen: true,
  },
  {
    id: 'feature-4',
    name: 'Saffron Story',
    cuisines: ['Indian', 'Biryani', 'North Indian'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    deliveryFee: 25,
    deliveryTime: 32,
    isOpen: true,
  },
  {
    id: 'feature-5',
    name: 'Matcha Moon',
    cuisines: ['Desserts', 'Cafe', 'Beverages'],
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    deliveryFee: 20,
    deliveryTime: 18,
    isOpen: false,
  },
  {
    id: 'feature-6',
    name: 'Green Table',
    cuisines: ['Healthy', 'Salads', 'Bowls'],
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    deliveryFee: 0,
    deliveryTime: 22,
    isOpen: true,
  },
];

const quickLinks = [
  { label: 'Restaurants', to: '/restaurants' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
  { label: 'Track Order', to: '/order/ORD-2024-001234' },
];

const helpLinks = [
  { label: 'Help Center', to: '/help' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

function normalizeRestaurant(restaurant, index = 0) {
  return {
    id: restaurant.id || restaurant._id || `restaurant-${index}`,
    name: restaurant.name || 'BiteBridge Restaurant',
    cuisines: restaurant.cuisineTypes || restaurant.cuisines || ['Food'],
    image:
      restaurant.coverImageUrl ||
      restaurant.image ||
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    rating: restaurant.rating || 4.6,
    deliveryFee: restaurant.deliveryFee ?? 30,
    deliveryTime: restaurant.deliveryTime || 25 + (index % 4) * 5,
    isOpen: restaurant.isOpen ?? true,
  };
}

function RestaurantSkeleton() {
  return (
    <div className="home-restaurant-skeleton">
      <div className="home-skeleton-media shimmer" />
      <div className="home-skeleton-line shimmer" />
      <div className="home-skeleton-line short shimmer" />
      <div className="home-skeleton-tags">
        <span className="home-skeleton-chip shimmer" />
        <span className="home-skeleton-chip shimmer" />
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        if (!isMounted) return;

        const normalized = (data || []).map((restaurant, index) => normalizeRestaurant(restaurant, index));
        setFeaturedRestaurants(normalized.length > 0 ? normalized.slice(0, 6) : fallbackRestaurants);
      } catch (error) {
        if (isMounted) {
          setFeaturedRestaurants(fallbackRestaurants);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleRestaurants = useMemo(() => {
    if (activeCuisine === 'All') return featuredRestaurants;
    return featuredRestaurants.filter((restaurant) =>
      (restaurant.cuisines || []).some((cuisine) =>
        cuisine.toLowerCase().includes(activeCuisine.toLowerCase())
      )
    );
  }, [activeCuisine, featuredRestaurants]);

  const handleHeroSearch = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(trimmedQuery ? `/restaurants?search=${encodeURIComponent(trimmedQuery)}` : '/restaurants');
  };

  return (
    <>
      <Navbar />

      <main className="home-page">
        <section className="home-hero">
          <div className="home-hero-blob hero-blob-left" aria-hidden="true">
            <svg viewBox="0 0 400 400" role="presentation">
              <path d="M320.4 90.5c37.7 48.9 53.6 127.7 19 184.5-34.6 56.8-119.6 91.7-188.6 71.7S29.2 251.6 42 185.7C54.9 119.8 133.1 27 203.1 21.9c70.1-5.2 79.6 19.7 117.3 68.6Z" />
            </svg>
          </div>
          <div className="home-hero-blob hero-blob-right" aria-hidden="true">
            <svg viewBox="0 0 400 400" role="presentation">
              <path d="M338.4 218.3c-23.8 78.2-135 136.7-221.5 101.5C30.4 284.6-31.3 155.7 18.7 81.5 68.6 7.4 230.2-12 309 43.1c78.7 55.2 53.1 96.9 29.4 175.2Z" />
            </svg>
          </div>

          <div className="container home-hero-inner">
            <motion.div className="home-hero-copy" {...fadeInUp}>
              <span className="home-kicker">Luxury delivery with BiteBridge</span>
              <h1>Order food you love 🍕</h1>
              <p>
                Discover premium restaurants, beautifully presented menus, and the kind of delivery experience
                that feels effortless from the first search to the final bite.
              </p>

              <Link to="/restaurants" className="home-hero-cta-link">
                <Button variant="primary" size="large" className="home-hero-cta">
                  Explore Restaurants <ArrowRight size={18} />
                </Button>
              </Link>
            </motion.div>

            <motion.div className="home-hero-visual" {...fadeInUp}>
              <div className="home-hero-photo">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
                  alt="BiteBridge featured dishes"
                />
              </div>

              <motion.div
                className="home-floating-card rating-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Star size={16} fill="currentColor" />
                <span>4.8 rating</span>
              </motion.div>

              <motion.div
                className="home-floating-card delivery-card"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              >
                <span className="home-floating-emoji" aria-hidden="true">🚀</span>
                <span>25 min delivery</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.section className="home-search-section" {...fadeInUp}>
          <div className="container">
            <form className="home-search-card" onSubmit={handleHeroSearch}>
              <div className="home-search-location">
                <MapPin size={18} />
                <span>Mumbai</span>
              </div>
              <div className="home-search-divider" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search restaurants, cuisines..."
                className="home-search-input"
              />
              <button type="submit" className="home-search-button" aria-label="Search restaurants">
                <Search size={18} />
              </button>
            </form>
          </div>
        </motion.section>

        <motion.section className="home-cuisine-section" {...fadeInUp}>
          <div className="container">
            <div className="home-cuisine-scroll" role="list" aria-label="Cuisine quick filters">
              {cuisineChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className={`home-cuisine-chip ${activeCuisine === chip.label ? 'active' : ''}`}
                  onClick={() => setActiveCuisine(chip.label)}
                >
                  <span>{chip.emoji}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="home-featured-section" {...fadeInUp}>
          <div className="container">
            <div className="home-section-header">
              <div>
                <span className="home-section-label">Featured restaurants</span>
                <h2>Top picks around you</h2>
              </div>
              <Link to="/restaurants" className="home-section-link">
                <span>View All</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="home-restaurant-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <RestaurantSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : (
              <div className="home-restaurant-grid">
                {visibleRestaurants.slice(0, 6).map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <RestaurantCard
                      name={restaurant.name}
                      cuisines={restaurant.cuisines}
                      image={restaurant.image}
                      rating={restaurant.rating}
                      deliveryFee={restaurant.deliveryFee}
                      deliveryTime={restaurant.deliveryTime}
                      isOpen={restaurant.isOpen}
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="home-featured-cta">
              <Link to="/restaurants">
                <Button variant="primary" size="large">
                  Browse All Restaurants
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

        <footer className="home-footer">
          <div className="container home-footer-grid">
            <div className="home-footer-brand">
              <div className="home-footer-logo">🍔 BiteBridge</div>
              <p>Luxury delivery for the restaurants, cuisines, and comfort meals you keep coming back to.</p>
              <div className="home-footer-socials">
                <a href="#" aria-label="Email BiteBridge">
                  <AtSign size={18} />
                </a>
                <a href="#" aria-label="Visit BiteBridge online">
                  <Globe size={18} />
                </a>
                <a href="#" aria-label="BiteBridge community">
                  <Earth size={18} />
                </a>
              </div>
            </div>

            <div className="home-footer-links">
              <h3>Quick Links</h3>
              <div>
                {quickLinks.map((link) => (
                  <Link key={link.label} to={link.to}>
                    <span>{link.label}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="home-footer-links">
              <h3>Help & Contact</h3>
              <div>
                {helpLinks.map((link) => (
                  link.to ? (
                    <Link key={link.label} to={link.to}>
                      <span>{link.label}</span>
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href}>
                      <span>{link.label}</span>
                      <ArrowRight size={14} />
                    </a>
                  )
                ))}
              </div>
              <div className="home-footer-contact">
                <p>support@bitebridge.com</p>
                <p>+91 98765 43210</p>
                <p>Mumbai, India</p>
              </div>
            </div>
          </div>

          <div className="container home-footer-bottom">
            <p>© 2026 BiteBridge. All rights reserved.</p>
            <div>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export default Home;
