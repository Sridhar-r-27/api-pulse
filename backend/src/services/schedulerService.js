// backend/src/services/schedulerService.js
// Automatically tests APIs on a schedule

const cron = require('node-cron');
const apiTestService = require('./apiTestService');
const monitoredApis = require('../config/apis');

// Store the cron task so we can control it
let schedulerTask = null;
let isSchedulerRunning = false;

/**
 * Test all monitored APIs
 */
const testAllApis = async () => {
  console.log('🔄 Starting scheduled API tests...');
  
  // Filter only enabled APIs
  const enabledApis = monitoredApis.filter(api => api.enabled);
  
  console.log(`📊 Testing ${enabledApis.length} APIs`);
  
  const results = [];
  
  // Test each API
  for (const api of enabledApis) {
    try {
      console.log(`   → Testing ${api.name}...`);
      
      const result = await apiTestService.testApi(api.name, api.url);
      
      if (result.success) {
        console.log(`   ✅ ${api.name}: ${result.data.status} (${result.data.responseTime}ms)`);
      } else {
        console.log(`   ❌ ${api.name}: ${result.error}`);
      }
      
      results.push(result);
      
    } catch (error) {
      console.error(`   ❌ Error testing ${api.name}:`, error.message);
      results.push({
        success: false,
        error: error.message,
        apiName: api.name,
      });
    }
  }
  
  console.log('✅ Scheduled tests completed\n');
  
  return results;
};

/**
 * Start the monitoring scheduler
 * @param {string} schedule - Cron pattern (default: every 5 minutes)
 */
const startScheduler = (schedule = '*/5 * * * *') => {
  // Don't start if already running
  if (isSchedulerRunning) {
    console.log('⚠️  Scheduler is already running');
    return {
      success: false,
      message: 'Scheduler is already running',
    };
  }

  console.log('⏰ Starting API monitoring scheduler...');
  console.log(`📅 Schedule: ${schedule}`);
  console.log('🎯 Monitoring', monitoredApis.filter(api => api.enabled).length, 'APIs\n');
  
  // Run immediately on startup
  testAllApis();
  
  // Schedule to run based on cron pattern
  schedulerTask = cron.schedule(schedule, () => {
    testAllApis();
  });
  
  isSchedulerRunning = true;
  
  console.log('✅ Scheduler started successfully!\n');
  
  return {
    success: true,
    message: 'Scheduler started',
    schedule,
  };
};

/**
 * Stop the scheduler
 */
const stopScheduler = () => {
  if (!isSchedulerRunning || !schedulerTask) {
    console.log('⚠️  Scheduler is not running');
    return {
      success: false,
      message: 'Scheduler is not running',
    };
  }

  console.log('⏸️  Stopping scheduler...');
  schedulerTask.stop();
  isSchedulerRunning = false;
  
  return {
    success: true,
    message: 'Scheduler stopped',
  };
};

/**
 * Resume the scheduler if it was stopped
 */
const resumeScheduler = () => {
  if (isSchedulerRunning) {
    return {
      success: false,
      message: 'Scheduler is already running',
    };
  }

  if (!schedulerTask) {
    return {
      success: false,
      message: 'Scheduler was never started. Use start instead.',
    };
  }

  console.log('▶️  Resuming scheduler...');
  schedulerTask.start();
  isSchedulerRunning = true;
  
  return {
    success: true,
    message: 'Scheduler resumed',
  };
};

/**
 * Get scheduler status
 */
const getSchedulerStatus = () => {
  return {
    success: true,
    data: {
      isRunning: isSchedulerRunning,
      monitoredApis: monitoredApis.filter(api => api.enabled).length,
      totalApis: monitoredApis.length,
    },
  };
};

/**
 * Manually trigger all API tests (doesn't affect scheduler)
 */
const triggerManualTest = async () => {
  console.log('🔔 Manual test triggered by user');
  const results = await testAllApis();
  
  return {
    success: true,
    message: 'Manual test completed',
    data: results,
  };
};

module.exports = {
  startScheduler,
  stopScheduler,
  resumeScheduler,
  getSchedulerStatus,
  testAllApis,
  triggerManualTest,
};

/*
EXPLANATION:

1. testAllApis()
   - Gets list of enabled APIs
   - Loops through each one
   - Calls apiTestService.testApi() for each
   - Logs results

2. startScheduler()
   - Runs testAllApis() immediately
   - Sets up cron job to run every 5 minutes
   - Keeps running in background

3. CRON PATTERN: '*\/5 * * * *'
   *\/5 = Every 5 minutes
   *   = Every hour
   *   = Every day
   *   = Every month
   *   = Every day of week
   
   Other examples:
   '0 * * * *'     = Every hour at minute 0
   '0 0 * * *'     = Every day at midnight
   '*\/10 * * * *'  = Every 10 minutes

HOW IT WORKS:
- Server starts
- Scheduler starts
- Tests all APIs immediately
- Sets timer for 5 minutes
- After 5 minutes, tests all APIs again
- Repeats forever (until server stops)

BENEFITS:
- Continuous monitoring
- Historical data builds up
- Can see trends over time
- Automatic, no manual work needed
*/