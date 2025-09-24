const express = require('express');
const Event = require('../models/Event');
const Organization = require('../models/Organization');

const router = express.Router();

// Get All Active Events
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'startDate' } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(query)
      .populate('organizationId', 'name logo')
      .sort(sort === 'aictePoints' ? { aictePoints: -1 } : { startDate: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Event by ID
router.get('/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('organizationId', 'name description logo website');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Events by Category
router.get('/category/:category', async (req, res) => {
  try {
    const events = await Event.find({
      category: req.params.category,
      isActive: true
    })
    .populate('organizationId', 'name logo')
    .sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Get events by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search Events
router.get('/search/:query', async (req, res) => {
  try {
    const events = await Event.find({
      $or: [
        { title: { $regex: req.params.query, $options: 'i' } },
        { description: { $regex: req.params.query, $options: 'i' } },
        { tags: { $in: [new RegExp(req.params.query, 'i')] } }
      ],
      isActive: true
    })
    .populate('organizationId', 'name logo')
    .sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Upcoming Events
router.get('/upcoming/limit/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const events = await Event.find({
      startDate: { $gte: new Date() },
      isActive: true
    })
    .populate('organizationId', 'name logo')
    .sort({ startDate: 1 })
    .limit(limit);
    
    res.json(events);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get High Points Events
router.get('/high-points/limit/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const events = await Event.find({
      isActive: true,
      startDate: { $gte: new Date() }
    })
    .populate('organizationId', 'name logo')
    .sort({ aictePoints: -1 })
    .limit(limit);
    
    res.json(events);
  } catch (error) {
    console.error('Get high points events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 