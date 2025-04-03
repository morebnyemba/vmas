import apiClient from './client';

export const login = async (credentials) => {
  const response = await apiClient.post('core/auth/token/', credentials);
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('core/auth/register/', userData);
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post('core/auth/token/refresh/', {
    refresh: localStorage.getItem('refresh_token'),
  });
  localStorage.setItem('access_token', response.data.access);
  return response.data;
};

export const verifyToken = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  try {
    await apiClient.post('core/auth/token/verify/', { token });
    return true;
  } catch (error) {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};