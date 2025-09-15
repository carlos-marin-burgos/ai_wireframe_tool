#!/bin/bash

# Restart Azure Functions Script
# This script properly restarts functions to pick up environment variable changes

echo "🔄 Restarting Azure Functions to pick up environment changes..."

# Kill any existing func processes
echo "🛑 Stopping existing Azure Functions processes..."
pkill -f "func" || true
lsof -ti :7071 | xargs kill -9 2>/dev/null || true
sleep 3

# Navigate to backend directory
cd "$(dirname "$0")/backend" || {
    echo "❌ Error: Could not find backend directory"
    exit 1
}

# Verify we have the required files
if [ ! -f "host.json" ]; then
    echo "❌ Error: host.json not found in $(pwd)"
    echo "Make sure you're in the correct project directory"
    exit 1
fi

echo "✅ Found host.json in $(pwd)"
echo "📂 Working directory: $(pwd)"

# Show current environment variables (masked)
echo "🔍 Environment check:"
if [ -f ".env" ]; then
    echo "   .env file exists: ✅"
    if grep -q "FIGMA_CLIENT_ID" .env; then
        CLIENT_ID=$(grep "FIGMA_CLIENT_ID" .env | cut -d'=' -f2)
        echo "   FIGMA_CLIENT_ID: ${CLIENT_ID:0:8}... (${#CLIENT_ID} chars)"
    fi
    if grep -q "FIGMA_CLIENT_SECRET" .env; then
        SECRET=$(grep "FIGMA_CLIENT_SECRET" .env | cut -d'=' -f2)
        echo "   FIGMA_CLIENT_SECRET: ${SECRET:0:8}... (${#SECRET} chars)"
    fi
else
    echo "   .env file: ❌ Not found"
fi

# Start Azure Functions
echo "🚀 Starting Azure Functions on port 7071..."
func start --port 7071