import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'land', label: 'Land' },
];

const bedroomOptions = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
];

export default function FilterBar({ onFilterChange, initialValues }) {
  const [localFilters, setLocalFilters] = React.useState({
    min_price: initialValues.min_price || '',
    max_price: initialValues.max_price || '',
    bedrooms: initialValues.bedrooms || '',
    property_type: initialValues.property_type || '',
  });

  const handleChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      min_price: '',
      max_price: '',
      bedrooms: '',
      property_type: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border rounded-md"
                value={localFilters.min_price}
                onChange={(e) => handleChange('min_price', e.target.value)}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border rounded-md"
                value={localFilters.max_price}
                onChange={(e) => handleChange('max_price', e.target.value)}
              />
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={localFilters.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
            >
              {bedroomOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={localFilters.property_type}
              onChange={(e) => handleChange('property_type', e.target.value)}
            >
              {propertyTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end space-x-3">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}