import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle 401 errors from actual API responses, not network errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      
      // Prevent infinite redirects by checking current path
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login page
      if (!currentPath.includes('/login') && !currentPath.includes('/admin')) {
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    // Don't auto-logout for network errors or server unavailable
    return Promise.reject(error);
  }
);

export default api;
