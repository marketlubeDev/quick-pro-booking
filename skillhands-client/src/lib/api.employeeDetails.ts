import { apiFetch } from "./api";
import type { EmployeeProfileData, ApiResponse, Qualification } from "./api";

export interface EmployeeDetailsUpdateInput {
  // Personal Information
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  bio?: string;

  // Professional Information
  designation?: string;
  level?: "Beginner" | "Intermediate" | "Expert";
  expectedSalary?: number;

  // Skills & Experience
  skills?: string[];
  workExperience?: Array<{
    id?: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    location?: string;
  }>;
  qualifications?: Qualification[];

  // Verification fields (admin only)
  verified?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";
  verificationNotes?: string;
  rating?: number;
  totalJobs?: number;
}

export interface EmployeeDetailsResponse {
  success: boolean;
  data: EmployeeProfileData;
  message?: string;
}

export interface EmployeeDetailsListResponse {
  success: boolean;
  data: EmployeeProfileData[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface EmployeeSearchFilters {
  status?: "pending" | "approved" | "rejected";
  level?: "Beginner" | "Intermediate" | "Expert";
  verified?: boolean;
  city?: string;
  state?: string;
  skills?: string[];
  minRating?: number;
  maxRating?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/**
 * Get current user's employee profile details
 */
export async function getMyEmployeeDetails(): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>("/api/profile/");

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to fetch employee details");
  } catch (error) {
    console.error("Error fetching employee details:", error);
    throw error;
  }
}

/**
 * Update current user's employee profile details
 */
export async function updateMyEmployeeDetails(
  updates: EmployeeDetailsUpdateInput
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>("/api/profile/", {
      method: "PATCH",
      body: updates,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update employee details");
  } catch (error) {
    console.error("Error updating employee details:", error);
    throw error;
  }
}

/**
 * Get employee details by user ID (admin only)
 */
export async function getEmployeeDetailsById(
  userId: string
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/employee/${userId}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to fetch employee details");
  } catch (error) {
    console.error("Error fetching employee details by ID:", error);
    throw error;
  }
}

/**
 * Get all employee profiles with filtering and pagination (admin only)
 */
export async function getAllEmployeeDetails(
  filters: EmployeeSearchFilters = {}
): Promise<EmployeeDetailsListResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const url = `/api/profile/all${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiFetch<EmployeeDetailsListResponse>(url);

    if (response.success && response.data) {
      return response;
    }

    throw new Error("Failed to fetch employee details list");
  } catch (error) {
    console.error("Error fetching employee details list:", error);
    throw error;
  }
}

/**
 * Update employee status (admin only)
 */
export async function updateEmployeeStatus(
  profileId: string,
  status: "pending" | "approved" | "rejected",
  verificationNotes?: string
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/${profileId}/status`,
      {
        method: "PATCH",
        body: { status, verificationNotes },
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update employee status");
  } catch (error) {
    console.error("Error updating employee status:", error);
    throw error;
  }
}

/**
 * Update employee rating (admin only)
 */
export async function updateEmployeeRating(
  profileId: string,
  rating: number
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/${profileId}/rating`,
      {
        method: "PATCH",
        body: { rating },
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update employee rating");
  } catch (error) {
    console.error("Error updating employee rating:", error);
    throw error;
  }
}

/**
 * Update employee verification details (admin only)
 */
export async function updateEmployeeVerification(
  profileId: string,
  verificationData: {
    verified?: boolean;
    verificationStatus?: "pending" | "approved" | "rejected";
    verificationNotes?: string;
  }
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/${profileId}/verification`,
      {
        method: "PATCH",
        body: verificationData,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update employee verification");
  } catch (error) {
    console.error("Error updating employee verification:", error);
    throw error;
  }
}

/**
 * Update employee professional details (admin only)
 */
export async function updateEmployeeProfessionalDetails(
  profileId: string,
  professionalData: {
    designation?: string;
    level?: "Beginner" | "Intermediate" | "Expert";
    expectedSalary?: number;
    skills?: string[];
    totalJobs?: number;
  }
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/${profileId}/professional`,
      {
        method: "PATCH",
        body: professionalData,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update employee professional details");
  } catch (error) {
    console.error("Error updating employee professional details:", error);
    throw error;
  }
}

/**
 * Update employee personal details (admin only)
 */
export async function updateEmployeePersonalDetails(
  profileId: string,
  personalData: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    addressLine1?: string;
    addressLine2?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    bio?: string;
  }
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/${profileId}/personal`,
      {
        method: "PATCH",
        body: personalData,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update employee personal details");
  } catch (error) {
    console.error("Error updating employee personal details:", error);
    throw error;
  }
}

/**
 * Add work experience to employee profile
 */
export async function addWorkExperience(workExperience: {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      "/api/profile/work-experience",
      {
        method: "POST",
        body: workExperience,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to add work experience");
  } catch (error) {
    console.error("Error adding work experience:", error);
    throw error;
  }
}

/**
 * Update work experience entry
 */
export async function updateWorkExperience(
  experienceId: string,
  workExperience: {
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    location?: string;
  }
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/work-experience/${experienceId}`,
      {
        method: "PATCH",
        body: workExperience,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update work experience");
  } catch (error) {
    console.error("Error updating work experience:", error);
    throw error;
  }
}

/**
 * Delete work experience entry
 */
export async function deleteWorkExperience(
  experienceId: string
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/work-experience/${experienceId}`,
      {
        method: "DELETE",
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to delete work experience");
  } catch (error) {
    console.error("Error deleting work experience:", error);
    throw error;
  }
}

/**
 * Add qualification to employee profile
 */
export async function addQualification(qualification: {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
}): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      "/api/profile/qualification",
      {
        method: "POST",
        body: qualification,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to add qualification");
  } catch (error) {
    console.error("Error adding qualification:", error);
    throw error;
  }
}

/**
 * Update qualification entry
 */
export async function updateQualification(
  qualificationId: string,
  qualification: {
    degree?: string;
    institution?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    location?: string;
  }
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/qualification/${qualificationId}`,
      {
        method: "PATCH",
        body: qualification,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to update qualification");
  } catch (error) {
    console.error("Error updating qualification:", error);
    throw error;
  }
}

/**
 * Delete qualification entry
 */
export async function deleteQualification(
  qualificationId: string
): Promise<EmployeeProfileData> {
  try {
    const response = await apiFetch<EmployeeDetailsResponse>(
      `/api/profile/qualification/${qualificationId}`,
      {
        method: "DELETE",
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to delete qualification");
  } catch (error) {
    console.error("Error deleting qualification:", error);
    throw error;
  }
}

/**
 * Get profile completion status
 */
export async function getProfileCompletion(): Promise<{
  completion: number;
  missingFields: string[];
  profileComplete: boolean;
}> {
  try {
    const response = await apiFetch<{
      success: boolean;
      data: {
        completion: number;
        missingFields: string[];
        profileComplete: boolean;
      };
    }>("/api/profile/completion");

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to fetch profile completion");
  } catch (error) {
    console.error("Error fetching profile completion:", error);
    throw error;
  }
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(
  file: File
): Promise<{ avatarUrl: string }> {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      }/api/profile/upload-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}

/**
 * Upload certificates
 */
export async function uploadCertificates(files: File[]): Promise<{
  certifications: Array<{
    name: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
}> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("certificates", file));

    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      }/api/profile/upload-certificates`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error uploading certificates:", error);
    throw error;
  }
}
