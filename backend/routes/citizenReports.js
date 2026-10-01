const express = require('express');
const CitizenReport = require('../models/CitizenReport');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/citizen-reports
// @desc    Get all citizen reports
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, waterBodyId, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (waterBodyId) query.waterBodyId = waterBodyId;

    const reports = await CitizenReport.find(query)
      .populate('waterBodyId', 'name district')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: reports.length,
      reports: reports || []
    });
  } catch (error) {
    console.error('Citizen reports fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch citizen reports'
    });
  }
});

// @route   GET /api/citizen-reports/:id
// @desc    Get single citizen report
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await CitizenReport.findById(req.params.id)
      .populate('waterBodyId')
      .populate('verifiedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/citizen-reports
// @desc    Create new citizen report
// @access  Public
router.post('/', async (req, res) => {
  try {
    const report = await CitizenReport.create(req.body);
    res.status(201).json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/citizen-reports/:id/verify
// @desc    Verify citizen report
// @access  Private/Admin/Official/Officer
router.put('/:id/verify', protect, authorize('admin', 'official', 'officer'), async (req, res) => {
  try {
    const { status, verificationNotes } = req.body;

    const report = await CitizenReport.findByIdAndUpdate(
      req.params.id,
      {
        status,
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        verificationNotes
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/citizen-reports/:id
// @desc    Delete citizen report
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const report = await CitizenReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
