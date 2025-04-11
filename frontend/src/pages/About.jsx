import { Building, Home, ShieldCheck, Users, Award, MapPin, Globe, Leaf, Target, CircleUser } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useSEO from "@/hooks/useSeo";

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
  // SEO Implementation
  useSEO({
    title: "About Visit Masvingo | Real Estate & Tourism Development",
    description: "Discover how Visit Masvingo is transforming Zimbabwe's heritage city through innovative real estate projects and destination marketing. Meet our expert team.",
    url: typeof window !== 'undefined' ? window.location.href : 'https://visitmasvingo.com/about',
    image: "https://visitmasvingo.com/images/masvingo-about-og.jpg",
    type: "website",
    keywords: "Masvingo real estate, Zimbabwe property development, Visit Masvingo team, Masvingo tourism, urban development Zimbabwe",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "headline": "About Visit Masvingo",
      "description": "Learn about our mission to transform Masvingo through real estate and tourism development",
      "publisher": {
        "@type": "Organization",
        "name": "Visit Masvingo",
        "logo": {
          "@type": "ImageObject",
          "url": "https://visitmasvingo.com/logo.jpg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://visitmasvingo.com/about"
      }
    }
  });

  const teamMembers = [
    {
      name: "Tendai Moyo",
      role: "Founder & CEO",
      bio: "20+ years experience in Masvingo real estate development",
      image: "/team/tendai-moyo.jpg"
    },
    {
      name: "Rumbidzai Chiweshe",
      role: "Sales Director",
      bio: "Specializes in luxury properties and investment opportunities",
      image: "/team/rumbidzai-chiweshe.jpg"
    },
    {
      name: "Tatenda Ndlovu",
      role: "Property Manager",
      bio: "Oversees rentals and property maintenance services",
      image: "/team/tatenda-ndlovu.jpg"
    },
    {
      name: "Nyasha Chinkono",
      role: "IT Systems Administrator",
      bio: "Leads our digital transformation initiatives",
      image: "/team/nyasha-chinkono.jpg"
    }
  ];

  const stats = [
    { value: "100+", label: "Projects Developed", icon: <Building className="h-8 w-8" /> },
    { value: "2021", label: "Year Founded", icon: <Award className="h-8 w-8" /> },
    { value: "95%", label: "Client Satisfaction", icon: <ShieldCheck className="h-8 w-8" /> },
    { value: "4", label: "Core Departments", icon: <Users className="h-8 w-8" /> }
  ];

  const goals = [
    { 
      icon: <Home className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />,
      text: "Deliver high-quality, affordable, and eco-conscious property developments"
    },
    { 
      icon: <ShieldCheck className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />,
      text: "Embrace technology to enhance real estate systems and transparency"
    },
    { 
      icon: <MapPin className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />,
      text: "Promote tourism through strategic branding and local engagement"
    },
    { 
      icon: <Users className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />,
      text: "Attract both local and diaspora investment to Masvingo"
    },
    { 
      icon: <Leaf className={`h-5 w-5 mt-0.5 ${colors.accentText} flex-shrink-0`} />,
      text: "Build inclusive partnerships and drive youth empowerment"
    }
  ];

  return (
    <div className={`${colors.light} min-h-screen`}>
      {/* Hero Section */}
      <header className={`relative ${colors.dark} text-white py-20`}>
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
      </header>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <article className={`max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16`}>
          <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
            <Building className={`h-8 w-8 ${colors.accentText}`} />
            Our Story
          </h2>
          <div className={`prose ${colors.lightText} space-y-4`}>
            <p>
              Founded in <strong>2021</strong>, Visit Masvingo is a future-focused company reshaping <strong>Masvingo, Zimbabwe</strong> through real estate development and destination marketing. Operating under our flagship brand, Masvingo Properties, we focus on building inclusive, modern communities while promoting the region's rich cultural heritage.
            </p>
            <p>
              We are committed to <strong>sustainable urban growth</strong>, investment empowerment, and transforming Masvingo into a premier destination for living, business, and tourism in Zimbabwe.
            </p>
            <p>
              Our team combines <strong>deep local knowledge</strong> with innovative approaches to create vibrant spaces that honor Masvingo's heritage while embracing modern living standards.
            </p>
          </div>
        </article>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16" aria-label="Company achievements">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow`}>
              <div className={`${colors.accentText} mb-3 flex justify-center`}>
                {stat.icon}
              </div>
              <div className={`text-3xl font-bold ${colors.darkText} mb-2`}>{stat.value}</div>
              <div className={colors.secondaryText}>{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Vision & Mission */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <article className="bg-white rounded-xl shadow-lg p-8">
            <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
              <Target className={`h-8 w-8 ${colors.accentText}`} />
              Our Vision
            </h2>
            <div className={`prose ${colors.lightText} space-y-4`}>
              <p>
                To be the <strong>leading force</strong> behind Masvingo's urban transformation and global recognition through innovative real estate and impactful visitor experiences.
              </p>
            </div>
          </article>
          <article className="bg-white rounded-xl shadow-lg p-8">
            <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
              <Globe className={`h-8 w-8 ${colors.accentText}`} />
              Our Mission
            </h2>
            <div className={`prose ${colors.lightText} space-y-4`}>
              <p>
                To develop <strong>vibrant, tech-enabled communities</strong> while promoting Masvingo as a top-tier destination for residential living, business, and tourism in Zimbabwe.
              </p>
            </div>
          </article>
        </section>

        {/* Goals Section */}
        <article className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className={`text-3xl font-bold ${colors.darkText} mb-6 flex items-center gap-3`}>
            <Award className={`h-8 w-8 ${colors.accentText}`} />
            Our 2025 Strategic Goals
          </h2>
          <ul className={`space-y-4 ${colors.lightText}`}>
            {goals.map((goal, index) => (
              <li key={index} className="flex items-start gap-3">
                {goal.icon}
                <span>{goal.text}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Team Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className={`text-3xl font-bold ${colors.darkText} mb-6`}>Our Leadership Team</h2>
          <div className={`prose ${colors.lightText} space-y-4 mb-8`}>
            <p>
              Our <strong>Masvingo-based team</strong> combines decades of local real estate experience with fresh perspectives in technology and marketing to drive innovation in Zimbabwe's property sector.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" itemScope itemType="https://schema.org/Person">
            {teamMembers.map((member, index) => (
              <div key={index} className={`${colors.light} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow`} itemScope>
                <div className={`${colors.primary} p-8 flex justify-center`}>
                  <img 
                    src={member.image} 
                    alt={`Portrait of ${member.name}`} 
                    className="h-16 w-16 rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold ${colors.darkText} mb-1`} itemProp="name">{member.name}</h3>
                  <p className={`${colors.secondaryText} mb-3`} itemProp="jobTitle">{member.role}</p>
                  <p className={colors.lightText} itemProp="description">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={`${colors.dark} text-white rounded-xl shadow-lg p-12 text-center`}>
          <h2 className="text-3xl font-bold mb-4">Join Us in Building Masvingo's Future</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Whether you're looking to invest, find a home, or explore tourism opportunities, we're your trusted partners in Masvingo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className={`bg-white ${colors.primaryText} hover:bg-blue-100 px-8 py-4 text-lg`}>
              View Properties
            </Button>
            <Button variant="outline" className={`bg-white ${colors.primaryText} hover:bg-blue-100 px-8 py-4 text-lg`}>
              Contact Our Team
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}