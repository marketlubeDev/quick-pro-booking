import { EmployeeApplication, ServiceRequest } from "@/types";

const API_BASE_URL = (() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  // Remove trailing slash to prevent double slashes when concatenating with endpoints
  return baseUrl.replace(/\/$/, "");
})();

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

console.log(API_BASE_URL, "sdkgfkjshkgdj");

// Generic fetch function for API calls with retry logic
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    signal?: AbortSignal;
    retries?: number;
  } = {}
): Promise<T> {
  const { method = "GET", body, signal, retries = 2 } = options;

  const attemptRequest = async (attempt: number): Promise<T> => {
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
        // Retry on 5xx errors or 503 (Service Unavailable)
        if (
          (response.status >= 500 || response.status === 503) &&
          attempt < retries
        ) {
          console.warn(
            `API request failed with ${response.status}, retrying... (attempt ${
              attempt + 1
            }/${retries + 1})`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
          return attemptRequest(attempt + 1);
        }

        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      // Retry on network errors
      if (
        attempt < retries &&
        (error instanceof TypeError || error.name === "NetworkError")
      ) {
        console.warn(
          `Network error, retrying... (attempt ${attempt + 1}/${retries + 1})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        return attemptRequest(attempt + 1);
      }

      console.error("API Error:", error);
      throw error;
    }
  };

  return attemptRequest(0);
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
  paymentMethod?: string;
  paymentPercentage?: "50" | "100";
  amount?: number;
  tax?: number;
  totalAmount?: number;
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

// Payment API
export interface CreatePaymentIntentData {
  serviceRequestId: string;
  amount: number;
}

export interface ConfirmPaymentData {
  serviceRequestId: string;
  paymentIntentId: string;
}

export interface CreateCheckoutSessionData {
  serviceRequestId: string;
  amount: number;
  returnUrl?: string;
}

export const paymentApi = {
  async createPaymentIntent(
    data: CreatePaymentIntentData
  ): Promise<ApiResponse<{ clientSecret: string; paymentIntentId: string }>> {
    return api.post("/api/payments/create-payment-intent", data);
  },

  async confirmPayment(data: ConfirmPaymentData): Promise<ApiResponse> {
    return api.post("/api/payments/confirm-payment", data);
  },

  async createCheckoutSession(
    data: CreateCheckoutSessionData
  ): Promise<ApiResponse<{ checkoutUrl: string; sessionId: string }>> {
    return api.post("/api/payments/create-checkout-session", data);
  },

  async verifyCheckoutSession(
    sessionId: string
  ): Promise<ApiResponse<{ serviceRequestId: string; paymentStatus: string }>> {
    return api.get(
      `/api/payments/checkout-session?session_id=${encodeURIComponent(
        sessionId
      )}`
    );
  },
};

export interface Employee {
  _id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  postalCode?: string;
  skills?: string[];
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
    password: string,
    extra?: {
      designation?: string;
      address?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      expectedSalary?: number;
      phone?: string;
      yearsOfExperience?: number;
    }
  ): Promise<AuthResponse> {
    return api.post<AuthResponse>("/api/auth/register", {
      name,
      email,
      password,
      role: "employee",
      ...(extra || {}),
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

export interface Qualification {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
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
  qualifications?: Qualification[];
  expectedSalary?: number;
  yearsOfExperience?: number;
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
  // Service areas
  workingZipCodes?: string[];
  workingCities?: string[];
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
    return api.get<EmployeeApplication[]>("/api/profile/all?limit=1000");
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

  async updateEmployeeRating(
    profileId: string,
    rating: number
  ): Promise<ApiResponse<EmployeeProfileData>> {
    return apiFetch<ApiResponse<EmployeeProfileData>>(
      `/api/profile/${profileId}/rating`,
      {
        method: "PATCH",
        body: { rating },
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

// Reports API
export interface ReportsData {
  serviceRequests: ServiceRequest[];
  employeePerformance: EmployeePerformance[];
  stats: {
    totalRequests: number;
    completedRequests: number;
    inProgressRequests: number;
    pendingRequests: number;
  };
}

export interface EmployeePerformance {
  _id: string;
  name: string;
  email: string;
  completedJobs: number;
  rating: number;
  efficiency: number;
  totalJobs: number;
  successRate: number;
}

export const reportsApi = {
  async getReportsData(
    timePeriod: string = "last-month"
  ): Promise<ApiResponse<ReportsData>> {
    return api.get<ReportsData>(`/api/reports?period=${timePeriod}`);
  },

  async getServiceRequests(
    timePeriod: string = "last-month"
  ): Promise<ApiResponse<ServiceRequest[]>> {
    return api.get<ServiceRequest[]>(
      `/api/reports/service-requests?period=${timePeriod}`
    );
  },

  async getEmployeePerformance(
    timePeriod: string = "last-month"
  ): Promise<ApiResponse<EmployeePerformance[]>> {
    return api.get<EmployeePerformance[]>(
      `/api/reports/employee-performance?period=${timePeriod}`
    );
  },

  async exportReports(
    timePeriod: string = "last-month",
    format: string = "xlsx"
  ): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/api/reports/export?period=${timePeriod}&format=${format}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to export reports: ${response.statusText}`);
    }

    return response.blob();
  },
};
