import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchServiceRequests } from "@/lib/api.serviceRequests";
import type { ServiceRequest } from "@/types";

export function useServiceRequests(): UseQueryResult<ServiceRequest[], Error> {
  return useQuery<ServiceRequest[], Error>({
    queryKey: ["service-requests"],
    queryFn: ({ signal }) => fetchServiceRequests(signal),
  });
}
