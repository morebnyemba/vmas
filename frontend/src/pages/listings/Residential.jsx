import { Home, BedDouble, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResidentialListings() {
  const properties = [
    { id: 1, title: "Modern Family Home", price: 285000, beds: 4, baths: 2, area: 180, location: "Rhodene" },
    { id: 2, title: "Townhouse", price: 195000, beds: 3, baths: 2, area: 140, location: "Mucheke" },
    { id: 3, title: "Luxury Apartment", price: 320000, beds: 2, baths: 2, area: 110, location: "CBD" },
    { id: 4, title: "Suburban Bungalow", price: 245000, beds: 3, baths: 1, area: 160, location: "Eastlea" },
  ];

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Home className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-900">Residential Listings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="h-48 bg-blue-100 relative">
              <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                For Sale
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{property.title}</h3>
              <p className="text-blue-600 font-bold text-lg mb-4">${property.price.toLocaleString()}</p>
              
              <div className="flex gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" /> {property.beds}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" /> {property.baths}
                </span>
                <span className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" /> {property.area}m²
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{property.location}</p>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Property
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}