import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ResponseTimeChart({ data, apiName }) {
  // Transform data for chart
  const chartData = data.map(test => ({
    time: new Date(test.testedAt).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    responseTime: test.responseTime,
    status: test.status
  })).reverse(); // Reverse to show oldest to newest

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-300 mb-1">{payload[0].payload.time}</p>
          <p className="text-lg font-bold text-blue-400">
            {payload[0].value}ms
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Status: {payload[0].payload.status}
          </p>
        </div>
      );
    }
    return null;
  };

  // Determine line color based on average response time
  const avgResponseTime = chartData.reduce((sum, d) => sum + d.responseTime, 0) / chartData.length;
  const lineColor = avgResponseTime > 2000 ? '#f59e0b' : avgResponseTime > 1000 ? '#3b82f6' : '#10b981';

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        {apiName} - Response Time Trend
      </h3>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px', color: '#cbd5e1' }}
            />
            <Line 
              type="monotone" 
              dataKey="responseTime" 
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6 }}
              name="Response Time"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Stats below chart */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-700">
          <div>
            <p className="text-xs text-gray-400 mb-1">Average</p>
            <p className="text-xl font-bold text-blue-400">
              {Math.round(avgResponseTime)}ms
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Min</p>
            <p className="text-xl font-bold text-green-400">
              {Math.min(...chartData.map(d => d.responseTime))}ms
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Max</p>
            <p className="text-xl font-bold text-red-400">
              {Math.max(...chartData.map(d => d.responseTime))}ms
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResponseTimeChart;