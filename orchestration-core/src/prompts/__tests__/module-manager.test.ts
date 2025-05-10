import { PromptModuleManager, PromptModule } from '../module-manager';

describe('PromptModuleManager', () => {
  let manager: PromptModuleManager;
  let sampleModule: PromptModule;

  beforeEach(() => {
    manager = new PromptModuleManager();
    sampleModule = {
      id: 'test-module',
      title: 'Test Module',
      systemPrompt: 'You are a helpful assistant.',
      userTemplate: 'Please help with {{task}}',
      stopCriteria: {
        keyword: 'DONE',
        maxTurns: 3
      }
    };
  });

  test('should add a module', () => {
    manager.addModule(sampleModule);
    const module = manager.getModule(sampleModule.id);
    expect(module).toEqual(sampleModule);
  });

  test('should render a module', async () => {
    manager.addModule(sampleModule);
    const context = { task: 'summarizing this text' };
    const rendered = await manager.renderModule(sampleModule.id, context);
    expect(rendered.id).toBe(sampleModule.id);
    expect(rendered.userPrompt).toBe('Please help with summarizing this text');
  });
});
