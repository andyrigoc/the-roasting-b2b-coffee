import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { localCoffeeProducts } from "@/data/coffeeProducts";

const steps = [
  "Business Information",
  "Coffee Needs",
  "Contact Details",
  "Delivery",
  "Confirmation"
];

export default function SampleRequestForm({ onSubmitted }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    location: "",
    currentSupplier: "",
    coffeeVolume: "",
    interestedProducts: [],
    name: "",
    email: "",
    phone: "",
    position: "",
    deliveryAddress: "",
    preferredDeliveryTime: "",
    comments: ""
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductInterest = (product, checked) => {
    if (checked) {
      updateFormData("interestedProducts", [...formData.interestedProducts, product]);
    } else {
      updateFormData("interestedProducts", formData.interestedProducts.filter(p => p !== product));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { base44 } = await import("@/api/base44Client");
    const body = `
New Sample Request from ${formData.name} (${formData.email})

Business: ${formData.businessName} — ${formData.businessType} — ${formData.location}
Current Supplier: ${formData.currentSupplier || "N/A"}
Monthly Volume: ${formData.coffeeVolume}
Products of Interest: ${formData.interestedProducts.join(", ") || "None specified"}
Position: ${formData.position || "N/A"}
Phone: ${formData.phone || "N/A"}
Delivery Address: ${formData.deliveryAddress}
Preferred Delivery Time: ${formData.preferredDeliveryTime || "N/A"}
Comments: ${formData.comments || "None"}
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: "info@theroastingltd.co.uk",
      subject: `New Sample Request — ${formData.businessName}`,
      body
    });
    onSubmitted();
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/30">
      {/* Progress Bar */}
      <div className="bg-black/5 px-6 py-4">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-sm font-medium ${
                index <= currentStep ? 'text-[#622700]' : 'text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#622700] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Step 1: Business Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-2 title-card"
                >
                  Tell us about your business
                </h2>
                <p 
                  className="text-gray-600"
                >
                  Help us understand your café or restaurant
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => updateFormData("businessName", e.target.value)}
                    placeholder="Your café or restaurant name"
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent-cafe">Independent Café</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail Location</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="City, Region"
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="currentSupplier">Current Coffee Supplier (Optional)</Label>
                  <Input
                    id="currentSupplier"
                    value={formData.currentSupplier}
                    onChange={(e) => updateFormData("currentSupplier", e.target.value)}
                    placeholder="Who do you currently buy from?"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Coffee Needs */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-2 title-card"
                >
                  Your coffee needs
                </h2>
                <p 
                  className="text-gray-600"
                >
                  What type of coffee are you looking for?
                </p>
              </div>

              <div>
                <Label htmlFor="coffeeVolume">Monthly Coffee Volume</Label>
                <Select value={formData.coffeeVolume} onValueChange={(value) => updateFormData("coffeeVolume", value)}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="How much coffee do you use monthly?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10kg">Under 10kg</SelectItem>
                    <SelectItem value="10-25kg">10-25kg</SelectItem>
                    <SelectItem value="25-50kg">25-50kg</SelectItem>
                    <SelectItem value="50-100kg">50-100kg</SelectItem>
                    <SelectItem value="over-100kg">Over 100kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Products of Interest</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {localCoffeeProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={product.id}
                        checked={formData.interestedProducts.includes(product.commercial_name)}
                        onCheckedChange={(checked) => handleProductInterest(product.commercial_name, checked)}
                      />
                      <Label htmlFor={product.id} className="font-normal">{product.commercial_name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-2 title-card"
                >
                  Contact information
                </h2>
                <p 
                  className="text-gray-600"
                >
                  How can we reach you?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Your name"
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position/Role</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => updateFormData("position", e.target.value)}
                    placeholder="Owner, Manager, Head Barista, etc."
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your.email@business.com"
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="+44 20 7123 4567"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Delivery */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-2 title-card"
                >
                  Sample delivery
                </h2>
                <p 
                  className="text-gray-600"
                >
                  Where should we send your free samples?
                </p>
              </div>

              <div>
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => updateFormData("deliveryAddress", e.target.value)}
                  placeholder="Full address including postcode"
                  className="h-24 rounded-2xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="preferredDeliveryTime">Preferred Delivery Time</Label>
                <Select value={formData.preferredDeliveryTime} onValueChange={(value) => updateFormData("preferredDeliveryTime", value)}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="When works best for you?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => updateFormData("comments", e.target.value)}
                  placeholder="Any specific requirements or questions?"
                  className="h-24 rounded-2xl"
                />
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-2 title-card"
                >
                  Review your request
                </h2>
                <p 
                  className="text-gray-600"
                >
                  Please confirm your details before submitting
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Details</h3>
                  <p className="text-sm text-gray-600">
                    {formData.businessName} • {formData.businessType} • {formData.location}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-sm text-gray-600">
                    {formData.name} • {formData.email} • {formData.phone}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Coffee Interest</h3>
                  <p className="text-sm text-gray-600">
                    {formData.coffeeVolume} monthly • {formData.interestedProducts.join(", ") || "No specific products selected"}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 
                  className="font-semibold text-blue-900 mb-2 title-card"
                >
                  What happens next?
                </h3>
                <ul 
                  className="text-sm text-blue-800 space-y-1"
                >
                  <li>• We'll contact you within 24 hours</li>
                  <li>• Free samples delivered to your door</li>
                  <li>• Personalized tasting notes included</li>
                  <li>• Follow-up call to discuss your needs</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-[#622700] hover:bg-[#4a1e00] flex items-center gap-2 rounded-full"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-[#622700] hover:bg-[#4a1e00] flex items-center gap-2 rounded-full"
            >
              Submit Request
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
