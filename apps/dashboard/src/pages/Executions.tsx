import { useState } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Executions = () => {
  const [executions] = useState([
    { 
      id: 'EX-1001', 
      moduleId: 'summarize',
      moduleTitle: 'Text Summarizer',
      provider: 'OpenAI/gpt-4',
      status: 'complete',
      score: 0.92,
      rounds: 2,
      timestamp: '2025-05-10T14:23:45Z',
      duration: '1.2s',
      input: 'AI Prompt Orchestration System is a framework for managing and executing AI prompts with integrated feedback loops.',
      output: 'The AI Prompt Orchestration System provides a structured framework for managing AI prompts and includes integrated feedback loops for improved results.',
    },
    { 
      id: 'EX-1002', 
      moduleId: 'translate',
      moduleTitle: 'Translator',
      provider: 'Anthropic/claude-2',
      status: 'complete',
      score: 0.88,
      rounds: 3,
      timestamp: '2025-05-10T14:15:22Z',
      duration: '1.8s',
      input: 'The system architecture includes a Provider Registry, Prompt Linkage Engine, and Integrated Feedback Loop.',
      output: 'システムアーキテクチャには、プロバイダーレジストリ、プロンプトリンケージエンジン、統合フィードバックループが含まれています。',
    },
    { 
      id: 'EX-1003', 
      moduleId: 'analyze',
      moduleTitle: 'Content Analyzer',
      provider: 'OpenAI/gpt-3.5-turbo',
      status: 'failed',
      score: 0.45,
      rounds: 4,
      timestamp: '2025-05-10T13:58:10Z',
      duration: '2.3s',
      input: 'The performance metrics show improved response times and higher cache hit rates in version 4.6.',
      output: 'Error: Provider API rate limit exceeded',
    },
  ]);

  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedExecution === id) {
      setExpandedExecution(null);
    } else {
      setExpandedExecution(id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-200">Executions</h2>
        <button className="flex items-center px-4 py-2 bg-accent rounded-lg text-white">
          <Play className="w-4 h-4 mr-2" />
          New Execution
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Play className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-xl font-medium text-gray-200">Recent Executions</h3>
          </div>
          
          <div className="space-y-4">
            {executions.map((execution) => (
              <div 
                key={execution.id} 
                className="bg-gray-700 rounded-xl overflow-hidden"
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(execution.id)}
                >
                  <div className="flex items-center">
                    {getStatusIcon(execution.status)}
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-200">{execution.id}: {execution.moduleTitle}</h4>
                      <p className="text-sm text-gray-400">{formatDate(execution.timestamp)} • {execution.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <div className="text-sm font-medium text-gray-200">Score: {execution.score}</div>
                      <div className="text-xs text-gray-400">Rounds: {execution.rounds}</div>
                    </div>
                    {expandedExecution === execution.id ? 
                      <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </div>
                
                {expandedExecution === execution.id && (
                  <div className="p-4 border-t border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Input</h5>
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-sm text-gray-300">{execution.input}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Output</h5>
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-sm text-gray-300">{execution.output}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-600 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Module ID</p>
                        <p className="text-sm text-gray-300">{execution.moduleId}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="text-sm text-gray-300">{execution.duration}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="text-sm text-gray-300 capitalize">{execution.status}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-400">Provider</p>
                        <p className="text-sm text-gray-300">{execution.provider}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-200 mb-4">New Execution</h3>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Prompt Module</label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Select a module</option>
                  <option value="summarize">Text Summarizer</option>
                  <option value="translate">Translator</option>
                  <option value="analyze">Content Analyzer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Provider (Optional)</label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Auto-select</option>
                  <option value="openai/gpt-4">OpenAI/gpt-4</option>
                  <option value="openai/gpt-3.5-turbo">OpenAI/gpt-3.5-turbo</option>
                  <option value="anthropic/claude-2">Anthropic/claude-2</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Input Context (JSON)</label>
              <textarea 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent h-32 font-mono"
                placeholder='{"text": "AI Prompt Orchestration System is a framework..."}'
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-accent rounded-lg text-white"
              >
                Execute
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Executions;
