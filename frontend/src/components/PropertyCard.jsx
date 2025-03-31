// PropertyCard.jsx
import React from 'react';

export default function PropertyCard({ property }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img 
        src={property.image_url || '/default-property.jpg'} 
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{property.title}</h3>
        <p className="text-gray-600">{property.address}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="font-bold">${property.price.toLocaleString()}</span>
          <span>{property.bedrooms} beds</span>
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          View Details
        </button>
      </div>
    </div>
  );
}