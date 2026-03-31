import apiClient from './api';

export const couponService = {
  // Apply coupon
  applyCoupon: async (couponCode, orderAmount) => {
    try {
      const response = await apiClient.post('/coupons/apply', {
        code: couponCode,
        orderAmount,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error.response?.data || error;
    }
  },

  // Get all available coupons
  getAllCoupons: async () => {
    try {
      const response = await apiClient.get('/coupons');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error.response?.data || error;
    }
  },

  // Get coupon details
  getCouponDetails: async (couponCode) => {
    try {
      const response = await apiClient.get(`/coupons/${couponCode}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      throw error.response?.data || error;
    }
  },

  // Create coupon (admin)
  createCoupon: async (couponData) => {
    try {
      const response = await apiClient.post('/coupons', {
        code: couponData.code,
        discount: couponData.discount,
        discountType: couponData.discountType, // PERCENTAGE or FIXED
        minOrderAmount: couponData.minOrderAmount,
        maxDiscount: couponData.maxDiscount,
        validFrom: couponData.validFrom,
        validTo: couponData.validTo,
        usageLimit: couponData.usageLimit,
        usageCount: 0,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error.response?.data || error;
    }
  },

  // Update coupon (admin)
  updateCoupon: async (couponId, couponData) => {
    try {
      const response = await apiClient.put(`/coupons/${couponId}`, couponData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error.response?.data || error;
    }
  },

  // Delete coupon (admin)
  deleteCoupon: async (couponId) => {
    try {
      const response = await apiClient.delete(`/coupons/${couponId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error.response?.data || error;
    }
  },

  // Get user's applied coupons
  getUserCoupons: async () => {
    try {
      const response = await apiClient.get('/coupons/user/applied');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user coupons:', error);
      return [];
    }
  },

  // Validate coupon code
  validateCouponCode: async (code) => {
    try {
      const response = await apiClient.post('/coupons/validate', { code });
      return response.data.success;
    } catch (error) {
      return false;
    }
  },
};

export default couponService;
