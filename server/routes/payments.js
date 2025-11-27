import express from 'express';
import * as paymentsController from '../controllers/paymentsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Payment routes
router.post('/create-payment', auth, paymentsController.createPayment);
router.post('/confirm', auth, paymentsController.confirmPayment);
router.post('/pay-fee', auth, paymentsController.payFee);
router.post('/generate-code', auth, paymentsController.generateConfirmationCode);

// Worker payout setup
router.post('/setup-payout', auth, paymentsController.setupWorkerPayout);

// PayFast ITN (Instant Transaction Notification) - no auth, verified by signature
router.post('/payfast-notify', paymentsController.handlePayFastNotify);

export default router;
