import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { EmployeeJob } from "@/lib/api.employeeJobs";

interface JobDetailModalProps {
  job: EmployeeJob | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (jobId: string) => Promise<void>;
  onComplete: (jobId: string, completionNotes?: string) => Promise<void>;
  onAddRemarks: (jobId: string, remarks: string) => Promise<void>;
  loading?: boolean;
}

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

export function JobDetailModal({
  job,
  isOpen,
  onClose,
  onAccept,
  onComplete,
  onAddRemarks,
  loading = false,
}: JobDetailModalProps) {
  const [completionNotes, setCompletionNotes] = useState("");
  const [remarks, setRemarks] = useState(job?.employeeRemarks || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (job) {
      setRemarks(job.employeeRemarks || "");
      setCompletionNotes("");
    }
  }, [job]);

  if (!job) return null;

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      await onAccept(job.id || job._id || "");
    } catch (error) {
      console.error("Error accepting job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      await onComplete(job.id || job._id || "", completionNotes);
      setCompletionNotes("");
    } catch (error) {
      console.error("Error completing job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRemarks = async () => {
    try {
      setIsSubmitting(true);
      await onAddRemarks(job.id || job._id || "", remarks);
    } catch (error) {
      console.error("Error adding remarks:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canMarkAsDone = job.status === "in-process"; // Show "Mark as Done" only when admin has accepted (status is in-process)
  const canComplete = job.employeeAccepted && job.status === "in-progress";
  const isCompleted = job.status === "completed";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {job.service || job.serviceType}
            <Badge variant={statusToVariant[job.status] || "secondary"}>
              {statusLabels[job.status] || job.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Job ID: {job.id || job._id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {job.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {job.customerName || job.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{job.customerPhone || job.phone}</span>
              </div>
              {(job.customerEmail || job.email) && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{job.customerEmail || job.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{job.address}</p>
                  {(job.city || job.state || job.zip) && (
                    <p className="text-sm text-muted-foreground">
                      {[job.city, job.state, job.zip]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.scheduledDate && (job as any).scheduledTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(job.scheduledDate).toLocaleDateString()} at{" "}
                    {(job as any).scheduledTime}
                  </span>
                </div>
              )}
              {job.preferredDate && job.preferredTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Preferred:{" "}
                    {new Date(job.preferredDate).toLocaleDateString()} at{" "}
                    {job.preferredTime}
                  </span>
                </div>
              )}
              {/* {job.estimatedCost && job.estimatedCost > 0 && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Estimated Cost: ${job.estimatedCost}</span>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Employee Actions */}
          {job.employeeAccepted && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Accepted on{" "}
                    {job.employeeAcceptedAt
                      ? new Date(job.employeeAcceptedAt).toLocaleString()
                      : "Unknown date"}
                  </span>
                </div>
                {isCompleted && job.completedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Completed on {new Date(job.completedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Employee Remarks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Remarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="remarks">Add or update remarks</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any notes or remarks about this job..."
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleAddRemarks}
                disabled={isSubmitting || loading}
                size="sm"
              >
                {isSubmitting ? "Saving..." : "Save Remarks"}
              </Button>
            </CardContent>
          </Card>

          {/* Completion Notes */}
          {canComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complete Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="completionNotes">
                    Completion Notes (Optional)
                  </Label>
                  <Textarea
                    id="completionNotes"
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Add any notes about the completion of this job..."
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleComplete}
                  disabled={isSubmitting || loading}
                  className="w-full"
                >
                  {isSubmitting ? "Completing..." : "Mark as Complete"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {canMarkAsDone && (
              <Button
                onClick={handleAccept}
                disabled={isSubmitting || loading}
                className="flex-1"
              >
                {isSubmitting ? "Marking as Done..." : "Mark as Done"}
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
