import { Home, BedDouble, Bath, MapPin, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RentPage() {
  const rentalProperties = [
    {
      id: 1,
      title: "Modern CBD Apartment",
      price: 1200,
      beds: 2,
      baths: 2,
      size: 85,
      location: "City Center",
      amenities: ["Furnished", "Pool", "24/7 Security"]
    },
    {
      id: 2,
      title: "Suburban Family Home",
      price: 850,
      beds: 3,
      baths: 2,
      size: 140,
      location: "Rhodene",
      amenities: ["Garden", "Parking", "Pet Friendly"]
    },
    {
      id: 3,
      title: "Executive Penthouse",
      price: 2500,
      beds: 2,
      baths: 2,
      size: 110,
      location: "Mucheke Heights",
      amenities: ["Panoramic Views", "Gym", "Concierge"]
    },
    {
      id: 4,
      title: "Cozy Studio Flat",
      price: 600,
      beds: 1,
      baths: 1,
      size: 45,
      location: "Eastlea",
      amenities: ["Furnished", "Utilities Included"]
    }
  ];

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Home className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-900">Rental Properties</h1>
      </div>

      {/* Filters */}
      <div className="bg-blue-50 rounded-lg p-4 mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Price Range:</span>
          <Button variant="outline" className="border-blue-200">
            $500 - $1000
          </Button>
          <Button variant="outline" className="border-blue-200">
            $1000 - $2000
          </Button>
          <Button variant="outline" className="border-blue-200">
            $2000+
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Property Type:</span>
          <Button variant="outline" className="border-blue-200">
            Apartments
          </Button>
          <Button variant="outline" className="border-blue-200">
            Houses
          </Button>
          <Button variant="outline" className="border-blue-200">
            Studios
          </Button>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rentalProperties.map((property) => (
          <div key={property.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-blue-100 relative">
              <Badge variant="secondary" className="absolute top-4 left-4">
                Available Now
              </Badge>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{property.title}</h3>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-600 font-bold text-lg">
                  ${property.price}/month
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ruler className="h-4 w-4" />
                  {property.size}m²
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{property.location}</span>
              </div>

              <div className="flex gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" /> {property.beds} beds
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" /> {property.baths} baths
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {property.amenities.map((amenity, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-blue-600 border-blue-200 bg-blue-50"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Schedule Viewing
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}