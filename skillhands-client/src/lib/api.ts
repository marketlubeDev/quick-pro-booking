import { EmployeeApplication, ServiceRequest } from "@/types";

const API_BASE_URL = "http://localhost:5000";

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

// Generic fetch function for API calls
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const { method = "GET", body, signal } = options;

  try {
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(getAuthToken()
          ? { Authorization: `Bearer ${getAuthToken()}` }
          : {}),
      },
      signal,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export interface ContactFormData {
  service: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  image: File | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ServiceRequestData {
  service: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state?: string;
  zip: string;
  status?: string;
  assignedEmployee?: string;
}

export const api = {
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken()
            ? { Authorization: `Bearer ${getAuthToken()}` }
            : {}),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken()
            ? { Authorization: `Bearer ${getAuthToken()}` }
            : {}),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

export const contactApi = {
  async submitForm(data: ContactFormData): Promise<ApiResponse> {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all text fields
    formData.append("service", data.service);
    formData.append("description", data.description);
    formData.append("preferredDate", data.preferredDate);
    formData.append("preferredTime", data.preferredTime);
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("zip", data.zip);

    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async checkHealth(): Promise<ApiResponse> {
    return api.get("/api/health");
  },
};

export const serviceRequestApi = {
  async submit(data: ServiceRequestData): Promise<ApiResponse> {
    return api.post("/api/service-requests", data);
  },

  async getAll(): Promise<ApiResponse> {
    return api.get("/api/service-requests");
  },

  async getById(id: string): Promise<ApiResponse> {
    return api.get(`/api/service-requests/${id}`);
  },

  async updateStatus(id: string, status: string): Promise<ApiResponse> {
    return api.post(`/api/service-requests/${id}/status`, { status });
  },

  async updateAssignedEmployee(
    id: string,
    assignedEmployee: string | null
  ): Promise<ApiResponse> {
    return apiFetch<ApiResponse>(
      `/api/service-requests/${id}/assigned-employee`,
      {
        method: "PATCH",
        body: { assignedEmployee },
      }
    );
  },
};

export interface Employee {
  _id: string;
  name: string;
  email: string;
}

// Auth types and API
export interface AuthUser {
  _id: string;
  name?: string;
  email: string;
  role: "admin" | "employee" | string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    }) as unknown as AuthResponse;
  },

  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    return api.post("/api/auth/forgot-password", { email }) as unknown as {
      success: boolean;
      message?: string;
    };
  },

  async requestPasswordOtp(
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    return api.post("/api/auth/password-otp", { email }) as unknown as {
      success: boolean;
      message?: string;
    };
  },

  async resetPasswordWithOtp(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    return api.post("/api/auth/reset-with-otp", {
      email,
      otp,
      password: newPassword,
    }) as unknown as { success: boolean; message?: string };
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return api.post<AuthResponse>("/api/auth/register", {
      name,
      email,
      password,
      role: "employee",
    }) as unknown as AuthResponse;
  },

  async me(): Promise<{ success: boolean; user: AuthUser }> {
    return api.get("/api/auth/me") as unknown as {
      success: boolean;
      user: AuthUser;
    };
  },
};

// Employee profile types and API
export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface Certification {
  name: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface EmployeeProfileData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  avatarUrl?: string;
  bio?: string;
  designation?: string;
  level?: "Beginner" | "Intermediate" | "Expert";
  status?: "pending" | "approved" | "rejected";
  verified?: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  verificationNotes?: string;
  rating?: number;
  totalJobs?: number;
  skills?: string[];
  certifications?: Certification[];
  workExperience?: WorkExperience[];
  expectedSalary?: number;
  profileComplete?: boolean;
  lastUpdated?: string;
  appliedDate?: string; // ISO string
  user?: {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface ProfileCompletionData {
  completion: number;
  missingFields: string[];
  profileComplete: boolean;
}

export const employeeApi = {
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return api.get<Employee[]>("/api/users/employees");
  },

  async getProfile(): Promise<ApiResponse<EmployeeProfileData>> {
    return api.get<EmployeeProfileData>("/api/profile/");
  },

  async updateProfile(
    data: Partial<EmployeeProfileData>
  ): Promise<ApiResponse<EmployeeProfileData>> {
    return apiFetch<ApiResponse<EmployeeProfileData>>("/api/profile/", {
      method: "PATCH",
      body: data,
    });
  },

  async getProfileCompletion(): Promise<ApiResponse<ProfileCompletionData>> {
    return api.get<ProfileCompletionData>("/api/profile/completion");
  },

  async uploadProfileImage(
    file: File
  ): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async uploadCertificates(
    files: File[]
  ): Promise<ApiResponse<{ certifications: Certification[] }>> {
    const formData = new FormData();
    files.forEach((file) => formData.append("certificates", file));
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/profile/upload-certificates`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
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
      console.error("API Error:", error);
      throw error;
    }
  },
};

// Admin API for employee applications
export const adminApi = {
  async getAllEmployeeApplications(): Promise<
    ApiResponse<EmployeeApplication[]>
  > {
    return api.get<EmployeeApplication[]>("/api/profile/all");
  },

  async getEmployeeProfile(
    userId: string
  ): Promise<ApiResponse<EmployeeProfileData>> {
    return api.get<EmployeeProfileData>(`/api/profile/employee/${userId}`);
  },

  async updateEmployeeStatus(
    profileId: string,
    status: "pending" | "approved" | "rejected",
    verificationNotes?: string
  ): Promise<ApiResponse<EmployeeProfileData>> {
    return apiFetch<ApiResponse<EmployeeProfileData>>(
      `/api/profile/${profileId}/status`,
      {
        method: "PATCH",
        body: { status, verificationNotes },
      }
    );
  },
};

// Dashboard API
export interface DashboardStats {
  totalServiceRequests: number;
  urgentRequests: number;
  completedToday: number;
  pendingRequests: number;
  employeeApplications: number;
  activeEmployees: number;
}

export interface EmployeeDashboardStats {
  profileCompletion: number;
  activeJobs: number;
  successRate: number;
  totalCompletedJobs: number;
  missingFields: string[];
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentRequests: ServiceRequest[];
  recentApplications: EmployeeApplication[];
}

export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return api.get<DashboardStats>("/api/dashboard/stats");
  },

  async getRecentRequests(
    limit: number = 4
  ): Promise<ApiResponse<ServiceRequest[]>> {
    return api.get<ServiceRequest[]>(
      `/api/dashboard/recent-requests?limit=${limit}`
    );
  },

  async getRecentApplications(
    limit: number = 3
  ): Promise<ApiResponse<EmployeeApplication[]>> {
    return api.get<EmployeeApplication[]>(
      `/api/dashboard/recent-applications?limit=${limit}`
    );
  },

  async getOverview(): Promise<ApiResponse<DashboardOverview>> {
    return api.get<DashboardOverview>("/api/dashboard/overview");
  },

  async getEmployeeStats(): Promise<ApiResponse<EmployeeDashboardStats>> {
    return api.get<EmployeeDashboardStats>("/api/dashboard/employee-stats");
  },
};
