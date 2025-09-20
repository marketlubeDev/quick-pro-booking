import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getReportsData,
  getServiceRequests,
  getEmployeePerformance,
  exportReports,
} from "../controllers/reportsController.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get reports data
router.get("/", getReportsData);

// Get service requests for reports
router.get("/service-requests", getServiceRequests);

// Get employee performance data
router.get("/employee-performance", getEmployeePerformance);

// Export reports
router.get("/export", exportReports);

export default router;
