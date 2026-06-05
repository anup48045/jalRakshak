const express = require('express');
const WaterQuality = require('../models/WaterQuality');
const WaterBody = require('../models/WaterBody');
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');
const { calculateHealthScore, getStatusFromHealthScore, checkAlertThresholds } = require('../utils/healthScore');

const router = express.Router();

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

    const record = await WaterQuality.create(qualityData);

    // Calculate health score
    const healthScore = calculateHealthScore(record);

    // Update water body health score and status
    const status = getStatusFromHealthScore(healthScore);

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
    const alerts = checkAlertThresholds(waterBody, record);

    // Create alerts if thresholds exceeded
    for (const alertData of alerts) {
      await Alert.create(alertData);
    }

    res.status(201).json({
      success: true,
      record,
      healthScore,
      alertsGenerated: alerts.length
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
    const { limit = 30 } = req.query;
    const records = await WaterQuality.find({ waterBodyId: req.params.waterBodyId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      trends: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
