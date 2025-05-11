import { useState } from 'react';
import { Server, Plus, Trash, Edit } from 'lucide-react';
import { t } from '@/lib/i18n';

const Providers = () => {
  const [providers] = useState([
    { id: 1, name: 'OpenAI', apiKey: 'sk-***********', models: ['gpt-4', 'gpt-3.5-turbo'], priority: 80 },
    { id: 2, name: 'Anthropic', apiKey: 'sk-***********', models: ['claude-2', 'claude-instant'], priority: 60 },
    { id: 3, name: 'Cohere', apiKey: 'sk-***********', models: ['command', 'command-light'], priority: 40 },
    { id: 4, name: 'DeepSeek', apiKey: 'sk-***********', models: ['deepseek-chat'], priority: 70 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-200">AI Providers</h2>
        <button className="flex items-center px-4 py-2 bg-accent rounded-lg text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          {t('addProvider')}
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Server className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">{t('registeredProviders')}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">{t('providerName')}</th>
                  <th className="pb-3 font-medium">{t('apiKey')}</th>
                  <th className="pb-3 font-medium">{t('models')}</th>
                  <th className="pb-3 font-medium">{t('priority')}</th>
                  <th className="pb-3 font-medium">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider.id} className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">{provider.name}</td>
                    <td className="py-4 text-gray-300">{provider.apiKey}</td>
                    <td className="py-4 text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {provider.models.map((model, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                            {model}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">{provider.priority}</td>
                    <td className="py-4 text-gray-300">
                      <div className="flex space-x-2">
                        <button className="p-1 rounded hover:bg-gray-700">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-700">
                          <Trash className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-200 mb-4">{t('addNewProvider')}</h3>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('providerName')}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. OpenAI"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('apiKey')}</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="sk-..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('models')} (comma separated)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="gpt-4, gpt-3.5-turbo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('priority')} (0-100)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="50"
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-accent rounded-lg text-accent-foreground"
              >
                {t('saveProvider')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Providers;
