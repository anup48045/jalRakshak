const express = require('express');
const WaterBody = require('../models/WaterBody');
const Survey = require('../models/Survey');
const WaterQuality = require('../models/WaterQuality');
const Alert = require('../models/Alert');
const CitizenReport = require('../models/CitizenReport');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalWaterBodies = await WaterBody.countDocuments();

    const currentYear = new Date().getFullYear();

    const healthyWaterBodies =
      await WaterQuality.countDocuments({
        year: currentYear,
        status: 'excellent'
      });
    const moderateWaterBodies =
      await WaterQuality.countDocuments({
        year: currentYear,
        status: 'good'
      });
    const criticalWaterBodies =
      await WaterQuality.countDocuments({
        year: currentYear,
        status: 'critical'
      });
    const activeAlerts = await Alert.countDocuments({ resolved: false });
    const surveysCompleted = await Survey.countDocuments();
    const citizenReports = await CitizenReport.countDocuments();
    const totalOfficers = await User.countDocuments({ role: 'officer' });

    res.json({
      success: true,
      stats: {
        totalWaterBodies,
        healthyWaterBodies,
        moderateWaterBodies,
        criticalWaterBodies,
        activeAlerts,
        surveysCompleted,
        citizenReports,
        totalOfficers
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/district-stats
// @desc    Get district-wise statistics
// @access  Private
router.get('/district-stats', protect, async (req, res) => {
  try {
    const districtStats = await WaterBody.aggregate([
      {
        $group: {
          _id: '$district',
          totalWaterBodies: { $sum: 1 },
          healthy: { $sum: { $cond: [{ $eq: ['$status', 'healthy'] }, 1, 0] } },
          moderate: { $sum: { $cond: [{ $eq: ['$status', 'moderate'] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$status', 'critical'] }, 1, 0] } },
          avgHealthScore: { $avg: '$healthScore' }
        }
      },
      {
        $sort: { totalWaterBodies: -1 }
      }
    ]);

    res.json({
      success: true,
      districtStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/dashboard/recent-alerts
// @desc    Get recent alerts
// @access  Private
router.get('/recent-alerts', protect, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const alerts = await Alert.find({ resolved: false })
      .populate('waterBodyId', 'name district')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      alerts: alerts || []
    });
  } catch (error) {
    console.error('Dashboard recent alerts error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recent alerts'
    });
  }
});

// @route   GET /api/dashboard/recent-surveys
// @desc    Get recent surveys
// @access  Private
router.get('/recent-surveys', protect, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const surveys = await Survey.find()
      .populate('waterBodyId', 'name district')
      .populate('officerId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      surveys: surveys || []
    });
  } catch (error) {
    console.error('Dashboard recent surveys error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recent surveys'
    });
  }
});

// @route   GET /api/dashboard/quality-trends
// @desc    Get water quality trends
// @access  Private
router.get('/quality-trends', protect, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await WaterQuality.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          avgDO: { $avg: '$do' },
          avgPH: { $avg: '$ph' },
          avgBOD: { $avg: '$bod' },
          avgNitrate: { $avg: '$nitrate' },
          avgFecalColiform: { $avg: '$fecalColiform' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
