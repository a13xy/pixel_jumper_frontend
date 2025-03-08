import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services';

/**
 * Custom hook for authentication functionality
 * @returns {Object} Authentication methods and state
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      authService.logout();
    }
  }, []);

  /**
   * Login user with credentials
   * @param {string} login - Username
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  const login = useCallback(async (login, password) => {
    if (!login || !password) {
      setError('Username and password are required');
      return Promise.reject({ message: 'Username and password are required' });
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const data = await authService.login(login, password);
      if (data.status === 'SUCCESS') {
        const userData = {
          login,
          ...data.user_data
        };
        setUser(userData);
        setIsAuthenticated(true);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   * @param {string} login - Username
   * @param {string} password - User password
   * @returns {Promise<Object>} Registration result
   */
  const register = useCallback(async (login, password) => {
    if (!login || !password) {
      setError('Username and password are required');
      return Promise.reject({ message: 'Username and password are required' });
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const data = await authService.register(login, password);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Change user password
   * @param {string} login - Username
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change result
   */
  const changePassword = useCallback(async (login, currentPassword, newPassword) => {
    if (!login || !currentPassword || !newPassword) {
      setError('All fields are required');
      return Promise.reject({ message: 'All fields are required' });
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const data = await authService.changePassword(login, currentPassword, newPassword);
      return data;
    } catch (err) {
      setError(err.message || 'Password change failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword
  };
} 