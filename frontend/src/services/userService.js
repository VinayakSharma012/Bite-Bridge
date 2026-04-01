import apiClient from './api';

export const userService = {
  // Get current user profile
  getCurrentUserProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile', {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        zipCode: userData.zipCode,
        profileImage: userData.profileImage,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data.success;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error.response?.data || error;
    }
  },

  // Get user order history
  getUserOrderHistory: async () => {
    try {
      const response = await apiClient.get('/users/orders');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error.response?.data || error;
    }
  },

  // Get user addresses
  getUserAddresses: async () => {
    try {
      const response = await apiClient.get('/users/addresses');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  },

  // Add new address
  addAddress: async (address) => {
    try {
      const response = await apiClient.post('/users/addresses', address);
      return response.data.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error.response?.data || error;
    }
  },

  // Update address
  updateAddress: async (addressId, address) => {
    try {
      const response = await apiClient.put(`/users/addresses/${addressId}`, address);
      return response.data.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error.response?.data || error;
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await apiClient.delete(`/users/addresses/${addressId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error.response?.data || error;
    }
  },

  // Get all users (admin)
  getAllUsers: async (filters = {}) => {
    try {
      const response = await apiClient.get('/users', { params: filters });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || error;
    }
  },

  // Update user role (admin)
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/users/${userId}/role`, { role });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error.response?.data || error;
    }
  },

  // Delete user (admin)
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error.response?.data || error;
    }
  },

  // Get user statistics (admin)
  getUserStatistics: async () => {
    try {
      const response = await apiClient.get('/users/admin/statistics');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error.response?.data || error;
    }
  },

  // Deactivate account
  deactivateAccount: async (password) => {
    try {
      const response = await apiClient.post('/users/deactivate', { password });
      return response.data.success;
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error.response?.data || error;
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await apiClient.post('/users/delete', { password });
      return response.data.success;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error.response?.data || error;
    }
  },
};

export default userService;
