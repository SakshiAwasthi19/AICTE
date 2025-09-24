const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  website: String,
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
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
    }
  },
  logo: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [String],
  category: {
    type: String,
    enum: ['educational', 'corporate', 'ngo', 'government', 'other'],
    required: true
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
organizationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Organization', organizationSchema); 