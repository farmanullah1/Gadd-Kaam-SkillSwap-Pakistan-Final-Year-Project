// skillswap-pakistan-frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 
  process.env.REACT_APP_API_URL || 
  'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors (e.g. 401 Unauthorized / Token Expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthUrl = error.config && error.config.url && (error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register'));
      if (!isAuthUrl) {
        // Clear expired or invalidated credentials
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;
