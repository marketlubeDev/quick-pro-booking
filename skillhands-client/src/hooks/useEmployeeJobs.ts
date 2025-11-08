import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  fetchEmployeeJobs,
  acceptJob,
  completeJob,
  addJobRemarks,
  type EmployeeJob,
  type AcceptJobInput,
  type CompleteJobInput,
  type AddRemarksInput,
} from "@/lib/api.employeeJobs";

export interface UseEmployeeJobsReturn {
  jobs: EmployeeJob[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  acceptJobAction: (jobId: string) => Promise<void>;
  completeJobAction: (jobId: string, completionNotes?: string) => Promise<void>;
  addRemarksAction: (jobId: string, remarks: string) => Promise<void>;
}

export function useEmployeeJobs(status?: string): UseEmployeeJobsReturn {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<EmployeeJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const employeeJobs = await fetchEmployeeJobs(user._id, status);

      setJobs(employeeJobs);
    } catch (err) {
      console.error("Error fetching employee jobs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [user?._id, status]);

  const acceptJobAction = useCallback(
    async (jobId: string) => {
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      try {
        const input: AcceptJobInput = {
          jobId,
          employeeId: user._id,
        };

        const response = await acceptJob(input);

        if (response.success) {
          // Refetch jobs to get updated status from server
          await fetchJobs();
        } else {
          throw new Error(response.message || "Failed to accept job");
        }
      } catch (err) {
        console.error("Error accepting job:", err);
        throw err;
      }
    },
    [user?._id, fetchJobs]
  );

  const completeJobAction = useCallback(
    async (jobId: string, completionNotes?: string) => {
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      try {
        const input: CompleteJobInput = {
          jobId,
          employeeId: user._id,
          completionNotes,
        };

        const response = await completeJob(input);

        if (response.success) {
          // Update the job in the local state
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.id === jobId || job._id === jobId
                ? {
                    ...job,
                    status: "completed",
                    completedAt: new Date().toISOString(),
                    completionNotes: completionNotes || job.completionNotes,
                  }
                : job
            )
          );
        } else {
          throw new Error(response.message || "Failed to complete job");
        }
      } catch (err) {
        console.error("Error completing job:", err);
        throw err;
      }
    },
    [user?._id]
  );

  const addRemarksAction = useCallback(
    async (jobId: string, remarks: string) => {
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      try {
        const input: AddRemarksInput = {
          jobId,
          employeeId: user._id,
          remarks,
        };

        const response = await addJobRemarks(input);

        if (response.success) {
          // Update the job in the local state
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.id === jobId || job._id === jobId
                ? { ...job, employeeRemarks: remarks }
                : job
            )
          );
        } else {
          throw new Error(response.message || "Failed to add remarks");
        }
      } catch (err) {
        console.error("Error adding remarks:", err);
        throw err;
      }
    },
    [user?._id]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
    acceptJobAction,
    completeJobAction,
    addRemarksAction,
  };
}
