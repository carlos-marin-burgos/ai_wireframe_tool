# SnapFrame AI Backend

Backend server for the AI-powered wireframe generator.

## Prerequisites

- Node.js v18+
- npm v8+
- Azure OpenAI account with deployed model

## Quick Start

### First Time Setup

```bash
# Run the development environment setup script
./setup-dev.sh

# Setup Azure OpenAI configuration
./setup-azure-config.sh
```

**OR manually create `.env` file:**

```bash
# Copy the template and fill in your Azure credentials
cp .env.template .env
# Edit .env with your actual Azure OpenAI credentials
```

**Required Azure OpenAI settings:**

- `AZURE_OPENAI_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint (format: `https://your-resource.openai.azure.com/`)
- `AZURE_OPENAI_DEPLOYMENT`: Your model deployment name (e.g., designetica-gpt4o)

### Daily Development

```bash
# Start the server (includes automatic dependency verification)
npm start

# Or start without verification (faster)
node index.js
```

## Available Scripts

- `npm start` - Start the server with dependency verification
- `npm run dev` - Start the server (alias for start)
- `npm run verify` - Check dependency integrity
- `npm run clean` - Remove node_modules and package-lock.json
- `npm run fresh-install` - Clean install dependencies
- `./setup-dev.sh` - Complete development environment setup

## Dependency Management

This project includes several safeguards to prevent dependency corruption:

1. **Integrity Checker** (`check-dependencies.js`) - Verifies critical dependencies haven't been modified
2. **Automatic Verification** - Dependencies are checked before starting the server
3. **Locked Versions** - Uses exact versions and package-lock.json
4. **Clean Install Scripts** - Easy commands to reset the environment

## Environment Variables

Create a `.env` file with:

```env
AZURE_OPENAI_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
PORT=5001
```

## Troubleshooting

### "Cannot use import statement outside a module" Error

This usually indicates corrupted dependencies. Fix with:

```bash
npm run fresh-install
```

### Dependency Corruption

If you suspect dependency corruption:

```bash
# Check integrity
npm run verify

# If verification fails, reset everything
npm run fresh-install
```

### VS Code Issues

- Ensure you're opening files from the correct directory
- Node modules are excluded from search/file operations by default
- Use the integrated terminal to run commands

## API Endpoints

- `POST /api/generate-wireframe` - Generate React component from description

## Development Best Practices

1. Always run `npm run verify` if you suspect dependency issues
2. Use `npm run fresh-install` instead of manual cleanup
3. Don't modify files in `node_modules` directly
4. Use the provided scripts for dependency management
