import { Building, Home, ShieldCheck, Users, Award, MapPin, Globe, Leaf, Target, CircleUser } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Color constants for consistency
const colors = {
  primary: 'bg-blue-800',
  primaryText: 'text-blue-800',
  secondary: 'bg-blue-600',
  secondaryText: 'text-blue-600',
  accent: 'bg-blue-400',
  accentText: 'text-blue-400',
  light: 'bg-blue-50',
  lightText: 'text-blue-700',
  dark: 'bg-blue-900',
  darkText: 'text-blue-900',
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Tendai Moyo",
      role: "Founder & CEO",
      bio: "20+ years in Masvingo real estate, expert in residential properties",
    },
    {
      name: "Rumbidzai Chiweshe",
      role: "Sales Director",
      bio: "Specializes in luxury properties and investment opportunities",
    },
    {
      name: "Tatenda Ndlovu",
      role: "Property Manager",
      bio: "Oversees rentals and property maintenance services",
    },
    {
      name: "Nyasha Chinkono",
      role: "IT Systems Administrator",
      bio: "Leads our digital transformation and technology infrastructure",
    }
  ];

  const stats = [
    { value: "100+", label: "Projects Developed", icon: <Building className="h-8 w-8" /> },
    { value: "2021", label: "Year Founded", icon: <Award className="h-8 w-8" /> },
    { value: "95%", label: "Client Satisfaction", icon: <ShieldCheck className="h-8 w-8" /> },
    { value: "4", label: "Core Departments", icon: <Users className="h-8 w-8" /> }
  ];

  return (
    <div className={`${colors.light} min-h-screen`}>
      {/* Hero Section */}
      <div className={`relative ${colors.dark} text-white py-20`}>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Building className="h-12 w-12 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">About Visit Masvingo</h1>
            <p className="text-xl text-blue-200">
              Shaping Masvingo's future through real estate and destination marketing
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className={`max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16`}>
          <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
            <Building className={`h-8 w-8 ${colors.accentText}`} />
            Our Story
          </h2>
          <div className={`prose ${colors.lightText} space-y-4`}>
            <p>
              Founded in 2021, Visit Masvingo is a future-focused company reshaping Masvingo, Zimbabwe through real estate development and destination marketing. Operating under our flagship brand, Masvingo Properties, we focus on building inclusive, modern communities and promoting the region's rich cultural heritage.
            </p>
            <p>
              We are committed to sustainable urban growth, investment empowerment, and transforming Masvingo into a place where people want to live, invest, and explore.
            </p>
            <p>
              Our team combines deep local knowledge with innovative approaches to create vibrant spaces that honor Masvingo's heritage while embracing modern living standards.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow`}>
              <div className={`${colors.accentText} mb-3 flex justify-center`}>
                {stat.icon}
              </div>
              <div className={`text-3xl font-bold ${colors.darkText} mb-2`}>{stat.value}</div>
              <div className={colors.secondaryText}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
              <Target className={`h-8 w-8 ${colors.accentText}`} />
              Our Vision
            </h2>
            <div className={`prose ${colors.lightText} space-y-4`}>
              <p>
                To be the leading force behind Masvingo's urban transformation and global recognition—through innovative real estate and impactful visitor experiences.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
              <Globe className={`h-8 w-8 ${colors.accentText}`} />
              Our Mission
            </h2>
            <div className={`prose ${colors.lightText} space-y-4`}>
              <p>
                To develop vibrant, tech-enabled communities while promoting Masvingo as a top-tier destination for residential living, business, and tourism.
              </p>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
            <Award className={`h-8 w-8 ${colors.accentText}`} />
            Our Goals
          </h2>
          <ul className={`space-y-4 ${colors.lightText}`}>
            <li className="flex items-start gap-3">
              <Home className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />
              <span>Deliver high-quality, affordable, and eco-conscious property developments</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />
              <span>Embrace technology to enhance real estate systems, transparency, and service</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />
              <span>Promote tourism through strategic branding and local engagement</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />
              <span>Attract both local and diaspora investment</span>
            </li>
            <li className="flex items-start gap-3">
              <Leaf className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />
              <span>Build inclusive partnerships and drive youth empowerment through innovation</span>
            </li>
          </ul>
        </div>

        {/* Team & Technology */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className={`text-3xl font-bold ${colors.darkText} mb-6`}>Our Team & Technology Focus</h2>
          <div className={`prose ${colors.lightText} space-y-4 mb-8`}>
            <p>
              Led by a team of dedicated Directors and professionals across key departments—real estate, marketing, finance, operations, and research—we are passionate about building Masvingo's future.
            </p>
            <p>
              We proudly embrace technology and innovation to modernize how we plan, build, and communicate. From smart property systems to digital platforms, our organization is built for the future.
            </p>
          </div>
          
          <h3 className={`text-2xl font-bold ${colors.darkText} mb-6 text-center`}>Key Team Members</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className={`${colors.light} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow`}>
                <div className={`${colors.primary} p-8 flex justify-center`}>
                  <CircleUser className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold ${colors.darkText} mb-1`}>{member.name}</h3>
                  <p className={`${colors.secondaryText} mb-3`}>{member.role}</p>
                  <p className={colors.lightText}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`${colors.dark} text-white rounded-xl shadow-lg p-12 text-center`}>
          <h2 className="text-3xl font-bold mb-4">Partner with us in building Masvingo's future</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Whether you're an investor, homeowner, or visitor, we're your trusted partners for a brighter Masvingo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className={`bg-white ${colors.primaryText} hover:bg-blue-100 px-8 py-4 text-lg`}>
              Explore Properties
            </Button>
            <Button variant="outline" className={`bg-white ${colors.primaryText} hover:bg-blue-100 px-8 py-4 text-lg`}>
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}