const mongoose = require('mongoose');
const { getStatusFromHealthScore } = require('../utils/healthScore');

const waterBodySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  district: {
    type: String,
    required: [true, 'Please provide a district'],
    trim: true
  },
  area: {
    type: Number,
    required: [true, 'Please provide area in square meters']
  },
  category: {
    type: String,
    enum: ['lake', 'pond', 'wetland', 'reservoir', 'river'],
    required: [true, 'Please provide a category']
  },
  status: {
    type: String,
    enum: ['healthy', 'moderate', 'critical'],
    default: 'moderate'
  },
  healthScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  lastSurveyDate: {
    type: Date
  },
  lastQualityCheck: {
    type: Date
  }
}, {
  timestamps: true
});

// Create geospatial index for location queries
waterBodySchema.index({ location: '2dsphere' });

waterBodySchema.pre('save', function (next) {
  if (this.isNew || this.isModified('healthScore')) {
    this.status = getStatusFromHealthScore(this.healthScore);
  }
  next();
});

waterBodySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  const incomingHealthScore = update.healthScore ?? update.$set?.healthScore;
  if (incomingHealthScore != null) {
    const status = getStatusFromHealthScore(incomingHealthScore);
    if (update.$set) {
      update.$set.status = status;
    } else {
      update.status = status;
    }
  }

  next();
});

module.exports = mongoose.model('WaterBody', waterBodySchema);
