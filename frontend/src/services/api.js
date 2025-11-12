import axios from 'axios';

// API URL configuration
// In production, use environment variable or Railway/Render URL
// In development, use localhost
const getApiUrl = () => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, use deployed backend URL (Fly.io)
  if (import.meta.env.PROD) {
    return 'https://sid-backend.fly.dev/api';
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

// Error handling interceptor with detailed error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error types with specific messages
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      // Get specific error message from server or use default
      let errorMessage = data?.error || data?.message || 'En feil oppstod';
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          errorMessage = 'Du må logge inn for å fortsette';
          break;
        case 403:
          errorMessage = 'Du har ikke tilgang til denne ressursen';
          break;
        case 404:
          errorMessage = 'Ressursen ble ikke funnet';
          break;
        case 409:
          errorMessage = data?.error || 'Konflikt: Ressursen eksisterer allerede';
          break;
        case 422:
          errorMessage = data?.error || 'Ugyldig data sendt til serveren';
          break;
        case 429:
          errorMessage = 'For mange forespørsler. Prøv igjen senere.';
          break;
        case 500:
          errorMessage = 'Serverfeil. Prøv igjen senere.';
          break;
        case 503:
          errorMessage = 'Tjenesten er midlertidig utilgjengelig. Prøv igjen senere.';
          break;
        default:
          errorMessage = data?.error || `Feil: ${status}`;
      }
      
      // Enhance error object with user-friendly message
      error.userMessage = errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      error.userMessage = 'Kunne ikke koble til serveren. Sjekk internettforbindelsen din.';
    } else {
      // Error setting up request
      error.userMessage = 'En uventet feil oppstod. Prøv igjen.';
    }
    
    return Promise.reject(error);
  }
);

export default api;

