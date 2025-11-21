import { useMemo, useState, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Plus,
  Loader2,
  Calendar as CalendarIcon,
  MapPin,
  X,
} from "lucide-react";
import { ServiceRequestCard } from "./ServiceRequestCard";
import { ServiceRequest, Employee } from "@/types";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useInfiniteServiceRequests } from "../../../hooks/useInfiniteServiceRequests";
import { useSearchParams } from "react-router-dom";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  updateServiceRequest,
  fetchServiceRequestsSummary,
  fetchServiceRequests,
  UpdateServiceRequestInput,
} from "@/lib/api.serviceRequests";
import { employeeApi, paymentApi } from "@/lib/api";
import { ScheduleServiceDialog } from "./ScheduleServiceDialog";
import { RejectServiceDialog } from "./RejectServiceDialog";
import { marylandZipCodes } from "@/data/marylandZipCodes";

export function ServiceRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteServiceRequests(10);
  // Keep local search in sync with global ?q
  useEffect(() => {
    const current = searchParams.get("q") || "";
    if (current !== searchQuery) {
      setSearchQuery(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // When local search changes (typing in local input), update ?q
  const updateGlobalSearch = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value && value.trim() !== "") {
        next.set("q", value.trim());
      } else {
        next.delete("q");
      }
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams]
  );

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

  // Fetch employees for assignment
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => employeeApi.getEmployees(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => response.data || [],
  });

  // Flatten all pages into a single array
  const serviceRequests = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);
  console.log(serviceRequests, "serviceRequests");

  // Extract unique cities from both service requests and Maryland ZIP codes
  // This ensures we show cities that have service requests + all available cities
  const uniqueCities = useMemo(() => {
    // Get cities from service requests (actual data) - normalize by stripping county suffix
    const citiesFromRequests = serviceRequests
      .map((r) => r.city)
      .filter((city): city is string => Boolean(city))
      .map((city) => city.split(",")[0].trim())
      .filter((city, index, arr) => arr.indexOf(city) === index);

    // Get all cities from Maryland ZIP codes
    const citiesFromZips = marylandZipCodes
      .map((entry) => entry.city)
      .filter((city): city is string => Boolean(city))
      .map((city) => city.trim())
      .filter((city, index, arr) => arr.indexOf(city) === index);

    // Create a map of normalized city names to their original casing from requests
    const normalizedToOriginal = new Map<string, string>();
    citiesFromRequests.forEach((city) => {
      const normalized = city.toLowerCase();
      if (!normalizedToOriginal.has(normalized)) {
        normalizedToOriginal.set(normalized, city);
      }
    });

    // Merge both lists, using original casing from requests when available
    // Otherwise use the casing from ZIP codes
    const allCities = new Set<string>();

    // Add cities from requests first (preserve their casing)
    citiesFromRequests.forEach((city) => allCities.add(city));

    // Add cities from ZIP codes that aren't already in the list (case-insensitive check)
    citiesFromZips.forEach((city) => {
      const normalized = city.toLowerCase();
      if (!normalizedToOriginal.has(normalized)) {
        allCities.add(city);
      }
    });

    // Sort alphabetically (case-insensitive)
    return Array.from(allCities).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }, [serviceRequests]);
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
        inProcess: Number(allForCounts.countsByStatus["in-process"]) || 0,
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
      queryClient.invalidateQueries({
        queryKey: ["service-requests-infinite"],
      });
      // Refresh totals and status counts immediately
      queryClient.invalidateQueries({ queryKey: ["service-requests-summary"] });
      queryClient.invalidateQueries({
        queryKey: ["service-requests-all-counts"],
      });
    },
    onError: (error) => {},
  });

  // Track which request is being processed for loading states
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );

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

        // Build a comprehensive list of searchable string fields
        const fieldsToSearch = (
          [
            request._id,
            request.id,
            request.name,
            request.customerName,
            request.service,
            request.serviceType,
            request.description,
            request.address,
            request.city,
            request.state,
            request.zip,
            request.phone,
            request.email,
            Array.isArray(request.tags) ? request.tags.join(" ") : undefined,
            typeof request.assignedEmployee === "object"
              ? request.assignedEmployee?.fullName
              : undefined,
          ] as Array<string | undefined | null>
        )
          .filter(Boolean)
          .map((value) => String(value));

        const matchesSearch =
          normalizedQuery === "" ||
          fieldsToSearch.some((value) =>
            value.toLowerCase().includes(normalizedQuery)
          );

        const normalizedStatus = request.status;
        const matchesStatus =
          statusFilter === "all" || normalizedStatus === statusFilter;
        const matchesPriority =
          priorityFilter === "all" || request.priority === priorityFilter;

        // Date filter: check only createdAt
        const matchesDate = (() => {
          if (!dateFrom && !dateTo) return true;

          // Only check createdAt field
          if (!request.createdAt) return false;

          const requestDate = new Date(request.createdAt);
          if (isNaN(requestDate.getTime())) return false;

          const dateOnly = new Date(
            requestDate.getFullYear(),
            requestDate.getMonth(),
            requestDate.getDate()
          );

          if (dateFrom && dateTo) {
            const fromOnly = new Date(
              dateFrom.getFullYear(),
              dateFrom.getMonth(),
              dateFrom.getDate()
            );
            const toOnly = new Date(
              dateTo.getFullYear(),
              dateTo.getMonth(),
              dateTo.getDate()
            );
            return dateOnly >= fromOnly && dateOnly <= toOnly;
          } else if (dateFrom) {
            const fromOnly = new Date(
              dateFrom.getFullYear(),
              dateFrom.getMonth(),
              dateFrom.getDate()
            );
            return dateOnly >= fromOnly;
          } else if (dateTo) {
            const toOnly = new Date(
              dateTo.getFullYear(),
              dateTo.getMonth(),
              dateTo.getDate()
            );
            return dateOnly <= toOnly;
          }
          return true;
        })();

        // Location filter: check city (case-insensitive, trimmed, strip county suffix)
        const matchesLocation = (() => {
          if (cityFilter === "all") return true;
          if (!request.city) return false;

          const requestCity = request.city.split(",")[0].trim().toLowerCase();
          const filterCity = cityFilter.trim().toLowerCase();

          return requestCity === filterCity;
        })();

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesDate &&
          matchesLocation
        );
      }),
    [
      serviceRequests,
      searchQuery,
      statusFilter,
      priorityFilter,
      dateFrom,
      dateTo,
      cityFilter,
    ]
  );

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleAccept = (requestId: string) => {
    const req =
      serviceRequests.find((r) => r._id === requestId || r._id === requestId) ||
      null;

    setSelectedRequest(req);
    setIsScheduleOpen(true);
  };

  const handleComplete = (requestId: string) => {
    setProcessingRequestId(requestId);
    updateMutation.mutate(
      {
        id: requestId,
        status: "completed",
      },
      {
        onSettled: () => {
          setProcessingRequestId(null);
        },
      }
    );
  };

  const handleReject = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsRejectOpen(true);
  };

  const handleRejectConfirm = async (
    reason: string,
    sendRefund: boolean,
    refundAmount?: number
  ) => {
    if (!selectedRequest) return;

    const requestId = selectedRequest._id || selectedRequest.id;
    setProcessingRequestId(requestId);

    try {
      // Process refund first if requested
      if (sendRefund && selectedRequest.stripePaymentIntentId && refundAmount) {
        try {
          await paymentApi.processRefund({
            serviceRequestId: requestId,
            amount: refundAmount / 100, // Convert from cents to dollars for API
            reason: `Service request rejected: ${reason}`,
          });
        } catch (refundError) {
          console.error("Refund error:", refundError);
          // Continue with rejection even if refund fails
          // You might want to show an error message to the user here
        }
      }

      // Then reject the service request
      updateMutation.mutate(
        {
          id: requestId,
          status: "rejected",
          rejectionReason: reason,
        },
        {
          onSettled: () => {
            setProcessingRequestId(null);
            setIsRejectOpen(false);
          },
        }
      );
    } catch (error) {
      console.error("Error processing rejection:", error);
      setProcessingRequestId(null);
      setIsRejectOpen(false);
    }
  };

  const handleEmployeeChange = (
    requestId: string,
    employeeId: string | null
  ) => {
    const updateData: UpdateServiceRequestInput = {
      id: requestId,
      assignedEmployee: employeeId,
    };
    updateMutation.mutate(updateData);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const clearDateFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* First Row: Search and Status */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, service..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateGlobalSearch(e.target.value);
              }}
              className="pl-9 text-sm"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10 border-border/60 shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-process">In Process</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Second Row: Date and Location Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] h-9 sm:h-10 justify-start text-left font-normal border-border/60 shadow-sm hover:shadow-md transition-all",
                    !dateFrom && !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom && dateTo
                    ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
                    : dateFrom
                    ? `From: ${formatDate(dateFrom)}`
                    : dateTo
                    ? `To: ${formatDate(dateTo)}`
                    : "Select date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From Date</label>
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">To Date</label>
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        disabled={(date) =>
                          dateFrom ? date < dateFrom : false
                        }
                      />
                    </div>
                  </div>
                  {(dateFrom || dateTo) && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          clearDateFilters();
                        }}
                        className="w-full h-9 border-border/60 shadow-sm hover:shadow-md transition-all"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Date Filter
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full sm:w-[200px] h-9 sm:h-10 border-border/60 shadow-sm hover:shadow-md transition-all">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {cityFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCityFilter("all");
                }}
                className="h-9 w-9 p-0 hover:bg-accent/50 transition-all"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {Number(totalServiceRequests) || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Total Requests</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-warning">
            {Number(countsByStatus.pending) || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-info">
            {Number(countsByStatus.inProcess) || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">In Process</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-success">
            {Number(countsByStatus.completed) || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-xl sm:text-2xl font-bold text-destructive">
            {Number(countsByStatus.cancelled) || 0}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Cancelled</div>
        </div>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
            <span className="text-sm sm:text-base">Loading service requests...</span>
          </div>
        </div>
      )}
      {isError && (
        <div className="text-center text-destructive">
          {(error as Error)?.message || "Failed to load service requests."}
        </div>
      )}

      {/* Service Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredRequests.map((request) => {
          const requestId = request._id || request.id;
          const isProcessing = processingRequestId === requestId;

          return (
            <ServiceRequestCard
              key={request.id}
              request={request}
              employees={employees}
              onViewDetails={handleViewDetails}
              onAccept={handleAccept}
              onComplete={handleComplete}
              onReject={handleReject}
              onEmployeeChange={handleEmployeeChange}
              isLoadingAccept={isProcessing && updateMutation.isPending}
              isLoadingComplete={isProcessing && updateMutation.isPending}
              isLoadingReject={isProcessing && updateMutation.isPending}
            />
          );
        })}
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
        <div className="text-center py-8 sm:py-12">
          <div className="text-muted-foreground text-base sm:text-lg">
            No service requests found
          </div>
          <div className="text-muted-foreground text-xs sm:text-sm mt-1">
            {searchQuery ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            dateFrom ||
            dateTo ||
            cityFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Service requests will appear here when customers submit them"}
          </div>
        </div>
      )}

      <ServiceRequestDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        request={selectedRequest}
        onUpdate={(updatedRequest) => {
          setSelectedRequest(updatedRequest);
          // Invalidate queries to refresh the list with updated payment data
          queryClient.invalidateQueries({
            queryKey: ["service-requests-infinite"],
          });
          queryClient.invalidateQueries({
            queryKey: ["service-requests-summary"],
          });
          queryClient.invalidateQueries({
            queryKey: ["service-requests-all-counts"],
          });
        }}
      />

      <ScheduleServiceDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        customerName={selectedRequest?.customerName}
        defaultDate={selectedRequest?.scheduledDate}
        preferredDate={selectedRequest?.preferredDate}
        preferredTime={selectedRequest?.preferredTime}
        isSubmitting={updateMutation.isPending}
        onConfirm={(scheduledDateISO) => {
          const id = selectedRequest?._id || selectedRequest?.id;

          if (!id) {
            console.log("No id found, returning early");
            return;
          }
          console.log("Calling updateMutation.mutate with:", {
            id,
            status: "in-process",
            scheduledDate: scheduledDateISO,
          });
          setProcessingRequestId(id);
          updateMutation.mutate(
            {
              id,
              status: "in-process",
              scheduledDate: scheduledDateISO,
            },
            {
              onSettled: () => {
                setProcessingRequestId(null);
                setIsScheduleOpen(false);
              },
            }
          );
        }}
      />

      <RejectServiceDialog
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        customerName={selectedRequest?.name || selectedRequest?.customerName}
        serviceName={selectedRequest?.service}
        isSubmitting={updateMutation.isPending}
        canRefund={
          !!(
            selectedRequest?.stripePaymentIntentId &&
            (selectedRequest?.paymentStatus === "paid" ||
              selectedRequest?.paymentStatus === "partially_paid") &&
            selectedRequest?.paymentStatus !== "refunded"
          )
        }
        paidAmount={selectedRequest?.amount || 0} // Amount actually paid (in cents)
        totalAmount={selectedRequest?.totalAmount || 0} // Total service amount (in cents)
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
