import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronDown, Filter } from 'lucide-react';

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
  const [localFilters, setLocalFilters] = useState({
    min_price: initialValues.min_price || '',
    max_price: initialValues.max_price || '',
    bedrooms: initialValues.bedrooms || '',
    property_type: initialValues.property_type || '',
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
    setIsMobileMenuOpen(false); // Close mobile menu after applying filters
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
    <div className="w-full">
      {/* Mobile Filter Trigger Button */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
          />
        </Button>
      </div>
      
      {/* Filter Form */}
      <div 
        className={`
          bg-white shadow-sm rounded-lg p-4 md:p-6 transition-all duration-300 overflow-hidden
          ${isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[600px] md:opacity-100'}
        `}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full p-2 border rounded-md"
                    value={localFilters.min_price}
                    onChange={(e) => handleChange('min_price', e.target.value)}
                  />
                  <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                </div>
                <div className="text-center text-gray-500 sm:hidden">to</div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full p-2 border rounded-md"
                    value={localFilters.max_price}
                    onChange={(e) => handleChange('max_price', e.target.value)}
                  />
                  <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                </div>
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <div className="grid grid-cols-3 gap-2 sm:block">
                {bedroomOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm border transition-colors
                      ${
                        localFilters.bedrooms === option.value
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }
                      sm:w-full sm:mb-1 sm:last:mb-0
                    `}
                    onClick={() => handleChange('bedrooms', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div className="grid grid-cols-2 gap-2 sm:block">
                {propertyTypes.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm border transition-colors
                      ${
                        localFilters.property_type === option.value
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }
                      sm:w-full sm:mb-1 sm:last:mb-0
                    `}
                    onClick={() => handleChange('property_type', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 md:justify-end">
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
    </div>
  );
}