import { ExecutionOrchestrator } from '../orchestrator';
import { ProviderRegistry } from '../../core/provider-registry';
import { DraftIntegrator, CriticEvaluator } from '../../integration/integrator';
import { PromptModuleManager } from '../../prompts/module-manager';

jest.mock('../../core/provider-registry');
jest.mock('../../integration/integrator');
jest.mock('../../prompts/module-manager');

describe('ExecutionOrchestrator', () => {
  let orchestrator: ExecutionOrchestrator;
  let providerRegistry: jest.Mocked<ProviderRegistry>;
  let integrator: jest.Mocked<DraftIntegrator>;
  let critic: jest.Mocked<CriticEvaluator>;
  let promptManager: jest.Mocked<PromptModuleManager>;

  beforeEach(() => {
    providerRegistry = new ProviderRegistry() as jest.Mocked<ProviderRegistry>;
    integrator = new DraftIntegrator() as jest.Mocked<DraftIntegrator>;
    critic = new CriticEvaluator() as jest.Mocked<CriticEvaluator>;
    promptManager = new PromptModuleManager() as jest.Mocked<PromptModuleManager>;

    orchestrator = new ExecutionOrchestrator(
      providerRegistry,
      integrator,
      critic,
      promptManager
    );
  });

  test('should execute a task', async () => {
    promptManager.renderModule.mockResolvedValue({
      id: 'test-module',
      systemPrompt: 'You are a helpful assistant.',
      userPrompt: 'Please help with task',
      stopCriteria: {
        keyword: 'DONE',
        maxTurns: 3
      }
    });

    critic.evaluate.mockResolvedValue({
      score: 0.9,
      suggestions: [],
      blocking: false
    });

    const result = await orchestrator.executeTask({
      promptModuleId: 'test-module',
      context: {},
      loopPolicy: {
        max_rounds: 3,
        min_score: 0.8
      }
    });

    expect(result).toBeDefined();
    expect(result.complete).toBe(true);
  });
});
