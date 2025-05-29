const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tenant', 'landlord'], default: 'tenant' },

  // Relationships
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
});

module.exports = mongoose.model('User', userSchema);