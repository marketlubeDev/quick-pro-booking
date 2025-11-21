import bcrypt from "bcryptjs";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import ServiceRequest from "../models/ServiceRequest.js";
import {
  sendEmployeeApplicationApprovalEmail,
  sendEmployeeApplicationRejectionEmail,
} from "../services/emailService.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      "user",
      "name email role isActive createdAt"
    );
    return res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, email, password, fullName } = req.body;
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Update user model fields
    if (name !== undefined) user.name = name;
    if (fullName !== undefined) user.name = fullName; // Map fullName to user.name
    if (email !== undefined) user.email = String(email).toLowerCase();
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    // Prepare profile updates - all fields from the updated schema
    const profileFields = [
      // Personal Information
      "fullName",
      "email",
      "phone",
      "city",
      "addressLine1",
      "addressLine2",
      "state",
      "postalCode",
      "country",
      "avatarUrl",
      "bio",

      // Professional Information
      "designation",
      "level",
      "expectedSalary",
      "yearsOfExperience",

      // Service Areas
      "workingZipCodes",
      "workingCities",

      // Skills & Certifications
      "skills",
      "certifications",
      "workExperience",
      "qualifications",

      // Verification Status
      "verified",
      "verificationStatus",
      "verificationNotes",

      // Additional fields
      "profileComplete",
    ];

    const profileUpdate = {};
    for (const key of profileFields) {
      if (req.body[key] !== undefined) {
        profileUpdate[key] = req.body[key];
      }
    }

    // Normalize array fields from body (accept string, CSV, or array)
    if (req.body.designation !== undefined) {
      const v = req.body.designation;
      profileUpdate.designation = Array.isArray(v)
        ? v.map(String)
        : String(v)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (req.body.workingZipCodes !== undefined) {
      const v = req.body.workingZipCodes;
      profileUpdate.workingZipCodes = Array.isArray(v)
        ? v.map(String)
        : String(v)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (req.body.workingCities !== undefined) {
      const v = req.body.workingCities;
      profileUpdate.workingCities = Array.isArray(v)
        ? v.map(String)
        : String(v)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    // Update lastUpdated timestamp
    profileUpdate.lastUpdated = new Date();

    await user.save();

    let profile = await Profile.findOne({ user: user._id }).populate(
      "user",
      "name email role isActive createdAt"
    );
    if (!profile) {
      profile = await Profile.create({ user: user._id, ...profileUpdate });
      profile = await Profile.findOne({ user: user._id }).populate(
        "user",
        "name email role isActive createdAt"
      );
    } else if (Object.keys(profileUpdate).length > 0) {
      Object.assign(profile, profileUpdate);
      await profile.save();
      profile = await Profile.findOne({ user: user._id }).populate(
        "user",
        "name email role isActive createdAt"
      );
    }

    return res.json({ success: true, data: profile });
  } catch (err) {
    // Handle duplicate email conflict
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }
    next(err);
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update avatar URL (assuming file is uploaded to a service like AWS S3, Cloudinary, etc.)
    profile.avatarUrl = req.file.path || req.file.filename;
    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Profile image uploaded successfully",
      avatarUrl: profile.avatarUrl,
    });
  } catch (err) {
    next(err);
  }
};

// Upload certificates
export const uploadCertificates = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Process uploaded files
    const newCertifications = req.files.map((file) => ({
      name: file.originalname,
      fileUrl: file.path || file.filename,
      uploadedAt: new Date(),
    }));

    // Add new certifications to existing ones
    profile.certifications = [
      ...(profile.certifications || []),
      ...newCertifications,
    ];
    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Certificates uploaded successfully",
      data: { certifications: profile.certifications },
    });
  } catch (err) {
    next(err);
  }
};

// Get profile completion status
export const getProfileCompletion = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.json({
        success: true,
        data: {
          completion: 0,
          missingFields: [],
          profileComplete: false,
        },
      });
    }

    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "city",
      "level",
      "skills",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = profile[field];
      // Handle arrays (like skills) - empty array is considered missing
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      // Handle other fields - empty string, null, undefined are missing
      return !value || (typeof value === "string" && value.trim() === "");
    });

    const completion = Math.round(
      ((requiredFields.length - missingFields.length) / requiredFields.length) *
        100
    );

    return res.json({
      success: true,
      data: {
        completion,
        missingFields,
        profileComplete: completion >= 80,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all employee profiles (admin only)
export const getAllEmployeeProfiles = async (req, res, next) => {
  try {
    const {
      status,
      level,
      verified,
      city,
      state,
      skills,
      minRating,
      maxRating,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 1000, // Increased limit to show all employees by default
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) filter.status = status;
    if (level) filter.level = level;
    if (verified !== undefined) filter.verified = verified === "true";
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skills = { $in: skillsArray };
    }
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { designation: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { postalCode: searchRegex },
        { workingZipCodes: searchRegex },
        { skills: searchRegex },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Profile.countDocuments(filter);

    // Get profiles with pagination
    const profiles = await Profile.find(filter)
      .populate("user", "name email role isActive createdAt")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Pre-compute completed jobs per assigned employee (profile._id)
    const completedCounts = await ServiceRequest.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$assignedEmployee", count: { $sum: 1 } } },
    ]);
    const completedCountByProfileId = completedCounts.reduce((acc, item) => {
      if (item._id) acc[String(item._id)] = item.count || 0;
      return acc;
    }, {});

    // Transform profiles to match EmployeeApplication interface
    const employeeApplications = profiles.map((profile) => ({
      id: profile._id.toString(),
      name: profile.fullName || profile.user?.name || "Unknown",
      email: profile.email || profile.user?.email || "",
      phone: profile.phone || "",
      designation: Array.isArray(profile.designation)
        ? profile.designation.join(", ")
        : profile.designation || "",
      skills: profile.skills || [],
      experienceLevel: profile.level || "Beginner",
      rating: profile.rating || 0,
      previousJobCount:
        typeof profile.totalJobs === "number" && profile.totalJobs > 0
          ? profile.totalJobs
          : completedCountByProfileId[profile._id.toString()] || 0,
      certifications: (profile.certifications || []).map(
        (cert) => cert.name || cert
      ),
      expectedSalary: profile.expectedSalary || 0,
      status: profile.status || profile.verificationStatus || "pending",
      appliedDate: profile.createdAt || new Date(),
      location: profile.city || "Unknown",
      zip: profile.postalCode || "",
      workingZipCodes: profile.workingZipCodes || [],
      workingCities: profile.workingCities || [],
      city: profile.city || "",
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      verified: profile.verified || false,
      verificationNotes: profile.verificationNotes,
      regNumber: profile.regNumber,
      category: profile.category,
      expireDate: profile.expireDate ? profile.expireDate.toISOString() : undefined,
      user: profile.user,
    }));

    return res.json({
      success: true,
      data: employeeApplications,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    next(err);
  }
};

// Get employee profile by user ID (admin only)
export const getEmployeeProfileById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId }).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Update employee application status (admin only)
export const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { status, verificationNotes } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, approved, or rejected",
      });
    }

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Store the previous status to check if it changed
    const previousStatus = profile.status;

    // Keep both fields in sync so both old/new clients and queries reflect changes
    profile.verificationStatus = status;
    profile.status = status;
    if (verificationNotes) {
      profile.verificationNotes = verificationNotes;
    }
    profile.verified = status === "approved";
    profile.lastUpdated = new Date();

    await profile.save();

    // Send email notification if status changed to approved or rejected
    try {
      if (
        status === "approved" &&
        previousStatus !== "approved" &&
        profile.user?.email
      ) {
        await sendEmployeeApplicationApprovalEmail({
          to: profile.user.email,
          name: profile.fullName || profile.user.name,
          designation: Array.isArray(profile.designation)
            ? profile.designation.join(", ")
            : profile.designation,
          address: profile.addressLine1,
          postalCode: profile.postalCode,
          skills: profile.skills || [],
          expectedSalary: profile.expectedSalary,
          verificationNotes: verificationNotes,
        });
      } else if (
        status === "rejected" &&
        previousStatus !== "rejected" &&
        profile.user?.email
      ) {
        await sendEmployeeApplicationRejectionEmail({
          to: profile.user.email,
          name: profile.fullName || profile.user.name,
          designation: Array.isArray(profile.designation)
            ? profile.designation.join(", ")
            : profile.designation,
          experienceLevel: profile.level,
          skills: profile.skills || [],
          expectedSalary: profile.expectedSalary,
          verificationNotes: verificationNotes,
          rejectionReason: verificationNotes, // Use verificationNotes as rejection reason
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Failed to send application status email:", emailError);
    }

    return res.json({
      success: true,
      message: `Employee application ${status} successfully`,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Update employee rating (admin only)
export const updateEmployeeRating = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    let { rating } = req.body;

    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: "Rating is required and must be a number",
      });
    }

    rating = Math.max(0, Math.min(5, Number(rating)));

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile.rating = rating;
    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Employee rating updated successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Update employee verification details (admin only)
export const updateEmployeeVerification = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { verified, verificationStatus, verificationNotes } = req.body;

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Update verification fields
    if (verified !== undefined) profile.verified = verified;
    if (verificationStatus !== undefined) {
      if (!["pending", "approved", "rejected"].includes(verificationStatus)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid verification status. Must be pending, approved, or rejected",
        });
      }
      profile.verificationStatus = verificationStatus;
      profile.status = verificationStatus; // Keep both fields in sync
    }
    if (verificationNotes !== undefined)
      profile.verificationNotes = verificationNotes;

    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Employee verification updated successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Update employee professional details (admin only)
export const updateEmployeeProfessionalDetails = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { designation, level, expectedSalary, yearsOfExperience, skills, totalJobs } = req.body;

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Update professional fields
    if (designation !== undefined) profile.designation = designation;
    if (level !== undefined) {
      if (!["Beginner", "Intermediate", "Expert"].includes(level)) {
        return res.status(400).json({
          success: false,
          message: "Invalid level. Must be Beginner, Intermediate, or Expert",
        });
      }
      profile.level = level;
    }
    if (expectedSalary !== undefined) profile.expectedSalary = expectedSalary;
    if (yearsOfExperience !== undefined) {
      if (yearsOfExperience < 0) {
        return res.status(400).json({
          success: false,
          message: "Years of experience must be a non-negative number",
        });
      }
      profile.yearsOfExperience = yearsOfExperience;
    }
    if (skills !== undefined) profile.skills = skills;
    if (totalJobs !== undefined) profile.totalJobs = totalJobs;

    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Employee professional details updated successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Update employee personal details (admin only)
export const updateEmployeePersonalDetails = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const {
      fullName,
      email,
      phone,
      city,
      addressLine1,
      addressLine2,
      state,
      postalCode,
      country,
      bio,
    } = req.body;

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Update personal fields
    if (fullName !== undefined) profile.fullName = fullName;
    if (email !== undefined) profile.email = email.toLowerCase();
    if (phone !== undefined) profile.phone = phone;
    if (city !== undefined) profile.city = city;
    if (addressLine1 !== undefined) profile.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) profile.addressLine2 = addressLine2;
    if (state !== undefined) profile.state = state;
    if (postalCode !== undefined) profile.postalCode = postalCode;
    if (country !== undefined) profile.country = country;
    if (bio !== undefined) profile.bio = bio;

    // Also update the user model if email or name changed
    if (email !== undefined || fullName !== undefined) {
      const user = await User.findById(profile.user._id);
      if (user) {
        if (email !== undefined) user.email = email.toLowerCase();
        if (fullName !== undefined) user.name = fullName;
        await user.save();
      }
    }

    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Employee personal details updated successfully",
      data: profile,
    });
  } catch (err) {
    // Handle duplicate email conflict
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }
    next(err);
  }
};

// Add work experience
export const addWorkExperience = async (req, res, next) => {
  try {
    const {
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    if (!company || !position || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Company, position, and start date are required",
      });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const newExperience = {
      company,
      position,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      current: current || false,
      description: description || "",
      location: location || "",
    };

    profile.workExperience = [...(profile.workExperience || []), newExperience];
    profile.lastUpdated = new Date();
    await profile.save();

    const updatedProfile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "name email role isActive createdAt");

    return res.json({
      success: true,
      message: "Work experience added successfully",
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Update work experience
export const updateWorkExperience = async (req, res, next) => {
  try {
    const { experienceId } = req.params;
    const {
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const experienceIndex = profile.workExperience.findIndex(
      (exp) => exp._id.toString() === experienceId
    );

    if (experienceIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    // Update the experience entry
    const experience = profile.workExperience[experienceIndex];
    if (company !== undefined) experience.company = company;
    if (position !== undefined) experience.position = position;
    if (startDate !== undefined) experience.startDate = new Date(startDate);
    if (endDate !== undefined)
      experience.endDate = endDate ? new Date(endDate) : undefined;
    if (current !== undefined) experience.current = current;
    if (description !== undefined) experience.description = description;
    if (location !== undefined) experience.location = location;

    profile.lastUpdated = new Date();
    await profile.save();

    const updatedProfile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "name email role isActive createdAt");

    return res.json({
      success: true,
      message: "Work experience updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Delete work experience
export const deleteWorkExperience = async (req, res, next) => {
  try {
    const { experienceId } = req.params;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const experienceIndex = profile.workExperience.findIndex(
      (exp) => exp._id.toString() === experienceId
    );

    if (experienceIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    // Remove the experience entry
    profile.workExperience.splice(experienceIndex, 1);
    profile.lastUpdated = new Date();
    await profile.save();

    const updatedProfile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "name email role isActive createdAt");

    return res.json({
      success: true,
      message: "Work experience deleted successfully",
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Add qualification
export const addQualification = async (req, res, next) => {
  try {
    const {
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    if (!degree || !institution || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Degree, institution, and start date are required",
      });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const newQualification = {
      degree,
      institution,
      fieldOfStudy: fieldOfStudy || "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      current: current || false,
      description: description || "",
      location: location || "",
    };

    profile.qualifications = [
      ...(profile.qualifications || []),
      newQualification,
    ];
    profile.lastUpdated = new Date();
    await profile.save();

    const updatedProfile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "name email role isActive createdAt");

    return res.json({
      success: true,
      message: "Qualification added successfully",
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Update qualification
export const updateQualification = async (req, res, next) => {
  try {
    const { qualificationId } = req.params;
    const {
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const qualificationIndex = profile.qualifications.findIndex(
      (qual) => qual._id.toString() === qualificationId
    );

    if (qualificationIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Qualification not found" });
    }

    // Update the qualification entry
    const qualification = profile.qualifications[qualificationIndex];
    if (degree !== undefined) qualification.degree = degree;
    if (institution !== undefined) qualification.institution = institution;
    if (fieldOfStudy !== undefined) qualification.fieldOfStudy = fieldOfStudy;
    if (startDate !== undefined) qualification.startDate = new Date(startDate);
    if (endDate !== undefined)
      qualification.endDate = endDate ? new Date(endDate) : undefined;
    if (current !== undefined) qualification.current = current;
    if (description !== undefined) qualification.description = description;
    if (location !== undefined) qualification.location = location;

    profile.lastUpdated = new Date();
    await profile.save();

    const updatedProfile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "name email role isActive createdAt");

    return res.json({
      success: true,
      message: "Qualification updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Delete qualification
export const deleteQualification = async (req, res, next) => {
  try {
    const { qualificationId } = req.params;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const qualificationIndex = profile.qualifications.findIndex(
      (qual) => qual._id.toString() === qualificationId
    );

    if (qualificationIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Qualification not found" });
    }

    // Remove the qualification entry
    profile.qualifications.splice(qualificationIndex, 1);
    profile.lastUpdated = new Date();
    await profile.save();

    const updatedProfile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "name email role isActive createdAt");

    return res.json({
      success: true,
      message: "Qualification deleted successfully",
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Add work experience to employee profile by profileId
export const addEmployeeWorkExperience = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const {
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    if (!company || !position || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Company, position, and start date are required",
      });
    }

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const newExperience = {
      company,
      position,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      current: current || false,
      description: description || "",
      location: location || "",
    };

    profile.workExperience = [...(profile.workExperience || []), newExperience];
    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Work experience added successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update work experience entry by profileId
export const updateEmployeeWorkExperience = async (req, res, next) => {
  try {
    const { profileId, experienceId } = req.params;
    const {
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const experienceIndex = profile.workExperience.findIndex(
      (exp) => exp._id.toString() === experienceId
    );

    if (experienceIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    // Update the experience entry
    const experience = profile.workExperience[experienceIndex];
    if (company !== undefined) experience.company = company;
    if (position !== undefined) experience.position = position;
    if (startDate !== undefined) experience.startDate = new Date(startDate);
    if (endDate !== undefined)
      experience.endDate = endDate ? new Date(endDate) : undefined;
    if (current !== undefined) experience.current = current;
    if (description !== undefined) experience.description = description;
    if (location !== undefined) experience.location = location;

    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Work experience updated successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete work experience entry by profileId
export const deleteEmployeeWorkExperience = async (req, res, next) => {
  try {
    const { profileId, experienceId } = req.params;

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const experienceIndex = profile.workExperience.findIndex(
      (exp) => exp._id.toString() === experienceId
    );

    if (experienceIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    // Remove the experience entry
    profile.workExperience.splice(experienceIndex, 1);
    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Work experience deleted successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Add qualification to employee profile by profileId
export const addEmployeeQualification = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const {
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    if (!degree || !institution || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Degree, institution, and start date are required",
      });
    }

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const newQualification = {
      degree,
      institution,
      fieldOfStudy: fieldOfStudy || "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      current: current || false,
      description: description || "",
      location: location || "",
    };

    profile.qualifications = [
      ...(profile.qualifications || []),
      newQualification,
    ];
    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Qualification added successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update qualification entry by profileId
export const updateEmployeeQualification = async (req, res, next) => {
  try {
    const { profileId, qualificationId } = req.params;
    const {
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      current,
      description,
      location,
    } = req.body;

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const qualificationIndex = profile.qualifications.findIndex(
      (qual) => qual._id.toString() === qualificationId
    );

    if (qualificationIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Qualification not found" });
    }

    // Update the qualification entry
    const qualification = profile.qualifications[qualificationIndex];
    if (degree !== undefined) qualification.degree = degree;
    if (institution !== undefined) qualification.institution = institution;
    if (fieldOfStudy !== undefined) qualification.fieldOfStudy = fieldOfStudy;
    if (startDate !== undefined) qualification.startDate = new Date(startDate);
    if (endDate !== undefined)
      qualification.endDate = endDate ? new Date(endDate) : undefined;
    if (current !== undefined) qualification.current = current;
    if (description !== undefined) qualification.description = description;
    if (location !== undefined) qualification.location = location;

    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Qualification updated successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete qualification entry by profileId
export const deleteEmployeeQualification = async (req, res, next) => {
  try {
    const { profileId, qualificationId } = req.params;

    const profile = await Profile.findById(profileId).populate(
      "user",
      "name email role isActive createdAt"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const qualificationIndex = profile.qualifications.findIndex(
      (qual) => qual._id.toString() === qualificationId
    );

    if (qualificationIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Qualification not found" });
    }

    // Remove the qualification entry
    profile.qualifications.splice(qualificationIndex, 1);
    profile.lastUpdated = new Date();
    await profile.save();

    return res.json({
      success: true,
      message: "Qualification deleted successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// Bulk upload employees from CSV/XLSX (admin only)
export const bulkUploadEmployees = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    let records = [];
    const fileName = req.file.originalname.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    // Parse file based on type
    if (isExcel) {
      // Parse XLSX file
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      records = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
      });
    } else {
      // Parse CSV file
      const csvContent = req.file.buffer.toString("utf-8");
      records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File is empty or invalid",
      });
    }

    const results = {
      total: records.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    // Process each record
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

      try {
        // Extract and map fields (works for both CSV and XLSX)
        const fname = String(row.FNAME || "").trim();
        const lname = String(row.LNAME || "").trim();
        const email = String(row.EMAIL_PUB || row.EMAIL || "").trim().toLowerCase();
        const city = String(row.CITY || "").trim();
        const state = String(row.STATE || "").trim();
        const zip = String(row.ZIP || "").trim();
        const regNumber = String(row["REG#"] || row.REG || row["REG#"] || "").trim();
        const category = String(row.CAT || "").trim();
        const expDate = String(row.EXP || "").trim();

        // Validate required fields (name is required, email is optional)
        if (!fname && !lname) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            email: email || "N/A",
            error: "First name or last name is required",
          });
          continue;
        }

        // Generate email if not provided
        let finalEmail = email;
        if (!finalEmail) {
          const baseEmail = `${fname.toLowerCase()}.${lname.toLowerCase()}@imported.local`.replace(/\s+/g, "");
          finalEmail = baseEmail;
          // Check if generated email already exists and append number if needed
          let counter = 1;
          while (await User.findOne({ email: finalEmail })) {
            finalEmail = `${fname.toLowerCase()}.${lname.toLowerCase()}${counter}@imported.local`.replace(/\s+/g, "");
            counter++;
          }
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: finalEmail });
        if (existingUser) {
          // Update existing profile if user exists
          const existingProfile = await Profile.findOne({ user: existingUser._id });
          if (existingProfile) {
            // Update profile fields
            if (fname || lname) {
              existingProfile.fullName = `${fname} ${lname}`.trim();
            }
            if (city) existingProfile.city = city;
            if (state) existingProfile.state = state;
            if (zip) existingProfile.postalCode = zip;
            if (regNumber) existingProfile.regNumber = regNumber;
            if (category) existingProfile.category = category;
            if (expDate) {
              // Parse date - handle formats like "0 2026-06-26" or "2026-06-26"
              const dateStr = expDate.replace(/^0\s+/, ""); // Remove leading "0 "
              const parsedDate = new Date(dateStr);
              if (!isNaN(parsedDate.getTime())) {
                existingProfile.expireDate = parsedDate;
              }
            }
            existingProfile.lastUpdated = new Date();
            await existingProfile.save();
            results.success++;
          } else {
            // Create profile for existing user
            await Profile.create({
              user: existingUser._id,
              fullName: `${fname} ${lname}`.trim(),
              email,
              city,
              state,
              postalCode: zip,
              regNumber,
              category,
              expireDate: expDate ? (() => {
                const dateStr = expDate.replace(/^0\s+/, "");
                const parsedDate = new Date(dateStr);
                return !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
              })() : undefined,
              status: "pending",
            });
            results.success++;
          }
          continue;
        }

        // Create new user and profile
        // Generate a random password (users will need to reset it)
        const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        // Create user with email (or generated email if not provided)
        let user;
        try {
          user = await User.create({
            name: `${fname} ${lname}`.trim() || finalEmail,
            email: finalEmail,
            passwordHash,
            role: "employee",
          });
        } catch (createError) {
          // Handle duplicate email error (race condition)
          if (createError?.code === 11000) {
            // Email already exists, try to find and update existing user
            const existingUser = await User.findOne({ email: finalEmail });
            if (existingUser) {
              const existingProfile = await Profile.findOne({ user: existingUser._id });
              if (existingProfile) {
                // Update existing profile
                if (fname || lname) {
                  existingProfile.fullName = `${fname} ${lname}`.trim();
                }
                if (city) existingProfile.city = city;
                if (state) existingProfile.state = state;
                if (zip) existingProfile.postalCode = zip;
                if (regNumber) existingProfile.regNumber = regNumber;
                if (category) existingProfile.category = category;
                if (expDate) {
                  const dateStr = expDate.replace(/^0\s+/, "");
                  const parsedDate = new Date(dateStr);
                  if (!isNaN(parsedDate.getTime())) {
                    existingProfile.expireDate = parsedDate;
                  }
                }
                existingProfile.lastUpdated = new Date();
                await existingProfile.save();
                results.success++;
                continue;
              }
            }
          }
          throw createError;
        }

        // Parse expire date
        let parsedExpireDate = undefined;
        if (expDate) {
          const dateStr = expDate.replace(/^0\s+/, ""); // Remove leading "0 "
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            parsedExpireDate = parsedDate;
          }
        }

        await Profile.create({
          user: user._id,
          fullName: `${fname} ${lname}`.trim(),
          email: finalEmail,
          city,
          state,
          postalCode: zip,
          regNumber,
          category,
          expireDate: parsedExpireDate,
          status: "pending",
        });

        results.success++;
      } catch (err) {
        results.failed++;
        const rowEmail = String(row.EMAIL_PUB || row.EMAIL || "").trim() || "N/A";
        results.errors.push({
          row: rowNumber,
          email: rowEmail,
          error: err.message || "Unknown error",
        });
        console.error(`Error processing row ${rowNumber}:`, err);
      }
    }

    return res.json({
      success: true,
      message: `Bulk upload completed. ${results.success} successful, ${results.failed} failed.`,
      data: results,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to process CSV file",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};