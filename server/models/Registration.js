const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'completed', 'cancelled'],
    default: 'registered'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  attendanceDate: Date,
  completionDate: Date,
  pointsEarned: {
    type: Number,
    default: 0
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    certificateUrl: String,
    issuedDate: Date
  }
});

// Ensure unique registration per student per event
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema); 