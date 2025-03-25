import React from 'react';
import { Hero } from '../components/Hero';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function Home() {
  return (
    <div>
      <Hero />
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Properties</h2>
          <div className="grid gap-6 md:grid-cols-3 grid-cols-1">
            {/* Example Property Card */}
            <Card className="bg-white p-4 rounded-lg shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80"
                alt="Property"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-2">Luxury Villa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">Located in the heart of the city, this luxury villa offers stunning views and modern amenities.</CardDescription>
              </CardContent>
              <CardFooter>
                <Button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">View Details</Button>
              </CardFooter>
            </Card>
            {/* Repeat for more properties */}
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Testimonials</h2>
          <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
            {/* Example Testimonial */}
            <Card className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">"This real estate service helped me find my dream home quickly and easily. Highly recommended!"</CardDescription>
                <CardTitle className="font-bold">- John Doe</CardTitle>
              </CardContent>
            </Card>
            {/* Repeat for more testimonials */}
          </div>
        </div>
      </section>
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="mb-6">Contact us today to get started on your journey to finding the perfect property.</p>
          <Button className="py-3 px-6 bg-white text-blue-600 rounded hover:bg-gray-200">Get Started</Button>
        </div>
      </section>
    </div>
  );
}

export default Home;