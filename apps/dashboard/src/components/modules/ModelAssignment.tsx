import React, { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface Provider {
  id: string;
  name: string;
  models: string[];
}

export interface ModelAssignment {
  moduleId: string;
  providerId: string;
  modelId?: string;
  customPrompt?: string;
}

interface ModelAssignmentProps {
  moduleId: string;
  moduleName: string;
  providers: Provider[];
  initialAssignment?: ModelAssignment;
  onSave: (assignment: ModelAssignment) => void;
  onCancel: () => void;
}

const ModelAssignment = ({
  moduleId,
  moduleName,
  providers,
  initialAssignment,
  onSave,
  onCancel
}: ModelAssignmentProps) => {
  const { t } = useLanguage();
  const [providerId, setProviderId] = useState(initialAssignment?.providerId || '');
  const [modelId, setModelId] = useState(initialAssignment?.modelId || '');
  const [customPrompt, setCustomPrompt] = useState(initialAssignment?.customPrompt || '');
  const [useCustomPrompt, setUseCustomPrompt] = useState(!!initialAssignment?.customPrompt);
  
  const selectedProvider = providers.find(p => p.id === providerId);
  
  const handleSave = () => {
    onSave({
      moduleId,
      providerId,
      modelId: modelId || undefined,
      customPrompt: useCustomPrompt ? customPrompt : undefined
    });
  };
  
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Settings className="w-5 h-5 text-accent mr-2" />
          <h3 className="text-xl font-medium text-gray-200">
            {t('modelAssignmentFor')} {moduleName}
          </h3>
        </div>
        <button 
          className="p-1 rounded hover:bg-gray-700"
          onClick={onCancel}
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t('selectProvider')}
          </label>
          <select
            value={providerId}
            onChange={(e) => {
              setProviderId(e.target.value);
              setModelId(''); // Reset model when provider changes
            }}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">{t('selectProvider')}</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedProvider && selectedProvider.models.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('selectModel')}
            </label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">{t('defaultModel')}</option>
              {selectedProvider.models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="useCustomPrompt"
            checked={useCustomPrompt}
            onChange={(e) => setUseCustomPrompt(e.target.checked)}
            className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-accent focus:ring-accent"
          />
          <label htmlFor="useCustomPrompt" className="text-sm font-medium text-gray-400">
            {t('useCustomPrompt')}
          </label>
        </div>
        
        {useCustomPrompt && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('customPrompt')}
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent h-32"
              placeholder={t('customPromptPlaceholder')}
            />
            <p className="text-xs text-gray-400 mt-1">
              {t('customPromptHelp')}
            </p>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-700 rounded-lg text-gray-200 mr-2"
            onClick={onCancel}
          >
            {t('cancel')}
          </button>
          <button
            className="px-4 py-2 bg-accent rounded-lg text-white flex items-center"
            onClick={handleSave}
            disabled={!providerId}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {t('saveAssignment')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelAssignment;
