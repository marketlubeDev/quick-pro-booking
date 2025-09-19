import { ServiceRequest } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ServiceRequestDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ServiceRequest | null;
};

export function ServiceRequestDetailsDialog({
  open,
  onOpenChange,
  request,
}: ServiceRequestDetailsDialogProps) {
  console.log(request, "asdfdasdsadsadsadsada");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          {request && <DialogDescription>ID: #{request._id}</DialogDescription>}
        </DialogHeader>

        {request && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium text-foreground">{request.name}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground">{request.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-foreground">{request.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="text-foreground">{request.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <p className="capitalize text-foreground">{request.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="capitalize text-foreground">{request.status}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-foreground">{request.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Preferred Date</p>
                <p className="text-foreground">{request.preferredDate}</p>
              </div>
              {/* {request.scheduledDate && ( */}
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-foreground">
                  {request.scheduledDate} {request.preferredTime}
                </p>
              </div>
              {/* )} */}
              {request.completedDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-foreground">{request.completedDate}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
