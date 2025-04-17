import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ChevronLeft, Home, MapPin, Ruler, Bed, Bath, User, Mail, Phone } from "lucide-react";

const ADMIN_WHATSAPP_NUMBER = '+263779752635'; // Admin's WhatsApp number in international format

const Spinner = ({ className }) => (
  <svg className={`animate-spin h-4 w-4 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

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
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
      </div>
    </div>
  );
};

const PropertyPreview = ({ data }) => (
  <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
    <h3 className="text-lg font-medium mb-4 flex items-center">
      <Ruler className="w-5 h-5 mr-2 text-blue-600" />
      Property Preview
    </h3>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center">
        <Home className="w-5 h-5 mr-2 text-gray-600" />
        <span className="capitalize">{data.propertyType || 'N/A'}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-sm">{data.address || 'N/A'}</span>
      </div>
      <div className="flex items-center">
        <Bed className="w-5 h-5 mr-2 text-gray-600" />
        <span>{data.bedrooms || '0'} beds</span>
      </div>
      <div className="flex items-center">
        <Bath className="w-5 h-5 mr-2 text-gray-600" />
        <span>{data.bathrooms || '0'} baths</span>
      </div>
      <div className="flex items-center col-span-2">
        <Ruler className="w-5 h-5 mr-2 text-gray-600" />
        <span>{data.area || '0'} sq.ft</span>
      </div>
    </div>

    {data.description && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium mb-2 text-gray-600">Description</h4>
        <p className="text-gray-600 text-sm">{data.description}</p>
      </div>
    )}
  </div>
);

const ContactPreview = ({ data }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-medium mb-4 flex items-center">
      <User className="w-5 h-5 mr-2 text-blue-600" />
      Contact Preview
    </h3>
    
    <div className="grid grid-cols-1 gap-3">
      <div className="flex items-center">
        <User className="w-5 h-5 mr-2 text-gray-600" />
        <span>{data.contactName}</span>
      </div>
      <div className="flex items-center">
        <Mail className="w-5 h-5 mr-2 text-gray-600" />
        <span>{data.contactEmail}</span>
      </div>
      <div className="flex items-center">
        <Phone className="w-5 h-5 mr-2 text-gray-600" />
        <span>{data.contactPhone}</span>
      </div>
    </div>
  </div>
);

const createWhatsAppMessage = (propertyData) => {
  const message = `New Property Listing Request:\n
*Property Type:* ${propertyData.propertyType}
*Address:* ${propertyData.address}
*Bedrooms:* ${propertyData.bedrooms || 'N/A'}
*Bathrooms:* ${propertyData.bathrooms || 'N/A'}
*Area:* ${propertyData.area || 'N/A'} sq.ft
*Description:* ${propertyData.description || 'N/A'}

*Contact Info:*
Name: ${propertyData.contactName}
Email: ${propertyData.contactEmail}
Phone: ${propertyData.contactPhone}`;

  return encodeURIComponent(message.trim());
};

export default function SellFlow() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
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
  const [registrationForm, setRegistrationForm] = useState({
    email: '',
    password: ''
  });
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('sellFlowData');
    if (savedData) setPropertyData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem('sellFlowData', JSON.stringify(propertyData));
  }, [propertyData]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!propertyData.propertyType) newErrors.propertyType = 'Required';
    if (!propertyData.address.trim()) newErrors.address = 'Required';
    if (!propertyData.contactName.trim()) newErrors.contactName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(propertyData.contactEmail)) newErrors.contactEmail = 'Invalid email';
    if (!propertyData.contactPhone || !isValidPhoneNumber(propertyData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handlePhoneChange = (value) => {
    setPropertyData(prev => ({ ...prev, contactPhone: value }));
    if (errors.contactPhone) setErrors(prev => ({ ...prev, contactPhone: '' }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setStep(2);
      setIsSubmitting(false);
    }, 500);
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    
    if (!registrationForm.email || !registrationForm.password) {
      setRegistrationError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send WhatsApp message to admin
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${createWhatsAppMessage(propertyData)}`;
      window.open(whatsappUrl, '_blank');
      
      setStep(3);
    } catch (error) {
      setRegistrationError('Account creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSubmission = () => {
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${createWhatsAppMessage(propertyData)}`;
    window.open(whatsappUrl, '_blank');
    setStep(3);
  };

  const handleBack = () => step > 1 && setStep(step - 1);

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
          <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-md mx-auto">
            <PropertyPreview data={propertyData} />
            <ContactPreview data={propertyData} />
          </div>
          <p className="text-lg text-gray-600 mb-6">
            {registrationForm.email 
              ? "Your property has been submitted and your account has been created. We'll contact you shortly."
              : "Your property has been submitted. Our team will contact you shortly."}
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 1 ? 'Property Details' : 'Account Setup'}
        </h2>
        <p className="text-gray-600">
          {step === 1 ? 'Tell us about your property' : 'Choose how to track your listing'}
        </p>
      </div>

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
                aria-label="Property type"
              >
                <SelectTrigger className={`w-full ${errors.propertyType ? 'border-red-500' : ''}`}>
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
              {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
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
                onKeyDown={handleKeyDown}
                placeholder="Street address, city, state"
                className={errors.address ? 'border-red-500' : ''}
                required
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Property Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <Input
                    type="number"
                    name="bedrooms"
                    value={propertyData.bedrooms}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown}
                    placeholder="0"
                    min="0"
                  />
                </div>
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
                onKeyDown={handleKeyDown}
              />
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium mb-2 text-gray-600">Preview</h3>
                <p className="text-gray-600 text-sm">
                  {propertyData.description || 'Description preview will appear here...'}
                </p>
              </div>
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
                    onKeyDown={handleKeyDown}
                    placeholder="Your name"
                    className={errors.contactName ? 'border-red-500' : ''}
                    required
                  />
                  {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
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
                      onKeyDown={handleKeyDown}
                      placeholder="your@email.com"
                      className={errors.contactEmail ? 'border-red-500' : ''}
                      required
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="ZW"
                      value={propertyData.contactPhone}
                      onChange={handlePhoneChange}
                      placeholder="Enter phone number"
                      className={`${errors.contactPhone ? 'border-red-500' : ''} 
                        rounded-md border border-input bg-background px-3 py-2 
                        text-sm ring-offset-background file:border-0 file:bg-transparent 
                        file:text-sm file:font-medium placeholder:text-muted-foreground 
                        focus-visible:outline-none focus-visible:ring-2 
                        focus-visible:ring-ring focus-visible:ring-offset-2`}
                      error={errors.contactPhone ? 'Invalid phone number' : undefined}
                    />
                    {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Spinner className="mr-2" />
                    Submitting...
                  </div>
                ) : 'Continue'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <PropertyPreview data={propertyData} />
          <ContactPreview data={propertyData} />

          <div className="mt-8">
            {showRegistrationForm ? (
              <form onSubmit={handleAccountCreation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={registrationForm.email}
                    onChange={handleRegistrationChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={registrationForm.password}
                    onChange={handleRegistrationChange}
                    required
                  />
                </div>

                {registrationError && (
                  <p className="text-red-500 text-sm">{registrationError}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowRegistrationForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Spinner className="mr-2" />
                        Creating Account...
                      </div>
                    ) : 'Create Account'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                  How would you like to proceed?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-24 bg-blue-600 hover:bg-blue-700 flex flex-col"
                    onClick={() => setShowRegistrationForm(true)}
                    disabled={isSubmitting}
                  >
                    <span className="font-bold text-lg">Create Account</span>
                    <span className="text-sm font-normal">Save preferences & track progress</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-24 border-gray-300 hover:bg-gray-50 flex flex-col"
                    onClick={handleGuestSubmission}
                    disabled={isSubmitting}
                  >
                    <span className="font-bold text-lg">Continue as Guest</span>
                    <span className="text-sm font-normal">Submit via WhatsApp</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}