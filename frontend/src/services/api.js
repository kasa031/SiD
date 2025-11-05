import axios from 'axios';

// API URL configuration
// In production, use environment variable or Railway/Render URL
// In development, use localhost
const getApiUrl = () => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, use deployed backend URL
  if (import.meta.env.PROD) {
    // TODO: Replace with your Railway/Render backend URL
    // Example: 'https://your-app.railway.app/api'
    return 'https://your-backend-url.railway.app/api';
  }
  
  // In development, use localhost
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

