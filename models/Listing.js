const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pricingBasis: { type: String, enum: ['/day', '/week', '/mo'], default: '/day' },
  category: { 
      type: String, 
      enum: ['Real Estate', 'Vehicles', 'Furniture', 'Electronics', 'Utensils', 'Tools', 'Other'],
      required: true 
  },
  location: String,
  images: [String],
  features: [String], // Array of generic tags like AC, Full HD, Mileage
  
  // Relationships
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', listingSchema);
