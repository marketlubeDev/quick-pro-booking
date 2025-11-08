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
import { cn } from "@/lib/utils";

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
  const designations = Array.isArray(application.designation)
    ? application.designation
    : typeof application.designation === "string"
    ? application.designation
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean)
    : [];
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50 flex flex-col h-full">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                {application.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                #{application.id}
              </p>
              {designations.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {designations.map((designation) => (
                    <Badge
                      key={designation}
                      variant="secondary"
                      className="text-xs"
                    >
                      {designation}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  {application.rating}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  ({displayedPreviousJobs} jobs)
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={getStatusBadgeVariant(application.status)}
            className="text-xs shrink-0"
          >
            {application.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0 flex flex-col flex-1 min-h-0">
        <div className="space-y-3 sm:space-y-4 flex-1 min-h-0">
          {/* Experience Level */}
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant={getExperienceBadgeVariant(application.experienceLevel)}
              className="text-xs"
            >
              {application.experienceLevel}
            </Badge>
            <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground min-w-0">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{application.location}</span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs sm:text-sm font-medium text-foreground mb-2">
              Skills
            </p>
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

          {/* Working Areas */}
          {(application.workingZipCodes?.length ||
            application.workingCities?.length) && (
            <div>
              <p className="text-xs sm:text-sm font-medium text-foreground mb-2">
                Working Areas
              </p>
              {application.workingZipCodes?.length ? (
                <div className="mb-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    ZIP codes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {application.workingZipCodes.slice(0, 5).map((zip) => (
                      <Badge key={zip} variant="outline" className="text-xs">
                        {zip}
                      </Badge>
                    ))}
                    {application.workingZipCodes.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{application.workingZipCodes.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              ) : null}
              {application.workingCities?.length ? (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Cities</p>
                  <div className="flex flex-wrap gap-1">
                    {application.workingCities.slice(0, 5).map((city) => (
                      <Badge key={city} variant="secondary" className="text-xs">
                        {city}
                      </Badge>
                    ))}
                    {application.workingCities.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{application.workingCities.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

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
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span className="truncate">{application.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{application.email}</span>
            </div>
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Expected Salary
              </p>
              <div className="flex items-center space-x-1 text-xs sm:text-sm">
                <DollarSign className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-medium text-foreground truncate">
                  {application.expectedSalary}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Applied</p>
              <div className="flex items-center space-x-1 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-foreground truncate">
                  {formatDate(application.appliedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(application)}
            className={cn(
              "h-10 text-sm font-semibold border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary shadow-none hover:shadow-lg transition-all duration-200",
              application.status === "pending"
                ? "flex-1 sm:flex-[0.35]"
                : "flex-1"
            )}
          >
            <Eye className="h-4 w-4" />
            Details
          </Button>

          {application.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove?.(application.id)}
                className="flex-1 sm:flex-[0.325] h-10 text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject?.(application.id)}
                className="flex-1 sm:flex-[0.325] h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
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
