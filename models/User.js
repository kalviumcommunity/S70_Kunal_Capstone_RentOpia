const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
<<<<<<< HEAD
  role: { type: String, enum: ['renter', 'owner'], default: 'renter' },

  // Relationships
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
=======
  role: { type: String, enum: ['tenant', 'landlord'], default: 'tenant' },

  // Relationships
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
});

module.exports = mongoose.model('User', userSchema);