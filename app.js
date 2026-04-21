const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
<<<<<<< HEAD
const cors = require('cors');
=======
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61

// Load environment variables from .env file
dotenv.config();

// Load Google OAuth strategy
require('./config/passport');

// Route imports
const listingRoutes = require('./routes/listings');
<<<<<<< HEAD
=======
const propertyRoutes = require('./routes/properties');
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth'); // Auth Route Import

const app = express(); // ✅ Define app before using it
const PORT = process.env.PORT || 5000;

// Middleware
<<<<<<< HEAD
app.use(cors());
=======
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('RentOpia Backend is Live');
});
<<<<<<< HEAD
app.use('/api/listings', listingRoutes);
=======
app.use('/api/listings', listingRoutes); // ✅ This will now include PUT/DELETE
app.use('/api/properties', propertyRoutes);
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
app.use('/api/upload', uploadRoutes);
app.use('/api', authRoutes); // Auth Route Mount

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
