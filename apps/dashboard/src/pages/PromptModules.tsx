import { useState } from 'react';
import { FileText, Plus, Edit, Trash, Code, Layers, ArrowRight } from 'lucide-react';
import PipelineBuilder, { PromptModule, Pipeline } from '../components/modules/PipelineBuilder';
import { useLanguage } from '../contexts/LanguageContext';

const PromptModules = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'modules' | 'pipelines'>('modules');
  const [modules, setModules] = useState<PromptModule[]>([
    { 
      id: 'summarize', 
      title: 'Text Summarizer', 
      systemPrompt: 'You are a helpful assistant that summarizes text.',
      userTemplate: 'Please summarize the following text:\n\n{{text}}',
      stopCriteria: { keyword: 'DONE', maxTurns: 3 }
    },
    { 
      id: 'translate', 
      title: 'Translator', 
      systemPrompt: 'You are a helpful assistant that translates text.',
      userTemplate: 'Please translate the following {{source_lang}} text to {{target_lang}}:\n\n{{text}}',
      stopCriteria: { keyword: 'TRANSLATED', maxTurns: 2 }
    },
    { 
      id: 'analyze', 
      title: 'Content Analyzer', 
      systemPrompt: 'You are a helpful assistant that analyzes content for sentiment and key points.',
      userTemplate: 'Please analyze the following content:\n\n{{content}}',
      stopCriteria: { keyword: 'ANALYSIS_COMPLETE', maxTurns: 4 }
    },
  ]);
  
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: 'pipeline-1',
      name: 'Translation Analysis',
      modules: [
        modules[1], // translate
        modules[2], // analyze
      ],
      connections: [
        { sourceId: 'translate', targetId: 'analyze' }
      ],
      modelAssignments: {
        'translate': 'openai-gpt4',
        'analyze': 'anthropic-claude'
      }
    }
  ]);
  
  const [providers] = useState([
    { id: 'openai-gpt4', name: 'OpenAI GPT-4' },
    { id: 'openai-gpt35', name: 'OpenAI GPT-3.5' },
    { id: 'anthropic-claude', name: 'Anthropic Claude' },
    { id: 'google-gemini', name: 'Google Gemini' },
  ]);

  const handleSavePipeline = (pipeline: Pipeline) => {
    const existingIndex = pipelines.findIndex(p => p.id === pipeline.id);
    
    if (existingIndex >= 0) {
      const updatedPipelines = [...pipelines];
      updatedPipelines[existingIndex] = pipeline;
      setPipelines(updatedPipelines);
    } else {
      setPipelines([...pipelines, pipeline]);
    }
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newModule: PromptModule = {
      id: formData.get('moduleId') as string,
      title: formData.get('moduleTitle') as string,
      systemPrompt: formData.get('systemPrompt') as string,
      userTemplate: formData.get('userTemplate') as string,
      stopCriteria: {
        keyword: formData.get('stopKeyword') as string,
        maxTurns: parseInt(formData.get('maxTurns') as string, 10)
      }
    };
    
    setModules([...modules, newModule]);
    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'modules'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('modules')}
        >
          {t('promptModules')}
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'pipelines'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('pipelines')}
        >
          {t('pipelines')}
        </button>
      </div>

      {activeTab === 'modules' ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-200">{t('promptModules')}</h2>
            <button className="flex items-center px-4 py-2 bg-accent rounded-lg text-white">
              <Plus className="w-4 h-4 mr-2" />
              {t('newModule')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-accent mr-2" />
                      <h3 className="text-xl font-medium text-gray-200">{module.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-700">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-700">
                        <Trash className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-400">ID</p>
                      <p className="text-gray-300">{module.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-400">{t('systemPrompt')}</p>
                      <div className="bg-gray-700 rounded-lg p-2 mt-1">
                        <p className="text-sm text-gray-300">{module.systemPrompt}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-400">{t('userTemplate')}</p>
                      <div className="bg-gray-700 rounded-lg p-2 mt-1">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap">{module.userTemplate}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-400">{t('stopCriteria')}</p>
                      <div className="flex space-x-2 mt-1">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                          {t('keyword')}: {module.stopCriteria.keyword}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                          {t('maxTurns')}: {module.stopCriteria.maxTurns}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <button className="flex items-center text-sm text-accent">
                      <Code className="w-4 h-4 mr-1" />
                      {t('executeModule')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-200 mb-4">{t('createNewModule')}</h3>
              
              <form className="space-y-4" onSubmit={handleModuleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('moduleId')}</label>
                    <input 
                      type="text" 
                      name="moduleId"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g. summarize"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('title')}</label>
                    <input 
                      type="text" 
                      name="moduleTitle"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g. Text Summarizer"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">{t('systemPrompt')}</label>
                  <textarea 
                    name="systemPrompt"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent h-20"
                    placeholder="You are a helpful assistant that..."
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">{t('userTemplate')}</label>
                  <textarea 
                    name="userTemplate"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent h-20"
                    placeholder="Please {{action}} the following {{type}}:\n\n{{content}}"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('stopKeyword')}</label>
                    <input 
                      type="text" 
                      name="stopKeyword"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g. DONE"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('maxTurns')}</label>
                    <input 
                      type="number" 
                      name="maxTurns"
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="3"
                      defaultValue="3"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-accent rounded-lg text-white"
                  >
                    {t('saveModule')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-200">{t('pipelines')}</h2>
            <button 
              className="flex items-center px-4 py-2 bg-accent rounded-lg text-white"
              onClick={() => setActiveTab('pipelines')}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('newPipeline')}
            </button>
          </div>

          {/* Pipeline List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pipelines.map((pipeline) => (
              <div key={pipeline.id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 text-accent mr-2" />
                      <h3 className="text-xl font-medium text-gray-200">{pipeline.name}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-700">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-700">
                        <Trash className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-400">{t('modules')}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pipeline.modules.map((module) => (
                        <span key={module.id} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                          {module.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-400">{t('connections')}</p>
                    <div className="space-y-1 mt-2">
                      {pipeline.connections.map((connection, index) => {
                        const sourceModule = pipeline.modules.find(m => m.id === connection.sourceId);
                        const targetModule = pipeline.modules.find(m => m.id === connection.targetId);
                        
                        return (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <span>{sourceModule?.title || connection.sourceId}</span>
                            <ArrowRight className="w-3 h-3 mx-1 text-accent" />
                            <span>{targetModule?.title || connection.targetId}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <button className="flex items-center text-sm text-accent">
                      <Code className="w-4 h-4 mr-1" />
                      {t('executePipeline')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline Builder */}
          <PipelineBuilder
            availableModules={modules}
            availableProviders={providers}
            onSavePipeline={handleSavePipeline}
          />
        </>
      )}
    </div>
  );
};

export default PromptModules;
