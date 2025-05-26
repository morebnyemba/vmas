import {
  Bed,
  Bath,
  Ruler,
  MapPin,
  Share2,
  Star,
  Home,
  Layers,
  ParkingSquare,
  Wifi,
  Snowflake,
  Dumbbell,
  PawPrint,
  Video,
  Users,
  Calendar,
  X
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyDetails } from '@/api/properties';
import { toast } from 'sonner';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [viewingType, setViewingType] = useState('in_person');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const [date] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const availableTimes = viewingType === 'virtual' ? 
    ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'] :
    ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
     '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

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

  const handleScheduleViewing = () => {
    if (!time || attendees < 1 || attendees > 5) {
      toast.error('Please complete all required fields');
      return;
    }

    navigate('/checkout', {
      state: {
        amount: property.viewing_fee || 20,
        currency: 'USD',
        purpose: 'property_viewing',
        propertyData: {
          id: property.id,
          title: property.title,
          address: [property.address_line1, property.city, property.state].filter(Boolean).join(', '),
          price: property.price,
          listing_type: property.listing_type,
          image: property.primary_image?.image_url || property.images?.[0]?.image_url
        },
        viewingDetails: {
          date: format(date, 'yyyy-MM-dd'),
          time,
          type: viewingType,
          attendees: parseInt(attendees),
          specialInstructions: document.getElementById('special-instructions')?.value || ''
        }
      }
    });
  };

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
            <X className="h-6 w-6 text-red-600" />
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

        {property.videos?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Property Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.videos.map((video, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-blue-100 relative group"
                >
                  <video 
                    controls 
                    className="w-full aspect-video object-cover"
                    poster={video.thumbnail_url || property.primary_image?.image_url}
                  >
                    <source src={video.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    Video {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
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

              <h3 className="text-xl font-semibold text-blue-900 mb-3">Description</h3>
              <p className="text-blue-700 mb-4 whitespace-pre-line">{property.description || 'No description available.'}</p>

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

          <aside className="space-y-6">
            <article className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Schedule a Viewing</h3>
              <Button 
                onClick={() => setShowScheduleModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Viewing (${property.viewing_fee || 20} fee)
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

{/* Schedule Viewing Modal */}
<Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
    <DialogHeader>
      <DialogTitle className="text-blue-900">Schedule Your Viewing</DialogTitle>
      <p className="text-sm text-blue-600 mt-1">
        Viewings available for {format(date, 'EEEE, MMMM do')} only
      </p>
    </DialogHeader>

    {/* Scrollable Content */}
    <div className="overflow-y-auto flex-1 pr-2 pb-4">
      <div className="space-y-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-700" />
            <span className="font-medium text-blue-800">
              {format(date, 'EEEE, MMMM do')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-700" />
            <span className="font-medium text-blue-800">
              {viewingType === 'virtual' ? 'Virtual' : 'In-Person'} Viewing
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-800 mb-2">Viewing Type</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={viewingType === 'in_person' ? 'default' : 'outline'}
              className={`${viewingType === 'in_person' ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-700'}`}
              onClick={() => setViewingType('in_person')}
            >
              <Users className="h-4 w-4 mr-2" />
              In-Person
            </Button>
            <Button
              variant={viewingType === 'virtual' ? 'default' : 'outline'}
              className={`${viewingType === 'virtual' ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-700'}`}
              onClick={() => setViewingType('virtual')}
            >
              <Video className="h-4 w-4 mr-2" />
              Virtual
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-800 mb-2">Select Time</h4>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map((slot) => (
              <Button
                key={slot}
                variant={time === slot ? 'default' : 'outline'}
                className={`${time === slot ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-700'}`}
                onClick={() => setTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Number of Attendees (1-5)
          </h4>
          <input
            type="number"
            min="1"
            max="5"
            value={attendees}
            onChange={(e) => {
              const value = Math.max(1, Math.min(5, parseInt(e.target.value) || 1));
              setAttendees(value);
            }}
            className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Special Instructions (optional)
          </h4>
          <textarea
            id="special-instructions"
            className="w-full p-2 border border-blue-200 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any special requests or accessibility needs..."
          />
        </div>
      </div>
    </div>

    {/* Fixed Footer */}
    <div className="pt-4 border-t border-blue-200 bg-white">
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
          onClick={() => setShowScheduleModal(false)}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleScheduleViewing}
          disabled={!time || attendees < 1 || attendees > 5}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
      </div>
    </div>
  );
}