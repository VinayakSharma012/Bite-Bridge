import React, { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    
    if (storedUser && authToken) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (registerData) => {
    setLoading(true);
    try {
      const data = await authService.register(registerData);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
