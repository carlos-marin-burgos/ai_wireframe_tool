#!/bin/bash

# Safe Deployment Script for Designetica
# This script ensures we always deploy to the correct environment

set -e  # Exit on any error

echo "🚀 Designetica Deployment Script"
echo "=================================="

# Check if azd is installed
if ! command -v azd &> /dev/null; then
    echo "❌ Azure Developer CLI (azd) is not installed"
    echo "Install it from: https://aka.ms/azure-dev/install"
    exit 1
fi

# Check azd version and warn if outdated
AZD_VERSION=$(azd version --output json 2>/dev/null | jq -r '.azd.version' || echo "unknown")
echo "📦 Using azd version: $AZD_VERSION"

# Ensure we're in the correct directory
if [ ! -f "azure.yaml" ]; then
    echo "❌ azure.yaml not found. Please run this script from the project root."
    exit 1
fi

# Check current environment
CURRENT_ENV=$(azd env list --output json 2>/dev/null | jq -r '.[] | select(.IsDefault) | .Name' || echo "none")
echo "🌍 Current environment: $CURRENT_ENV"

# Ensure we're using the production environment
if [ "$CURRENT_ENV" != "original-app" ]; then
    echo "⚠️  Current environment is not 'original-app'"
    echo "🔄 Switching to production environment..."
    azd env select original-app
    echo "✅ Switched to original-app environment"
else
    echo "✅ Already using production environment: original-app"
fi

# Show deployment target
FUNCTION_URL=$(azd env get-values | grep AZURE_FUNCTION_APP_URL | cut -d'=' -f2 | tr -d '"')
STATIC_URL=$(azd env get-values | grep AZURE_STATIC_WEB_APP_URL | cut -d'=' -f2 | tr -d '"')

echo ""
echo "📍 Deployment Targets:"
echo "   Backend:  $FUNCTION_URL"
echo "   Frontend: $STATIC_URL"
echo ""

# Confirm deployment
read -p "🤔 Deploy to these URLs? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Deploy
echo "🚀 Starting deployment..."
azd up

# Verify deployment
echo ""
echo "🔍 Verifying deployment..."
sleep 5

# Test health endpoint
echo "Testing backend health..."
if curl -sf "$FUNCTION_URL/api/health" > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed (this might be normal if still starting up)"
fi

# Test OAuth configuration
echo "Testing OAuth configuration..."
OAUTH_CONFIG=$(curl -sf "$FUNCTION_URL/api/figmaOAuthDiagnostics" | jq -r '.config.FIGMA_REDIRECT_URI_PROD // "not found"')
echo "🔐 OAuth redirect URI: $OAUTH_CONFIG"

echo ""
echo "🎉 Deployment completed!"
echo "📝 Remember to test your application thoroughly"
echo ""
echo "📍 Application URLs:"
echo "   🖥️  Frontend: $STATIC_URL"
echo "   ⚙️  Backend:  $FUNCTION_URL"
echo "   🔐 OAuth:    $FUNCTION_URL/api/figmaOAuthStart"