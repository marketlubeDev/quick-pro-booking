import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type EmployeeProfileData } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle,
} from "lucide-react";
import PersonalInfoTab from "@/components/employee/PersonalInfoTab";
import SkillsCertificationsTab from "@/components/employee/SkillsCertificationsTab";

const EmployeeProfile = () => {
  const {
    profile,
    profileCompletion,
    loading,
    error,
    updateProfile,
    uploadProfileImage,
    uploadCertificates,
  } = useProfile();

  const [form, setForm] = useState<EmployeeProfileData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    addressLine1: "",
    postalCode: "",
    level: "Intermediate",
    skills: [],
    certifications: [],
    workExperience: [],
    qualifications: [],
    expectedSalary: undefined,
    verified: false,
    designation: "",
  });

  // Update form when profile data is loaded
  React.useEffect(() => {
    if (profile) {
      // Normalize legacy designation values to match current allowed options
      const normalizeDesignation = (value: string | undefined | null) => {
        // Ensure value is a string before calling toLowerCase
        const stringValue =
          typeof value === "string" ? value : String(value || "");
        const v = stringValue.toLowerCase().trim();
        switch (v) {
          case "plumbing":
            return "plumber";
          case "electrical":
            return "electrician";
          case "house cleaning":
            return "house cleaner";
          case "ac repair":
            return "ac technician";
          case "painting":
            return "painter";
          case "pest control":
            return "pest control specialist";
          case "lawn care":
            return "landscaper";
          case "moving":
            return "moving specialist";
          case "roofing":
            return "roofer";
          default:
            return v;
        }
      };

      setForm({
        fullName: profile.fullName || profile.user?.name || "",
        email: profile.email || profile.user?.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
        addressLine1:
          (profile as any).addressLine1 || (profile as any).addressline1 || "",
        postalCode:
          (profile as any).postalCode || (profile as any).postalcode || "",
        level: profile.level || "Intermediate",
        skills: profile.skills || [],
        certifications: profile.certifications || [],
        workExperience: profile.workExperience || [],
        qualifications: profile.qualifications || [],
        expectedSalary: profile.expectedSalary,
        verified: profile.verified || false,
        designation: normalizeDesignation(profile.designation) || "",
      });
    }
  }, [profile]);

  const handleChange = (field: keyof EmployeeProfileData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!form.fullName.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (!form.email.trim()) {
      alert("Please enter your email address");
      return;
    }
    if (!form.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    await updateProfile(form);
  };

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <CheckCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                    src={profile?.avatarUrl || ""}
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
                {profileCompletion && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <div className="text-xs font-semibold text-gray-700">
                      {profileCompletion.completion}%
                    </div>
                  </div>
                )}
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
                  {form.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{form.phone || "Your phone number"}</span>
                    </div>
                  )}

                  {form.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{form.city}</span>
                    </div>
                  )}
                  {form.designation && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{form.designation}</span>
                    </div>
                  )}
                </div>
                {form.expectedSalary && (
                  <div className="flex items-center gap-2 mt-2 text-white/90">
                    <span className="flex items-center gap-1">
                      Expected: <DollarSign className="h-4 w-4" />
                      {form.expectedSalary.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger
              value="personal"
              className="w-full flex items-center justify-center gap-2"
            >
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>

            <TabsTrigger
              value="skills"
              className="w-full flex items-center justify-center gap-2"
            >
              <Award className="h-4 w-4" />
              Skills & Certifications
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <PersonalInfoTab
                form={form}
                onFormChange={handleChange}
                loading={loading}
                // onUploadImage={uploadProfileImage}
              />
            </TabsContent>
            {/* Skills & Certifications Tab */}
            <TabsContent value="skills">
              <SkillsCertificationsTab
                form={form}
                onFormChange={handleChange}

                // onUploadCertificates={uploadCertificates}
              />
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeProfile;
