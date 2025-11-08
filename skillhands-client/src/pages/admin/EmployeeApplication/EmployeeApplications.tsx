import { useMemo, useState, useCallback, useEffect } from "react";
import { Search, Filter, Plus, Users, Loader2 } from "lucide-react";
import { EmployeeApplicationCard } from "./EmployeeApplicationCard";
import { EmployeeDetailModal } from "./EmployeeDetailModal";
import { RejectApplicationDialog } from "./RejectApplicationDialog";
import { EmployeeApplication } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useEmployeeApplications } from "@/hooks/useEmployeeApplications";
import { useInfiniteEmployeeApplications } from "@/hooks/useEmployeeApplicationsInfinite";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/api";
import { useSearchParams } from "react-router-dom";

export function EmployeeApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<EmployeeApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [applicationToReject, setApplicationToReject] =
    useState<EmployeeApplication | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approvingApplicationId, setApprovingApplicationId] = useState<
    string | null
  >(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteEmployeeApplications(10);
  const { toast } = useToast();

  // Keep local search in sync with global ?q
  useEffect(() => {
    const current = searchParams.get("q") || "";
    if (current !== searchQuery) {
      setSearchQuery(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // When local search changes, update ?q
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

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver({
    onIntersect: useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]),
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // Filter applications based on search and filters
  const applications = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );
  const totalApplications = useMemo(
    () =>
      data?.pages && data.pages.length > 0
        ? (data.pages[0] as any).total ?? applications.length
        : applications.length,
    [data, applications.length]
  );
  const visibleApplications = applications.filter(
    (application) => application.user?.role?.toLowerCase() !== "admin"
  );

  console.log(
    `Total applications: ${applications.length}, Visible (non-admin): ${visibleApplications.length}`
  );

  const filteredApplications = visibleApplications.filter((application) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const fieldsToSearch = (
      [
        (application as any)._id,
        application.id,
        application.name,
        application.location,
        application.zip,
        (application as any).email,
        (application as any).phone,
        application.user?.name,
        application.user?.email,
        Array.isArray(application.skills)
          ? application.skills.join(" ")
          : undefined,
        Array.isArray(application.workingZipCodes)
          ? application.workingZipCodes.join(" ")
          : undefined,
        Array.isArray((application as any).tags)
          ? (application as any).tags.join(" ")
          : undefined,
      ] as Array<string | undefined | null>
    )
      .filter(Boolean)
      .map((v) => String(v));

    const matchesSearch =
      normalizedQuery === "" ||
      fieldsToSearch.some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );

    const matchesStatus =
      statusFilter === "all" || application.status === statusFilter;
    const matchesExperience =
      experienceFilter === "all" ||
      application.experienceLevel === experienceFilter;

    return matchesSearch && matchesStatus && matchesExperience;
  });

  const handleViewDetails = (application: EmployeeApplication) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = async () => {
    setIsDetailModalOpen(false);
    setSelectedApplication(null);
    // Ensure updates like rating reflect in the list
    await refetch();
  };

  const handleApplicationUpdate = (updatedApplication: EmployeeApplication) => {
    // Update the selected application if it's the one being updated
    if (
      selectedApplication &&
      selectedApplication.id === updatedApplication.id
    ) {
      setSelectedApplication(updatedApplication);
    }

    // Refetch the applications list to ensure consistency
    refetch();

    toast({
      title: "Application updated",
      description: "Employee application has been updated successfully",
    });
  };

  const handleApprove = async (applicationId: string) => {
    try {
      setIsApproving(true);
      setApprovingApplicationId(applicationId);
      await adminApi.updateEmployeeStatus(applicationId, "approved");
      await refetch();
      toast({
        title: "Application Approved",
        description: "Employee application has been approved successfully.",
      });
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
      setApprovingApplicationId(null);
    }
  };

  const handleReject = (applicationId: string) => {
    const application = applications.find((app) => app.id === applicationId);
    if (application) {
      setApplicationToReject(application);
      setIsRejectModalOpen(true);
    }
  };

  const handleConfirmReject = async (rejectionReason: string) => {
    if (!applicationToReject) return;

    try {
      setIsRejecting(true);
      await adminApi.updateEmployeeStatus(
        applicationToReject.id,
        "rejected",
        rejectionReason
      );
      await refetch();
      toast({
        title: "Application Rejected",
        description:
          "Employee application has been rejected and notification sent.",
      });
      setIsRejectModalOpen(false);
      setApplicationToReject(null);
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setApplicationToReject(null);
  };

  if (isLoading && !data) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
          <span className="text-sm sm:text-base">Loading pro applications...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading pro applications: {(error as Error)?.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, skills..."
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
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={experienceFilter} onValueChange={setExperienceFilter}>
          <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10 border-border/60 shadow-sm hover:shadow-md transition-all">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {totalApplications}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Total Applications
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-warning">
            {visibleApplications.filter((a) => a.status === "pending").length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-success">
            {visibleApplications.filter((a) => a.status === "approved").length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Approved</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-destructive">
            {visibleApplications.filter((a) => a.status === "rejected").length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Rejected</div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {filteredApplications.map((application) => (
          <EmployeeApplicationCard
            key={application.id}
            application={application}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
            isApproving={
              isApproving && approvingApplicationId === application.id
            }
            isRejecting={
              isRejecting && applicationToReject?.id === application.id
            }
          />
        ))}
      </div>

      {/* Infinite Scroll Loading Indicator */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more applications...</span>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Scroll down to load more
            </div>
          )}
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && applications.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          You've reached the end of the results
        </div>
      )}

      {filteredApplications.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-muted-foreground text-base sm:text-lg">
            No applications found
          </div>
          <div className="text-muted-foreground text-xs sm:text-sm mt-1">
            {searchQuery || statusFilter !== "all" || experienceFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Pro applications will appear here when people apply for positions"}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        application={selectedApplication}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onApplicationUpdate={handleApplicationUpdate}
      />

      {/* Reject Application Modal */}
      <RejectApplicationDialog
        isOpen={isRejectModalOpen}
        onClose={handleCloseRejectModal}
        onConfirm={handleConfirmReject}
        employeeName={applicationToReject?.name}
        loading={isRejecting}
      />
    </div>
  );
}
