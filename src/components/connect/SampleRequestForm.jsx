import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { localCoffeeProducts } from "@/data/coffeeProducts";
import { submitSampleRequest } from "@/services/sampleRequests";

const steps = [
  "Business Information",
  "Coffee Needs",
  "Contact Details",
  "Delivery",
  "Confirmation"
];

const requiredFieldsByStep = [
  ["businessName", "businessType", "location"],
  ["coffeeVolume"],
  ["name", "email"],
  ["deliveryAddress"],
  [],
];

const fieldLabels = {
  businessName: "Business name",
  businessType: "Business type",
  location: "Location",
  coffeeVolume: "Monthly coffee volume",
  name: "Full name",
  email: "Email address",
  deliveryAddress: "Delivery address",
};

export default function SampleRequestForm({ onSubmitted }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
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
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleProductInterest = (product, checked) => {
    if (checked) {
      updateFormData("interestedProducts", [...formData.interestedProducts, product]);
    } else {
      updateFormData("interestedProducts", formData.interestedProducts.filter(p => p !== product));
    }
  };

  const validateStep = (step) => {
    const errors = {};

    requiredFieldsByStep[step].forEach((field) => {
      if (!String(formData[field] || "").trim()) {
        errors[field] = `${fieldLabels[field]} is required.`;
      }
    });

    if (step === 2 && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && validateStep(currentStep)) {
      setSubmitError("");
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

    if (isSubmitting) {
      return;
    }

    const firstInvalidStep = requiredFieldsByStep.findIndex((fields, step) => {
      if (fields.some((field) => !String(formData[field] || "").trim())) return true;
      return step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    });

    if (firstInvalidStep !== -1) {
      setCurrentStep(firstInvalidStep);
      validateStep(firstInvalidStep);
      setSubmitError("Please review the required fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await submitSampleRequest(formData);
      onSubmitted(result);
    } catch (error) {
      setSubmitError(error.message || "We could not send your request right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        {Object.keys(fieldErrors).length > 0 && (
          <div className="mb-6 rounded-xl border border-[#9b5528]/30 bg-[#f8eee5] px-4 py-3 text-sm text-[#622700]" role="alert">
            Please complete the required fields before continuing.
          </div>
        )}
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
                <Label htmlFor="coffeeVolume">Monthly Coffee Volume *</Label>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="blend-specification-summary"
                      checked={formData.interestedProducts.includes("Summary of product specifications for blends")}
                      onCheckedChange={(checked) => handleProductInterest("Summary of product specifications for blends", checked)}
                    />
                    <Label htmlFor="blend-specification-summary" className="font-normal">
                      Summary of product specifications for blends
                    </Label>
                  </div>
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

              <div className="overflow-hidden rounded-2xl bg-[#201e20] text-white shadow-lg">
                <div className="border-b border-white/10 px-6 py-5">
                <h3 
                  className="font-semibold text-white title-card"
                >
                  What happens next?
                </h3>
                <p className="mt-1 text-sm text-white/65">A simple, personal process from request to tasting.</p>
                </div>
                <ul 
                  className="grid gap-px bg-white/10 sm:grid-cols-3"
                >
                  <li className="flex gap-3 bg-[#201e20] px-5 py-5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c99058] text-xs font-bold text-[#201e20]">1</span>
                    <span className="pt-1 text-sm text-white/80">We'll contact you within 24 hours</span>
                  </li>
                  <li className="flex gap-3 bg-[#201e20] px-5 py-5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c99058] text-xs font-bold text-[#201e20]">2</span>
                    <span className="pt-1 text-sm text-white/80">We'll select coffees for your business</span>
                  </li>
                  <li className="flex gap-3 bg-[#201e20] px-5 py-5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c99058] text-xs font-bold text-[#201e20]">3</span>
                    <span className="pt-1 text-sm text-white/80">We'll arrange delivery and follow up</span>
                  </li>
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
              disabled={isSubmitting}
              className="bg-[#622700] hover:bg-[#4a1e00] flex items-center gap-2 rounded-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Request
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>

        {submitError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
      </form>
    </div>
  );
}
