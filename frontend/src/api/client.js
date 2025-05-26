import axios from 'axios';
import { refreshToken, clearAuthTokens, getAccessToken } from './auth'; // Import getAccessToken

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken(); // Use the getter function which uses the correct key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response, // Handle response success
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

    // Prevent multiple retry attempts
    originalRequest._retry = true;

    try {
      // Attempt to refresh the token
      const { access } = await refreshToken();

      // Update the Authorization header with the new token
      originalRequest.headers.Authorization = `Bearer ${access}`;
      // Retry the original request with the new access token
      return apiClient(originalRequest);
    } catch (refreshError) {
      // If token refresh fails, clear tokens and redirect to sign-in
      clearAuthTokens();
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;