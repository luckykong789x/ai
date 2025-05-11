import { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Database, Clock } from 'lucide-react';
import { t } from '@/lib/i18n';

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
        <h2 className="text-2xl font-bold text-gray-200">{t('settings')}</h2>
        <button className="flex items-center px-4 py-2 bg-accent rounded-lg text-accent-foreground">
          <Save className="w-4 h-4 mr-2" />
          {t('saveAllChanges')}
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <RefreshCw className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">{t('integratedFeedbackLoop')}</h3>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('maximumRounds')}</label>
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
                <p className="text-xs text-gray-500 mt-1">{t('maximumRounds')}の設定範囲 (1-8)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('minimumScore')}</label>
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
                <p className="text-xs text-gray-500 mt-1">{t('minimumScore')}の設定範囲 (0-1)</p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">{t('promptLinkageEngine')}</h3>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('cacheTTL')}</label>
                <input 
                  type="number" 
                  min="60" 
                  max="86400"
                  defaultValue={settings.cachePolicy.ttlSeconds}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-gray-500 mt-1">{t('cacheTTL')}の設定範囲 (60-86400)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('maxCachedModules')}</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100"
                  defaultValue={settings.cachePolicy.maxModules}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-gray-500 mt-1">{t('maxCachedModules')}の設定範囲 (1-100)</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="flex items-center px-3 py-1 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600">
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('clearCache')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">{t('uiSettings')}</h3>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('theme')}</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('language')}</label>
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
            <h3 className="text-xl font-medium text-gray-200">{t('performanceMetrics')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-400">{t('initialResponse')}</p>
                <p className="text-2xl font-bold text-gray-200">0.92s</p>
                <p className="text-xs text-gray-500">▲0.02s (Registry lookup)</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-400">{t('pleCacheHit')}</p>
                <p className="text-2xl font-bold text-gray-200">86%</p>
                <p className="text-xs text-gray-500">+2% from v4.5</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-400">{t('avgIFLRounds')}</p>
                <p className="text-2xl font-bold text-gray-200">2.6</p>
                <p className="text-xs text-gray-500">{t('improvedStoppingCriteria')}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="flex items-center px-3 py-1 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600">
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('resetMetrics')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
