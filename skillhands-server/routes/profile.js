import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  uploadCertificates,
  getProfileCompletion,
  getAllEmployeeProfiles,
  getEmployeeProfileById,
  updateEmployeeStatus,
  updateEmployeeRating,
  updateEmployeeVerification,
  updateEmployeeProfessionalDetails,
  updateEmployeePersonalDetails,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addQualification,
  updateQualification,
  deleteQualification,
  addEmployeeWorkExperience,
  updateEmployeeWorkExperience,
  deleteEmployeeWorkExperience,
  addEmployeeQualification,
  updateEmployeeQualification,
  deleteEmployeeQualification,
} from "../controllers/profileController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/uploads.js";

const router = express.Router();

router.use(requireAuth);

// Basic profile operations
router.get("/", getMyProfile);
router.patch("/", updateMyProfile);
router.get("/completion", getProfileCompletion);

// File upload operations
router.post("/upload-image", upload.single("profileImage"), uploadProfileImage);
router.post(
  "/upload-certificates",
  upload.array("certificates", 10),
  uploadCertificates
);

// Work experience routes
router.post("/work-experience", addWorkExperience);
router.patch("/work-experience/:experienceId", updateWorkExperience);
router.delete("/work-experience/:experienceId", deleteWorkExperience);

// Qualification routes
router.post("/qualification", addQualification);
router.patch("/qualification/:qualificationId", updateQualification);
router.delete("/qualification/:qualificationId", deleteQualification);

// Admin-only routes for employee management
router.get("/all", requireRole("admin"), getAllEmployeeProfiles);
router.get("/employee/:userId", requireRole("admin"), getEmployeeProfileById);
router.patch("/:profileId/status", requireRole("admin"), updateEmployeeStatus);
router.patch("/:profileId/rating", requireRole("admin"), updateEmployeeRating);
router.patch("/:profileId/verification", requireRole("admin"), updateEmployeeVerification);
router.patch("/:profileId/professional", requireRole("admin"), updateEmployeeProfessionalDetails);
router.patch("/:profileId/personal", requireRole("admin"), updateEmployeePersonalDetails);

// Admin-only routes for work experience management
router.post("/:profileId/work-experience", requireRole("admin"), addEmployeeWorkExperience);
router.patch("/:profileId/work-experience/:experienceId", requireRole("admin"), updateEmployeeWorkExperience);
router.delete("/:profileId/work-experience/:experienceId", requireRole("admin"), deleteEmployeeWorkExperience);

// Admin-only routes for qualification management
router.post("/:profileId/qualification", requireRole("admin"), addEmployeeQualification);
router.patch("/:profileId/qualification/:qualificationId", requireRole("admin"), updateEmployeeQualification);
router.delete("/:profileId/qualification/:qualificationId", requireRole("admin"), deleteEmployeeQualification);

export default router;
