import { ProviderRegistry, ProviderConfig } from '../provider-registry';

describe('ProviderRegistry', () => {
  let registry: ProviderRegistry;
  let sampleProvider: ProviderConfig;

  beforeEach(() => {
    registry = new ProviderRegistry();
    sampleProvider = {
      name: 'test-provider',
      apiKey: 'test-api-key',
      models: ['model-1', 'model-2'],
      priority: 50
    };
  });

  test('should add a provider', () => {
    registry.addProvider(sampleProvider);
    const provider = registry.getProvider(sampleProvider.name);
    expect(provider).toEqual(sampleProvider);
  });

  test('should list all providers', () => {
    registry.addProvider(sampleProvider);
    const providers = registry.listProviders();
    expect(providers).toHaveLength(1);
    expect(providers[0]).toEqual(sampleProvider);
  });

  test('should select a model', () => {
    registry.addProvider(sampleProvider);
    const selection = registry.selectModel({});
    expect(selection).toBeDefined();
    expect(selection?.provider).toBe(sampleProvider.name);
    expect(selection?.model).toBe(sampleProvider.models[0]);
  });
});
