import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  createCheckoutSession,
  verifyCheckoutSession,
  processRefund,
} from "../controllers/paymentController.js";

const router = express.Router();

// Webhook route - must use raw body parser
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Payment routes
router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);
router.post("/create-checkout-session", createCheckoutSession);

// Verify checkout completion without webhook
router.get("/checkout-session/:sessionId", verifyCheckoutSession);
router.get("/checkout-session", verifyCheckoutSession); // supports ?session_id=

// Refund route
router.post("/refund", processRefund);

export default router;
