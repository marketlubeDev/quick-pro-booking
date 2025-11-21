import mongoose from "mongoose";

const paymentHistoryEntrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["payment", "refund", "link", "adjustment"],
      default: "payment",
      trim: true,
    },
    method: {
      type: String,
      enum: ["stripe", "cash", "manual", "system"],
      default: "stripe",
      trim: true,
    },
    label: { type: String, trim: true },
    note: { type: String, trim: true },
    amount: { type: Number, required: true }, // stored in cents
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "cancelled", "expired"],
      default: "pending",
      trim: true,
    },
    referenceId: { type: String, trim: true },
    sessionId: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: true }
);

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
    amountPaid: { type: Number, default: 0 }, // cumulative paid amount in cents
    paymentHistory: { type: [paymentHistoryEntrySchema], default: [] },
  },
  { timestamps: true }
);

ServiceRequestSchema.virtual("remainingAmount").get(function () {
  const total = this.totalAmount || 0;
  const paid = this.amountPaid || 0;
  return Math.max(0, total - paid);
});

// Transform function to convert amounts from cents to dollars when serializing to JSON
ServiceRequestSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    const toDollars = (value) =>
      typeof value === "number" ? value / 100 : value;

    ret.amount = toDollars(ret.amount);
    ret.tax = toDollars(ret.tax);
    ret.totalAmount = toDollars(ret.totalAmount);
    ret.amountPaid = toDollars(ret.amountPaid);
    ret.remainingAmount = toDollars(ret.remainingAmount);

    if (Array.isArray(ret.paymentHistory)) {
      ret.paymentHistory = ret.paymentHistory.map((entry) => ({
        ...entry,
        amount: toDollars(entry.amount),
      }));
    }
    return ret;
  },
});

export default mongoose.models.ServiceRequest ||
  mongoose.model("ServiceRequest", ServiceRequestSchema);
