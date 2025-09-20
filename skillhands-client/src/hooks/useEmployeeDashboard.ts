import { useState, useEffect, useCallback } from "react";
import { dashboardApi, EmployeeDashboardStats } from "@/lib/api";

export interface UseEmployeeDashboardReturn {
  stats: EmployeeDashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmployeeDashboard(): UseEmployeeDashboardReturn {
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getEmployeeStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch employee dashboard stats");
      }
    } catch (err) {
      console.error("Employee dashboard stats fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch employee dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
