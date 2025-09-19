import { useMemo, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { ServiceRequestCard } from "./ServiceRequestCard";
import { ServiceRequest } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceRequestDetailsDialog } from "./ServiceRequestDetailsDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInfiniteServiceRequests } from "../../../hooks/useInfiniteServiceRequests";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  updateServiceRequest,
  fetchServiceRequestsSummary,
  fetchServiceRequests,
  UpdateServiceRequestInput,
} from "@/lib/api.serviceRequests";
import { ScheduleServiceDialog } from "./ScheduleServiceDialog";

export function ServiceRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );


  console.log("selectedRequest", selectedRequest);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteServiceRequests(10);

  // Fetch overall summary once (if backend supports it)
  const { data: summary } = useQuery({
    queryKey: ["service-requests-summary"],
    queryFn: ({ signal }) => fetchServiceRequestsSummary(signal),
    staleTime: 60_000,
  });

  // Background full counts if summary is not available
  const { data: allForCounts } = useQuery({
    queryKey: ["service-requests-all-counts"],
    queryFn: ({ signal }) => fetchServiceRequests(signal),
    enabled: !summary, // only fetch all if no summary
    staleTime: 60_000,
    select: (all) => {
      const total = all.length;
      const pending = all.filter((r) => r.status === "pending").length;
      const inProcess = all.filter((r) => r.status === "in-process").length;
      const completed = all.filter((r) => r.status === "completed").length;
      const cancelled = all.filter((r) => r.status === "cancelled").length;
      return {
        total,
        countsByStatus: { pending, inProcess, completed, cancelled },
      };
    },
  });

  // Flatten all pages into a single array
  const serviceRequests = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // Use API-reported total when available; otherwise, fallback to loaded count
  const totalServiceRequests = useMemo(() => {
    return (
      summary?.total ??
      allForCounts?.total ??
      data?.pages?.[0]?.total ??
      serviceRequests.length
    );
  }, [summary, allForCounts, data, serviceRequests.length]);

  // Status totals (prefer API counts if present)
  const countsByStatus = useMemo(() => {
    const apiCounts =
      summary?.countsByStatus ?? data?.pages?.[0]?.countsByStatus;
    if (apiCounts && Object.keys(apiCounts).length > 0) {
      return {
        pending: Number(apiCounts.pending) || 0,
        inProcess: Number(apiCounts["in-process"]) || 0,
        completed: Number(apiCounts.completed) || 0,
        cancelled: Number(apiCounts.cancelled) || 0,
      };
    }

    // Fallback to background full counts if available
    if (allForCounts) {
      return {
        pending: Number(allForCounts.countsByStatus.pending) || 0,
        inProcess: Number(allForCounts.countsByStatus.inProcess) || 0,
        completed: Number(allForCounts.countsByStatus.completed) || 0,
        cancelled: Number(allForCounts.countsByStatus.cancelled) || 0,
      };
    }

    // Last fallback: compute from currently loaded items
    return {
      pending: serviceRequests.filter((r) => r.status === "pending").length,
      inProcess: serviceRequests.filter((r) => r.status === "in-process")
        .length,
      completed: serviceRequests.filter((r) => r.status === "completed").length,
      cancelled: serviceRequests.filter((r) => r.status === "cancelled").length,
    };
  }, [summary, data, allForCounts, serviceRequests]);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateServiceRequest,
    onSuccess: (data) => {
      console.log("updateMutation onSuccess:", data);
      queryClient.invalidateQueries({
        queryKey: ["service-requests-infinite"],
      });
      // Refresh totals and status counts immediately
      queryClient.invalidateQueries({ queryKey: ["service-requests-summary"] });
      queryClient.invalidateQueries({
        queryKey: ["service-requests-all-counts"],
      });
    },
    onError: (error) => {
      console.error("updateMutation onError:", error);
    },
  });

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver({
    onIntersect: useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]),
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // Filter requests based on search and filters
  const filteredRequests = useMemo(
    () =>
      serviceRequests.filter((request) => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const fieldsToSearch = [
          request.customerName,
          request.serviceType,
          request.description,
          request.address,
          request.id,
        ];
        const matchesSearch =
          normalizedQuery === "" ||
          fieldsToSearch.some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(normalizedQuery)
          );

        const normalizedStatus = request.status;
        const matchesStatus =
          statusFilter === "all" || normalizedStatus === statusFilter;
        const matchesPriority =
          priorityFilter === "all" || request.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      }),
    [serviceRequests, searchQuery, statusFilter, priorityFilter]
  );

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleAccept = (requestId: string) => {
    const req = serviceRequests.find((r) => r._id === requestId || r._id === requestId) || null;
    console.log("rqwqwqwqwqeq", req);
    setSelectedRequest(req);
    setIsScheduleOpen(true);
  };

  const handleComplete = (requestId: string) => {
    updateMutation.mutate({
      id: requestId,
      status: "completed",
    });
  };

  const handleReject = (requestId: string) => {
    updateMutation.mutate({
      id: requestId,
      status: "cancelled",
    });
  };

  const handleEmployeeChange = (requestId: string, employeeId: string | null) => {
    const updateData: UpdateServiceRequestInput = {
      id: requestId,
      assignedEmployee: employeeId,
    };
    updateMutation.mutate(updateData);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, service type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-process">In Process</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>{" "}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="text-center text-muted-foreground">
          Loading service requests...
        </div>
      )}
      {isError && (
        <div className="text-center text-destructive">
          {(error as Error)?.message || "Failed to load service requests."}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {Number(totalServiceRequests) || 0}
          </div>
          <div className="text-sm text-muted-foreground">Total Requests</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">
            {Number(countsByStatus.pending) || 0}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-info">
            {Number(countsByStatus.inProcess) || 0}
          </div>
          <div className="text-sm text-muted-foreground">In Process</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {Number(countsByStatus.completed) || 0}
          </div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-destructive">
            {Number(countsByStatus.cancelled) || 0}
          </div>
          <div className="text-sm text-muted-foreground">Cancelled</div>
        </div>
      </div>

      {/* Service Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <ServiceRequestCard
            key={request.id}
            request={request}
            onViewDetails={handleViewDetails}
            onAccept={handleAccept}
            onComplete={handleComplete}
            onReject={handleReject}
            onEmployeeChange={handleEmployeeChange}
          />
        ))}
      </div>

      {/* Infinite Scroll Loading Indicator */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more requests...</span>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Scroll down to load more
            </div>
          )}
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && serviceRequests.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          You've reached the end of the results
        </div>
      )}

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            No service requests found
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Service requests will appear here when customers submit them"}
          </div>
        </div>
      )}

      <ServiceRequestDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        request={selectedRequest}
      />

      <ScheduleServiceDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        customerName={selectedRequest?.customerName}
        defaultDate={selectedRequest?.scheduledDate}
        isSubmitting={updateMutation.isPending}
        onConfirm={(scheduledDateISO) => {
          console.log("onConfirm called with:", scheduledDateISO);
          console.log("selectedRequest:", selectedRequest);
          const id = selectedRequest?._id || selectedRequest?.id;
          console.log("selectedRequest id:", id);
          if (!id) {
            console.log("No id found, returning early");
            return;
          }
          console.log("Calling updateMutation.mutate with:", {
            id,
            status: "in-process",
            scheduledDate: scheduledDateISO,
          });
          updateMutation.mutate({
            id,
            status: "in-process",
            scheduledDate: scheduledDateISO,
          });
          setIsScheduleOpen(false);
        }}
      />
    </div>
  );
}
