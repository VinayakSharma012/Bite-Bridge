import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Store, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Button from '../components/common/Button';
import restaurantService from '../services/restaurantService';
import './Restaurants.css';

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

function RestaurantCardSkeleton() {
  return (
    <div className="restaurants-skeleton-card">
      <div className="restaurants-skeleton-image shimmer" />
      <div className="restaurants-skeleton-line shimmer" />
      <div className="restaurants-skeleton-line short shimmer" />
      <div className="restaurants-skeleton-tags">
        <span className="restaurants-skeleton-chip shimmer" />
        <span className="restaurants-skeleton-chip shimmer" />
      </div>
    </div>
  );
}

function Restaurants() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        if (!isMounted) return;
        setRestaurants((data || []).map((restaurant, index) => normalizeRestaurant(restaurant, index)));
      } catch (error) {
        if (isMounted) {
          setRestaurants([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, sortBy, activeCuisine, ratingFilter, deliveryFilter]);

  const cuisineOptions = useMemo(() => {
    const derived = [...new Set(restaurants.flatMap((restaurant) => restaurant.cuisines || []))].slice(0, 6);
    return ['All', ...derived];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    let results = restaurants.filter((restaurant) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        (restaurant.cuisines || []).some((cuisine) => cuisine.toLowerCase().includes(normalizedQuery));

      const matchesCuisine =
        activeCuisine === 'All' ||
        (restaurant.cuisines || []).some((cuisine) => cuisine.toLowerCase().includes(activeCuisine.toLowerCase()));

      const matchesRating =
        ratingFilter === 'All' ||
        (ratingFilter === '4.0+' && restaurant.rating >= 4.0) ||
        (ratingFilter === '4.5+' && restaurant.rating >= 4.5);

      const matchesDelivery =
        deliveryFilter === 'All' ||
        (deliveryFilter === 'Under 30' && restaurant.deliveryTime <= 30) ||
        (deliveryFilter === 'Under 45' && restaurant.deliveryTime <= 45);

      return matchesSearch && matchesCuisine && matchesRating && matchesDelivery;
    });

    results = results.slice();

    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'delivery') {
      results.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'fee') {
      results.sort((a, b) => a.deliveryFee - b.deliveryFee);
    } else if (sortBy === 'alphabetical') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [activeCuisine, deliveryFilter, ratingFilter, restaurants, searchQuery, sortBy]);

  const appliedFilters = [
    searchQuery ? { key: 'search', label: `Search: ${searchQuery}`, clear: () => setSearchQuery('') } : null,
    activeCuisine !== 'All' ? { key: 'cuisine', label: activeCuisine, clear: () => setActiveCuisine('All') } : null,
    ratingFilter !== 'All' ? { key: 'rating', label: ratingFilter, clear: () => setRatingFilter('All') } : null,
    deliveryFilter !== 'All' ? { key: 'delivery', label: deliveryFilter, clear: () => setDeliveryFilter('All') } : null,
  ].filter(Boolean);

  const displayedRestaurants = filteredRestaurants.slice(0, visibleCount);

  return (
    <>
      <Navbar />

      <main className="restaurants-page page-shell">
        <div className="container restaurants-shell">
          <header className="restaurants-hero">
            <span className="restaurants-hero-kicker">Discover</span>
            <h1>Restaurants for every craving</h1>
            <p>Search, filter, and sort your way through the best dining options near you.</p>
          </header>

          <section className="restaurants-toolbar">
            <div className="restaurants-toolbar-top">
              <div className="restaurants-search">
                <Search size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search restaurants, cuisines..."
                />
              </div>

              <div className="restaurants-sort">
                <span>Sort by</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="rating">Top rated</option>
                  <option value="delivery">Delivery time</option>
                  <option value="fee">Delivery fee</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>

            <div className="restaurants-filter-groups">
              <div className="restaurants-filter-block">
                <div className="restaurants-filter-label">
                  <SlidersHorizontal size={16} />
                  <span>Cuisine</span>
                </div>
                <div className="restaurants-chip-row">
                  {cuisineOptions.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      className={`restaurants-chip ${activeCuisine === cuisine ? 'active' : ''}`}
                      onClick={() => setActiveCuisine(cuisine)}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              <div className="restaurants-filter-block">
                <div className="restaurants-filter-label">
                  <span>Rating</span>
                </div>
                <div className="restaurants-chip-row compact">
                  {['All', '4.0+', '4.5+'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={`restaurants-chip ${ratingFilter === label ? 'active' : ''}`}
                      onClick={() => setRatingFilter(label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="restaurants-filter-block">
                <div className="restaurants-filter-label">
                  <span>Delivery time</span>
                </div>
                <div className="restaurants-chip-row compact">
                  {['All', 'Under 30', 'Under 45'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={`restaurants-chip ${deliveryFilter === label ? 'active' : ''}`}
                      onClick={() => setDeliveryFilter(label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {appliedFilters.length > 0 && (
              <div className="restaurants-applied">
                {appliedFilters.map((filter) => (
                  <button key={filter.key} type="button" className="restaurants-applied-tag" onClick={filter.clear}>
                    <span>{filter.label}</span>
                    <X size={14} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <div className="restaurants-results">
            <p>Showing {loading ? 0 : filteredRestaurants.length} restaurants</p>
          </div>

          {loading ? (
            <div className="restaurants-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <RestaurantCardSkeleton key={`restaurant-skeleton-${index}`} />
              ))}
            </div>
          ) : displayedRestaurants.length > 0 ? (
            <>
              <motion.div className="restaurants-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {displayedRestaurants.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
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
              </motion.div>

              {visibleCount < filteredRestaurants.length && (
                <div className="restaurants-load-more">
                  <Button variant="primary" size="large" onClick={() => setVisibleCount((count) => count + 6)}>
                    Load More Restaurants
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="restaurants-empty-state">
              <div className="restaurants-empty-illustration">
                <Store size={44} />
              </div>
              <h2>No restaurants found</h2>
              <p>Try clearing some filters or searching for a different cuisine.</p>
              <Button
                variant="secondary"
                size="large"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCuisine('All');
                  setRatingFilter('All');
                  setDeliveryFilter('All');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Restaurants;
