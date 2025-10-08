import {
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Award,
} from "lucide-react";
import { EmployeeApplication } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface EmployeeApplicationCardProps {
  application: EmployeeApplication;
  onViewDetails?: (application: EmployeeApplication) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
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
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
}

function getExperienceBadgeVariant(
  level: string
):
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline" {
  switch (level) {
    case "Expert":
      return "success";
    case "Intermediate":
      return "info";
    case "Beginner":
      return "warning";
    default:
      return "secondary";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function EmployeeApplicationCard({
  application,
  onViewDetails,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: EmployeeApplicationCardProps) {
  console.log(application, "asjdgksgs");
  const displayedPreviousJobs =
    application.previousJobCount && application.previousJobCount > 0
      ? application.previousJobCount
      : application.workExperience?.length ?? 0;
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {application.name}
              </h3>
              <p className="text-sm text-muted-foreground">#{application.id}</p>
              {application.designation && (
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {application.designation}
                  </Badge>
                </div>
              )}
              {/* {application.user?.role && (
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {application.user.role}
                  </Badge>
                </div>
              )} */}
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {application.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({displayedPreviousJobs} jobs)
                </span>
              </div>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(application.status)}>
            {application.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Experience Level */}
        <div className="flex items-center justify-between">
          <Badge
            variant={getExperienceBadgeVariant(application.experienceLevel)}
          >
            {application.experienceLevel}
          </Badge>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{application.location}</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {application.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {application.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{application.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Certifications */}
        {application.certifications.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Certifications
            </p>
            <div className="flex flex-wrap gap-1">
              {application.certifications.slice(0, 2).map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {cert}
                </Badge>
              ))}
              {application.certifications.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{application.certifications.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{application.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{application.email}</span>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Expected Salary
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {application.expectedSalary}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Applied</p>
            <div className="flex items-center space-x-1 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground">
                {formatDate(application.appliedDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(application)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>

          {application.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove?.(application.id)}
                className="flex-1 bg-success hover:bg-success/90"
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <>
                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject?.(application.id)}
                className="flex-1"
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? (
                  <>
                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
