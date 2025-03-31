// api/propertyApi.js
import axios from '../config/api';

export const fetchProperties = async (params) => {
  try {
    const response = await axios.get('/properties/', { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createProperty = async (formData) => {
  try {
    const response = await axios.post('/properties/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};