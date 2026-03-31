import apiClient from './api';

const saveAuthData = (data) => {
  const token = data?.accessToken || data?.token;
  const refreshToken = data?.refreshToken;
  const user = data?.user;

  if (token) {
    localStorage.setItem('authToken', token);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

const toAppError = (error, fallbackMessage) => {
  const serverMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  const message = serverMessage || fallbackMessage;
  return new Error(message);
};

export const authService = {
  // Register new user
  register: async (registerData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        address: registerData.address,
        role: registerData.role || 'CUSTOMER',
      });
      const data = response?.data?.data;
      saveAuthData(data);
      return data;
    } catch (error) {
      throw toAppError(error, 'Registration failed. Please try again.');
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      const data = response?.data?.data;
      saveAuthData(data);
      return data;
    } catch (error) {
      throw toAppError(error, 'Login failed. Please try again.');
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/auth/refresh', null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const data = response?.data?.data;
      saveAuthData(data);
      return data;
    } catch (error) {
      throw toAppError(error, 'Unable to refresh session. Please log in again.');
    }
  },

  // Validate token
  validateToken: async (token) => {
    try {
      const response = await apiClient.get('/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;
