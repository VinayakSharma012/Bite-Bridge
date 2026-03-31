import apiClient from './api';

export const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    try {
      const response = await apiClient.post('/reviews', {
        orderId: reviewData.orderId,
        restaurantId: reviewData.restaurantId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        deliveryRating: reviewData.deliveryRating,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error.response?.data || error;
    }
  },

  // Get reviews for restaurant
  getRestaurantReviews: async (restaurantId) => {
    try {
      const response = await apiClient.get(`/reviews/restaurant/${restaurantId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error.response?.data || error;
    }
  },

  // Get user reviews
  getUserReviews: async () => {
    try {
      const response = await apiClient.get('/reviews/user/my-reviews');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error.response?.data || error;
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
        deliveryRating: reviewData.deliveryRating,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error.response?.data || error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error.response?.data || error;
    }
  },

  // Get review by ID
  getReviewById: async (reviewId) => {
    try {
      const response = await apiClient.get(`/reviews/${reviewId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error.response?.data || error;
    }
  },

  // Get restaurant rating summary
  getRestaurantRating: async (restaurantId) => {
    try {
      const response = await apiClient.get(`/reviews/restaurant/${restaurantId}/rating`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching rating:', error);
      return { average: 0, total: 0 };
    }
  },
};

export default reviewService;
