const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (Admin only)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:id/activity
// @desc    Get comprehensive activity for a specific user node (Admin only)
router.get('/users/:id/activity', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Node not found' });

    const listings = await Listing.find({ owner: req.params.id }).lean();
    
    // Add engagement stats to each listing
    const listingsWithStats = await Promise.all(listings.map(async (l) => {
        const count = await Booking.countDocuments({ listing: l._id });
        const confirmedCount = await Booking.countDocuments({ listing: l._id, status: 'confirmed' });
        return { ...l, rentCount: count, successfulRentCount: confirmedCount };
    }));

    const bookingsAsRenter = await Booking.find({ renter: req.params.id }).populate('listing');
    const bookingsAsOwner = await Booking.find({ owner: req.params.id }).populate('listing');

    res.json({
        user,
        stats: {
            listingsCount: listings.length,
            rentalsCount: bookingsAsRenter.length,
            incomingHandshakesCount: bookingsAsOwner.length
        },
        listings: listingsWithStats,
        bookingsAsRenter,
        bookingsAsOwner
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user and purge all associated grid data (Admin only)
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Purge linked assets and handshakes
    await Listing.deleteMany({ owner: userId });
    await Booking.deleteMany({ $or: [{ renter: userId }, { owner: userId }] });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all associated data purged successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth Route - initiate login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  callbackURL: 'http://localhost:5000/api/google/callback'  // Explicit redirect_uri
}));


// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/login',
    session: false,
    callbackURL: 'http://localhost:5000/api/google/callback'
  }),
  (req, res) => {
    // Generate JWT for the Google user
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    
    // Redirect to frontend with token in URL
    // The frontend will catch this and save it to localStorage
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);


// Protected profile route
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
