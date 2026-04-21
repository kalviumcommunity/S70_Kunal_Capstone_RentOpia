const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  location: String,
  price: Number,
  images: [String],
  availableFrom: Date,
  amenities: [String],

  // Relationships
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
});

module.exports = mongoose.model('Property', propertySchema);