import { 
  Bed, 
  Bath, 
  Ruler, 
  MapPin, 
  Share2, 
  Phone, 
  Calendar,
  Mail,
  Star,
  Home,
  Layers,
  ParkingSquare,
  Wifi,
  Snowflake,
  Dumbbell,
  PawPrint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router-dom';
import { getPropertyDetails } from '@/api/properties';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await getPropertyDetails(id);
        setProperty(data);
      } catch (err) {
        setError(err.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Skeleton className="aspect-video w-full rounded-xl mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading property</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  // Create an images array from the primary_image
  const images = property.primary_image ? [property.primary_image] : [];
  const features = property.features || []; // Add this fallback

  const featureIcons = {
    'wifi': <Wifi className="h-5 w-5 mr-2 text-primary" />,
    'parking': <ParkingSquare className="h-5 w-5 mr-2 text-primary" />,
    'air conditioning': <Snowflake className="h-5 w-5 mr-2 text-primary" />,
    'gym': <Dumbbell className="h-5 w-5 mr-2 text-primary" />,
    'pet friendly': <PawPrint className="h-5 w-5 mr-2 text-primary" />,
    'furnished': <Home className="h-5 w-5 mr-2 text-primary" />,
    'pool': <Layers className="h-5 w-5 mr-2 text-primary" />
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.city}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-sm bg-green-100 text-green-800">
              {property.status_display || 'Available'}
            </Badge>
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-8">
            <Carousel className="w-full rounded-xl overflow-hidden shadow-lg">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <img
                        src={img.image}
                        alt={`Property view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Price & Quick Facts */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    ${property.price}
                  </h2>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-100">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 border-t border-b border-gray-200 py-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <Bed className="h-5 w-5 mr-2 text-primary" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Bath className="h-5 w-5 mr-2 text-primary" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 mb-4">
                {property.description || 'No description available.'}
              </p>

              {features.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        {featureIcons[feature.toLowerCase()] || (
                          <Star className="h-5 w-5 mr-2 text-primary" />
                        )}
                        <span className="text-gray-700 capitalize">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Agent & Request */}
          <div className="space-y-6">
            {/* Request Viewing */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule a Viewing</h3>
              <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
                <Calendar className="h-5 w-5 mr-2" />
                Book a Tour
              </Button>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                <Phone className="h-5 w-5 mr-2" />
                Call Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}