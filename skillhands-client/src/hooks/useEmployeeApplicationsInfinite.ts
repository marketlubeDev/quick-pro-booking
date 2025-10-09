import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchEmployeeApplicationsPaginated } from "@/lib/api.employeeApplications";

export function useInfiniteEmployeeApplications(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: ["employee-applications-infinite", limit.toString()],
    queryFn: ({ pageParam = 1, signal }) =>
      fetchEmployeeApplicationsPaginated({ page: pageParam, limit, signal }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}


