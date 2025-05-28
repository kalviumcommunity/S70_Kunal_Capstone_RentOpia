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

module.exports = router;