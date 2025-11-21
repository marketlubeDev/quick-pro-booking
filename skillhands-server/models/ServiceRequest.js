import mongoose from "mongoose";

const ServiceRequestSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    preferredDate: { type: String, trim: true },
    preferredTime: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true },

    attachment: {
      filename: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      url: { type: String }, // URL to access the file
    },
    status: {
      type: String,
      enum: [
        "new",
        "pending",
        "in-process",
        "in-progress",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      trim: true,
    },
    scheduledDate: { type: String, trim: true, default: null },
    scheduledTime: { type: String, trim: true, default: null },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    customerName: { type: String, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true },
    serviceType: { type: String, trim: true },
    serviceCategory: {
      type: String,
      enum: [
        "plumbing",
        "electrical",
        "cleaning",
        "maintenance",
        "renovation",
        "other",
      ],
      default: "other",
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["routine", "urgent", "emergency"],
      default: "routine",
      trim: true,
    },
    customerNotes: { type: String, trim: true, default: "" },
    adminNotes: { type: String, trim: true, default: "" },
    estimatedDuration: { type: Number, default: 0 }, // in hours
    actualDuration: { type: Number, default: 0 }, // in hours
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date, default: null },
    customerRating: { type: Number, min: 1, max: 5, default: null },
    customerFeedback: { type: String, trim: true, default: "" },
    // Employee assignment fields
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },
    employeeAccepted: { type: Boolean, default: false },
    employeeAcceptedAt: { type: Date, default: null },
    employeeRemarks: { type: String, trim: true, default: "" },
    completedAt: { type: Date, default: null },
    completionNotes: { type: String, trim: true, default: "" },
    // Additional tracking fields
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    source: {
      type: String,
      enum: ["website", "phone", "walk-in", "referral", "other"],
      default: "website",
      trim: true,
    },
    tags: [{ type: String, trim: true }], // For categorization and search
    isRecurring: { type: Boolean, default: false },
    recurringPattern: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      default: null,
    },
    nextScheduledDate: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: "" },
    // Payment fields
    paymentMethod: {
      type: String,
      enum: ["cash", "stripe"],
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partially_paid", "failed", "refunded"],
      default: "pending",
    },
    paymentPercentage: {
      type: String,
      enum: ["33", "50", "100"],
      default: "33",
    },
    stripePaymentIntentId: { type: String, trim: true, default: null },
    amount: { type: Number, default: 0 }, // Total amount in cents
    tax: { type: Number, default: 0 }, // Tax amount in cents
    totalAmount: { type: Number, default: 0 }, // Total with tax in cents
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Transform function to convert amounts from cents to dollars when serializing to JSON
ServiceRequestSchema.set("toJSON", {
  transform: function (doc, ret) {
    // Convert amounts from cents to dollars
    if (ret.amount !== undefined) {
      ret.amount = ret.amount / 100;
    }
    if (ret.tax !== undefined) {
      ret.tax = ret.tax / 100;
    }
    if (ret.totalAmount !== undefined) {
      ret.totalAmount = ret.totalAmount / 100;
    }
    return ret;
  },
});

export default mongoose.models.ServiceRequest ||
  mongoose.model("ServiceRequest", ServiceRequestSchema);
