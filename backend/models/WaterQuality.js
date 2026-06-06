const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema({
  waterBodyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterBody',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100,
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
  do: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  ph: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  bod: {
    type: Number,
    required: true,
    min: 0
  },
  nitrate: {
    type: Number,
    required: true,
    min: 0
  },
  fecalColiform: {
    type: Number,
    required: true,
    min: 0
  },
  totalColiform: {
    type: Number,
    required: true,
    min: 0
  },
  temperature: {
    type: Number,
    required: true
  },
  turbidity: {
    type: Number,
    min: 0
  },
  conductivity: {
    type: Number,
    min: 0
  },
  testedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  labName: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WaterQuality', waterQualitySchema);
