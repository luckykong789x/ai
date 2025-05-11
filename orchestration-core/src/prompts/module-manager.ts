/**
 * Prompt Module Manager - Manages prompt modules with CRUD operations
 */

export interface StopCriteria {
  keyword: string;
  maxTurns: number;
}

export interface PromptModule {
  id: string;
  title: string;
  systemPrompt: string;
  userTemplate: string;
  stopCriteria: StopCriteria;
}

export interface RenderedPrompt {
  systemPrompt: string;
  userPrompt: string;
  moduleId: string;
}

export class PromptModuleManager {
  private modules: Map<string, PromptModule> = new Map();
  private cache: Map<string, RenderedPrompt> = new Map();
  private cacheTTL: number = 3600 * 1000; // 1 hour in milliseconds
  private cacheTimestamps: Map<string, number> = new Map();
  
  /**
   * Register a new prompt module
   * 
   * @param module Prompt module to register
   */
  registerModule(module: PromptModule): void {
    this.modules.set(module.id, module);
  }
  
  /**
   * Get a prompt module by ID
   * 
   * @param moduleId Module identifier
   * @returns Prompt module or undefined if not found
   */
  getModule(moduleId: string): PromptModule | undefined {
    return this.modules.get(moduleId);
  }
  
  /**
   * Remove a prompt module
   * 
   * @param moduleId Module identifier
   * @returns Whether the module was removed
   */
  removeModule(moduleId: string): boolean {
    this.clearModuleCache(moduleId);
    return this.modules.delete(moduleId);
  }
  
  /**
   * List all registered prompt modules
   * 
   * @returns Array of module IDs and configurations
   */
  listModules(): Array<{ id: string; module: PromptModule }> {
    return Array.from(this.modules.entries()).map(([id, module]) => ({
      id,
      module
    }));
  }
  
  /**
   * Render a prompt module with the given context
   * 
   * @param moduleId Module identifier
   * @param context Context for rendering
   * @returns Rendered prompt
   */
  renderModule(moduleId: string, context: Record<string, unknown>): RenderedPrompt {
    const module = this.getModule(moduleId);
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }
    
    const cacheKey = this.generateCacheKey(moduleId, context);
    
    if (this.cache.has(cacheKey)) {
      const timestamp = this.cacheTimestamps.get(cacheKey) || 0;
      if (Date.now() - timestamp < this.cacheTTL) {
        return this.cache.get(cacheKey)!;
      }
    }
    
    const systemPrompt = this.renderTemplate(module.systemPrompt, context);
    const userPrompt = this.renderTemplate(module.userTemplate, context);
    
    const renderedPrompt: RenderedPrompt = {
      systemPrompt,
      userPrompt,
      moduleId
    };
    
    this.cache.set(cacheKey, renderedPrompt);
    this.cacheTimestamps.set(cacheKey, Date.now());
    
    return renderedPrompt;
  }
  
  /**
   * Clear cache for a specific module
   * 
   * @param moduleId Module identifier
   */
  clearModuleCache(moduleId: string): void {
    for (const [key] of this.cache.entries()) {
      if (key.startsWith(`${moduleId}:`)) {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }
  }
  
  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }
  
  /**
   * Set cache TTL
   * 
   * @param ttlSeconds TTL in seconds
   */
  setCacheTTL(ttlSeconds: number): void {
    this.cacheTTL = ttlSeconds * 1000;
  }
  
  /**
   * Generate cache key for a module and context
   * 
   * @param moduleId Module identifier
   * @param context Context for rendering
   * @returns Cache key
   */
  private generateCacheKey(moduleId: string, context: Record<string, unknown>): string {
    return `${moduleId}:${JSON.stringify(context)}`;
  }
  
  /**
   * Render a template with the given context
   * 
   * @param template Template string
   * @param context Context for rendering
   * @returns Rendered template
   */
  private renderTemplate(template: string, context: Record<string, unknown>): string {
    let result = template;
    
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      }
    }
    
    return result;
  }
}
