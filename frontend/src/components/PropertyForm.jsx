// PropertyForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { createProperty } from '../api/propertyApi';

export default function PropertyForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await createProperty(formData);
      // Handle success
    } catch (error) {
      console.error('Property creation failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <input {...register('title')} placeholder="Property Title" />
      <input type="number" {...register('price')} placeholder="Price" />
      {/* Add other form fields */}
      <button type="submit">List Property</button>
    </form>
  );
}