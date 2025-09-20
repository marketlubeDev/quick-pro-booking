# Employee Job Management System

This document describes the enhanced job management functionality for employees in the SkillHand platform.

## Features

### 1. Dynamic Job Listing
- **Real-time data**: Jobs are fetched from the API instead of using mock data
- **Tabbed interface**: Jobs are organized into tabs (All, Pending, In Progress, Completed)
- **Status indicators**: Visual indicators show job status and progress
- **Responsive design**: Works on all device sizes

### 2. Job Actions
- **View Details**: Click "View Details" to see full job information
- **Accept Job**: Accept pending jobs to start working on them
- **Mark Complete**: Mark jobs as completed with optional completion notes
- **Add Remarks**: Add notes and remarks throughout the job lifecycle

### 3. Job Detail Modal
- **Comprehensive view**: Shows all job information including customer details, location, scheduling
- **Action buttons**: Accept, complete, and add remarks directly from the modal
- **Real-time updates**: Changes are reflected immediately in the UI

## API Endpoints

### Employee Job Management
- `GET /api/service-requests/employee/:employeeId` - Get jobs assigned to an employee
- `POST /api/service-requests/:id/accept` - Accept a job
- `POST /api/service-requests/:id/complete` - Mark job as completed
- `POST /api/service-requests/:id/remarks` - Add remarks to a job
- `POST /api/service-requests/:id/assign` - Assign job to employee (admin use)

### Request/Response Examples

#### Get Employee Jobs
```javascript
GET /api/service-requests/employee/EMPLOYEE_ID
Response: {
  "success": true,
  "data": [
    {
      "_id": "job_id",
      "service": "Plumbing",
      "description": "Fix kitchen sink leak",
      "status": "pending",
      "assignedEmployee": "employee_id",
      "employeeAccepted": false,
      "address": "123 Main St",
      "scheduledDate": "2025-01-15",
      "scheduledTime": "10:00 AM",
      "estimatedCost": 150
    }
  ]
}
```

#### Accept Job
```javascript
POST /api/service-requests/job_id/accept
Body: { "employeeId": "employee_id" }
Response: {
  "success": true,
  "data": { /* updated job object */ }
}
```

## Database Schema Updates

The `ServiceRequest` model has been enhanced with employee management fields:

```javascript
{
  // ... existing fields
  assignedEmployee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Profile',
    default: null 
  },
  employeeAccepted: { type: Boolean, default: false },
  employeeAcceptedAt: { type: Date, default: null },
  employeeRemarks: { type: String, trim: true, default: "" },
  completedAt: { type: Date, default: null },
  completionNotes: { type: String, trim: true, default: "" },
}
```

## Usage

### For Employees
1. Navigate to the Jobs page in the employee dashboard
2. View all assigned jobs in the tabbed interface
3. Click "View Details" to see full job information
4. Accept pending jobs to start working on them
5. Add remarks as you work on the job
6. Mark jobs as complete when finished

### For Administrators
1. Use the assign endpoint to assign jobs to employees
2. Monitor job progress through the admin dashboard
3. View employee remarks and completion notes

## Components

### `Jobs.tsx`
Main component that displays the job listing with tabs and filtering.

### `JobDetailModal.tsx`
Modal component for viewing detailed job information and performing actions.

### `useEmployeeJobs.ts`
Custom hook that manages job data fetching and actions.

### `api.employeeJobs.ts`
API service functions for job management operations.

## Error Handling

- Network errors are handled gracefully with retry options
- User-friendly error messages are displayed via toast notifications
- Loading states provide feedback during API operations
- Form validation prevents invalid submissions

## Future Enhancements

- Real-time notifications for new job assignments
- File upload for job completion photos
- GPS tracking for job locations
- Time tracking for job duration
- Customer rating and feedback system
