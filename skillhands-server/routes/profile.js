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

// Admin-only routes for employee management
router.get("/all", requireRole("admin"), getAllEmployeeProfiles);
router.get("/employee/:userId", requireRole("admin"), getEmployeeProfileById);
router.patch("/:profileId/status", requireRole("admin"), updateEmployeeStatus);
router.patch("/:profileId/rating", requireRole("admin"), updateEmployeeRating);
router.patch("/:profileId/verification", requireRole("admin"), updateEmployeeVerification);
router.patch("/:profileId/professional", requireRole("admin"), updateEmployeeProfessionalDetails);
router.patch("/:profileId/personal", requireRole("admin"), updateEmployeePersonalDetails);

export default router;
