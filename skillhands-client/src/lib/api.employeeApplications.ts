import { apiFetch } from "./api";
import type { EmployeeApplication } from "@/types";

export type EmployeeApplicationsResponse = EmployeeApplication[];

export interface PaginatedEmployeeApplicationsResponse {
  data: EmployeeApplication[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  signal?: AbortSignal;
}

export async function fetchEmployeeApplications(
  signal?: AbortSignal
): Promise<EmployeeApplicationsResponse> {
  const raw = await apiFetch<unknown>("/api/profile/all?limit=1000", { signal });

  if (Array.isArray(raw)) {
    return raw as EmployeeApplication[];
  }

  if (raw && typeof raw === "object") {
    const asRecord = raw as Record<string, unknown>;
    const maybeData = asRecord.data as unknown;
    const maybeResults = asRecord.results as unknown;
    if (Array.isArray(maybeData)) return maybeData as EmployeeApplication[];
    if (Array.isArray(maybeResults)) return maybeResults as EmployeeApplication[];
  }

  return [] as EmployeeApplication[];
}

export async function fetchEmployeeApplicationsPaginated(
  params: PaginationParams
): Promise<PaginatedEmployeeApplicationsResponse> {
  const { page, limit, signal } = params;

  try {
    // Try a paginated endpoint first; many backends support page/limit
    const raw = await apiFetch<unknown>(
      `/api/profile/all?page=${page}&limit=${limit}`,
      { signal }
    );

    if (raw && typeof raw === "object") {
      const asRecord = raw as Record<string, unknown>;

      if (asRecord.data && Array.isArray(asRecord.data)) {
        const pageData = asRecord.data as EmployeeApplication[];
        const totalFromResp = Number((asRecord as Record<string, unknown>).total ?? 0) || 0;
        const limitFromResp = Number((asRecord as Record<string, unknown>).limit ?? limit) || limit;
        const pageFromResp = Number((asRecord as Record<string, unknown>).page ?? page) || page;

        let hasMore: boolean;
        if (typeof (asRecord as Record<string, unknown>).hasMore === "boolean") {
          hasMore = (asRecord as Record<string, unknown>).hasMore as boolean;
        } else if (totalFromResp > 0) {
          hasMore = pageFromResp * limitFromResp < totalFromResp;
        } else {
          hasMore = pageData.length >= limitFromResp;
        }

        return {
          data: pageData,
          hasMore,
          total: totalFromResp,
          page: pageFromResp,
          limit: limitFromResp,
        };
      }

      if (Array.isArray(raw)) {
        const allData = raw as EmployeeApplication[];
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

    // Fallback: fetch all and slice
    if (page === 1) {
      const allData = await fetchEmployeeApplications(signal);
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

    return {
      data: [],
      hasMore: false,
      total: 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching paginated employee applications:", error);

    if (page === 1) {
      try {
        const allData = await fetchEmployeeApplications(signal);
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

    return {
      data: [],
      hasMore: false,
      total: 0,
      page,
      limit,
    };
  }
}


