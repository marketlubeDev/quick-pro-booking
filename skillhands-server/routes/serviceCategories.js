import express from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/serviceCategoryController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public: list all categories (could be used by customer pages)
router.get("/", listCategories);

// Admin-only CRUD
router.use(requireAuth, requireRole("admin"));
router.post("/", createCategory);
router.put("/:categoryId", updateCategory);
router.delete("/:categoryId", deleteCategory);

export default router;
