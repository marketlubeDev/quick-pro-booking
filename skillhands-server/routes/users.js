import express from "express";
import { 
  listUsers, 
  updateUserRole, 
  getEmployees,
  getCustomerDetails,
  updateCustomerDetails,
  getAllCustomers,
  deleteCustomer
} from "../controllers/usersController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateCustomerUpdate, validateCustomerQuery } from "../middleware/validation.js";

const router = express.Router();

// Public endpoint for getting employees (no auth required)
router.get("/employees", getEmployees);

// Admin-only routes
router.use(requireAuth, requireRole("admin"));

// Existing routes
router.get("/", listUsers);
router.patch("/:userId/role", updateUserRole);

// New customer management routes
router.get("/customers", validateCustomerQuery, getAllCustomers);
router.get("/customers/:userId", getCustomerDetails);
router.put("/customers/:userId", validateCustomerUpdate, updateCustomerDetails);
router.delete("/customers/:userId", deleteCustomer);

export default router;
