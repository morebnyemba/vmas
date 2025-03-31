// config/api.js
import axios from 'axios';
import { logout } from './auth';  // Assume you have an auth utility

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',  // Helps Django identify AJAX requests
  },
  withCredentials: true,
  timeout: 10000,  // 10 second timeout
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const csrfToken = getCookie('csrftoken');  // For Django CSRF
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.data?.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      return handle401Error(originalRequest, error);
    }
    
    // Handle CSRF failures (common with Django)
    if (error.response?.status === 403 && error.response.data?.detail?.includes('CSRF')) {
      return handleCsrfError(originalRequest);
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    }
    
    // Unified error handling
    const processedError = processError(error);
    showErrorNotification(processedError);  // Replace with your notification system
    
    return Promise.reject(processedError);
  }
);

// Helper functions
const handle401Error = async (originalRequest, error) => {
  originalRequest._retry = true;
  const refreshToken = localStorage.getItem('refresh_token');
  
  try {
    if (refreshToken) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh/`,
        { refresh: refreshToken },
        { withCredentials: true }
      );
      
      localStorage.setItem('access_token', response.data.access);
      originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
      return api(originalRequest);
    }
    throw error;
  } catch (refreshError) {
    logout();  // Clear tokens and redirect
    return Promise.reject(refreshError);
  }
};

const handleCsrfError = async (originalRequest) => {
  try {
    // Get fresh CSRF token
    await axios.get(`${import.meta.env.VITE_API_URL}/csrf/`, { 
      withCredentials: true 
    });
    return api(originalRequest);
  } catch (error) {
    logout();
    return Promise.reject(error);
  }
};

const processError = (error) => {
  if (error.response) {
    return {
      ...error,
      message: error.response.data?.detail || 
               error.response.data?.message || 
               'An unexpected error occurred',
      status: error.response.status,
      data: error.response.data
    };
  }
  return error;
};

// Helper to get Django CSRF cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export default api;