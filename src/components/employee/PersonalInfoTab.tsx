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
      {/* Profile Image Section */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Profile Picture
          </CardTitle>
          <CardDescription>
            Upload a professional profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-gray-200">
                <AvatarImage
                  alt={form.fullName}
                  src={profileImagePreview || ""}
                />
                <AvatarFallback className="text-3xl font-bold">
                  {form.fullName
                    ? form.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    : "EP"}
                </AvatarFallback>
              </Avatar>
              {profileImage && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <div className="h-3 w-3 rounded-full bg-white"></div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="profileImageFile"
                  className="text-sm font-medium"
                >
                  Choose Profile Image
                </Label>
                <Input
                  id="profileImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, at least 400x400px, max 5MB
                </p>
              </div>

              {profileImage && (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleUploadProfileImage}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setProfileImage(null);
                      setProfileImagePreview("");
                      const fileInput = document.getElementById(
                        "profileImageFile"
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
