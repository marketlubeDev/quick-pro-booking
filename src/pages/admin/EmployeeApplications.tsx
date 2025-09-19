import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
} from "lucide-react";
import { EmployeeApplication } from "@/types";

// Mock data for employee applications
const mockApplications: EmployeeApplication[] = [
  {
    id: "APP-001",
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 123-4567",
    serviceType: "Plumbing",
    experience: "5 years of residential and commercial plumbing experience",
    status: "pending",
    appliedAt: "2024-01-15T08:20:00Z",
    resume: "alex_thompson_resume.pdf",
    portfolio: ["project1.jpg", "project2.jpg", "project3.jpg"],
  },
  {
    id: "APP-002",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 987-6543",
    serviceType: "Electrical",
    experience: "3 years of electrical work, licensed electrician",
    status: "approved",
    appliedAt: "2024-01-14T14:30:00Z",
    resume: "emma_wilson_resume.pdf",
    portfolio: ["electrical_project1.jpg", "electrical_project2.jpg"],
  },
  {
    id: "APP-003",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 456-7890",
    serviceType: "Cleaning",
    experience: "2 years of professional cleaning services",
    status: "pending",
    appliedAt: "2024-01-15T10:15:00Z",
    resume: "michael_chen_resume.pdf",
    portfolio: [],
  },
  {
    id: "APP-004",
    name: "Sarah Rodriguez",
    email: "sarah.rodriguez@email.com",
    phone: "+1 (555) 321-0987",
    serviceType: "HVAC",
    experience: "4 years HVAC technician, EPA certified",
    status: "rejected",
    appliedAt: "2024-01-13T16:45:00Z",
    resume: "sarah_rodriguez_resume.pdf",
    portfolio: ["hvac_project1.jpg", "hvac_project2.jpg", "hvac_project3.jpg"],
  },
];

export function EmployeeApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<EmployeeApplication | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredApplications = mockApplications.filter((application) => {
    const matchesSearch =
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.serviceType
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      application.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || application.status === statusFilter;
    const matchesServiceType =
      serviceTypeFilter === "all" ||
      application.serviceType === serviceTypeFilter;

    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const handleApprove = (applicationId: string) => {
    // Handle approval logic here
    console.log("Approving application:", applicationId);
  };

  const handleReject = (applicationId: string) => {
    // Handle rejection logic here
    console.log("Rejecting application:", applicationId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Applications</h1>
          <p className="text-muted-foreground">
            Review and manage employee applications and profiles
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Employee
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={serviceTypeFilter}
              onValueChange={setServiceTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Types</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="HVAC">HVAC</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    mockApplications.filter((a) => a.status === "pending")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    mockApplications.filter((a) => a.status === "approved")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    mockApplications.filter((a) => a.status === "rejected")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockApplications.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Employee Applications ({filteredApplications.length})
          </CardTitle>
          <CardDescription>
            All employee applications and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {application.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.serviceType}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-sm">
                      {application.experience}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                              Complete information for {application.id}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-6">
                              {/* Personal Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">
                                    Personal Information
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">Name:</span>
                                      <span>{selectedApplication.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{selectedApplication.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4" />
                                      <span>{selectedApplication.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        Applied:{" "}
                                        {new Date(
                                          selectedApplication.appliedAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-3">
                                    Professional Information
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="font-medium">
                                        Service Type:{" "}
                                      </span>
                                      <Badge variant="outline">
                                        {selectedApplication.serviceType}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Status:{" "}
                                      </span>
                                      <Badge
                                        className={getStatusColor(
                                          selectedApplication.status
                                        )}
                                      >
                                        {selectedApplication.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Experience */}
                              <div>
                                <h4 className="font-medium mb-2">Experience</h4>
                                <p className="text-sm text-muted-foreground">
                                  {selectedApplication.experience}
                                </p>
                              </div>

                              {/* Documents */}
                              <div>
                                <h4 className="font-medium mb-3">Documents</h4>
                                <div className="space-y-2">
                                  {selectedApplication.resume && (
                                    <div className="flex items-center space-x-2">
                                      <FileText className="h-4 w-4" />
                                      <span className="text-sm">
                                        {selectedApplication.resume}
                                      </span>
                                      <Button variant="ghost" size="sm">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                  {selectedApplication.portfolio &&
                                    selectedApplication.portfolio.length >
                                      0 && (
                                      <div>
                                        <p className="text-sm font-medium mb-2">
                                          Portfolio:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedApplication.portfolio.map(
                                            (item, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                              >
                                                <FileText className="h-4 w-4" />
                                                <span className="text-sm">
                                                  {item}
                                                </span>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                >
                                                  <ExternalLink className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {selectedApplication.status === "pending" && (
                                <div className="flex space-x-2 pt-4 border-t">
                                  <Button
                                    onClick={() =>
                                      handleApprove(selectedApplication.id)
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleReject(selectedApplication.id)
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {application.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(application.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(application.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeApplications;
