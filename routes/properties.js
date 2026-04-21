const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

// GET endpoint to fetch all properties (with filtering)
router.get('/', async (req, res) => {
  try {
    const { location, maxPrice, search } = req.query;
    
    let query = {};
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(query).populate('landlord', 'name email');
=======
const Property = require('../models/Property'); // Adjust this path as needed

// GET endpoint to fetch all properties
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find();
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// GET single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'name email');
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint to add a new rental property (Protected - Landlord only)
router.post('/', protect, authorize('landlord'), async (req, res) => {
  const { title, description, location, price, images, amenities, availableFrom } = req.body;

  if (!title || !location || !price) {
    return res.status(400).json({ error: 'Missing required fields: title, location, price' });
=======
// POST endpoint to add a new rental property
router.post('/properties', async (req, res) => {
  const { title, location, price } = req.body;

  if (!title || !location || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
  }

  try {
    const newProperty = new Property({
      title,
<<<<<<< HEAD
      description,
      location,
      price,
      images: images || [],
      amenities: amenities || [],
      availableFrom,
      landlord: req.user.id // from the protect middleware
=======
      location,
      price,
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT endpoint to update an existing property by ID
<<<<<<< HEAD
router.put('/:id', protect, authorize('landlord'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    // Ensure the logged in user is the owner
    if (property.landlord.toString() !== req.user.id) {
       return res.status(403).json({ error: 'Not authorized to update this property' });
    }

=======
router.put('/properties/:id', async (req, res) => {
  try {
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

<<<<<<< HEAD
=======
    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// DELETE property
router.delete('/:id', protect, authorize('landlord'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    if (property.landlord.toString() !== req.user.id) {
       return res.status(403).json({ error: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

=======
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
module.exports = router;
