import { apiFetch } from "./api";
import type { ServiceRequest } from "@/types";

export interface EmployeeJob extends ServiceRequest {
  assignedEmployee?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  scheduledTime?: string;
}

export interface EmployeeJobsResponse {
  success: boolean;
  data: EmployeeJob[];
}

export interface JobActionResponse {
  success: boolean;
  data: EmployeeJob;
  message?: string;
}

export interface AcceptJobInput {
  jobId: string;
  employeeId: string;
}

export interface CompleteJobInput {
  jobId: string;
  employeeId: string;
  completionNotes?: string;
}

export interface AddRemarksInput {
  jobId: string;
  employeeId: string;
  remarks: string;
}

export async function fetchEmployeeJobs(
  employeeId: string,
  status?: string
): Promise<EmployeeJob[]> {
  try {
    const url = status 
      ? `/api/service-requests/employee/${employeeId}?status=${status}`
      : `/api/service-requests/employee/${employeeId}`;
    
    const response = await apiFetch<EmployeeJobsResponse>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching employee jobs:", error);
    return [];
  }
}

export async function acceptJob(input: AcceptJobInput): Promise<JobActionResponse> {
  const { jobId, employeeId } = input;
  
  return apiFetch<JobActionResponse>(`/api/service-requests/${jobId}/accept`, {
    method: "POST",
    body: { employeeId },
  });
}

export async function completeJob(input: CompleteJobInput): Promise<JobActionResponse> {
  const { jobId, employeeId, completionNotes } = input;
  
  return apiFetch<JobActionResponse>(`/api/service-requests/${jobId}/complete`, {
    method: "POST",
    body: { employeeId, completionNotes },
  });
}

export async function addJobRemarks(input: AddRemarksInput): Promise<JobActionResponse> {
  const { jobId, employeeId, remarks } = input;
  
  return apiFetch<JobActionResponse>(`/api/service-requests/${jobId}/remarks`, {
    method: "POST",
    body: { employeeId, remarks },
  });
}
