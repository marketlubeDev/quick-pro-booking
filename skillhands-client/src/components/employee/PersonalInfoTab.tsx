import { useState } from "react";
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
              <select
                id="designation"
                value={form.designation || ""}
                onChange={(e) => onFormChange("designation", e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your designation</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="house cleaner">House Cleaner</option>
                <option value="ac technician">AC Technician</option>
                <option value="appliance repair">Appliance Repair</option>
                <option value="painter">Painter</option>
                <option value="handyman">Handyman</option>
                <option value="pest control specialist">
                  Pest Control Specialist
                </option>
                <option value="landscaper">Landscaper</option>
                <option value="moving specialist">Moving Specialist</option>
                <option value="roofer">Roofer</option>
                {/* <option value="carpenter">Carpenter</option> */}
                <option value="other">Other</option>
              </select>
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
