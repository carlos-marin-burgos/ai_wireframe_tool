#!/bin/bash

# Designetica Post-Deployment Cleanup Script
echo "🔄 Restoring development environment..."

# Navigate to backend directory
cd "$(dirname "$0")/backend"

echo "📦 Restoring original package.json..."
if [ -f package.json.backup ]; then
    cp package.json.backup package.json
    rm package.json.backup
    echo "✅ Original package.json restored"
else
    echo "⚠️  No backup found, keeping current package.json"
fi

echo "🔧 Reinstalling all dependencies (including dev)..."
npm install

echo "✅ Development environment restored!"
echo "You can now continue local development."
