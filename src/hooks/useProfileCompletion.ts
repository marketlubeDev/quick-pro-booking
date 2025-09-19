import { useState, useEffect, useCallback } from "react";
import { employeeApi, type ProfileCompletionData } from "@/lib/api";

export interface UseProfileCompletionReturn {
  completion: ProfileCompletionData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useProfileCompletion = (): UseProfileCompletionReturn => {
  const [completion, setCompletion] = useState<ProfileCompletionData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeApi.getProfileCompletion();
      if (response.success && response.data) {
        setCompletion(response.data);
      } else {
        setError(response.message || "Failed to fetch profile completion");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch profile completion";
      setError(errorMessage);
      console.error("Profile completion fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    completion,
    loading,
    error,
    refresh,
  };
};
