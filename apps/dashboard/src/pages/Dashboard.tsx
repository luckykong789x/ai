import { BarChart, LineChart, PieChart, Activity, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Total Executions</h3>
            <Activity className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold mt-2">1,248</p>
          <p className="text-sm text-gray-400 mt-1">+12% from last week</p>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Avg. Score</h3>
            <BarChart className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold mt-2">0.86</p>
          <p className="text-sm text-gray-400 mt-1">+0.02 from last week</p>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Prompt Modules</h3>
            <PieChart className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold mt-2">24</p>
          <p className="text-sm text-gray-400 mt-1">+3 new this week</p>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Avg. IFL Rounds</h3>
            <LineChart className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold mt-2">2.6</p>
          <p className="text-sm text-gray-400 mt-1">-0.2 from last week</p>
        </div>
      </div>
      
      {/* Performance Chart */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-medium text-gray-200 mb-4">Performance Metrics</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">Chart placeholder - will be implemented with recharts</p>
        </div>
      </div>
      
      {/* Recent Executions */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-medium text-gray-200 mb-4">Recent Executions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Module</th>
                <th className="pb-3 font-medium">Provider</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-3 text-gray-300">EX-{1000 + i}</td>
                  <td className="py-3 text-gray-300">Summarize</td>
                  <td className="py-3 text-gray-300">OpenAI/gpt-4</td>
                  <td className="py-3 text-gray-300">0.{Math.floor(Math.random() * 20) + 80}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                      Complete
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">2m ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* System Alerts */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-gray-200">System Alerts</h3>
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300">2 Warnings</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-start p-4 rounded-lg bg-gray-700">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-200">High API Usage</h4>
              <p className="text-sm text-gray-400 mt-1">
                OpenAI API usage is approaching your monthly limit (85%).
              </p>
            </div>
          </div>
          <div className="flex items-start p-4 rounded-lg bg-gray-700">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-200">Cache Performance</h4>
              <p className="text-sm text-gray-400 mt-1">
                PLE Cache hit rate has dropped below 80%. Consider adjusting cache policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
