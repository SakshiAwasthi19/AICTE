const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');
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

// Create/Update Student Profile
router.post('/profile', auth, [
  body('name').notEmpty().trim(),
  body('rollNumber').notEmpty().trim(),
  body('college').notEmpty().trim(),
  body('branch').notEmpty().trim(),
  body('semester').isInt({ min: 1, max: 8 }),
  body('phone').notEmpty().trim(),
  body('location.coordinates').isArray({ min: 2, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const studentData = {
      ...req.body,
      userId: req.user.userId
    };

    let student = await Student.findOne({ userId: req.user.userId });
    
    if (student) {
      // Update existing profile
      student = await Student.findOneAndUpdate(
        { userId: req.user.userId },
        studentData,
        { new: true }
      );
    } else {
      // Create new profile
      student = new Student(studentData);
      await student.save();
    }

    res.json(student);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Student Profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload Profile Picture
router.post('/profile-picture', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const student = await Student.findOneAndUpdate(
      { userId: req.user.userId },
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.json({ profilePicture: student.profilePicture });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Student's AICTE Points
router.get('/points', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      currentPoints: student.aictePoints,
      targetPoints: student.targetPoints,
      remainingPoints: student.targetPoints - student.aictePoints,
      progress: (student.aictePoints / student.targetPoints) * 100
    });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Student's Event Registrations
router.get('/registrations', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const registrations = await Registration.find({ studentId: student._id })
      .populate('eventId')
      .sort({ registrationDate: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for Event
router.post('/register-event/:eventId', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isActive) {
      return res.status(400).json({ message: 'Event is not active' });
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      studentId: student._id,
      eventId: event._id
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      studentId: student._id,
      eventId: event._id
    });

    await registration.save();

    // Update event participant count
    await Event.findByIdAndUpdate(event._id, {
      $inc: { currentParticipants: 1 }
    });

    res.json({ message: 'Successfully registered for event', registration });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Nearby Events (within 10km)
router.get('/nearby-events', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const { longitude, latitude } = student.location.coordinates;
    
    const nearbyEvents = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000 // 10km in meters
        }
      },
      isActive: true,
      startDate: { $gte: new Date() }
    }).populate('organizationId', 'name');

    res.json(nearbyEvents);
  } catch (error) {
    console.error('Get nearby events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Student's Certificates
router.get('/certificates', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const certificates = await Certificate.find({ studentId: student._id })
      .populate('eventId', 'title')
      .sort({ issuedDate: -1 });

    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload Certificate
router.post('/certificates', auth, upload.single('certificate'), [
  body('title').notEmpty().trim(),
  body('pointsEarned').isInt({ min: 1 }),
  body('issuedBy').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No certificate file uploaded' });
    }

    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const certificate = new Certificate({
      studentId: student._id,
      title: req.body.title,
      description: req.body.description,
      certificateUrl: `/uploads/${req.file.filename}`,
      pointsEarned: req.body.pointsEarned,
      issuedBy: req.body.issuedBy,
      certificateType: req.body.certificateType || 'other',
      tags: req.body.tags ? req.body.tags.split(',') : []
    });

    await certificate.save();

    // Update student's AICTE points
    await Student.findByIdAndUpdate(student._id, {
      $inc: { aictePoints: req.body.pointsEarned }
    });

    res.json(certificate);
  } catch (error) {
    console.error('Certificate upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 