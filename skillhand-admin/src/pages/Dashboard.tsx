import { DashboardStats } from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Clock,
  MapPin,
  Phone,
  Calendar,
  User,
  Wrench,
} from "lucide-react";

// Mock data for recent requests
const recentServiceRequests = [
  {
    id: "1",
    customerName: "John Doe",
    service: "Plumbing Repair",
    location: "Downtown Dubai",
    status: "pending",
    priority: "high",
    requestedDate: "2024-01-15",
    phone: "+971 50 123 4567",
  },
  {
    id: "2",
    customerName: "Sarah Ahmed",
    service: "Electrical Installation",
    location: "Marina",
    status: "in-progress",
    priority: "medium",
    requestedDate: "2024-01-14",
    phone: "+971 55 987 6543",
  },
  {
    id: "3",
    customerName: "Mike Johnson",
    service: "AC Maintenance",
    location: "Jumeirah",
    status: "completed",
    priority: "low",
    requestedDate: "2024-01-13",
    phone: "+971 52 456 7890",
  },
];

const recentEmployeeRequests = [
  {
    id: "1",
    name: "Ahmed Hassan",
    skill: "Electrician",
    experience: "5 years",
    status: "pending",
    appliedDate: "2024-01-14",
    phone: "+971 50 111 2222",
  },
  {
    id: "2",
    name: "Maria Santos",
    skill: "Plumber",
    experience: "3 years",
    status: "reviewing",
    appliedDate: "2024-01-13",
    phone: "+971 55 333 4444",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in-progress":
    case "reviewing":
      return "default";
    case "completed":
      return "success";
    default:
      return "secondary";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Service Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Service Requests
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentServiceRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{request.customerName}</h4>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Wrench className="w-4 h-4" />
                      {request.service}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {request.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {request.requestedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {request.phone}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Employee Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Employee Applications
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployeeRequests.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{employee.name}</h4>
                      <Badge variant={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {employee.skill} • {employee.experience}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Applied: {employee.appliedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {employee.phone}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
