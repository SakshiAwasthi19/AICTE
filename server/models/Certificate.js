const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  certificateUrl: {
    type: String,
    required: true
  },
  pointsEarned: {
    type: Number,
    required: true
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  issuedBy: {
    type: String,
    required: true
  },
  certificateType: {
    type: String,
    enum: ['event', 'achievement', 'recognition', 'other'],
    default: 'event'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tags: [String]
});

module.exports = mongoose.model('Certificate', certificateSchema); 