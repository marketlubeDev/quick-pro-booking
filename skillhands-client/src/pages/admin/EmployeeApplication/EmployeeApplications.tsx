import { useState } from "react";
import { Search, Filter, Plus, Users, Loader2 } from "lucide-react";
import { EmployeeApplicationCard } from "./EmployeeApplicationCard";
import { EmployeeDetailModal } from "./EmployeeDetailModal";
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
import { useEmployeeApplications } from "@/hooks/useEmployeeApplications";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function EmployeeApplications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<EmployeeApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { applications, loading, error, updateStatus } =
    useEmployeeApplications();
  const { toast } = useToast();

  // Filter applications based on search and filters
  const visibleApplications = applications.filter(
    (application) => application.user?.role?.toLowerCase() !== "admin"
  );

  const filteredApplications = visibleApplications.filter((application) => {
    const matchesSearch =
      searchQuery === "" ||
      application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      application.location.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplication(null);
  };

  const handleApprove = async (applicationId: string) => {
    try {
      await updateStatus(applicationId, "approved");
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
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await updateStatus(applicationId, "rejected");
      toast({
        title: "Application Rejected",
        description: "Employee application has been rejected.",
      });
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading employee applications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading employee applications: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skills, or location..."
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
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={experienceFilter} onValueChange={setExperienceFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>

        {/* <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button> */}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {visibleApplications.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Applications
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">
            {visibleApplications.filter((a) => a.status === "pending").length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {visibleApplications.filter((a) => a.status === "approved").length}
          </div>
          <div className="text-sm text-muted-foreground">Approved</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-destructive">
            {visibleApplications.filter((a) => a.status === "rejected").length}
          </div>
          <div className="text-sm text-muted-foreground">Rejected</div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((application) => (
          <EmployeeApplicationCard
            key={application.id}
            application={application}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            No applications found
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            {searchQuery || statusFilter !== "all" || experienceFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Employee applications will appear here when people apply for positions"}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        application={selectedApplication}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
}
