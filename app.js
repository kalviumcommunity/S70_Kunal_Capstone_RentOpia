const express = require('express');
const mongoose = require('mongoose');
const propertyRoutes = require('./routes/properties');

const app = express();

// Middleware (if needed, like bodyParser)
// app.use(express.json()); // Uncomment if you plan to use POST later

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/rentopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes
app.use('/api', propertyRoutes);

// Start the server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});