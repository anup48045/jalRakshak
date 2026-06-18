const express = require('express');
const WaterQuality = require('../models/WaterQuality');
const WaterBody = require('../models/WaterBody');
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');
const { calculateHealthScore, getStatusFromHealthScore, checkAlertThresholds, mergeThresholdAlerts } = require('../utils/healthScore');
const axios = require('axios');

const router = express.Router();

// AI Module configuration
const AI_MODULE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Function to call AI module for WQI calculation
async function calculateWQIWithAI(waterQualityData) {
  try {
    const response = await axios.post(`${AI_MODULE_URL}/calculate-wqi`, {
      do: waterQualityData.do,
      ph: waterQualityData.ph,
      bod: waterQualityData.bod,
      nitrate: waterQualityData.nitrate,
      fecalColiform: waterQualityData.fecalColiform
    }, {
      timeout: 5000 // 5 second timeout
    });

    if (response.data.success) {
      return {
        healthScore: response.data.healthScore,
        wqi: response.data.wqi,
        status: response.data.status
      };
    }
    throw new Error('AI module returned unsuccessful response');
  } catch (error) {
    console.error('AI module error, falling back to local calculation:', error.message);
    // Fallback to local calculation if AI module fails
    const healthScore = calculateHealthScore(waterQualityData);
    return {
      healthScore,
      wqi: healthScore,
      status: getStatusFromHealthScore(healthScore)
    };
  }
}

// @route   GET /api/waterquality
// @desc    Get all water quality records
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { waterBodyId } = req.query;
    const query = {};

    if (waterBodyId) query.waterBodyId = waterBodyId;

    const records = await WaterQuality.find(query)
      .populate('waterBodyId', 'name district')
      .populate('testedBy', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/waterquality/:id
// @desc    Get single water quality record
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const record = await WaterQuality.findById(req.params.id)
      .populate('waterBodyId')
      .populate('testedBy', 'name email');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Water quality record not found'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/waterquality
// @desc    Create new water quality record
// @access  Private/Officer
router.post('/', protect, authorize('admin', 'officer'), async (req, res) => {
  try {
    const qualityData = {
      ...req.body,
      testedBy: req.user._id
    };

    // Calculate health score using AI module
    const wqiResult = await calculateWQIWithAI(qualityData);
    const healthScore = wqiResult.healthScore;
    const status = wqiResult.status;

    qualityData.healthScore = healthScore;
    qualityData.status = status;
    const record = await WaterQuality.create(qualityData);

    await WaterBody.findByIdAndUpdate(
      record.waterBodyId,
      {
        healthScore,
        status,
        lastQualityCheck: new Date()
      }
    );

    // Check for alerts
    const waterBody = await WaterBody.findById(record.waterBodyId);
    const thresholdAlerts = checkAlertThresholds(waterBody, record);
    const mergedAlert = mergeThresholdAlerts(thresholdAlerts, record);
    let alertsGenerated = 0;

    if (mergedAlert) {
      await Alert.create(mergedAlert);
      alertsGenerated = 1;
    }

    res.status(201).json({
      success: true,
      record,
      healthScore,
      wqi: wqiResult.wqi,
      status,
      alertsGenerated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/waterquality/waterbody/:waterBodyId/trends
// @desc    Get water quality trends for a water body
// @access  Private
router.get('/waterbody/:waterBodyId/trends', protect, async (req, res) => {
  try {
    // const { limit = 30 } = req.query;
    const records = await WaterQuality.find({ waterBodyId: req.params.waterBodyId })
      .select('name year healthScore')
      .sort({ year: 1 });

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/waterquality/waterbody/:waterBodyId/health-trend
// @desc    Get year-wise health trend for a water body
// @access  Private
router.get('/waterbody/:waterBodyId/health-trend', protect, async (req, res) => {
  try {
    const waterBody = await WaterBody.findById(req.params.waterBodyId);
    
    if (!waterBody) {
      return res.status(404).json({
        success: false,
        message: 'Water body not found'
      });
    }

    const records = await WaterQuality.find({ waterBodyId: req.params.waterBodyId })
      .select('year healthScore do ph bod nitrate fecalColiform totalColiform temperature turbidity conductivity')
      .sort({ year: 1 });

    // Group by year and get the latest record for each year
    const yearMap = new Map();
    records.forEach(record => {
      if (!yearMap.has(record.year) || record.date > yearMap.get(record.year).date) {
        yearMap.set(record.year, record);
      }
    });

    const trendData = Array.from(yearMap.values()).map(record => ({
      year: record.year,
      healthScore: record.healthScore,
      do: record.do,
      ph: record.ph,
      bod: record.bod,
      nitrate: record.nitrate,
      fecalColiform: record.fecalColiform,
      totalColiform: record.totalColiform,
      temperature: record.temperature,
      turbidity: record.turbidity,
      conductivity: record.conductivity
    }));

    res.json({
      success: true,
      data: trendData,
      waterBodyName: waterBody.name
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/waterquality/waterbody/:waterBodyId/year/:year
// @desc    Get detailed quality data for a specific water body and year
// @access  Private
router.get('/waterbody/:waterBodyId/year/:year', protect, async (req, res) => {
  try {
    const records = await WaterQuality.find({ 
      waterBodyId: req.params.waterBodyId,
      year: parseInt(req.params.year)
    })
    .populate('waterBodyId', 'name district')
    .populate('testedBy', 'name')
    .sort({ date: -1 });

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No quality records found for this water body and year'
      });
    }

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
