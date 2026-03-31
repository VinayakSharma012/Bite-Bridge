import apiClient from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', {
        restaurantId: orderData.restaurantId,
        items: orderData.items,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
        specialInstructions: orderData.specialInstructions,
        totalAmount: orderData.totalAmount,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error?.response?.data || error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await apiClient.get('/orders/customer/my-orders');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error.response?.data || error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error.response?.data || error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/cancel`, {});
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error.response?.data || error;
    }
  },

  // Get order status
  getOrderStatus: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}/status`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error.response?.data || error;
    }
  },

  // Get all orders (admin)
  getAllOrders: async (filters = {}) => {
    try {
      const response = await apiClient.get('/orders/admin/all', { params: filters });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error.response?.data || error;
    }
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error.response?.data || error;
    }
  },

  // Get restaurant orders (restaurant owner)
  getRestaurantOrders: async (restaurantId) => {
    try {
      const response = await apiClient.get('/orders/admin/all');
      const orders = response.data.data || [];
      return orders.filter((order) => order.restaurantId === restaurantId);
    } catch (error) {
      console.error('Error fetching restaurant orders:', error);
      throw error.response?.data || error;
    }
  },
};

export default orderService;
