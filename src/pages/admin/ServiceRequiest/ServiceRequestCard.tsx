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
} from "lucide-react";
import { ServiceRequest, Employee } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { employeeApi, serviceRequestApi } from "@/lib/api";
import { toast } from "sonner";

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onViewDetails?: (request: ServiceRequest) => void;
  onAccept?: (requestId: string) => void;
  onComplete?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onEmployeeChange?: (requestId: string, employeeId: string | null) => void;
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ServiceRequestCard({
  request,
  onViewDetails,
  onAccept,
  onComplete,
  onReject,
  onEmployeeChange,
}: ServiceRequestCardProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [updatingEmployee, setUpdatingEmployee] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await employeeApi.getEmployees();
        if (response.success && response.data) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees");
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeChange = async (employeeId: string | null) => {
    try {
      setUpdatingEmployee(true);
      const response = await serviceRequestApi.updateAssignedEmployee(
        (request._id || request.id) as string,
        employeeId
      );
      
      if (response.success) {
        toast.success("Employee assignment updated successfully");
        onEmployeeChange?.((request._id || request.id) as string, employeeId);
      } else {
        toast.error("Failed to update employee assignment");
      }
    } catch (error) {
      console.error("Error updating assigned employee:", error);
      toast.error("Failed to update employee assignment");
    } finally {
      setUpdatingEmployee(false);
    }
  };

  const getAssignedEmployeeName = () => {
    if (request.assignedEmployeeDetails) {
      return request.assignedEmployeeDetails.name;
    }
    if (request.assignedEmployee) {
      const employee = employees.find(emp => emp._id === request.assignedEmployee);
      return employee?.name || "Unknown Employee";
    }
    return null;
  };
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{request.name}</h3>
            <p className="text-sm text-muted-foreground">#{request._id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle
              className={cn("h-4 w-4", getPriorityColor(request.priority))}
            />
            <Badge variant={getStatusBadgeVariant(request.status)}>
              {request.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Details */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-1">
            {request.service}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {request.description}
          </p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{request.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {request.address} {request.city} {request.state} {request.zip}
            </span>
          </div>
        </div>

        {/* Assigned Employee */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Assigned Employee:</span>
            </div>
            {request.assignedEmployee && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEmployeeChange(null)}
                disabled={updatingEmployee}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <Select
            value={request.assignedEmployee || undefined}
            onValueChange={(value) => handleEmployeeChange(value)}
            disabled={updatingEmployee || loadingEmployees}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={
                  loadingEmployees 
                    ? "Loading employees..." 
                    : updatingEmployee 
                    ? "Updating..." 
                    : "Select an employee"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getAssignedEmployeeName() && (
            <p className="text-xs text-muted-foreground">
              Currently assigned to: <span className="font-medium">{getAssignedEmployeeName()}</span>
            </p>
          )}
        </div>

        {/* Dates and Cost */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Preferred Date</p>
            <div className="flex items-center space-x-1 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground">
                {request.preferredDate} {request.preferredTime}
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

        {/* {request.scheduledDate && ( */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
          <div className="flex items-center space-x-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground">
              {formatDate(request.scheduledDate)}
            </span>
          </div>
        </div>
        {/* )} */}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(request)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>

          {request.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() =>
                  onAccept?.((request._id || request.id) as string)
                }
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  onReject?.((request._id || request.id) as string)
                }
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-1" />
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
              className="flex-1 bg-success hover:bg-success/90"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
