const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Add a review for a listing
// @access  Private (Renter who has booked the item)
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    // Verify the user has a confirmed booking for this listing
    const booking = await Booking.findOne({
      listing: listingId,
      renter: req.user.id,
      status: 'confirmed' 
    });

    if (!booking) {
      return res.status(403).json({ error: 'Must have a confirmed handshake to leave a review.' });
    }

    const review = new Review({
      listing: listingId,
      renter: req.user.id,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/reviews/:listingId
// @desc    Get all reviews for a listing
router.get('/:listingId', async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('renter', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
