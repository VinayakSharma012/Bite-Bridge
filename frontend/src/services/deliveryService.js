import apiClient from './api';

export const deliveryService = {
  // Track delivery
  trackDelivery: async (orderId) => {
    try {
      const response = await apiClient.get(`/delivery/track/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error tracking delivery:', error);
      throw error.response?.data || error;
    }
  },

  // Get delivery driver info
  getDriverInfo: async (orderId) => {
    try {
      const response = await apiClient.get(`/delivery/${orderId}/driver`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching driver info:', error);
      throw error.response?.data || error;
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put(`/delivery/${orderId}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error.response?.data || error;
    }
  },

  // Assign delivery partner
  assignDeliveryPartner: async (orderId, partnerId) => {
    try {
      const response = await apiClient.post(`/delivery/${orderId}/assign`, { partnerId });
      return response.data.data;
    } catch (error) {
      console.error('Error assigning delivery partner:', error);
      throw error.response?.data || error;
    }
  },

  // Get delivery address
  getDeliveryAddress: async (orderId) => {
    try {
      const response = await apiClient.get(`/delivery/${orderId}/address`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching delivery address:', error);
      throw error.response?.data || error;
    }
  },

  // Estimate delivery time
  estimateDeliveryTime: async (restaurantLocation, deliveryLocation) => {
    try {
      const response = await apiClient.post('/delivery/estimate-time', {
        restaurantLat: restaurantLocation.lat,
        restaurantLng: restaurantLocation.lng,
        deliveryLat: deliveryLocation.lat,
        deliveryLng: deliveryLocation.lng,
      });
      return response.data.data?.estimatedMinutes || 30;
    } catch (error) {
      console.error('Error estimating delivery time:', error);
      return 30; // Default 30 minutes
    }
  },

  // Rate delivery
  rateDelivery: async (orderId, rating, comment) => {
    try {
      const response = await apiClient.post(`/delivery/${orderId}/rate`, {
        rating,
        comment,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error rating delivery:', error);
      throw error.response?.data || error;
    }
  },

  // Get delivery history
  getDeliveryHistory: async () => {
    try {
      const response = await apiClient.get('/delivery/history');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching delivery history:', error);
      return [];
    }
  },
};

export default deliveryService;
