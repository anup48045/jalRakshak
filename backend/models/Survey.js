const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  waterBodyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterBody',
    required: true
  },
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  officerName: {
    type: String,
    required: true
  },
  waterLevel: {
    type: String,
    enum: ['high', 'medium', 'low', 'dry'],
    required: true
  },
  waterQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: true
  },
  pollutionObserved: {
    type: Boolean,
    default: false
  },
  pollutionType: [{
    type: String
  }],
  encroachmentObserved: {
    type: Boolean,
    default: false
  },
  encroachmentDetails: {
    type: String
  },
  vegetation: {
    type: String,
    enum: ['dense', 'moderate', 'sparse', 'none']
  },
  remarks: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  aiAnalysisResults: {
    detectedPollutants: [{
      type: String,
      confidence: Number
    }],
    overallPollutionLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  // Water quality parameters for WQI calculation
  waterQualityData: {
    temp: {
      type: Number,
      required: false
    },
    do: {
      type: Number,
      required: false
    },
    ph: {
      type: Number,
      required: false
    },
    conductivity: {
      type: Number,
      required: false
    },
    bod: {
      type: Number,
      required: false
    },
    nitrate: {
      type: Number,
      required: false
    },
    fecalColiform: {
      type: Number,
      required: false
    },
    totalColiform: {
      type: Number,
      required: false
    }
  },
  // Calculated WQI results
  wqiResults: {
    wqi: {
      type: Number
    },
    healthScore: {
      type: Number
    },
    status: {
      type: String,
      enum: ['excellent', 'good', 'poor', 'critical']
    },
    classification: {
      type: Number
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Survey', surveySchema);
