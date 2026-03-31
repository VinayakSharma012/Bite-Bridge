import apiClient from './api';

export const menuService = {
  // Get menu items for a restaurant
  getMenuByRestaurant: async (restaurantId) => {
    try {
      const response = await apiClient.get(`/menus/restaurant/${restaurantId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error.response?.data || error;
    }
  },

  // Get menu item by ID
  getMenuItemById: async (menuItemId) => {
    try {
      const response = await apiClient.get(`/menus/${menuItemId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error.response?.data || error;
    }
  },

  // Create menu item
  createMenuItem: async (menuData) => {
    try {
      const response = await apiClient.post('/menus', menuData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error.response?.data || error;
    }
  },

  // Update menu item
  updateMenuItem: async (menuItemId, menuData) => {
    try {
      const response = await apiClient.put(`/menus/${menuItemId}`, menuData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error.response?.data || error;
    }
  },

  // Delete menu item
  deleteMenuItem: async (menuItemId) => {
    try {
      const response = await apiClient.delete(`/menus/${menuItemId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error.response?.data || error;
    }
  },

  // Search menu items
  searchMenuItems: async (restaurantId, query) => {
    try {
      const response = await apiClient.get(`/menus/restaurant/${restaurantId}`, {
        params: { search: query },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching menu items:', error);
      throw error.response?.data || error;
    }
  },

  // Get menu items by category
  getMenuByCategory: async (restaurantId, category) => {
    try {
      const response = await apiClient.get(`/menus/restaurant/${restaurantId}`, {
        params: { category },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching menu by category:', error);
      throw error.response?.data || error;
    }
  },
};

export default menuService;
