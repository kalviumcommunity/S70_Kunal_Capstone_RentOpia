const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// POST - Create a listing
router.post('/', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// GET - Read all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

module.exports = router;
