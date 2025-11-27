import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  projectType: { type: String, enum: ['fixed', 'hourly'], required: true },
  budgetMin: Number,
  budgetMax: Number,
  hourlyRate: Number,
  skillsRequired: [String],
  status: { 
    type: String, 
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  escrowAmount: { type: Number, default: 0 },
  deadline: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);
