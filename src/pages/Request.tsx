import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PrimaryButton from "@/components/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Upload } from "lucide-react";

const Request = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: searchParams.get("service") || "",
    description: "",
    preferredDate: "",
    preferredTime: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zip: searchParams.get("zip") || "",
    image: null as File | null,
  });

  const services = [
    "Plumbing",
    "Electrical",
    "House Cleaning",
    "AC Repair",
    "Appliance Repair",
    "Painting",
    "Handyman",
    "Pest Control",
    "Lawn Care",
    "Moving",
  ];

  const timeSlots = [
    "Morning (8AM - 12PM)",
    "Afternoon (12PM - 5PM)",
    "Evening (5PM - 8PM)",
    "Emergency (ASAP)",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create WhatsApp message
    const message = `
New Service Request:
Service: ${formData.service}
Description: ${formData.description}
Preferred Date: ${formData.preferredDate}
Preferred Time: ${formData.preferredTime}
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}, ${formData.city}, ${formData.zip}
    `.trim();

    // Redirect to success page and send WhatsApp message
    setStep(4);

    // Open WhatsApp
    setTimeout(() => {
      window.open(
        `https://wa.me/17622218208?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }, 1000);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="font-heading text-3xl mb-4">
                  Request Submitted!
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Thanks! Our team will call you within minutes to confirm your
                  service details.
                </p>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-heading font-semibold mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-left space-y-2 text-muted-foreground">
                    <li>
                      • We'll call you at {formData.phone} within 5 minutes
                    </li>
                    <li>• Confirm service details and scheduling</li>
                    <li>• Connect you with a local licensed professional</li>
                    <li>• Your pro will arrive at the scheduled time</li>
                  </ul>
                </div>
              </div>

              <PrimaryButton onClick={() => (window.location.href = "/")}>
                Return Home
              </PrimaryButton>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">
                  {step === 1 && "Service Details"}
                  {step === 2 && "Schedule & Contact"}
                  {step === 3 && "Address & Final Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Service Details */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service">
                          What service do you need?
                        </Label>
                        <Select
                          value={formData.service}
                          onValueChange={(value) =>
                            handleInputChange("service", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem
                                key={service}
                                value={service.toLowerCase()}
                              >
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">
                          Describe the issue or task
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Please provide details about what you need help with..."
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="image">Upload a photo (optional)</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="image"
                            className="text-primary cursor-pointer hover:underline"
                          >
                            Click to upload an image
                          </label>
                          {formData.image && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              Selected: {formData.image.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Schedule & Contact */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) =>
                              handleInputChange("preferredDate", e.target.value)
                            }
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Preferred Time</Label>
                          <Select
                            value={formData.preferredTime}
                            onValueChange={(value) =>
                              handleInputChange("preferredTime", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="John Smith"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email (optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          required
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            required
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            placeholder="Your City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip">ZIP Code *</Label>
                          <Input
                            id="zip"
                            required
                            value={formData.zip}
                            onChange={(e) =>
                              handleInputChange("zip", e.target.value)
                            }
                            placeholder="12345"
                          />
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-heading font-semibold mb-2">
                          Review Your Request
                        </h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>
                            <strong>Service:</strong> {formData.service}
                          </li>
                          <li>
                            <strong>Date:</strong> {formData.preferredDate}
                          </li>
                          <li>
                            <strong>Time:</strong> {formData.preferredTime}
                          </li>
                          <li>
                            <strong>Contact:</strong> {formData.name} -{" "}
                            {formData.phone}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {step > 1 && (
                      <PrimaryButton
                        type="button"
                        variant="primary"
                        onClick={prevStep}
                      >
                        Previous
                      </PrimaryButton>
                    )}

                    <div className="ml-auto">
                      {step < 3 ? (
                        <PrimaryButton
                          type="button"
                          onClick={nextStep}
                          disabled={
                            (step === 1 && !formData.service) ||
                            (step === 2 && (!formData.name || !formData.phone))
                          }
                        >
                          Next
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton
                          type="submit"
                          disabled={
                            !formData.address || !formData.city || !formData.zip
                          }
                        >
                          Submit Request
                        </PrimaryButton>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Request;
