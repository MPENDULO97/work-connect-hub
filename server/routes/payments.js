import express from 'express';
import * as paymentsController from '../controllers/paymentsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Payment routes
router.post('/create-intent', auth, paymentsController.createPaymentIntent);
router.post('/capture', auth, paymentsController.capturePayment);
router.post('/pay-fee', auth, paymentsController.payFee);
router.post('/generate-code', auth, paymentsController.generateConfirmationCode);

// Stripe Connect
router.post('/connect-account', auth, paymentsController.createConnectAccount);

// Webhook (no auth - Stripe signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsController.handleWebhook);

export default router;
