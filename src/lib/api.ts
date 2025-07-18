const API_BASE_URL = "https://skillhands-server.vercel.app";

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

export const api = {
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      const response = await fetch(`${API_BASE_URL}/contact`, {
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
    return api.get("/health");
  },
};
