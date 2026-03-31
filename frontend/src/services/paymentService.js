import apiClient from './api';

export const paymentService = {
  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payment/process', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        method: paymentData.method,
        cardNumber: paymentData.cardNumber,
        cardExpiry: paymentData.cardExpiry,
        cardCvv: paymentData.cardCvv,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error.response?.data || error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payment/status/${paymentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error.response?.data || error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId, amount) => {
    try {
      const response = await apiClient.post(`/payment/refund/${paymentId}`, { amount });
      return response.data.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error.response?.data || error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await apiClient.get('/payment/history');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error.response?.data || error;
    }
  },

  // Validate card
  validateCard: async (cardData) => {
    try {
      const response = await apiClient.post('/payment/validate-card', cardData);
      return response.data.success;
    } catch (error) {
      console.error('Error validating card:', error);
      return false;
    }
  },

  // Get UPI status
  getUpiStatus: async (orderId) => {
    try {
      const response = await apiClient.get(`/payment/upi/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching UPI status:', error);
      throw error.response?.data || error;
    }
  },

  // Get wallet balance
  getWalletBalance: async () => {
    try {
      const response = await apiClient.get('/payment/wallet/balance');
      return response.data.data?.balance || 0;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  },
};

export default paymentService;
