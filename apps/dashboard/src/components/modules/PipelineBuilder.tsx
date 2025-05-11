import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Plus, X, Settings, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface PromptModule {
  id: string;
  title: string;
  systemPrompt: string;
  userTemplate: string;
  stopCriteria: {
    keyword: string;
    maxTurns: number;
  };
}

export interface ModuleConnection {
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface ModelAssignment {
  providerId: string;
  modelId?: string;
  customPrompt?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  modules: PromptModule[];
  connections: ModuleConnection[];
  modelAssignments: Record<string, string | ModelAssignment>; // moduleId -> providerId or ModelAssignment
}

interface PipelineBuilderProps {
  availableModules: PromptModule[];
  availableProviders: Array<{ id: string; name: string }>;
  onSavePipeline: (pipeline: Pipeline) => void;
  initialPipeline?: Pipeline;
}

const PipelineBuilder = ({
  availableModules,
  availableProviders,
  onSavePipeline,
  initialPipeline
}: PipelineBuilderProps) => {
  const { t } = useLanguage();
  const [pipelineName, setPipelineName] = useState(initialPipeline?.name || '');
  const [selectedModules, setSelectedModules] = useState<PromptModule[]>(initialPipeline?.modules || []);
  const [connections, setConnections] = useState<ModuleConnection[]>(initialPipeline?.connections || []);
  const [modelAssignments, setModelAssignments] = useState<Record<string, string | ModelAssignment>>(
    initialPipeline?.modelAssignments || {}
  );
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [showModelAssignments, setShowModelAssignments] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addModule = (module: PromptModule) => {
    if (!selectedModules.find(m => m.id === module.id)) {
      setSelectedModules([...selectedModules, module]);
    }
  };

  const removeModule = (moduleId: string) => {
    setSelectedModules(selectedModules.filter(m => m.id !== moduleId));
    setConnections(connections.filter(c => c.sourceId !== moduleId && c.targetId !== moduleId));
    
    const newModelAssignments = { ...modelAssignments };
    delete newModelAssignments[moduleId];
    setModelAssignments(newModelAssignments);
  };

  const startConnection = (moduleId: string) => {
    setConnectingFrom(moduleId);
  };

  const completeConnection = (targetId: string) => {
    if (connectingFrom && connectingFrom !== targetId) {
      if (!connections.some(c => c.sourceId === connectingFrom && c.targetId === targetId)) {
        setConnections([
          ...connections,
          { sourceId: connectingFrom, targetId }
        ]);
      }
      setConnectingFrom(null);
    }
  };

  const removeConnection = (sourceId: string, targetId: string) => {
    setConnections(connections.filter(c => !(c.sourceId === sourceId && c.targetId === targetId)));
  };

  const assignModel = (moduleId: string, providerId: string, modelId?: string, customPrompt?: string) => {
    if (modelId || customPrompt) {
      setModelAssignments({
        ...modelAssignments,
        [moduleId]: {
          providerId,
          ...(modelId && { modelId }),
          ...(customPrompt && { customPrompt })
        }
      });
    } else {
      setModelAssignments({
        ...modelAssignments,
        [moduleId]: providerId
      });
    }
  };

  const savePipeline = () => {
    if (!pipelineName) {
      alert(t('pipelineNameRequired'));
      return;
    }

    onSavePipeline({
      id: initialPipeline?.id || `pipeline-${Date.now()}`,
      name: pipelineName,
      modules: selectedModules,
      connections,
      modelAssignments
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = canvas.parentElement?.offsetWidth || 800;
    canvas.height = canvas.parentElement?.offsetHeight || 600;

    ctx.strokeStyle = '#3B82F6'; // accent color
    ctx.lineWidth = 2;

    connections.forEach(connection => {
      const sourceElement = document.getElementById(`module-${connection.sourceId}`);
      const targetElement = document.getElementById(`module-${connection.targetId}`);

      if (sourceElement && targetElement) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const startX = sourceRect.right - canvasRect.left;
        const startY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
        const endX = targetRect.left - canvasRect.left;
        const endY = targetRect.top + targetRect.height / 2 - canvasRect.top;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle - Math.PI / 6),
          endY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle + Math.PI / 6),
          endY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    });

    if (connectingFrom) {
      const sourceElement = document.getElementById(`module-${connectingFrom}`);
      if (sourceElement) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const startX = sourceRect.right - canvasRect.left;
        const startY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;

        const handleMouseMove = (e: MouseEvent) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          connections.forEach(connection => {
            const srcElement = document.getElementById(`module-${connection.sourceId}`);
            const tgtElement = document.getElementById(`module-${connection.targetId}`);
            
            if (srcElement && tgtElement) {
              const srcRect = srcElement.getBoundingClientRect();
              const tgtRect = tgtElement.getBoundingClientRect();
              
              const sX = srcRect.right - canvasRect.left;
              const sY = srcRect.top + srcRect.height / 2 - canvasRect.top;
              const eX = tgtRect.left - canvasRect.left;
              const eY = tgtRect.top + tgtRect.height / 2 - canvasRect.top;
              
              ctx.beginPath();
              ctx.moveTo(sX, sY);
              ctx.lineTo(eX, eY);
              ctx.stroke();
              
              const angle = Math.atan2(eY - sY, eX - sX);
              const arrowLength = 10;
              ctx.beginPath();
              ctx.moveTo(eX, eY);
              ctx.lineTo(
                eX - arrowLength * Math.cos(angle - Math.PI / 6),
                eY - arrowLength * Math.sin(angle - Math.PI / 6)
              );
              ctx.moveTo(eX, eY);
              ctx.lineTo(
                eX - arrowLength * Math.cos(angle + Math.PI / 6),
                eY - arrowLength * Math.sin(angle + Math.PI / 6)
              );
              ctx.stroke();
            }
          });
          
          const mouseX = e.clientX - canvasRect.left;
          const mouseY = e.clientY - canvasRect.top;
          
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
          ctx.setLineDash([]);
        };
        
        canvas.addEventListener('mousemove', handleMouseMove);
        
        return () => {
          canvas.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }
  }, [connections, connectingFrom, selectedModules]);

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-200">{t('pipelineBuilder')}</h3>
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200"
              onClick={() => setShowModelAssignments(!showModelAssignments)}
            >
              <Settings className="w-4 h-4 mr-1.5" />
              {t('modelAssignments')}
            </button>
            <button
              className="flex items-center px-3 py-1.5 bg-accent hover:bg-blue-600 rounded-lg text-sm text-white"
              onClick={savePipeline}
            >
              <Save className="w-4 h-4 mr-1.5" />
              {t('savePipeline')}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">{t('pipelineName')}</label>
          <input
            type="text"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t('enterPipelineName')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Modules */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h4 className="text-lg font-medium text-gray-300 mb-3">{t('availableModules')}</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableModules.map((module) => (
                <div
                  key={module.id}
                  className="bg-gray-800 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-200 font-medium">{module.title}</p>
                    <p className="text-gray-400 text-sm">{module.id}</p>
                  </div>
                  <button
                    className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
                    onClick={() => addModule(module)}
                  >
                    <Plus className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Canvas */}
          <div className="lg:col-span-2 bg-gray-700 rounded-xl p-4 relative min-h-[400px]">
            <h4 className="text-lg font-medium text-gray-300 mb-3">{t('pipelineCanvas')}</h4>
            
            {/* Canvas for drawing connections */}
            <div className="relative h-full">
              <canvas ref={canvasRef} className="absolute inset-0 z-0" />
              
              {/* Modules */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedModules.map((module) => (
                  <div
                    id={`module-${module.id}`}
                    key={module.id}
                    className={`bg-gray-800 rounded-lg p-3 border ${
                      connectingFrom === module.id ? 'border-accent' : 'border-gray-600'
                    } ${
                      modelAssignments[module.id] ? 'border-l-4 border-l-green-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-200 font-medium">{module.title}</p>
                      <div className="flex space-x-1">
                        <button
                          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
                          onClick={() => startConnection(module.id)}
                          title={t('connectFromThisModule')}
                        >
                          <ArrowRight className="w-4 h-4 text-gray-300" />
                        </button>
                        {connectingFrom && connectingFrom !== module.id && (
                          <button
                            className="p-1 rounded-full bg-accent hover:bg-blue-600"
                            onClick={() => completeConnection(module.id)}
                            title={t('connectToThisModule')}
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        )}
                        <button
                          className="p-1 rounded-full bg-gray-700 hover:bg-red-600"
                          onClick={() => removeModule(module.id)}
                          title={t('removeFromPipeline')}
                        >
                          <X className="w-4 h-4 text-gray-300" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{module.id}</p>
                    {modelAssignments[module.id] && (
                      <div className="mt-2 text-xs text-gray-400">
                        {t('assignedTo')}: {(() => {
                          if (typeof modelAssignments[module.id] === 'string') {
                            return availableProviders.find(p => p.id === modelAssignments[module.id])?.name || 
                                  String(modelAssignments[module.id]);
                          } else {
                            const assignment = modelAssignments[module.id] as ModelAssignment;
                            const providerName = availableProviders.find(p => p.id === assignment.providerId)?.name || 
                                               assignment.providerId;
                            return assignment.modelId 
                              ? `${providerName} (${assignment.modelId})` 
                              : providerName;
                          }
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Connection list */}
            {connections.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <h5 className="text-sm font-medium text-gray-400 mb-2">{t('connections')}</h5>
                <div className="space-y-2">
                  {connections.map((connection, index) => {
                    const sourceModule = selectedModules.find(m => m.id === connection.sourceId);
                    const targetModule = selectedModules.find(m => m.id === connection.targetId);
                    
                    return (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
                        <div className="flex items-center">
                          <span className="text-gray-300">{sourceModule?.title || connection.sourceId}</span>
                          <ArrowRight className="w-4 h-4 mx-2 text-accent" />
                          <span className="text-gray-300">{targetModule?.title || connection.targetId}</span>
                        </div>
                        <button
                          className="p-1 rounded-full bg-gray-700 hover:bg-red-600"
                          onClick={() => removeConnection(connection.sourceId, connection.targetId)}
                        >
                          <X className="w-3 h-3 text-gray-300" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Model Assignments Panel */}
        {showModelAssignments && (
          <div className="mt-6 bg-gray-700 rounded-xl p-4">
            <h4 className="text-lg font-medium text-gray-300 mb-3">{t('modelAssignments')}</h4>
            <div className="space-y-3">
              {selectedModules.map((module) => (
                <div key={module.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200">{module.title}</p>
                    <p className="text-gray-400 text-sm">{module.id}</p>
                  </div>
                  <select
                    value={
                      typeof modelAssignments[module.id] === 'string' 
                        ? modelAssignments[module.id] as string 
                        : (modelAssignments[module.id] as ModelAssignment)?.providerId || ''
                    }
                    onChange={(e) => assignModel(module.id, e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">{t('selectProvider')}</option>
                    {availableProviders.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineBuilder;
