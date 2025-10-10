# Customer Management API Documentation

## Overview
This document describes the customer management API endpoints that allow admins to view, edit, and manage customer details.

## Authentication
All endpoints require admin authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Get All Customers
**GET** `/api/users/customers`

Retrieves a paginated list of all customers with their profiles.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `role` (optional): Filter by role ("admin" or "employee")
- `status` (optional): Filter by profile status ("pending", "approved", "rejected")
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "employee",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "profile": {
        "_id": "profile_id",
        "fullName": "John Doe",
        "phone": "+1234567890",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "skills": ["JavaScript", "React"],
        "status": "approved"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Get Customer Details
**GET** `/api/users/customers/:userId`

Retrieves detailed information for a specific customer.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "profile": {
      "_id": "profile_id",
      "fullName": "John Doe",
      "phone": "+1234567890",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "country": "USA",
      "bio": "Experienced developer",
      "designation": ["Frontend Developer"],
      "level": "Expert",
      "expectedSalary": 80000,
      "workingZipCodes": ["10001", "10002"],
      "workingCities": ["New York", "Brooklyn"],
      "skills": ["JavaScript", "React", "Node.js"],
      "workExperience": [
        {
          "company": "Tech Corp",
          "position": "Senior Developer",
          "startDate": "2020-01-01T00:00:00.000Z",
          "endDate": "2023-12-31T00:00:00.000Z",
          "current": false,
          "description": "Led frontend development team",
          "location": "New York, NY"
        }
      ],
      "certifications": [
        {
          "name": "AWS Certified Developer",
          "fileUrl": "https://example.com/cert.pdf",
          "uploadedAt": "2023-06-01T00:00:00.000Z"
        }
      ],
      "verified": true,
      "verificationStatus": "approved",
      "verificationNotes": "All documents verified",
      "status": "approved",
      "rating": 4.5,
      "totalJobs": 25
    }
  }
}
```

### 3. Update Customer Details
**PUT** `/api/users/customers/:userId`

Updates customer information including both user and profile data.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "isActive": true,
  "fullName": "John Doe Updated",
  "phone": "+1234567890",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "country": "USA",
  "bio": "Updated bio",
  "designation": ["Senior Frontend Developer"],
  "level": "Expert",
  "expectedSalary": 90000,
  "workingZipCodes": ["10001", "10002", "10003"],
  "workingCities": ["New York", "Brooklyn", "Queens"],
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "verified": true,
  "verificationStatus": "approved",
  "verificationNotes": "Updated verification notes",
  "status": "approved",
  "rating": 4.8,
  "totalJobs": 30,
  "workExperience": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "startDate": "2020-01-01T00:00:00.000Z",
      "endDate": "2023-12-31T00:00:00.000Z",
      "current": false,
      "description": "Led frontend development team",
      "location": "New York, NY"
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Developer",
      "fileUrl": "https://example.com/cert.pdf",
      "uploadedAt": "2023-06-01T00:00:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer details updated successfully",
  "data": {
    "user": { /* updated user object */ },
    "profile": { /* updated profile object */ }
  }
}
```

### 4. Delete Customer
**DELETE** `/api/users/customers/:userId`

Deletes a customer and their associated profile. Cannot delete admin users.

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

## Validation Rules

### User Fields
- `name`: String (optional)
- `email`: Valid email format, must be unique
- `isActive`: Boolean

### Profile Fields
- `fullName`: String (optional)
- `email`: Valid email format (optional)
- `phone`: Valid phone number format (optional)
- `city`, `state`, `country`: String (optional)
- `addressLine1`, `addressLine2`: String (optional)
- `postalCode`: US postal code format (12345 or 12345-6789)
- `bio`: String (optional)
- `designation`: Array of strings (optional)
- `level`: Must be "Beginner", "Intermediate", or "Expert"
- `expectedSalary`: Positive number (optional)
- `workingZipCodes`: Array of strings (optional)
- `workingCities`: Array of strings (optional)
- `skills`: Array of strings (optional)
- `verified`: Boolean (optional)
- `verificationStatus`: Must be "pending", "approved", or "rejected"
- `verificationNotes`: String (optional)
- `status`: Must be "pending", "approved", or "rejected"
- `rating`: Number between 0 and 5 (optional)
- `totalJobs`: Non-negative number (optional)

### Work Experience
- `company`: Required string
- `position`: Required string
- `startDate`: Required date
- `endDate`: Optional date (must be after startDate if provided)
- `current`: Boolean (optional)
- `description`: String (optional)
- `location`: String (optional)

### Certifications
- `name`: Required string
- `fileUrl`: String (optional)
- `uploadedAt`: Date (optional)

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": ["Invalid email format", "Rating must be between 0 and 5"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Customer not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already in use by another user"
}
```

## Usage Examples

### Get all customers with pagination
```bash
curl -X GET "http://localhost:3000/api/users/customers?page=1&limit=10" \
  -H "Authorization: Bearer your-jwt-token"
```

### Search customers by name
```bash
curl -X GET "http://localhost:3000/api/users/customers?search=john" \
  -H "Authorization: Bearer your-jwt-token"
```

### Filter by role and status
```bash
curl -X GET "http://localhost:3000/api/users/customers?role=employee&status=approved" \
  -H "Authorization: Bearer your-jwt-token"
```

### Update customer details
```bash
curl -X PUT "http://localhost:3000/api/users/customers/user_id" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "city": "Los Angeles",
    "state": "CA",
    "skills": ["JavaScript", "React", "Vue.js"]
  }'
```

### Delete customer
```bash
curl -X DELETE "http://localhost:3000/api/users/customers/user_id" \
  -H "Authorization: Bearer your-jwt-token"
```
