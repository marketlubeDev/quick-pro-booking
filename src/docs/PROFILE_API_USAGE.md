# Profile API Usage Guide

This guide explains how to use the profile API endpoints and React hooks in the SkillHand application.

## API Endpoints

The following profile endpoints are available:

| Method | Endpoint                           | Description                   |
| ------ | ---------------------------------- | ----------------------------- |
| GET    | `/api/profile/`                    | Get user profile              |
| PATCH  | `/api/profile/`                    | Update profile data           |
| GET    | `/api/profile/completion`          | Get profile completion status |
| POST   | `/api/profile/upload-image`        | Upload profile image          |
| POST   | `/api/profile/upload-certificates` | Upload certificate files      |

## React Hooks

### useProfile Hook

The `useProfile` hook provides comprehensive profile management functionality.

```typescript
import { useProfile } from "@/hooks/useProfile";

const MyComponent = () => {
  const {
    profile, // Current profile data
    profileCompletion, // Profile completion status
    loading, // Loading state
    error, // Error message
    updateProfile, // Function to update profile
    uploadProfileImage, // Function to upload profile image
    uploadCertificates, // Function to upload certificates
    refreshProfile, // Function to refresh profile data
    refreshCompletion, // Function to refresh completion status
  } = useProfile();

  // Example: Update profile
  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      fullName: "John Doe",
      phone: "+1234567890",
      city: "New York",
    });

    if (success) {
      console.log("Profile updated successfully");
    }
  };

  // Example: Upload profile image
  const handleImageUpload = async (file: File) => {
    const success = await uploadProfileImage(file);
    if (success) {
      console.log("Image uploaded successfully");
    }
  };

  // Example: Upload certificates
  const handleCertificateUpload = async (files: File[]) => {
    const success = await uploadCertificates(files);
    if (success) {
      console.log("Certificates uploaded successfully");
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {profile && (
        <div>
          <h1>{profile.fullName}</h1>
          <p>{profile.email}</p>
          <p>Completion: {profileCompletion?.completion}%</p>
        </div>
      )}
    </div>
  );
};
```

### useProfileCompletion Hook

The `useProfileCompletion` hook provides profile completion status functionality.

```typescript
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

const MyComponent = () => {
  const {
    completion, // Profile completion data
    loading, // Loading state
    error, // Error message
    refresh, // Function to refresh completion data
  } = useProfileCompletion();

  return (
    <div>
      {loading && <p>Loading completion status...</p>}
      {completion && (
        <div>
          <p>Profile Completion: {completion.completion}%</p>
          <p>Missing Fields: {completion.missingFields.join(", ")}</p>
          <p>Profile Complete: {completion.profileComplete ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};
```

## Data Types

### EmployeeProfileData

```typescript
interface EmployeeProfileData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  avatarUrl?: string;
  bio?: string;
  level?: "Beginner" | "Intermediate" | "Expert";
  status?: "pending" | "approved" | "rejected";
  verified?: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  verificationNotes?: string;
  rating?: number;
  totalJobs?: number;
  skills?: string[];
  certifications?: Certification[];
  workExperience?: WorkExperience[];
  expectedSalary?: number;
  profileComplete?: boolean;
  lastUpdated?: string;
  appliedDate?: string;
}
```

### ProfileCompletionData

```typescript
interface ProfileCompletionData {
  completion: number; // Percentage (0-100)
  missingFields: string[]; // Array of missing field names
  profileComplete: boolean; // Whether profile is considered complete
}
```

### Certification

```typescript
interface Certification {
  name: string; // Certificate name
  fileUrl: string; // URL to certificate file
  uploadedAt: string; // ISO date string
}
```

### WorkExperience

```typescript
interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  current: boolean;
  description: string;
  location?: string;
}
```

## Example Components

### ProfileCompletionBadge

A reusable component that displays profile completion status:

```typescript
import { ProfileCompletionBadge } from "@/components/ProfileCompletionBadge";

const MyComponent = () => {
  return (
    <div>
      <h1>My Profile</h1>
      <ProfileCompletionBadge className="mb-4" />
      {/* Rest of your component */}
    </div>
  );
};
```

## Error Handling

All hooks include built-in error handling and will display toast notifications for user feedback. The hooks return boolean values for async operations to indicate success/failure.

## Authentication

All profile API calls require authentication. The hooks automatically include the auth token from localStorage in API requests.

## File Uploads

For file uploads (profile images and certificates), the hooks handle FormData creation and proper headers automatically.

## Best Practices

1. **Use the hooks**: Always use the provided hooks instead of calling the API directly
2. **Handle loading states**: Check the `loading` state before showing data
3. **Handle errors**: Always check for and display errors appropriately
4. **Refresh data**: Use the refresh functions when needed to get the latest data
5. **Type safety**: Use the provided TypeScript interfaces for type safety
