// backend/src/routes/apiTestRoutes.js
// Routes define the URLs/endpoints for our API

const express = require('express');
const router = express.Router();
const apiTestController = require('../controllers/apiTestController');

/**
 * @route   POST /api/test
 * @desc    Test a single API endpoint
 * @access  Public
 */
router.post('/test', apiTestController.testSingleApi);

/**
 * @route   POST /api/test/bulk
 * @desc    Test multiple APIs at once
 * @access  Public
 */
router.post('/test/bulk', apiTestController.testBulkApis);

/**
 * @route   GET /api/tests
 * @desc    Get latest test results
 * @access  Public
 */
router.get('/tests', apiTestController.getLatestTests);

/**
 * @route   GET /api/tests/:apiName
 * @desc    Get test history for specific API
 * @access  Public
 */
router.get('/tests/:apiName', apiTestController.getApiHistory);

/**
 * @route   DELETE /api/tests/old
 * @desc    Delete old test results
 * @access  Public
 */
router.delete('/tests/old', apiTestController.deleteOldTests);

/**
 * @route   DELETE /api/tests/:apiName
 * @desc    Delete all tests for specific API
 * @access  Public
 */
router.delete('/tests/:apiName', apiTestController.deleteApiTests);

/**
 * @route   GET /api/stats/:apiName
 * @desc    Get statistics for specific API
 * @access  Public
 */
router.get('/stats/:apiName', apiTestController.getApiStats);

/**
 * @route   GET /api/summary
 * @desc    Get summary of all monitored APIs
 * @access  Public
 */
router.get('/summary', apiTestController.getAllApisSummary);

module.exports = router;

/*
ROUTE EXPLANATIONS:

POST /api/test
→ User sends: { apiName: "GitHub", apiUrl: "..." }
→ Tests the API and saves result

GET /api/tests
→ Returns recent test results
→ Example: /api/tests?limit=5

GET /api/tests/:apiName
→ Returns history for one API
→ Example: /api/tests/GitHub%20API

GET /api/stats/:apiName
→ Returns statistics for one API
→ Example: /api/stats/GitHub%20API

ROUTING BASICS:
- router.post() = Handle POST requests (creating/sending data)
- router.get() = Handle GET requests (retrieving data)
- :apiName = Route parameter (variable in URL)
- ?limit=10 = Query parameter (optional filters)
*/