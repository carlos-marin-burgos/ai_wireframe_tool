#!/bin/bash

# Start Backend Script for Designetica
echo "🚀 Starting Designetica Backend on port 7072..."

# Navigate to backend directory
cd "$(dirname "$0")/backend" 2>/dev/null || cd backend 2>/dev/null || {
    echo "❌ Backend directory not found. Make sure you're running this from the project root."
    exit 1
}

# Check if Azure Functions Core Tools is installed
if ! command -v func &> /dev/null; then
    echo "❌ Azure Functions Core Tools not found."
    echo "📥 Install it with: npm install -g azure-functions-core-tools@4"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start Azure Functions on port 7072
echo "🔄 Starting Azure Functions on port 7072..."
func start --port 7072
