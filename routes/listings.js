const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth');

// GET endpoint to fetch all listings (with advanced filtering & pagination)
// @route   GET /api/listings
// @query   category, location, maxPrice, search, page, limit
router.get('/', async (req, res) => {
  try {
    const { location, maxPrice, search, category } = req.query;
    
    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // Default to 6 per page
    const skip = (page - 1) * limit;

    let query = {};
    
    if (location) query.location = { $regex: location, $options: 'i' };
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute queries in parallel for better performance
    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Listing.countDocuments(query)
    ]);

    res.status(200).json({
      listings,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint to add a new listing (Protected - Owner only)
router.post('/', protect, authorize('owner'), async (req, res) => {
  const { title, description, category, location, price, pricingBasis, images, features } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields: title, price, category' });
  }

  try {
    const newListing = new Listing({
      title,
      description,
      category,
      location,
      price,
      pricingBasis: pricingBasis || '/day',
      images: images || [],
      features: features || [],
      owner: req.user.id
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an existing listing
router.put('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    
    if (listing.owner.toString() !== req.user.id) {
       return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE listing
router.delete('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    
    // Allow delete if owner OR admin
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
