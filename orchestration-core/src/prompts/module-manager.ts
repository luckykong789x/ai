import { z } from 'zod';

/**
 * Schema for prompt module
 */
export const PromptModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  systemPrompt: z.string(),
  userTemplate: z.string(),
  stopCriteria: z.object({
    keyword: z.string(),
    maxTurns: z.number().int().min(1).max(10)
  })
});

export type PromptModule = z.infer<typeof PromptModuleSchema>;

/**
 * Schema for rendered prompt
 */
export const RenderedPromptSchema = z.object({
  id: z.string(),
  systemPrompt: z.string(),
  userPrompt: z.string(),
  stopCriteria: z.object({
    keyword: z.string(),
    maxTurns: z.number().int().min(1).max(10)
  })
});

export type RenderedPrompt = z.infer<typeof RenderedPromptSchema>;

/**
 * Schema for prompt cache policy
 */
export const PromptCachePolicySchema = z.object({
  ttl_seconds: z.number().min(60).max(86400).default(3600),
  max_modules: z.number().int().min(1).max(100).default(20)
});

export type PromptCachePolicy = z.infer<typeof PromptCachePolicySchema>;

/**
 * Simple in-memory LRU cache implementation
 */
class LRUCache<K, V> {
  private cache = new Map<K, { value: V, timestamp: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(options: { max: number, ttl: number }) {
    this.maxSize = options.max;
    this.ttl = options.ttl;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.value;
  }
}

/**
 * Manages prompt modules and rendering
 */
export class PromptModuleManager {
  private modules = new Map<string, PromptModule>();
  private cache: LRUCache<string, RenderedPrompt>;
  private cachePolicy: PromptCachePolicy;

  constructor(cachePolicy?: Partial<PromptCachePolicy>) {
    this.cachePolicy = PromptCachePolicySchema.parse({
      ttl_seconds: cachePolicy?.ttl_seconds ?? 3600,
      max_modules: cachePolicy?.max_modules ?? 20
    });
    
    this.cache = new LRUCache<string, RenderedPrompt>({
      max: this.cachePolicy.max_modules,
      ttl: this.cachePolicy.ttl_seconds * 1000
    });
  }

  /**
   * Add a prompt module
   * @param module Prompt module to add
   */
  addModule(module: PromptModule): void {
    this.modules.set(module.id, module);
  }

  /**
   * Get a prompt module by ID
   * @param id Module ID
   * @returns Prompt module or undefined if not found
   */
  getModule(id: string): PromptModule | undefined {
    return this.modules.get(id);
  }

  /**
   * Render a prompt module with context
   * @param moduleId Module ID
   * @param context Context for template rendering
   * @returns Rendered prompt
   */
  async renderModule(
    moduleId: string,
    context: Record<string, unknown>
  ): Promise<RenderedPrompt> {
    const cacheKey = `${moduleId}-${JSON.stringify(context)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const module = this.getModule(moduleId);
    if (!module) {
      throw new Error(`Prompt module not found: ${moduleId}`);
    }

    let userPrompt = module.userTemplate;
    for (const [key, value] of Object.entries(context)) {
      userPrompt = userPrompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    const rendered: RenderedPrompt = {
      id: module.id,
      systemPrompt: module.systemPrompt,
      userPrompt,
      stopCriteria: module.stopCriteria
    };

    this.cache.set(cacheKey, rendered);

    return rendered;
  }
}
