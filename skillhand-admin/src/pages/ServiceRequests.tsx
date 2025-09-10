import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Filter,
  Search,
  MapPin,
  Phone,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock data for service requests
const serviceRequests = [
  {
    id: "SR001",
    customerName: "John Doe",
    service: "Plumbing Repair",
    description: "Kitchen sink is leaking and needs immediate repair",
    location: "Downtown Dubai, Apt 1205",
    status: "pending",
    priority: "high",
    requestedDate: "2024-01-15",
    scheduledDate: "2024-01-16",
    phone: "+971 50 123 4567",
    email: "john.doe@email.com",
    estimatedCost: "AED 250",
  },
  {
    id: "SR002",
    customerName: "Sarah Ahmed",
    service: "Electrical Installation",
    description: "Install new ceiling fans in 3 bedrooms",
    location: "Marina, Villa 23",
    status: "in-progress",
    priority: "medium",
    requestedDate: "2024-01-14",
    scheduledDate: "2024-01-15",
    phone: "+971 55 987 6543",
    email: "sarah.ahmed@email.com",
    estimatedCost: "AED 800",
  },
  {
    id: "SR003",
    customerName: "Mike Johnson",
    service: "AC Maintenance",
    description: "Annual AC servicing for 2 units",
    location: "Jumeirah, Tower B, Floor 15",
    status: "completed",
    priority: "low",
    requestedDate: "2024-01-13",
    scheduledDate: "2024-01-14",
    phone: "+971 52 456 7890",
    email: "mike.j@email.com",
    estimatedCost: "AED 400",
  },
  {
    id: "SR004",
    customerName: "Fatima Al-Zahra",
    service: "Kitchen Renovation",
    description: "Complete kitchen cabinet installation",
    location: "Business Bay, Unit 808",
    status: "pending",
    priority: "medium",
    requestedDate: "2024-01-15",
    scheduledDate: "2024-01-18",
    phone: "+971 56 789 0123",
    email: "fatima.az@email.com",
    estimatedCost: "AED 5,500",
  },
  {
    id: "SR005",
    customerName: "David Smith",
    service: "Bathroom Repair",
    description: "Fix shower head and replace bathroom tiles",
    location: "DIFC, Building 3, Apt 402",
    status: "cancelled",
    priority: "low",
    requestedDate: "2024-01-12",
    scheduledDate: "2024-01-15",
    phone: "+971 54 321 0987",
    email: "david.smith@email.com",
    estimatedCost: "AED 1,200",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in-progress":
      return "default";
    case "completed":
      return "success";
    case "cancelled":
      return "destructive";
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return Clock;
    case "in-progress":
      return Clock;
    case "completed":
      return CheckCircle;
    case "cancelled":
      return XCircle;
    default:
      return Clock;
  }
};

export function ServiceRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredRequests = serviceRequests.filter((request) => {
    const matchesSearch =
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-600">Manage and track all service requests</p>
        </div>
        <Button>New Request</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by customer name, service, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const StatusIcon = getStatusIcon(request.status);
          return (
            <Card
              key={request.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {request.customerName}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {request.id}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge
                          variant={getStatusColor(request.status)}
                          className="flex items-center gap-1"
                        >
                          <StatusIcon className="w-3 h-3" />
                          {request.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="space-y-2">
                      <p className="font-medium text-primary">
                        {request.service}
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.description}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{request.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Requested: {request.requestedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Scheduled: {request.scheduledDate}</span>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">
                        Estimated Cost:
                      </span>
                      <span className="font-semibold text-lg text-primary">
                        {request.estimatedCost}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    {request.status === "pending" && (
                      <Button size="sm" className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </Button>
                    )}
                    {request.status === "in-progress" && (
                      <Button
                        size="sm"
                        variant="success"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              No service requests found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

