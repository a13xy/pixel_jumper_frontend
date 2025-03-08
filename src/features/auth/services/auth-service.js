import apiClient from '../../../services/api-client';

/**
 * Authentication service for handling user authentication operations
 */
export const authService = {
  /**
   * Login user with credentials
   * @param {string} login - Username
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  login: async (login, password) => {
    if (!login || !password) {
      throw { message: 'Username and password are required' };
    }
    
    try {
      const response = await apiClient.get('/login', { 
        params: { login, password } 
      });
      
      if (!response.data || response.data.status !== 'SUCCESS') {
        throw new Error(response.data?.message || 'Login failed. Please try again.');
      }
      
      const userData = {
        login,
        ...response.data.user_data
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      throw { message: errorMessage };
    }
  },

  /**
   * Register new user
   * @param {string} login - Username
   * @param {string} password - User password
   * @returns {Promise<Object>} Registration result
   */
  register: async (login, password) => {
    if (!login || !password) {
      throw { message: 'Username and password are required' };
    }
    
    if (login.length < 5) {
      throw { message: 'Username must be at least 5 characters' };
    }
    
    if (password.length < 8) {
      throw { message: 'Password must be at least 8 characters' };
    }
    
    try {
      const response = await apiClient.post('/create-user', null, {
        params: { login, password }
      });
      
      if (!response.data || response.data.status !== 'SUCCESS') {
        throw new Error(response.data?.message || 'Registration failed. Please try again.');
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      throw { message: errorMessage };
    }
  },

  /**
   * Change user password
   * @param {string} login - Username
   * @param {string} password - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change result
   */
  changePassword: async (login, password, newPassword) => {
    if (!login || !password || !newPassword) {
      throw { message: 'All fields are required' };
    }
    
    if (password === newPassword) {
      throw { message: 'New password must be different from current password' };
    }
    
    if (newPassword.length < 8) {
      throw { message: 'New password must be at least 8 characters' };
    }
    
    try {
      const response = await apiClient.put('/change-password', null, { 
        params: { 
          login, 
          password, 
          new_password: newPassword 
        }
      });
      
      if (!response.data || response.data.status !== 'SUCCESS') {
        throw new Error(response.data?.message || 'Password change failed. Please try again.');
      }
      
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Password change failed. Please try again.';
      throw { message: errorMessage };
    }
  },

  /**
   * Logout current user
   */
  logout: () => {
    localStorage.removeItem('user');
  },

  /**
   * Get current user data from local storage
   * @returns {Object|null} User data or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Remove invalid data
      return null;
    }
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService; 