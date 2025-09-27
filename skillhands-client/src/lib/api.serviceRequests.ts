import { apiFetch } from "./api";
import type { ServiceRequest } from "@/types";

export type ServiceRequestsResponse = ServiceRequest[];

export interface PaginatedServiceRequestsResponse {
  data: ServiceRequest[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
  countsByStatus?: {
    pending?: number;
    "in-process"?: number;
    "in-progress"?: number;
    completed?: number;
    cancelled?: number;
    rejected?: number;
  };
}

export interface ServiceRequestsSummaryResponse {
  total: number;
  countsByStatus: {
    pending?: number;
    "in-process"?: number;
    "in-progress"?: number;
    completed?: number;
    cancelled?: number;
    rejected?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  signal?: AbortSignal;
}

export async function fetchServiceRequests(
  signal?: AbortSignal
): Promise<ServiceRequestsResponse> {
  const raw = await apiFetch<unknown>("/api/service-requests", { signal });

  // Normalize common API response shapes to always return an array
  if (Array.isArray(raw)) {
    return raw as ServiceRequest[];
  }

  if (raw && typeof raw === "object") {
    const asRecord = raw as Record<string, unknown>;
    const maybeData = asRecord.data as unknown;
    const maybeResults = asRecord.results as unknown;
    if (Array.isArray(maybeData)) return maybeData as ServiceRequest[];
    if (Array.isArray(maybeResults)) return maybeResults as ServiceRequest[];
  }

  // Fallback to empty array to keep UI stable
  return [] as ServiceRequest[];
}

export async function fetchServiceRequestsPaginated(
  params: PaginationParams
): Promise<PaginatedServiceRequestsResponse> {
  const { page, limit, signal } = params;

  try {
    // First try the paginated endpoint
    const raw = await apiFetch<unknown>(
      `/api/service-requests?page=${page}&limit=${limit}`,
      { signal }
    );

    // Handle different API response formats
    if (raw && typeof raw === "object") {
      const asRecord = raw as Record<string, unknown>;

      // Check for paginated response format
      if (asRecord.data && Array.isArray(asRecord.data)) {
        const pageData = asRecord.data as ServiceRequest[];
        const totalFromResp =
          Number((asRecord as Record<string, unknown>).total ?? 0) || 0;
        const limitFromResp =
          Number((asRecord as Record<string, unknown>).limit ?? limit) || limit;
        const pageFromResp =
          Number((asRecord as Record<string, unknown>).page ?? page) || page;

        // Try to extract optional status counts from common keys
        const rawCounts = ((asRecord as Record<string, unknown>)
          .countsByStatus ||
          (asRecord as Record<string, unknown>).counts ||
          (asRecord as Record<string, unknown>).summary ||
          undefined) as Record<string, unknown> | undefined;
        const countsByStatus = rawCounts
          ? {
              pending:
                Number((rawCounts as Record<string, unknown>).pending ?? 0) ||
                0,
              "in-process":
                Number(
                  (rawCounts as Record<string, unknown>)["in-process"] ?? 0
                ) || 0,
              "in-progress":
                Number(
                  (rawCounts as Record<string, unknown>)["in-progress"] ?? 0
                ) || 0,
              completed:
                Number((rawCounts as Record<string, unknown>).completed ?? 0) ||
                0,
              cancelled:
                Number((rawCounts as Record<string, unknown>).cancelled ?? 0) ||
                0,
              rejected:
                Number((rawCounts as Record<string, unknown>).rejected ?? 0) ||
                0,
            }
          : undefined;

        let hasMore: boolean;
        if (
          typeof (asRecord as Record<string, unknown>).hasMore === "boolean"
        ) {
          hasMore = (asRecord as Record<string, unknown>).hasMore as boolean;
        } else if (totalFromResp > 0) {
          hasMore = pageFromResp * limitFromResp < totalFromResp;
        } else {
          // Infer using page size: if we received a full page, assume more may exist
          hasMore = pageData.length >= limitFromResp;
        }

        return {
          data: pageData,
          hasMore,
          total: totalFromResp,
          page: pageFromResp,
          limit: limitFromResp,
          countsByStatus,
        };
      }

      // Check for simple array response (fallback to pagination simulation)
      if (Array.isArray(raw)) {
        const allData = raw as ServiceRequest[];
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = allData.slice(startIndex, endIndex);

        return {
          data: paginatedData,
          hasMore: endIndex < allData.length,
          total: allData.length,
          page,
          limit,
        };
      }
    }

    // If paginated endpoint fails, fallback to regular endpoint and simulate pagination
    if (page === 1) {
      const allData = await fetchServiceRequests(signal);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = allData.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        hasMore: endIndex < allData.length,
        total: allData.length,
        page,
        limit,
      };
    }

    // For subsequent pages when fallback is used, return empty
    return {
      data: [],
      hasMore: false,
      total: 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching paginated service requests:", error);

    // If paginated endpoint fails, try fallback for first page only
    if (page === 1) {
      try {
        const allData = await fetchServiceRequests(signal);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = allData.slice(startIndex, endIndex);

        return {
          data: paginatedData,
          hasMore: endIndex < allData.length,
          total: allData.length,
          page,
          limit,
        };
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }

    // Return empty response on error
    return {
      data: [],
      hasMore: false,
      total: 0,
      page,
      limit,
    };
  }
}

export async function fetchServiceRequestsSummary(
  signal?: AbortSignal
): Promise<ServiceRequestsSummaryResponse | null> {
  try {
    const raw = await apiFetch<unknown>(`/api/service-requests/summary`, {
      signal,
    });
    if (raw && typeof raw === "object") {
      const rec = raw as Record<string, unknown>;
      const total = Number(rec.total ?? 0) || 0;
      const counts = (rec.countsByStatus ||
        rec.counts ||
        rec.summary ||
        {}) as Record<string, unknown>;
      return {
        total,
        countsByStatus: {
          pending: Number(counts.pending ?? 0) || 0,
          "in-process": Number(counts["in-process"] ?? 0) || 0,
          "in-progress": Number(counts["in-progress"] ?? 0) || 0,
          completed: Number(counts.completed ?? 0) || 0,
          cancelled: Number(counts.cancelled ?? 0) || 0,
          rejected: Number(counts.rejected ?? 0) || 0,
        },
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}

export type UpdateServiceRequestInput = {
  id: string;
  status?: ServiceRequest["status"];
  scheduledDate?: string;
  assignedEmployee?: string | null;
  rejectionReason?: string;
};

export async function updateServiceRequest(
  input: UpdateServiceRequestInput
): Promise<ServiceRequest> {
  const { id, ...body } = input;
  return apiFetch<ServiceRequest>(`/api/service-requests/${id}`, {
    method: "PUT",
    body,
  });
}
