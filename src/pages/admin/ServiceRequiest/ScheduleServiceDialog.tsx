import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ScheduleServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (scheduledDateISO: string) => void;
  defaultDate?: string;
  customerName?: string;
  isSubmitting?: boolean;
};

export function ScheduleServiceDialog({
  open,
  onOpenChange,
  onConfirm,
  defaultDate,
  customerName,
  isSubmitting = false,
}: ScheduleServiceDialogProps) {
  const [scheduledAt, setScheduledAt] = useState<string>(defaultDate || "");

  console.log(scheduledAt, "scheduledAt");

  const handleConfirm = () => {
    console.log("handleConfirm called, scheduledAt:", scheduledAt);
    if (!scheduledAt) {
      console.log("scheduledAt is empty, returning early");
      return;
    }
    const isoString = new Date(scheduledAt).toISOString();
    console.log("Calling onConfirm with:", isoString);
    onConfirm(isoString);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule service</DialogTitle>
          <DialogDescription>
            {customerName
              ? `Choose date and time for ${customerName}.`
              : "Choose date and time."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Scheduled date & time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!scheduledAt || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
