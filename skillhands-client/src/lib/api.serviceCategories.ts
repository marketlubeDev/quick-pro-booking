import { api, apiFetch, ApiResponse } from "@/lib/api";

export interface ServiceCategory {
  _id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
  price?: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  price?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const serviceCategoriesApi = {
  async list(): Promise<ApiResponse<ServiceCategory[]>> {
    return api.get<ServiceCategory[]>("/api/service-categories");
  },

  async create(data: CreateCategoryDto): Promise<ApiResponse<ServiceCategory>> {
    return apiFetch<ApiResponse<ServiceCategory>>("/api/service-categories", {
      method: "POST",
      body: data,
    });
  },

  async update(
    categoryId: string,
    data: UpdateCategoryDto
  ): Promise<ApiResponse<ServiceCategory>> {
    return apiFetch<ApiResponse<ServiceCategory>>(
      `/api/service-categories/${categoryId}`,
      {
        method: "PUT",
        body: data,
      }
    );
  },

  async remove(categoryId: string): Promise<ApiResponse> {
    return apiFetch<ApiResponse>(`/api/service-categories/${categoryId}`, {
      method: "DELETE",
    });
  },
};
