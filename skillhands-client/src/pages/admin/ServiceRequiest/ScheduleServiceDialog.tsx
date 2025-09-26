import { useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

type ScheduleServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (scheduledDateISO: string) => void;
  defaultDate?: string;
  preferredDate?: string;
  preferredTime?: string;
  customerName?: string;
  isSubmitting?: boolean;
};

export function ScheduleServiceDialog({
  open,
  onOpenChange,
  onConfirm,
  defaultDate,
  preferredDate,
  preferredTime,
  customerName,
  isSubmitting = false,
}: ScheduleServiceDialogProps) {
  const [scheduledAt, setScheduledAt] = useState<string>(defaultDate || "");
  const [usePreferred, setUsePreferred] = useState<boolean>(false);

  const preferredDateTimeInputValue = useMemo(() => {
    if (!preferredDate) return "";

    const pad = (n: number) => String(n).padStart(2, "0");

    // If preferredTime looks like a slot (e.g., "Morning (8AM - 12PM)"),
    // use the start of the indicated range as the concrete time.
    const parseTimeLabelTo24h = (
      label?: string
    ): { hours: number; minutes: number } | null => {
      if (!label) return null;

      const lower = label.toLowerCase();

      // Emergency handling: set to 08:00
      if (lower.includes("asap") || lower.includes("emergency")) {
        return { hours: 8, minutes: 0 };
      }

      // Try to extract range inside parentheses, e.g. (8AM - 12PM)
      const parenMatch = label.match(/\(([^)]+)\)/);
      const range = parenMatch?.[1] || ""; // e.g. "8AM - 12PM"
      const startPart = range.split("-")[0]?.trim(); // e.g. "8AM"

      const parseAmPm = (
        part?: string
      ): { hours: number; minutes: number } | null => {
        if (!part) return null;
        const m = part.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
        if (!m) return null;
        let hours = parseInt(m[1], 10);
        const minutes = m[2] ? parseInt(m[2], 10) : 0;
        const ampm = (m[3] || "").toLowerCase();
        if (ampm === "pm" && hours !== 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
        return { hours, minutes };
      };

      const startParsed = parseAmPm(startPart);
      if (startParsed) return startParsed;

      // Fallback mapping if no parentheses/range
      if (lower.includes("morning")) return { hours: 9, minutes: 0 };
      if (lower.includes("afternoon")) return { hours: 13, minutes: 0 };
      if (lower.includes("evening")) return { hours: 18, minutes: 0 };

      return null;
    };

    const dateOnly = preferredDate.includes("T")
      ? preferredDate.split("T")[0]
      : preferredDate; // expect YYYY-MM-DD

    const parsedSlot = parseTimeLabelTo24h(preferredTime);

    // If we couldn't parse time, return empty to avoid misleading fill
    if (!parsedSlot) return "";

    const { hours, minutes } = parsedSlot;
    const hh = pad(hours);
    const mm = pad(minutes);
    return `${dateOnly}T${hh}:${mm}`;
  }, [preferredDate, preferredTime]);

  const handleTogglePreferred = (checked: boolean) => {
    setUsePreferred(checked);
    if (checked && preferredDateTimeInputValue) {
      setScheduledAt(preferredDateTimeInputValue);
    }
  };

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
          {(preferredDate || preferredTime) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Preferred date & time</Label>
                  <div className="text-sm text-muted-foreground">
                    {(preferredDate || "-") +
                      (preferredTime ? ` ${preferredTime}` : "")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="usePreferred"
                    checked={usePreferred}
                    onCheckedChange={(val) =>
                      handleTogglePreferred(Boolean(val))
                    }
                    disabled={!preferredDateTimeInputValue || isSubmitting}
                  />
                  <Label htmlFor="usePreferred" className="cursor-pointer">
                    Use preferred
                  </Label>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Scheduled date & time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              disabled={usePreferred || isSubmitting}
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
