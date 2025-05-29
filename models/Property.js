const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  location: String,
  price: Number,
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [String],
  availableFrom: Date,
  amenities: [String]
});

module.exports = mongoose.model('Property', propertySchema);
