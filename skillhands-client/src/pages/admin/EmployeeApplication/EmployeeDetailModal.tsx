import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  DollarSign,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  FileText,
  Loader2,
} from "lucide-react";
import { EmployeeApplication, WorkExperience } from "@/types";
import { fetchEmployeeJobs, type EmployeeJob } from "@/lib/api.employeeJobs";
import { adminApi, type EmployeeProfileData } from "@/lib/api";
import { 
  updateEmployeePersonalDetails,
  updateEmployeeProfessionalDetails,
  updateEmployeeStatus,
  type EmployeeDetailsUpdateInput 
} from "@/lib/api.employeeDetails";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmployeeDetailModalProps {
  application: EmployeeApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationUpdate?: (updatedApplication: EmployeeApplication) => void;
}

function getStatusBadgeVariant(
  status: string
):
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline" {
  switch (status) {
    case "pending":
      return "warning";
    case "in-progress":
      return "info";
    case "completed":
      return "success";
    case "cancelled":
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
}

function getJobStatusInfo(job: EmployeeJob) {
  if (job.status === "completed") {
    return { icon: CheckCircle, text: "Completed", color: "text-green-600" };
  }
  if (job.employeeAccepted && job.status === "in-progress") {
    return { icon: Clock, text: "In Progress", color: "text-blue-600" };
  }
  if (job.status === "pending" && !job.employeeAccepted) {
    return {
      icon: AlertCircle,
      text: "Pending Acceptance",
      color: "text-orange-600",
    };
  }
  return { icon: Clock, text: job.status, color: "text-gray-600" };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EmployeeDetailModal({
  application,
  isOpen,
  onClose,
  onApplicationUpdate,
}: EmployeeDetailModalProps) {
  const [jobs, setJobs] = useState<EmployeeJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [workExperienceLoading, setWorkExperienceLoading] = useState(false);
  const [workExperienceError, setWorkExperienceError] = useState<string | null>(
    null
  );
  const [employeeProfile, setEmployeeProfile] =
    useState<EmployeeProfileData | null>(null);
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [savingRating, setSavingRating] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editingDetails, setEditingDetails] = useState({
    name: "",
    phone: "",
    designation: "",
    address: "",
    city: "",
    zip: "",
    expectedSalary: "",
    experienceLevel: "",
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateNotes, setStatusUpdateNotes] = useState("");
  const [localApplication, setLocalApplication] = useState<EmployeeApplication | null>(null);
  const { toast } = useToast();

  console.log(application, "dsfdffasfsadsadas");

  useEffect(() => {
    if (isOpen && application?.user?._id) {
      fetchJobs();
      fetchWorkExperience();
    }
  }, [isOpen, application]);

  useEffect(() => {
    if (application) {
      console.log("Setting localApplication from application:", application);
      setLocalApplication(application);
      setEditingDetails({
        name: application.name || "",
        phone: application.phone || "",
        designation: application.designation || "",
        address: employeeProfile?.addressLine1 || application.address || "",
        city: employeeProfile?.city || application.city || "",
        zip: employeeProfile?.postalCode || application.zip || "",
        expectedSalary: String(application.expectedSalary || ""),
        experienceLevel: application.experienceLevel || "",
        skills: employeeProfile?.skills || application.skills || [],
      });
    }
  }, [application, employeeProfile]);

  // Debug effect to track localApplication changes
  useEffect(() => {
    console.log("localApplication changed:", localApplication);
  }, [localApplication]);

  const fetchJobs = async () => {
    if (!application?.user?._id) return;

    try {
      setJobsLoading(true);
      setJobsError(null);

      // Use the user ID to fetch jobs assigned to this employee
      const employeeJobs = await fetchEmployeeJobs(application.user._id);
      setJobs(employeeJobs);
    } catch (err) {
      console.error("Error fetching employee jobs:", err);
      setJobsError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchWorkExperience = async () => {
    if (!application?.user?._id) return;

    try {
      setWorkExperienceLoading(true);
      setWorkExperienceError(null);

      const response = await adminApi.getEmployeeProfile(application.user._id);
      if (response.success && response.data) {
        setEmployeeProfile(response.data);
        setWorkExperience(response.data.workExperience || []);
      } else {
        setEmployeeProfile(null);
        setWorkExperience([]);
      }
    } catch (err) {
      console.error("Error fetching work experience:", err);
      setWorkExperienceError(
        err instanceof Error ? err.message : "Failed to fetch work experience"
      );
    } finally {
      setWorkExperienceLoading(false);
    }
  };

  const selectedProfileId = application?.id; // maps to profileId in admin APIs

  const handleStarClick = (value: number) => {
    setEditingRating(value);
  };

  const handleSaveRating = async () => {
    if (!selectedProfileId || editingRating === null) return;
    try {
      setSavingRating(true);
      await adminApi.updateEmployeeRating(selectedProfileId, editingRating);
      toast({
        title: "Rating updated",
        description: `Saved ${editingRating}/5`,
      });
      // Update local app/application rating display
      if (employeeProfile) {
        setEmployeeProfile({ ...employeeProfile, rating: editingRating });
      }
      
      // Also update the local application and notify parent
      if (localApplication && onApplicationUpdate) {
        const updatedLocalApplication = {
          ...localApplication,
          rating: editingRating,
        };
        setLocalApplication(updatedLocalApplication);
        
        if (application) {
          const updatedOriginalApplication = {
            ...application,
            rating: editingRating,
          };
          onApplicationUpdate(updatedOriginalApplication);
        }
      }
    } catch (err) {
      toast({
        title: "Failed to update rating",
        description:
          err instanceof Error ? err.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSavingRating(false);
    }
  };

  const handleEditDetails = () => {
    setIsEditingDetails(true);
  };

  const handleCancelEdit = () => {
    setIsEditingDetails(false);
    // Reset to original values from local application
    if (localApplication) {
      setEditingDetails({
        name: localApplication.name || "",
        phone: localApplication.phone || "",
        designation: localApplication.designation || "",
        address: employeeProfile?.addressLine1 || localApplication.address || "",
        city: employeeProfile?.city || localApplication.city || "",
        zip: employeeProfile?.postalCode || localApplication.zip || "",
        expectedSalary: String(localApplication.expectedSalary || ""),
        experienceLevel: localApplication.experienceLevel || "",
        skills: employeeProfile?.skills || localApplication.skills || [],
      });
    }
  };

  const handleSaveDetails = async () => {
    if (!selectedProfileId) return;
    try {
      setSavingDetails(true);
      
      console.log("Saving details:", editingDetails);
      console.log("Current localApplication:", localApplication);
      
      // Prepare personal details update
      const personalDetailsUpdate = {
        fullName: editingDetails.name,
        phone: editingDetails.phone,
        addressLine1: editingDetails.address,
        city: editingDetails.city,
        postalCode: editingDetails.zip,
      };

      // Prepare professional details update
      const professionalDetailsUpdate = {
        designation: editingDetails.designation,
        level: editingDetails.experienceLevel as "Beginner" | "Intermediate" | "Expert",
        expectedSalary: Number(editingDetails.expectedSalary) || 0,
        skills: editingDetails.skills,
      };

      // Update personal details
      const updatedPersonalProfile = await updateEmployeePersonalDetails(selectedProfileId, personalDetailsUpdate);
      
      // Update professional details
      const updatedProfessionalProfile = await updateEmployeeProfessionalDetails(selectedProfileId, professionalDetailsUpdate);
      
      // Update the employee profile state with the latest data
      if (updatedProfessionalProfile) {
        setEmployeeProfile(updatedProfessionalProfile);
      } else if (updatedPersonalProfile) {
        // If professional profile update didn't return data, use personal profile data
        setEmployeeProfile(updatedPersonalProfile);
      }
      
      // Also update employeeProfile with the new values to ensure UI reflects changes
      if (employeeProfile) {
        const updatedProfile = {
          ...employeeProfile,
          fullName: editingDetails.name,
          phone: editingDetails.phone,
          addressLine1: editingDetails.address,
          city: editingDetails.city,
          postalCode: editingDetails.zip,
          designation: editingDetails.designation,
          level: editingDetails.experienceLevel as "Beginner" | "Intermediate" | "Expert",
          expectedSalary: Number(editingDetails.expectedSalary) || 0,
          skills: editingDetails.skills,
        };
        setEmployeeProfile(updatedProfile);
      }
      
      // Force refresh work experience to get latest data
      await fetchWorkExperience();
      
      // Update the local application state to reflect changes immediately
      if (localApplication) {
        const updatedApplication: EmployeeApplication = {
          ...localApplication,
          name: editingDetails.name,
          phone: editingDetails.phone,
          designation: editingDetails.designation,
          address: editingDetails.address,
          city: editingDetails.city,
          zip: editingDetails.zip,
          expectedSalary: Number(editingDetails.expectedSalary) || 0,
          experienceLevel: editingDetails.experienceLevel,
          skills: editingDetails.skills,
        };
        
        console.log("Updated application:", updatedApplication);
        setLocalApplication(updatedApplication);
      }
      
      // Also update the original application prop if possible (for parent component)
      // This ensures the parent component also gets the updated data
      if (application) {
        const updatedOriginalApplication: EmployeeApplication = {
          ...application,
          name: editingDetails.name,
          phone: editingDetails.phone,
          designation: editingDetails.designation,
          address: editingDetails.address,
          city: editingDetails.city,
          zip: editingDetails.zip,
          expectedSalary: Number(editingDetails.expectedSalary) || 0,
          experienceLevel: editingDetails.experienceLevel,
          skills: editingDetails.skills,
        };
        
        // Update the application prop by calling a callback if provided
        // This ensures the parent component also gets the updated data
        console.log("Updated original application:", updatedOriginalApplication);
        
        // Notify parent component of the update
        if (onApplicationUpdate) {
          onApplicationUpdate(updatedOriginalApplication);
        }
      }
      
      toast({
        title: "Details updated",
        description: "Employee details have been updated successfully",
      });
      setIsEditingDetails(false);
    } catch (err) {
      console.error("Error updating employee details:", err);
      toast({
        title: "Failed to update details",
        description:
          err instanceof Error ? err.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSavingDetails(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editingDetails.skills.includes(newSkill.trim())) {
      setEditingDetails(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditingDetails(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleStatusUpdate = async (newStatus: "pending" | "approved" | "rejected") => {
    if (!selectedProfileId) return;
    
    try {
      setIsUpdatingStatus(true);
      
      await updateEmployeeStatus(selectedProfileId, newStatus, statusUpdateNotes);
      
      // Update local application state
      if (localApplication) {
        const updatedLocalApplication = {
          ...localApplication,
          status: newStatus,
          verificationNotes: statusUpdateNotes,
        };
        setLocalApplication(updatedLocalApplication);
        
        // Also update the original application and notify parent
        if (application && onApplicationUpdate) {
          const updatedOriginalApplication = {
            ...application,
            status: newStatus,
            verificationNotes: statusUpdateNotes,
          };
          onApplicationUpdate(updatedOriginalApplication);
        }
      }
      
      toast({
        title: "Status updated",
        description: `Employee status changed to ${newStatus}`,
      });
      
      setStatusUpdateNotes("");
    } catch (err) {
      console.error("Error updating employee status:", err);
      toast({
        title: "Failed to update status",
        description: err instanceof Error ? err.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!application) return null;

  // Use local application for display, fallback to original application
  const currentApplication = localApplication || application;
  
  console.log("localApplication:", localApplication);
  console.log("application:", application);
  console.log("currentApplication:", currentApplication);

  console.log(jobs, "jobsasdasdas");

  const completedJobs = jobs.filter(
    (job) => (job.status || "").toLowerCase() === "completed"
  );
  const activeJobs = jobs.filter(
    (job) =>
      job.status === "in-process" ||
      (job.status === "pending" && job.employeeAccepted)
  );
  const pendingJobs = jobs.filter(
    (job) => job.status === "pending" && !job.employeeAccepted
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Pro Details - {currentApplication.name}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="experience">
              Experience ({workExperience.length})
            </TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Basic Information</span>
                  </div>
                  {!isEditingDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditDetails}
                      className="h-8 w-8 p-0"
                    >
                      <CiEdit className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    {isEditingDetails ? (
                      <Input
                        value={editingDetails.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm">{currentApplication.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-sm">{currentApplication.email}</p>
                  </div>
                  {(currentApplication.phone || isEditingDetails) && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      {isEditingDetails ? (
                        <Input
                          value={editingDetails.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm">{currentApplication.phone}</p>
                      )}
                    </div>
                  )}
                  {(currentApplication.designation || isEditingDetails) && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Designation
                      </label>
                      {isEditingDetails ? (
                        <Input
                          value={editingDetails.designation}
                          onChange={(e) => handleInputChange("designation", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm">{currentApplication.designation}</p>
                      )}
                    </div>
                  )}
                  {/* <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Location
                    </label>
                    <p className="text-sm flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{application.location}</span>
                    </p>
                  </div> */}
                  {((employeeProfile?.addressLine1 || currentApplication.address) || isEditingDetails) && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Address
                      </label>
                      {isEditingDetails ? (
                        <Input
                          value={editingDetails.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {employeeProfile?.addressLine1 || currentApplication.address}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                  {((employeeProfile?.city || currentApplication.city) || isEditingDetails) && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        City
                      </label>
                      {isEditingDetails ? (
                        <Input
                          value={editingDetails.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm">
                          {employeeProfile?.city || currentApplication.city}
                        </p>
                      )}
                    </div>
                  )}
                  {((employeeProfile?.postalCode || currentApplication.zip) || isEditingDetails) && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        ZIP Code
                      </label>
                      {isEditingDetails ? (
                        <Input
                          value={editingDetails.zip}
                          onChange={(e) => handleInputChange("zip", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm">
                          {employeeProfile?.postalCode || currentApplication.zip}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground pr-2">
                      Experience Level
                    </label>
                    {isEditingDetails ? (
                      <Select
                        value={editingDetails.experienceLevel}
                        onValueChange={(value) => handleInputChange("experienceLevel", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={
                          currentApplication.experienceLevel === "Expert"
                            ? "success"
                            : currentApplication.experienceLevel === "Intermediate"
                            ? "info"
                            : "warning"
                        }
                      >
                        {currentApplication.experienceLevel}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Expected Salary
                    </label>
                    {isEditingDetails ? (
                      <Input
                        value={editingDetails.expectedSalary}
                        onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                        className="mt-1"
                        placeholder="e.g., 5000 AED"
                      />
                    ) : (
                      <p className="text-sm flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{currentApplication.expectedSalary}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleStarClick(value)}
                          className="p-0.5"
                          aria-label={`Set rating to ${value}`}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              (editingRating ??
                                employeeProfile?.rating ??
                                application.rating) >= value
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {(editingRating ??
                        employeeProfile?.rating ??
                        application.rating) ||
                        0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({(application.previousJobCount && application.previousJobCount > 0 ? application.previousJobCount : workExperience.length) || 0} jobs)
                    </span>
                    {isEditingDetails && (
                      <Button
                        size="sm"
                        onClick={handleSaveRating}
                        disabled={savingRating || editingRating === null}
                      >
                        {savingRating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            Saving
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {currentApplication.bio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Bio
                    </label>
                    <p className="text-sm mt-1">{currentApplication.bio}</p>
                  </div>
                )}

                {isEditingDetails && (
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={savingDetails}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveDetails}
                      disabled={savingDetails}
                    >
                      {savingDetails ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingDetails ? (
                  <div className="space-y-3">
                    {/* Add new skill */}
                    <div className="flex space-x-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a new skill..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddSkill}
                        disabled={!newSkill.trim()}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {/* Current skills with remove option */}
                    <div className="flex flex-wrap gap-2">
                      {editingDetails.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-red-500"
                            aria-label={`Remove ${skill}`}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    {editingDetails.skills.length === 0 && (
                      <p className="text-sm text-muted-foreground">No skills added yet</p>
                    )}
                  </div>
                ) : (
                  <div>
                    {(employeeProfile?.skills || currentApplication.skills) && 
                     (employeeProfile?.skills || currentApplication.skills).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(employeeProfile?.skills || currentApplication.skills).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills listed</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            {application.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Certifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {application.certifications.map((cert) => (
                      <Badge
                        key={cert}
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Award className="h-3 w-3" />
                        <span>{cert}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Application Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge
                        variant={getStatusBadgeVariant(currentApplication.status)}
                      >
                        {currentApplication.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Applied Date
                    </label>
                    <p className="text-sm flex items-center space-x-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(currentApplication.appliedDate)}</span>
                    </p>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="space-y-3 pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">
                    Update Status
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={currentApplication.status === "approved" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate("approved")}
                      disabled={isUpdatingStatus || currentApplication.status === "approved"}
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : null}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant={currentApplication.status === "rejected" ? "destructive" : "outline"}
                      onClick={() => handleStatusUpdate("rejected")}
                      disabled={isUpdatingStatus || currentApplication.status === "rejected"}
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : null}
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant={currentApplication.status === "pending" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate("pending")}
                      disabled={isUpdatingStatus || currentApplication.status === "pending"}
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : null}
                      Set Pending
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status Notes
                    </label>
                    <Input
                      value={statusUpdateNotes}
                      onChange={(e) => setStatusUpdateNotes(e.target.value)}
                      placeholder="Add notes for status update..."
                      className="mt-1"
                    />
                  </div>
                </div>

                {(currentApplication.verificationNotes || application.verificationNotes) && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Verification Notes
                    </label>
                    <p className="text-sm mt-1">
                      {currentApplication.verificationNotes || application.verificationNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            {!application.user?._id ? (
              <div className="text-center py-8">
                <Alert variant="destructive">
                  <AlertDescription>
                    Unable to load work experience: User ID not available
                  </AlertDescription>
                </Alert>
              </div>
            ) : workExperienceLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading work experience...</span>
                </div>
              </div>
            ) : workExperienceError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading work experience: {workExperienceError}
                </AlertDescription>
              </Alert>
            ) : workExperience.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No work experience added yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {workExperience.map((exp, index) => (
                  <Card
                    key={exp.id || index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {exp.position}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{exp.company}</span>
                            {exp.location && (
                              <>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{exp.location}</span>
                              </>
                            )}
                          </p>
                        </div>
                        <Badge variant={exp.current ? "success" : "secondary"}>
                          {exp.current ? "Current" : "Previous"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <label className="text-muted-foreground">
                            Start Date
                          </label>
                          <p className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(exp.startDate)}</span>
                          </p>
                        </div>
                        <div>
                          <label className="text-muted-foreground">
                            {exp.current ? "Started" : "End Date"}
                          </label>
                          <p className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {exp.current
                                ? `${Math.floor(
                                    (new Date().getTime() -
                                      new Date(exp.startDate).getTime()) /
                                      (1000 * 60 * 60 * 24 * 30)
                                  )} months ago`
                                : exp.endDate
                                ? formatDate(exp.endDate)
                                : "Not specified"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {exp.description && (
                        <div className="mt-3 pt-3 border-t">
                          <label className="text-sm text-muted-foreground">
                            Description
                          </label>
                          <p className="text-sm mt-1">{exp.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {!application.user?._id ? (
              <div className="text-center py-8">
                <Alert variant="destructive">
                  <AlertDescription>
                    Unable to load jobs: User ID not available
                  </AlertDescription>
                </Alert>
              </div>
            ) : jobsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading jobs...</span>
                </div>
              </div>
            ) : jobsError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading jobs: {jobsError}
                </AlertDescription>
              </Alert>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs assigned yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Job Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {activeJobs.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Jobs
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {completedJobs.length > 0
                          ? completedJobs.length
                          : Math.max(0, employeeProfile?.totalJobs ?? 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {pendingJobs.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Pending
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {jobs.map((job) => {
                    const statusInfo = getJobStatusInfo(job);
                    return (
                      <Card
                        key={job.id || job._id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-sm">
                                {job.service || job.serviceType}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {job.description}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(job.status)}>
                              {statusInfo.text}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <label className="text-muted-foreground">
                                Address
                              </label>
                              <p className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{job.address}</span>
                              </p>
                            </div>
                            <div>
                              <label className="text-muted-foreground">
                                Scheduled
                              </label>
                              <p className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {job.scheduledDate
                                    ? formatDate(job.scheduledDate)
                                    : "Not scheduled"}
                                </span>
                              </p>
                            </div>
                            {/* <div>
                              <label className="text-muted-foreground">
                                Cost
                              </label>
                              <p className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>
                                  {job.estimatedCost
                                    ? `${job.estimatedCost} AED`
                                    : "Not estimated"}
                                </span>
                              </p>
                            </div> */}
                          </div>

                          {job.employeeRemarks && (
                            <div className="mt-3 pt-3 border-t">
                              <label className="text-sm text-muted-foreground">
                                Pro Remarks
                              </label>
                              <p className="text-sm mt-1">
                                {job.employeeRemarks}
                              </p>
                            </div>
                          )}

                          {job.completionNotes && (
                            <div className="mt-3 pt-3 border-t">
                              <label className="text-sm text-muted-foreground">
                                Completion Notes
                              </label>
                              <p className="text-sm mt-1">
                                {job.completionNotes}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                            <span>
                              Created: {formatDateTime(job.createdAt)}
                            </span>
                            {job.completedAt && (
                              <span>
                                Completed: {formatDateTime(job.completedAt)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
