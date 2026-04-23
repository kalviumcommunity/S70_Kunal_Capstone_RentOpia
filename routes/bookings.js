const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Initiate a handshake (Booking Request)
// @access  Private (Renter)
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, startDate, endDate, totalPrice } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Prevent owners from booking their own items
    if (listing.owner.toString() === req.user.id) {
       return res.status(400).json({ error: 'Cannot book your own asset' });
    }

    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      listing: listingId,
      status: 'confirmed',
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlap) {
      return res.status(400).json({ error: 'Asset is already engaged for these cycles.' });
    }

    const newBooking = new Booking({
      listing: listingId,
      renter: req.user.id,
      owner: listing.owner,
      startDate,
      endDate,
      totalPrice
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/bookings/my-rentals
// @desc    Get all bookings made by the current user (Renter view)
router.get('/my-rentals', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user.id })
      .populate('listing')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/bookings/incoming
// @desc    Get all booking requests for items owned by the current user (Owner view)
router.get('/incoming', protect, authorize('owner'), async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('listing')
      .populate('renter', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Owner confirms or cancels a booking handshake
router.patch('/:id/status', protect, authorize('owner'), async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed' or 'cancelled'
    
    if (!['confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.owner.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to manage this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
