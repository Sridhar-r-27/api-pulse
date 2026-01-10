import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Pause, Play, Clock } from 'lucide-react';
import { 
  getAllApisSummary, 
  getSchedulerStatus, 
  triggerManualTest,
  stopScheduler,
  resumeScheduler,
  getApiHistory
} from './services/api';
import ResponseTimeChart from './components/ResponseTimeChart';

function App() {
  const [apisSummary, setApisSummary] = useState(null);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const [apiHistory, setApiHistory] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [summary, status] = await Promise.all([
        getAllApisSummary(),
        getSchedulerStatus()
      ]);
      setApisSummary(summary.data);
      setSchedulerStatus(status.data);
      setLoading(false);

      // If an API is selected, fetch its history
      if (selectedApi) {
        const history = await getApiHistory(selectedApi, 20);
        setApiHistory(history.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleTestNow = async () => {
    setTesting(true);
    try {
      await triggerManualTest();
      // Wait 2 seconds then refresh data
      setTimeout(fetchData, 2000);
    } catch (error) {
      console.error('Error triggering test:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleToggleScheduler = async () => {
    try {
      if (schedulerStatus.isRunning) {
        await stopScheduler();
      } else {
        await resumeScheduler();
      }
      // Refresh status
      const status = await getSchedulerStatus();
      setSchedulerStatus(status.data);
    } catch (error) {
      console.error('Error toggling scheduler:', error);
    }
  };

  const handleApiClick = async (apiName) => {
    setSelectedApi(apiName);
    try {
      const history = await getApiHistory(apiName, 20);
      setApiHistory(history.data || []);
    } catch (error) {
      console.error('Error fetching API history:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UP': return 'bg-green-500';
      case 'DOWN': return 'bg-red-500';
      case 'SLOW': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'UP': return '✅';
      case 'DOWN': return '❌';
      case 'SLOW': return '⚠️';
      default: return '⭕';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">API Pulse</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Scheduler Status */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                Monitoring: {schedulerStatus?.isRunning ? 
                  <span className="text-green-400 font-medium">Active</span> : 
                  <span className="text-red-400 font-medium">Paused</span>
                }
              </span>
            </div>

            {/* Toggle Scheduler Button */}
            <button
              onClick={handleToggleScheduler}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                schedulerStatus?.isRunning 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {schedulerStatus?.isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Test Now Button */}
            <button
              onClick={handleTestNow}
              disabled={testing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Now'}</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total APIs</p>
            <p className="text-3xl font-bold text-white">{apisSummary?.totalApis || 0}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Monitored</p>
            <p className="text-3xl font-bold text-green-400">{schedulerStatus?.monitoredApis || 0}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">APIs Up</p>
            <p className="text-3xl font-bold text-blue-400">
              {apisSummary?.apis?.filter(api => api.currentStatus === 'UP').length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* API Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Monitored APIs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apisSummary?.apis?.map((api) => (
            <div
              key={api.apiName}
              onClick={() => handleApiClick(api.apiName)}
              className={`bg-slate-800 rounded-lg p-6 border transition cursor-pointer ${
                selectedApi === api.apiName 
                  ? 'border-blue-500 ring-2 ring-blue-500/50' 
                  : 'border-slate-700 hover:border-blue-500'
              }`}
            >
              {/* API Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{api.apiName}</h3>
                <span className="text-2xl">{getStatusEmoji(api.currentStatus)}</span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(api.currentStatus)}`} />
                <span className="text-sm font-medium text-gray-300">{api.currentStatus}</span>
              </div>

              {/* Response Time */}
              <div className="mb-3">
                <p className="text-sm text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-blue-400">{api.lastResponseTime}ms</p>
              </div>

              {/* 24h Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
                <div>
                  <p className="text-xs text-gray-400">24h Tests</p>
                  <p className="text-lg font-semibold text-white">{api.last24hTests}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">24h Uptime</p>
                  <p className="text-lg font-semibold text-green-400">{api.last24hUptime}%</p>
                </div>
              </div>

              {/* Last Checked */}
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-gray-400">
                  Last checked: {new Date(api.lastChecked).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!apisSummary?.apis || apisSummary.apis.length === 0) && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No APIs monitored yet</p>
            <p className="text-sm text-gray-500 mt-2">Add APIs in the configuration file</p>
          </div>
        )}
      </div>

      {/* Chart Section - Shows when API is selected */}
      {selectedApi && apiHistory.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8">
          <ResponseTimeChart data={apiHistory} apiName={selectedApi} />
        </div>
      )}
    </div>
  );
}

export default App;