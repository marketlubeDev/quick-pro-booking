import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  createCheckoutSession,
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

export default router;
