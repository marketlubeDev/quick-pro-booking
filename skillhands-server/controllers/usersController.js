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
      .select("_id fullName email city state postalCode skills")
      .sort({ fullName: 1 });

    // Filter out profiles where user population failed (non-employees or inactive)
    const activeEmployeeProfiles = employees
      .filter((profile) => profile.user)
      .map((profile) => ({
        _id: profile._id,
        name: profile.fullName || profile.user?.name || "Unknown",
        email: profile.email || profile.user?.email || "Unknown",
        city: profile.city || "",
        state: profile.state || "",
        postalCode: profile.postalCode || "",
        skills: profile.skills || [],
      }));

    res.json({ success: true, data: activeEmployeeProfiles });
  } catch (err) {
    next(err);
  }
};

// Get customer details by ID (admin only)
export const getCustomerDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Customer not found" 
      });
    }

    // Get user profile if exists
    const profile = await Profile.findOne({ user: userId });
    
    const customerData = {
      user: user.toSafeJSON(),
      profile: profile || null
    };

    res.json({ success: true, data: customerData });
  } catch (err) {
    next(err);
  }
};

// Update customer details (admin only)
export const updateCustomerDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Customer not found" 
      });
    }

    // Update user basic information
    const allowedUserFields = ['name', 'email', 'isActive'];
    const userUpdates = {};
    
    for (const field of allowedUserFields) {
      if (updateData[field] !== undefined) {
        userUpdates[field] = updateData[field];
      }
    }

    // Check if email is being updated and if it's unique
    if (userUpdates.email && userUpdates.email !== user.email) {
      const existingUser = await User.findOne({ 
        email: userUpdates.email.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another user"
        });
      }
      userUpdates.email = userUpdates.email.toLowerCase();
    }

    // Update user
    Object.assign(user, userUpdates);
    await user.save();

    // Update or create profile
    let profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new Profile({ user: userId });
    }

    // Update profile fields
    const allowedProfileFields = [
      'fullName', 'email', 'phone', 'city', 'addressLine1', 'addressLine2',
      'state', 'postalCode', 'country', 'bio', 'designation', 'level',
      'expectedSalary', 'workingZipCodes', 'workingCities', 'skills',
      'verified', 'verificationStatus', 'verificationNotes', 'status',
      'rating', 'totalJobs'
    ];

    for (const field of allowedProfileFields) {
      if (updateData[field] !== undefined) {
        profile[field] = updateData[field];
      }
    }

    // Handle work experience updates
    if (updateData.workExperience) {
      profile.workExperience = updateData.workExperience;
    }

    // Handle certifications updates
    if (updateData.certifications) {
      profile.certifications = updateData.certifications;
    }

    profile.lastUpdated = new Date();
    await profile.save();

    // Return updated data
    const updatedData = {
      user: user.toSafeJSON(),
      profile: profile
    };

    res.json({ 
      success: true, 
      message: "Customer details updated successfully",
      data: updatedData 
    });
  } catch (err) {
    next(err);
  }
};

// Get all customers with their profiles (admin only)
export const getAllCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let userQuery = {};
    let profileQuery = {};

    if (role) {
      userQuery.role = role;
    }

    if (status) {
      profileQuery.status = status;
    }

    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(userQuery)
      .select('name email role isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get profiles for these users
    const userIds = users.map(user => user._id);
    const profiles = await Profile.find({ 
      user: { $in: userIds },
      ...profileQuery 
    });

    // Combine user and profile data
    const customersWithProfiles = users.map(user => {
      const profile = profiles.find(p => p.user.toString() === user._id.toString());
      return {
        user: user.toSafeJSON(),
        profile: profile || null
      };
    });

    // Get total count for pagination
    const totalUsers = await User.countDocuments(userQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: customersWithProfiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete customer (admin only)
export const deleteCustomer = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Customer not found" 
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: "Cannot delete admin users"
      });
    }

    // Delete user and associated profile
    await User.findByIdAndDelete(userId);
    await Profile.findOneAndDelete({ user: userId });

    res.json({ 
      success: true, 
      message: "Customer deleted successfully" 
    });
  } catch (err) {
    next(err);
  }
};