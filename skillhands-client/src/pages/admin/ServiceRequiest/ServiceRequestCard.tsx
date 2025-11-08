import {
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  User,
  UserCheck,
  Loader2,
} from "lucide-react";
import { ServiceRequest, Employee } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ServiceRequestCardProps {
  request: ServiceRequest;
  employees?: Employee[];
  onViewDetails?: (request: ServiceRequest) => void;
  onAccept?: (requestId: string) => void;
  onComplete?: (requestId: string) => void;
  onReject?: (request: ServiceRequest) => void;
  onEmployeeChange?: (requestId: string, employeeId: string | null) => void;
  isLoadingAccept?: boolean;
  isLoadingComplete?: boolean;
  isLoadingReject?: boolean;
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
    case "in-process":
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

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "priority-high";
    case "medium":
      return "priority-medium";
    case "low":
      return "priority-low";
    default:
      return "priority-low";
  }
}

function getPaymentBadgeVariant(
  status?: string
):
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline" {
  switch (status) {
    case "paid":
      return "success";
    case "partially_paid":
      return "warning";
    case "failed":
      return "destructive";
    case "refunded":
      return "secondary";
    case "pending":
    default:
      return "warning";
  }
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateDMY(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value ?? "";
  let month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  // Normalize month to 3-letter, capitalize first letter, without trailing dot (e.g., "Sept." -> "Sep")
  month = month.replace(".", "").slice(0, 3).toLowerCase();
  month = month.charAt(0).toUpperCase() + month.slice(1);

  return day && month && year ? `${day} ${month} ${year}` : dateString;
}

export function ServiceRequestCard({
  request,
  employees = [],
  onViewDetails,
  onAccept,
  onComplete,
  onReject,
  onEmployeeChange,
  isLoadingAccept = false,
  isLoadingComplete = false,
  isLoadingReject = false,
}: ServiceRequestCardProps) {
  console.log(request, "request");

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
              {request.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              #{request._id}
            </p>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {request.preferredTime?.toLowerCase().includes("emergency") &&
              request.preferredTime?.toLowerCase().includes("asap") && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            <Badge
              variant={getStatusBadgeVariant(request.status)}
              className="text-xs"
            >
              {formatStatus(request.status)}
            </Badge>
            {request.paymentStatus && (
              <Badge
                variant={getPaymentBadgeVariant(request.paymentStatus)}
                className="text-xs"
              >
                {formatStatus(request.paymentStatus)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
        {/* Service Details */}
        <div>
          <h4 className="font-medium text-xs sm:text-sm text-foreground mb-1">
            {request.service}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {request.description}
          </p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{request.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="line-clamp-1">
              {request.address} {request.city} {request.state} {request.zip}
            </span>
          </div>
        </div>

        {/* Assigned Pro */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-1">Assigned Pro</p>
          {request.assignedEmployee ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm min-w-0 flex-1">
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                <span className="text-foreground truncate">
                  {typeof request.assignedEmployee === "object" &&
                  request.assignedEmployee?.fullName
                    ? request.assignedEmployee.fullName
                    : "Unknown Pro"}
                </span>
              </div>
              <Select
                value={
                  typeof request.assignedEmployee === "object"
                    ? request.assignedEmployee._id
                    : request.assignedEmployee
                }
                onValueChange={(value) =>
                  onEmployeeChange?.(
                    (request._id || request.id) as string,
                    value === "unassign" ? null : value
                  )
                }
              >
                <SelectTrigger className="w-28 sm:w-36 h-8 sm:h-9 text-xs sm:text-sm shrink-0 border-border/60 shadow-sm hover:shadow-md transition-all">
                  <SelectValue placeholder="Change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassign">Unassign</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground min-w-0 flex-1">
                <User className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="italic truncate">Not assigned</span>
              </div>
              <Select
                value=""
                onValueChange={(value) =>
                  onEmployeeChange?.(
                    (request._id || request.id) as string,
                    value
                  )
                }
              >
                <SelectTrigger className="w-28 sm:w-36 h-8 sm:h-9 text-xs sm:text-sm shrink-0 border-border/60 shadow-sm hover:shadow-md transition-all">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Dates and Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Preferred Date</p>
            <div className="flex items-center space-x-1 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">
                {formatDateDMY(request.preferredDate)}, {request.preferredTime}
              </span>
            </div>
          </div>
          {/* <div>
            <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {request.estimatedCost} AED
              </span>
            </div>
          </div> */}
        </div>

        {request.scheduledDate ? (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
            <div className="flex items-center space-x-1 text-xs sm:text-sm">
              <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">
                {formatDate(request.scheduledDate)}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
            <div className="flex items-center space-x-1 text-xs sm:text-sm">
              <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground italic">
                Not scheduled
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
          {/* Details button - always present */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(request)}
            className={cn(
              "h-10 text-sm font-semibold border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary shadow-none hover:shadow-lg transition-all duration-200",
              // When 3 buttons: smaller Details, larger action buttons
              request.status === "pending"
                ? "flex-1 sm:flex-[0.35]"
                : "flex-1 sm:flex-[0.45]"
            )}
          >
            <Eye className="h-4 w-4" />
            Details
          </Button>

          {request.status === "pending" && (
            <>
              {/* Accept button - 3 buttons layout */}
              <Button
                size="sm"
                onClick={() =>
                  onAccept?.((request._id || request.id) as string)
                }
                className="flex-1 sm:flex-[0.325] h-10 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all"
                disabled={isLoadingAccept || isLoadingReject}
              >
                {isLoadingAccept ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Accept
              </Button>
              {/* Reject button - 3 buttons layout */}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject?.(request)}
                className="flex-1 sm:flex-[0.325] h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                disabled={isLoadingAccept || isLoadingReject}
              >
                {isLoadingReject ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Reject
              </Button>
            </>
          )}

          {request.status === "in-process" && (
            <Button
              size="sm"
              onClick={() =>
                onComplete?.((request._id || request.id) as string)
              }
              className="flex-1 sm:flex-[0.55] h-10 text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              disabled={isLoadingComplete}
            >
              {isLoadingComplete ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
