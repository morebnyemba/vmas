import { 
    Bed, 
    Bath, 
    Ruler, 
    MapPin, 
    Heart, 
    Share2, 
    Phone, 
    Calendar,
    Mail 
  } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
  
  export default function PropertyDetailPage() {
    const property = {
      id: 1,
      title: "Luxury Waterfront Villa",
      price: 550000,
      address: "123 Lakeside Drive, Masvingo",
      beds: 4,
      baths: 3,
      sqft: 3200,
      description: "Stunning modern villa with panoramic lake views. This exquisite property features an open floor plan, gourmet kitchen, and expansive outdoor living spaces perfect for entertaining. The master suite includes a spa-like bathroom and private balcony overlooking the water.",
      features: [
        "Waterfront location",
        "Smart home system",
        "Infinity pool",
        "Private dock",
        "Solar panels",
        "Security system"
      ],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6"
      ],
      video: "https://www.youtube.com/embed/9xwazD5SyVg",
      agent: {
        name: "Tendai Moyo",
        phone: "+263 772 123 456",
        email: "tendai@masvingoproperties.co.zw",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    };
  
    return (
      <div className="bg-blue-50 min-h-screen">
        <div className="container py-8 px-4 sm:px-6 lg:px-8">
          {/* Property Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-900">{property.title}</h1>
            <div className="flex items-center text-blue-600 mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.address}</span>
            </div>
          </div>
  
          {/* Image Gallery */}
          <div className="mb-8">
            <Carousel className="w-full rounded-xl overflow-hidden shadow-lg">
              <CarouselContent>
                {property.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <img
                        src={`${img}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                        alt={`Property view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
  
          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Price & Quick Facts */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-blue-900">
                    ${property.price.toLocaleString()}
                  </h2>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
  
                <div className="flex flex-wrap gap-4 border-t border-b border-blue-100 py-4 mb-4">
                  <div className="flex items-center text-blue-700">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center text-blue-700">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center text-blue-700">
                    <Ruler className="h-5 w-5 mr-2" />
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
  
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Description</h3>
                <p className="text-blue-700 mb-4">{property.description}</p>
  
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                      <span className="text-blue-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Video Tour */}
              {property.video && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Video Tour</h3>
                  <div className="aspect-video w-full">
                    <iframe
                      src={property.video}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
  
            {/* Sidebar - Agent & Request */}
            <div className="space-y-6">
              {/* Request Viewing */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Request a Viewing</h3>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-4">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule a Tour
                </Button>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Agent
                </Button>
              </div>
  
              {/* Agent Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Listing Agent</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-blue-900">{property.agent.name}</h4>
                    <p className="text-sm text-blue-600">Masvingo Properties</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Mail className="h-5 w-5 mr-2" />
                    {property.agent.email}
                  </Button>
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Phone className="h-5 w-5 mr-2" />
                    {property.agent.phone}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }