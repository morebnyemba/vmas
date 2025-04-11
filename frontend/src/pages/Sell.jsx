import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ChevronLeft, Home, MapPin, Ruler, Bed, Bath } from "lucide-react";

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Property Details" },
    { number: 2, label: "Account Setup" },
    { number: 3, label: "Complete" }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center w-1/3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full 
              ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
              ${currentStep === step.number ? 'ring-4 ring-blue-200' : ''}`}>
              {currentStep > step.number ? <CheckCircle className="h-4 w-4" /> : step.number}
            </div>
            <span className={`text-sm mt-2 text-center ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 h-0.5 bg-blue-600 transform -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}>
        </div>
      </div>
    </div>
  );
};

export default function SellFlow() {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    propertyType: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [registrationChoice, setRegistrationChoice] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProperty = (e) => {
    e.preventDefault();
    if (!propertyData.propertyType || !propertyData.address) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmitRegistrationChoice = (choice) => {
    setRegistrationChoice(choice);
    setStep(3);
    console.log('Submitting:', { ...propertyData, registrationChoice: choice });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial Property' }
  ];

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-6">
            {registrationChoice === 'register' 
              ? "Your property has been submitted and your account has been created. We'll contact you shortly."
              : "Your property has been submitted. Our team will contact you shortly."}
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <ProgressBar currentStep={step} />
      
      <div className="flex justify-between items-center mb-6">
        {step > 1 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <div className="flex-1 text-right">
          <span className="text-sm text-gray-500">
            Step {step} of 2
          </span>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmitProperty} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type <span className="text-red-500">*</span>
              </label>
              <Select 
                onValueChange={(value) => setPropertyData(prev => ({ ...prev, propertyType: value }))}
                value={propertyData.propertyType}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="address"
                value={propertyData.address}
                onChange={handleChange}
                placeholder="Street address, city, state"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  name="bedrooms"
                  value={propertyData.bedrooms}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <Input
                  type="number"
                  name="bathrooms"
                  value={propertyData.bathrooms}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (sq.ft)
                </label>
                <Input
                  type="number"
                  name="area"
                  value={propertyData.area}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                value={propertyData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows={4}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="contactName"
                    value={propertyData.contactName}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="contactEmail"
                      value={propertyData.contactEmail}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="contactPhone"
                      value={propertyData.contactPhone}
                      onChange={handleChange}
                      placeholder="+263 123 456 789"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Create Account for Updates
          </h2>
          
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <Home className="h-5 w-5 text-gray-500 mr-2" />
                <span className="font-medium capitalize">{propertyData.propertyType}</span>
              </div>
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">{propertyData.address}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Track your listing progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="h-24 bg-blue-600 hover:bg-blue-700 flex flex-col"
                  onClick={() => handleSubmitRegistrationChoice('register')}
                >
                  <span className="font-bold text-lg">Create Account</span>
                  <span className="text-sm font-normal">Save preferences & track progress</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-24 border-gray-300 hover:bg-gray-50 flex flex-col"
                  onClick={() => handleSubmitRegistrationChoice('no-register')}
                >
                  <span className="font-bold text-lg">Continue as Guest</span>
                  <span className="text-sm font-normal">Just submit this listing</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}