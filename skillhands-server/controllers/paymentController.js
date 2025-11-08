import "dotenv/config";
import Stripe from "stripe";
import ServiceRequest from "../models/ServiceRequest.js";
import { sendPaymentSuccessEmails } from "../services/emailService.js";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const amountInCents = Math.round(Number(amount) * 100);

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

    // Update service request with payment intent ID (store dollars)
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
      stripePaymentIntentId: paymentIntent.id,
      paymentMethod: "stripe",
      amount: Number(amount),
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

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      paymentIntentId
    );

    // Get the service request to check payment percentage
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    // Determine payment status based on payment percentage
    let paymentStatus = "failed";
    if (paymentIntent.status === "succeeded") {
      // Check if this is a partial payment (50%)
      // Both amounts are in cents, so compare directly
      const paidAmount = paymentIntent.amount; // in cents
      const totalAmount = serviceRequest.totalAmount; // in cents
      const paymentPercentage = serviceRequest.paymentPercentage || "100";

      if (paymentPercentage === "50" && paidAmount < totalAmount) {
        paymentStatus = "partially_paid";
      } else {
        paymentStatus = "paid";
      }
    }

    // Update service request based on payment status
    const updateData = {
      paymentStatus: paymentStatus,
    };

    if (paymentIntent.status === "succeeded") {
      updateData.paidAt = new Date();
      // Don't update totalAmount - keep the original total
      // Only update the amount field to reflect what was actually paid
      // paymentIntent.amount is already in cents from Stripe
      updateData.amount = paymentIntent.amount; // store in cents
    }

    await ServiceRequest.findByIdAndUpdate(serviceRequestId, updateData);

    // Send emails on success
    if (paymentIntent.status === "succeeded") {
      const sr = await ServiceRequest.findById(serviceRequestId);
      try {
        await sendPaymentSuccessEmails({
          serviceRequest: sr?.toObject?.() || sr,
          payment: {
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: "stripe",
            paymentIntentId: paymentIntent.id,
            paidAt: new Date(),
          },
        });
      } catch (e) {
        // eslint-disable-next-line no-console
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
        paymentStatus: updateData.paymentStatus,
        paymentIntent: paymentIntent,
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

    const amountInCents = Math.round(Number(amount) * 100);
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

    // Mark intent to pay via Stripe/checkout (store dollars)
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
      paymentMethod: "stripe",
      amount: Number(amount),
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

    // Determine payment status based on payment percentage
    let paymentStatus = "failed";
    if (isPaid) {
      // Check if this is a partial payment (50%)
      // Both amounts are in cents, so compare directly
      const paidAmount = paymentIntent?.amount || 0; // in cents
      const totalAmount = serviceRequest.totalAmount; // in cents
      const paymentPercentage = serviceRequest.paymentPercentage || "100";

      if (paymentPercentage === "50" && paidAmount < totalAmount) {
        paymentStatus = "partially_paid";
      } else {
        paymentStatus = "paid";
      }
    }

    const update = {
      paymentStatus: paymentStatus,
    };

    if (isPaid) {
      update.paidAt = new Date();
      if (paymentIntent?.amount) {
        // Don't update totalAmount - keep the original total
        // Only update the amount field to reflect what was actually paid
        // paymentIntent.amount is already in cents from Stripe
        update.amount = paymentIntent.amount; // store in cents
      }
      if (paymentIntent?.id) {
        update.stripePaymentIntentId = paymentIntent.id;
      }
    }

    await ServiceRequest.findByIdAndUpdate(serviceRequestId, update);

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

    return res.json({
      success: isPaid,
      message: isPaid
        ? "Payment verified successfully"
        : "Payment not completed",
      data: {
        serviceRequestId,
        paymentStatus: update.paymentStatus,
        sessionId: session.id,
        paymentIntentId: paymentIntent?.id || null,
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

  const updatePayment = async (
    serviceRequestId,
    status,
    amount,
    intentId,
    currency
  ) => {
    // Get the service request to check payment percentage
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      console.error(
        `Service request ${serviceRequestId} not found for webhook`
      );
      return;
    }

    // Determine payment status based on payment percentage
    let paymentStatus = status;
    if (status === "paid") {
      // Both amounts are in cents, so compare directly
      const paidAmount = amount; // in cents
      const totalAmount = serviceRequest.totalAmount; // in cents
      const paymentPercentage = serviceRequest.paymentPercentage || "100";

      if (paymentPercentage === "50" && paidAmount < totalAmount) {
        paymentStatus = "partially_paid";
      }
    }

    const data = { paymentStatus: paymentStatus };
    if (status === "paid") {
      data.paidAt = new Date();
      // Don't update totalAmount - keep the original total
      // Only update the amount field to reflect what was actually paid
      // amount parameter is already in cents from Stripe webhook
      data.amount = amount; // store in cents
      data.stripePaymentIntentId = intentId;
    }
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, data);
  };

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      await updatePayment(
        pi.metadata.serviceRequestId,
        "paid",
        pi.amount,
        pi.id,
        pi.currency
      );
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
      await updatePayment(pi.metadata.serviceRequestId, "failed", 0, pi.id);
      break;
    }
  }
  return res.json({ received: true });
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

    // Update service request payment status
    const updateData = {
      paymentStatus:
        refundAmount >= actualPaidAmount ? "refunded" : "partially_paid",
    };

    // If full refund, update amount to 0
    if (refundAmount >= actualPaidAmount) {
      updateData.amount = 0;
    } else {
      // For partial refund, subtract refund amount from current amount
      updateData.amount = Math.max(0, actualPaidAmount - refundAmount);
    }

    await ServiceRequest.findByIdAndUpdate(serviceRequestId, updateData);

    return res.json({
      success: true,
      message: "Refund processed successfully",
      data: {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
        paymentStatus: updateData.paymentStatus,
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
