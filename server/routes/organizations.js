const express = require('express');
const { body, validationResult } = require('express-validator');
const Organization = require('../models/Organization');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create/Update Organization Profile
router.post('/profile', auth, [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('category').isIn(['educational', 'corporate', 'ngo', 'government', 'other']),
  body('location.coordinates').isArray({ min: 2, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orgData = {
      ...req.body,
      userId: req.user.userId
    };

    let organization = await Organization.findOne({ userId: req.user.userId });
    
    if (organization) {
      // Update existing profile
      organization = await Organization.findOneAndUpdate(
        { userId: req.user.userId },
        orgData,
        { new: true }
      );
    } else {
      // Create new profile
      organization = new Organization(orgData);
      await organization.save();
    }

    res.json(organization);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Organization Profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findOne({ userId: req.user.userId });
    if (!organization) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(organization);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload Organization Logo
router.post('/logo', auth, upload.single('logo'), async (req, res) => {
  try {
    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const organization = await Organization.findOneAndUpdate(
      { userId: req.user.userId },
      { logo: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.json({ logo: organization.logo });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Organization's Events
router.get('/events', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findOne({ userId: req.user.userId });
    if (!organization) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const events = await Event.find({ organizationId: organization._id })
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Event
router.post('/events', auth, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('category').isIn(['workshop', 'seminar', 'competition', 'conference', 'hackathon', 'other']),
  body('aictePoints').isInt({ min: 1 }),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('registrationDeadline').isISO8601(),
  body('maxParticipants').isInt({ min: 1 }),
  body('location.coordinates').isArray({ min: 2, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findOne({ userId: req.user.userId });
    if (!organization) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const eventData = {
      ...req.body,
      organizationId: organization._id
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Event
router.put('/events/:eventId', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findOne({ userId: req.user.userId });
    if (!organization) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.eventId, organizationId: organization._id },
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Event
router.delete('/events/:eventId', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findOne({ userId: req.user.userId });
    if (!organization) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const event = await Event.findOneAndDelete({
      _id: req.params.eventId,
      organizationId: organization._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Event Registrations
router.get('/events/:eventId/registrations', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findOne({ userId: req.user.userId });
    if (!organization) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const event = await Event.findOne({
      _id: req.params.eventId,
      organizationId: organization._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.find({ eventId: event._id })
      .populate('studentId', 'name rollNumber college branch')
      .sort({ registrationDate: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Registration Status (Mark attendance, completion, etc.)
router.put('/registrations/:registrationId', auth, [
  body('status').isIn(['registered', 'attended', 'completed', 'cancelled']),
  body('pointsEarned').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findOne({ userId: req.user.userId });
    if (!organization) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const registration = await Registration.findById(req.params.registrationId)
      .populate('eventId');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if the event belongs to this organization
    if (registration.eventId.organizationId.toString() !== organization._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {
      status: req.body.status,
      ...(req.body.status === 'attended' && { attendanceDate: new Date() }),
      ...(req.body.status === 'completed' && { completionDate: new Date() }),
      ...(req.body.pointsEarned && { pointsEarned: req.body.pointsEarned })
    };

    const updatedRegistration = await Registration.findByIdAndUpdate(
      req.params.registrationId,
      updateData,
      { new: true }
    );

    res.json(updatedRegistration);
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 