const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  college: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  aictePoints: {
    type: Number,
    default: 0
  },
  targetPoints: {
    type: Number,
    default: 100
  },
  profilePicture: String,
  bio: String,
  skills: [String],
  interests: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
studentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Student', studentSchema); 