#!/bin/bash
# setup-azure-config.sh - Quick setup script for Azure OpenAI configuration

echo "🔧 Setting up Azure OpenAI configuration..."

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Create .env file with Azure OpenAI configuration
cat > .env << EOF
# Designetica Backend - Development Mode
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Azure OpenAI Configuration - Enabled
AZURE_OPENAI_KEY=your-azure-openai-key-here
AZURE_OPENAI_ENDPOINT=https://cog-35kjosu4rfnkc.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=designetica-gpt4o

# Development Note: Using AI-powered suggestions from Azure OpenAI with gpt-4o model
EOF

echo "✅ Azure OpenAI configuration created successfully!"
echo "📋 Configuration details:"
echo "   - Endpoint: https://cog-35kjosu4rfnkc.openai.azure.com/"
echo "   - Deployment: designetica-gpt4o"
echo "   - Key: [REDACTED]"
echo ""
echo "🚀 You can now run 'npm start' to start the backend server"
