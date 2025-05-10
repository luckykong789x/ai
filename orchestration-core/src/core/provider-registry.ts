import { z } from 'zod';

/**
 * Schema for AI provider configuration
 */
export const ProviderConfigSchema = z.object({
  name: z.string(),
  apiKey: z.string(),
  baseURL: z.string().url().optional(),
  models: z.array(z.string()),
  priority: z.number().min(0).max(100).default(50)
});

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;

/**
 * Registry for managing AI providers and model selection
 */
export class ProviderRegistry {
  private providers = new Map<string, ProviderConfig>();
  
  /**
   * Add a new provider to the registry
   * @param config Provider configuration
   */
  addProvider(config: ProviderConfig): void {
    this.providers.set(config.name, config);
  }

  /**
   * Get a provider by name
   * @param name Provider name
   * @returns Provider configuration or undefined if not found
   */
  getProvider(name: string): ProviderConfig | undefined {
    return this.providers.get(name);
  }

  /**
   * List all registered providers
   * @returns Array of provider configurations
   */
  listProviders(): ProviderConfig[] {
    return Array.from(this.providers.values());
  }

  /**
   * Select a model based on requirements
   * @param requirements Model selection requirements
   * @returns Selected provider and model, or undefined if no suitable model found
   */
  selectModel(requirements: {
    capability?: 'speed' | 'quality';
    minScore?: number;
  }): { provider: string; model: string } | undefined {
    const providers = this.listProviders()
      .sort((a, b) => b.priority - a.priority);
    
    if (providers.length === 0) {
      return undefined;
    }

    const provider = providers[0];
    if (provider.models.length === 0) {
      return undefined;
    }

    return {
      provider: provider.name,
      model: provider.models[0]
    };
  }
}
