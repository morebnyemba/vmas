// src/hooks/useProperties.js
import { useQuery } from '@tanstack/react-query';
import { fetchProperties } from '../api/properties';

export const useProperties = (filters = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};