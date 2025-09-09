#!/bin/bash

# Start Backend Script for Designetica
echo "🚀 Starting Designetica Backend on port 7072..."

# Get the project root (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Navigate to backend directory
cd "$PROJECT_ROOT/backend" || {
    echo "❌ Backend directory not found at $PROJECT_ROOT/backend"
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
