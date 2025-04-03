import apiClient from './client';

export const getProperties = async (params = {}) => {
  const response = await apiClient.get('properties/properties/', { params });
  return response.data;
};

export const getPropertyDetails = async (id) => {
  const response = await apiClient.get(`properties/properties/${id}/`);
  return response.data;
};

export const expressInterest = async (propertyId) => {
  const response = await apiClient.post('properties/interests/', { 
    property: propertyId 
  });
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await apiClient.post('properties/properties/', propertyData);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await apiClient.put(`properties/properties/${id}/`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await apiClient.delete(`properties/properties/${id}/`);
  return response.data;
};