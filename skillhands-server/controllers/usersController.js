import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users: users.map((u) => u.toSafeJSON()) });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body; // "admin" | "employee"
    if (!role || !["admin", "employee"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const target = await User.findById(userId);
    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Prevent deactivating the only admin or reducing last admin
    if (target.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ success: false, message: "At least one admin is required" });
      }
    }

    // Ensure we never end up with more than one admin if business rule requires only one admin
    if (role === "admin" && target.role !== "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Only one admin account is allowed",
        });
      }
    }

    target.role = role;
    await target.save();
    res.json({ success: true, user: target.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    // Import Profile model
    const Profile = (await import("../models/Profile.js")).default;

    // Get approved employee profiles for users with employee role and active status
    const employees = await Profile.find({ status: "approved" })
      .populate({
        path: "user",
        match: { role: "employee", isActive: true },
        select: "name email",
      })
      .select("_id fullName email")
      .sort({ fullName: 1 });

    // Filter out profiles where user population failed (non-employees or inactive)
    const activeEmployeeProfiles = employees
      .filter((profile) => profile.user)
      .map((profile) => ({
        _id: profile._id,
        name: profile.fullName || profile.user?.name || "Unknown",
        email: profile.email || profile.user?.email || "Unknown",
      }));

    res.json({ success: true, data: activeEmployeeProfiles });
  } catch (err) {
    next(err);
  }
};
