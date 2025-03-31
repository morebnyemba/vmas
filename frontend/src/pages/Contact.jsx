import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Contact Our Team</h1>
          <p className="text-lg text-blue-600">
            Get in touch with our real estate experts for personalized assistance
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              Our Office
            </h2>
            
            <div className="space-y-4 text-blue-700 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium">123 Main Street</p>
                  <p>Masvingo, Zimbabwe</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <a href="tel:+263772123456" className="hover:text-blue-900">
                  +263 772 123 456
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <a href="mailto:info@visitmasvingo.co.zw" className="hover:text-blue-900">
                  info@visitmasvingo.co.zw
                </a>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
              <MapPin className="h-4 w-4" />
              Get Directions
            </Button>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Send className="h-6 w-6 text-blue-600" />
              Send a Message
            </h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-blue-900">
                  Your Name
                </label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  className="focus-visible:ring-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-blue-900">
                  Email Address
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com" 
                  className="focus-visible:ring-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-blue-900">
                  Phone Number (Optional)
                </label>
                <Input 
                  id="phone"
                  type="tel" 
                  placeholder="+263 77 123 4567" 
                  className="focus-visible:ring-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-blue-900">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  placeholder="How can we help you today?" 
                  rows={5}
                  className="focus-visible:ring-blue-300"
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.7714768843244!2d30.8324543153695!3d-20.0734864864936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDA0JzI0LjYiUyAzMMKwNTAnMDEuMSJF!5e0!3m2!1sen!2szw!4v1620000000000!5m2!1sen!2szw"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-xl"
          ></iframe>
        </div>
      </div>
    </div>
  );
}