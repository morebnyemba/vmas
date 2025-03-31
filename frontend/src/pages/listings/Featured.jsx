import { Star, Home, BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FeaturedListings() {
  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Waterfront Villa",
      price: 750000,
      beds: 5,
      baths: 4,
      area: 420,
      location: "Lakeview Estate",
      features: ["Pool", "Smart Home", "Waterfront"],
      premium: true
    },
    {
      id: 2,
      title: "Executive Penthouse",
      price: 650000,
      beds: 3,
      baths: 3,
      area: 280,
      location: "CBD Tower",
      features: ["Panoramic Views", "Concierge", "Gym Access"],
      premium: true
    },
    {
      id: 3,
      title: "Historic Manor House",
      price: 890000,
      beds: 6,
      baths: 4,
      area: 550,
      location: "Heritage District",
      features: ["Original Features", "Large Garden", "Private Gate"],
      premium: true
    },
    {
      id: 4,
      title: "Modern Eco Home",
      price: 520000,
      beds: 4,
      baths: 3,
      area: 320,
      location: "Green Valley",
      features: ["Solar Panels", "Rainwater Harvesting", "EV Charging"],
      premium: false
    }
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-full p-3 mb-4">
          <Star className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Featured Properties</h1>
        <p className="text-lg text-blue-700 max-w-2xl mx-auto">
          Our premium selection of exceptional properties in Masvingo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredProperties.map((property) => (
          <div 
            key={property.id} 
            className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all relative ${property.premium ? 'border-yellow-300' : 'border-blue-100'}`}
          >
            {property.premium && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="premium" className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  Premium
                </Badge>
              </div>
            )}
            
            <div className="relative h-64 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary">
                  Featured
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                {property.title}
                {property.premium && <Star className="h-5 w-5 text-yellow-500 fill-yellow-200" />}
              </h3>
              
              <p className="text-blue-600 font-bold text-xl mb-4">
                ${property.price.toLocaleString()}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" /> {property.beds} beds
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" /> {property.baths} baths
                </span>
                <span className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" /> {property.area}m²
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {property.location}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1">
                  Contact Agent
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Want your property featured here?</h2>
        <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
          Our featured listings get 3x more views than regular properties. 
          Contact us to learn about our premium marketing packages.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
          <Star className="mr-2 h-5 w-5" />
          Upgrade to Featured
        </Button>
      </div>
    </div>
  );
}