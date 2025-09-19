import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { employeeApi, type EmployeeProfileData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
import ProfessionalInfoTab from "@/components/employee/ProfessionalInfoTab";
import SkillsCertificationsTab from "@/components/employee/SkillsCertificationsTab";

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
    workExperience: [],
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
            workExperience: res.data.workExperience || [],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage alt={form.fullName} src="" />
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
            <TabsContent value="personal">
              <PersonalInfoTab
                form={form}
                onFormChange={handleChange}
                loading={loading}
              />
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional">
              <ProfessionalInfoTab form={form} onFormChange={handleChange} />
            </TabsContent>

            {/* Skills & Certifications Tab */}
            <TabsContent value="skills">
              <SkillsCertificationsTab
                form={form}
                onFormChange={handleChange}
              />
            </TabsContent>

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
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeProfile;
