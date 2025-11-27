import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'freelancer', 'client'] }],
  profile: {
    bio: String,
    avatarUrl: String,
    hourlyRate: Number,
    location: String,
    skills: [String],
    portfolioUrl: String
  },
  stripeAccountId: String, // Stripe Connect account for workers
  stripeCustomerId: String, // Stripe customer for posters
  feeDue: { type: Number, default: 0 }, // Outstanding fees in cents
  accountLocked: { type: Boolean, default: false },
  freeTrialEndsAt: Date, // First month free
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
