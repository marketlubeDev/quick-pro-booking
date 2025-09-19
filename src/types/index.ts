import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface ServiceRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  description: string;
  status: "pending" | "in-process" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  createdAt: string;
  scheduledDate?: string;
  estimatedCost?: number;
  address: string;
}

export interface EmployeeApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experienceLevel: string;
  rating: number;
  previousJobCount: number;
  certifications: string[];
  expectedSalary: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  location: string;
}

export interface DashboardStats {
  totalServiceRequests: number;
  activeEmployees: number;
  completedToday: number;
  pendingRequests: number;
  employeeApplications: number;
  urgentRequests: number;
}
