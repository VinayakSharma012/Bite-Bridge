import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StarRating from '../components/common/StarRating';
import { useCart } from '../hooks/useCart';
import menuService from '../services/menuService';
import restaurantService from '../services/restaurantService';
import reviewService from '../services/reviewService';
import '../styles/pages/RestaurantDetail.css';

function getMenuItemId(item) {
  return item.id || item._id || item.name;
}

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    cartItems: sharedCartItems,
    addToCart,
    updateQuantity: updateCartItemQuantity,
    removeFromCart,
  } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState({});
  const [rating, setRating] = useState(null);
  const [flyingItems, setFlyingItems] = useState([]);
  const [cartPulse, setCartPulse] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!cartPulse) return undefined;

    const timeoutId = window.setTimeout(() => setCartPulse(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [cartPulse]);

  useEffect(() => {
    const nextCartItems = {};
    sharedCartItems.forEach((item) => {
      nextCartItems[item.id] = item.quantity;
    });
    setCartItems(nextCartItems);
  }, [sharedCartItems]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [restaurantData, menuData, reviewsData] = await Promise.all([
        restaurantService.getRestaurantById(id),
        menuService.getMenuByRestaurant(id),
        reviewService.getRestaurantReviews(id),
      ]);

      setRestaurant(restaurantData);
      setMenu(menuData);
      setReviews(reviewsData);

      if (reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setRating(avg.toFixed(1));
      }
    } catch (err) {
      setError('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const createFlyingItem = (event) => {
    if (!event?.currentTarget) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const itemId = `${Date.now()}-${Math.random()}`;

    setFlyingItems((items) => [
      ...items,
      {
        id: itemId,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
      },
    ]);
  };

  const removeFlyingItem = (itemId) => {
    setFlyingItems((items) => items.filter((item) => item.id !== itemId));
  };

  const handleAddToCart = (menuItem, event) => {
    const itemId = getMenuItemId(menuItem);
    const nextQuantity = (cartItems[itemId] || 0) + 1;

    setCartItems((items) => ({ ...items, [itemId]: nextQuantity }));
    createFlyingItem(event);
    setCartPulse(true);

    addToCart({
      id: itemId,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity: 1,
      restaurantId: id,
      restaurantName: restaurant?.name,
    });
  };

  const handleQuantityChange = (menuItem, delta, event) => {
    const itemId = getMenuItemId(menuItem);
    const nextQuantity = Math.max(0, (cartItems[itemId] || 0) + delta);

    if (delta > 0) {
      createFlyingItem(event);
      setCartPulse(true);
      addToCart({
        id: itemId,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        quantity: 1,
        restaurantId: id,
        restaurantName: restaurant?.name,
      });
      return;
    }

    if (nextQuantity === 0) {
      removeFromCart(itemId);
      return;
    }

    updateCartItemQuantity(itemId, nextQuantity);
  };

  const cuisineTags = restaurant?.cuisines || restaurant?.cuisineTypes || ['Curated menu'];
  const heroImage =
    restaurant?.coverImageUrl ||
    restaurant?.image ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80';
  const deliveryTime = restaurant?.deliveryTime || 30;
  const minOrder = restaurant?.minOrder || restaurant?.minOrderAmount || 199;

  const categories = useMemo(
    () => ['all', ...new Set(menu.map((item) => item.category || 'chef special'))],
    [menu]
  );

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'all') return menu;
    return menu.filter((item) => (item.category || 'chef special') === selectedCategory);
  }, [menu, selectedCategory]);

  const reviewDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => Math.round(review.rating) === stars).length;
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
      return { stars, count, percentage };
    });
  }, [reviews]);

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((total, quantity) => total + quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(() => {
    const priceMap = new Map(menu.map((item) => [getMenuItemId(item), item.price || 0]));
    return Object.entries(cartItems).reduce(
      (total, [itemId, quantity]) => total + (priceMap.get(itemId) || 0) * quantity,
      0
    );
  }, [cartItems, menu]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="restaurant-detail-page page-shell">
          <div className="container">
            <div className="restaurant-detail-state">Loading restaurant...</div>
          </div>
        </main>
      </>
    );
  }

  if (error || !restaurant) {
    return (
      <>
        <Navbar />
        <main className="restaurant-detail-page page-shell">
          <div className="container">
            <div className="restaurant-detail-state">{error || 'Restaurant not found'}</div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="restaurant-detail-page">
        <section
          className="restaurant-detail-hero"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(26, 26, 46, 0.12), rgba(26, 26, 46, 0.42)), url(${heroImage})` }}
        />

        <div className="container restaurant-detail-shell">
          <motion.section
            className="restaurant-detail-info-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="restaurant-detail-title-row">
              <div>
                <h1>{restaurant.name}</h1>
                <div className="restaurant-detail-cuisines">
                  {cuisineTags.map((cuisine) => (
                    <span key={cuisine} className="restaurant-detail-cuisine-chip">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>

              <div className="restaurant-detail-rating-badge">
                <Star size={16} fill="currentColor" />
                <span>{rating || restaurant.rating || '4.8'}</span>
              </div>
            </div>

            <p className="restaurant-detail-description">
              {restaurant.description || 'Taste-forward dishes, premium ingredients, and delivery that feels polished end to end.'}
            </p>

            <div className="restaurant-detail-metadata">
              <span>
                <Clock3 size={16} />
                {deliveryTime} mins
              </span>
              <span>Minimum order ₹{minOrder}</span>
              <span>{restaurant.deliveryFee === 0 ? 'Free delivery' : `Delivery ₹${restaurant.deliveryFee || 30}`}</span>
              <Badge variant={restaurant.isOpen === false ? 'danger' : 'success'}>
                {restaurant.isOpen === false ? 'Closed now' : 'Open now'}
              </Badge>
            </div>
          </motion.section>

          <div className="restaurant-detail-layout">
            <aside className="restaurant-detail-sidebar">
              <div className="restaurant-category-panel">
                <span className="restaurant-panel-kicker">Categories</span>
                <div className="restaurant-category-list">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`restaurant-category-button ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <section className="restaurant-detail-main">
              <div className="restaurant-mobile-categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`restaurant-category-button ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <div className="restaurant-menu-panel">
                <div className="restaurant-panel-header">
                  <div>
                    <span className="restaurant-panel-kicker">Menu</span>
                    <h2>Popular dishes</h2>
                  </div>
                </div>

                {filteredMenu.length === 0 ? (
                  <div className="restaurant-detail-state">No menu items in this category.</div>
                ) : (
                  <div className="restaurant-menu-grid">
                    {filteredMenu.map((item) => {
                      const itemId = getMenuItemId(item);
                      const itemQuantity = cartItems[itemId] || 0;

                      return (
                        <motion.article
                          key={itemId}
                          className="restaurant-menu-card"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                          <div className="restaurant-menu-image-wrap">
                            <img
                              src={
                                item.image ||
                                'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
                              }
                              alt={item.name}
                              className="restaurant-menu-image"
                            />
                          </div>

                          <div className="restaurant-menu-copy">
                            <div className="restaurant-menu-header">
                              <h3>{item.name}</h3>
                              <div className="restaurant-menu-badges">
                                {item.vegetarian && <Badge variant="success">Veg</Badge>}
                                {item.spicy && <Badge variant="danger">Spicy</Badge>}
                              </div>
                            </div>

                            <p className="restaurant-menu-description">{item.description}</p>
                            <strong className="restaurant-menu-price">₹{item.price}</strong>

                            <div className="restaurant-menu-actions">
                              {itemQuantity > 0 ? (
                                <div className="restaurant-quantity-control">
                                  <button type="button" onClick={(event) => handleQuantityChange(item, -1, event)}>
                                    <Minus size={16} />
                                  </button>
                                  <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                      key={itemQuantity}
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -8 }}
                                      transition={{ duration: 0.16 }}
                                    >
                                      {itemQuantity}
                                    </motion.span>
                                  </AnimatePresence>
                                  <button type="button" onClick={(event) => handleQuantityChange(item, 1, event)}>
                                    <Plus size={16} />
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="small"
                                  className="restaurant-add-button"
                                  onClick={(event) => handleAddToCart(item, event)}
                                >
                                  <Plus size={16} /> Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="restaurant-reviews-panel">
            <div className="restaurant-panel-header">
              <div>
                <span className="restaurant-panel-kicker">Reviews</span>
                <h2>Guest impressions</h2>
              </div>
            </div>

            <div className="restaurant-reviews-summary">
              <div className="restaurant-reviews-score">
                <strong>{rating || restaurant.rating || '4.8'}</strong>
                <span>{reviews.length} reviews</span>
              </div>

              <div className="restaurant-reviews-distribution">
                {reviewDistribution.map((entry) => (
                  <div key={entry.stars} className="restaurant-distribution-row">
                    <span>{entry.stars}★</span>
                    <div className="restaurant-distribution-bar">
                      <span style={{ width: `${entry.percentage}%` }} />
                    </div>
                    <strong>{entry.count}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="restaurant-rate-action">
              <span>Rate your experience</span>
              <StarRating interactive value={userRating} onChange={setUserRating} />
            </div>

            {reviews.length === 0 ? (
              <div className="restaurant-detail-state">No reviews yet.</div>
            ) : (
              <div className="restaurant-review-cards">
                {reviews.map((review) => (
                  <article key={review.id || review._id} className="restaurant-review-card">
                    <div className="restaurant-review-top">
                      <div>
                        <h3>{review.userName || 'Guest'}</h3>
                        <div className="restaurant-review-stars">{'★'.repeat(Math.round(review.rating || 0))}</div>
                      </div>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <AnimatePresence>
          {flyingItems.map((item) => (
            <motion.span
              key={item.id}
              className="restaurant-fly-token"
              style={{ left: item.startX, top: item.startY }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0.4,
                x: window.innerWidth - item.startX - 110,
                y: window.innerHeight - item.startY - 90,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              onAnimationComplete={() => removeFlyingItem(item.id)}
            >
              🍽️
            </motion.span>
          ))}
        </AnimatePresence>

        {cartCount > 0 && (
          <motion.button
            type="button"
            className="restaurant-floating-cart"
            onClick={() => navigate('/cart')}
            animate={cartPulse ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div>
              <span>{cartCount} item{cartCount > 1 ? 's' : ''}</span>
              <strong>₹{cartTotal}</strong>
            </div>
            <ShoppingCart size={20} />
          </motion.button>
        )}
      </main>
    </>
  );
}

export default RestaurantDetail;
