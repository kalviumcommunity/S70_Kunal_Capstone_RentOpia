const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

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
  }
});

module.exports = router;
