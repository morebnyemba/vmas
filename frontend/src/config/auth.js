// src/config/auth.js
export const logout = () => {
    // Clear tokens from storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect to login page
    window.location.href = '/login';
  };
  
  // Helper to check authentication status
  export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };