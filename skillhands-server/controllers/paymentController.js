import "dotenv/config";
import Stripe from "stripe";
import ServiceRequest from "../models/ServiceRequest.js";

// Lazily initialize Stripe when first needed; supports late-loaded env
let stripe = null;
function getStripe() {
  if (stripe) return stripe;
  const secret = process.env.STRIPE_SECRET_KEY;

  if (secret && secret.trim().length > 0) {
    stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  }
  return stripe;
}

console.log("stripeSecret", process.env.STRIPE_WEBHOOK_SECRET);
/**
 * Create a payment intent for a service request
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const stripeClient = getStripe();
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
    const stripeClient = getStripe();
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
 * Webhook handler for Stripe events
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log("webhookSecret111", webhookSecret);
  const stripeClient = getStripe();
  if (!stripeClient) {
    console.error("Stripe not configured (missing STRIPE_SECRET_KEY)");
    return res
      .status(500)
      .json({ success: false, message: "Stripe not configured" });
  }

  if (!webhookSecret) {
    console.error("Stripe webhook secret not configured");
    return res
      .status(500)
      .json({ success: false, message: "Webhook secret not configured" });
  }

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res
      .status(400)
      .json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      try {
        const serviceRequestId =
          session.client_reference_id || session.metadata?.serviceRequestId;
        const paymentIntentId = session.payment_intent;

        if (serviceRequestId) {
          const updates = {
            paymentStatus: "paid",
            paidAt: new Date(),
          };
          if (paymentIntentId)
            updates.stripePaymentIntentId = String(paymentIntentId);
          if (session.amount_total) {
            updates.totalAmount = Number(session.amount_total) / 100;
          }
          await ServiceRequest.findByIdAndUpdate(serviceRequestId, updates);
        } else if (paymentIntentId) {
          await ServiceRequest.findOneAndUpdate(
            { stripePaymentIntentId: String(paymentIntentId) },
            { paymentStatus: "paid", paidAt: new Date() }
          );
        }
      } catch (e) {
        console.error("checkout.session.completed handler error:", e);
      }
      break;
    }
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Find service request by payment intent ID
      let serviceRequest = await ServiceRequest.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (!serviceRequest && paymentIntent.metadata?.serviceRequestId) {
        serviceRequest = await ServiceRequest.findById(
          paymentIntent.metadata.serviceRequestId
        );
      }

      if (serviceRequest) {
        await ServiceRequest.findByIdAndUpdate(serviceRequest._id, {
          paymentStatus: "paid",
          paidAt: new Date(),
          totalAmount: paymentIntent.amount / 100,
          amount: paymentIntent.amount / 100,
          stripePaymentIntentId: paymentIntent.id,
        });
      }
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object;
      const failedServiceRequest = await ServiceRequest.findOne({
        stripePaymentIntentId: failedPaymentIntent.id,
      });

      if (failedServiceRequest) {
        await ServiceRequest.findByIdAndUpdate(failedServiceRequest._id, {
          paymentStatus: "failed",
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.json({ success: true, received: true });
};

/**
 * Create a Stripe Checkout session and return the hosted URL
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const stripeClient = getStripe();
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
