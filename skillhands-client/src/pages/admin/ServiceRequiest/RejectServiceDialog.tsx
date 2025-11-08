import { useState } from "react";
import * as React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface RejectServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName?: string;
  serviceName?: string;
  isSubmitting?: boolean;
  canRefund?: boolean;
  paidAmount?: number; // Amount actually paid by customer (in cents)
  totalAmount?: number; // Total service amount (in cents)
  onConfirm: (reason: string, sendRefund: boolean, refundAmount?: number) => void;
}

export function RejectServiceDialog({
  open,
  onOpenChange,
  customerName,
  serviceName,
  isSubmitting = false,
  canRefund = false,
  paidAmount = 0,
  totalAmount = 0,
  onConfirm,
}: RejectServiceDialogProps) {
  const [reason, setReason] = useState("");
  const [sendRefund, setSendRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState<string>("");

  // Initialize refund amount with paid amount when dialog opens or refund is enabled
  React.useEffect(() => {
    if (canRefund && paidAmount > 0) {
      setRefundAmount((paidAmount / 100).toFixed(2));
    } else {
      setRefundAmount("");
    }
  }, [canRefund, paidAmount, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      let refundValue: number | undefined;
      if (sendRefund && refundAmount) {
        const parsedAmount = parseFloat(refundAmount);
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
          refundValue = Math.round(parsedAmount * 100); // Convert to cents
        }
      }
      onConfirm(reason.trim(), sendRefund, refundValue);
      setReason(""); // Reset form
      setSendRefund(false);
      setRefundAmount("");
    }
  };

  const handleCancel = () => {
    setReason("");
    setSendRefund(false);
    setRefundAmount("");
    onOpenChange(false);
  };

  const maxRefundAmount = paidAmount > 0 ? paidAmount / 100 : totalAmount / 100;

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
          {canRefund && (
            <div className="space-y-3 p-4 bg-muted rounded-lg border">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="send-refund"
                  checked={sendRefund}
                  onCheckedChange={(checked) => setSendRefund(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="send-refund"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Send refund to customer
                  </Label>
                </div>
              </div>

              {sendRefund && (
                <div className="space-y-2 pl-7">
                  <Label htmlFor="refund-amount" className="text-sm font-medium">
                    Refund Amount ($) *
                  </Label>
                  <div className="space-y-1">
                    <Input
                      id="refund-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={maxRefundAmount.toFixed(2)}
                      value={refundAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow empty, numbers, and one decimal point
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setRefundAmount(value);
                        }
                      }}
                      placeholder="Enter refund amount"
                      className="w-full"
                      required={sendRefund}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum refundable: ${maxRefundAmount.toFixed(2)}
                      {paidAmount > 0 && paidAmount < totalAmount && (
                        <span className="block mt-1">
                          (Customer paid ${(paidAmount / 100).toFixed(2)} of ${(totalAmount / 100).toFixed(2)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

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
              disabled={
                !reason.trim() ||
                isSubmitting ||
                (sendRefund && (!refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > maxRefundAmount))
              }
              className="min-w-[100px]"
            >
              {isSubmitting ? "Processing..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
