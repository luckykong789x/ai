# AI Prompt Orchestration System

A modern TypeScript/Node.js implementation of an AI Prompt Orchestration System with a focus on type safety and modular architecture.

## Core Components

### Provider Registry
Manages AI provider configurations and handles model selection based on requirements.

### Integrator Module (IFL Core)
Integrates drafts from multiple AI providers and provides feedback through a critic evaluator.

### Prompt Linkage Engine (PLE)
Manages externally defined prompt modules with template rendering and caching capabilities.

### Execution Orchestration
Orchestrates the execution of AI tasks with integrated feedback loops and circuit breakers.

## Project Structure

```
ai-prompt-orchestration/
├── orchestration-core/      # Core library
│   ├── src/
│   │   ├── core/            # Core components
│   │   ├── integration/     # Integration components
│   │   ├── prompts/         # Prompt management
│   │   └── orchestration/   # Execution orchestration
│   └── ...
├── apps/
│   ├── cli/                 # Command-line interface
│   ├── dashboard/           # Admin dashboard
│   └── server/              # API server
└── ...
```

## Development

### Prerequisites
- Node.js 20+ with WebAssembly support

### Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Usage

```typescript
import { 
  ProviderRegistry, 
  DraftIntegrator, 
  CriticEvaluator, 
  PromptModuleManager, 
  ExecutionOrchestrator 
} from 'orchestration-core';

// Initialize components
const providerRegistry = new ProviderRegistry();
const integrator = new DraftIntegrator();
const critic = new CriticEvaluator();
const promptManager = new PromptModuleManager();
const orchestrator = new ExecutionOrchestrator(
  providerRegistry, 
  integrator, 
  critic, 
  promptManager
);

// Add a provider
providerRegistry.addProvider({
  name: 'openai',
  apiKey: process.env.OPENAI_API_KEY!,
  models: ['gpt-4', 'gpt-3.5-turbo'],
  priority: 80
});

// Add a prompt module
promptManager.addModule({
  id: 'summarize',
  title: 'Text Summarization',
  systemPrompt: 'You are a helpful assistant that summarizes text.',
  userTemplate: 'Please summarize the following text:\n\n{{text}}',
  stopCriteria: {
    keyword: 'SUMMARY_COMPLETE',
    maxTurns: 3
  }
});

// Execute a task
async function main() {
  const result = await orchestrator.executeTask({
    promptModuleId: 'summarize',
    context: {
      text: 'Lorem ipsum dolor sit amet...'
    },
    loopPolicy: {
      max_rounds: 3,
      min_score: 0.8
    }
  });
  
  console.log(result.output);
}

main().catch(console.error);
```
