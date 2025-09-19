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
};

// Auth types and API
export interface AuthUser {
  _id: string;
  name?: string;
  email: string;
  role: "admin" | "employee" | string;
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
export interface EmployeeProfileData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  level?: "Beginner" | "Intermediate" | "Expert";
  status?: "pending" | "approved" | "rejected";
  verified?: boolean;
  rating?: number;
  totalJobs?: number;
  skills?: string[];
  certifications?: string[];
  expectedSalary?: number;
  appliedDate?: string; // ISO string
}

export const employeeApi = {
  async getProfile(): Promise<ApiResponse<EmployeeProfileData>> {
    return api.get<EmployeeProfileData>("/api/employees/me");
  },

  async updateProfile(
    data: Partial<EmployeeProfileData>
  ): Promise<ApiResponse<EmployeeProfileData>> {
    return api.post<EmployeeProfileData>("/api/employees/me", data);
  },

  async uploadCertificates(
    files: File[]
  ): Promise<ApiResponse<{ certifications: string[] }>> {
    const formData = new FormData();
    files.forEach((file) => formData.append("certificates", file));
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employees/me/certificates`,
        {
          method: "POST",
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

  async uploadProfileImage(
    file: File
  ): Promise<ApiResponse<{ profileImageUrl: string }>> {
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employees/me/profile-image`,
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
