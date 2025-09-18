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

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage alt={form.fullName} src={""} />
            <AvatarFallback>
              {form.fullName
                ? form.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                : "EP"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                {form.fullName || "Your name"}
              </h2>
              {form.level && (
                <Badge variant="secondary" className="uppercase tracking-wide">
                  {form.level}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {form.email || "name@email.com"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-col gap-6">
          <div className="flex-1 min-w-[280px] space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>How clients can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 min-w-[280px]">
            <Card>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>Your level and compensation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={form.level || ""}
                      onValueChange={(v) => handleChange("level", v as any)}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary">Expected Salary</Label>
                    <Input
                      id="expectedSalary"
                      type="number"
                      value={form.expectedSalary ?? ""}
                      onChange={(e) =>
                        handleChange("expectedSalary", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
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
                    })
                  }
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex-1 min-w-[280px]">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Certifications</CardTitle>
                <CardDescription>
                  Showcase your strengths to win more jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    placeholder="Plumbing, Pipe Installation"
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
                  />
                  <div className="flex flex-wrap gap-2">
                    {skillsDisplay.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certName">Certification name</Label>
                  <Input
                    id="certName"
                    placeholder="e.g. Plumbing License"
                    value={newCertInput}
                    onChange={(e) => setNewCertInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCertification();
                      }
                    }}
                  />
                  <Label htmlFor="certFile">Certificate file</Label>
                  <Input
                    id="certFile"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      setNewCertFile(e.target.files?.[0] || null)
                    }
                    disabled={uploading}
                  />
                  <div>
                    <Button
                      type="button"
                      onClick={handleAddCertification}
                      disabled={uploading}
                    >
                      {uploading ? "Adding..." : "Add certification"}
                    </Button>
                  </div>
                  {form.certifications && form.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {form.certifications.map((c) => (
                        <Badge
                          key={c}
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          <span>{c}</span>
                          <button
                            type="button"
                            className="rounded-md px-1 text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${c}`}
                            onClick={() => handleRemoveCertification(c)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeProfile;
