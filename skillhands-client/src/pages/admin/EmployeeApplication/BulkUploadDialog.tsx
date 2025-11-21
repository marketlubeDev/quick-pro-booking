import { useState, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

export function BulkUploadDialog({
  isOpen,
  onClose,
  onSuccess,
}: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      const isValidFile =
        selectedFile.type === "text/csv" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel" ||
        fileName.endsWith(".csv") ||
        fileName.endsWith(".xlsx") ||
        fileName.endsWith(".xls");

      if (isValidFile) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV or Excel (XLSX) file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV or Excel file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await adminApi.bulkUploadEmployees(file);
      if (result.success && result.data) {
        setUploadResult(result.data);
        toast({
          title: "Upload completed",
          description: `Successfully processed ${result.data.success} of ${result.data.total} records`,
        });
        if (result.data.success > 0) {
          onSuccess();
        }
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setUploadResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Employees</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel (XLSX) file to bulk import employee
            applications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select CSV File</label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
                disabled={isUploading}
              />
              <label htmlFor="csv-upload" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg hover:bg-accent transition-colors">
                  {file ? (
                    <>
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm flex-1 truncate">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to select CSV or Excel file
                      </span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-2">
              <Alert
                variant={uploadResult.failed === 0 ? "default" : "destructive"}
              >
                <div className="flex items-start gap-2">
                  {uploadResult.failed === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="space-y-1">
                        <div>
                          <strong>Total:</strong> {uploadResult.total} records
                        </div>
                        <div className="text-green-600">
                          <strong>Success:</strong> {uploadResult.success}{" "}
                          records
                        </div>
                        {uploadResult.failed > 0 && (
                          <div className="text-red-600">
                            <strong>Failed:</strong> {uploadResult.failed}{" "}
                            records
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Error Details */}
              {uploadResult.errors.length > 0 && (
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Errors:</div>
                  <div className="space-y-1 text-xs">
                    {uploadResult.errors.slice(0, 10).map((error, idx) => (
                      <div key={idx} className="text-red-600">
                        Row {error.row} ({error.email}): {error.error}
                      </div>
                    ))}
                    {uploadResult.errors.length > 10 && (
                      <div className="text-muted-foreground">
                        ... and {uploadResult.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              {uploadResult ? "Close" : "Cancel"}
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
