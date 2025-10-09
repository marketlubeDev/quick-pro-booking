# Employee Details API Documentation

This document provides comprehensive documentation for the Employee Details API, which allows for complete management of employee information including personal details, professional information, work experience, and administrative functions.

## Table of Contents

1. [Overview](#overview)
2. [Client-Side API](#client-side-api)
3. [Server-Side Endpoints](#server-side-endpoints)
4. [Data Types](#data-types)
5. [Usage Examples](#usage-examples)
6. [Error Handling](#error-handling)
7. [Authentication & Authorization](#authentication--authorization)

## Overview

The Employee Details API provides a comprehensive set of functions for managing employee information. It includes:

- **Personal Information Management**: Name, contact details, address, bio
- **Professional Information**: Designation, experience level, skills, salary expectations
- **Work Experience Management**: Add, update, delete work experience entries
- **Administrative Functions**: Status management, verification, rating updates
- **File Uploads**: Profile images and certificates
- **Search & Filtering**: Advanced filtering and pagination for employee lists

## Client-Side API

### Basic Employee Operations

#### `getMyEmployeeDetails()`
Get current user's employee profile details.

```typescript
const details = await getMyEmployeeDetails();
```

#### `updateMyEmployeeDetails(updates: EmployeeDetailsUpdateInput)`
Update current user's employee profile details.

```typescript
const updatedDetails = await updateMyEmployeeDetails({
  fullName: "John Doe",
  phone: "+1234567890",
  city: "New York",
  skills: ["Plumbing", "Electrical"]
});
```

### Admin Operations

#### `getEmployeeDetailsById(userId: string)`
Get employee details by user ID (admin only).

```typescript
const employee = await getEmployeeDetailsById("user123");
```

#### `getAllEmployeeDetails(filters?: EmployeeSearchFilters)`
Get all employee profiles with filtering and pagination (admin only).

```typescript
const employees = await getAllEmployeeDetails({
  status: "approved",
  level: "Expert",
  minRating: 4.0,
  page: 1,
  limit: 20
});
```

#### `updateEmployeeStatus(profileId: string, status: string, notes?: string)`
Update employee application status (admin only).

```typescript
await updateEmployeeStatus("profile123", "approved", "All requirements met");
```

#### `updateEmployeeRating(profileId: string, rating: number)`
Update employee rating (admin only).

```typescript
await updateEmployeeRating("profile123", 4.5);
```

#### `updateEmployeeVerification(profileId: string, verificationData)`
Update employee verification details (admin only).

```typescript
await updateEmployeeVerification("profile123", {
  verified: true,
  verificationStatus: "approved",
  verificationNotes: "Background check passed"
});
```

#### `updateEmployeeProfessionalDetails(profileId: string, professionalData)`
Update employee professional details (admin only).

```typescript
await updateEmployeeProfessionalDetails("profile123", {
  designation: "Senior Technician",
  level: "Expert",
  expectedSalary: 80000,
  skills: ["Plumbing", "Electrical", "HVAC"]
});
```

#### `updateEmployeePersonalDetails(profileId: string, personalData)`
Update employee personal details (admin only).

```typescript
await updateEmployeePersonalDetails("profile123", {
  fullName: "John Smith",
  email: "john@example.com",
  phone: "+1234567890",
  city: "Los Angeles"
});
```

### Work Experience Management

#### `addWorkExperience(workExperience)`
Add work experience to employee profile.

```typescript
await addWorkExperience({
  company: "ABC Construction",
  position: "Senior Technician",
  startDate: "2020-01-15",
  endDate: "2023-12-31",
  current: false,
  description: "Led team of 5 technicians",
  location: "New York, NY"
});
```

#### `updateWorkExperience(experienceId: string, updates)`
Update existing work experience entry.

```typescript
await updateWorkExperience("exp123", {
  position: "Lead Technician",
  current: true
});
```

#### `deleteWorkExperience(experienceId: string)`
Delete work experience entry.

```typescript
await deleteWorkExperience("exp123");
```

### Profile Management

#### `getProfileCompletion()`
Get profile completion status and missing fields.

```typescript
const completion = await getProfileCompletion();
// Returns: { completion: 85, missingFields: ["bio"], profileComplete: true }
```

#### `uploadProfileImage(file: File)`
Upload profile image.

```typescript
const result = await uploadProfileImage(imageFile);
// Returns: { avatarUrl: "path/to/image.jpg" }
```

#### `uploadCertificates(files: File[])`
Upload certificate files.

```typescript
const result = await uploadCertificates(certificateFiles);
// Returns: { certifications: [...] }
```

## Server-Side Endpoints

### Profile Routes (`/api/profile/`)

#### GET `/api/profile/`
Get current user's profile details.

#### PATCH `/api/profile/`
Update current user's profile details.

#### GET `/api/profile/completion`
Get profile completion status.

#### POST `/api/profile/upload-image`
Upload profile image.

#### POST `/api/profile/upload-certificates`
Upload certificate files.

### Work Experience Routes

#### POST `/api/profile/work-experience`
Add work experience entry.

#### PATCH `/api/profile/work-experience/:experienceId`
Update work experience entry.

#### DELETE `/api/profile/work-experience/:experienceId`
Delete work experience entry.

### Admin Routes (Require Admin Role)

#### GET `/api/profile/all`
Get all employee profiles with filtering and pagination.

**Query Parameters:**
- `status`: Filter by status (pending, approved, rejected)
- `level`: Filter by experience level (Beginner, Intermediate, Expert)
- `verified`: Filter by verification status (true/false)
- `city`: Filter by city (case-insensitive)
- `state`: Filter by state (case-insensitive)
- `skills`: Filter by skills (array)
- `minRating`: Minimum rating filter
- `maxRating`: Maximum rating filter
- `search`: Search in name, email, designation, city, state
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order (asc/desc, default: desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### GET `/api/profile/employee/:userId`
Get employee profile by user ID.

#### PATCH `/api/profile/:profileId/status`
Update employee application status.

#### PATCH `/api/profile/:profileId/rating`
Update employee rating.

#### PATCH `/api/profile/:profileId/verification`
Update employee verification details.

#### PATCH `/api/profile/:profileId/professional`
Update employee professional details.

#### PATCH `/api/profile/:profileId/personal`
Update employee personal details.

## Data Types

### EmployeeDetailsUpdateInput

```typescript
interface EmployeeDetailsUpdateInput {
  // Personal Information
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  bio?: string;

  // Professional Information
  designation?: string;
  level?: "Beginner" | "Intermediate" | "Expert";
  expectedSalary?: number;

  // Skills & Experience
  skills?: string[];
  workExperience?: WorkExperience[];

  // Verification fields (admin only)
  verified?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";
  verificationNotes?: string;
  rating?: number;
  totalJobs?: number;
}
```

### EmployeeSearchFilters

```typescript
interface EmployeeSearchFilters {
  status?: "pending" | "approved" | "rejected";
  level?: "Beginner" | "Intermediate" | "Expert";
  verified?: boolean;
  city?: string;
  state?: string;
  skills?: string[];
  minRating?: number;
  maxRating?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
```

### WorkExperience

```typescript
interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}
```

## Usage Examples

### Complete Employee Onboarding

```typescript
async function completeEmployeeOnboarding() {
  // 1. Update personal information
  await updateMyEmployeeDetails({
    fullName: "Jane Doe",
    phone: "+1234567890",
    city: "Chicago",
    state: "IL",
    bio: "Passionate professional with 3+ years experience"
  });

  // 2. Set professional details
  await updateMyEmployeeDetails({
    designation: "Technician",
    level: "Intermediate",
    expectedSalary: 60000,
    skills: ["Plumbing", "Basic Electrical", "Maintenance"]
  });

  // 3. Add work experience
  await addWorkExperience({
    company: "XYZ Services",
    position: "Junior Technician",
    startDate: "2021-06-01",
    endDate: "2023-05-31",
    current: false,
    description: "Provided maintenance and repair services",
    location: "Chicago, IL"
  });

  // 4. Check completion
  const completion = await getProfileCompletion();
  console.log("Profile completion:", completion.completion + "%");
}
```

### Admin Employee Management

```typescript
async function manageEmployees() {
  // Get all pending employees
  const pendingEmployees = await getAllEmployeeDetails({
    status: "pending",
    sortBy: "appliedDate",
    sortOrder: "asc"
  });

  // Process each employee
  for (const employee of pendingEmployees.data) {
    if (employee.rating >= 4.0 && employee.skills.length >= 3) {
      await updateEmployeeStatus(employee.id, "approved", "Profile meets requirements");
    } else {
      await updateEmployeeStatus(employee.id, "rejected", "Profile needs improvement");
    }
  }
}
```

### Advanced Employee Search

```typescript
async function searchEmployees() {
  const results = await getAllEmployeeDetails({
    status: "approved",
    level: "Expert",
    city: "New York",
    skills: ["Plumbing", "Electrical"],
    minRating: 4.0,
    search: "senior",
    sortBy: "rating",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });

  console.log(`Found ${results.total} employees`);
  console.log("Top employees:", results.data);
}
```

## Error Handling

The API includes comprehensive error handling:

```typescript
try {
  const details = await getMyEmployeeDetails();
  return details;
} catch (error) {
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
  throw error;
}
```

## Authentication & Authorization

### Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Authorization Levels

1. **Employee Level**: Can access their own profile data and update their own information
2. **Admin Level**: Can access all employee data and perform administrative functions

### Role-Based Access

- **Employee Operations**: Available to all authenticated users for their own profile
- **Admin Operations**: Require `admin` role
- **Work Experience**: Available to all authenticated users for their own profile
- **File Uploads**: Available to all authenticated users for their own profile

## Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## File Uploads

### Profile Image Upload
- **Endpoint**: `POST /api/profile/upload-image`
- **Field Name**: `profileImage`
- **Content-Type**: `multipart/form-data`
- **Max File Size**: Configured in server middleware

### Certificate Upload
- **Endpoint**: `POST /api/profile/upload-certificates`
- **Field Name**: `certificates`
- **Content-Type**: `multipart/form-data`
- **Max Files**: 10 files per request

## Validation Rules

### Personal Information
- **Email**: Must be valid email format
- **Phone**: Must be valid phone number format
- **Postal Code**: Must be valid postal code format

### Professional Information
- **Level**: Must be one of: "Beginner", "Intermediate", "Expert"
- **Expected Salary**: Must be positive number
- **Rating**: Must be between 0 and 5

### Work Experience
- **Company**: Required, non-empty string
- **Position**: Required, non-empty string
- **Start Date**: Required, valid date
- **End Date**: Optional, must be after start date if provided

## Rate Limiting

The API includes built-in rate limiting to prevent abuse:
- **Standard Endpoints**: 100 requests per minute per user
- **File Upload Endpoints**: 10 requests per minute per user
- **Admin Endpoints**: 200 requests per minute per admin

## Caching

Response caching is implemented for:
- **Employee Lists**: 5 minutes cache for filtered results
- **Profile Details**: 1 minute cache for individual profiles
- **Profile Completion**: 30 seconds cache

## Monitoring & Logging

The API includes comprehensive logging for:
- **Request/Response Logging**: All API calls are logged
- **Error Tracking**: Detailed error logging with stack traces
- **Performance Monitoring**: Response time tracking
- **Audit Trail**: All administrative actions are logged

## Security Considerations

1. **Input Validation**: All inputs are validated and sanitized
2. **SQL Injection Prevention**: Using parameterized queries
3. **XSS Protection**: Output encoding for all user-generated content
4. **CSRF Protection**: CSRF tokens for state-changing operations
5. **File Upload Security**: File type and size validation
6. **Rate Limiting**: Protection against brute force attacks

## Migration Notes

If upgrading from the previous API:

1. **Import Changes**: Update imports to use the new API module
2. **Function Names**: Some function names have changed for consistency
3. **Response Format**: Response format remains the same
4. **Error Handling**: Enhanced error messages and status codes
5. **New Features**: Additional filtering and pagination options

## Support

For technical support or questions about the Employee Details API:

1. Check the example file: `src/examples/employeeDetailsApiExample.ts`
2. Review the server-side implementation in `controllers/profileController.js`
3. Check the route definitions in `routes/profile.js`
4. Contact the development team for additional assistance
