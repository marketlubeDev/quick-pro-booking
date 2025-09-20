import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  employeeApi,
  type EmployeeProfileData,
  type ProfileCompletionData,
} from "@/lib/api";

export interface UseProfileReturn {
  profile: EmployeeProfileData | null;
  profileCompletion: ProfileCompletionData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<EmployeeProfileData>) => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<boolean>;
  uploadCertificates: (files: File[]) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  refreshCompletion: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [profileCompletion, setProfileCompletion] =
    useState<ProfileCompletionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeApi.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || "Failed to fetch profile");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCompletion = useCallback(async () => {
    try {
      const response = await employeeApi.getProfileCompletion();
      if (response.success && response.data) {
        setProfileCompletion(response.data);
      }
    } catch (err) {
      console.error("Profile completion fetch error:", err);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<EmployeeProfileData>): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeApi.updateProfile(data);
        if (response.success && response.data) {
          setProfile(response.data);
          toast({
            title: "Profile updated successfully",
            description: "Your profile has been saved.",
          });
          // Refresh completion status after update
          await refreshCompletion();
          return true;
        } else {
          setError(response.message || "Failed to update profile");
          toast({
            title: "Update failed",
            description: response.message || "Could not save profile",
            variant: "destructive",
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        toast({
          title: "Network error",
          description: "Could not save profile. Please try again.",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast, refreshCompletion]
  );

  const uploadProfileImage = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeApi.uploadProfileImage(file);
        if (response.success && response.data) {
          // Update profile with new avatar URL
          if (profile) {
            setProfile({
              ...profile,
              avatarUrl: response.data.avatarUrl,
            });
          }
          toast({
            title: "Image uploaded successfully",
            description: "Your profile image has been updated.",
          });
          return true;
        } else {
          setError(response.message || "Failed to upload image");
          toast({
            title: "Upload failed",
            description: response.message || "Could not upload image",
            variant: "destructive",
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload image";
        setError(errorMessage);
        toast({
          title: "Upload error",
          description: "Could not upload image. Please try again.",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [profile, toast]
  );

  const uploadCertificates = useCallback(
    async (files: File[]): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeApi.uploadCertificates(files);
        if (response.success && response.data) {
          // Update profile with new certifications
          if (profile) {
            setProfile({
              ...profile,
              certifications: response.data.certifications,
            });
          }
          toast({
            title: "Certificates uploaded successfully",
            description: `${files.length} certificate(s) have been uploaded.`,
          });
          return true;
        } else {
          setError(response.message || "Failed to upload certificates");
          toast({
            title: "Upload failed",
            description: response.message || "Could not upload certificates",
            variant: "destructive",
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload certificates";
        setError(errorMessage);
        toast({
          title: "Upload error",
          description: "Could not upload certificates. Please try again.",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [profile, toast]
  );

  // Load profile and completion data on mount
  useEffect(() => {
    refreshProfile();
    refreshCompletion();
  }, [refreshProfile, refreshCompletion]);

  return {
    profile,
    profileCompletion,
    loading,
    error,
    updateProfile,
    uploadProfileImage,
    uploadCertificates,
    refreshProfile,
    refreshCompletion,
  };
};
