/**
 * Provider Registry - Manages AI provider connections and credentials
 */

export interface Provider {
  name: string;
  apiKey: string;
  models: string[];
  priority: number;
  baseURL?: string;
  
  execute(prompt: string, options?: Record<string, unknown>): Promise<string>;
}

export class ProviderRegistry {
  private providers: Map<string, Provider> = new Map();
  
  /**
   * Register a new provider
   * 
   * @param id Unique identifier for the provider
   * @param provider Provider configuration
   */
  registerProvider(id: string, provider: Provider): void {
    this.providers.set(id, provider);
  }
  
  /**
   * Get a provider by ID
   * 
   * @param id Provider identifier
   * @returns Provider or undefined if not found
   */
  getProvider(id: string): Provider | undefined {
    return this.providers.get(id);
  }
  
  /**
   * Remove a provider
   * 
   * @param id Provider identifier
   * @returns Whether the provider was removed
   */
  removeProvider(id: string): boolean {
    return this.providers.delete(id);
  }
  
  /**
   * List all registered providers
   * 
   * @returns Array of provider IDs and configurations
   */
  listProviders(): Array<{ id: string; provider: Provider }> {
    return Array.from(this.providers.entries()).map(([id, provider]) => ({
      id,
      provider
    }));
  }
  
  /**
   * Get the best provider based on priority
   * 
   * @returns The highest priority provider or undefined if none registered
   */
  getBestProvider(): Provider | undefined {
    let bestProvider: Provider | undefined;
    let highestPriority = -1;
    
    for (const provider of this.providers.values()) {
      if (provider.priority > highestPriority) {
        highestPriority = provider.priority;
        bestProvider = provider;
      }
    }
    
    return bestProvider;
  }
  
  /**
   * Find providers that support a specific model
   * 
   * @param modelName Name of the model to search for
   * @returns Array of provider IDs and configurations that support the model
   */
  findProvidersForModel(modelName: string): Array<{ id: string; provider: Provider }> {
    return Array.from(this.providers.entries())
      .filter(([_, provider]) => provider.models.includes(modelName))
      .map(([id, provider]) => ({ id, provider }));
  }
}
