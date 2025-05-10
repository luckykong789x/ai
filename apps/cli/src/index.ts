#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { 
  ProviderRegistry, 
  DraftIntegrator, 
  CriticEvaluator, 
  PromptModuleManager, 
  ExecutionOrchestrator 
} from 'orchestration-core';

dotenv.config();

const program = new Command();

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

program
  .name('orchestration-cli')
  .description('CLI for AI Prompt Orchestration System')
  .version('0.1.0');

program
  .command('provider')
  .description('Manage AI providers')
  .option('-a, --add <name>', 'Add a provider')
  .option('-l, --list', 'List all providers')
  .action(async (options) => {
    if (options.add) {
      const apiKey = process.env[`${options.add.toUpperCase()}_API_KEY`];
      if (!apiKey) {
        console.error(`Error: API key not found for provider ${options.add}`);
        process.exit(1);
      }

      providerRegistry.addProvider({
        name: options.add,
        apiKey,
        models: [],
        priority: 50
      });

      console.log(`Provider ${options.add} added successfully`);
    } else if (options.list) {
      const providers = providerRegistry.listProviders();
      console.log('Registered providers:');
      providers.forEach(provider => {
        console.log(`- ${provider.name} (Priority: ${provider.priority})`);
      });
    }
  });

program
  .command('prompt')
  .description('Manage prompt modules')
  .option('-a, --add <file>', 'Add a prompt module from JSON file')
  .option('-l, --list', 'List all prompt modules')
  .action(async (options) => {
    if (options.list) {
      console.log('Prompt modules not implemented yet');
    }
  });

program
  .command('execute')
  .description('Execute a prompt module')
  .requiredOption('-m, --module <id>', 'Prompt module ID')
  .option('-c, --context <json>', 'Context for the prompt (JSON string)')
  .action(async (options) => {
    try {
      const context = options.context ? JSON.parse(options.context) : {};
      
      console.log(`Executing prompt module: ${options.module}`);
      
      const result = await orchestrator.executeTask({
        promptModuleId: options.module,
        context,
        loopPolicy: {
          max_rounds: 3,
          min_score: 0.8
        }
      });
      
      console.log('Execution complete:');
      console.log(`Output: ${result.output}`);
      console.log(`Rounds: ${result.round}`);
      
      if (result.feedback) {
        console.log(`Score: ${result.feedback.score}`);
        if (result.feedback.suggestions && result.feedback.suggestions.length > 0) {
          console.log('Suggestions:');
          result.feedback.suggestions.forEach(suggestion => {
            console.log(`- ${suggestion}`);
          });
        }
      }
    } catch (error) {
      console.error('Error executing prompt module:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
