#!/bin/bash

# Designetica Fast Deployment Script
echo "🚀 Preparing fast deployment..."

# Navigate to backend directory
cd "$(dirname "$0")/backend"

echo "📦 Backing up original package.json..."
cp package.json package.json.backup

echo "🔧 Switching to deployment package.json..."
cp package.deploy.json package.json

echo "🧹 Cleaning up node_modules..."
rm -rf node_modules

echo "⚡ Installing production dependencies only..."
npm ci --only=production

echo "🗂️ Removing development files..."
# The .funcignore file will handle most exclusions

echo "✅ Deployment preparation complete!"
echo "📊 Deployment size optimized:"
du -sh . 2>/dev/null || echo "Size calculation unavailable"

echo ""
echo "Now run: azd deploy"
echo ""
echo "After deployment, restore original package.json with:"
echo "cd backend && cp package.json.backup package.json"
