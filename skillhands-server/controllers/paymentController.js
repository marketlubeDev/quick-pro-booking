import "dotenv/config";
import Stripe from "stripe";
import mongoose from "mongoose";
import ServiceRequest from "../models/ServiceRequest.js";
import { sendPaymentSuccessEmails } from "../services/emailService.js";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

const computePaymentStatus = (totalAmount = 0, paidAmount = 0) => {
  if (!totalAmount && paidAmount <= 0) {
    return "pending";
  }
  if (!totalAmount && paidAmount > 0) {
    return "paid";
  }
  if (paidAmount >= totalAmount) {
    return "paid";
  }
  if (paidAmount > 0) {
    return "partially_paid";
  }
  return "pending";
};

const recordPaymentHistory = async ({
  serviceRequest,
  entry,
  amountDelta = 0,
}) => {
  if (!serviceRequest?._id || !entry) return serviceRequest;

  // Check if a payment with the same referenceId already exists
  // This prevents duplicates when both webhook and verifyCheckoutSession try to record the same payment
  if (entry.referenceId) {
    // Fetch fresh data from database to check for duplicates
    const freshRequest = await ServiceRequest.findById(serviceRequest._id);
    const existingEntry = freshRequest?.paymentHistory?.find(
      (hist) => hist.referenceId === entry.referenceId
    );
    if (existingEntry) {
      console.log(
        `Payment with referenceId ${entry.referenceId} already exists, skipping duplicate entry`
      );
      // Still update the amount/status if needed, but don't add duplicate entry
      if (amountDelta !== 0) {
        const currentPaid = freshRequest.amountPaid || 0;
        const nextPaid = Math.max(0, currentPaid + amountDelta);
        const paymentStatus = computePaymentStatus(
          freshRequest.totalAmount || 0,
          nextPaid
        );
        const update = {
          $set: {
            amountPaid: nextPaid,
            paymentStatus,
          },
        };

        if (amountDelta > 0) {
          update.$set.paidAt = new Date();
          update.$set.amount = entry.amount;
        }

        if (entry.method === "stripe" && entry.referenceId) {
          update.$set.stripePaymentIntentId = entry.referenceId;
        }

        await ServiceRequest.findByIdAndUpdate(serviceRequest._id, update);

        const updatedRequest = await ServiceRequest.findById(serviceRequest._id);
        if (updatedRequest) {
          serviceRequest.amountPaid = updatedRequest.amountPaid;
          serviceRequest.paymentStatus = updatedRequest.paymentStatus;
          serviceRequest.paidAt = updatedRequest.paidAt;
          serviceRequest.amount = updatedRequest.amount;
          serviceRequest.stripePaymentIntentId = updatedRequest.stripePaymentIntentId;
        }
      }
      return serviceRequest;
    }
  }

  // Fetch fresh data from database to ensure we have the latest amountPaid
  // This prevents race conditions when multiple payments are processed simultaneously
  const freshRequest = await ServiceRequest.findById(serviceRequest._id);
  if (!freshRequest) return serviceRequest;

  const update = {
    $push: { paymentHistory: entry },
  };

  if (amountDelta !== 0) {
    // Use fresh data from database instead of potentially stale in-memory object
    const currentPaid = freshRequest.amountPaid || 0;
    const nextPaid = Math.max(0, currentPaid + amountDelta);
    const paymentStatus = computePaymentStatus(
      freshRequest.totalAmount || 0,
      nextPaid
    );
    update.$set = {
      amountPaid: nextPaid,
      paymentStatus,
    };

    if (amountDelta > 0) {
      update.$set.paidAt = new Date();
      update.$set.amount = entry.amount;
    }

    if (entry.method === "stripe" && entry.referenceId) {
      update.$set.stripePaymentIntentId = entry.referenceId;
    }
  }

  await ServiceRequest.findByIdAndUpdate(serviceRequest._id, update);

  if (update.$set?.amountPaid !== undefined) {
    serviceRequest.amountPaid = update.$set.amountPaid;
  }
  if (update.$set?.paymentStatus) {
    serviceRequest.paymentStatus = update.$set.paymentStatus;
  }
  if (update.$set?.paidAt) {
    serviceRequest.paidAt = update.$set.paidAt;
  }
  if (update.$set?.amount !== undefined) {
    serviceRequest.amount = update.$set.amount;
  }
  if (update.$set?.stripePaymentIntentId) {
    serviceRequest.stripePaymentIntentId = update.$set.stripePaymentIntentId;
  }

  return serviceRequest;
};

const paymentHistoryStatusUpdater = async ({
  serviceRequestId,
  historyEntryId,
  status,
  referenceId,
  sessionId,
}) => {
  if (!serviceRequestId || !historyEntryId || !status) return;

  let historyObjectId = historyEntryId;
  if (mongoose.Types.ObjectId.isValid(historyEntryId)) {
    historyObjectId = new mongoose.Types.ObjectId(historyEntryId);
  }

  const selector = {
    _id: serviceRequestId,
    "paymentHistory._id": historyObjectId,
  };

  const setData = {
    "paymentHistory.$.status": status,
    "paymentHistory.$.completedAt": new Date(),
  };

  if (referenceId) {
    setData["paymentHistory.$.referenceId"] = referenceId;
  }
  if (sessionId) {
    setData["paymentHistory.$.sessionId"] = sessionId;
  }

  await ServiceRequest.updateOne(selector, { $set: setData });
};

const toCents = (value) => Math.round(Number(value || 0) * 100);

/**
 * Create a payment intent for a service request
 */
export const createPaymentIntent = async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)",
      });
    }
    const { serviceRequestId, amount } = req.body;

    if (!serviceRequestId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Service request ID and amount are required",
      });
    }

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    // Convert amount to cents for Stripe, but keep dollars in DB
    const amountInCents = toCents(amount);

    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        serviceRequestId: serviceRequestId.toString(),
        service: serviceRequest.service,
        customerName: serviceRequest.name,
        customerEmail: serviceRequest.email,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update service request with payment intent ID (store in cents)
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
      stripePaymentIntentId: paymentIntent.id,
      paymentMethod: "stripe",
      amount: amountInCents,
    });

    return res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Confirm payment and update service request
 */
export const confirmPayment = async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)",
      });
    }
    const { serviceRequestId, paymentIntentId } = req.body;

    if (!serviceRequestId || !paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Service request ID and payment intent ID are required",
      });
    }

    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      paymentIntentId
    );

    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    let paymentStatus = "failed";
    if (paymentIntent.status === "succeeded") {
      const historyEntry = {
        type: "payment",
        method: "stripe",
        amount: paymentIntent.amount,
        status: "succeeded",
        referenceId: paymentIntent.id,
        metadata: {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        },
        completedAt: new Date(),
        createdAt: new Date(),
      };

      await recordPaymentHistory({
        serviceRequest,
        entry: historyEntry,
        amountDelta: paymentIntent.amount,
      });

      paymentStatus = serviceRequest.paymentStatus || "paid";
    }

    if (paymentIntent.metadata?.historyEntryId) {
      await paymentHistoryStatusUpdater({
        serviceRequestId,
        historyEntryId: paymentIntent.metadata.historyEntryId,
        status: paymentIntent.status === "succeeded" ? "succeeded" : "failed",
        referenceId: paymentIntent.id,
      });
    }

    if (paymentIntent.status === "succeeded") {
      try {
        await sendPaymentSuccessEmails({
          serviceRequest: serviceRequest?.toObject?.() || serviceRequest,
          payment: {
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: "stripe",
            paymentIntentId: paymentIntent.id,
            paidAt: new Date(),
          },
        });
      } catch (e) {
        console.error("sendPaymentSuccessEmails error:", e);
      }
    }

    return res.json({
      success: paymentIntent.status === "succeeded",
      message:
        paymentIntent.status === "succeeded"
          ? "Payment confirmed successfully"
          : "Payment failed",
      data: {
        paymentStatus,
        paymentIntent,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create a Stripe Checkout session and return the hosted URL
 */
export const createCheckoutSession = async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)",
      });
    }

    const { serviceRequestId, amount, returnUrl } = req.body || {};

    if (!serviceRequestId || !amount) {
      return res.status(400).json({
        success: false,
        message: "serviceRequestId and amount are required",
      });
    }

    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Service request not found" });
    }

    const amountInCents = toCents(amount);
    const origin =
      (returnUrl && String(returnUrl)) ||
      process.env.FRONTEND_BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    const successUrl = `${origin}/payment-success?srid=${serviceRequestId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/payment-cancel?srid=${serviceRequestId}`;

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: serviceRequest.service || "Service",
              description: serviceRequest.description || undefined,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        serviceRequestId: String(serviceRequestId),
      },
      client_reference_id: String(serviceRequestId),
      payment_intent_data: {
        metadata: {
          serviceRequestId: String(serviceRequestId),
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Mark intent to pay via Stripe/checkout (store in cents)
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
      paymentMethod: "stripe",
      amount: amountInCents,
      paymentStatus: "pending",
    });

    return res.json({
      success: true,
      data: { checkoutUrl: session.url, sessionId: session.id },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Verify a Stripe Checkout Session (no webhook)
 * Called from the success page with `session_id` to confirm and update status
 */
export const verifyCheckoutSession = async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)",
      });
    }

    // Accept either route param :sessionId or query param session_id
    const sessionId =
      req.params?.sessionId || req.query?.session_id || req.body?.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId (or session_id) is required",
      });
    }

    // Retrieve session and expand payment_intent for amount/status
    const session = await stripeClient.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    const paymentIntent = session.payment_intent;
    const serviceRequestId =
      session?.metadata?.serviceRequestId || session?.client_reference_id;

    if (!serviceRequestId) {
      return res.status(400).json({
        success: false,
        message: "Missing serviceRequestId in session metadata",
        data: { session },
      });
    }

    // Determine paid/failed from session + payment intent
    const isPaid =
      session.payment_status === "paid" ||
      (paymentIntent && paymentIntent.status === "succeeded");

    // Get the service request to check payment percentage
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    let paymentStatus = serviceRequest.paymentStatus;
    if (isPaid && paymentIntent?.amount) {
      const historyEntry = {
        type: "payment",
        method: "stripe",
        amount: paymentIntent.amount,
        status: "succeeded",
        referenceId: paymentIntent.id,
        metadata: {
          sessionId: session.id,
          checkoutSessionId: session.id,
        },
        completedAt: new Date(),
        createdAt: new Date(),
      };

      await recordPaymentHistory({
        serviceRequest,
        entry: historyEntry,
        amountDelta: paymentIntent.amount,
      });
      paymentStatus = serviceRequest.paymentStatus;
    }

    if (session.metadata?.historyEntryId) {
      await paymentHistoryStatusUpdater({
        serviceRequestId,
        historyEntryId: session.metadata.historyEntryId,
        status: isPaid ? "succeeded" : "failed",
        referenceId: paymentIntent?.id,
        sessionId: session.id,
      });
    }

    // Send emails on success
    if (isPaid) {
      const sr = await ServiceRequest.findById(serviceRequestId);
      try {
        await sendPaymentSuccessEmails({
          serviceRequest: sr?.toObject?.() || sr,
          payment: {
            amount: paymentIntent?.amount,
            currency: paymentIntent?.currency || "usd",
            paymentMethod: "stripe",
            paymentIntentId: paymentIntent?.id,
            paidAt: new Date(),
          },
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("sendPaymentSuccessEmails error:", e);
      }
    }

    // Fetch the updated service request with populated fields
    const updatedServiceRequest = await ServiceRequest.findById(serviceRequestId)
      .populate("assignedEmployee", "fullName email phone")
      .populate("lastUpdatedBy", "name email");

    return res.json({
      success: isPaid,
      message: isPaid
        ? "Payment verified successfully"
        : "Payment not completed",
      data: {
        serviceRequestId,
        paymentStatus: updatedServiceRequest?.paymentStatus || paymentStatus,
        sessionId: session.id,
        paymentIntentId: paymentIntent?.id || null,
        serviceRequest: updatedServiceRequest, // Return the full updated service request
      },
    });
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify checkout session",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Stripe webhook handler
 * Verifies signature and updates `ServiceRequest` payment status.
 */
// ✅ Webhook Handler (Raw Body Safe)
export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("RAW BODY? ", req.body);
  console.log("Signature? ", req.headers["stripe-signature"]);

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const updatePayment = async ({
    serviceRequestId,
    status,
    amount,
    intentId,
    currency,
    metadata,
  }) => {
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      console.error(
        `Service request ${serviceRequestId} not found for webhook`
      );
      return;
    }

    if (status === "paid" && amount) {
      const historyEntry = {
        type: "payment",
        method: "stripe",
        amount,
        status: "succeeded",
        referenceId: intentId,
        metadata: {
          currency,
          ...metadata,
        },
        completedAt: new Date(),
        createdAt: new Date(),
      };
      await recordPaymentHistory({
        serviceRequest,
        entry: historyEntry,
        amountDelta: amount,
      });
    } else if (status === "failed") {
      const historyEntry = {
        type: "payment",
        method: "stripe",
        amount: amount || 0,
        status: "failed",
        referenceId: intentId,
        metadata,
        completedAt: new Date(),
        createdAt: new Date(),
      };
      await recordPaymentHistory({
        serviceRequest,
        entry: historyEntry,
        amountDelta: 0,
      });
    }

    if (metadata?.historyEntryId) {
      await paymentHistoryStatusUpdater({
        serviceRequestId,
        historyEntryId: metadata.historyEntryId,
        status: status === "paid" ? "succeeded" : status,
        referenceId: intentId,
      });
    }
  };

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      await updatePayment({
        serviceRequestId: pi.metadata.serviceRequestId,
        status: "paid",
        amount: pi.amount,
        intentId: pi.id,
        currency: pi.currency,
        metadata: pi.metadata,
      });
      try {
        const sr = await ServiceRequest.findById(pi.metadata.serviceRequestId);
        await sendPaymentSuccessEmails({
          serviceRequest: sr?.toObject?.() || sr,
          payment: {
            amount: pi.amount,
            currency: pi.currency,
            paymentMethod: "stripe",
            paymentIntentId: pi.id,
            paidAt: new Date(),
          },
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("sendPaymentSuccessEmails error:", e);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      await updatePayment({
        serviceRequestId: pi.metadata.serviceRequestId,
        status: "failed",
        amount: 0,
        intentId: pi.id,
        metadata: pi.metadata,
      });
      break;
    }
  }
  return res.json({ received: true });
};

export const generatePaymentLink = async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)",
      });
    }

    const {
      serviceRequestId,
      option = "second_third",
      customAmount,
      note,
      returnUrl,
    } = req.body || {};

    if (!serviceRequestId) {
      return res.status(400).json({
        success: false,
        message: "serviceRequestId is required",
      });
    }

    const serviceRequest = await ServiceRequest.findById(serviceRequestId)
      .populate("assignedEmployee", "fullName email phone")
      .populate("lastUpdatedBy", "name email");

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    const totalAmount = serviceRequest.totalAmount || 0;
    const paidAmount = serviceRequest.amountPaid || 0;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    const optionLabelMap = {
      second_third: "Second 1/3 Installment",
      full: "Full Remaining Balance",
      custom: "Custom Amount",
    };

    let amountInCents = 0;
    const normalizedOption = option || "second_third";
    switch (normalizedOption) {
      case "second_third":
        amountInCents = Math.round(totalAmount / 3);
        if (remainingAmount > 0) {
          amountInCents = Math.min(amountInCents, remainingAmount);
        }
        break;
      case "full":
        amountInCents = remainingAmount || totalAmount;
        break;
      case "custom":
        amountInCents = toCents(customAmount);
        break;
      default:
        amountInCents = remainingAmount;
    }

    if (amountInCents <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to generate a payment link because there is no outstanding balance or the amount is invalid.",
      });
    }

    const historyEntryId = new mongoose.Types.ObjectId();
    const origin =
      (returnUrl && String(returnUrl)) ||
      process.env.FRONTEND_BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    const successUrl = `${origin}/payment-success?srid=${serviceRequestId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/payment-cancel?srid=${serviceRequestId}`;

    const baseMetadata = {
      serviceRequestId: String(serviceRequestId),
      historyEntryId: historyEntryId.toString(),
      paymentOption: normalizedOption,
    };

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: serviceRequest.service || "Service Payment",
              description:
                note ||
                serviceRequest.description ||
                optionLabelMap[normalizedOption],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: baseMetadata,
      client_reference_id: String(serviceRequestId),
      payment_intent_data: {
        metadata: baseMetadata,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    const historyEntry = {
      _id: historyEntryId,
      type: "link",
      method: "stripe",
      amount: amountInCents,
      status: "pending",
      referenceId: session.id,
      sessionId: session.id,
      label: optionLabelMap[normalizedOption] || "Payment Link",
      note: note || "",
      metadata: {
        option: normalizedOption,
        checkoutUrl: session.url,
        customAmount:
          normalizedOption === "custom" ? amountInCents : undefined,
      },
      createdAt: new Date(),
    };

    await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
      $push: { paymentHistory: historyEntry },
    });

    const updatedRequest = await ServiceRequest.findById(serviceRequestId)
      .populate("assignedEmployee", "fullName email phone")
      .populate("lastUpdatedBy", "name email");

    return res.json({
      success: true,
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
        serviceRequest: updatedRequest,
      },
    });
  } catch (error) {
    console.error("Error generating payment link:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate payment link",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Process a refund for a service request
 * Only processes refunds for Stripe payments
 */
export const processRefund = async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe is not configured on the server (missing STRIPE_SECRET_KEY)",
      });
    }

    const { serviceRequestId, amount, reason } = req.body;

    if (!serviceRequestId) {
      return res.status(400).json({
        success: false,
        message: "Service request ID is required",
      });
    }

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    // Check if payment was made via Stripe
    if (!serviceRequest.stripePaymentIntentId) {
      return res.status(400).json({
        success: false,
        message:
          "This service request does not have a Stripe payment to refund",
      });
    }

    // Check if already refunded
    if (serviceRequest.paymentStatus === "refunded") {
      return res.status(400).json({
        success: false,
        message: "This payment has already been refunded",
      });
    }

    // Check if payment was successful
    if (
      serviceRequest.paymentStatus !== "paid" &&
      serviceRequest.paymentStatus !== "partially_paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot refund a payment that hasn't been completed",
      });
    }

    // Retrieve the payment intent to get charge ID
    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      serviceRequest.stripePaymentIntentId
    );

    if (!paymentIntent.latest_charge) {
      return res.status(400).json({
        success: false,
        message: "No charge found for this payment intent",
      });
    }

    // Get the actual paid amount (use serviceRequest.amount if available, otherwise paymentIntent.amount)
    const actualPaidAmount =
      serviceRequest.amount > 0 ? serviceRequest.amount : paymentIntent.amount;

    // Determine refund amount (full or partial)
    const refundAmount = amount
      ? Math.round(Number(amount) * 100) // Convert to cents if provided
      : actualPaidAmount; // Full refund of actual paid amount if not specified

    // Validate refund amount
    if (refundAmount <= 0 || refundAmount > actualPaidAmount) {
      return res.status(400).json({
        success: false,
        message: `Invalid refund amount. Maximum refundable: $${(
          actualPaidAmount / 100
        ).toFixed(2)}`,
      });
    }

    // Create refund in Stripe
    // Stripe only accepts: "duplicate", "fraudulent", or "requested_by_customer"
    // We'll use "requested_by_customer" as default and store the custom reason in metadata
    const stripeReason = "requested_by_customer";

    const refund = await stripeClient.refunds.create({
      charge: paymentIntent.latest_charge,
      amount: refundAmount,
      reason: stripeReason,
      metadata: {
        serviceRequestId: serviceRequestId.toString(),
        service: serviceRequest.service,
        customerName: serviceRequest.name,
        customerEmail: serviceRequest.email,
        customReason: reason || "Service request rejected", // Store custom reason in metadata
      },
    });

    const historyEntry = {
      type: "refund",
      method: "stripe",
      amount: refund.amount,
      status: refund.status === "succeeded" ? "succeeded" : refund.status,
      referenceId: refund.id,
      metadata: {
        reason: reason || "Service request refund",
      },
      completedAt: new Date(),
      createdAt: new Date(),
    };

    await recordPaymentHistory({
      serviceRequest,
      entry: historyEntry,
      amountDelta: refund.amount * -1,
    });

    let paymentStatus =
      refundAmount >= actualPaidAmount ? "refunded" : serviceRequest.paymentStatus;
    if (refundAmount >= actualPaidAmount) {
      await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
        paymentStatus: "refunded",
        amountPaid: 0,
        amount: 0,
      });
      paymentStatus = "refunded";
    }

    return res.json({
      success: true,
      message: "Refund processed successfully",
      data: {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
        paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
