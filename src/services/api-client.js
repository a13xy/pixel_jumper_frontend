import axios from 'axios';

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Error response mapping
const errorMessages = {
  'ACCOUNT_DO_NOT_EXIST': 'Account does not exist',
  'WRONG_PASSWORD': 'Incorrect password',
  'ACCOUNT_ALREADY_EXISTS': 'Account already exists',
  'USERNAME_TOO_SHORT': 'Username is too short',
  'PASSWORD_TO_SHORT': 'Password is too short',
};

apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Response:', response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      
      if (error.response.data && error.response.data.error) {
        const errorCode = error.response.data.error;
        error.response.data.message = errorMessages[errorCode] || errorCode;
      }
    } else if (error.request) {
      console.error('Network Error:', error.request);
      error.response = { 
        data: { message: 'Network error. Please check your connection.' } 
      };
    } else {
      console.error('Request Error:', error.message);
      error.response = { 
        data: { message: 'An error occurred. Please try again.' } 
      };
    }
    
    if (!error.response) {
      error.response = { data: {} };
    }
    
    if (!error.response.data) {
      error.response.data = {};
    }
    
    if (!error.response.data.message) {
      error.response.data.message = 'An unexpected error occurred';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 