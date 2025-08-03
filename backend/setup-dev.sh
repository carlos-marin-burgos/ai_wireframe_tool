#!/bin/bash

# Development Environment Setup Script for SnapFrame AI Backend
# This script ensures a clean and consistent development environment

set -e  # Exit on any error

echo "🚀 Setting up SnapFrame AI Backend development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📋 Node.js version: $NODE_VERSION"

# Clean existing installation
echo "🧹 Cleaning existing node_modules..."
rm -rf node_modules package-lock.json

# Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Verify dependencies
echo "🔍 Verifying dependency integrity..."
node check-dependencies.js

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️ Warning: .env file not found. You may need to create one with your Azure OpenAI credentials."
    echo "   Required variables:"
    echo "   - AZURE_OPENAI_KEY"
    echo "   - AZURE_OPENAI_ENDPOINT"
    echo "   - AZURE_OPENAI_DEPLOYMENT"
fi

echo "✅ Backend development environment setup complete!"
echo "🏃 You can now run 'npm start' to start the server."
