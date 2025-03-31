import { Building, Home, ShieldCheck, Users, Award, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Tendai Moyo",
      role: "Founder & CEO",
      bio: "20+ years in Masvingo real estate, expert in residential properties",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Rumbidzai Chiweshe",
      role: "Sales Director",
      bio: "Specializes in luxury properties and investment opportunities",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Tatenda Ndlovu",
      role: "Property Manager",
      bio: "Oversees rentals and property maintenance services",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  const stats = [
    { value: "500+", label: "Properties Sold", icon: <Home className="h-8 w-8" /> },
    { value: "12", label: "Years Experience", icon: <Award className="h-8 w-8" /> },
    { value: "98%", label: "Client Satisfaction", icon: <ShieldCheck className="h-8 w-8" /> },
    { value: "50+", label: "Neighborhoods Served", icon: <MapPin className="h-8 w-8" /> }
  ];

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Building className="h-12 w-12 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">About Masvingo Properties</h1>
            <p className="text-xl text-blue-100">
              Your trusted real estate partner in Masvingo since 2010
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-600" />
            Our Story
          </h2>
          <div className="prose text-blue-700 space-y-4">
            <p>
              Founded in 2010 by Tendai Moyo, Masvingo Properties began as a small local real estate office with 
              a vision to transform property transactions in the region. What started as a one-person operation 
              has grown into Masvingo's most trusted real estate agency, serving thousands of satisfied clients.
            </p>
            <p>
              Over the past decade, we've helped over 500 families find their dream homes while establishing 
              ourselves as market leaders in property valuation, sales, and rentals. Our deep understanding of 
              Masvingo's unique neighborhoods sets us apart from national chains.
            </p>
            <p>
              We take pride in our community roots and actively participate in local development initiatives. 
              Our agents live in the communities they serve, giving you insider knowledge you won't find elsewhere.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-blue-600 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">{stat.value}</div>
              <div className="text-blue-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              Our Mission
            </h2>
            <div className="prose text-blue-700 space-y-4">
              <p>
                To empower our clients through exceptional real estate services that combine local expertise 
                with innovative solutions, creating lasting value in every transaction.
              </p>
              <p>
                We believe finding the right property should be exciting, not stressful. That's why we've 
                built a team that genuinely cares about matching people with places they'll love.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Our Values
            </h2>
            <ul className="space-y-4 text-blue-700">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                <span><strong>Integrity:</strong> Honest advice you can trust</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                <span><strong>Local Knowledge:</strong> Deep understanding of Masvingo's neighborhoods</span>
              </li>
              <li className="flex items-start gap-3">
                <Award className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                <span><strong>Excellence:</strong> Going above and beyond in every transaction</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                <span><strong>Community:</strong> Investing in the places we serve</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-blue-700">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white rounded-xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your dream property?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team is here to guide you through every step of your real estate journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-blue-900 hover:bg-blue-100 px-8 py-4 text-lg">
              Browse Properties
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}