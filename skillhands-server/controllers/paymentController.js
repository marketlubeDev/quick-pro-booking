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

    // Update service request based on payment status
    const updateData = {
      paymentStatus: paymentIntent.status === "succeeded" ? "paid" : "failed",
    };

    if (paymentIntent.status === "succeeded") {
      updateData.paidAt = new Date();
      updateData.totalAmount = paymentIntent.amount / 100; // store dollars
      updateData.amount = paymentIntent.amount / 100; // store dollars
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

    const update = {
      paymentStatus: isPaid ? "paid" : "failed",
    };

    if (isPaid) {
      update.paidAt = new Date();
      if (paymentIntent?.amount) {
        update.amount = paymentIntent.amount / 100; // store dollars
        update.totalAmount = paymentIntent.amount / 100; // store dollars
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
    const data = { paymentStatus: status };
    if (status === "paid") {
      data.paidAt = new Date();
      data.amount = amount / 100;
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
