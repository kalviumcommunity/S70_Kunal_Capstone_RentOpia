const express = require('express');
const mongoose = require('mongoose');
const propertyRoutes = require('./routes/properties');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB Atlas Connection using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
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
