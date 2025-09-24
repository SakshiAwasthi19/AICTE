const express = require('express');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');

const router = express.Router();

// Get All Certificates (for admin/verification purposes)
router.get('/', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('studentId', 'name rollNumber college')
      .populate('eventId', 'title')
      .sort({ issuedDate: -1 });
    
    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Certificate by ID
router.get('/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.certificateId)
      .populate('studentId', 'name rollNumber college')
      .populate('eventId', 'title organizationId')
      .populate('eventId.organizationId', 'name');
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Certificate
router.put('/:certificateId/verify', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.certificateId,
      { isVerified: true },
      { new: true }
    );
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Certificates by Type
router.get('/type/:type', async (req, res) => {
  try {
    const certificates = await Certificate.find({
      certificateType: req.params.type
    })
    .populate('studentId', 'name rollNumber college')
    .populate('eventId', 'title')
    .sort({ issuedDate: -1 });
    
    res.json(certificates);
  } catch (error) {
    console.error('Get certificates by type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search Certificates
router.get('/search/:query', async (req, res) => {
  try {
    const certificates = await Certificate.find({
      $or: [
        { title: { $regex: req.params.query, $options: 'i' } },
        { description: { $regex: req.params.query, $options: 'i' } },
        { issuedBy: { $regex: req.params.query, $options: 'i' } },
        { tags: { $in: [new RegExp(req.params.query, 'i')] } }
      ]
    })
    .populate('studentId', 'name rollNumber college')
    .populate('eventId', 'title')
    .sort({ issuedDate: -1 });
    
    res.json(certificates);
  } catch (error) {
    console.error('Search certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 