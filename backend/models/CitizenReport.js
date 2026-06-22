const mongoose = require('mongoose');

const citizenReportSchema = new mongoose.Schema({
  waterBodyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterBody'
  },
  waterBodyName: {
    type: String, 
    trim: true
  },
  reporterName: {
    type: String,
    trim: true
  },
  reporterEmail: {
    type: String,
    trim: true
  },
  reporterPhone: {
    type: String,
    trim: true
  },
  title:{
    type: String,
    trim: true
  },
  issueType: {
    type: String,
    enum: ['pollution', 'encroachment', 'waste_dumping', 'sewage', 'drying', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  locationName: {
    type:String,
    required: true,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'resolved'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  verificationNotes: {
    type: String
  },
  aiAnalysisResults: {
    detectedIssues: [{
      type: String,
      confidence: Number
    }]
  }
}, {
  timestamps: true
});

citizenReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CitizenReport', citizenReportSchema);
