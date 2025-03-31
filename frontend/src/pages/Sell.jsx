import { HandCoins, LineChart, ClipboardList, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SellPage() {
  const sellingSteps = [
    {
      step: 1,
      title: "Valuation",
      description: "Free market appraisal",
      icon: <LineChart className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Preparation",
      description: "Professional photography & listing",
      icon: <ClipboardList className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Marketing",
      description: "Multi-channel promotion",
      icon: <Home className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Viewings",
      description: "Organized property showings",
      icon: <Phone className="h-6 w-6" />
    }
  ];

  const agentTeam = [
    { name: "Tendai Moyo", experience: "10+ years", specialty: "Luxury Homes" },
    { name: "Anesu Ndlovu", experience: "7 years", specialty: "Commercial Property" },
    { name: "Rumbi Chiweshe", experience: "5 years", specialty: "Land Sales" }
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-full p-3 mb-4">
          <HandCoins className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Sell Your Property</h1>
        <p className="text-lg text-blue-700 max-w-2xl mx-auto">
          Maximize your property's value with our expert selling services
        </p>
      </div>

      {/* Selling Process */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {sellingSteps.map((step) => (
          <div key={step.step} className="border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Valuation CTA */}
      <div className="bg-blue-50 rounded-xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Get Your Free Valuation</h2>
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Property Address" 
              className="w-full p-3 rounded-lg border border-blue-200"
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="w-full p-3 rounded-lg border border-blue-200"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full">
            Request Valuation
          </Button>
        </div>
      </div>

      {/* Agent Team */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Sales Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agentTeam.map((agent, index) => (
            <div key={index} className="border rounded-xl p-6 text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
              <Badge variant="secondary" className="mb-2">
                {agent.experience} experience
              </Badge>
              <p className="text-gray-600">{agent.specialty}</p>
              <Button variant="outline" className="mt-4 w-full border-blue-200">
                Contact Agent
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-blue-900 text-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-l-4 border-blue-400 pl-4">
            <blockquote className="text-lg italic mb-2">
              "Masvingo Properties sold our home for 15% above market value in just 3 weeks!"
            </blockquote>
            <p className="font-medium">- The Moyo Family</p>
          </div>
          <div className="border-l-4 border-blue-400 pl-4">
            <blockquote className="text-lg italic mb-2">
              "Professional service from start to finish. Highly recommend their sales team."
            </blockquote>
            <p className="font-medium">- ABC Developers</p>
          </div>
        </div>
      </div>
    </div>
  );
}