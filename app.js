const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const propertyRoutes = require('./routes/properties');

dotenv.config(); // Load variables from .env

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// API Routes
app.use('/api', propertyRoutes);

// Port setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
