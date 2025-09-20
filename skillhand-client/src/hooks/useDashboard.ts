import { useState, useEffect } from "react";
import { dashboardApi, DashboardStats, DashboardOverview } from "@/lib/api";
import { ServiceRequest, EmployeeApplication } from "@/types";

interface UseDashboardReturn {
  stats: DashboardStats | null;
  recentRequests: ServiceRequest[];
  recentApplications: EmployeeApplication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [recentApplications, setRecentApplications] = useState<
    EmployeeApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getOverview();

      if (response.success && response.data) {
        setStats(response.data.stats);

        // Map API response fields to frontend expected fields
        const mappedRequests = response.data.recentRequests.map(
          (request: any) => ({
            ...request,
            id: request._id || request.id,
            customerName: request.customerName || request.name,
            customerEmail: request.customerEmail || request.email,
            customerPhone: request.customerPhone || request.phone,
            serviceType: request.serviceType || request.service,
          })
        );

        const mappedApplications = response.data.recentApplications.map(
          (application: any) => ({
            ...application,
            id: application._id || application.id,
            name: application.fullName || application.name,
            location: application.city || application.location,
            experienceLevel: application.level || application.experienceLevel,
            skills: application.skills || [],
            rating: application.rating || 0,
            totalJobs: application.totalJobs || 0,
            certifications: application.certifications || [],
            expectedSalary: application.expectedSalary || 0,
            status: application.status || "pending",
            appliedDate: application.appliedDate || application.createdAt,
          })
        );

        setRecentRequests(mappedRequests);
        setRecentApplications(mappedApplications);
      } else {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentRequests,
    recentApplications,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getStats();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch dashboard stats");
      }
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard stats"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

interface UseRecentRequestsReturn {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecentRequests(limit: number = 4): UseRecentRequestsReturn {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getRecentRequests(limit);

      if (response.success && response.data) {
        setRequests(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch recent requests");
      }
    } catch (err) {
      console.error("Recent requests fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch recent requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [limit]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
  };
}

interface UseRecentApplicationsReturn {
  applications: EmployeeApplication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecentApplications(
  limit: number = 3
): UseRecentApplicationsReturn {
  const [applications, setApplications] = useState<EmployeeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getRecentApplications(limit);

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        throw new Error(
          response.message || "Failed to fetch recent applications"
        );
      }
    } catch (err) {
      console.error("Recent applications fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch recent applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [limit]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
}
