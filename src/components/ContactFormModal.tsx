import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PrimaryButton from "./PrimaryButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: string;
  zipCode?: string;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  zipCode,
}) => {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    description: "",
    image: null as File | null,
    preferredDate: "",
    preferredTime: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  // Effect to update form data when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        service: selectedService?.toLowerCase() || "",
        zip: zipCode || "",
      }));
    }
  }, [isOpen, selectedService, zipCode]);

  // Effect to reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        service: "",
        description: "",
        image: null,
        preferredDate: "",
        preferredTime: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        zip: "",
      });
    }
  }, [isOpen]);

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

    // Construct WhatsApp message
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

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/17622218208?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    // Close the modal and reset
    onClose();
    setStep(1);
    setFormData({
      service: "",
      description: "",
      image: null,
      preferredDate: "",
      preferredTime: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      zip: "",
    });
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepIndicator = () => (
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
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="service">What service do you need?</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => handleInputChange("service", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="z-[1000]">
                  {services.map((service) => (
                    <SelectItem key={service} value={service.toLowerCase()}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Describe the issue or task</Label>
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
        );

      case 2:
        return (
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
                  <SelectContent className="z-[1000]">
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
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
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
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Your City"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  required
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
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
                  <strong>Contact:</strong> {formData.name} - {formData.phone}
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "95%" : "75%"}
      style={{
        maxWidth: isMobile ? "95%" : "900px",
        margin: "auto",
        padding: 0,
      }}
      bodyStyle={{
        maxHeight: isMobile ? "85vh" : "80vh",
        overflowY: "auto",
        padding: isMobile ? "20px" : "32px",
        width: "100%",
      }}
      wrapClassName={`custom-modal ${isMobile ? "mobile-modal" : ""}`}
      className="modal-content"
      title={
        <div className={`mb-4 ${isMobile ? "text-center px-4" : ""}`}>
          <h2 className="font-heading text-xl md:text-2xl">
            {step === 1 && "Service Details"}
            {step === 2 && "Schedule & Contact"}
            {step === 3 && "Address & Final Details"}
          </h2>
        </div>
      }
      centered
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepIndicator()}
        <div className="w-full mx-auto px-2">{renderStepContent()}</div>

        <div
          className={`flex justify-between pt-6 ${
            isMobile ? "flex-col gap-4" : ""
          }`}
        >
          {step > 1 && (
            <PrimaryButton
              type="button"
              onClick={prevStep}
              className={isMobile ? "w-full" : ""}
            >
              Previous
            </PrimaryButton>
          )}

          <div
            className={`${step > 1 ? "ml-auto" : ""} ${
              isMobile ? "w-full" : ""
            }`}
          >
            {step < 3 ? (
              <PrimaryButton
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 1 && !formData.service) ||
                  (step === 2 && (!formData.name || !formData.phone))
                }
                className={isMobile ? "w-full" : ""}
              >
                Next
              </PrimaryButton>
            ) : (
              <PrimaryButton
                type="submit"
                disabled={!formData.address || !formData.city || !formData.zip}
                className={isMobile ? "w-full" : ""}
              >
                Submit Request
              </PrimaryButton>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ContactFormModal;
