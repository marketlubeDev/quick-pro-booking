import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  Phone,
  Calendar,
  User,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Star,
} from "lucide-react";

// Mock data for employee requests
const employeeRequests = [
  {
    id: "ER001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+971 50 111 2222",
    skill: "Electrician",
    experience: "5 years",
    location: "Dubai",
    status: "pending",
    appliedDate: "2024-01-14",
    expectedSalary: "AED 4,500/month",
    rating: 4.5,
    previousJobs: 12,
    description:
      "Experienced electrician with expertise in residential and commercial electrical work. Certified in safety protocols.",
    certifications: [
      "Electrical Safety Certificate",
      "DEWA Approved",
      "First Aid Certified",
    ],
  },
  {
    id: "ER002",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+971 55 333 4444",
    skill: "Plumber",
    experience: "3 years",
    location: "Sharjah",
    status: "reviewing",
    appliedDate: "2024-01-13",
    expectedSalary: "AED 3,800/month",
    rating: 4.2,
    previousJobs: 8,
    description:
      "Skilled plumber specializing in bathroom and kitchen installations. Quick problem solver.",
    certifications: ["Plumbing License", "Water Safety Certificate"],
  },
  {
    id: "ER003",
    name: "Omar Al-Rashid",
    email: "omar.alrashid@email.com",
    phone: "+971 52 555 6666",
    skill: "AC Technician",
    experience: "7 years",
    location: "Abu Dhabi",
    status: "approved",
    appliedDate: "2024-01-12",
    expectedSalary: "AED 5,200/month",
    rating: 4.8,
    previousJobs: 25,
    description:
      "Expert AC technician with extensive experience in installation, maintenance, and repair of all AC brands.",
    certifications: [
      "HVAC Certification",
      "Refrigerant Handling License",
      "Safety Training Certificate",
    ],
  },
  {
    id: "ER004",
    name: "Jennifer Wilson",
    email: "jennifer.wilson@email.com",
    phone: "+971 56 777 8888",
    skill: "Carpenter",
    experience: "4 years",
    location: "Dubai",
    status: "rejected",
    appliedDate: "2024-01-11",
    expectedSalary: "AED 4,000/month",
    rating: 3.9,
    previousJobs: 6,
    description:
      "Creative carpenter with skills in custom furniture and home renovation projects.",
    certifications: ["Carpentry Certificate", "Tool Safety Training"],
  },
  {
    id: "ER005",
    name: "Hassan Ali",
    email: "hassan.ali@email.com",
    phone: "+971 54 999 0000",
    skill: "Painter",
    experience: "6 years",
    location: "Dubai",
    status: "pending",
    appliedDate: "2024-01-15",
    expectedSalary: "AED 3,500/month",
    rating: 4.3,
    previousJobs: 15,
    description:
      "Professional painter with expertise in interior and exterior painting. Attention to detail.",
    certifications: [
      "Painting Techniques Certificate",
      "Color Theory Certification",
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "reviewing":
      return "default";
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return Clock;
    case "reviewing":
      return Eye;
    case "approved":
      return CheckCircle;
    case "rejected":
      return XCircle;
    default:
      return Clock;
  }
};

export function EmployeeRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");

  const filteredRequests = employeeRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesSkill = skillFilter === "all" || request.skill === skillFilter;

    return matchesSearch && matchesStatus && matchesSkill;
  });

  const uniqueSkills = [...new Set(employeeRequests.map((req) => req.skill))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Applications
          </h1>
          <p className="text-gray-600">
            Review and manage employee applications
          </p>
        </div>
        <Button>Post New Job</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, skill, or ID..."
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
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="all">All Skills</option>
              {uniqueSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const StatusIcon = getStatusIcon(request.status);
          return (
            <Card
              key={request.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {request.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {request.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request.skill}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {request.id}
                        </Badge>
                      </div>
                      <Badge
                        variant={getStatusColor(request.status)}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="w-3 h-3" />
                        {request.status}
                      </Badge>
                    </div>

                    {/* Experience & Rating */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{request.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>
                          {request.rating}/5.0 ({request.previousJobs} jobs)
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600">
                      {request.description}
                    </p>

                    {/* Certifications */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {request.certifications.map((cert, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {request.appliedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Expected:</span>
                        <span className="text-primary font-semibold">
                          {request.expectedSalary}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status === "reviewing" && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status === "approved" && (
                      <Button size="sm" variant="outline" disabled>
                        Approved
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
              No employee applications found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

