import { useState } from 'react';
import { FileText, Plus, Edit, Trash, Code } from 'lucide-react';

const PromptModules = () => {
  const [modules] = useState([
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-200">Prompt Modules</h2>
        <button className="flex items-center px-4 py-2 bg-accent rounded-lg text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Module
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
                  <p className="text-sm font-medium text-gray-400">System Prompt</p>
                  <div className="bg-gray-700 rounded-lg p-2 mt-1">
                    <p className="text-sm text-gray-300">{module.systemPrompt}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-400">User Template</p>
                  <div className="bg-gray-700 rounded-lg p-2 mt-1">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">{module.userTemplate}</pre>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-400">Stop Criteria</p>
                  <div className="flex space-x-2 mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      Keyword: {module.stopCriteria.keyword}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      Max Turns: {module.stopCriteria.maxTurns}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button className="flex items-center text-sm text-accent">
                  <Code className="w-4 h-4 mr-1" />
                  Execute Module
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-200 mb-4">Create New Module</h3>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Module ID</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. summarize"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. Text Summarizer"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">System Prompt</label>
              <textarea 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent h-20"
                placeholder="You are a helpful assistant that..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">User Template</label>
              <textarea 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent h-20"
                placeholder="Please {{action}} the following {{type}}:\n\n{{content}}"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Stop Keyword</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. DONE"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Max Turns</label>
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-accent rounded-lg text-white"
              >
                Save Module
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromptModules;
