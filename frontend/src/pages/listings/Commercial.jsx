import { Building2, SquareParking, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommercialListings() {
  const properties = [
    { id: 1, title: "Office Space", type: "Office", size: "500m²", parking: 10, price: 450000 },
    { id: 2, title: "Retail Shop", type: "Retail", size: "120m²", parking: 2, price: 320000 },
    { id: 3, title: "Warehouse", type: "Industrial", size: "2000m²", parking: 5, price: 890000 },
    { id: 4, title: "Mixed-Use Building", type: "Mixed", size: "800m²", parking: 8, price: 650000 },
  ];

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Building2 className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-900">Commercial Properties</h1>
      </div>

      <div className="space-y-6">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="w-full md:w-64 h-48 bg-blue-100 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold mb-2">{property.title}</h3>
              <p className="text-blue-600 font-bold text-lg mb-4">${property.price.toLocaleString()}</p>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" /> {property.type}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {property.size}
                </span>
                <span className="flex items-center gap-1">
                  <SquareParking className="h-4 w-4" /> {property.parking} spaces
                </span>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}