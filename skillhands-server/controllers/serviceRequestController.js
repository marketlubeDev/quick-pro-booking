import ServiceRequest from "../models/ServiceRequest.js";
import {
  sendEmail,
  sendScheduleConfirmationEmail,
  sendServiceCompletionEmail,
  sendServiceRejectionEmail,
} from "../services/emailService.js";

export const createServiceRequest = async (req, res) => {
  try {
    const {
      service,
      description,
      preferredDate,
      preferredTime,
      name,
      phone,
      email,
      address,
      city,
      state,
      zip,
      assignedEmployee,
      serviceCategory,
      urgency,
      customerNotes,
      estimatedCost,
      estimatedDuration,
      source,
      tags,
      isRecurring,
      recurringPattern,
    } = req.body || {};

    if (!service || !name || !phone || !address || !city || !state || !zip) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let attachment;
    if (req.file) {
      attachment = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: req.file.path || req.file.location, // Add URL for file access
      };
    }

    // Auto-determine urgency based on preferred time
    let autoUrgency = urgency || "routine";
    if (preferredTime && preferredTime.toLowerCase().includes("emergency")) {
      autoUrgency = "emergency";
    } else if (preferredTime && (preferredTime.toLowerCase().includes("asap") || preferredTime.toLowerCase().includes("urgent"))) {
      autoUrgency = "urgent";
    }

    const doc = await ServiceRequest.create({
      service,
      description,
      preferredDate,
      preferredTime,
      name,
      phone,
      email,
      address,
      city,
      state,
      zip,
      attachment,
      assignedEmployee: assignedEmployee || null,
      serviceCategory: serviceCategory || "other",
      urgency: autoUrgency,
      customerNotes: customerNotes || "",
      estimatedCost: estimatedCost || 0,
      estimatedDuration: estimatedDuration || 0,
      source: source || "website",
      tags: tags || [],
      isRecurring: isRecurring || false,
      recurringPattern: recurringPattern || null,
    });

    // Fire-and-forget email notification; do not block response if email fails
    try {
      await sendEmail({
        service,
        description,
        preferredDate,
        preferredTime,
        name,
        phone,
        email,
        address,
        city,
        zip,
        fileData: req.file,
      });
    } catch (emailError) {
      // eslint-disable-next-line no-console
      console.error("createServiceRequest email error:", emailError);
    }

    return res.status(201).json({ success: true, data: doc });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("createServiceRequest error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create request" });
  }
};

export const listServiceRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      serviceCategory,
      urgency,
      assignedEmployee,
      source,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      dateFrom,
      dateTo,
    } = req.query;

    const query = {};

    // Basic filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (serviceCategory) query.serviceCategory = serviceCategory;
    if (urgency) query.urgency = urgency;
    if (assignedEmployee) query.assignedEmployee = assignedEmployee;
    if (source) query.source = source;

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const docs = await ServiceRequest.find(query)
      .populate("assignedEmployee", "fullName email phone")
      .populate("lastUpdatedBy", "name email")
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await ServiceRequest.countDocuments(query);

    // Calculate status counts for paginated response
    const countsByStatus = await ServiceRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {};
    countsByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    // Calculate additional analytics
    const analytics = await ServiceRequest.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$estimatedCost" },
          avgCost: { $avg: "$estimatedCost" },
          totalDuration: { $sum: "$estimatedDuration" },
          avgDuration: { $avg: "$estimatedDuration" },
          urgentCount: {
            $sum: { $cond: [{ $eq: ["$urgency", "urgent"] }, 1, 0] },
          },
          emergencyCount: {
            $sum: { $cond: [{ $eq: ["$urgency", "emergency"] }, 1, 0] },
          },
        },
      },
    ]);

    return res.json({
      success: true,
      data: docs,
      total,
      page: Number(page),
      limit: Number(limit),
      countsByStatus: statusCounts,
      analytics: analytics[0] || {
        totalCost: 0,
        avgCost: 0,
        totalDuration: 0,
        avgDuration: 0,
        urgentCount: 0,
        emergencyCount: 0,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("listServiceRequests error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to list requests" });
  }
};

export const getServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ServiceRequest.findById(id)
      .populate("assignedEmployee", "fullName email phone")
      .populate("lastUpdatedBy", "name email");
    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
};

export const updateServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (req.file) {
      updates.attachment = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    // Auto-determine urgency based on preferred time if it's being updated
    if (updates.preferredTime) {
      let autoUrgency = updates.urgency || "routine";
      if (updates.preferredTime.toLowerCase().includes("emergency")) {
        autoUrgency = "emergency";
      } else if (updates.preferredTime.toLowerCase().includes("asap") || updates.preferredTime.toLowerCase().includes("urgent")) {
        autoUrgency = "urgent";
      }
      updates.urgency = autoUrgency;
    }

    const previous = await ServiceRequest.findById(id);
    const doc = await ServiceRequest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("assignedEmployee", "fullName email phone");

    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });

    // Send schedule confirmation if scheduledDate changed
    try {
      const before = previous?.scheduledDate || null;
      const after = doc?.scheduledDate || null;
      const changed = (before || after) && String(before) !== String(after);

      if (changed && doc.email) {
        await sendScheduleConfirmationEmail({
          to: doc.email,
          name: doc.name || doc.customerName,
          service: doc.service || doc.serviceType,
          scheduledDateISO: after,
          address: doc.address,
          city: doc.city,
          state: doc.state,
          zip: doc.zip,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("schedule confirmation email error:", e);
    }

    // Send completion notification if status changed to completed
    try {
      const statusChangedToCompleted =
        previous?.status !== "completed" && doc?.status === "completed";

      if (statusChangedToCompleted && doc.email) {
        await sendServiceCompletionEmail({
          to: doc.email,
          name: doc.name || doc.customerName,
          service: doc.service || doc.serviceType,
          completedAt: doc.completedAt || new Date(),
          address: doc.address,
          city: doc.city,
          state: doc.state,
          zip: doc.zip,
          assignedEmployee: doc.assignedEmployee?.fullName || null,
          completionNotes: doc.completionNotes || null,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("completion notification email error:", e);
    }

    // Send rejection notification if status changed to rejected
    try {
      const statusChangedToRejected =
        previous?.status !== "rejected" && doc?.status === "rejected";

      if (statusChangedToRejected && doc.email) {
        await sendServiceRejectionEmail({
          to: doc.email,
          name: doc.name || doc.customerName,
          service: doc.service || doc.serviceType,
          rejectionReason: doc.rejectionReason || "No specific reason provided",
          address: doc.address,
          city: doc.city,
          state: doc.state,
          zip: doc.zip,
          requestId: doc._id,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("rejection notification email error:", e);
    }

    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
};

export const deleteServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ServiceRequest.findByIdAndDelete(id);
    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
};

export const getServiceRequestsSummary = async (req, res) => {
  try {
    const total = await ServiceRequest.countDocuments();

    const countsByStatus = await ServiceRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {};
    countsByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    return res.json({
      success: true,
      total,
      countsByStatus: statusCounts,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getServiceRequestsSummary error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get summary" });
  }
};

// Employee job management endpoints
export const getEmployeeJobs = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.query;

    // First, find the profile for this user
    const Profile = (await import("../models/Profile.js")).default;
    const profile = await Profile.findOne({ user: employeeId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    // Use the profile ID to query jobs
    const query = { assignedEmployee: profile._id };
    if (status) query.status = status;

    const jobs = await ServiceRequest.find(query)
      .populate("assignedEmployee", "fullName email phone")
      .sort({ createdAt: -1 });

    console.log("=== DEBUG: getEmployeeJobs ===");
    console.log("Employee ID:", employeeId);
    console.log("Profile ID:", profile._id);
    console.log("Query:", query);
    console.log("Found jobs count:", jobs.length);
    console.log(
      "Jobs data:",
      jobs.map((job) => ({
        id: job._id,
        status: job.status,
        employeeAccepted: job.employeeAccepted,
        service: job.service,
      }))
    );

    return res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("getEmployeeJobs error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch employee jobs" });
  }
};

export const acceptJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    // First, find the profile for this user
    const Profile = (await import("../models/Profile.js")).default;
    const profile = await Profile.findOne({ user: employeeId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.assignedEmployee.toString() !== profile._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to accept this job" });
    }

    if (job.employeeAccepted) {
      return res
        .status(400)
        .json({ success: false, message: "Job already accepted" });
    }

    job.employeeAccepted = true;
    job.employeeAcceptedAt = new Date();
    job.status = "in-process";

    await job.save();

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("acceptJob error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to accept job" });
  }
};

export const markJobAsDone = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, completionNotes } = req.body;

    // First, find the profile for this user
    const Profile = (await import("../models/Profile.js")).default;
    const profile = await Profile.findOne({ user: employeeId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.assignedEmployee.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this job as done",
      });
    }

    if (job.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Job is already completed",
      });
    }

    if (job.status !== "in-process") {
      return res.status(400).json({
        success: false,
        message:
          "Job must be approved by admin before it can be marked as done",
      });
    }

    // Mark job as done - set status to completed and add completion details
    job.status = "completed";
    job.completedAt = new Date();
    job.employeeAccepted = true; // Ensure this is set if not already
    job.employeeAcceptedAt = job.employeeAcceptedAt || new Date();

    if (completionNotes) {
      job.completionNotes = completionNotes;
    }

    await job.save();

    // Update employee's total jobs count
    profile.totalJobs = (profile.totalJobs || 0) + 1;
    await profile.save();

    // Send completion notification to customer
    try {
      if (job.email) {
        await sendServiceCompletionEmail({
          to: job.email,
          name: job.name || job.customerName,
          service: job.service || job.serviceType,
          completedAt: job.completedAt,
          address: job.address,
          city: job.city,
          state: job.state,
          zip: job.zip,
          assignedEmployee: profile.fullName,
          completionNotes: job.completionNotes || null,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("completion notification email error:", e);
    }

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("markJobAsDone error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to mark job as done" });
  }
};

export const completeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, completionNotes } = req.body;

    // First, find the profile for this user
    const Profile = (await import("../models/Profile.js")).default;
    const profile = await Profile.findOne({ user: employeeId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.assignedEmployee.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this job",
      });
    }

    if (!job.employeeAccepted) {
      return res.status(400).json({
        success: false,
        message: "Job must be accepted before completion",
      });
    }

    job.status = "completed";
    job.completedAt = new Date();
    if (completionNotes) {
      job.completionNotes = completionNotes;
    }

    await job.save();

    // Update employee's total jobs count
    profile.totalJobs = (profile.totalJobs || 0) + 1;
    await profile.save();

    // Send completion notification to customer
    try {
      if (job.email) {
        await sendServiceCompletionEmail({
          to: job.email,
          name: job.name || job.customerName,
          service: job.service || job.serviceType,
          completedAt: job.completedAt,
          address: job.address,
          city: job.city,
          state: job.state,
          zip: job.zip,
          assignedEmployee: profile.fullName,
          completionNotes: job.completionNotes || null,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("completion notification email error:", e);
    }

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("completeJob error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to complete job" });
  }
};

export const addJobRemarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, remarks } = req.body;

    // First, find the profile for this user
    const Profile = (await import("../models/Profile.js")).default;
    const profile = await Profile.findOne({ user: employeeId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.assignedEmployee.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add remarks to this job",
      });
    }

    job.employeeRemarks = remarks;
    await job.save();

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("addJobRemarks error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add remarks" });
  }
};

// Utility function to assign jobs to employees (for testing/admin use)
export const assignJobToEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.assignedEmployee = employeeId;
    job.status = "pending"; // Reset to pending for employee acceptance
    await job.save();

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("assignJobToEmployee error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to assign job" });
  }
};

// Update assigned employee for a service request
export const updateAssignedEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedEmployee } = req.body;

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Service request not found" });
    }

    job.assignedEmployee = assignedEmployee || null;
    await job.save();

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("updateAssignedEmployee error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update assigned employee" });
  }
};

// Add customer rating and feedback
export const addCustomerRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    job.customerRating = rating;
    if (feedback) job.customerFeedback = feedback;
    await job.save();

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("addCustomerRating error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add customer rating" });
  }
};

// Update admin notes
export const updateAdminNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes, lastUpdatedBy } = req.body;

    const job = await ServiceRequest.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    job.adminNotes = adminNotes || "";
    if (lastUpdatedBy) job.lastUpdatedBy = lastUpdatedBy;
    await job.save();

    return res.json({ success: true, data: job });
  } catch (error) {
    console.error("updateAdminNotes error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update admin notes" });
  }
};

// Get analytics and statistics
export const getServiceRequestAnalytics = async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const analytics = await ServiceRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalCost: { $sum: "$estimatedCost" },
          avgCost: { $avg: "$estimatedCost" },
          totalDuration: { $sum: "$estimatedDuration" },
          avgDuration: { $avg: "$estimatedDuration" },
          completedRequests: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          urgentRequests: {
            $sum: { $cond: [{ $eq: ["$urgency", "urgent"] }, 1, 0] },
          },
          emergencyRequests: {
            $sum: { $cond: [{ $eq: ["$urgency", "emergency"] }, 1, 0] },
          },
          avgRating: { $avg: "$customerRating" },
        },
      },
    ]);

    // Get status distribution
    const statusDistribution = await ServiceRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get service category distribution
    const categoryDistribution = await ServiceRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$serviceCategory",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get monthly trends
    const monthlyTrends = await ServiceRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          totalCost: { $sum: "$estimatedCost" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return res.json({
      success: true,
      data: {
        summary: analytics[0] || {
          totalRequests: 0,
          totalCost: 0,
          avgCost: 0,
          totalDuration: 0,
          avgDuration: 0,
          completedRequests: 0,
          urgentRequests: 0,
          emergencyRequests: 0,
          avgRating: 0,
        },
        statusDistribution,
        categoryDistribution,
        monthlyTrends,
        period,
      },
    });
  } catch (error) {
    console.error("getServiceRequestAnalytics error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get analytics" });
  }
};

// Search service requests with advanced filters
export const searchServiceRequests = async (req, res) => {
  try {
    const {
      query: searchQuery,
      filters = {},
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.body;

    const mongoQuery = {};

    // Text search
    if (searchQuery) {
      mongoQuery.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { service: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { phone: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { address: { $regex: searchQuery, $options: "i" } },
        { tags: { $in: [new RegExp(searchQuery, "i")] } },
      ];
    }

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      ) {
        if (key === "dateRange") {
          if (filters[key].from) {
            mongoQuery.createdAt = {
              ...mongoQuery.createdAt,
              $gte: new Date(filters[key].from),
            };
          }
          if (filters[key].to) {
            mongoQuery.createdAt = {
              ...mongoQuery.createdAt,
              $lte: new Date(filters[key].to),
            };
          }
        } else if (key === "costRange") {
          if (filters[key].min !== undefined) {
            mongoQuery.estimatedCost = {
              ...mongoQuery.estimatedCost,
              $gte: filters[key].min,
            };
          }
          if (filters[key].max !== undefined) {
            mongoQuery.estimatedCost = {
              ...mongoQuery.estimatedCost,
              $lte: filters[key].max,
            };
          }
        } else {
          mongoQuery[key] = filters[key];
        }
      }
    });

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const results = await ServiceRequest.find(mongoQuery)
      .populate("assignedEmployee", "fullName email phone")
      .populate("lastUpdatedBy", "name email")
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await ServiceRequest.countDocuments(mongoQuery);

    return res.json({
      success: true,
      data: results,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("searchServiceRequests error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to search requests" });
  }
};

// Bulk update service requests
export const bulkUpdateServiceRequests = async (req, res) => {
  try {
    const { ids, updates, lastUpdatedBy } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "IDs array is required",
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Updates object is required",
      });
    }

    const updateData = { ...updates };
    if (lastUpdatedBy) updateData.lastUpdatedBy = lastUpdatedBy;

    const result = await ServiceRequest.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );

    return res.json({
      success: true,
      message: `Updated ${result.modifiedCount} service requests`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("bulkUpdateServiceRequests error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to bulk update requests" });
  }
};
