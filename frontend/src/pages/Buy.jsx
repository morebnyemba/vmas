import { Bed, Bath, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BuyPage() {
  const properties = [
    { 
      id: 1, 
      title: "Luxury Waterfront Villa", 
      price: 350000, 
      beds: 4, 
      baths: 3,
      location: "Masvingo Heights",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      id: 2, 
      title: "Modern City Apartment", 
      price: 180000, 
      beds: 2, 
      baths: 2,
      location: "Central Masvingo",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80"
    },
    { 
      id: 3, 
      title: "Suburban Family Home", 
      price: 275000, 
      beds: 3, 
      baths: 2,
      location: "Rhodene Estate",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      id: 4, 
      title: "Lakeside Cottage", 
      price: 220000, 
      beds: 3, 
      baths: 2,
      location: "Lakeview Estate",
      image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      id: 5, 
      title: "Executive Penthouse", 
      price: 420000, 
      beds: 3, 
      baths: 3,
      location: "CBD Towers",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
    },
    { 
      id: 6, 
      title: "Gated Community House", 
      price: 310000, 
      beds: 4, 
      baths: 3,
      location: "Greenview Estate",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Premium Properties For Sale</h1>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Discover your dream home from our exclusive collection of luxury properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-red-500" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-blue-900">{property.title}</h2>
                  <p className="text-lg font-bold text-blue-600">${property.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center text-blue-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-blue-600 mb-6">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.baths} Baths</span>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View Property Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}