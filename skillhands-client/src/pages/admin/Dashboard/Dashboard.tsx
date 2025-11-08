import {
  ClipboardList,
  Users,
  CheckCircle,
  Clock,
  UserPlus,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceRequest, EmployeeApplication } from "@/types";
import { useDashboard } from "@/hooks/useDashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "status-pending";
    case "in-progress":
      return "status-active";
    case "completed":
      return "status-completed";
    case "cancelled":
      return "status-cancelled";
    case "approved":
      return "status-completed";
    case "rejected":
      return "status-cancelled";
    default:
      return "status-pending";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Dashboard() {
  const { stats, recentRequests, recentApplications, loading, error, refetch } =
    useDashboard();

  const navigate = useNavigate();
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={refetch}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold"></h1>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={loading}
          className="shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 sm:mr-1 ${loading ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Service Requests"
          value={stats?.totalServiceRequests || 0}
          icon={ClipboardList}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests || 0}
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Urgent Requests"
          value={stats?.urgentRequests || 0}
          icon={AlertTriangle}
          trend={{ value: 10, isPositive: false }}
        />
        <StatCard
          title="Completed Today"
          value={stats?.completedToday || 0}
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />

        <StatCard
          title="Total Pro Applications"
          value={stats?.activeEmployees || 0}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Service Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Recent Service Requests
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/service-requests")}
              className="shrink-0 text-xs sm:text-sm"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentRequests.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm">
                No recent service requests
              </div>
            ) : (
              recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start space-x-2 sm:space-x-4 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground text-sm sm:text-base truncate">
                        {request.customerName || request.name}
                      </h4>
                      <Badge
                        className={`status-badge ${getStatusBadgeClass(
                          request.status
                        )} border-0 shrink-0 text-xs`}
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {request.serviceType || request.service}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {request.address
                            ? request.address.split(",")[0]
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          {request.createdAt
                            ? formatDate(request.createdAt)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Employee Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Recent Pro Applications
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/employee-applications")}
              className="shrink-0 text-xs sm:text-sm"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentApplications.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm">
                No recent pro applications
              </div>
            ) : (
              recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-start space-x-2 sm:space-x-4 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground text-sm sm:text-base truncate">
                        {application.name}
                      </h4>
                      <Badge
                        className={`status-badge ${getStatusBadgeClass(
                          application.status
                        )} border-0 shrink-0 text-xs`}
                      >
                        {application.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {application.skills && application.skills.length > 0
                        ? `${application.skills.slice(0, 2).join(", ")}${
                            application.skills.length > 2
                              ? ` +${application.skills.length - 2} more`
                              : ""
                          }`
                        : "No skills listed"}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 shrink-0" />
                        <span>{application.rating || 0} rating</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{application.location || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => navigate("/admin/service-requests")} className="h-auto p-4 flex-col space-y-2">
              <ClipboardList className="h-6 w-6" />
              <span>New Service Request</span>
            </Button>
            <Button onClick={() => navigate("/admin/employees")} variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Add Employee</span>
            </Button>
            <Button onClick={() => navigate("/admin/reports")} variant="outline" className="h-auto p-4 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button onClick={() => navigate("/admin/service-requests")} variant="outline" className="h-auto p-4 flex-col space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Urgent Tasks</span>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
