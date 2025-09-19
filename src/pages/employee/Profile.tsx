import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { employeeApi, type EmployeeProfileData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Briefcase,
  Award,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Star,
  Upload,
  X,
  Plus,
  CheckCircle,
  Shield,
} from "lucide-react";

const EmployeeProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [form, setForm] = useState<EmployeeProfileData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    level: "Intermediate",
    skills: [],
    certifications: [],
    expectedSalary: undefined,
    verified: false,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Replace with real API; if backend not ready, keep mock defaults
        const res = await employeeApi.getProfile();
        if (res?.success && res.data && mounted) {
          setProfile(res.data);
          setForm({
            fullName: res.data.fullName,
            email: res.data.email,
            phone: res.data.phone,
            city: res.data.city || "",
            level: res.data.level || "Intermediate",
            skills: res.data.skills || [],
            certifications: res.data.certifications || [],
            expectedSalary: res.data.expectedSalary,
            verified: res.data.verified || false,
          });
        }
      } catch (e) {
        // Silent fallback to empty form; show informational toast
        toast({
          title: "Using local profile",
          description:
            "Backend not reachable. Edit and save to update when online.",
        });
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [toast]);

  const handleChange = (field: keyof EmployeeProfileData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await employeeApi.updateProfile(form);
      if (res.success) {
        setProfile(res.data!);
        toast({ title: "Profile updated" });
      } else {
        toast({ title: "Update failed", description: res.message });
      }
    } catch (err) {
      toast({ title: "Network error", description: "Could not save profile" });
    } finally {
      setLoading(false);
    }
  };

  const skillsDisplay = useMemo(() => form.skills || [], [form.skills]);
  const [uploading, setUploading] = useState(false);
  const [newCertInput, setNewCertInput] = useState("");
  const [newCertFile, setNewCertFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  const handleAddCertification = async () => {
    const name = newCertInput.trim();
    if (!name || !newCertFile) {
      toast({
        title: "Missing info",
        description: "Enter name and choose a file",
      });
      return;
    }
    try {
      setUploading(true);
      const res = await employeeApi.uploadCertificates([newCertFile]);
      if (res.success) {
        setForm((prev) => ({
          ...prev,
          certifications: Array.from(
            new Set([...(prev.certifications || []), name])
          ),
        }));
        setNewCertInput("");
        setNewCertFile(null);
        const fileInput = document.getElementById(
          "certFile"
        ) as HTMLInputElement | null;
        if (fileInput) fileInput.value = "";
        toast({ title: "Certification added" });
      } else {
        toast({ title: "Upload failed", description: res.message });
      }
    } catch (err) {
      toast({ title: "Network error", description: "Could not upload file" });
    } finally {
      setUploading(false);
    }
  };

  // replaced by file-backed handler above

  const handleRemoveCertification = (value: string) => {
    setForm((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c !== value),
    }));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage
                    alt={form.fullName}
                    src={profileImagePreview || ""}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                    {form.fullName
                      ? form.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "EP"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() =>
                    document.getElementById("profileImage")?.click()
                  }
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">
                    {form.fullName || "Your Name"}
                  </h1>
                  <div className="flex items-center gap-2">
                    {form.level && (
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 uppercase tracking-wide px-3 py-1"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {form.level}
                      </Badge>
                    )}
                    {form.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-100 border-green-400/30 px-3 py-1"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{form.email || "name@email.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{form.phone || "Your phone number"}</span>
                  </div>
                  {form.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{form.city}</span>
                    </div>
                  )}
                </div>
                {form.expectedSalary && (
                  <div className="flex items-center gap-2 mt-2 text-white/90">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      Expected: ${form.expectedSalary.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="professional"
              className="flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Skills & Certifications
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
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
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
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
                        onChange={(e) => handleChange("email", e.target.value)}
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
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
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
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="Enter your city"
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-end gap-3 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        profile &&
                        setForm({
                          fullName: profile.fullName,
                          email: profile.email,
                          phone: profile.phone,
                          city: profile.city,
                          level: profile.level,
                          skills: profile.skills,
                          certifications: profile.certifications,
                          expectedSalary: profile.expectedSalary,
                          verified: profile.verified,
                        })
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="min-w-[120px]"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardFooter>
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
                              Complete your profile and upload required
                              documents to get verified. Verified accounts get
                              priority in job matching and higher trust ratings.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <CheckCircle className="h-4 w-4" />
                                <span>Complete profile information</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <CheckCircle className="h-4 w-4" />
                                <span>Upload valid ID documents</span>
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
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>
                    Set your professional level and salary expectations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm font-medium">
                        Experience Level *
                      </Label>
                      <Select
                        value={form.level || ""}
                        onValueChange={(v) => handleChange("level", v as any)}
                      >
                        <SelectTrigger id="level" className="h-11">
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              Beginner
                            </div>
                          </SelectItem>
                          <SelectItem value="Intermediate">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              Intermediate
                            </div>
                          </SelectItem>
                          <SelectItem value="Expert">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              Expert
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="expectedSalary"
                        className="text-sm font-medium"
                      >
                        Expected Salary (USD)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="expectedSalary"
                          type="number"
                          value={form.expectedSalary ?? ""}
                          onChange={(e) =>
                            handleChange(
                              "expectedSalary",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Enter expected salary"
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-end gap-3 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        profile &&
                        setForm({
                          fullName: profile.fullName,
                          email: profile.email,
                          phone: profile.phone,
                          city: profile.city,
                          level: profile.level,
                          skills: profile.skills,
                          certifications: profile.certifications,
                          expectedSalary: profile.expectedSalary,
                          verified: profile.verified,
                        })
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="min-w-[120px]"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Skills & Certifications Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Skills & Certifications
                  </CardTitle>
                  <CardDescription>
                    Showcase your skills and upload certifications to win more
                    jobs
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Skills Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-sm font-medium">
                        Skills
                      </Label>
                      <Input
                        id="skills"
                        placeholder="e.g., Plumbing, Pipe Installation, Electrical Work"
                        value={(form.skills || []).join(", ")}
                        onChange={(e) =>
                          handleChange(
                            "skills",
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple skills with commas
                      </p>
                    </div>

                    {skillsDisplay.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Your Skills
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {skillsDisplay.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Certifications Section */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Add New Certification
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="certName"
                          className="text-sm font-medium"
                        >
                          Certification Name
                        </Label>
                        <Input
                          id="certName"
                          placeholder="e.g., Plumbing License, Safety Certificate"
                          value={newCertInput}
                          onChange={(e) => setNewCertInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCertification();
                            }
                          }}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="certFile"
                          className="text-sm font-medium"
                        >
                          Certificate File
                        </Label>
                        <div className="relative">
                          <Input
                            id="certFile"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) =>
                              setNewCertFile(e.target.files?.[0] || null)
                            }
                            disabled={uploading}
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddCertification}
                      disabled={
                        uploading || !newCertInput.trim() || !newCertFile
                      }
                      className="w-full md:w-auto"
                    >
                      {uploading ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Certification
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Existing Certifications */}
                  {form.certifications && form.certifications.length > 0 && (
                    <div className="space-y-4">
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Your Certifications
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {form.certifications.map((cert) => (
                            <div
                              key={cert}
                              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  {cert}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveCertification(cert)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeProfile;
