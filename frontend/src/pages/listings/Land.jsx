import { Map, Ruler, TreePine, Mountain, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandListings() {
  const landProperties = [
    {
      id: 1,
      title: "Lakeview Residential Plot",
      price: 85000,
      size: "2.5 acres",
      zoning: "Residential",
      features: ["Waterfront", "Cleared", "Road Access"],
      location: "Shagashe River",
      terrain: "Flat"
    },
    {
      id: 2,
      title: "Commercial Development Land",
      price: 220000,
      size: "5 acres",
      zoning: "Commercial",
      features: ["Main Road Frontage", "Utilities Available", "High Visibility"],
      location: "Along Masvingo-Harare Road",
      terrain: "Slight Slope"
    },
    {
      id: 3,
      title: "Agricultural Farmland",
      price: 150000,
      size: "20 acres",
      zoning: "Agricultural",
      features: ["Arable Soil", "Borehole", "Fenced"],
      location: "Mushandike Area",
      terrain: "Rolling Hills"
    },
    {
      id: 4,
      title: "Bushveld Hunting Property",
      price: 350000,
      size: "100 acres",
      zoning: "Conservation",
      features: ["Wildlife", "Lodge Potential", "Waterhole"],
      location: "Gutu District",
      terrain: "Mixed"
    }
  ];

  const terrainIcons = {
    Flat: <Ruler className="h-5 w-5 text-blue-600" />,
    'Slight Slope': <Mountain className="h-5 w-5 text-blue-600" />,
    'Rolling Hills': <TreePine className="h-5 w-5 text-blue-600" />,
    'Mixed': <Droplets className="h-5 w-5 text-blue-600" />
  };

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Map className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-900">Land Listings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Button variant="outline" className="h-full py-8 border-blue-200">
          Residential Land
        </Button>
        <Button variant="outline" className="h-full py-8 border-blue-200">
          Commercial Land
        </Button>
        <Button variant="outline" className="h-full py-8 border-blue-200">
          Agricultural Land
        </Button>
        <Button variant="outline" className="h-full py-8 border-blue-200">
          Investment Land
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {landProperties.map((property) => (
          <div 
            key={property.id} 
            className="border border-blue-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="h-48 bg-gradient-to-br from-blue-50 to-green-50 relative">
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-white text-blue-600">
                  {property.zoning}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{property.title}</h3>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-600 font-bold text-lg">
                  ${property.price.toLocaleString()}
                </p>
                <p className="text-gray-600 flex items-center gap-1">
                  {terrainIcons[property.terrain]}
                  <span>{property.size}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{property.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {property.features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-blue-600 border-blue-200 bg-blue-50"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1 border-blue-300">
                  Map View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Land Buying Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Ruler className="h-5 w-5 text-blue-600" />
              Survey & Zoning
            </h3>
            <p className="text-sm text-gray-600">
              Understand survey requirements and zoning regulations before purchasing land.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <TreePine className="h-5 w-5 text-blue-600" />
              Terrain Assessment
            </h3>
            <p className="text-sm text-gray-600">
              Evaluate soil quality, slope, and natural features for your intended use.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              Utilities Access
            </h3>
            <p className="text-sm text-gray-600">
              Check availability of water, electricity, and road access to the property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}