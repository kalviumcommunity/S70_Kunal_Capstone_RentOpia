const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); // Adjust this path as needed

// GET endpoint to fetch all properties
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint to add a new rental property
router.post('/properties', async (req, res) => {
  const { title, location, price } = req.body;

  if (!title || !location || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newProperty = new Property({
      title,
      location,
      price,
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT endpoint to update an existing property by ID
router.put('/properties/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
