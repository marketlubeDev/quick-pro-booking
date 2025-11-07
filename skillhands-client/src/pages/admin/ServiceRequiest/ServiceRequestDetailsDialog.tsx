import { ServiceRequest } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Edit2, Save, X, Loader2 } from "lucide-react";
import { updateServiceRequest } from "@/lib/api.serviceRequests";
import { employeeApi } from "@/lib/api";
import { toast } from "sonner";

type ServiceRequestDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ServiceRequest | null;
  onUpdate?: (updatedRequest: ServiceRequest) => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateDMYNumeric(dateString: string) {
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

  month = month.replace(".", "").slice(0, 3).toLowerCase();
  month = month.charAt(0).toUpperCase() + month.slice(1);

  return day && month && year ? `${day} ${month} ${year}` : dateString;
}

function formatDateDMYWithComma(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
  return `${formatted},`;
}

function formatCurrency(amount?: number | null) {
  if (amount === undefined || amount === null) return "-";
  const value = amount > 0 && amount % 1 === 0 ? amount / 100 : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "emergency":
      return "bg-red-100 text-red-800";
    case "urgent":
      return "bg-orange-100 text-orange-800";
    case "routine":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ServiceRequestDetailsDialog({
  open,
  onOpenChange,
  request,
  onUpdate,
}: ServiceRequestDetailsDialogProps) {
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isEditingScheduling, setIsEditingScheduling] = useState(false);
  const [isEditingAssignedPro, setIsEditingAssignedPro] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "website" as
      | "website"
      | "phone"
      | "walk-in"
      | "referral"
      | "social-media"
      | "other",
  });
  const [schedulingFormData, setSchedulingFormData] = useState({
    scheduledDate: "",
  });
  const [assignedProFormData, setAssignedProFormData] = useState({
    assignedEmployee: "",
    selectedEmployee: null as any,
  });

  // Fetch employees when dialog opens
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeApi.getEmployees();
        if (response.success && response.data) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    if (open) {
      fetchEmployees();
    }
  }, [open]);

  // Initialize form data when request changes
  useEffect(() => {
    if (request) {
      setCustomerFormData({
        name: request.name || "",
        phone: request.phone || "",
        email: request.email || "",
        source: request.source || "website",
      });
      setSchedulingFormData({
        scheduledDate: request.scheduledDate || "",
      });

      // Initialize assigned pro form data
      const currentEmployee = request.assignedEmployee;
      const hasEmployee =
        currentEmployee &&
        (typeof currentEmployee === "object"
          ? currentEmployee._id
          : currentEmployee);
      setAssignedProFormData({
        assignedEmployee: hasEmployee
          ? typeof currentEmployee === "object"
            ? currentEmployee._id
            : currentEmployee
          : "none",
        selectedEmployee:
          typeof currentEmployee === "object" ? currentEmployee : null,
      });
    }
  }, [request]);

  if (!request) return null;

  const handleEditCustomer = () => {
    setIsEditingCustomer(true);
    setCustomerFormData({
      name: request.name || "",
      phone: request.phone || "",
      email: request.email || "",
      source: request.source || "website",
    });
  };

  const handleCancelEdit = () => {
    setIsEditingCustomer(false);
    setCustomerFormData({
      name: request.name || "",
      phone: request.phone || "",
      email: request.email || "",
      source: request.source || "website",
    });
  };

  const handleEditScheduling = () => {
    setIsEditingScheduling(true);
    setSchedulingFormData({
      scheduledDate: request.scheduledDate || "",
    });
  };

  const handleCancelSchedulingEdit = () => {
    setIsEditingScheduling(false);
    setSchedulingFormData({
      scheduledDate: request.scheduledDate || "",
    });
  };

  const handleEditAssignedPro = () => {
    setIsEditingAssignedPro(true);
    const currentEmployee = request.assignedEmployee;
    const hasEmployee =
      currentEmployee &&
      (typeof currentEmployee === "object"
        ? currentEmployee._id
        : currentEmployee);
    setAssignedProFormData({
      assignedEmployee: hasEmployee
        ? typeof currentEmployee === "object"
          ? currentEmployee._id
          : currentEmployee
        : "none",
      selectedEmployee:
        typeof currentEmployee === "object" ? currentEmployee : null,
    });
  };

  const handleCancelAssignedProEdit = () => {
    setIsEditingAssignedPro(false);
    const currentEmployee = request.assignedEmployee;
    const hasEmployee =
      currentEmployee &&
      (typeof currentEmployee === "object"
        ? currentEmployee._id
        : currentEmployee);
    setAssignedProFormData({
      assignedEmployee: hasEmployee
        ? typeof currentEmployee === "object"
          ? currentEmployee._id
          : currentEmployee
        : "none",
      selectedEmployee:
        typeof currentEmployee === "object" ? currentEmployee : null,
    });
  };

  const handleSaveCustomer = async () => {
    if (!request) return;

    setIsSaving(true);

    try {
      // Prepare the update data
      const updateData = {
        id: request._id,
        name: customerFormData.name,
        phone: customerFormData.phone,
        source: customerFormData.source,
        // Note: email is not included as it's read-only in the form
      };

      console.log("Sending update data:", updateData);

      // Make API call to update the service request
      const updatedRequest = await updateServiceRequest(updateData);

      console.log("API response:", updatedRequest);

      // Call the onUpdate callback to update the parent component
      if (onUpdate) {
        onUpdate(updatedRequest);
      }

      // Update local form data to match the saved data
      setCustomerFormData({
        name: updatedRequest.name || "",
        phone: updatedRequest.phone || "",
        email: updatedRequest.email || "",
        source: updatedRequest.source || "website",
      });

      // Close edit mode
      setIsEditingCustomer(false);

      // Show success message
      toast.success("Customer information updated successfully");

      console.log("Customer information updated successfully:", {
        original: customerFormData,
        saved: {
          name: updatedRequest.name,
          phone: updatedRequest.phone,
          email: updatedRequest.email,
          source: updatedRequest.source,
        },
      });
    } catch (error) {
      console.error("Failed to update customer information:", error);
      toast.error("Failed to update customer information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveScheduling = async () => {
    if (!request) return;

    setIsSaving(true);

    try {
      // Prepare the update data
      const updateData = {
        id: request._id,
        scheduledDate: schedulingFormData.scheduledDate,
      };

      console.log("Sending scheduling update data:", updateData);

      // Make API call to update the service request
      const updatedRequest = await updateServiceRequest(updateData);

      console.log("Scheduling API response:", updatedRequest);

      // Call the onUpdate callback to update the parent component
      if (onUpdate) {
        onUpdate(updatedRequest);
      }

      // Update local form data to match the saved data
      setSchedulingFormData({
        scheduledDate: updatedRequest.scheduledDate || "",
      });

      // Close edit mode
      setIsEditingScheduling(false);

      // Show success message
      toast.success("Scheduling information updated successfully");

      console.log("Scheduling information updated successfully:", {
        original: schedulingFormData,
        saved: {
          scheduledDate: updatedRequest.scheduledDate,
        },
      });
    } catch (error) {
      console.error("Failed to update scheduling information:", error);
      toast.error("Failed to update scheduling information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAssignedPro = async () => {
    if (!request) return;

    setIsSaving(true);

    try {
      // Prepare the update data
      const updateData = {
        id: request._id,
        assignedEmployee:
          assignedProFormData.assignedEmployee === "none"
            ? null
            : assignedProFormData.assignedEmployee || null,
      };

      console.log("Sending assigned pro update data:", updateData);

      // Make API call to update the service request
      const updatedRequest = await updateServiceRequest(updateData);

      console.log("Assigned pro API response:", updatedRequest);

      // Call the onUpdate callback to update the parent component
      if (onUpdate) {
        onUpdate(updatedRequest);
      }

      // Update local form data to match the saved data
      const updatedEmployee = updatedRequest.assignedEmployee;
      const hasUpdatedEmployee =
        updatedEmployee &&
        (typeof updatedEmployee === "object"
          ? updatedEmployee._id
          : updatedEmployee);
      setAssignedProFormData({
        assignedEmployee: hasUpdatedEmployee
          ? typeof updatedEmployee === "object"
            ? updatedEmployee._id
            : updatedEmployee
          : "none",
        selectedEmployee:
          typeof updatedEmployee === "object" ? updatedEmployee : null,
      });

      // Close edit mode
      setIsEditingAssignedPro(false);

      // Show success message
      toast.success("Assigned pro updated successfully");

      console.log("Assigned pro updated successfully:", {
        original: assignedProFormData,
        saved: {
          assignedEmployee: updatedRequest.assignedEmployee,
        },
      });
    } catch (error) {
      console.error("Failed to update assigned pro:", error);
      toast.error("Failed to update assigned pro. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerFormData((prev) => ({
      ...prev,
      [field]:
        field === "source"
          ? (value as
              | "website"
              | "phone"
              | "walk-in"
              | "referral"
              | "social-media"
              | "other")
          : value,
    }));
  };

  const handleSchedulingInputChange = (field: string, value: string) => {
    setSchedulingFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmployeeSelection = (employeeId: string) => {
    if (employeeId === "none") {
      setAssignedProFormData((prev) => ({
        ...prev,
        assignedEmployee: "",
        selectedEmployee: null,
      }));
    } else {
      const selectedEmployee = employees.find((emp) => emp._id === employeeId);
      setAssignedProFormData((prev) => ({
        ...prev,
        assignedEmployee: employeeId,
        selectedEmployee: selectedEmployee || null,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Request Details</DialogTitle>
          <DialogDescription>ID: #{request._id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              {!isEditingCustomer ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditCustomer}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveCustomer}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                {isEditingCustomer ? (
                  <Input
                    value={customerFormData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="font-medium mt-1">{request.name}</p>
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Phone</Label>
                {isEditingCustomer ? (
                  <Input
                    value={customerFormData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-foreground mt-1">{request.phone}</p>
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                {isEditingCustomer ? (
                  <Input
                    type="email"
                    value={customerFormData.email}
                    readOnly
                    disabled
                    className="mt-1 bg-muted cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                ) : (
                  <p className="text-foreground mt-1">
                    {request.email || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Source</Label>
                {isEditingCustomer ? (
                  <Select
                    value={customerFormData.source}
                    onValueChange={(value) =>
                      handleInputChange("source", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="walk-in">Walk-in</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className="capitalize mt-1">
                    {request.source || "website"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge
                  className={getStatusColor(
                    (request.paymentStatus as any) || "pending"
                  )}
                >
                  {formatStatus(request.paymentStatus || "pending")}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <Badge variant="outline" className="capitalize">
                  {request.paymentMethod || "-"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-foreground">
                  {formatCurrency(request.totalAmount)}
                </p>
              </div>
              {request.amount !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {request.paymentStatus === "partially_paid"
                      ? "Amount Paid"
                      : "Subtotal"}
                  </p>
                  <p className="text-foreground">
                    {formatCurrency(request.amount || 0)}
                  </p>
                  {request.paymentStatus === "partially_paid" &&
                   request.totalAmount !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Remaining: {formatCurrency(
                        (request.totalAmount || 0) - (request.amount || 0)
                      )}
                    </p>
                  )}
                </div>
              )}
              {request.tax !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Tax</p>
                  <p className="text-foreground">
                    {formatCurrency(request.tax || 0)}
                  </p>
                </div>
              )}
              {request.paidAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid At</p>
                  <p className="text-foreground">
                    {new Date(request.paidAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Service Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Service Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{request.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="outline" className="capitalize">
                  {request.serviceCategory || "other"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(request.status)}>
                  {formatStatus(request.status)}
                </Badge>
              </div>
              {/* <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority}
                </Badge>
              </div> */}
              <div>
                <p className="text-sm text-muted-foreground">Urgency</p>
                <Badge
                  className={getUrgencyColor(request.urgency || "routine")}
                >
                  {request.urgency || "routine"}
                </Badge>
              </div>
              {/* {request.estimatedCost && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Cost
                  </p>
                  <p className="text-foreground">${request.estimatedCost}</p>
                </div>
              )} */}
            </div>
          </div>

          <Separator />

          {/* Location Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-foreground">{request.address}</p>
              </div>
              {request.city && (
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="text-foreground">{request.city}</p>
                </div>
              )}
              {request.state && (
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="text-foreground">{request.state}</p>
                </div>
              )}
              {request.zip && (
                <div>
                  <p className="text-sm text-muted-foreground">ZIP Code</p>
                  <p className="text-foreground">{request.zip}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Scheduling Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Scheduling Information</h3>
              {!isEditingScheduling ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditScheduling}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelSchedulingEdit}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveScheduling}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Preferred Date
                </Label>
                <p className="text-foreground mt-1">
                  {request.preferredDate
                    ? formatDateDMYNumeric(request.preferredDate)
                    : "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Preferred Time
                </Label>
                <p className="text-foreground mt-1">
                  {request.preferredTime || "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Scheduled Date
                </Label>
                {isEditingScheduling ? (
                  <Input
                    type="datetime-local"
                    value={schedulingFormData.scheduledDate}
                    onChange={(e) =>
                      handleSchedulingInputChange(
                        "scheduledDate",
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-foreground mt-1">
                    {request.scheduledDate
                      ? formatDate(request.scheduledDate)
                      : "Not scheduled"}
                  </p>
                )}
              </div>
              {/* {request.estimatedDuration && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Duration
                  </p>
                  <p className="text-foreground">
                    {request.estimatedDuration} hours
                  </p>
                </div>
              )}
              {request.actualDuration && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Actual Duration
                  </p>
                  <p className="text-foreground">
                    {request.actualDuration} hours
                  </p>
                </div>
              )} */}
              {/* {request.completedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="text-foreground">
                    {new Date(request.completedAt).toLocaleString()}
                  </p>
                </div>
              )} */}
            </div>
          </div>

          {/* Description */}
          {request.description && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-foreground">{request.description}</p>
              </div>
            </>
          )}

          {/* Notes */}
          {(request.customerNotes || request.adminNotes) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Notes</h3>
                {request.customerNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Customer Notes
                    </p>
                    <p className="text-foreground">{request.customerNotes}</p>
                  </div>
                )}
                {request.adminNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Admin Notes</p>
                    <p className="text-foreground">{request.adminNotes}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Employee Assignment */}
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Assigned Pro</h3>
              {!isEditingAssignedPro ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditAssignedPro}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelAssignedProEdit}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAssignedPro}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>

            {isEditingAssignedPro ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Select Pro
                  </Label>
                  <Select
                    value={assignedProFormData.assignedEmployee}
                    onValueChange={handleEmployeeSelection}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a pro..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No pro assigned</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          {employee.name || employee.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {assignedProFormData.selectedEmployee && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Name
                      </Label>
                      <p className="font-medium mt-1">
                        {assignedProFormData.selectedEmployee.name ||
                          assignedProFormData.selectedEmployee.fullName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Email
                      </Label>
                      <p className="text-foreground mt-1">
                        {assignedProFormData.selectedEmployee.email}
                      </p>
                    </div>
                    {assignedProFormData.selectedEmployee.phone && (
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Phone
                        </Label>
                        <p className="text-foreground mt-1">
                          {assignedProFormData.selectedEmployee.phone}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.assignedEmployee &&
                typeof request.assignedEmployee === "object" ? (
                  <>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Name
                      </Label>
                      <p className="font-medium mt-1">
                        {request.assignedEmployee.fullName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Email
                      </Label>
                      <p className="text-foreground mt-1">
                        {request.assignedEmployee.email}
                      </p>
                    </div>
                    {request.assignedEmployee.phone && (
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Phone
                        </Label>
                        <p className="text-foreground mt-1">
                          {request.assignedEmployee.phone}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">No pro assigned</p>
                  </div>
                )}
              </div>
            )}

            {request.employeeRemarks && (
              <div>
                <Label className="text-sm text-muted-foreground">
                  Pro Remarks
                </Label>
                <p className="text-foreground mt-1">
                  {request.employeeRemarks}
                </p>
              </div>
            )}
            {request.completionNotes && (
              <div>
                <Label className="text-sm text-muted-foreground">
                  Completion Notes
                </Label>
                <p className="text-foreground mt-1">
                  {request.completionNotes}
                </p>
              </div>
            )}
          </div>

          {/* Customer Feedback */}
          {(request.customerRating || request.customerFeedback) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Customer Feedback</h3>
                {request.customerRating && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < request.customerRating!
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({request.customerRating}/5)
                      </span>
                    </div>
                  </div>
                )}
                {request.customerFeedback && (
                  <div>
                    <p className="text-sm text-muted-foreground">Feedback</p>
                    <p className="text-foreground">
                      {request.customerFeedback}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Additional Information */}
          <Separator />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="text-foreground">
                  {formatDate(request.createdAt)}
                </p>
              </div>
              {request.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-foreground">
                    {formatDate(request.updatedAt)}
                  </p>
                </div>
              )}
              {request.tags && request.tags.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {request.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {request.isRecurring && (
                <div>
                  <p className="text-sm text-muted-foreground">Recurring</p>
                  <Badge variant="outline">
                    {request.recurringPattern || "Yes"}
                  </Badge>
                </div>
              )}
              {request.followUpRequired && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Follow-up Required
                  </p>
                  <Badge variant="outline">Yes</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
