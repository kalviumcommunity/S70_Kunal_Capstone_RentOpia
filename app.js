const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Load Google OAuth strategy
require('./config/passport');

// Route imports
const listingRoutes = require('./routes/listings');
const uploadRoutes = require('./routes/upload');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth'); // Auth Route Import

const app = express(); // ✅ Define app before using it
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', authRoutes); // Auth Route Mount

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const dbName = mongoose.connection.name;
  const host = mongoose.connection.host;
  console.log(`Grid Synced: Connected to [${dbName}] at ${host}`);
  app.listen(PORT, () => {
    console.log(`Mainframe operational on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
