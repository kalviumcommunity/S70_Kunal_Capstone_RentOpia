const express = require('express');
const mongoose = require('mongoose');
const propertyRoutes = require('./routes/properties');

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

// Use port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
