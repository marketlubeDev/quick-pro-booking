import { useState } from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName?: string;
  serviceName?: string;
  isSubmitting?: boolean;
  onConfirm: (reason: string) => void;
}

export function RejectServiceDialog({
  open,
  onOpenChange,
  customerName,
  serviceName,
  isSubmitting = false,
  onConfirm,
}: RejectServiceDialogProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason(""); // Reset form
    }
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Reject Service Request
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this service request. This
            will help us improve our services.
            {customerName && (
              <span className="block mt-2 text-sm font-medium">
                Customer: {customerName}
              </span>
            )}
            {serviceName && (
              <span className="block text-sm font-medium">
                Service: {serviceName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rejection-reason" className="text-sm font-medium">
              Rejection Reason *
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please explain why this service request is being rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              This reason will be saved and may be used for internal tracking.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!reason.trim() || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
