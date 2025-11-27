import payfastConfig, { generateSignature, verifySignature, getPayFastUrl } from '../config/payfast.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Calculate platform fee (10% after free trial)
const calculateFee = (amount, user) => {
  const now = new Date();
  const freeTrialEnds = user.freeTrialEndsAt || new Date(user.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  if (now < freeTrialEnds) {
    return 0; // Free trial period
  }
  
  return Math.round(amount * 0.10); // 10% fee
};

// Create PayFast payment for job
export const createPayment = async (req, res) => {
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
    
    // Handle card payment with PayFast
    const amount = job.price.toFixed(2);
    const feeAmount = calculateFee(job.price * 100, poster);
    
    // Generate unique payment ID
    const paymentId = `JOB_${job._id}_${Date.now()}`;
    
    // Create PayFast payment data
    const paymentData = {
      merchant_id: payfastConfig.merchantId,
      merchant_key: payfastConfig.merchantKey,
      return_url: `${process.env.CLIENT_ORIGIN}/payment/success`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/payment/cancel`,
      notify_url: `${process.env.VITE_API_BASE_URL}/api/payments/payfast-notify`,
      name_first: poster.fullName.split(' ')[0] || 'User',
      name_last: poster.fullName.split(' ').slice(1).join(' ') || 'User',
      email_address: poster.email,
      m_payment_id: paymentId,
      amount: amount,
      item_name: `Job: ${job.title}`,
      item_description: job.description.substring(0, 100),
      custom_str1: job._id.toString(),
      custom_str2: poster._id.toString(),
      custom_str3: job.worker._id.toString(),
      custom_int1: feeAmount
    };
    
    // Generate signature
    const signature = generateSignature(paymentData, payfastConfig.passphrase);
    paymentData.signature = signature;
    
    // Create transaction record
    const transaction = new Transaction({
      job: job._id,
      from: poster._id,
      to: job.worker._id,
      amount: job.price * 100,
      feeAmount,
      payfastPaymentId: paymentId,
      status: 'pending',
      paymentMethod: 'card'
    });
    await transaction.save();
    
    // Update job
    job.paymentIntentId = paymentId;
    job.paymentMethod = 'card';
    await job.save();
    
    res.json({
      paymentUrl: getPayFastUrl(),
      paymentData,
      paymentId,
      amount: job.price * 100,
      feeAmount
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: error.message || 'Payment error' });
  }
};

// Confirm payment after job completion
export const confirmPayment = async (req, res) => {
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
    
    // For PayFast, payment is already completed via ITN
    // Just mark job as completed
    if (!job.paymentIntentId) {
      return res.status(400).json({ error: 'No payment found' });
    }
    
    // Update transaction
    const transaction = await Transaction.findOne({ payfastPaymentId: job.paymentIntentId });
    if (transaction && transaction.status === 'authorized') {
      transaction.status = 'captured';
      await transaction.save();
    }
    
    // Update job
    job.status = 'completed';
    job.paid = true;
    job.completedAt = new Date();
    await job.save();
    
    res.json({ 
      success: true, 
      message: 'Payment confirmed and job completed'
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: error.message || 'Confirmation failed' });
  }
};

// Pay outstanding fees with PayFast
export const payFee = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user.feeDue || user.feeDue <= 0) {
      return res.status(400).json({ error: 'No outstanding fees' });
    }
    
    const amount = (user.feeDue / 100).toFixed(2);
    const paymentId = `FEE_${user._id}_${Date.now()}`;
    
    // Create PayFast payment data for fee
    const paymentData = {
      merchant_id: payfastConfig.merchantId,
      merchant_key: payfastConfig.merchantKey,
      return_url: `${process.env.CLIENT_ORIGIN}/payment/fee-success`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/payment/fee-cancel`,
      notify_url: `${process.env.VITE_API_BASE_URL}/api/payments/payfast-notify`,
      name_first: user.fullName.split(' ')[0] || 'User',
      name_last: user.fullName.split(' ').slice(1).join(' ') || 'User',
      email_address: user.email,
      m_payment_id: paymentId,
      amount: amount,
      item_name: 'Platform Fee Payment',
      item_description: 'Outstanding platform fees',
      custom_str1: user._id.toString(),
      custom_str2: 'platform_fee'
    };
    
    // Generate signature
    const signature = generateSignature(paymentData, payfastConfig.passphrase);
    paymentData.signature = signature;
    
    res.json({
      paymentUrl: getPayFastUrl(),
      paymentData,
      paymentId,
      amount: user.feeDue
    });
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

// PayFast ITN (Instant Transaction Notification) handler
export const handlePayFastNotify = async (req, res) => {
  try {
    const data = req.body;
    
    console.log('PayFast ITN received:', data);
    
    // Verify signature
    const isValid = verifySignature(data, data.signature, payfastConfig.passphrase);
    
    if (!isValid) {
      console.error('Invalid PayFast signature');
      return res.status(400).send('Invalid signature');
    }
    
    // Verify payment status
    if (data.payment_status === 'COMPLETE') {
      const paymentId = data.m_payment_id;
      
      // Check if it's a fee payment
      if (paymentId.startsWith('FEE_')) {
        const userId = data.custom_str1;
        const user = await User.findById(userId);
        
        if (user) {
          user.feeDue = 0;
          user.accountLocked = false;
          await user.save();
          console.log(`Fee paid for user ${userId}`);
        }
      } 
      // Regular job payment
      else if (paymentId.startsWith('JOB_')) {
        const jobId = data.custom_str1;
        const feeAmount = parseInt(data.custom_int1) || 0;
        
        const job = await Job.findById(jobId);
        if (job) {
          job.paid = true;
          await job.save();
        }
        
        // Update transaction
        const transaction = await Transaction.findOne({ payfastPaymentId: paymentId });
        if (transaction) {
          transaction.status = 'authorized';
          transaction.payfastTransactionId = data.pf_payment_id;
          await transaction.save();
        }
        
        console.log(`Payment completed for job ${jobId}`);
      }
    } else if (data.payment_status === 'FAILED' || data.payment_status === 'CANCELLED') {
      const paymentId = data.m_payment_id;
      
      await Transaction.updateOne(
        { payfastPaymentId: paymentId },
        { status: 'failed' }
      );
      
      console.log(`Payment ${data.payment_status.toLowerCase()} for ${paymentId}`);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('PayFast ITN error:', error);
    res.status(500).send('Error processing notification');
  }
};

// Setup worker payout details (bank account for PayFast)
export const setupWorkerPayout = async (req, res) => {
  try {
    const { bankName, accountNumber, accountType, branchCode } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user.roles.includes('freelancer')) {
      return res.status(403).json({ error: 'Only workers can setup payout details' });
    }
    
    // Store bank details (encrypted in production!)
    user.payoutDetails = {
      bankName,
      accountNumber,
      accountType,
      branchCode,
      verified: false
    };
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Payout details saved. Verification pending.' 
    });
  } catch (error) {
    console.error('Setup payout error:', error);
    res.status(500).json({ error: error.message });
  }
};
