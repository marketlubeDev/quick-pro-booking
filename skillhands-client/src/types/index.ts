import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface PaymentHistoryEntry {
  _id?: string;
  type: "payment" | "refund" | "link" | "adjustment";
  method?: "stripe" | "cash" | "manual" | "system";
  label?: string;
  note?: string;
  amount: number;
  status?: "pending" | "succeeded" | "failed" | "cancelled" | "expired";
  referenceId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  completedAt?: string;
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
    | "new"
    | "pending"
    | "in-process"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "rejected";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  estimatedCost?: number;
  actualCost?: number;

  // Payment
  paymentStatus?: "pending" | "paid" | "partially_paid" | "failed" | "refunded";
  paymentMethod?: "cash" | "stripe" | null;
  stripePaymentIntentId?: string | null;
  amount?: number; // base amount in cents or smallest currency unit
  tax?: number; // tax amount in cents
  totalAmount?: number; // total in cents
  amountPaid?: number;
  remainingAmount?: number;
  paidAt?: string | null;
  paymentHistory?: PaymentHistoryEntry[];

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

  // Enhanced fields
  serviceCategory?:
    | "plumbing"
    | "electrical"
    | "cleaning"
    | "maintenance"
    | "renovation"
    | "other";
  urgency?: "routine" | "urgent" | "emergency";
  customerNotes?: string;
  adminNotes?: string;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
  followUpRequired?: boolean;
  followUpDate?: string;
  customerRating?: number; // 1-5
  customerFeedback?: string;
  source?: "website" | "phone" | "walk-in" | "referral" | "other";
  tags?: string[];
  isRecurring?: boolean;
  recurringPattern?: "weekly" | "monthly" | "quarterly" | "yearly";
  nextScheduledDate?: string;

  // File attachment
  attachment?: {
    filename?: string;
    mimetype?: string;
    size?: number;
    url?: string;
  };

  // Employee job management fields
  assignedEmployee?:
    | string
    | {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
      };
  employeeAccepted?: boolean;
  employeeAcceptedAt?: string;
  employeeRemarks?: string;
  completedAt?: string;
  completionNotes?: string;

  // Tracking fields
  lastUpdatedBy?: string;
  lastUpdatedByDetails?: {
    _id: string;
    name: string;
    email: string;
  };
  rejectionReason?: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface EmployeeApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation?: string;
  skills: string[];
  experienceLevel: string;
  rating: number;
  previousJobCount: number;
  certifications: string[];
  expectedSalary: number;
  yearsOfExperience?: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  location: string;
  // Address details (optional)
  address?: string;
  city?: string;
  zip?: string;
  // Working area details (optional)
  workingZipCodes?: string[];
  workingCities?: string[];
  // Additional fields from API
  avatarUrl?: string;
  bio?: string;
  verified?: boolean;
  verificationNotes?: string;
  workExperience?: WorkExperience[];
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  postalCode?: string;
  skills?: string[];
}

export interface DashboardStats {
  totalServiceRequests: number;
  activeEmployees: number;
  completedToday: number;
  pendingRequests: number;
  employeeApplications: number;
  urgentRequests: number;
}

export interface ServiceRequestAnalytics {
  summary: {
    totalRequests: number;
    totalCost: number;
    avgCost: number;
    totalDuration: number;
    avgDuration: number;
    completedRequests: number;
    urgentRequests: number;
    emergencyRequests: number;
    avgRating: number;
  };
  statusDistribution: Array<{
    _id: string;
    count: number;
  }>;
  categoryDistribution: Array<{
    _id: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
    totalCost: number;
  }>;
  period: string;
}

export interface ServiceRequestFilters {
  status?: string;
  priority?: string;
  serviceCategory?: string;
  urgency?: string;
  assignedEmployee?: string;
  source?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
  costRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export interface ServiceRequestSearchRequest {
  query?: string;
  filters?: ServiceRequestFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ServiceRequestSearchResponse {
  success: boolean;
  data: ServiceRequest[];
  total: number;
  page: number;
  limit: number;
  analytics?: {
    totalCost: number;
    avgCost: number;
    totalDuration: number;
    avgDuration: number;
    urgentCount: number;
    emergencyCount: number;
  };
}
