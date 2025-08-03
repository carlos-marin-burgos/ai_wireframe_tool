#!/bin/bash
# start-with-config-check.sh - Start the backend with automatic configuration check

echo "🔍 Checking Azure OpenAI configuration..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "🔧 Creating Azure OpenAI configuration..."
    
    # Check if template exists
    if [ -f ".env.template" ]; then
        echo "📋 Using .env.template as base..."
        cp .env.template .env
    fi
    
    # Create or update .env with known working configuration
    cat > .env << EOF
# Designetica Backend - Development Mode
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Azure OpenAI Configuration - Enabled
AZURE_OPENAI_KEY=66db9d9ce0ba4fdf854a48e3f5bf1d73
AZURE_OPENAI_ENDPOINT=https://cog-35kjosu4rfnkc.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=designetica-gpt4o

# Development Note: Using AI-powered suggestions from Azure OpenAI with gpt-4o model
EOF
    
    echo "✅ Azure OpenAI configuration created!"
fi

# Verify configuration
echo "🔧 Verifying Azure OpenAI configuration..."
if grep -q "AZURE_OPENAI_KEY=66db9d9ce0ba4fdf854a48e3f5bf1d73" .env; then
    echo "✅ Azure OpenAI configuration looks good!"
else
    echo "⚠️  Azure OpenAI configuration may need updating"
fi

echo "🚀 Starting backend server..."
npm start
