import apiClient from './api';

export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/dashboard');
      return response.data.data || {};
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Get order analytics
  getOrderAnalytics: async (dateRange = 'month') => {
    try {
      const response = await apiClient.get('/analytics/orders', {
        params: { range: dateRange },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (dateRange = 'month') => {
    try {
      const response = await apiClient.get('/analytics/revenue', {
        params: { range: dateRange },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Get user analytics
  getUserAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/users');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Get restaurant analytics
  getRestaurantAnalytics: async (restaurantId) => {
    try {
      const response = await apiClient.get(`/analytics/restaurants/${restaurantId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching restaurant analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Get top restaurants
  getTopRestaurants: async (limit = 10) => {
    try {
      const response = await apiClient.get('/analytics/restaurants/top', {
        params: { limit },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching top restaurants:', error);
      return [];
    }
  },

  // Get top dishes
  getTopDishes: async (limit = 10) => {
    try {
      const response = await apiClient.get('/analytics/dishes/top', {
        params: { limit },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching top dishes:', error);
      return [];
    }
  },

  // Get delivery analytics
  getDeliveryAnalytics: async (dateRange = 'month') => {
    try {
      const response = await apiClient.get('/analytics/delivery', {
        params: { range: dateRange },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching delivery analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Get payment analytics
  getPaymentAnalytics: async (dateRange = 'month') => {
    try {
      const response = await apiClient.get('/analytics/payments', {
        params: { range: dateRange },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Get custom report
  generateCustomReport: async (reportParams) => {
    try {
      const response = await apiClient.post('/analytics/custom-report', reportParams);
      return response.data.data;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error.response?.data || error;
    }
  },
};

export default analyticsService;
