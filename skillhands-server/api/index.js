import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { applySecurity } from "../middleware/security.js";
import { applyCors } from "../middleware/cors.js";
import { multerErrorHandler } from "../middleware/uploads.js";
import { errorHandler, notFound } from "../middleware/errors.js";
import apiRoutes from "../routes/index.js";
import { connectDatabase } from "../config/db.js";
import { seedAdminUser } from "../utils/seedAdmin.js";
import {
  validateEnvironment,
  validateEmailConfig,
  validateDatabaseConfig,
} from "../utils/validateEnv.js";

// Load environment variables
dotenv.config();

// Validate environment variables (non-blocking in production)
if (process.env.NODE_ENV === "production") {
  console.log("🔍 Validating environment configuration...");
  try {
    validateEnvironment();
    validateEmailConfig();
    validateDatabaseConfig();
  } catch (error) {
    console.warn("⚠️ Environment validation warning:", error.message);
    // Don't fail the entire function for missing optional env vars
  }
}

const app = express();

// Security middleware
applySecurity(app);

// CORS - Use the advanced CORS configuration
applyCors(app);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection - only connect when needed in serverless
if (process.env.NODE_ENV !== "production") {
  connectDatabase().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to MongoDB:", err);
  });

  // Seed admin user (best-effort) - only in development
  connectDatabase()
    .then(() => seedAdminUser())
    .catch(() => {});
}

// Routes that don't require database connection
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// Additional debug endpoint
app.get("/api/debug", (req, res) => {
  res.json({
    success: true,
    message: "Debug endpoint",
    headers: {
      origin: req.headers.origin,
      userAgent: req.headers["user-agent"],
      authorization: req.headers.authorization ? "Present" : "Not present",
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health check routes that bypass database middleware
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/ping", (req, res) => {
  res.json({
    status: "OK",
    message: "Pong",
    timestamp: new Date().toISOString(),
  });
});

// Database connection middleware for production (serverless)
if (process.env.NODE_ENV === "production") {
  app.use("/api", async (req, res, next) => {
    // Skip database connection for health checks and non-db routes
    if (
      req.path === "/health" ||
      req.path === "/ping" ||
      req.path === "/cors-test" ||
      req.path === "/debug"
    ) {
      return next();
    }

    try {
      await connectDatabase();
      next();
    } catch (error) {
      console.error("Database connection failed:", error);
      // Return a more graceful error response
      res.status(503).json({
        success: false,
        message:
          "Service temporarily unavailable. Please try again in a moment.",
        error: "Database connection failed",
        retryAfter: 5, // seconds
      });
    }
  });
}

app.use("/api", apiRoutes);

// Multer error handling and general errors
app.use(multerErrorHandler);
app.use(errorHandler);

// 404 handler
app.use("*", notFound);

export default app;
