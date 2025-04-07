import apiClient from './client';

// Constants for token storage
const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token'
};

// Error messages
const ERROR_MESSAGES = {
  NO_REFRESH_TOKEN: 'Session expired. Please login again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  DEFAULT_ERROR: 'Authentication failed. Please try again.'
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('core/auth/token/', credentials);
    setAuthTokens(response.data);
    return response.data;
  } catch (error) {
    clearAuthTokens();
    throw handleAuthError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('core/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error(ERROR_MESSAGES.NO_REFRESH_TOKEN);
  }

  try {
    const response = await apiClient.post('core/auth/token/refresh/', {
      refresh: refreshToken
    });
    
    setAuthTokens({
      access: response.data.access,
      refresh: response.data.refresh || refreshToken
    });
    
    return response.data;
  } catch (error) {
    clearAuthTokens();
    throw handleAuthError(error);
  }
};

export const verifyToken = async () => {
  const token = getAccessToken();
  if (!token) return false;
  
  try {
    await apiClient.post('core/auth/token/verify/', { token });
    return true;
  } catch (error) {
    try {
      await refreshToken();
      return true;
    } catch (refreshError) {
      return false;
    }
  }
};

export const logout = () => {
  clearAuthTokens();
};

// Helper functions
export const getAccessToken = () => localStorage.getItem(TOKEN_KEYS.ACCESS);
export const getRefreshToken = () => localStorage.getItem(TOKEN_KEYS.REFRESH);

const setAuthTokens = ({ access, refresh }) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS, access);
  if (refresh) {
    localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
  }
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
};

// ✅ Exported properly now
export const clearAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  delete apiClient.defaults.headers.common['Authorization'];
};

const handleAuthError = (error) => {
  if (!error.response) {
    return new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return new Error(data.detail || 'Invalid request data');
    case 401:
      return new Error(data.detail || 'Invalid credentials');
    case 403:
      return new Error(data.detail || 'Access denied');
    case 500:
      return new Error('Server error. Please try again later.');
    default:
      return new Error(data.detail || ERROR_MESSAGES.DEFAULT_ERROR);
  }
};
