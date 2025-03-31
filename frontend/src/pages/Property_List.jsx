import React, { useEffect, useState } from 'react';
import { fetchProperties } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';

export default function PropertyListing() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters] = useState({}); // Removed unused setFilters for now

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchProperties();
        
        // Ensure we have an array before setting state
        if (Array.isArray(response?.data || response)) {
          setProperties(response.data || response);
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setError(error.message || 'Failed to load properties');
        setProperties([]); // Reset to empty array
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []); // Empty dependency array for initial load

  if (loading) return <div className="p-4">Loading properties...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!properties || properties.length === 0) {
    return <div className="p-4">No properties available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}