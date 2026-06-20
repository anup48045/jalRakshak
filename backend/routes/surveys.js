const express = require('express');
const Survey = require('../models/Survey');
const WaterBody = require('../models/WaterBody');
const { protect, authorize } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// AI Module configuration
const AI_MODULE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Function to call AI module for WQI calculation
async function calculateWQIWithAI(waterQualityData) {
  try {
    const response = await axios.post(`${AI_MODULE_URL}/calculate-wqi`, {
      temp: waterQualityData.temp,
      do: waterQualityData.do,
      ph: waterQualityData.ph,
      bod: waterQualityData.bod,
      totalColiform: waterQualityData.totalColiform
    }, {
      timeout: 5000 // 5 second timeout
    });

    if (response.data.success) {
      return {
        healthScore: response.data.healthScore,
        wqi: response.data.wqi,
        status: response.data.status,
        classification: response.data.classification
      };
    }
    throw new Error('AI module returned unsuccessful response');
  } catch (error) {
    console.error('AI module error:', error.message);
    throw error;
  }
}

// @route   GET /api/surveys
// @desc    Get all surveys
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { waterBodyId, officerId } = req.query;
    const query = {};

    if (waterBodyId) query.waterBodyId = waterBodyId;
    if (officerId) query.officerId = officerId;

    const surveys = await Survey.find(query)
      .populate('waterBodyId', 'name district')
      .populate('officerId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: surveys.length,
      surveys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/surveys/:id
// @desc    Get single survey
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('waterBodyId')
      .populate('officerId', 'name email');

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      survey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/surveys
// @desc    Create new survey
// @access  Private/Officer
router.post('/', protect, authorize('admin', 'officer'), async (req, res) => {
  try {
    const surveyData = {
      ...req.body,
      officerId: req.user._id,
      officerName: req.user.name
    };

    // Calculate WQI if water quality data is provided
    if (surveyData.waterQualityData) {
      try {
        const wqiResults = await calculateWQIWithAI(surveyData.waterQualityData);
        surveyData.wqiResults = wqiResults;
        
        // Update water body health score and status
        await WaterBody.findByIdAndUpdate(
          surveyData.waterBodyId,
          {
            healthScore: wqiResults.healthScore,
            status: wqiResults.status,
            lastQualityCheck: new Date()
          }
        );
      } catch (error) {
        console.error('WQI calculation failed, creating survey without WQI:', error.message);
        // Continue without WQI if AI module fails
      }
    }

    const survey = await Survey.create(surveyData);

    // Update water body's last survey date
    await WaterBody.findByIdAndUpdate(
      survey.waterBodyId,
      { lastSurveyDate: new Date() }
    );

    res.status(201).json({
      success: true,
      survey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/surveys/:id
// @desc    Update survey
// @access  Private/Officer
router.put('/:id', protect, authorize('admin', 'officer'), async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      survey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/surveys/:id
// @desc    Delete survey
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      message: 'Survey deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
