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
import { contactApi } from "@/lib/api";
import { toast } from "sonner";
import {
  sanitizePhone,
  sanitizeEmail,
  sanitizeZipCode,
  sanitizeTextarea,
  sanitizeInputField,
} from "@/lib/utils";

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
  const [zipError, setZipError] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [zipDropdownOpen, setZipDropdownOpen] = useState(false);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState("");
  const [step2PhoneError, setStep2PhoneError] = useState("");
  const [step2EmailError, setStep2EmailError] = useState("");

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidUSPhoneNumber(phone: string) {
    // Remove all non-digit characters (only digits and parentheses allowed)
    const digitsOnly = phone.replace(/[^\d]/g, '');
    
    // US phone number patterns:
    // 1. 10 digits (standard US number without country code)
    // 2. 11 digits starting with 1 (US number with country code)
    // 3. 7 digits (local number, though less common for business)
    
    if (digitsOnly.length === 10) {
      // Standard 10-digit US number
      return true;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      // 11-digit number starting with 1 (US country code)
      return true;
    } else if (digitsOnly.length === 7) {
      // 7-digit local number (less common but valid)
      return true;
    }
    
    return false;
  }

  // Maryland ZIP codes with corresponding cities and counties
  // Maryland ZIP codes with corresponding cities and counties
  // (Copied from Request.tsx, truncated for brevity. Add/remove as needed.)
  const marylandZipCodes = [
    // Southern Maryland (20601-20699)
    { zip: "20601", city: "Waldorf", county: "Charles County" },
    { zip: "20602", city: "Waldorf", county: "Charles County" },
    { zip: "20603", city: "Waldorf", county: "Charles County" },
    { zip: "20606", city: "Accokeek", county: "Prince George's County" },
    { zip: "20607", city: "Aquasco", county: "Prince George's County" },
    { zip: "20608", city: "Avenue", county: "St. Mary's County" },
    { zip: "20609", city: "Barstow", county: "Calvert County" },
    { zip: "20610", city: "Bel Alton", county: "Charles County" },
    { zip: "20611", city: "Benedict", county: "Charles County" },
    { zip: "20612", city: "Brandywine", county: "Prince George's County" },
    { zip: "20613", city: "Broomes Island", county: "Calvert County" },
    { zip: "20615", city: "Bryans Road", county: "Charles County" },
    { zip: "20616", city: "Bryantown", county: "Charles County" },
    { zip: "20617", city: "Bushwood", county: "St. Mary's County" },
    { zip: "20618", city: "California", county: "St. Mary's County" },
    { zip: "20619", city: "Callaway", county: "St. Mary's County" },
    { zip: "20620", city: "Chaptico", county: "St. Mary's County" },
    { zip: "20621", city: "Charlotte Hall", county: "St. Mary's County" },
    { zip: "20622", city: "Cheltenham", county: "Prince George's County" },
    { zip: "20623", city: "Clements", county: "St. Mary's County" },
    { zip: "20624", city: "Cobb Island", county: "Charles County" },
    { zip: "20625", city: "Coltons Point", county: "St. Mary's County" },
    { zip: "20626", city: "Compton", county: "St. Mary's County" },
    { zip: "20627", city: "Dameron", county: "St. Mary's County" },
    { zip: "20628", city: "Dowell", county: "Calvert County" },
    { zip: "20629", city: "Drayden", county: "St. Mary's County" },
    { zip: "20630", city: "Faulkner", county: "Charles County" },
    { zip: "20632", city: "Great Mills", county: "St. Mary's County" },
    { zip: "20634", city: "Hollywood", county: "St. Mary's County" },
    { zip: "20635", city: "Hughesville", county: "Charles County" },
    { zip: "20636", city: "Huntingtown", county: "Calvert County" },
    { zip: "20637", city: "Indian Head", county: "Charles County" },
    { zip: "20639", city: "Ironsides", county: "Charles County" },
    { zip: "20640", city: "Issue", county: "Charles County" },
    { zip: "20643", city: "La Plata", county: "Charles County" },
    { zip: "20645", city: "Leonardtown", county: "St. Mary's County" },
    { zip: "20646", city: "Lexington Park", county: "St. Mary's County" },
    { zip: "20650", city: "Lusby", county: "Calvert County" },
    { zip: "20653", city: "Mechanicsville", county: "St. Mary's County" },
    { zip: "20656", city: "Morganza", county: "St. Mary's County" },
    { zip: "20657", city: "Mount Victoria", county: "Charles County" },
    { zip: "20658", city: "Nanjemoy", county: "Charles County" },
    { zip: "20659", city: "Newburg", county: "Charles County" },
    { zip: "20660", city: "Park Hall", county: "St. Mary's County" },
    { zip: "20661", city: "Patuxent River", county: "St. Mary's County" },
    { zip: "20662", city: "Piney Point", county: "St. Mary's County" },
    { zip: "20664", city: "Pomfret", county: "Charles County" },
    { zip: "20667", city: "Port Republic", county: "Calvert County" },
    { zip: "20670", city: "Prince Frederick", county: "Calvert County" },
    { zip: "20674", city: "Ridge", county: "St. Mary's County" },
    { zip: "20675", city: "Rock Point", county: "Charles County" },
    { zip: "20676", city: "Saint Inigoes", county: "St. Mary's County" },
    { zip: "20677", city: "Saint Leonard", county: "Calvert County" },
    { zip: "20678", city: "Saint Marys City", county: "St. Mary's County" },
    { zip: "20680", city: "Solomons", county: "Calvert County" },
    { zip: "20682", city: "Sunderland", county: "Calvert County" },
    { zip: "20684", city: "Tall Timbers", county: "St. Mary's County" },
    { zip: "20685", city: "Valley Lee", county: "St. Mary's County" },
    { zip: "20687", city: "Welcome", county: "Charles County" },
    { zip: "20688", city: "White Plains", county: "Charles County" },
    { zip: "20689", city: "White Plains", county: "Charles County" },
    { zip: "20690", city: "White Plains", county: "Charles County" },
    { zip: "20692", city: "White Plains", county: "Charles County" },
    { zip: "20693", city: "White Plains", county: "Charles County" },
    { zip: "20695", city: "White Plains", county: "Charles County" },
    { zip: "20697", city: "White Plains", county: "Charles County" },

    // Prince George's County and parts of Howard and Anne Arundel Counties (20701-20799)
    { zip: "20701", city: "Annapolis Junction", county: "Howard County" },
    {
      zip: "20704",
      city: "Fort George G Meade",
      county: "Anne Arundel County",
    },
    {
      zip: "20705",
      city: "Andrews Air Force Base",
      county: "Prince George's County",
    },
    { zip: "20706", city: "Lanham", county: "Prince George's County" },
    { zip: "20707", city: "Lanham", county: "Prince George's County" },
    { zip: "20708", city: "Bladensburg", county: "Prince George's County" },
    { zip: "20710", city: "Lothian", county: "Anne Arundel County" },
    { zip: "20711", city: "Mount Rainier", county: "Prince George's County" },
    { zip: "20712", city: "North Beach", county: "Calvert County" },
    { zip: "20714", city: "Bowie", county: "Prince George's County" },
    { zip: "20715", city: "Bowie", county: "Prince George's County" },
    { zip: "20716", city: "Bowie", county: "Prince George's County" },
    { zip: "20717", city: "Bowie", county: "Prince George's County" },
    { zip: "20718", city: "Bowie", county: "Prince George's County" },
    { zip: "20719", city: "Bowie", county: "Prince George's County" },
    { zip: "20720", city: "Bowie", county: "Prince George's County" },
    { zip: "20721", city: "Bowie", county: "Prince George's County" },
    { zip: "20722", city: "Brentwood", county: "Prince George's County" },
    { zip: "20723", city: "Laurel", county: "Prince George's County" },
    { zip: "20724", city: "Laurel", county: "Prince George's County" },
    { zip: "20725", city: "Laurel", county: "Prince George's County" },
    { zip: "20726", city: "Laurel", county: "Prince George's County" },
    { zip: "20731", city: "Capitol Heights", county: "Prince George's County" },
    { zip: "20732", city: "Chesapeake Beach", county: "Calvert County" },
    { zip: "20733", city: "Churchton", county: "Anne Arundel County" },
    { zip: "20735", city: "Clinton", county: "Prince George's County" },
    { zip: "20736", city: "Clinton", county: "Prince George's County" },
    { zip: "20737", city: "Clinton", county: "Prince George's County" },
    { zip: "20738", city: "Clinton", county: "Prince George's County" },
    { zip: "20740", city: "College Park", county: "Prince George's County" },
    { zip: "20741", city: "College Park", county: "Prince George's County" },
    { zip: "20742", city: "College Park", county: "Prince George's County" },
    { zip: "20743", city: "College Park", county: "Prince George's County" },
    { zip: "20744", city: "College Park", county: "Prince George's County" },
    { zip: "20745", city: "College Park", county: "Prince George's County" },
    { zip: "20746", city: "College Park", county: "Prince George's County" },
    { zip: "20747", city: "College Park", county: "Prince George's County" },
    { zip: "20748", city: "College Park", county: "Prince George's County" },
    { zip: "20749", city: "College Park", county: "Prince George's County" },
    { zip: "20750", city: "College Park", county: "Prince George's County" },
    { zip: "20751", city: "College Park", county: "Prince George's County" },
    { zip: "20752", city: "College Park", county: "Prince George's County" },
    { zip: "20753", city: "College Park", county: "Prince George's County" },
    { zip: "20754", city: "College Park", county: "Prince George's County" },
    { zip: "20755", city: "College Park", county: "Prince George's County" },
    { zip: "20757", city: "Oxon Hill", county: "Prince George's County" },
    { zip: "20758", city: "Suitland", county: "Prince George's County" },
    {
      zip: "20759",
      city: "District Heights",
      county: "Prince George's County",
    },
    { zip: "20762", city: "Riverdale", county: "Prince George's County" },
    { zip: "20763", city: "Riverdale", county: "Prince George's County" },
    { zip: "20764", city: "Riverdale", county: "Prince George's County" },
    { zip: "20765", city: "Riverdale", county: "Prince George's County" },
    { zip: "20768", city: "Forestville", county: "Prince George's County" },
    { zip: "20769", city: "Forestville", county: "Prince George's County" },
    { zip: "20770", city: "Forestville", county: "Prince George's County" },
    { zip: "20771", city: "Forestville", county: "Prince George's County" },
    { zip: "20772", city: "Forestville", county: "Prince George's County" },
    { zip: "20773", city: "Forestville", county: "Prince George's County" },
    { zip: "20774", city: "Forestville", county: "Prince George's County" },
    { zip: "20775", city: "Forestville", county: "Prince George's County" },
    { zip: "20776", city: "Forestville", county: "Prince George's County" },
    { zip: "20777", city: "Forestville", county: "Prince George's County" },
    { zip: "20778", city: "Forestville", county: "Prince George's County" },
    { zip: "20779", city: "Forestville", county: "Prince George's County" },
    { zip: "20780", city: "Forestville", county: "Prince George's County" },
    { zip: "20781", city: "Forestville", county: "Prince George's County" },
    { zip: "20782", city: "Forestville", county: "Prince George's County" },
    { zip: "20783", city: "Forestville", county: "Prince George's County" },
    { zip: "20784", city: "Forestville", county: "Prince George's County" },
    { zip: "20785", city: "Forestville", county: "Prince George's County" },
    { zip: "20786", city: "Forestville", county: "Prince George's County" },
    { zip: "20787", city: "Forestville", county: "Prince George's County" },
    { zip: "20788", city: "Forestville", county: "Prince George's County" },
    { zip: "20789", city: "Forestville", county: "Prince George's County" },
    { zip: "20790", city: "Forestville", county: "Prince George's County" },
    { zip: "20791", city: "Forestville", county: "Prince George's County" },
    { zip: "20792", city: "Forestville", county: "Prince George's County" },
    { zip: "20793", city: "Forestville", county: "Prince George's County" },
    { zip: "20794", city: "Forestville", county: "Prince George's County" },
    { zip: "20795", city: "Forestville", county: "Prince George's County" },
    { zip: "20796", city: "Forestville", county: "Prince George's County" },
    { zip: "20797", city: "Forestville", county: "Prince George's County" },
    { zip: "20798", city: "Forestville", county: "Prince George's County" },
    { zip: "20799", city: "Forestville", county: "Prince George's County" },

    // ... (continue with all other ZIPs as in Request.tsx) ...

    // Baltimore City and surrounding Baltimore County (21201-21298)
    { zip: "21201", city: "Baltimore", county: "Baltimore City" },
    { zip: "21202", city: "Baltimore", county: "Baltimore City" },
    { zip: "21203", city: "Baltimore", county: "Baltimore City" },
    { zip: "21204", city: "Baltimore", county: "Baltimore County" },
    { zip: "21205", city: "Baltimore", county: "Baltimore City" },
    { zip: "21206", city: "Baltimore", county: "Baltimore City" },
    { zip: "21207", city: "Baltimore", county: "Baltimore County" },
    { zip: "21208", city: "Baltimore", county: "Baltimore County" },
    { zip: "21209", city: "Baltimore", county: "Baltimore County" },
    { zip: "21210", city: "Baltimore", county: "Baltimore City" },
    { zip: "21211", city: "Baltimore", county: "Baltimore City" },
    { zip: "21212", city: "Baltimore", county: "Baltimore City" },
    { zip: "21213", city: "Baltimore", county: "Baltimore City" },
    { zip: "21214", city: "Baltimore", county: "Baltimore City" },
    { zip: "21215", city: "Baltimore", county: "Baltimore City" },
    { zip: "21216", city: "Baltimore", county: "Baltimore City" },
    { zip: "21217", city: "Baltimore", county: "Baltimore City" },
    { zip: "21218", city: "Baltimore", county: "Baltimore City" },
    { zip: "21219", city: "Baltimore", county: "Baltimore City" },
    { zip: "21220", city: "Baltimore", county: "Baltimore City" },
    { zip: "21221", city: "Baltimore", county: "Baltimore City" },
    { zip: "21222", city: "Baltimore", county: "Baltimore City" },
    { zip: "21223", city: "Baltimore", county: "Baltimore City" },
    { zip: "21224", city: "Baltimore", county: "Baltimore City" },
    { zip: "21225", city: "Baltimore", county: "Baltimore City" },
    { zip: "21226", city: "Baltimore", county: "Baltimore City" },
    { zip: "21227", city: "Baltimore", county: "Baltimore City" },
    { zip: "21228", city: "Baltimore", county: "Baltimore City" },
    { zip: "21229", city: "Baltimore", county: "Baltimore City" },
    { zip: "21230", city: "Baltimore", county: "Baltimore City" },
    { zip: "21231", city: "Baltimore", county: "Baltimore City" },
    { zip: "21233", city: "Baltimore", county: "Baltimore City" },
    { zip: "21234", city: "Baltimore", county: "Baltimore County" },
    { zip: "21235", city: "Baltimore", county: "Baltimore County" },
    { zip: "21236", city: "Baltimore", county: "Baltimore County" },
    { zip: "21237", city: "Baltimore", county: "Baltimore County" },
    { zip: "21239", city: "Baltimore", county: "Baltimore City" },
    { zip: "21240", city: "Baltimore", county: "Baltimore City" },
    { zip: "21241", city: "Baltimore", county: "Baltimore City" },
    { zip: "21244", city: "Baltimore", county: "Baltimore City" },
    { zip: "21250", city: "Baltimore", county: "Baltimore City" },
    { zip: "21251", city: "Baltimore", county: "Baltimore City" },
    { zip: "21252", city: "Baltimore", county: "Baltimore City" },
    { zip: "21263", city: "Baltimore", county: "Baltimore City" },
    { zip: "21264", city: "Baltimore", county: "Baltimore City" },
    { zip: "21265", city: "Baltimore", county: "Baltimore City" },
    { zip: "21268", city: "Baltimore", county: "Baltimore City" },
    { zip: "21270", city: "Baltimore", county: "Baltimore City" },
    { zip: "21273", city: "Baltimore", county: "Baltimore City" },
    { zip: "21274", city: "Baltimore", county: "Baltimore City" },
    { zip: "21275", city: "Baltimore", county: "Baltimore City" },
    { zip: "21278", city: "Baltimore", county: "Baltimore City" },
    { zip: "21279", city: "Baltimore", county: "Baltimore City" },
    { zip: "21280", city: "Baltimore", county: "Baltimore City" },
    { zip: "21281", city: "Baltimore", county: "Baltimore City" },
    { zip: "21282", city: "Baltimore", county: "Baltimore City" },
    { zip: "21283", city: "Baltimore", county: "Baltimore City" },
    { zip: "21284", city: "Baltimore", county: "Baltimore City" },
    { zip: "21285", city: "Baltimore", county: "Baltimore City" },
    { zip: "21286", city: "Baltimore", county: "Baltimore City" },
    { zip: "21287", city: "Baltimore", county: "Baltimore City" },
    { zip: "21288", city: "Baltimore", county: "Baltimore City" },
    { zip: "21289", city: "Baltimore", county: "Baltimore City" },
    { zip: "21290", city: "Baltimore", county: "Baltimore City" },
    { zip: "21297", city: "Baltimore", county: "Baltimore City" },
    { zip: "21298", city: "Baltimore", county: "Baltimore City" },
  ];

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
          "plumbing": "plumbing",
          "electrical": "electrical", 
          "house cleaning": "house cleaning",
          "ac repair": "ac repair",
          "appliance repair": "appliance repair",
          "painting": "painting",
          "handyman": "handyman",
          "pest control": "pest control",
          "lawn care": "lawn care",
          "moving": "moving",
          "roofing": "roofing"
        };
        mappedService = serviceMap[selectedService.toLowerCase()] || selectedService.toLowerCase();
      }
      
      setFormData((prev) => ({
        ...prev,
        service: sanitizeInputField(mappedService),
        zip: sanitizeZipCode(zipCode || ""),
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

  // Effect to update service availability when ZIP changes
  useEffect(() => {
    if (formData.zip && formData.zip.length === 5) {
      const found = marylandZipCodes.some((zipData) => zipData.zip === formData.zip);
      setServiceAvailable(found);
      if (!found) {
        setFormData((prev) => ({ ...prev, city: '' }));
      }
    } else {
      setServiceAvailable(true); // Default to true for incomplete ZIPs
    }
  }, [formData.zip]);

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
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setImageError("Image size should not exceed 2MB.");
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
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
      setSubmitError("Please enter a valid US phone number (e.g., 555-123-4567 or 1-555-123-4567).");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await contactApi.submitForm({
        service: formData.service,
        description: formData.description,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        image: formData.image,
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
                <label
                  htmlFor="image"
                    className="cursor-pointer block"
                   
                >
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
                  // Only allow digits and parentheses
                  const sanitizedValue = e.target.value.replace(/[^\d\(\)]/g, '');
                  handleInputChange("phone", sanitizedValue);
                }}
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only digits and parentheses allowed
              </p>
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
      <form onSubmit={(e) => {
        // Only allow form submission when in step 3
        if (step !== 3) {
          e.preventDefault();
          return;
        }
        handleSubmit(e);
      }} className="space-y-6">
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
            className={`${step > 1 ? "ml-auto" : "ml-auto"} ${
              isMobile ? "w-full" : ""
            }`}
          >
            {step < 3 ? (
              <PrimaryButton
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 1 && (!formData.service || !formData.description)) ||
                  (step === 2 && (!formData.preferredDate || !formData.preferredTime || !formData.name || !formData.phone || !formData.email))
                }
                className={isMobile ? "w-full" : ""}
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
                className={isMobile ? "w-full" : ""}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </PrimaryButton>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ContactFormModal;
