// hooks/useAuth.js
import { useMutation, useQueryClient } from 'react-query';
import { login, refreshToken } from '../api/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      queryClient.invalidateQueries('user');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Handle login error, e.g., display an error message
    }
  });

  return { login: loginMutation.mutate,
           isLoading: loginMutation.isLoading,
           isError: loginMutation.isError };
};
