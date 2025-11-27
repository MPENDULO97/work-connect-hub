import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // poster
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // worker
  amount: { type: Number, required: true }, // in cents
  feeAmount: { type: Number, default: 0 }, // platform fee in cents
  stripePaymentIntentId: String,
  stripeChargeId: String,
  status: { 
    type: String, 
    enum: ['pending', 'authorized', 'captured', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    default: 'card'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

transactionSchema.index({ job: 1 });
transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.model('Transaction', transactionSchema);
