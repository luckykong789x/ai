import { z } from 'zod';
import { ProviderRegistry } from '../core/provider-registry';
import { DraftIntegrator, CriticEvaluator, CriticFeedback, IntegratorOutput } from '../integration/integrator';
import { PromptModuleManager, RenderedPrompt } from '../prompts/module-manager';

/**
 * Schema for loop policy
 */
export const LoopPolicySchema = z.object({
  max_rounds: z.number().int().min(1).max(8).default(4),
  min_score: z.number().min(0).max(1).default(0.85)
});

export type LoopPolicy = z.infer<typeof LoopPolicySchema>;

/**
 * Schema for execution request
 */
export const ExecutionRequestSchema = z.object({
  promptModuleId: z.string(),
  context: z.record(z.unknown()),
  providers: z.array(z.string()).optional(),
  loopPolicy: LoopPolicySchema.optional()
});

export type ExecutionRequest = z.infer<typeof ExecutionRequestSchema>;

/**
 * Schema for integration result
 */
export const IntegrationResultSchema = z.object({
  output: z.string(),
  feedback: z.object({
    score: z.number().min(0).max(1),
    suggestions: z.array(z.string()).optional(),
    blockingIssues: z.array(z.string()).optional()
  }).optional(),
  round: z.number().int().min(1),
  complete: z.boolean().default(false)
});

export type IntegrationResult = z.infer<typeof IntegrationResultSchema>;

/**
 * Orchestrates the execution of AI tasks
 */
export class ExecutionOrchestrator {
  private providerRegistry: ProviderRegistry;
  private integrator: DraftIntegrator;
  private critic: CriticEvaluator;
  private promptManager: PromptModuleManager;

  constructor(
    providerRegistry: ProviderRegistry,
    integrator: DraftIntegrator,
    critic: CriticEvaluator,
    promptManager: PromptModuleManager
  ) {
    this.providerRegistry = providerRegistry;
    this.integrator = integrator;
    this.critic = critic;
    this.promptManager = promptManager;
  }

  /**
   * Execute a task with the given request
   * @param request Execution request
   * @returns Integration result
   */
  async executeTask(request: ExecutionRequest): Promise<IntegrationResult> {
    const loopPolicy = request.loopPolicy ?? LoopPolicySchema.parse({});
    
    const renderedPrompt = await this.promptManager.renderModule(
      request.promptModuleId,
      request.context
    );

    const initialResult = await this.executeInitial(renderedPrompt);
    
    if (initialResult.complete) {
      return initialResult;
    }

    let result = initialResult;
    for (let round = 2; round <= loopPolicy.max_rounds; round++) {
      result = await this.executeLoopCycle(result, renderedPrompt, loopPolicy);
      
      if (result.complete) {
        break;
      }
    }

    if (!result.complete) {
      result = {
        ...result,
        complete: true
      };
    }

    return result;
  }

  /**
   * Execute the initial round
   * @param renderedPrompt Rendered prompt
   * @returns Integration result
   */
  private async executeInitial(renderedPrompt: RenderedPrompt): Promise<IntegrationResult> {
    return {
      output: `Initial output for prompt: ${renderedPrompt.id}`,
      round: 1,
      complete: false
    };
  }

  /**
   * Execute a loop cycle
   * @param previousResult Previous integration result
   * @param renderedPrompt Rendered prompt
   * @param loopPolicy Loop policy
   * @returns Updated integration result
   */
  private async executeLoopCycle(
    previousResult: IntegrationResult,
    renderedPrompt: RenderedPrompt,
    loopPolicy: LoopPolicy
  ): Promise<IntegrationResult> {
    
    const feedback = await this.critic.evaluate(previousResult.output);
    
    const shouldStop = this.evaluateLoop(feedback, loopPolicy);
    
    return {
      output: `Improved output for round ${previousResult.round + 1}`,
      feedback: {
        score: feedback.score,
        suggestions: feedback.suggestions ?? [],
        blockingIssues: feedback.blockingIssues ?? []
      },
      round: previousResult.round + 1,
      complete: shouldStop
    };
  }

  /**
   * Evaluate whether to continue or stop the loop
   * @param feedback Critic feedback
   * @param policy Loop policy
   * @returns Whether to stop the loop
   */
  private evaluateLoop(feedback: CriticFeedback, policy: LoopPolicy): boolean {
    if (feedback.blocking) return true;
    if (feedback.score >= policy.min_score) return true;
    return false;
  }
}
