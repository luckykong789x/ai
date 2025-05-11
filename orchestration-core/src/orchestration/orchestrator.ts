import { PromptModule } from '../prompts/module-manager';
import { IntegratorInput, IntegratorOutput } from '../integration/integrator';
import { ProviderRegistry } from '../core/provider-registry';

export interface ExecutionRequest {
  modules: PromptModule[];
  initialContext: Record<string, unknown>;
  pipelineConfig?: PipelineConfig;
}

export interface ModelPromptAssignment {
  providerId: string;
  modelId?: string;
  customPrompt?: string;
}

export interface PipelineConfig {
  maxRounds: number;
  minScore: number;
  breakOnError: boolean;
  modelAssignments?: Record<string, string | ModelPromptAssignment>; // moduleId -> providerId or ModelPromptAssignment
}

export interface PipelineResult {
  finalOutput: Record<string, unknown>;
  executionHistory: ModuleExecutionRecord[];
  success: boolean;
  error?: Error;
}

export interface ModuleExecutionRecord {
  moduleId: string;
  providerId: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  timestamp: Date;
  duration: number;
  success: boolean;
  error?: Error;
}

export interface CriticFeedback {
  score: number;
  suggestions?: string;
  blocking: boolean;
}

/**
 * ExecutionOrchestrator - Core component for orchestrating prompt module execution
 * 
 * Features:
 * - Pipeline execution of multiple prompt modules
 * - Data flow management between modules
 * - Integrated Feedback Loop (IFL) support
 * - Circuit breakers for error handling
 * - Model-specific prompt assignments
 */
export class ExecutionOrchestrator {
  constructor(
    private providerRegistry: ProviderRegistry,
    private defaultPipelineConfig: PipelineConfig = {
      maxRounds: 4,
      minScore: 0.85,
      breakOnError: true
    }
  ) {}

  /**
   * Execute a pipeline of prompt modules
   * 
   * @param request The execution request containing modules and context
   * @returns Pipeline execution result
   */
  async executePipeline(request: ExecutionRequest): Promise<PipelineResult> {
    const { modules, initialContext, pipelineConfig } = request;
    const config = { ...this.defaultPipelineConfig, ...pipelineConfig };
    
    const executionHistory: ModuleExecutionRecord[] = [];
    let pipelineState = { ...initialContext };
    let success = true;
    let error: Error | undefined;

    try {
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        const startTime = Date.now();
        
        try {
          const providerInfo = config.modelAssignments?.[module.id] || 'default';
          
          const moduleResult = await this.executeModule(module, pipelineState, providerInfo);
          
          const providerId = typeof providerInfo === 'string' 
            ? providerInfo 
            : providerInfo.providerId;
            
          executionHistory.push({
            moduleId: module.id,
            providerId,
            input: pipelineState,
            output: moduleResult,
            timestamp: new Date(),
            duration: Date.now() - startTime,
            success: true
          });
          
          pipelineState = {
            ...pipelineState,
            ...moduleResult,
            _previousResults: [
              ...(Array.isArray(pipelineState._previousResults) ? pipelineState._previousResults : []),
              {
                moduleId: module.id,
                result: moduleResult
              }
            ]
          };
          
          if (this.shouldBreakPipeline(moduleResult, module)) {
            break;
          }
        } catch (err) {
          const moduleError = err instanceof Error ? err : new Error(String(err));
          
          const errorProviderInfo = config.modelAssignments?.[module.id] || 'default';
          const errorProviderId = typeof errorProviderInfo === 'string' 
            ? errorProviderInfo 
            : errorProviderInfo.providerId;
            
          executionHistory.push({
            moduleId: module.id,
            providerId: errorProviderId,
            input: pipelineState,
            output: {},
            timestamp: new Date(),
            duration: Date.now() - startTime,
            success: false,
            error: moduleError
          });
          
          if (config.breakOnError) {
            success = false;
            error = moduleError;
            break;
          }
        }
      }
    } catch (err) {
      success = false;
      error = err instanceof Error ? err : new Error(String(err));
    }

    return {
      finalOutput: pipelineState,
      executionHistory,
      success,
      error
    };
  }

  /**
   * Execute a single prompt module with the Integrated Feedback Loop
   * 
   * @param module The prompt module to execute
   * @param context The execution context
   * @param providerId The provider to use for execution
   * @returns Module execution result
   */
  private async executeModule(
    module: PromptModule, 
    context: Record<string, unknown>,
    providerInfo: string | ModelPromptAssignment
  ): Promise<Record<string, unknown>> {
    const providerId = typeof providerInfo === 'string' 
      ? providerInfo 
      : providerInfo.providerId;
    
    const provider = this.providerRegistry.getProvider(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }
    
    const customPrompt = typeof providerInfo !== 'string' ? providerInfo.customPrompt : undefined;

    let currentResult = {};
    let currentScore = 0;
    let rounds = 0;
    const maxRounds = this.defaultPipelineConfig.maxRounds;
    const minScore = this.defaultPipelineConfig.minScore;

    while (rounds < maxRounds && currentScore < minScore) {
      const renderedPrompt = this.renderPrompt(module, context, customPrompt);
      
      const response = await provider.execute(renderedPrompt);
      
      currentResult = this.processResponse(response, module);
      
      const feedback = await this.getCriticFeedback(currentResult, module);
      currentScore = feedback.score;
      
      if (feedback.blocking) {
        break;
      }
      
      context = {
        ...context,
        _feedback: feedback.suggestions,
        _previousResult: currentResult
      };
      
      rounds++;
    }

    return currentResult;
  }

  /**
   * Render a prompt with the given context
   * 
   * @param module The prompt module
   * @param context The context for rendering
   * @returns Rendered prompt
   */
  private renderPrompt(
    module: PromptModule, 
    context: Record<string, unknown>,
    customPrompt?: string
  ): string {
    let prompt = customPrompt || (module.systemPrompt + '\n\n' + module.userTemplate);
    
    for (const [key, value] of Object.entries(context)) {
      const placeholder = `{{${key}}}`;
      if (typeof value === 'string' && prompt.includes(placeholder)) {
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
      }
    }
    
    return prompt;
  }

  /**
   * Process the response from the provider
   * 
   * @param response The provider response
   * @param module The prompt module
   * @returns Processed response
   */
  private processResponse(response: string, module: PromptModule): Record<string, unknown> {
    return {
      result: response,
      moduleId: module.id
    };
  }

  /**
   * Get feedback from the critic
   * 
   * @param result The execution result
   * @param module The prompt module
   * @returns Critic feedback
   */
  private async getCriticFeedback(
    result: Record<string, unknown>, 
    module: PromptModule
  ): Promise<CriticFeedback> {
    return {
      score: 0.9, // Placeholder score
      suggestions: 'Consider improving clarity',
      blocking: false
    };
  }

  /**
   * Determine if the pipeline should break based on module output
   * 
   * @param result The module execution result
   * @param module The prompt module
   * @returns Whether to break the pipeline
   */
  private shouldBreakPipeline(
    result: Record<string, unknown>, 
    module: PromptModule
  ): boolean {
    if (
      typeof result.result === 'string' && 
      module.stopCriteria && 
      result.result.includes(module.stopCriteria.keyword)
    ) {
      return true;
    }
    
    return false;
  }
}
