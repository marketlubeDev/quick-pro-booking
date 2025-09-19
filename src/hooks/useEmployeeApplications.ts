import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { EmployeeApplication } from "@/types";

interface UseEmployeeApplicationsReturn {
  applications: EmployeeApplication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStatus: (
    profileId: string,
    status: "pending" | "approved" | "rejected",
    verificationNotes?: string
  ) => Promise<void>;
}

export function useEmployeeApplications(): UseEmployeeApplicationsReturn {
  const [applications, setApplications] = useState<EmployeeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAllEmployeeApplications();
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setError(response.message || "Failed to fetch applications");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching employee applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    profileId: string,
    status: "pending" | "approved" | "rejected",
    verificationNotes?: string
  ) => {
    try {
      await adminApi.updateEmployeeStatus(profileId, status, verificationNotes);
      // Refetch applications to get updated data
      await fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
      throw err;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    updateStatus,
  };
}
