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
  locationName: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number] // [lng, lat]
  },
  price: Number,
  currency: { type: String, default: 'ZAR' },
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['open', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    default: 'card'
  },
  paymentIntentId: String, // Stripe PaymentIntent ID
  confirmationCode: String, // Hashed confirmation code
  paid: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
});

// Text search index
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ category: 1 });
jobSchema.index({ active: 1 });
jobSchema.index({ status: 1 });

// Geospatial index for location-based queries
jobSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('Job', jobSchema);
