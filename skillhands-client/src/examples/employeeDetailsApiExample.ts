/**
 * Employee Details API Usage Examples
 * 
 * This file demonstrates how to use the new employee details API
 * for editing and managing employee information.
 */

import {
  // Basic employee operations
  getMyEmployeeDetails,
  updateMyEmployeeDetails,
  
  // Admin operations
  getEmployeeDetailsById,
  getAllEmployeeDetails,
  updateEmployeeStatus,
  updateEmployeeRating,
  updateEmployeeVerification,
  updateEmployeeProfessionalDetails,
  updateEmployeePersonalDetails,
  
  // Work experience management
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  
  // Profile management
  getProfileCompletion,
  uploadProfileImage,
  uploadCertificates,
  
  // Types
  type EmployeeDetailsUpdateInput,
  type EmployeeSearchFilters,
} from "../lib/api.employeeDetails";

// ============================================================================
// BASIC EMPLOYEE OPERATIONS
// ============================================================================

/**
 * Example: Get current user's employee details
 */
export async function exampleGetMyDetails() {
  try {
    const myDetails = await getMyEmployeeDetails();
    console.log("My employee details:", myDetails);
    return myDetails;
  } catch (error) {
    console.error("Failed to get my details:", error);
    throw error;
  }
}

/**
 * Example: Update current user's employee details
 */
export async function exampleUpdateMyDetails() {
  try {
    const updates: EmployeeDetailsUpdateInput = {
      fullName: "John Doe",
      phone: "+1234567890",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      bio: "Experienced professional with 5+ years in the field",
      designation: "Senior Technician",
      level: "Expert",
      expectedSalary: 75000,
      skills: ["Plumbing", "Electrical", "HVAC", "Maintenance"],
    };

    const updatedDetails = await updateMyEmployeeDetails(updates);
    console.log("Updated employee details:", updatedDetails);
    return updatedDetails;
  } catch (error) {
    console.error("Failed to update my details:", error);
    throw error;
  }
}

// ============================================================================
// ADMIN OPERATIONS
// ============================================================================

/**
 * Example: Get employee details by ID (admin only)
 */
export async function exampleGetEmployeeById(employeeId: string) {
  try {
    const employeeDetails = await getEmployeeDetailsById(employeeId);
    console.log("Employee details:", employeeDetails);
    return employeeDetails;
  } catch (error) {
    console.error("Failed to get employee details:", error);
    throw error;
  }
}

/**
 * Example: Get all employees with filtering and pagination (admin only)
 */
export async function exampleGetAllEmployees() {
  try {
    const filters: EmployeeSearchFilters = {
      status: "approved",
      level: "Expert",
      verified: true,
      city: "New York",
      minRating: 4.0,
      search: "plumbing",
      sortBy: "rating",
      sortOrder: "desc",
      page: 1,
      limit: 20,
    };

    const result = await getAllEmployeeDetails(filters);
    console.log("Filtered employees:", result);
    return result;
  } catch (error) {
    console.error("Failed to get all employees:", error);
    throw error;
  }
}

/**
 * Example: Update employee status (admin only)
 */
export async function exampleUpdateEmployeeStatus(
  profileId: string,
  status: "pending" | "approved" | "rejected",
  notes?: string
) {
  try {
    const updatedEmployee = await updateEmployeeStatus(profileId, status, notes);
    console.log("Updated employee status:", updatedEmployee);
    return updatedEmployee;
  } catch (error) {
    console.error("Failed to update employee status:", error);
    throw error;
  }
}

/**
 * Example: Update employee rating (admin only)
 */
export async function exampleUpdateEmployeeRating(profileId: string, rating: number) {
  try {
    const updatedEmployee = await updateEmployeeRating(profileId, rating);
    console.log("Updated employee rating:", updatedEmployee);
    return updatedEmployee;
  } catch (error) {
    console.error("Failed to update employee rating:", error);
    throw error;
  }
}

/**
 * Example: Update employee verification details (admin only)
 */
export async function exampleUpdateEmployeeVerification(profileId: string) {
  try {
    const updatedEmployee = await updateEmployeeVerification(profileId, {
      verified: true,
      verificationStatus: "approved",
      verificationNotes: "All documents verified and background check passed",
    });
    console.log("Updated employee verification:", updatedEmployee);
    return updatedEmployee;
  } catch (error) {
    console.error("Failed to update employee verification:", error);
    throw error;
  }
}

/**
 * Example: Update employee professional details (admin only)
 */
export async function exampleUpdateEmployeeProfessional(profileId: string) {
  try {
    const updatedEmployee = await updateEmployeeProfessionalDetails(profileId, {
      designation: "Senior Technician",
      level: "Expert",
      expectedSalary: 80000,
      skills: ["Plumbing", "Electrical", "HVAC", "Maintenance", "Safety"],
      totalJobs: 150,
    });
    console.log("Updated employee professional details:", updatedEmployee);
    return updatedEmployee;
  } catch (error) {
    console.error("Failed to update employee professional details:", error);
    throw error;
  }
}

/**
 * Example: Update employee personal details (admin only)
 */
export async function exampleUpdateEmployeePersonal(profileId: string) {
  try {
    const updatedEmployee = await updateEmployeePersonalDetails(profileId, {
      fullName: "John Smith",
      email: "john.smith@example.com",
      phone: "+1234567890",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      country: "USA",
      bio: "Experienced professional with excellent customer service skills",
    });
    console.log("Updated employee personal details:", updatedEmployee);
    return updatedEmployee;
  } catch (error) {
    console.error("Failed to update employee personal details:", error);
    throw error;
  }
}

// ============================================================================
// WORK EXPERIENCE MANAGEMENT
// ============================================================================

/**
 * Example: Add work experience
 */
export async function exampleAddWorkExperience() {
  try {
    const updatedProfile = await addWorkExperience({
      company: "ABC Construction",
      position: "Senior Technician",
      startDate: "2020-01-15",
      endDate: "2023-12-31",
      current: false,
      description: "Led a team of 5 technicians and managed complex plumbing and electrical projects",
      location: "New York, NY",
    });
    console.log("Added work experience:", updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error("Failed to add work experience:", error);
    throw error;
  }
}

/**
 * Example: Update work experience
 */
export async function exampleUpdateWorkExperience(experienceId: string) {
  try {
    const updatedProfile = await updateWorkExperience(experienceId, {
      position: "Lead Technician",
      description: "Promoted to lead technician, managing larger projects and training junior staff",
      current: true,
    });
    console.log("Updated work experience:", updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error("Failed to update work experience:", error);
    throw error;
  }
}

/**
 * Example: Delete work experience
 */
export async function exampleDeleteWorkExperience(experienceId: string) {
  try {
    const updatedProfile = await deleteWorkExperience(experienceId);
    console.log("Deleted work experience:", updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error("Failed to delete work experience:", error);
    throw error;
  }
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

/**
 * Example: Get profile completion status
 */
export async function exampleGetProfileCompletion() {
  try {
    const completion = await getProfileCompletion();
    console.log("Profile completion:", completion);
    return completion;
  } catch (error) {
    console.error("Failed to get profile completion:", error);
    throw error;
  }
}

/**
 * Example: Upload profile image
 */
export async function exampleUploadProfileImage(file: File) {
  try {
    const result = await uploadProfileImage(file);
    console.log("Profile image uploaded:", result);
    return result;
  } catch (error) {
    console.error("Failed to upload profile image:", error);
    throw error;
  }
}

/**
 * Example: Upload certificates
 */
export async function exampleUploadCertificates(files: File[]) {
  try {
    const result = await uploadCertificates(files);
    console.log("Certificates uploaded:", result);
    return result;
  } catch (error) {
    console.error("Failed to upload certificates:", error);
    throw error;
  }
}

// ============================================================================
// COMPREHENSIVE EXAMPLES
// ============================================================================

/**
 * Example: Complete employee onboarding process
 */
export async function exampleCompleteEmployeeOnboarding() {
  try {
    // 1. Update basic personal information
    await updateMyEmployeeDetails({
      fullName: "Jane Doe",
      phone: "+1234567890",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      bio: "Passionate professional with 3+ years of experience",
    });

    // 2. Set professional details
    await updateMyEmployeeDetails({
      designation: "Technician",
      level: "Intermediate",
      expectedSalary: 60000,
      skills: ["Plumbing", "Basic Electrical", "Maintenance"],
    });

    // 3. Add work experience
    await addWorkExperience({
      company: "XYZ Services",
      position: "Junior Technician",
      startDate: "2021-06-01",
      endDate: "2023-05-31",
      current: false,
      description: "Provided maintenance and repair services for residential and commercial clients",
      location: "Chicago, IL",
    });

    // 4. Check profile completion
    const completion = await getProfileCompletion();
    console.log("Profile completion after onboarding:", completion);

    return completion;
  } catch (error) {
    console.error("Failed to complete employee onboarding:", error);
    throw error;
  }
}

/**
 * Example: Admin bulk employee management
 */
export async function exampleAdminBulkEmployeeManagement() {
  try {
    // 1. Get all pending employees
    const pendingEmployees = await getAllEmployeeDetails({
      status: "pending",
      sortBy: "appliedDate",
      sortOrder: "asc",
    });

    console.log("Pending employees:", pendingEmployees);

    // 2. Process each pending employee
    for (const employee of pendingEmployees.data) {
      // Approve employees with good ratings and complete profiles
      if (employee.rating >= 4.0 && employee.skills.length >= 3) {
        await updateEmployeeStatus(employee.id, "approved", "Profile meets all requirements");
        console.log(`Approved employee: ${employee.name}`);
      } else {
        await updateEmployeeStatus(employee.id, "rejected", "Profile needs improvement");
        console.log(`Rejected employee: ${employee.name}`);
      }
    }

    return pendingEmployees;
  } catch (error) {
    console.error("Failed to perform bulk employee management:", error);
    throw error;
  }
}

/**
 * Example: Employee performance tracking
 */
export async function exampleEmployeePerformanceTracking() {
  try {
    // 1. Get all approved employees
    const approvedEmployees = await getAllEmployeeDetails({
      status: "approved",
      sortBy: "rating",
      sortOrder: "desc",
    });

    // 2. Update ratings based on performance
    for (const employee of approvedEmployees.data) {
      // Simulate performance evaluation
      const newRating = Math.min(5.0, employee.rating + 0.1);
      
      if (newRating !== employee.rating) {
        await updateEmployeeRating(employee.id, newRating);
        console.log(`Updated rating for ${employee.name}: ${newRating}`);
      }
    }

    return approvedEmployees;
  } catch (error) {
    console.error("Failed to track employee performance:", error);
    throw error;
  }
}

// ============================================================================
// ERROR HANDLING EXAMPLES
// ============================================================================

/**
 * Example: Proper error handling for employee operations
 */
export async function exampleErrorHandling() {
  try {
    // Attempt to get employee details
    const details = await getMyEmployeeDetails();
    return details;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("404")) {
        console.error("Employee profile not found");
        // Redirect to profile creation
      } else if (error.message.includes("401")) {
        console.error("Unauthorized access");
        // Redirect to login
      } else if (error.message.includes("403")) {
        console.error("Insufficient permissions");
        // Show access denied message
      } else {
        console.error("Unexpected error:", error.message);
        // Show generic error message
      }
    }
    throw error;
  }
}

/**
 * Example: Validation before updating employee details
 */
export async function exampleValidationBeforeUpdate(updates: EmployeeDetailsUpdateInput) {
  try {
    // Validate required fields
    if (updates.email && !isValidEmail(updates.email)) {
      throw new Error("Invalid email format");
    }

    if (updates.phone && !isValidPhone(updates.phone)) {
      throw new Error("Invalid phone format");
    }

    if (updates.expectedSalary && updates.expectedSalary < 0) {
      throw new Error("Expected salary must be positive");
    }

    if (updates.level && !["Beginner", "Intermediate", "Expert"].includes(updates.level)) {
      throw new Error("Invalid experience level");
    }

    // Proceed with update if validation passes
    const result = await updateMyEmployeeDetails(updates);
    return result;
  } catch (error) {
    console.error("Validation or update failed:", error);
    throw error;
  }
}

// Helper validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}
