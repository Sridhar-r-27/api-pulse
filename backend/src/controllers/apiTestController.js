// backend/src/controllers/apiTestController.js
// Controllers handle incoming requests and send responses

const apiTestService = require('../services/apiTestService');

/**
 * Test a single API
 * POST /api/test
 * Body: { "apiName": "GitHub API", "apiUrl": "https://api.github.com" }
 */
const testSingleApi = async (req, res) => {
  try {
    // Get data from request body
    const { apiName, apiUrl } = req.body;

    // Validate input
    if (!apiName || !apiUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both apiName and apiUrl',
      });
    }

    // Call the service function
    const result = await apiTestService.testApi(apiName, apiUrl);

    // Send response
    return res.status(result.success ? 200 : 500).json(result);

  } catch (error) {
    console.error('Error in testSingleApi:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while testing API',
      error: error.message,
    });
  }
};

/**
 * Get latest test results
 * GET /api/tests?limit=10
 */
const getLatestTests = async (req, res) => {
  try {
    // Get limit from query parameters (default 10)
    const limit = parseInt(req.query.limit) || 10;

    // Call service function
    const result = await apiTestService.getLatestTests(limit);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in getLatestTests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching tests',
      error: error.message,
    });
  }
};

/**
 * Get test history for specific API
 * GET /api/tests/:apiName?limit=20
 */
const getApiHistory = async (req, res) => {
  try {
    const { apiName } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    // Call service function
    const result = await apiTestService.getApiHistory(apiName, limit);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in getApiHistory:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching history',
      error: error.message,
    });
  }
};

/**
 * Get statistics for specific API
 * GET /api/stats/:apiName
 */
const getApiStats = async (req, res) => {
  try {
    const { apiName } = req.params;

    // Call service function
    const result = await apiTestService.getApiStats(apiName);

    return res.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    console.error('Error in getApiStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message,
    });
  }
};

/**
 * Test multiple APIs at once (bulk testing)
 * POST /api/test/bulk
 * Body: { "apis": [{ "apiName": "...", "apiUrl": "..." }, ...] }
 */
const testBulkApis = async (req, res) => {
  try {
    const { apis } = req.body;

    // Validate input
    if (!apis || !Array.isArray(apis) || apis.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of APIs to test',
      });
    }

    // Validate each API has required fields
    for (const api of apis) {
      if (!api.apiName || !api.apiUrl) {
        return res.status(400).json({
          success: false,
          message: 'Each API must have apiName and apiUrl',
        });
      }
    }

    // Call service function
    const result = await apiTestService.testBulkApis(apis);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in testBulkApis:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while bulk testing',
      error: error.message,
    });
  }
};

/**
 * Delete old test results
 * DELETE /api/tests/old?days=30
 */
const deleteOldTests = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    // Call service function
    const result = await apiTestService.deleteOldTests(days);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in deleteOldTests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting old tests',
      error: error.message,
    });
  }
};

/**
 * Delete all tests for a specific API
 * DELETE /api/tests/:apiName
 */
const deleteApiTests = async (req, res) => {
  try {
    const { apiName } = req.params;

    // Call service function
    const result = await apiTestService.deleteApiTests(apiName);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in deleteApiTests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting API tests',
      error: error.message,
    });
  }
};

/**
 * Get summary of all monitored APIs
 * GET /api/summary
 */
const getAllApisSummary = async (req, res) => {
  try {
    // Call service function
    const result = await apiTestService.getAllApisSummary();

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in getAllApisSummary:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching summary',
      error: error.message,
    });
  }
};

// Export all controller functions
module.exports = {
  testSingleApi,
  getLatestTests,
  getApiHistory,
  getApiStats,
  testBulkApis,
  deleteOldTests,
  deleteApiTests,
  getAllApisSummary,
};

/*
WHAT CONTROLLERS DO:

1. Receive HTTP requests
2. Validate input data
3. Call service functions (the kitchen)
4. Send responses back to client

HTTP STATUS CODES:
- 200: Success
- 400: Bad request (user error - missing data)
- 404: Not found
- 500: Server error (our error)

REQUEST/RESPONSE FLOW:
Client → Route → Controller → Service → Database
Database → Service → Controller → Client
*/