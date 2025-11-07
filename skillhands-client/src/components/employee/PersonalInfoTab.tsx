import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Upload,
  X,
  CheckCircle,
  Shield,
  DollarSign,
  Star,
  Clock,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { employeeApi, type EmployeeProfileData } from "@/lib/api";
import { marylandZipCodes } from "@/data/marylandZipCodes";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfoTabProps {
  form: EmployeeProfileData;
  onFormChange: (field: keyof EmployeeProfileData, value: any) => void;
  loading: boolean;
}

const PersonalInfoTab = ({
  form,
  onFormChange,
  loading,
}: PersonalInfoTabProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>(
    form.designation ? form.designation.split(", ") : []
  );
  const [designationOpen, setDesignationOpen] = useState(false);
  const [zipOpen, setZipOpen] = useState(false);
  const [newWorkingCity, setNewWorkingCity] = useState("");

  // Sync selectedDesignations when form.designation changes
  useEffect(() => {
    if (form.designation) {
      setSelectedDesignations(form.designation.split(", "));
    } else {
      setSelectedDesignations([]);
    }
  }, [form.designation]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfileImage = async () => {
    if (!profileImage) return;

    try {
      setUploading(true);
      const res = await employeeApi.uploadProfileImage(profileImage);
      if (res.success) {
        toast({ title: "Profile image updated successfully" });
        setProfileImage(null);
        setProfileImagePreview("");
      } else {
        toast({ title: "Upload failed", description: res.message });
      }
    } catch (err) {
      toast({ title: "Network error", description: "Could not upload image" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Details Section */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => onFormChange("fullName", e.target.value)}
                required
                className="h-11"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => onFormChange("email", e.target.value)}
                required
                className="h-11"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => onFormChange("phone", e.target.value)}
                  required
                  className="h-11 pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Include country code for international numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={form.addressLine1 || ""}
                  onChange={(e) => onFormChange("addressLine1", e.target.value)}
                  placeholder="Street address"
                  className="h-11 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="city"
                  value={form.city || ""}
                  onChange={(e) => onFormChange("city", e.target.value)}
                  placeholder="Enter your city"
                  className="h-11 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip" className="text-sm font-medium">
                ZIP Code
              </Label>
              <Select
                value={form.postalCode || ""}
                onValueChange={(zip) => {
                  onFormChange("postalCode", zip);
                  const entry = marylandZipCodes.find((z) => z.zip === zip);
                  if (entry && entry.city && entry.city !== form.city) {
                    onFormChange("city", entry.city);
                  }
                }}
              >
                <SelectTrigger className="h-11" id="zip">
                  <SelectValue placeholder="Select ZIP (MD)" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {marylandZipCodes.map((z) => (
                    <SelectItem key={z.zip} value={z.zip}>
                      {z.zip} — {z.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-sm font-medium">
                Designation
              </Label>
              <Popover open={designationOpen} onOpenChange={setDesignationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={designationOpen}
                    className="w-full justify-between h-11"
                    id="designation"
                    type="button"
                  >
                    {selectedDesignations.length
                      ? selectedDesignations.join(", ")
                      : "Select designations"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-[--radix-popover-trigger-width]"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search designation..." />
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {[
                          "plumber",
                          "electrician",
                          "house cleaner",
                          "ac technician",
                          "appliance repair",
                          "painter",
                          "handyman",
                          "pest control specialist",
                          "landscaper",
                          "moving specialist",
                          "roofer",
                        ].map((d) => (
                          <CommandItem
                            key={d}
                            value={d}
                            onSelect={() => {
                              const newDesignations = selectedDesignations.includes(d)
                                ? selectedDesignations.filter((p) => p !== d)
                                : [...selectedDesignations, d];
                              setSelectedDesignations(newDesignations);
                              onFormChange("designation", newDesignations.join(", "));
                            }}
                          >
                            <span className="mr-2 inline-flex items-center justify-center h-4 w-4">
                              {selectedDesignations.includes(d) && (
                                <Check className="h-4 w-4" />
                              )}
                            </span>
                            {d.replace(/\b\w/g, (c) => c.toUpperCase())}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Your current job title or professional designation
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium">
                Experience Level *
              </Label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={form.level || "Intermediate"}
                  onValueChange={(value) => onFormChange("level", value)}
                >
                  <SelectTrigger className="h-11 pl-10">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Select your professional experience level
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedSalary" className="text-sm font-medium">
                Expected Salary
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expectedSalary"
                  type="number"
                  value={form.expectedSalary || ""}
                  onChange={(e) =>
                    onFormChange(
                      "expectedSalary",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="Enter your expected salary"
                  className="h-11 pl-10"
                  min="0"
                  step="100"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your expected annual salary in USD
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience" className="text-sm font-medium">
                Years of Experience
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="yearsOfExperience"
                  type="number"
                  inputMode="numeric"
                  value={form.yearsOfExperience || ""}
                  onChange={(e) =>
                    onFormChange(
                      "yearsOfExperience",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="Enter years of experience"
                  className="h-11 pl-10"
                  min="0"
                  step="1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Total years of professional experience
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="workingZipCodes" className="text-sm font-medium">
                Work Location ZIP codes
              </Label>
              <Popover open={zipOpen} onOpenChange={setZipOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={zipOpen}
                    className="w-full justify-between h-11"
                    id="workingZipCodes"
                    type="button"
                  >
                    {form.workingZipCodes && form.workingZipCodes.length > 0
                      ? form.workingZipCodes.join(", ")
                      : "Select ZIPs"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-[--radix-popover-trigger-width]"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Type ZIP or city..." />
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {marylandZipCodes.map((z) => (
                          <CommandItem
                            key={z.zip}
                            value={`${z.zip} ${z.city}`}
                            onSelect={() => {
                              const currentZips = form.workingZipCodes || [];
                              const isSelected = currentZips.includes(z.zip);
                              const nextZips = isSelected
                                ? currentZips.filter((p) => p !== z.zip)
                                : [...currentZips, z.zip];
                              onFormChange("workingZipCodes", nextZips);

                              // Auto-update cities based on selected ZIPs
                              const citiesFromZips = marylandZipCodes
                                .filter((mz) => nextZips.includes(mz.zip))
                                .map((mz) => mz.city)
                                .filter(Boolean);
                              const uniqueCities = Array.from(new Set(citiesFromZips));
                              onFormChange("workingCities", uniqueCities);
                            }}
                          >
                            <span className="mr-2 inline-flex items-center justify-center h-4 w-4">
                              {form.workingZipCodes?.includes(z.zip) && (
                                <Check className="h-4 w-4" />
                              )}
                            </span>
                            {z.zip} — {z.city}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.workingZipCodes?.map((zip) => (
                  <Badge
                    key={zip}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <span>{zip}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextZips = (form.workingZipCodes || []).filter(
                          (p) => p !== zip
                        );
                        onFormChange("workingZipCodes", nextZips);

                        // Update cities when ZIP is removed
                        const citiesFromZips = marylandZipCodes
                          .filter((mz) => nextZips.includes(mz.zip))
                          .map((mz) => mz.city)
                          .filter(Boolean);
                        const uniqueCities = Array.from(new Set(citiesFromZips));
                        onFormChange("workingCities", uniqueCities);
                      }}
                      className="ml-1 hover:text-red-500"
                      aria-label={`Remove ${zip}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                ZIP codes where you are available to work
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="workingCities" className="text-sm font-medium">
                Work Cities
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="workingCities"
                  value={newWorkingCity}
                  onChange={(e) => setNewWorkingCity(e.target.value)}
                  placeholder="Add a city..."
                  className="flex-1 h-11"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const candidate = newWorkingCity.trim();
                      if (
                        candidate &&
                        !form.workingCities?.includes(candidate)
                      ) {
                        onFormChange("workingCities", [
                          ...(form.workingCities || []),
                          candidate,
                        ]);
                        setNewWorkingCity("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!newWorkingCity.trim()}
                  onClick={() => {
                    const candidate = newWorkingCity.trim();
                    if (
                      candidate &&
                      !form.workingCities?.includes(candidate)
                    ) {
                      onFormChange("workingCities", [
                        ...(form.workingCities || []),
                        candidate,
                      ]);
                      setNewWorkingCity("");
                    }
                  }}
                  className="h-11"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.workingCities?.map((city) => (
                  <Badge
                    key={city}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onFormChange(
                          "workingCities",
                          (form.workingCities || []).filter((c) => c !== city)
                        );
                      }}
                      className="ml-1 hover:text-red-500"
                      aria-label={`Remove ${city}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Cities where you are available to work
              </p>
            </div>
          </div>

                   {/* Save Button */}
                   <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
        </CardContent>
      </Card>

      {/* Verification Status Section */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Verification Status
          </CardTitle>
          <CardDescription>
            Your account verification status and security information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    form.verified ? "bg-green-100" : "bg-yellow-100"
                  }`}
                >
                  {form.verified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Shield className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Account Verification
                  </h3>
                  <p className="text-sm text-gray-600">
                    {form.verified
                      ? "Your account is verified and trusted"
                      : "Your account is pending verification"}
                  </p>
                </div>
              </div>
              <Badge
                variant={form.verified ? "default" : "secondary"}
                className={
                  form.verified
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                }
              >
                {form.verified ? "Verified" : "Pending"}
              </Badge>
            </div>

            {!form.verified && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-blue-100">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">
                      Get Verified
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Complete your profile and upload required documents to get
                      verified. Verified accounts get priority in job matching
                      and higher trust ratings.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete profile information</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Add your skills</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Provide professional certifications</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {form.verified && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 mb-1">
                      Verification Benefits
                    </h4>
                    <p className="text-sm text-green-700">
                      As a verified professional, you enjoy priority job
                      matching, higher trust ratings, and exclusive
                      opportunities.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>


        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
