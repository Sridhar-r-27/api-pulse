// backend/src/routes/schedulerRoutes.js
// Routes for scheduler control

const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedulerController');

/**
 * @route   GET /api/scheduler/status
 * @desc    Get scheduler status (running/stopped)
 * @access  Public
 */
router.get('/status', schedulerController.getSchedulerStatus);

/**
 * @route   POST /api/scheduler/stop
 * @desc    Stop the automatic scheduler
 * @access  Public
 */
router.post('/stop', schedulerController.stopScheduler);

/**
 * @route   POST /api/scheduler/resume
 * @desc    Resume the automatic scheduler
 * @access  Public
 */
router.post('/resume', schedulerController.resumeScheduler);

/**
 * @route   POST /api/scheduler/trigger
 * @desc    Manually trigger all API tests right now
 * @access  Public
 */
router.post('/trigger', schedulerController.triggerManualTest);

module.exports = router;

/*
SCHEDULER ENDPOINTS:

GET  /api/scheduler/status  - Check if scheduler is running
POST /api/scheduler/stop    - Pause automatic testing
POST /api/scheduler/resume  - Resume automatic testing  
POST /api/scheduler/trigger - Test all APIs immediately

EXAMPLE USAGE:
- Frontend dashboard shows: "Monitoring: Active ✅" or "Monitoring: Paused ⏸️"
- User clicks "Test Now" → Calls /trigger
- User clicks "Pause Monitoring" → Calls /stop
- User clicks "Resume Monitoring" → Calls /resume
*/