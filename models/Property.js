const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: String,
  price: Number,
  location: String,
  description: String
});

module.exports = mongoose.model('Property', propertySchema);