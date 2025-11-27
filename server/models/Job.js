import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Gardening', 'Babysitting', 'Laundry', 'Painting', 'Cleaning',
      'Delivery', 'Plumbing', 'Electrical', 'Carpentry', 'Tutoring',
      'Pet Care', 'Moving', 'Cooking', 'Grocery Shopping', 'Car Wash',
      'Ironing', 'House Sitting', 'Errands', 'Handyman', 'Appliance Repair',
      'Locksmith', 'Pest Control', 'Window Cleaning', 'Gutter Cleaning',
      'Furniture Assembly', 'Other'
    ]
  },
  location: String,
  price: Number,
  currency: { type: String, default: 'ZAR' },
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ category: 1 });
jobSchema.index({ active: 1 });

export default mongoose.model('Job', jobSchema);
