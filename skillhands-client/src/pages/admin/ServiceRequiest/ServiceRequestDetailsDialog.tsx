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

type ServiceRequestDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ServiceRequest | null;
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
}: ServiceRequestDetailsDialogProps) {
  if (!request) return null;

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
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{request.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground">{request.phone}</p>
              </div>
              {request.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">{request.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <Badge variant="outline" className="capitalize">
                  {request.source || "website"}
                </Badge>
              </div>
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
                  {request.status}
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
            <h3 className="text-lg font-semibold">Scheduling</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Preferred Date</p>
                <p className="text-foreground">
                  {request.preferredDate || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Time</p>
                <p className="text-foreground">
                  {request.preferredTime || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Date</p>
                <p className="text-foreground">
                  {request.scheduledDate
                    ? formatDate(request.scheduledDate)
                    : "Not scheduled"}
                </p>
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
          {request.assignedEmployee &&
            typeof request.assignedEmployee === "object" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Assigned Pro</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {request.assignedEmployee.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">
                        {request.assignedEmployee.email}
                      </p>
                    </div>
                    {request.assignedEmployee.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-foreground">
                          {request.assignedEmployee.phone}
                        </p>
                      </div>
                    )}
                  </div>
                  {request.employeeRemarks && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pro Remarks
                      </p>
                      <p className="text-foreground">
                        {request.employeeRemarks}
                      </p>
                    </div>
                  )}
                  {request.completionNotes && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Completion Notes
                      </p>
                      <p className="text-foreground">
                        {request.completionNotes}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

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
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
              {request.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-foreground">
                    {new Date(request.updatedAt).toLocaleString()}
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
