import { ServiceRequest } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  Save,
  X,
  Loader2,
  Link as LinkIcon,
  Copy,
  Share2,
  Trash2,
} from "lucide-react";
import { updateServiceRequest } from "@/lib/api.serviceRequests";
import {
  employeeApi,
  paymentApi,
  serviceRequestApi,
  type GeneratePaymentLinkData,
} from "@/lib/api";
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
  // Amounts are already in dollars from the API (converted via model toJSON transform)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString();
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

type PaymentLinkOption = "second_third" | "full" | "custom";

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
  const [isPaymentLinkDialogOpen, setIsPaymentLinkDialogOpen] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<PaymentLinkOption>("second_third");
  const [customPaymentAmount, setCustomPaymentAmount] = useState("");
  const [paymentLinkNote, setPaymentLinkNote] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLinkUrl, setGeneratedLinkUrl] = useState<string | null>(null);

  // Refresh service request data when dialog opens and periodically
  const refreshServiceRequest = useCallback(async () => {
    if (!request?._id && !request?.id) return;

    try {
      const requestId = request._id || request.id;
      const response = await serviceRequestApi.getById(requestId);
      if (response.success && response.data && onUpdate) {
        onUpdate(response.data as ServiceRequest);
      }
    } catch (error) {
      console.error("Failed to refresh service request:", error);
    }
  }, [request, onUpdate]);

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
      // Refresh service request data when dialog opens
      refreshServiceRequest();

      // Set up periodic refresh every 3 seconds while dialog is open (reduced from 5s for faster updates)
      const refreshInterval = setInterval(() => {
        refreshServiceRequest();
      }, 3000);

      // Also refresh when window regains focus (useful when payment is completed in another tab)
      const handleFocus = () => {
        refreshServiceRequest();
      };
      window.addEventListener("focus", handleFocus);

      return () => {
        clearInterval(refreshInterval);
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [open, refreshServiceRequest]);

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

  const totalAmount = request.totalAmount ?? 0;

  // Deduplicate payment history by referenceId (same payment shouldn't appear twice)
  const seenReferenceIds = new Set<string>();
  const uniquePaymentHistory = (request.paymentHistory || []).filter(
    (entry) => {
      if (entry.referenceId) {
        if (seenReferenceIds.has(entry.referenceId)) {
          return false; // Skip duplicate
        }
        seenReferenceIds.add(entry.referenceId);
      }
      return true;
    }
  );

  // Calculate amountPaid from successful payment history entries (for validation/display purposes)
  // Only count actual payments (type === "payment") with succeeded status
  const calculatedAmountPaid = uniquePaymentHistory
    .filter(
      (entry) =>
        entry.type === "payment" && entry.status === "succeeded" && entry.amount
    )
    .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

  // Prioritize backend amountPaid as the source of truth (it's always up-to-date)
  // Only fall back to calculated value if backend value is missing or invalid
  const amountPaid =
    request.amountPaid !== undefined && request.amountPaid !== null
      ? request.amountPaid
      : calculatedAmountPaid > 0
      ? calculatedAmountPaid
      : request.paymentStatus === "paid"
      ? totalAmount
      : request.amount ?? 0;

  // Always calculate remaining balance from totalAmount - amountPaid to ensure accuracy
  const computedRemaining = Math.max(0, totalAmount - (amountPaid || 0));

  const paymentHistory = uniquePaymentHistory.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  const pendingPaymentLink = paymentHistory.find(
    (entry) =>
      entry.type === "link" &&
      entry.status === "pending" &&
      entry.metadata?.checkoutUrl
  );
  const latestGeneratedLink =
    generatedLinkUrl || pendingPaymentLink?.metadata?.checkoutUrl || null;
  const parsedCustomAmount = Number.parseFloat(customPaymentAmount || "0");
  const plannedPaymentAmount = (() => {
    switch (selectedPaymentOption) {
      case "second_third": {
        const third = totalAmount / 3 || 0;
        return Math.max(0, Math.min(third, computedRemaining || third));
      }
      case "full":
        return computedRemaining || totalAmount || 0;
      case "custom":
        return parsedCustomAmount > 0 ? parsedCustomAmount : 0;
      default:
        return computedRemaining || 0;
    }
  })();
  const canGenerateLink = plannedPaymentAmount > 0;

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

  const handleCopyLink = async (link: string) => {
    if (!link) return;
    try {
      await navigator.clipboard?.writeText(link);
      toast.success("Payment link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Unable to copy the link. Please copy it manually.");
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (!url || url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const handleShareLink = async (link: string) => {
    if (!link) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Payment Link",
          text: "Please use this link to complete your payment",
          url: link,
        });
        toast.success("Payment link shared");
      } else {
        // Fallback to copy if share API is not available
        await navigator.clipboard?.writeText(link);
        toast.success("Payment link copied to clipboard");
      }
    } catch (error: any) {
      // User cancelled share or error occurred
      if (error.name !== "AbortError") {
        console.error("Failed to share link:", error);
        // Fallback to copy
        try {
          await navigator.clipboard?.writeText(link);
          toast.success("Payment link copied to clipboard");
        } catch (copyError) {
          toast.error("Unable to share or copy the link");
        }
      }
    }
  };

  const handleCancelLink = async () => {
    if (!request?._id || !pendingPaymentLink?._id) return;

    if (!confirm("Are you sure you want to cancel this payment link?")) {
      return;
    }

    try {
      // Update the payment history entry status to cancelled
      const updatedHistory = (request.paymentHistory || []).map((entry) => {
        if (entry._id === pendingPaymentLink._id) {
          return {
            ...entry,
            status: "cancelled" as const,
          };
        }
        return entry;
      });

      // Use updateServiceRequest with paymentHistory - backend should accept it
      const updatedRequest = await updateServiceRequest({
        id: request._id,
        // @ts-ignore - paymentHistory is not in the type but backend accepts it
        paymentHistory: updatedHistory,
      } as any);

      if (onUpdate) {
        onUpdate(updatedRequest);
      }

      toast.success("Payment link cancelled");
    } catch (error) {
      console.error("Failed to cancel payment link:", error);
      toast.error("Failed to cancel payment link. Please try again.");
    }
  };

  const handleGeneratePaymentLink = async () => {
    if (!request?._id) return;
    if (!canGenerateLink) {
      toast.error("Select a valid amount before generating a link.");
      return;
    }

    setIsGeneratingLink(true);
    try {
      const payload: GeneratePaymentLinkData = {
        serviceRequestId: request._id,
        option: selectedPaymentOption,
        note: paymentLinkNote || undefined,
        returnUrl: window.location.origin,
      };

      if (selectedPaymentOption === "custom") {
        payload.customAmount = Number(plannedPaymentAmount.toFixed(2));
      }

      const response = await paymentApi.generatePaymentLink(payload);

      if (!response.success) {
        throw new Error(response.message || "Failed to generate payment link");
      }

      const checkoutUrl = response.data?.checkoutUrl || "";

      if (response.data?.serviceRequest && onUpdate) {
        onUpdate(response.data.serviceRequest);
      } else {
        // Refresh service request data to get latest payment history
        await refreshServiceRequest();
      }

      if (checkoutUrl) {
        setGeneratedLinkUrl(checkoutUrl);
        try {
          await navigator.clipboard?.writeText(checkoutUrl);
          toast.success("Payment link generated and copied to clipboard");
        } catch {
          toast.success("Payment link generated");
        }
      } else {
        toast.success("Payment link generated");
      }

      setIsPaymentLinkDialogOpen(false);
      setCustomPaymentAmount("");
      setPaymentLinkNote("");
    } catch (error: any) {
      console.error("Failed to generate payment link:", error);
      toast.error(
        error?.message || "Failed to generate payment link. Please try again."
      );
    } finally {
      setIsGeneratingLink(false);
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

          <Separator />

          {/* Payment Information */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <Button
                size="sm"
                onClick={() => setIsPaymentLinkDialogOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <LinkIcon className="h-4 w-4" />
                Generate Payment Link
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-foreground">{formatCurrency(totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-foreground">
                  {formatCurrency(amountPaid || 0)}
                </p>
                {request.paidAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last paid at {formatDateTime(request.paidAt)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Remaining Balance
                </p>
                <p
                  className={`text-foreground font-semibold ${
                    computedRemaining === 0 ? "text-green-600" : ""
                  }`}
                >
                  {formatCurrency(computedRemaining)}
                </p>
                {computedRemaining === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    This request is fully paid.
                  </p>
                )}
              </div>
            </div>

            {latestGeneratedLink && (
              <div className="flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-2.5 py-1.5">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-xs font-medium text-muted-foreground truncate break-all max-w-full">
                    {truncateUrl(latestGeneratedLink, 45)}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyLink(latestGeneratedLink)}
                    className="h-7 w-7 p-0"
                    title="Copy full link"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShareLink(latestGeneratedLink)}
                    className="h-7 w-7 p-0"
                    title="Share link"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                  {pendingPaymentLink && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelLink}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      title="Cancel link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">Payment History</h4>
                <span className="text-sm text-muted-foreground">
                  {paymentHistory.length
                    ? `${paymentHistory.length} entr${
                        paymentHistory.length === 1 ? "y" : "ies"
                      }`
                    : "No history yet"}
                </span>
              </div>
              {paymentHistory.length ? (
                <div className="space-y-3">
                  {paymentHistory.map((entry) => (
                    <div
                      key={
                        entry._id || `${entry.referenceId}-${entry.createdAt}`
                      }
                      className="flex flex-wrap items-start justify-between gap-4 rounded-lg border bg-card p-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          {entry.label || formatStatus(entry.type)} ·{" "}
                          {formatCurrency(entry.amount || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatStatus(entry.method || "stripe")} ·{" "}
                          {formatDateTime(entry.createdAt)}
                        </p>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">
                            {entry.note}
                          </p>
                        )}
                        {entry.metadata?.checkoutUrl &&
                          entry.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 px-0"
                              onClick={() =>
                                handleCopyLink(entry.metadata.checkoutUrl)
                              }
                            >
                              <Copy className="h-4 w-4" />
                              Copy link
                            </Button>
                          )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="capitalize">
                          {formatStatus(entry.status || "pending")}
                        </Badge>
                        {entry.referenceId && (
                          <span className="text-xs text-muted-foreground">
                            Ref: {entry.referenceId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No payment activity recorded for this request yet.
                </p>
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
      <Dialog
        open={isPaymentLinkDialogOpen}
        onOpenChange={(openState) => {
          setIsPaymentLinkDialogOpen(openState);
          if (!openState) {
            setCustomPaymentAmount("");
            setPaymentLinkNote("");
            setIsGeneratingLink(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Payment Link</DialogTitle>
            <DialogDescription>
              Choose how much you want to collect and we&rsquo;ll create a
              Stripe Checkout link you can share with the customer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Payment option
              </Label>
              <RadioGroup
                className="mt-3 space-y-3"
                value={selectedPaymentOption}
                onValueChange={(value) =>
                  setSelectedPaymentOption(value as PaymentLinkOption)
                }
              >
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <RadioGroupItem value="second_third" id="option-second" />
                  <div>
                    <Label htmlFor="option-second" className="font-medium">
                      Second 1/3 (33%)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Charge the next installment of{" "}
                      {formatCurrency(
                        Math.min(
                          totalAmount / 3 || 0,
                          computedRemaining || totalAmount / 3 || 0
                        )
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <RadioGroupItem value="full" id="option-full" />
                  <div>
                    <Label htmlFor="option-full" className="font-medium">
                      Full remaining balance
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Collect the outstanding balance of{" "}
                      {formatCurrency(computedRemaining || totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <RadioGroupItem value="custom" id="option-custom" />
                  <div className="w-full">
                    <Label htmlFor="option-custom" className="font-medium">
                      Custom amount
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Set any amount if you need to collect something different.
                    </p>
                    {selectedPaymentOption === "custom" && (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter amount e.g. 125.50"
                        value={customPaymentAmount}
                        onChange={(e) => setCustomPaymentAmount(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">
                Note (optional)
              </Label>
              <Textarea
                className="mt-2"
                placeholder="Add context for this payment request..."
                value={paymentLinkNote}
                onChange={(e) => setPaymentLinkNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
              <span className="text-muted-foreground">Link amount</span>
              <span className="font-semibold">
                {formatCurrency(plannedPaymentAmount)}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPaymentLinkDialogOpen(false)}
              disabled={isGeneratingLink}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGeneratePaymentLink}
              disabled={isGeneratingLink || !canGenerateLink}
              className="flex items-center gap-2"
            >
              {isGeneratingLink ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
              {isGeneratingLink ? "Generating..." : "Generate link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
