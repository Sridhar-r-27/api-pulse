// backend/src/controllers/schedulerController.js
// Controller for scheduler operations

const schedulerService = require('../services/schedulerService');

/**
 * Get scheduler status
 * GET /api/scheduler/status
 */
const getSchedulerStatus = async (req, res) => {
  try {
    const result = schedulerService.getSchedulerStatus();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getSchedulerStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while getting scheduler status',
      error: error.message,
    });
  }
};

/**
 * Stop the scheduler
 * POST /api/scheduler/stop
 */
const stopScheduler = async (req, res) => {
  try {
    const result = schedulerService.stopScheduler();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in stopScheduler:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while stopping scheduler',
      error: error.message,
    });
  }
};

/**
 * Resume the scheduler
 * POST /api/scheduler/resume
 */
const resumeScheduler = async (req, res) => {
  try {
    const result = schedulerService.resumeScheduler();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in resumeScheduler:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while resuming scheduler',
      error: error.message,
    });
  }
};

/**
 * Manually trigger all API tests
 * POST /api/scheduler/trigger
 */
const triggerManualTest = async (req, res) => {
  try {
    const result = await schedulerService.triggerManualTest();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in triggerManualTest:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while triggering manual test',
      error: error.message,
    });
  }
};

module.exports = {
  getSchedulerStatus,
  stopScheduler,
  resumeScheduler,
  triggerManualTest,
};

/*
WHAT THESE CONTROLLERS DO:

1. getSchedulerStatus() - Check if scheduler is running
2. stopScheduler() - Pause automatic testing
3. resumeScheduler() - Resume automatic testing
4. triggerManualTest() - Test all APIs right now (manually)

USEFUL FOR:
- Dashboard showing if monitoring is active
- "Test Now" button in frontend
- Pause monitoring during maintenance
- Control from frontend UI
*/