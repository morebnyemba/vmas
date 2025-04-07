import axios from 'axios';
import { refreshToken, clearAuthTokens } from './auth';


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip retry for these cases
    if (
      error.response?.status !== 401 || 
      originalRequest._retry || 
      originalRequest.url.includes('auth/token')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    
    try {
      const { access } = await refreshToken();
      originalRequest.headers.Authorization = `Bearer ${access}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;