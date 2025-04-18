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
import { FaWhatsapp } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyDetails } from '@/api/properties';

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
      <div className="bg-blue-50 min-h-screen">
        <div className="container py-12 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-3/4 mb-6 bg-blue-100" />
          <Skeleton className="aspect-video w-full rounded-xl mb-8 bg-blue-100" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className={`h-4 w-${(3 - i) * 25} bg-blue-100`} />
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full bg-blue-100" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl bg-blue-100" />
              <Skeleton className="h-48 w-full rounded-xl bg-blue-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-blue-900 mb-2">Error loading property</h3>
          <p className="text-blue-600 mb-6">{error}</p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const images = property.primary_image
    ? [property.primary_image, ...(property.images || [])]
    : property.images || [];

  const locationDisplay = [property.city, property.state].filter(Boolean).join(', ');

  const featureIcons = {
    'wifi': <Wifi className="h-5 w-5 mr-2 text-blue-600" />,
    'parking': <ParkingSquare className="h-5 w-5 mr-2 text-blue-600" />,
    'air conditioning': <Snowflake className="h-5 w-5 mr-2 text-blue-600" />,
    'gym': <Dumbbell className="h-5 w-5 mr-2 text-blue-600" />,
    'pet friendly': <PawPrint className="h-5 w-5 mr-2 text-blue-600" />,
    'furnished': <Home className="h-5 w-5 mr-2 text-blue-600" />,
    'pool': <Layers className="h-5 w-5 mr-2 text-blue-600" />
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">{property.title}</h1>
              {locationDisplay && (
                <div className="flex items-center text-blue-600 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{locationDisplay}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="text-sm bg-green-100 text-green-800">{property.status_display || 'Available'}</Badge>
              <Badge className={`text-sm ${property.listing_type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {property.listing_type_display || 'For Rent'}
              </Badge>
              {property.featured && (
                <Badge className="text-sm bg-yellow-100 text-yellow-800">Featured</Badge>
              )}
            </div>
          </div>
        </header>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="mb-8">
            <Carousel className="w-full rounded-xl overflow-hidden shadow-lg border border-blue-100">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <img
                        src={img.image_url}
                        alt={`${property.title} - View ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading={index > 0 ? "lazy" : "eager"}
                      />
                      {img.is_primary && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 bg-white text-blue-600 hover:bg-blue-50 border-blue-200" />
                  <CarouselNext className="right-4 bg-white text-blue-600 hover:bg-blue-50 border-blue-200" />
                </>
              )}
            </Carousel>
          </section>
        )}

        {/* Videos */}
        {property.videos?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Property Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.videos.map((video, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-blue-100">
                  <video controls className="w-full aspect-video">
                    <source src={video.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            {/* Price & Facts */}
            <article className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-blue-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">
                    ${property.price.toLocaleString()} {property.listing_type === 'rent' ? '/ month' : ''}
                  </h2>
                  {property.viewing_fee && (
                    <p className="text-sm text-blue-600 mt-1">
                      Viewing fee: ${property.viewing_fee.toLocaleString()}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-blue-50" aria-label="Share this property">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 border-t border-b border-blue-200 py-4 mb-4">
                <div className="flex items-center text-blue-700"><Bed className="h-5 w-5 mr-2 text-blue-600" />{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</div>
                <div className="flex items-center text-blue-700"><Bath className="h-5 w-5 mr-2 text-blue-600" />{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</div>
                {property.area && <div className="flex items-center text-blue-700"><Ruler className="h-5 w-5 mr-2 text-blue-600" />{property.area.toLocaleString()} sq.ft</div>}
              </div>

              {/* Description */}
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Description</h3>
              <p className="text-blue-700 mb-4 whitespace-pre-line">{property.description || 'No description available.'}</p>

              {/* Features */}
              {property.features?.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {property.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {featureIcons[feature.name.toLowerCase()] || <Star className="h-5 w-5 mr-2 text-blue-600" />}
                        <span className="text-blue-700 capitalize">{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Nearby */}
              {property.property_places?.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Nearby Places</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {property.property_places.map((place, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-900">{place.place_name}</h4>
                        <p className="text-sm text-blue-600">{place.place_type_display}</p>
                        <p className="text-sm text-blue-600">{place.distance} km away</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </article>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <article className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Schedule a Viewing</h3>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
  <Calendar className="h-5 w-5 mr-2" />
  Schedule Viewing
</Button>

<Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
  <Star className="h-5 w-5 mr-2" />
  Save For Later
</Button>

<Button variant="outline" className="w-full mt-3 border-green-500 text-green-700 hover:bg-green-50">
  <FaWhatsapp className="h-5 w-5 mr-2" />
  Whatsapp Instant Discussion
</Button>

<Button variant="outline" className="w-full mt-3 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
  <Home className="h-5 w-5 mr-2" />
  Claim this Property
</Button>
</article>

            <article className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-blue-600">Property Type</span><span className="font-medium text-blue-900">{property.property_type_display}</span></div>
                <div className="flex justify-between"><span className="text-blue-600">Status</span><span className="font-medium text-blue-900">{property.status_display}</span></div>
                <div className="flex justify-between"><span className="text-blue-600">Listed</span><span className="font-medium text-blue-900">{new Date(property.created_at).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-blue-600">Last Updated</span><span className="font-medium text-blue-900">{new Date(property.updated_at).toLocaleDateString()}</span></div>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </div>
  );
}
