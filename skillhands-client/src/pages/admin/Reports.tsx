import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Calendar,
  Download,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useReports, useExportReports } from "@/hooks/useReports";
import { ServiceRequest } from "@/types";

// Helper function to format date as "3 Oct 2025,"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "in progress":
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "scheduled":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Helper function to get priority badge variant
const getPriorityBadgeVariant = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
    case "urgent":
      return "border-red-500 text-red-500";
    case "medium":
      return "border-yellow-500 text-yellow-500";
    case "low":
      return "border-green-500 text-green-500";
    default:
      return "border-gray-500 text-gray-500";
  }
};

export function Reports() {
  const [timePeriod, setTimePeriod] = useState("last-month");

  // Use the reports hook to fetch data
  const { data: reportsData, loading, error, refetch } = useReports(timePeriod);
  const { exportReports, exporting } = useExportReports(timePeriod);

  // Extract data with fallbacks
  const serviceRequests = reportsData?.serviceRequests || [];
  const employees = reportsData?.employeePerformance || [];
  const stats = reportsData?.stats || {
    totalRequests: 0,
    completedRequests: 0,
    inProgressRequests: 0,
    pendingRequests: 0,
  };

  const totalRequests = stats.totalRequests;
  const completedRequests = stats.completedRequests;
  const inProgressRequests = stats.inProgressRequests;
  const pendingRequests = stats.pendingRequests;

  const handleExport = async () => {
    try {
      await exportReports("csv");
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Simple Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Service requests and employee performance
          </p> */}
        </div>
        <div className="flex gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting || loading}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {exporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading reports...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">Error loading reports: {error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Content - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Simple Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalRequests}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Requests
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{completedRequests}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{inProgressRequests}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{pendingRequests}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Requests */}
          <div className="flex flex-col lg:flex-row gap-6">
          <Card className="w-full lg:w-1/2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Service Requests
              </CardTitle>
              <CardDescription>
                Recent service requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2 no-scrollbar">
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No service requests found for the selected period.
                  </div>
                ) : (
                  serviceRequests.map((request: ServiceRequest) => (
                    <div
                      key={request.id || request._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {(request.id || request._id || "").slice(-3)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {request.service || request.serviceType} -{" "}
                            {request.customerName || request.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={getPriorityBadgeVariant(request.priority)}
                        >
                          {request.priority}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getStatusBadgeVariant(request.status)}
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employee Performance */}
          <Card className="w-full lg:w-1/2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pro Performance
              </CardTitle>
              <CardDescription>Pro performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 no-scrollbar">
                {employees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pro performance data available for the selected
                    period.
                  </div>
                ) : (
                  employees.map((employee) => (
                    <div
                      key={employee._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {employee.completedJobs} completed jobs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">
                              {employee.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Rating
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{employee.efficiency}%</p>
                          <p className="text-xs text-muted-foreground">
                            Efficiency
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{employee.successRate}%</p>
                          <p className="text-xs text-muted-foreground">
                            Success Rate
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
