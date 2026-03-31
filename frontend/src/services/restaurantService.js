import apiClient from './api';

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await apiClient.get('/restaurants');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error.response?.data || error;
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (restaurantId) => {
    try {
      const response = await apiClient.get(`/restaurants/${restaurantId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error.response?.data || error;
    }
  },

  // Get restaurants by owner
  getRestaurantsByOwner: async (ownerId) => {
    try {
      const response = await apiClient.get(`/restaurants/owner/${ownerId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching owner restaurants:', error);
      throw error.response?.data || error;
    }
  },

  // Create restaurant
  createRestaurant: async (restaurantData) => {
    try {
      const response = await apiClient.post('/restaurants', restaurantData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error.response?.data || error;
    }
  },

  // Update restaurant
  updateRestaurant: async (restaurantId, restaurantData) => {
    try {
      const response = await apiClient.put(`/restaurants/${restaurantId}`, restaurantData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error.response?.data || error;
    }
  },

  // Delete restaurant
  deleteRestaurant: async (restaurantId) => {
    try {
      const response = await apiClient.delete(`/restaurants/${restaurantId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error.response?.data || error;
    }
  },

  // Search restaurants
  searchRestaurants: async (query) => {
    try {
      const response = await apiClient.get('/restaurants', {
        params: { search: query },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error.response?.data || error;
    }
  },
};

export default restaurantService;
