import { useState } from "react";
import { RefreshCw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RefundServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName?: string;
  serviceName?: string;
  paidAmount?: number; // Amount in cents
  isSubmitting?: boolean;
  onConfirm: (amount?: number, reason?: string) => void;
}

export function RefundServiceDialog({
  open,
  onOpenChange,
  customerName,
  serviceName,
  paidAmount,
  isSubmitting = false,
  onConfirm,
}: RefundServiceDialogProps) {
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [reason, setReason] = useState("");

  // Convert cents to dollars for display
  const paidAmountDollars = paidAmount ? (paidAmount / 100).toFixed(2) : "0.00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refundType === "full") {
      onConfirm(undefined, reason.trim() || undefined);
    } else {
      const amount = parseFloat(partialAmount);
      if (!isNaN(amount) && amount > 0) {
        // Convert to cents
        onConfirm(amount * 100, reason.trim() || undefined);
      }
    }
    // Reset form
    setRefundType("full");
    setPartialAmount("");
    setReason("");
  };

  const handleCancel = () => {
    setRefundType("full");
    setPartialAmount("");
    setReason("");
    onOpenChange(false);
  };

  const handleRefundTypeChange = (type: "full" | "partial") => {
    setRefundType(type);
    setPartialAmount("");
  };

  const partialAmountNum = parseFloat(partialAmount);
  const isValidPartial =
    refundType === "full" ||
    (!isNaN(partialAmountNum) &&
      partialAmountNum > 0 &&
      (!paidAmount || partialAmountNum * 100 <= paidAmount));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Process Refund
          </DialogTitle>
          <DialogDescription>
            Process a refund for this service request payment.
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
            {paidAmount && (
              <span className="block text-sm font-medium">
                Paid Amount: ${paidAmountDollars}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Refund Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={refundType === "full" ? "default" : "outline"}
                onClick={() => handleRefundTypeChange("full")}
                className="flex-1"
              >
                Full Refund
              </Button>
              <Button
                type="button"
                variant={refundType === "partial" ? "default" : "outline"}
                onClick={() => handleRefundTypeChange("partial")}
                className="flex-1"
              >
                Partial Refund
              </Button>
            </div>
          </div>

          {refundType === "partial" && (
            <div className="space-y-2">
              <Label htmlFor="partial-amount" className="text-sm font-medium">
                Refund Amount (USD) *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="partial-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={paidAmountDollars}
                  placeholder="0.00"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="pl-9"
                  required={refundType === "partial"}
                />
              </div>
              {paidAmount && (
                <p className="text-xs text-muted-foreground">
                  Maximum refund: ${paidAmountDollars}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="refund-reason" className="text-sm font-medium">
              Reason (Optional)
            </Label>
            <Textarea
              id="refund-reason"
              placeholder="Enter reason for refund (optional)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be saved for internal tracking.
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
              variant="default"
              disabled={!isValidPartial || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Processing..." : "Process Refund"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
