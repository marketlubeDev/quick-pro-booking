import express from "express";
import { upload } from "../middleware/uploads.js";
import { submitContact } from "../controllers/contactController.js";
import serviceRequestsRouter from "./serviceRequests.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import profileRouter from "./profile.js";
import dashboardRouter from "./dashboard.js";
import reportsRouter from "./reports.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check that doesn't require database
router.get("/ping", (req, res) => {
  res.json({
    status: "OK",
    message: "Pong",
    timestamp: new Date().toISOString(),
  });
});

router.post("/contact", upload.single("image"), submitContact);

router.use("/service-requests", serviceRequestsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/profile", profileRouter);
router.use("/dashboard", dashboardRouter);
router.use("/reports", reportsRouter);

export default router;
