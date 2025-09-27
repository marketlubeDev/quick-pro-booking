import { useState } from "react";
import { XCircle, AlertTriangle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RejectApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  employeeName?: string;
  loading?: boolean;
}

export function RejectApplicationDialog({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
  loading = false,
}: RejectApplicationDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setError(
        "Please provide a more detailed reason (at least 10 characters)"
      );
      return;
    }

    setError("");
    onConfirm(rejectionReason.trim());
  };

  const handleClose = () => {
    setRejectionReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Reject Application
          </DialogTitle>
          <DialogDescription>
            {employeeName
              ? `Are you sure you want to reject ${employeeName}'s application?`
              : "Are you sure you want to reject this application?"}
            <br />
            Please provide a reason for the rejection. This will be included in
            the notification email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. The employee will receive an email
              notification with your reason.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">
              Rejection Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a clear and constructive reason for rejection..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (error) setError("");
              }}
              className="min-h-[100px] resize-none"
              disabled={loading}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Minimum 10 characters</span>
              <span>{rejectionReason.length}/500</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || !rejectionReason.trim()}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Application
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
