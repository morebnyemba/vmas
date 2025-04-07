import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Bath, Bed, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PropertyCard({
  id,
  title,
  price,
  bedrooms,
  bathrooms,
  city,
  propertyType,
  listingType,
  status,
  imageUrl,
  isFeatured
}) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-100">
      <div className="relative">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFeatured && (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              Featured
            </Badge>
          )}
          <Badge className={`${listingType === 'For Rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} hover:bg-opacity-90`}>
            {listingType}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg text-blue-900 truncate">{title}</h3>
        <p className="text-sm text-blue-600 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {city}
        </p>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-blue-900">${price}</span>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            {propertyType}
          </Badge>
        </div>
        
        <div className="flex gap-4 text-sm text-blue-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {bedrooms} beds
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {bathrooms} baths
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2">
        <Badge variant={status === 'Available' ? "default" : "destructive"} className={status === 'Available' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>
          {status}
        </Badge>
        <Button 
          variant="outline" 
          size="sm"
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
          onClick={() => navigate(`/properties/${id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}