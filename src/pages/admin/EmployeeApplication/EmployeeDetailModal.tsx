import { useState, useEffect } from "react";
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
import { adminApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmployeeDetailModalProps {
  application: EmployeeApplication | null;
  isOpen: boolean;
  onClose: () => void;
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
}: EmployeeDetailModalProps) {
  const [jobs, setJobs] = useState<EmployeeJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [workExperienceLoading, setWorkExperienceLoading] = useState(false);
  const [workExperienceError, setWorkExperienceError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isOpen && application?.user?._id) {
      fetchJobs();
      fetchWorkExperience();
    }
  }, [isOpen, application]);

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
      if (response.success && response.data?.workExperience) {
        setWorkExperience(response.data.workExperience);
      } else {
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

  if (!application) return null;

  const completedJobs = jobs.filter((job) => job.status === "completed");
  const activeJobs = jobs.filter(
    (job) =>
      job.status === "in-progress" ||
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
            <span>Employee Details - {application.name}</span>
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
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="text-sm">{application.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-sm">{application.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </label>
                    <p className="text-sm">{application.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Location
                    </label>
                    <p className="text-sm flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{application.location}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Experience Level
                    </label>
                    <Badge
                      variant={
                        application.experienceLevel === "Expert"
                          ? "success"
                          : application.experienceLevel === "Intermediate"
                          ? "info"
                          : "warning"
                      }
                    >
                      {application.experienceLevel}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Expected Salary
                    </label>
                    <p className="text-sm flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{application.expectedSalary} AED</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {application.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({application.previousJobCount} jobs)
                    </span>
                  </div>
                </div>

                {application.bio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Bio
                    </label>
                    <p className="text-sm mt-1">{application.bio}</p>
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
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
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
                    <div className="mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(application.status)}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Applied Date
                    </label>
                    <p className="text-sm flex items-center space-x-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(application.appliedDate)}</span>
                    </p>
                  </div>
                </div>

                {application.verificationNotes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Verification Notes
                    </label>
                    <p className="text-sm mt-1">
                      {application.verificationNotes}
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
                        {completedJobs.length}
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
                            <div>
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
                            </div>
                          </div>

                          {job.employeeRemarks && (
                            <div className="mt-3 pt-3 border-t">
                              <label className="text-sm text-muted-foreground">
                                Employee Remarks
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
