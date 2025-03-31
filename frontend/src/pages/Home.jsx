import React from 'react';
import { Hero } from '../components/hero';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '../components/ui/avatar';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Star 
} from 'lucide-react';

function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      
      {/* Featured Properties Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 lg:text-4xl">
              Featured Properties
            </h2>
            <p className="text-lg text-blue-600">
              Explore our curated selection of premium properties
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 grid-cols-1">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
                    alt="Property"
                    className="w-full h-60 object-cover rounded-t-xl"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                    For Sale
                  </Badge>
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-blue-900 mb-2">
                    Luxury Villa
                  </CardTitle>
                  <div className="flex items-center text-blue-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Masvingo, Zimbabwe</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-blue-900 font-medium">
                      $550,000
                    </div>
                    <div className="flex items-center text-sm text-blue-600">
                      <Bed className="h-4 w-4 mr-1" /> 4 beds
                      <Bath className="h-4 w-4 mr-1 ml-4" /> 3 baths
                    </div>
                  </div>
                  <CardDescription className="text-blue-600">
                    Stunning modern villa with panoramic views and premium amenities
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 lg:text-4xl">
              Client Testimonials
            </h2>
            <p className="text-lg text-blue-600">
              Hear what our satisfied clients say about us
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 grid-cols-1">
            {[1, 2].map((item) => (
              <Card key={item} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <CardTitle className="text-lg font-bold text-blue-900">
                        John Doe
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        Property Investor
                      </CardDescription>
                    </div>
                  </div>
                  <p className="text-blue-600 mb-4">
                    "The team at Visit Masvingo made finding our dream home effortless. 
                    Their professionalism and attention to detail were exceptional."
                  </p>
                  <div className="flex items-center text-blue-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-6 lg:text-4xl">
            Start Your Property Journey Today
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us guide you through every step of finding and securing your ideal property
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-blue-900 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg">
              Browse Properties
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-blue-900 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg"
            >
              Contact Agent
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;