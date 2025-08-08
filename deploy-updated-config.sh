#!/bin/bash

# Quick deployment script to update Azure Static Web App with new Function App URL
echo "🚀 Deploying updated configuration to Azure Static Web App..."

# Build the frontend with updated API configuration
echo "📦 Building frontend with new API configuration..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Copy the updated production-analytics.html to the dist folder
    echo "📋 Copying updated analytics page..."
    cp production-analytics.html dist/
    
    # Show the updated configuration
    echo "🔧 Updated Configuration:"
    echo "   Frontend: https://gray-stone-01d7ca70f.2.azurestaticapps.net/"
    echo "   Backend:  https://func-prod-fresh-u62277mynzfg4.azurewebsites.net/api"
    echo "   Analytics: https://gray-stone-01d7ca70f.2.azurestaticapps.net/production-analytics.html"
    
    echo ""
    echo "📋 Next Steps:"
    echo "1. Your frontend build is ready in the 'dist' folder"
    echo "2. Deploy to Azure Static Web Apps (auto-deploy should trigger from git push)"
    echo "3. Test the analytics page after deployment"
    echo ""
    echo "🧪 Quick Test Commands:"
    echo "   # Test new backend directly:"
    echo "   curl https://func-prod-fresh-u62277mynzfg4.azurewebsites.net/api/health"
    echo ""
    echo "   # Test after deployment:"
    echo "   curl https://gray-stone-01d7ca70f.2.azurestaticapps.net/production-analytics.html"
    
else
    echo "❌ Build failed! Please check for errors and try again."
    exit 1
fi
