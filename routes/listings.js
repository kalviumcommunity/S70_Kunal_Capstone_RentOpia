const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
<<<<<<< HEAD
const { protect, authorize } = require('../middleware/auth');

// GET endpoint to fetch all listings (with filtering)
router.get('/', async (req, res) => {
  try {
    const { location, maxPrice, search, category } = req.query;
    
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

    const listings = await Listing.find(query).populate('owner', 'name email');
    res.status(200).json(listings);
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
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    
    if (listing.owner.toString() !== req.user.id) {
       return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
=======

// ✅ POST - Create a new listing
router.post('/', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// ✅ GET - Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// ✅ PUT - Update a listing by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err });
  }
});

// ✅ DELETE - Delete a listing by ID
router.delete('/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err });
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
  }
});

module.exports = router;
