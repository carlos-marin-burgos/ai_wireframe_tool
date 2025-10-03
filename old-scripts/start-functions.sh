#!/bin/bash

# Start Azure Functions Script
# This script ensures the functions start from the correct directory every time

echo "🚀 Starting Azure Functions..."

# Kill any existing func processes
echo "🛑 Stopping existing Azure Functions processes..."
pkill -f "func" || true
sleep 2

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
echo "📂 Current directory: $(pwd)"

# Start Azure Functions
echo "🔄 Starting Azure Functions..."
func start --port 7071
