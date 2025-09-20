import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  Upload,
  X,
  Plus,
  Briefcase,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";
import {
  employeeApi,
  type EmployeeProfileData,
  type WorkExperience,
  type Certification,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SkillsCertificationsTabProps {
  form: EmployeeProfileData;
  onFormChange: (field: keyof EmployeeProfileData, value: any) => void;
}

const SkillsCertificationsTab = ({
  form,
  onFormChange,
}: SkillsCertificationsTabProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [newCertInput, setNewCertInput] = useState("");
  const [newCertFile, setNewCertFile] = useState<File | null>(null);
  const [skillsInput, setSkillsInput] = useState("");

  // Initialize skillsInput when form.skills changes
  useEffect(() => {
    if (form.skills && form.skills.length > 0) {
      setSkillsInput(form.skills.join(", "));
    }
  }, [form.skills]);

  // Work experience form state
  const [newWorkExp, setNewWorkExp] = useState<Partial<WorkExperience>>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    location: "",
  });
  const [showWorkExpForm, setShowWorkExpForm] = useState(false);

  const skillsDisplay = useMemo(() => form.skills || [], [form.skills]);

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
      if (res.success && res.data) {
        // Prefer server's authoritative list
        let updatedCerts = res.data.certifications || [];
        // If user typed a name, apply it to the most recently added item
        if (name && updatedCerts.length > 0) {
          const lastIndex = updatedCerts.length - 1;
          updatedCerts = updatedCerts.map((c, idx) =>
            idx === lastIndex ? { ...c, name } : c
          );
        }
        onFormChange("certifications", updatedCerts);
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

  const handleRemoveCertification = (cert: Certification) => {
    onFormChange(
      "certifications",
      (form.certifications || []).filter((c) => c.name !== cert.name)
    );
  };

  const handleAddWorkExperience = () => {
    if (!newWorkExp.company || !newWorkExp.position || !newWorkExp.startDate) {
      toast({
        title: "Missing information",
        description: "Please fill in company, position, and start date",
      });
      return;
    }

    const workExp: WorkExperience = {
      id: Date.now().toString(),
      company: newWorkExp.company,
      position: newWorkExp.position,
      startDate: newWorkExp.startDate,
      endDate: newWorkExp.current ? undefined : newWorkExp.endDate,
      current: newWorkExp.current || false,
      description: newWorkExp.description || "",
      location: newWorkExp.location || "",
    };

    onFormChange("workExperience", [...(form.workExperience || []), workExp]);

    // Reset form
    setNewWorkExp({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      location: "",
    });
    setShowWorkExpForm(false);
    toast({ title: "Work experience added successfully" });
  };

  const handleRemoveWorkExperience = (id: string) => {
    onFormChange(
      "workExperience",
      (form.workExperience || []).filter((exp) => exp.id !== id)
    );
    toast({ title: "Work experience removed" });
  };

  const handleWorkExpChange = (field: keyof WorkExperience, value: any) => {
    setNewWorkExp((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Skills & Certifications
          </CardTitle>
          <CardDescription>
            Showcase your skills and upload certifications to win more jobs
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
                value={skillsInput}
                onChange={(e) => {
                  setSkillsInput(e.target.value);
                }}
                onBlur={() => {
                  // Process skills when user leaves the input field
                  const skills = skillsInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  onFormChange("skills", skills);
                }}
                onKeyDown={(e) => {
                  // Process skills when user presses Enter
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const skills = skillsInput
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    onFormChange("skills", skills);
                    setSkillsInput("");
                  }
                }}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple skills with commas, then press Enter or click
                outside to add them
              </p>
            </div>

            {skillsDisplay.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Your Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skillsDisplay.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSkills =
                            form.skills?.filter((_, i) => i !== index) || [];
                          onFormChange("skills", updatedSkills);
                        }}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* <Separator /> */}

          {/* Certifications Section */}
          {/* <div className="space-y-4">
            <Label className="text-sm font-medium">Add New Certification</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certName" className="text-sm font-medium">
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
                <Label htmlFor="certFile" className="text-sm font-medium">
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
              disabled={uploading || !newCertInput.trim() || !newCertFile}
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
          </div> */}

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
                      key={cert.name}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {cert.name}
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

          <Separator />

          {/* Work Experience Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Work Experience</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowWorkExpForm(!showWorkExpForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </div>

            {/* Add Work Experience Form */}
            {showWorkExpForm && (
              <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company *
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          value={newWorkExp.company || ""}
                          onChange={(e) =>
                            handleWorkExpChange("company", e.target.value)
                          }
                          placeholder="Company name"
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium">
                        Position *
                      </Label>
                      <Input
                        id="position"
                        value={newWorkExp.position || ""}
                        onChange={(e) =>
                          handleWorkExpChange("position", e.target.value)
                        }
                        placeholder="Job title"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium"
                      >
                        Start Date *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          value={newWorkExp.startDate || ""}
                          onChange={(e) =>
                            handleWorkExpChange("startDate", e.target.value)
                          }
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium">
                        End Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="endDate"
                          type="date"
                          value={newWorkExp.endDate || ""}
                          onChange={(e) =>
                            handleWorkExpChange("endDate", e.target.value)
                          }
                          disabled={newWorkExp.current}
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={newWorkExp.location || ""}
                          onChange={(e) =>
                            handleWorkExpChange("location", e.target.value)
                          }
                          placeholder="City, State"
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="current"
                          checked={newWorkExp.current || false}
                          onChange={(e) => {
                            handleWorkExpChange("current", e.target.checked);
                            if (e.target.checked) {
                              handleWorkExpChange("endDate", "");
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="current"
                          className="text-sm font-medium"
                        >
                          Currently working here
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <textarea
                      id="description"
                      value={newWorkExp.description || ""}
                      onChange={(e) =>
                        handleWorkExpChange("description", e.target.value)
                      }
                      placeholder="Describe your role and responsibilities..."
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleAddWorkExperience}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowWorkExpForm(false);
                        setNewWorkExp({
                          company: "",
                          position: "",
                          startDate: "",
                          endDate: "",
                          current: false,
                          description: "",
                          location: "",
                        });
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Work Experience */}
            {form.workExperience && form.workExperience.length > 0 && (
              <div className="space-y-3">
                {form.workExperience.map((exp) => (
                  <Card key={exp.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                              {exp.position}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {exp.company}
                            </Badge>
                            {exp.current && (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-100 text-green-800"
                              >
                                Current
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(exp.startDate).toLocaleDateString()} -
                                {exp.current
                                  ? " Present"
                                  : exp.endDate
                                  ? new Date(exp.endDate).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                            {exp.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{exp.location}</span>
                              </div>
                            )}
                          </div>

                          {exp.description && (
                            <p className="text-sm text-gray-700 mt-2">
                              {exp.description}
                            </p>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveWorkExperience(exp.id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {(!form.workExperience || form.workExperience.length === 0) &&
              !showWorkExpForm && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No work experience added yet</p>
                  <p className="text-xs text-gray-400">
                    Add your professional experience to showcase your background
                  </p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsCertificationsTab;
