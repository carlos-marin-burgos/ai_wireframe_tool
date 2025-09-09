#!/bin/bash

echo "🚀 Force redeployment of Azure Static Web Apps"

# Build the frontend with the latest changes
echo "📦 Building frontend..."
npm run build

# Copy updated analytics files to ensure they're up to date
echo "📊 Updating analytics files..."
cp public/production-analytics.html dist/
cp public/simple-analytics.html dist/ 2>/dev/null || echo "simple-analytics.html not found"
cp public/monitor-analytics.html dist/ 2>/dev/null || echo "monitor-analytics.html not found"

# Commit a minor change to trigger GitHub Actions deployment
echo "🔄 Triggering deployment..."
echo "# Deployment triggered at $(date)" >> .deployment-trigger
git add .deployment-trigger
git add public/production-analytics.html
git commit -m "🚀 Force redeploy with updated analytics endpoint - $(date)"
git push origin working-version

echo "✅ Deployment triggered! Check GitHub Actions for progress."
echo "🌐 Static Web App: https://gray-stone-01d7ca70f.2.azurestaticapps.net/"
echo "🔗 Production Analytics: https://gray-stone-01d7ca70f.2.azurestaticapps.net/production-analytics.html"
