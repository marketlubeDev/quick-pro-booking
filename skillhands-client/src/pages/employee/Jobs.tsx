import React, { useState } from "react";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployeeJobs } from "@/hooks/useEmployeeJobs";
import { JobDetailModal } from "@/components/employee/JobDetailModal";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { EmployeeJob } from "@/lib/api.employeeJobs";

const statusToVariant: Record<string, any> = {
  pending: "secondary",
  "in-process": "default",
  "in-progress": "default",
  completed: "outline",
  cancelled: "destructive",
  rejected: "destructive",
};

const statusLabels: Record<string, string> = {
  pending: "Pending Admin Approval",
  "in-process": "Ready to Start",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const EmployeeJobs = () => {
  const [selectedJob, setSelectedJob] = useState<EmployeeJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const {
    jobs: allJobs,
    loading,
    error,
    refetch,
    acceptJobAction,
    completeJobAction,
    addRemarksAction,
  } = useEmployeeJobs();

  const handleViewJob = (job: EmployeeJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleAcceptJob = async (jobId: string) => {
    try {
      await acceptJobAction(jobId);
      toast({
        title: "Job Marked as Done",
        description: "You have successfully marked this job as completed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark job as done. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteJob = async (jobId: string, completionNotes?: string) => {
    try {
      await completeJobAction(jobId, completionNotes);
      toast({
        title: "Job Completed",
        description: "You have successfully completed this job.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddRemarks = async (jobId: string, remarks: string) => {
    try {
      await addRemarksAction(jobId, remarks);
      toast({
        title: "Remarks Added",
        description: "Your remarks have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add remarks. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter jobs based on active tab
  const getFilteredJobs = () => {
    switch (activeTab) {
      case "pending":
        return allJobs.filter(job => job.status === "pending" && !job.employeeAccepted);
      case "accepted":
        return allJobs.filter(job => job.employeeAccepted && (job.status === "in-process" || job.status === "in-progress"));
      case "completed":
        return allJobs.filter(job => job.status === "completed");
      default:
        return allJobs;
    }
  };

  const filteredJobs = getFilteredJobs();

  const getJobStatusInfo = (job: EmployeeJob) => {
    if (job.status === "completed") {
      return { icon: CheckCircle, text: "Completed", color: "text-green-600" };
    }
    if (job.employeeAccepted && (job.status === "in-process" || job.status === "in-progress")) {
      return { icon: Clock, text: "In Process", color: "text-blue-600" };
    }
    if (job.status === "pending" && !job.employeeAccepted) {
      return { icon: AlertCircle, text: "Pending Acceptance", color: "text-orange-600" };
    }
    return { icon: Clock, text: statusLabels[job.status] || job.status, color: "text-gray-600" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <div className="text-sm text-destructive">Error loading jobs: {error}</div>
        <Button onClick={refetch} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Jobs ({allJobs.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({allJobs.filter(job => job.status === "pending" && !job.employeeAccepted).length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            In Process ({allJobs.filter(job => job.employeeAccepted && (job.status === "in-process" || job.status === "in-progress")).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({allJobs.filter(job => job.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {activeTab === "all" && (
            <>
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-sm text-muted-foreground">
                    No jobs assigned yet.
                  </div>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const statusInfo = getJobStatusInfo(job);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <UICard key={job._id || job._id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {job.service || job.serviceType}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.address}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusToVariant[job.status] || "secondary"}>
                            {statusLabels[job.status] || job.status}
                          </Badge>
                          <div className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.text}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            {(job.scheduledDate && (job as any).scheduledTime) && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(job.scheduledDate).toLocaleDateString()} at {(job as any).scheduledTime}
                                </span>
                              </div>
                            )}
                            {job.estimatedCost && job.estimatedCost > 0 && (
                              <div className="flex items-center gap-1">
                                <span>${job.estimatedCost}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleViewJob(job)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                        {job.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </CardContent>
                    </UICard>
                  );
                })
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {activeTab === "pending" && (
            <>
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-sm text-muted-foreground">
                    No pending jobs found.
                  </div>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const statusInfo = getJobStatusInfo(job);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <UICard key={job._id || job._id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {job.service || job.serviceType}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.address}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusToVariant[job.status] || "secondary"}>
                            {statusLabels[job.status] || job.status}
                          </Badge>
                          <div className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.text}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            {(job.scheduledDate && (job as any).scheduledTime) && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(job.scheduledDate).toLocaleDateString()} at {(job as any).scheduledTime}
                                </span>
                              </div>
                            )}
                            {job.estimatedCost && job.estimatedCost > 0 && (
                              <div className="flex items-center gap-1">
                                <span>${job.estimatedCost}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleViewJob(job)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                        {job.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </CardContent>
                    </UICard>
                  );
                })
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {activeTab === "accepted" && (
            <>
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-sm text-muted-foreground">
                    No in process jobs found.
                  </div>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const statusInfo = getJobStatusInfo(job);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <UICard key={job._id || job._id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {job.service || job.serviceType}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.address}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusToVariant[job.status] || "secondary"}>
                            {statusLabels[job.status] || job.status}
                          </Badge>
                          <div className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.text}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            {(job.scheduledDate && (job as any).scheduledTime) && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(job.scheduledDate).toLocaleDateString()} at {(job as any).scheduledTime}
                                </span>
                              </div>
                            )}
                            {job.estimatedCost && job.estimatedCost > 0 && (
                              <div className="flex items-center gap-1">
                                <span>${job.estimatedCost}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleViewJob(job)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                        {job.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </CardContent>
                    </UICard>
                  );
                })
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {activeTab === "completed" && (
            <>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">
                    No completed jobs found.
              </div>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const statusInfo = getJobStatusInfo(job);
              const StatusIcon = statusInfo.icon;
              
              return (
                <UICard key={job._id || job._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {job.service || job.serviceType}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.address}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusToVariant[job.status] || "secondary"}>
                        {statusLabels[job.status] || job.status}
                      </Badge>
                      <div className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.text}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {(job.scheduledDate && (job as any).scheduledTime) && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(job.scheduledDate).toLocaleDateString()} at {(job as any).scheduledTime}
                            </span>
                          </div>
                        )}
                        {job.estimatedCost && job.estimatedCost > 0 && (
                          <div className="flex items-center gap-1">
                            <span>${job.estimatedCost}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => handleViewJob(job)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                    </div>
                    {job.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </CardContent>
                </UICard>
              );
            })
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAcceptJob}
        onComplete={handleCompleteJob}
        onAddRemarks={handleAddRemarks}
        loading={loading}
      />
    </div>
  );
};

export default EmployeeJobs;
