import stripe from '../config/stripe.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import bcrypt from 'bcryptjs';

// Calculate platform fee (10% after free trial)
const calculateFee = (amount, user) => {
  const now = new Date();
  const freeTrialEnds = user.freeTrialEndsAt || new Date(user.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  if (now < freeTrialEnds) {
    return 0; // Free trial period
  }
  
  return Math.round(amount * 0.10); // 10% fee
};

// Create Payment Intent for job
export const createPaymentIntent = async (req, res) => {
  try {
    const { jobId, paymentMethod } = req.body;
    
    const job = await Job.findById(jobId).populate('worker poster');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.poster._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    if (!job.worker) {
      return res.status(400).json({ error: 'Job has no assigned worker' });
    }
    
    const poster = await User.findById(req.user.userId);
    
    // Check if poster has outstanding fees
    if (poster.feeDue > 0) {
      return res.status(403).json({ 
        error: 'You have outstanding fees. Please pay them before proceeding.',
        feeDue: poster.feeDue 
      });
    }
    
    // Handle cash payment
    if (paymentMethod === 'cash') {
      const feeAmount = calculateFee(job.price * 100, poster);
      
      // Create transaction record
      const transaction = new Transaction({
        job: job._id,
        from: poster._id,
        to: job.worker._id,
        amount: job.price * 100,
        feeAmount,
        paymentMethod: 'cash',
        status: 'pending'
      });
      await transaction.save();
      
      // Add fee to poster's account
      poster.feeDue += feeAmount;
      await poster.save();
      
      job.paymentMethod = 'cash';
      await job.save();
      
      return res.json({ 
        success: true, 
        paymentMethod: 'cash',
        feeAmount,
        message: 'Cash payment selected. Fee will be due after job completion.' 
      });
    }
    
    // Handle card payment with Stripe
    const amountInCents = Math.round(job.price * 100);
    const feeAmount = calculateFee(amountInCents, poster);
    
    // Create or get Stripe customer
    let customerId = poster.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: poster.email,
        metadata: { userId: poster._id.toString() }
      });
      customerId = customer.id;
      poster.stripeCustomerId = customerId;
      await poster.save();
    }
    
    // Create PaymentIntent with manual capture
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: job.currency.toLowerCase(),
      customer: customerId,
      capture_method: 'manual', // Authorize now, capture later
      metadata: {
        jobId: job._id.toString(),
        posterId: poster._id.toString(),
        workerId: job.worker._id.toString(),
        feeAmount: feeAmount.toString()
      }
    });
    
    // Create transaction record
    const transaction = new Transaction({
      job: job._id,
      from: poster._id,
      to: job.worker._id,
      amount: amountInCents,
      feeAmount,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      paymentMethod: 'card'
    });
    await transaction.save();
    
    // Update job
    job.paymentIntentId = paymentIntent.id;
    job.paymentMethod = 'card';
    await job.save();
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      feeAmount
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: error.message || 'Payment error' });
  }
};

// Capture payment after job completion
export const capturePayment = async (req, res) => {
  try {
    const { jobId, confirmationCode } = req.body;
    
    const job = await Job.findById(jobId).populate('poster worker');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.poster._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Verify confirmation code
    if (!job.confirmationCode) {
      return res.status(400).json({ error: 'No confirmation code set for this job' });
    }
    
    const isValid = await bcrypt.compare(confirmationCode, job.confirmationCode);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid confirmation code' });
    }
    
    // Handle cash payment
    if (job.paymentMethod === 'cash') {
      job.status = 'completed';
      job.paid = true;
      job.completedAt = new Date();
      await job.save();
      
      const transaction = await Transaction.findOne({ job: job._id });
      if (transaction) {
        transaction.status = 'captured';
        await transaction.save();
      }
      
      return res.json({ 
        success: true, 
        message: 'Job marked as completed. Cash payment confirmed.',
        feeDue: (await User.findById(job.poster._id)).feeDue
      });
    }
    
    // Capture Stripe payment
    if (!job.paymentIntentId) {
      return res.status(400).json({ error: 'No payment intent found' });
    }
    
    const paymentIntent = await stripe.paymentIntents.capture(job.paymentIntentId);
    
    // Update transaction
    const transaction = await Transaction.findOne({ stripePaymentIntentId: job.paymentIntentId });
    if (transaction) {
      transaction.status = 'captured';
      transaction.stripeChargeId = paymentIntent.charges.data[0]?.id;
      await transaction.save();
    }
    
    // Update job
    job.status = 'completed';
    job.paid = true;
    job.completedAt = new Date();
    await job.save();
    
    res.json({ 
      success: true, 
      captured: paymentIntent.amount_captured,
      message: 'Payment captured successfully'
    });
  } catch (error) {
    console.error('Capture payment error:', error);
    res.status(500).json({ error: error.message || 'Capture failed' });
  }
};

// Pay outstanding fees
export const payFee = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user.feeDue || user.feeDue <= 0) {
      return res.status(400).json({ error: 'No outstanding fees' });
    }
    
    const { paymentMethodId } = req.body;
    
    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
        metadata: { userId: user._id.toString() }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    }
    
    // Create payment intent for fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: user.feeDue,
      currency: 'zar',
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        userId: user._id.toString(),
        type: 'platform_fee'
      }
    });
    
    if (paymentIntent.status === 'succeeded') {
      user.feeDue = 0;
      user.accountLocked = false;
      await user.save();
      
      res.json({ 
        success: true, 
        message: 'Fee paid successfully',
        amount: paymentIntent.amount 
      });
    } else {
      res.status(400).json({ error: 'Payment failed', status: paymentIntent.status });
    }
  } catch (error) {
    console.error('Pay fee error:', error);
    res.status(500).json({ error: error.message || 'Payment failed' });
  }
};

// Generate confirmation code for job
export const generateConfirmationCode = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.worker.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    if (job.status !== 'in_progress') {
      return res.status(400).json({ error: 'Job must be in progress' });
    }
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    
    job.confirmationCode = hashedCode;
    await job.save();
    
    res.json({ 
      success: true, 
      code, // In production, send this via SMS/email instead
      message: 'Confirmation code generated. Share with client.' 
    });
  } catch (error) {
    console.error('Generate code error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Stripe webhook handler
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
        
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        console.log('PaymentIntent failed:', failedIntent.id);
        
        // Update transaction status
        await Transaction.updateOne(
          { stripePaymentIntentId: failedIntent.id },
          { status: 'failed' }
        );
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Connect Stripe account for workers (to receive payouts)
export const createConnectAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user.stripeAccountId) {
      return res.status(400).json({ error: 'Stripe account already connected' });
    }
    
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'ZA',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        userId: user._id.toString()
      }
    });
    
    user.stripeAccountId = account.id;
    await user.save();
    
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.CLIENT_ORIGIN}/worker/onboarding/refresh`,
      return_url: `${process.env.CLIENT_ORIGIN}/worker/onboarding/complete`,
      type: 'account_onboarding',
    });
    
    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Create connect account error:', error);
    res.status(500).json({ error: error.message });
  }
};
