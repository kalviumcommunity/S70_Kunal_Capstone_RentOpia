const express = require('express');
const mongoose = require('mongoose');
const propertyRoutes = require('./routes/properties'); // corrected filename (property.js)

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/rentopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Use property routes with /api prefix
app.use('/api', propertyRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
