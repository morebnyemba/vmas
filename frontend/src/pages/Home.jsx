import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import useSEO from '../hooks/useSeo';
import { defaultSEO } from '../config/seo';

// Animation variants
const cardVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
};

const testimonialVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
};

const ctaVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'backOut' } },
};

function Home() {
  // SEO Implementation with enhanced metadata
  useSEO({
    ...defaultSEO,
    title: 'Premium Real Estate and tourism in Masvingo',
    description: 'Discover luxury properties and real estate opportunities in Masvingo, Zimbabwe. Find your dream home with our expert team.',
    keywords: 'Masvingo properties, Zimbabwe real estate, luxury homes, buy property Zimbabwe',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Visit Masvingo",
      "image": "https://yourwebsite.com/logo.jpg",
      "@id": "https://yourwebsite.com",
      "url": "https://yourwebsite.com",
      "telephone": "+263123456789",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Property Lane",
        "addressLocality": "Masvingo",
        "addressRegion": "Masvingo",
        "postalCode": "0000",
        "addressCountry": "ZW"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-20.0735",
        "longitude": "30.8276"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "17:00"
      }
    }
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'message') setMessage(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');

    // In a real application, you would send this data to your backend
    console.log('Lead Data:', { name, email, message });

    // Simulate a successful submission
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmissionStatus('success');
      setTimeout(() => setSubmissionStatus(null), 3000);
    }, 1500);
  };

  // Intersection Observers for animations
  const [featuredRef, featuredInView] = useInView({ threshold: 0.2 });
  const featuredControls = useAnimation();

  const [testimonialRef, testimonialInView] = useInView({ threshold: 0.2 });
  const testimonialControls = useAnimation();

  const [ctaRef, ctaInView] = useInView({ threshold: 0.2 });
  const ctaControls = useAnimation();

  React.useEffect(() => {
    if (featuredInView) {
      featuredControls.start('animate');
    }
  }, [featuredInView, featuredControls]);

  React.useEffect(() => {
    if (testimonialInView) {
      testimonialControls.start('animate');
    }
  }, [testimonialInView, testimonialControls]);

  React.useEffect(() => {
    if (ctaInView) {
      ctaControls.start('animate');
    }
  }, [ctaInView, ctaControls]);

  return (
    <div className="overflow-hidden">
      <Hero />

      {/* Featured Properties Section */}
      <section className="py-16 bg-blue-50" ref={featuredRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="text-3xl font-bold text-blue-900 mb-4 lg:text-4xl"
            >
              Featured Properties
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
              className="text-lg text-blue-600"
            >
              Explore our curated selection of premium properties in Masvingo
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 grid-cols-1">
            {[
              {
                id: 1,
                title: "Luxury Villa",
                location: "Masvingo, Zimbabwe",
                price: "$550,000",
                beds: 4,
                baths: 3,
                description: "Stunning modern villa with panoramic views and premium amenities",
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
              },
              {
                id: 2,
                title: "Lakeview Estate",
                location: "Great Zimbabwe, Masvingo",
                price: "$420,000",
                beds: 3,
                baths: 2,
                description: "Beautiful estate with direct lake access and private dock",
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
              },
              {
                id: 3,
                title: "Executive Apartment",
                location: "Masvingo CBD",
                price: "$280,000",
                beds: 2,
                baths: 2,
                description: "Modern apartment in the heart of the city with premium finishes",
                image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
              }
            ].map((property) => (
              <motion.div
                key={property.id}
                variants={cardVariants}
                initial="initial"
                animate={featuredControls}
              >
                <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={`${property.title} in ${property.location}`}
                      className="w-full h-60 object-cover rounded-t-xl"
                      loading="lazy"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                      For Sale
                    </Badge>
                  </div>
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-bold text-blue-900 mb-2">
                      {property.title}
                    </CardTitle>
                    <div className="flex items-center text-blue-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{property.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-blue-900 font-medium">
                        {property.price}
                      </div>
                      <div className="flex items-center text-sm text-blue-600">
                        <Bed className="h-4 w-4 mr-1" /> {property.beds} beds
                        <Bath className="h-4 w-4 mr-1 ml-4" /> {property.baths} baths
                      </div>
                    </div>
                    <CardDescription className="text-blue-600">
                      {property.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white" ref={testimonialRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="text-3xl font-bold text-blue-900 mb-4 lg:text-4xl"
            >
              Client Testimonials
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
              className="text-lg text-blue-600"
            >
              Hear what our satisfied clients say about our Masvingo properties
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 grid-cols-1">
            {[
              {
                id: 1,
                name: "John Doe",
                role: "Property Investor",
                testimonial: "The team at Visit Masvingo made finding our dream home effortless. Their knowledge of the local market is unmatched.",
                rating: 5
              },
              {
                id: 2,
                name: "Jane Smith",
                role: "First-time Buyer",
                testimonial: "As someone new to property investment, I appreciated their patience and guidance throughout the entire process.",
                rating: 5
              }
            ].map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={testimonialVariants}
                initial="initial"
                animate={testimonialControls}
              >
                <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <CardTitle className="text-lg font-bold text-blue-900">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="text-blue-600">
                          {testimonial.role}
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-blue-600 mb-4 italic">
                      "{testimonial.testimonial}"
                    </p>
                    <div className="flex items-center text-blue-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Lead Capture Form */}
      <section className="py-20 bg-blue-900 relative overflow-hidden" ref={ctaRef}>
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
          variants={ctaVariants}
          initial="initial"
          animate={ctaControls}
        >
          <h2 className="text-3xl font-bold text-white mb-6 lg:text-4xl">
            Ready to Find Your Dream Property in Masvingo?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Let our local experts help you find the perfect property in Zimbabwe's historic heartland.
          </p>

          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Get in Touch</h3>
            {submissionStatus === 'success' && (
              <div className="bg-green-200 text-green-800 py-2 px-4 rounded mb-4">
                Thank you! Your message has been received. We'll contact you shortly.
              </div>
            )}
            {submissionStatus === 'error' && (
              <div className="bg-red-200 text-red-800 py-2 px-4 rounded mb-4">
                Oops! Something went wrong. Please try again later.
              </div>
            )}
            {submissionStatus !== 'success' && (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">What type of property are you looking for?</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={message}
                      onChange={handleInputChange}
                      className="w-full"
                      rows={4}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
                    disabled={submissionStatus === 'submitting'}
                  >
                    {submissionStatus === 'submitting' ? 'Submitting...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;