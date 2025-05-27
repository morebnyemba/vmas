import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail, FiSend, FiClock, FiMessageCircle, FiLifeBuoy } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useSEO from "../hooks/useSEO";

// WhatsApp-themed color scheme
const colors = {
  primary: 'bg-gradient-to-r from-green-600 to-green-700',
  primaryText: 'text-green-700',
  secondary: 'bg-blue-600',
  secondaryText: 'text-blue-600',
  accent: 'bg-blue-400',
  accentText: 'text-blue-400',
  light: 'bg-blue-50',
  lightText: 'text-blue-700',
  dark: 'bg-gradient-to-r from-blue-900 to-blue-700',
  darkText: 'text-blue-900',
};

export default function ContactPage() {
  const whatsappNumber = "+263772123456";
  const businessHours = "Mon-Fri: 8am - 6pm | Sat: 9am - 1pm | Sun: Closed";

  // SEO Implementation
  useSEO({
    title: "24/7 WhatsApp Real Estate Support - Masvingo Properties",
    description: "Instant WhatsApp assistance from property experts. Get priority support for listings, viewings, and emergency services in Zimbabwe.",
    url: window.location.href,
    image: "/images/masvingo-contact-og.jpg",
    type: "website",
    keywords: "whatsapp real estate agent, Zimbabwe property chat, Masvingo whatsapp support, instant property consultation, emergency housing contact",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Masvingo Properties",
      "telephone": "+263772123456",
      "email": "info@visitmasvingo.co.zw",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main Street",
        "addressLocality": "Masvingo",
        "addressCountry": "ZW"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://facebook.com/masvingoproperties",
        "https://twitter.com/masvingoproperties"
      ]
    }
  });

  return (
    <div className={`${colors.light} min-h-screen`}>
      {/* WhatsApp Hero Section */}
      <section className={`relative ${colors.dark} text-white py-24`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90"></div>
        <div className="container px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center bg-white/10 p-6 rounded-full animate-pulse">
              <FaWhatsapp className="h-16 w-16 text-green-400" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              WhatsApp Our Property Experts
            </h1>
            <p className="text-xl text-blue-200 font-light">
              24/7 Priority Support • Instant Responses • Media Sharing Enabled
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-xl p-10 h-fit border border-blue-50">
            <h2 className={`text-3xl font-bold ${colors.darkText} mb-8 flex items-center gap-4`}>
              <span className="p-3 bg-green-100 rounded-lg">
                <FaWhatsapp className={`h-8 w-8 text-green-600`} />
              </span>
              Instant WhatsApp Support
            </h2>
            
            <div className={`space-y-8 ${colors.lightText}`}>
              {/* WhatsApp Priority Section */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <FaWhatsapp className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Dedicated Property Line</h3>
                    <p className="text-green-600">24/7 Availability</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  className={`${colors.primary} text-white py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="h-6 w-6" />
                  Start WhatsApp Chat Now
                </a>
                <div className="mt-4 text-sm text-green-700 space-y-1">
                  <p>✓ Typical response: <span className="font-semibold">Under 5 minutes</span></p>
                  <p>✓ Send photos/documents directly</p>
                  <p>✓ Emergency services available</p>
                </div>
              </div>

              {/* Alternative Contact Options */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-xl transition-colors">
                  <span className="p-2 bg-blue-100 rounded-md">
                    <FiPhone className={`h-6 w-6 ${colors.accentText}`} />
                  </span>
                  <div>
                    <p className="font-semibold text-lg">Phone Support</p>
                    <div className="mt-2 space-y-1">
                      <a href="tel:+263772123456" className="block hover:text-blue-800">
                        +263 772 123 456
                      </a>
                      <p className="text-sm text-red-600">
                        After Hours: +263 732 987 654
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-xl transition-colors">
                  <span className="p-2 bg-blue-100 rounded-md">
                    <FiMail className={`h-6 w-6 ${colors.accentText}`} />
                  </span>
                  <div>
                    <p className="font-semibold text-lg">Email Support</p>
                    <div className="mt-2 space-y-1">
                      <a href="mailto:info@visitmasvingo.co.zw" className="block hover:text-blue-800">
                        info@visitmasvingo.co.zw
                      </a>
                      <a href="mailto:emergency@visitmasvingo.co.zw" className="block hover:text-blue-800">
                        emergency@visitmasvingo.co.zw
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <span className="p-2 bg-blue-100 rounded-md">
                    <FiClock className={`h-6 w-6 ${colors.accentText}`} />
                  </span>
                  <div>
                    <p className="font-semibold text-lg">Office Hours</p>
                    <p className="mt-2">{businessHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-xl transition-colors">
                  <span className="p-2 bg-blue-100 rounded-md">
                    <FiMapPin className={`h-6 w-6 ${colors.accentText}`} />
                  </span>
                  <div>
                    <p className="font-semibold text-lg">Visit Our Office</p>
                    <p className="mt-2 leading-relaxed">
                      123 Main Street<br/>
                      Masvingo, Zimbabwe
                    </p>
                  </div>
                </div>
              </div>

              <Button className={`w-full ${colors.primary} hover:opacity-90 text-white gap-3 py-6 text-lg rounded-xl`}>
                <FiMapPin className="h-5 w-5" />
                Get Directions
              </Button>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-blue-50">
            <h2 className={`text-3xl font-bold ${colors.darkText} mb-8 flex items-center gap-4`}>
              <span className="p-3 bg-blue-100 rounded-lg">
                <FiSend className={`h-8 w-8 ${colors.accentText}`} />
              </span>
              Send Inquiry Form
            </h2>
            
            <form className="space-y-8">
              <div className="space-y-4">
                <label htmlFor="name" className={`text-lg font-medium ${colors.darkText}`}>
                  Full Name *
                </label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  className="h-14 text-lg rounded-lg border-blue-200 focus-visible:ring-green-600"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label htmlFor="email" className={`text-lg font-medium ${colors.darkText}`}>
                    Email *
                  </label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="your@email.com" 
                    className="h-14 text-lg rounded-lg border-blue-200 focus-visible:ring-green-600"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <label htmlFor="phone" className={`text-lg font-medium ${colors.darkText}`}>
                    Phone *
                  </label>
                  <Input 
                    id="phone"
                    type="tel" 
                    placeholder="+263 77 123 4567" 
                    className="h-14 text-lg rounded-lg border-blue-200 focus-visible:ring-green-600"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label htmlFor="message" className={`text-lg font-medium ${colors.darkText}`}>
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Describe your property needs..." 
                  rows={6}
                  className="text-lg rounded-lg border-blue-200 focus-visible:ring-green-600"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className={`w-full ${colors.primary} hover:opacity-90 text-white gap-3 py-6 text-lg rounded-xl`}
                >
                  <FiSend className="h-5 w-5" />
                  Send Inquiry
                </Button>
                <div className="text-center pt-4 border-t border-blue-100">
                  <p className={`text-sm ${colors.secondaryText}`}>
                    Need immediate assistance?{' '}
                    <a 
                      href={`https://wa.me/${whatsappNumber}`}
                      className="font-semibold text-green-600 hover:text-green-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat via WhatsApp now
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-50">
          <iframe
            title="Masvingo Properties Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.7714768843244!2d30.8324543153695!3d-20.0734864864936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDA0JzI0LjYiUyAzMMKwNTAnMDEuMSJF!5e0!3m2!1sen!2szw!4v1620000000000!5m2!1sen!2szw"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-xl"
          />
        </section>
      </main>
    </div>
  );
}