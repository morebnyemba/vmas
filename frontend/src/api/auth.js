import apiClient from './client';

// Constants
const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
};

const ERROR_MESSAGES = {
  NO_REFRESH_TOKEN: 'Session expired. Please login again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  DEFAULT_ERROR: 'Authentication failed. Please try again.',
};

// Store access & refresh tokens + set header
export const setAuthTokens = ({ access, refresh }) => {
  if (access) {
    localStorage.setItem(TOKEN_KEYS.ACCESS, access);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  }

  if (refresh) {
    localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
  }
};

// Remove tokens & auth headers
export const clearAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  delete apiClient.defaults.headers.common['Authorization'];
};

// Getters
export const getAccessToken = () => localStorage.getItem(TOKEN_KEYS.ACCESS);
export const getRefreshToken = () => localStorage.getItem(TOKEN_KEYS.REFRESH);

// Set auth header manually on reload (e.g., in App.js or before refresh)
export const initializeAuthHeader = () => {
  const token = getAccessToken();
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Auth Actions
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('core/auth/token/', credentials);
    setAuthTokens(response.data);
    return response.data; // Return only the data on success
  } catch (error) {
    clearAuthTokens();
    throw handleAuthError(error);
  }
};

export const register = async (formData) => {
  try {
    const response = await apiClient.post('core/auth/register/', formData);
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const refreshToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error(ERROR_MESSAGES.NO_REFRESH_TOKEN);
  }

  try {
    const response = await apiClient.post('core/auth/token/refresh/', { refresh });
    setAuthTokens({
      access: response.data.access,
      refresh: response.data.refresh || refresh, // fallback to old refresh token if not returned
    });
    return response.data;
  } catch (error) {
    clearAuthTokens();
    throw handleAuthError(error);
  }
};

export const verifyToken = async () => {
  const access = getAccessToken();
  if (!access) return false;

  try {
    await apiClient.post('core/auth/token/verify/', { token: access });
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

// 🔥 Improved Auth Error Handler
const handleAuthError = (error) => {
  if (!error.response) {
    return new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }

  const { status, data } = error.response;

  // 🛑 Handle field validation errors (e.g., { "email": ["This field is required."] })
  if (status === 400 && typeof data === 'object' && !data.detail) {
    const messages = Object.entries(data)
      .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
      .join('\n');
    return new Error(messages);
  }

  // 🛑 Handle other errors like expired tokens, invalid credentials, etc.
  const detail = data?.detail || ERROR_MESSAGES.DEFAULT_ERROR;

  switch (status) {
    case 400:
      return new Error(detail || 'Invalid request data');
    case 401:
      return new Error(detail || 'Invalid credentials');
    case 403:
      return new Error(detail || 'Access denied');
    case 500:
      return new Error('Server error. Please try again later.');
    default:
      return new Error(detail);
  }
};
