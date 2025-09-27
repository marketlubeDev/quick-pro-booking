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
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "./ui/command";
import { useRef } from "react";
import { serviceRequestApi, employeeApi, Employee } from "@/lib/api";
import { toast } from "sonner";
import {
  sanitizePhone,
  sanitizeEmail,
  sanitizeZipCode,
  sanitizeTextarea,
  sanitizeInputField,
} from "@/lib/utils";
import { marylandZipCodes } from "@/data/marylandZipCodes";

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
    assignedEmployee: "",
  });
  const [zipError, setZipError] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [zipDropdownOpen, setZipDropdownOpen] = useState(false);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState("");
  const [step2PhoneError, setStep2PhoneError] = useState("");
  const [step2EmailError, setStep2EmailError] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  // Function to filter employees based on ZIP code and service
  const filterEmployeesByZipAndService = (
    zipCode: string,
    service: string,
    employeeList: Employee[]
  ) => {
    let filteredEmployees = employeeList;

    // First filter by ZIP code
    if (zipCode && zipCode.length === 5) {
      // Find the ZIP code data to get city and county information
      const zipData = marylandZipCodes.find((zip) => zip.zip === zipCode);
      if (zipData) {
        // Filter employees who are in the same city or county, or have no location data
        filteredEmployees = filteredEmployees.filter((employee) => {
          // If employee has no location data, include them (they can work anywhere)
          if (!employee.city && !employee.postalCode) {
            return true;
          }

          // If employee has postal code, check if it matches the selected ZIP
          if (employee.postalCode && employee.postalCode === zipCode) {
            return true;
          }

          // If employee has city data, check if it matches the ZIP code's city
          if (employee.city) {
            const employeeCity = employee.city.toLowerCase();
            const zipCity = zipData.city.toLowerCase();
            const zipCounty = zipData.county.toLowerCase();

            // Check if employee's city matches ZIP code's city or county
            return (
              employeeCity.includes(zipCity) ||
              employeeCity.includes(zipCounty) ||
              zipCity.includes(employeeCity) ||
              zipCounty.includes(employeeCity)
            );
          }

          return false;
        });
      }
    }

    // Then filter by service if a service is selected
    if (service && service.trim()) {
      const selectedService = service.toLowerCase();
      filteredEmployees = filteredEmployees.filter((employee) => {
        // If employee has no skills, include them (they can do any service)
        if (!employee.skills || employee.skills.length === 0) {
          return true;
        }

        // Check if employee has skills that match the selected service
        return employee.skills.some((skill) => {
          const skillLower = skill.toLowerCase();
          const serviceLower = selectedService;

          // Direct match
          if (skillLower === serviceLower) {
            return true;
          }

          // Partial match (e.g., "plumbing" matches "plumber")
          if (
            skillLower.includes(serviceLower) ||
            serviceLower.includes(skillLower)
          ) {
            return true;
          }

          // Special mappings for common variations
          const serviceMappings: { [key: string]: string[] } = {
            plumbing: ["plumber", "pipe", "water", "drain"],
            electrical: ["electrician", "electric", "wiring", "power"],
            "house cleaning": ["cleaner", "cleaning", "maid", "janitor"],
            "ac repair": [
              "hvac",
              "air conditioning",
              "cooling",
              "refrigeration",
            ],
            "appliance repair": ["appliance", "repair", "technician", "fix"],
            painting: ["painter", "paint", "decorator"],
            handyman: ["handyman", "maintenance", "repair", "fix"],
            "pest control": ["pest", "exterminator", "bug", "insect"],
            "lawn care": ["landscaping", "lawn", "gardening", "mowing"],
            moving: ["mover", "moving", "relocation", "transport"],
            roofing: ["roofer", "roof", "shingle", "gutter"],
          };

          if (serviceMappings[serviceLower]) {
            return serviceMappings[serviceLower].some(
              (mapping) =>
                skillLower.includes(mapping) || mapping.includes(skillLower)
            );
          }

          return false;
        });
      });
    }

    return filteredEmployees;
  };

  // Function to fetch employees
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await employeeApi.getEmployees();
      if (response.success && response.data) {
        setEmployees(response.data);
        // Initially show all employees
        setFilteredEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidUSPhoneNumber(phone: string) {
    // Remove all non-digit characters (only digits and parentheses allowed)
    const digitsOnly = phone.replace(/[^\d]/g, "");

    // US phone number patterns:
    // 1. 10 digits (standard US number without country code)
    // 2. 11 digits starting with 1 (US number with country code)
    // 3. 7 digits (local number, though less common for business)

    if (digitsOnly.length === 10) {
      // Standard 10-digit US number
      return true;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
      // 11-digit number starting with 1 (US country code)
      return true;
    } else if (digitsOnly.length === 7) {
      // 7-digit local number (less common but valid)
      return true;
    }

    return false;
  }

  // ZIP codes data imported from data module

  // Filter ZIP codes based on input
  const filteredZipCodes = formData.zip
    ? marylandZipCodes.filter((zipData) => zipData.zip.startsWith(formData.zip))
    : marylandZipCodes;

  const handleZipSelect = (zipData: {
    zip: string;
    city: string;
    county: string;
  }) => {
    handleInputChange("zip", zipData.zip);
    setFormData((prev) => ({
      ...prev,
      city: sanitizeInputField(`${zipData.city}, ${zipData.county}`),
    }));
    setZipDropdownOpen(false);
    setTimeout(() => zipInputRef.current?.blur(), 0);
  };

  // Effect to update form data when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      // Map the selected service to match the services array format
      let mappedService = "";
      if (selectedService) {
        const serviceMap: { [key: string]: string } = {
          plumbing: "plumbing",
          electrical: "electrical",
          "house cleaning": "house cleaning",
          "ac repair": "ac repair",
          "appliance repair": "appliance repair",
          painting: "painting",
          handyman: "handyman",
          "pest control": "pest control",
          "lawn care": "lawn care",
          moving: "moving",
          roofing: "roofing",
        };
        mappedService =
          serviceMap[selectedService.toLowerCase()] ||
          selectedService.toLowerCase();
      }

      setFormData((prev) => ({
        ...prev,
        service: sanitizeInputField(mappedService),
        zip: sanitizeZipCode(zipCode || ""),
      }));

      // Fetch employees when modal opens
      fetchEmployees();
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
        assignedEmployee: "",
      });
    }
  }, [isOpen]);

  // Effect to update service availability when ZIP changes
  useEffect(() => {
    if (formData.zip && formData.zip.length === 5) {
      const found = marylandZipCodes.some(
        (zipData) => zipData.zip === formData.zip
      );
      setServiceAvailable(found);
      if (!found) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setServiceAvailable(true); // Default to true for incomplete ZIPs
    }
  }, [formData.zip]);

  // Effect to filter employees when ZIP code or service changes
  useEffect(() => {
    const filtered = filterEmployeesByZipAndService(
      formData.zip,
      formData.service,
      employees
    );
    setFilteredEmployees(filtered);

    // Clear assigned employee if they're not in the filtered list or if no employees are available
    if (formData.assignedEmployee) {
      if (filtered.length === 0) {
        // No employees available for this ZIP code and service combination, clear assignment
        setFormData((prev) => ({ ...prev, assignedEmployee: "" }));
      } else {
        // Check if the currently assigned employee is still available
        const isAssignedEmployeeAvailable = filtered.some(
          (emp) => emp._id === formData.assignedEmployee
        );
        if (!isAssignedEmployeeAvailable) {
          setFormData((prev) => ({ ...prev, assignedEmployee: "" }));
        }
      }
    }
  }, [formData.zip, formData.service, employees]);

  useEffect(() => {
    if (formData.image) {
      const url = URL.createObjectURL(formData.image);
      setImagePreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImagePreviewUrl(null);
    }
  }, [formData.image]);

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
    "Roofing",
  ];

  const timeSlots = [
    "Morning (8AM - 12PM)",
    "Afternoon (12PM - 5PM)",
    "Evening (5PM - 8PM)",
    "Emergency (ASAP)",
  ];

  const handleInputChange = (field: string, value: string | File | null) => {
    let sanitizedValue = value;

    // Sanitize string inputs based on field type
    if (typeof value === "string") {
      switch (field) {
        case "phone":
          sanitizedValue = sanitizePhone(value);
          break;
        case "email":
          sanitizedValue = sanitizeEmail(value);
          break;
        case "zip":
          sanitizedValue = sanitizeZipCode(value);
          // ZIP code must start with '2'
          if (
            sanitizedValue &&
            sanitizedValue.length > 0 &&
            sanitizedValue[0] !== "2"
          ) {
            setZipError(
              "Service not available in this area. We currently serve Maryland only."
            );
            setServiceAvailable(false);
          } else {
            setZipError("");
            setServiceAvailable(true);
          }
          break;
        case "description":
          sanitizedValue = sanitizeTextarea(value);
          break;
        case "name":
        case "address":
        case "city":
          // Temporarily disable sanitization to test
          sanitizedValue = value;
          break;
        default:
          sanitizedValue = value;
          break;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setImageError("Image size should not exceed 10MB.");
        // Optionally reset the file input
        e.target.value = "";
        return;
      }
      setImageError("");
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    // Reset the file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Additional validation for sanitized data
    if (
      !formData.service ||
      !formData.description ||
      !formData.preferredDate ||
      !formData.preferredTime ||
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.zip.trim() ||
      !formData.email.trim()
    ) {
      setSubmitError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Validate ZIP code format
    if (!/^\d{5}$/.test(formData.zip)) {
      setSubmitError("Please enter a valid 5-digit ZIP code.");
      setIsSubmitting(false);
      return;
    }

    // Validate email format (required)
    if (!formData.email || !isValidEmail(formData.email)) {
      setSubmitError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidUSPhoneNumber(formData.phone)) {
      setSubmitError(
        "Please enter a valid US phone number (e.g., 555-123-4567 or 1-555-123-4567)."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await serviceRequestApi.submit({
        service: formData.service,
        description: formData.description,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: "MD",
        zip: formData.zip,
        status: "pending",
        assignedEmployee: formData.assignedEmployee || undefined,
      });

      console.log(result);

      if (result.success) {
        // Show success message using Sonner toast
        toast.success(
          "Service request submitted successfully! We will contact you soon."
        );

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
          assignedEmployee: "",
        });
      } else {
        setSubmitError(
          result.message || "Failed to submit request. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Network error. Please check your connection and try again.");
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 2) {
      setStep2PhoneError("");
      setStep2EmailError("");
      let hasError = false;
      if (!formData.email || !isValidEmail(formData.email)) {
        setStep2EmailError("Please enter a valid email address.");
        hasError = true;
      }
      if (!formData.phone || !isValidUSPhoneNumber(formData.phone)) {
        setStep2PhoneError("Invalid phone number format!");
        hasError = true;
      }
      if (hasError) return;
    }
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
                required={true}
              />
            </div>

            <div>
              <Label htmlFor="image">Upload a photo (optional)</Label>
              {!formData.image ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    // required={true}
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground hover:text-primary transition-colors" />
                    <span className="text-primary hover:underline">
                      Click to upload an image
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-muted-foreground/25 rounded-lg overflow-hidden">
                    <img
                      src={imagePreviewUrl || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 left-16 w-6 h-6 bg-white text-red-500 rounded-full flex items-center justify-center hover:bg-gray-100 text-sm font-bold shadow-sm"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formData.image.name}
                  </p>
                </div>
              )}
            </div>
            {imageError && (
              <p className="text-red-500 text-sm mt-1">{imageError}</p>
            )}
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value) =>
                    handleInputChange("preferredTime", value)
                  }
                  required
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
                inputMode="text"
                pattern="[A-Za-z. ]*"
                onChange={(e) =>
                  handleInputChange(
                    "name",
                    e.target.value.replace(/[^A-Za-z. ]/g, "")
                  )
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
                inputMode="tel"
                maxLength={15}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(
                    /[^\d\(\)]/g,
                    ""
                  );
                  handleInputChange("phone", sanitizedValue);
                  // Real-time validation
                  if (sanitizedValue && isValidUSPhoneNumber(sanitizedValue)) {
                    setStep2PhoneError("");
                  }
                }}
                placeholder="(555) 123-4567"
              />
              {/* <p className="text-xs text-muted-foreground mt-1">
                Only digits and parentheses allowed
              </p> */}
              {step2PhoneError && (
                <p className="text-red-500 text-sm mt-1">{step2PhoneError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
              />
              {step2EmailError && (
                <p className="text-red-500 text-sm mt-1">{step2EmailError}</p>
              )}
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
                  placeholder="Your City, County"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  required
                  value="MD"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <div className="relative">
                  <Input
                    id="zip"
                    required
                    value={formData.zip}
                    onChange={(e) => {
                      const sanitizedZip = sanitizeZipCode(e.target.value);
                      handleInputChange("zip", sanitizedZip);
                      setZipDropdownOpen(true);
                    }}
                    placeholder="12345"
                    maxLength={5}
                    className={zipError ? "border-red-500" : ""}
                    onFocus={() => setZipDropdownOpen(true)}
                    ref={zipInputRef}
                  />
                  {/* Combobox for searching ZIP codes */}
                  {zipDropdownOpen && filteredZipCodes.length > 0 && (
                    <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                      <Command>
                        <CommandInput placeholder="Search ZIP code..." />
                        <CommandList>
                          <CommandEmpty>No ZIP found.</CommandEmpty>
                          {filteredZipCodes.map((zipData) => (
                            <CommandItem
                              key={zipData.zip}
                              value={zipData.zip}
                              onSelect={() => handleZipSelect(zipData)}
                            >
                              {zipData.zip} - {zipData.city}, {zipData.county}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
                {zipError && (
                  <p className="text-red-500 text-sm mt-1">{zipError}</p>
                )}
                {!zipError && formData.zip && serviceAvailable && (
                  <p className="text-green-600 text-sm mt-1">
                    ✓ Service available in {formData.city || "this area"}
                  </p>
                )}
                {!serviceAvailable && formData.zip && (
                  <p className="text-orange-600 text-sm mt-1">
                    ⚠ Service not available in this area. We currently serve
                    Maryland only.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="assignedEmployee">Assign to Employee</Label>
                <Select
                  value={formData.assignedEmployee || undefined}
                  onValueChange={(value) =>
                    handleInputChange("assignedEmployee", value || "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingEmployees
                          ? "Loading employees..."
                          : filteredEmployees.length === 0
                          ? "No employees available for this area"
                          : "Select an employee"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    {filteredEmployees.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No employees available for{" "}
                        {formData.service
                          ? `${formData.service} service in `
                          : ""}
                        this ZIP code
                      </div>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          <div className="flex flex-col">
                            <span>
                              {employee.name} ({employee.email})
                            </span>
                            <div className="flex flex-col gap-1">
                              {employee.city && (
                                <span className="text-xs text-muted-foreground">
                                  📍 {employee.city}
                                  {employee.state && `, ${employee.state}`}
                                </span>
                              )}
                              {employee.skills &&
                                employee.skills.length > 0 && (
                                  <span className="text-xs text-blue-600">
                                    🛠️ {employee.skills.slice(0, 3).join(", ")}
                                    {employee.skills.length > 3 &&
                                      ` +${employee.skills.length - 3} more`}
                                  </span>
                                )}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {formData.zip && filteredEmployees.length === 0 && (
                  <p className="text-orange-600 text-sm mt-1">
                    ⚠ No employees available for{" "}
                    {formData.service ? `${formData.service} service in ` : ""}
                    ZIP code {formData.zip}.
                    {employees.length > 0 &&
                      " Try selecting a different ZIP code or service."}
                  </p>
                )}
                {formData.zip && filteredEmployees.length > 0 && (
                  <p className="text-green-600 text-sm mt-1">
                    ✓ {filteredEmployees.length} employee
                    {filteredEmployees.length !== 1 ? "s" : ""} available for{" "}
                    {formData.service ? `${formData.service} service in ` : ""}
                    this area
                  </p>
                )}
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
                {formData.email && (
                  <li>
                    <strong>Email:</strong> {formData.email}
                  </li>
                )}
                {formData.assignedEmployee && (
                  <li>
                    <strong>Assigned Employee:</strong>{" "}
                    {(() => {
                      const assignedEmp = employees.find(
                        (emp) => emp._id === formData.assignedEmployee
                      );
                      if (assignedEmp) {
                        return `${assignedEmp.name}${
                          assignedEmp.city ? ` (${assignedEmp.city})` : ""
                        }`;
                      }
                      return "Unknown";
                    })()}
                  </li>
                )}
              </ul>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}
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
      <form
        onSubmit={(e) => {
          // Only allow form submission when in step 3
          if (step !== 3) {
            e.preventDefault();
            return;
          }
          handleSubmit(e);
        }}
        className="space-y-6"
      >
        {renderStepIndicator()}
        <div className="w-full mx-auto px-2">{renderStepContent()}</div>

        <div
          className={`flex justify-between pt-6 ${
            isMobile ? "flex-col gap-4" : ""
          }`}
        >
          {/* Mobile: Next/Submit button first */}
          {isMobile && (
            <div className="w-full">
              {step < 3 ? (
                <PrimaryButton
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 &&
                      (!formData.service || !formData.description)) ||
                    (step === 2 &&
                      (!formData.preferredDate ||
                        !formData.preferredTime ||
                        !formData.name ||
                        !formData.phone ||
                        !formData.email))
                  }
                  className="w-full h-12 text-base font-medium"
                >
                  Next
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  type="submit"
                  disabled={
                    !formData.address ||
                    !formData.city ||
                    !formData.zip ||
                    isSubmitting
                  }
                  className="w-full h-12 text-base font-medium"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </PrimaryButton>
              )}
            </div>
          )}

          {/* Mobile: Previous button second, Desktop: Previous button first */}
          {step > 1 && (
            <PrimaryButton
              type="button"
              onClick={prevStep}
              className={isMobile ? "w-full h-12 text-base font-medium" : ""}
            >
              Previous
            </PrimaryButton>
          )}

          {/* Desktop: Next/Submit button */}
          {!isMobile && (
            <div className={`${step > 1 ? "ml-auto" : "ml-auto"}`}>
              {step < 3 ? (
                <PrimaryButton
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 &&
                      (!formData.service || !formData.description)) ||
                    (step === 2 &&
                      (!formData.preferredDate ||
                        !formData.preferredTime ||
                        !formData.name ||
                        !formData.phone ||
                        !formData.email))
                  }
                >
                  Next
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  type="submit"
                  disabled={
                    !formData.address ||
                    !formData.city ||
                    !formData.zip ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </PrimaryButton>
              )}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ContactFormModal;
