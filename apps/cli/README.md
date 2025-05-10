# AI Prompt Orchestration CLI

Command-line interface for the AI Prompt Orchestration System.

## Installation

```bash
npm install -g orchestration-cli
```

## Usage

### Managing Providers

Add a provider:

```bash
orchestration-cli provider --add openai
```

Note: This requires the `OPENAI_API_KEY` environment variable to be set.

List all providers:

```bash
orchestration-cli provider --list
```

### Managing Prompt Modules

List all prompt modules:

```bash
orchestration-cli prompt --list
```

### Executing Prompts

Execute a prompt module:

```bash
orchestration-cli execute --module summarize --context '{"text":"Lorem ipsum dolor sit amet"}'
```

## Environment Variables

Create a `.env` file with your API keys:

```
OPENAI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
```

## Development

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Run in development mode
npm run dev
```
