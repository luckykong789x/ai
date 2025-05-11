import { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Database, Clock } from 'lucide-react';

const Settings = () => {
  const [settings] = useState({
    iflPolicy: {
      maxRounds: 4,
      minScore: 0.85
    },
    cachePolicy: {
      ttlSeconds: 3600,
      maxModules: 20
    },
    ui: {
      theme: 'dark',
      language: 'en'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-200">System Settings</h2>
        <button className="flex items-center px-4 py-2 bg-accent rounded-lg text-white">
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <RefreshCw className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">Integrated Feedback Loop Policy</h3>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Maximum Rounds</label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    min="1" 
                    max="8" 
                    step="1"
                    defaultValue={settings.iflPolicy.maxRounds}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 text-gray-300 w-8 text-center">{settings.iflPolicy.maxRounds}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum number of feedback loop iterations (1-8)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Minimum Score</label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    defaultValue={settings.iflPolicy.minScore}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 text-gray-300 w-8 text-center">{settings.iflPolicy.minScore}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum quality score to accept output (0-1)</p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">Prompt Linkage Engine Cache</h3>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cache TTL (seconds)</label>
                <input 
                  type="number" 
                  min="60" 
                  max="86400"
                  defaultValue={settings.cachePolicy.ttlSeconds}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-gray-500 mt-1">Time-to-live for cached prompt modules (60-86400)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Max Cached Modules</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100"
                  defaultValue={settings.cachePolicy.maxModules}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of modules to keep in cache (1-100)</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="flex items-center px-3 py-1 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600">
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear Cache
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">UI Settings</h3>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
                <select 
                  defaultValue={settings.ui.theme}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                <select 
                  defaultValue={settings.ui.language}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">Performance Metrics</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-400">Initial Response</p>
                <p className="text-2xl font-bold text-gray-200">0.92s</p>
                <p className="text-xs text-gray-500">▲0.02s (Registry lookup)</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-400">PLE Cache Hit</p>
                <p className="text-2xl font-bold text-gray-200">86%</p>
                <p className="text-xs text-gray-500">+2% from v4.5</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-400">Avg IFL Rounds</p>
                <p className="text-2xl font-bold text-gray-200">2.6</p>
                <p className="text-xs text-gray-500">Improved stopping criteria</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="flex items-center px-3 py-1 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600">
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset Metrics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
