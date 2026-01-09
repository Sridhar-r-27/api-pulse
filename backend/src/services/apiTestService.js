// backend/src/services/apiTestService.js
// This service contains the logic to test external APIs

const axios = require('axios');
const ApiTest = require('../models/ApiTest');

/**
 * Test a single API endpoint
 * @param {string} apiName - Name of the API (e.g., "GitHub API")
 * @param {string} apiUrl - URL to test (e.g., "https://api.github.com")
 * @returns {object} Test result
 */
const testApi = async (apiName, apiUrl) => {
  // Record start time to calculate response time
  const startTime = Date.now();
  
  try {
    // Make HTTP GET request to the API
    const response = await axios.get(apiUrl, {
      timeout: 5000, // Wait max 5 seconds
      validateStatus: () => true, // Accept any status code
    });

    // Calculate how long it took
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Determine API status based on response time and status code
    let status = 'UP';
    if (response.status >= 400) {
      status = 'DOWN';
    } else if (responseTime > 2000) {
      status = 'SLOW'; // More than 2 seconds is slow
    }

    // Create the test result object
    const testResult = {
      apiName,
      apiUrl,
      statusCode: response.status,
      responseTime,
      status,
      errorMessage: status === 'DOWN' ? `HTTP ${response.status}` : null,
      testedAt: new Date(),
    };

    // Save to database
    const savedResult = await ApiTest.create(testResult);

    return {
      success: true,
      data: savedResult,
    };

  } catch (error) {
    // If API request failed completely (network error, timeout, etc.)
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const testResult = {
      apiName,
      apiUrl,
      statusCode: 0, // 0 means couldn't connect
      responseTime,
      status: 'DOWN',
      errorMessage: error.message,
      testedAt: new Date(),
    };

    // Save failed test to database
    const savedResult = await ApiTest.create(testResult);

    return {
      success: false,
      data: savedResult,
      error: error.message,
    };
  }
};

/**
 * Get latest test results for all APIs
 * @param {number} limit - How many results to return
 * @returns {array} Array of test results
 */
const getLatestTests = async (limit = 10) => {
  try {
    const results = await ApiTest.find()
      .sort({ testedAt: -1 }) // Sort by newest first
      .limit(limit);

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get test history for a specific API
 * @param {string} apiName - Name of the API
 * @param {number} limit - How many results to return
 * @returns {array} Array of test results
 */
const getApiHistory = async (apiName, limit = 20) => {
  try {
    const results = await ApiTest.find({ apiName })
      .sort({ testedAt: -1 })
      .limit(limit);

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get statistics for an API (avg response time, uptime %)
 * @param {string} apiName - Name of the API
 * @returns {object} Statistics
 */
const getApiStats = async (apiName) => {
  try {
    const tests = await ApiTest.find({ apiName });

    if (tests.length === 0) {
      return {
        success: false,
        error: 'No test data found for this API',
      };
    }

    // Calculate statistics
    const totalTests = tests.length;
    const upTests = tests.filter(t => t.status === 'UP').length;
    const downTests = tests.filter(t => t.status === 'DOWN').length;
    const slowTests = tests.filter(t => t.status === 'SLOW').length;

    const avgResponseTime = tests.reduce((sum, test) => sum + test.responseTime, 0) / totalTests;
    const uptimePercentage = ((upTests + slowTests) / totalTests) * 100;

    return {
      success: true,
      data: {
        apiName,
        totalTests,
        upTests,
        downTests,
        slowTests,
        avgResponseTime: Math.round(avgResponseTime),
        uptimePercentage: Math.round(uptimePercentage * 100) / 100,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Test multiple APIs at once (bulk testing)
 * @param {array} apis - Array of {apiName, apiUrl} objects
 * @returns {object} Results for all APIs
 */
const testBulkApis = async (apis) => {
  try {
    const results = [];

    // Test each API
    for (const api of apis) {
      const result = await testApi(api.apiName, api.apiUrl);
      results.push(result);
    }

    return {
      success: true,
      data: results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete test results older than specified days
 * @param {number} days - Delete tests older than this many days
 * @returns {object} Deletion result
 */
const deleteOldTests = async (days = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await ApiTest.deleteMany({
      testedAt: { $lt: cutoffDate },
    });

    return {
      success: true,
      data: {
        deletedCount: result.deletedCount,
        cutoffDate: cutoffDate.toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete all test results for a specific API
 * @param {string} apiName - Name of the API
 * @returns {object} Deletion result
 */
const deleteApiTests = async (apiName) => {
  try {
    const result = await ApiTest.deleteMany({ apiName });

    return {
      success: true,
      data: {
        deletedCount: result.deletedCount,
        apiName,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get summary of all monitored APIs
 * @returns {object} Summary of all APIs
 */
const getAllApisSummary = async () => {
  try {
    // Get unique API names
    const apiNames = await ApiTest.distinct('apiName');

    const summaries = [];

    // Get latest test for each API
    for (const apiName of apiNames) {
      const latestTest = await ApiTest.findOne({ apiName })
        .sort({ testedAt: -1 });

      // Get basic stats
      const last24hTests = await ApiTest.find({
        apiName,
        testedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      const upCount = last24hTests.filter(t => t.status === 'UP').length;
      const downCount = last24hTests.filter(t => t.status === 'DOWN').length;

      summaries.push({
        apiName,
        currentStatus: latestTest.status,
        lastChecked: latestTest.testedAt,
        lastResponseTime: latestTest.responseTime,
        last24hTests: last24hTests.length,
        last24hUptime: last24hTests.length > 0
          ? Math.round((upCount / last24hTests.length) * 100)
          : 0,
      });
    }

    return {
      success: true,
      data: {
        totalApis: apiNames.length,
        apis: summaries,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Export all functions
module.exports = {
  testApi,
  getLatestTests,
  getApiHistory,
  getApiStats,
  testBulkApis,
  deleteOldTests,
  deleteApiTests,
  getAllApisSummary,
};

/*
WHAT THIS SERVICE DOES:

1. testApi() - Tests an API and saves result to database
   - Makes HTTP request
   - Measures response time
   - Determines if UP/DOWN/SLOW
   - Saves to MongoDB

2. getLatestTests() - Gets recent test results
   - Shows what APIs were tested recently

3. getApiHistory() - Gets all tests for one specific API
   - Shows history: was it up yesterday? last week?

4. getApiStats() - Calculates statistics
   - Average response time
   - Uptime percentage
   - How many times it was down

THINK OF IT AS:
This is like a doctor examining patients (APIs) and keeping medical records (test results).
*/