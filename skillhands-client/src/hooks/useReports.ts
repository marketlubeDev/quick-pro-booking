import { useState, useEffect } from "react";
import { reportsApi, ReportsData, EmployeePerformance } from "@/lib/api";
import { ServiceRequest } from "@/types";

interface UseReportsReturn {
  data: ReportsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useReports(
  timePeriod: string = "last-month"
): UseReportsReturn {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportsApi.getReportsData(timePeriod);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch reports data");
      }
    } catch (err) {
      console.error("Reports data fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch reports data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [timePeriod]);

  return {
    data,
    loading,
    error,
    refetch: fetchReportsData,
  };
}

interface UseServiceRequestsReturn {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useServiceRequests(
  timePeriod: string = "last-month"
): UseServiceRequestsReturn {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportsApi.getServiceRequests(timePeriod);

      if (response.success && response.data) {
        // Map API response fields to frontend expected fields
        const mappedRequests = response.data.map((request: any) => ({
          ...request,
          id: request._id || request.id,
          customerName: request.customerName || request.name,
          customerEmail: request.customerEmail || request.email,
          customerPhone: request.customerPhone || request.phone,
          serviceType: request.serviceType || request.service,
        }));
        setRequests(mappedRequests);
      } else {
        throw new Error(response.message || "Failed to fetch service requests");
      }
    } catch (err) {
      console.error("Service requests fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch service requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, [timePeriod]);

  return {
    requests,
    loading,
    error,
    refetch: fetchServiceRequests,
  };
}

interface UseEmployeePerformanceReturn {
  employees: EmployeePerformance[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmployeePerformance(
  timePeriod: string = "last-month"
): UseEmployeePerformanceReturn {
  const [employees, setEmployees] = useState<EmployeePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeePerformance = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportsApi.getEmployeePerformance(timePeriod);

      if (response.success && response.data) {
        setEmployees(response.data);
      } else {
        throw new Error(
          response.message || "Failed to fetch employee performance"
        );
      }
    } catch (err) {
      console.error("Employee performance fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch employee performance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeePerformance();
  }, [timePeriod]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployeePerformance,
  };
}

interface UseExportReportsReturn {
  exportReports: (format?: string) => Promise<void>;
  exporting: boolean;
  error: string | null;
}

export function useExportReports(
  timePeriod: string = "last-month"
): UseExportReportsReturn {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportReports = async (format: string = "csv") => {
    try {
      setExporting(true);
      setError(null);

      const blob = await reportsApi.exportReports(timePeriod, format);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reports-${timePeriod}-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export reports error:", err);
      setError(err instanceof Error ? err.message : "Failed to export reports");
    } finally {
      setExporting(false);
    }
  };

  return {
    exportReports,
    exporting,
    error,
  };
}
