import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface ServiceRequest {
  // Support both Mongo-style and app-local ids
  id: string;
  _id?: string;

  // Common fields used across components (frontend naming)
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  description: string;
  status:
    | "pending"
    | "in-process"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "rejected";
  priority: "low" | "medium" | "high";
  createdAt: string;
  scheduledDate?: string;
  estimatedCost?: number;

  // Address variants
  address: string;
  city?: string;
  state?: string;
  zip?: string;

  // Preferred scheduling (used in UI)
  preferredDate?: string;
  preferredTime?: string;

  // Alternative backend naming (for compatibility with older data)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceType?: string;
  completedDate?: string;
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
  // Additional fields from API
  avatarUrl?: string;
  bio?: string;
  verified?: boolean;
  verificationNotes?: string;
  user?: {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface DashboardStats {
  totalServiceRequests: number;
  activeEmployees: number;
  completedToday: number;
  pendingRequests: number;
  employeeApplications: number;
  urgentRequests: number;
}
