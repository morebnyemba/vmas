// @/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';  // Replaced useHistory with useNavigate
import apiClient from '@/api/client';
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
} from '@/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const navigate = useNavigate();  // Replaced useHistory with useNavigate

  const loadUserProfile = useCallback(async (accessToken) => {
    try {
      const response = await apiClient.get('core/users/me/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = response.data;

      setAuthState((prev) => ({
        ...prev,
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          fullName: `${userData.first_name} ${userData.last_name}`.trim(),
          role: userData.role,
          phoneNumber: userData.phone_number,
          alternatePhone: userData.alternate_phone,
          isActive: userData.is_active,
          dateOfBirth: userData.date_of_birth,
          profilePicture: userData.profile_picture,
          coverPhoto: userData.cover_photo,
          bio: userData.bio,
          gender: userData.gender,
          emailVerified: userData.email_verified,
          phoneVerified: userData.phone_verified,
          tfaEnabled: userData.tfa_enabled,
          isStaff: userData.is_staff,
          notificationPreferences: userData.notification_preferences,
          communicationPreferences: userData.communication_preferences,
          agency: userData.agency,
          agencyRole: userData.agency_role,
          yearsOfExperience: userData.years_of_experience,
          languages: userData.languages,
          serviceAreas: userData.service_areas,
          rating: userData.rating,
          reviewsCount: userData.reviews_count,
          facebookUrl: userData.facebook_url,
          linkedinUrl: userData.linkedin_url,
          twitterUrl: userData.twitter_url,
          instagramUrl: userData.instagram_url,
          licenses: userData.licenses,
          specializations: userData.specializations,
          agentProfile: userData.agent_profile,
          devices: userData.devices,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
          agencyVerified: userData.agency_verified,
          averageResponseTime: userData.average_response_time,
          isOnline: userData.is_online,
          lastLogin: userData.last_login,
          lastActivity: userData.last_activity,
          lastSeen: userData.last_seen,
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      }));

      return true;
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: 'Unable to fetch user profile',
        loading: false,
      }));
      return false;
    }
  }, []);

  const verifyToken = useCallback(async (token) => {
    if (!token) return false;

    try {
      const response = await apiClient.post('core/auth/token/verify/', { token });
      return response.status === 200;
    } catch {
      return false;
    }
  }, []);

  const login = useCallback(async (authResponseData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { access, refresh } = authResponseData;
      setAuthTokens({ access, refresh });

      const profileLoaded = await loadUserProfile(access);
      if (!profileLoaded) {
        throw new Error('Failed to load user profile');
      }

      const redirectUrl = localStorage.getItem('redirectUrl');
      localStorage.removeItem('redirectUrl');
      navigate(redirectUrl || '/dashboard');  // Replaced history.push() with navigate()
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        error: err.response?.data?.detail || err.message || 'Login failed',
        loading: false
      }));
      throw err;
    }
  }, [loadUserProfile, navigate]);  // Updated to include navigate()

  const register = useCallback(async (registerData) => {
    // TODO: Call your registration API here and then redirect
    const redirectUrl = localStorage.getItem('redirectUrl');
    localStorage.removeItem('redirectUrl');
    navigate(redirectUrl || '/dashboard');  // Replaced history.push() with navigate()
  }, [navigate]);  // Updated to include navigate()

  const logout = useCallback(() => {
    clearAuthTokens();
    setAuthState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  }, []);

  const handleTokenRefresh = useCallback(async () => {
    const refresh = getRefreshToken();
    if (!refresh) {
      logout();
      return null;
    }

    try {
      const response = await apiClient.post('core/auth/token/refresh/', { refresh });
      const { access } = response.data;

      const currentRefreshToken = getRefreshToken();
      if (currentRefreshToken) {
        setAuthTokens({ access, refresh: currentRefreshToken });
      } else {
        logout();
        return null;
      }

      return access;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const access = getAccessToken();

      if (!access) {
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const isValid = await verifyToken(access);

        if (isValid) {
          await loadUserProfile(access);
        } else {
          const newAccess = await handleTokenRefresh();
          if (newAccess) {
            await loadUserProfile(newAccess);
          } else {
            logout();
          }
        }
      } catch {
        setAuthState((prev) => ({
          ...prev,
          error: 'Authentication error',
          loading: false,
        }));
        logout();
      }
    };

    initializeAuth();

    const interval = setInterval(async () => {
      const access = getAccessToken();
      if (access) {
        const isValid = await verifyToken(access);
        if (!isValid) {
          await handleTokenRefresh();
        }
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [verifyToken, loadUserProfile, handleTokenRefresh, logout]);

  const contextValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    register,
    refreshToken: handleTokenRefresh,
    getAccessToken,
    loadUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
