#!/bin/bash

# 🚀 Designetica Azure Deployment Script
# Deploy your updated version to Azure

set -e

# Get the project root (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🎯 Starting Designetica deployment to Azure..."
echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed"
    echo "📦 Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if Azure Developer CLI is installed
if ! command -v azd &> /dev/null; then
    echo "❌ Azure Developer CLI is not installed"
    echo "📦 Installing Azure Developer CLI..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew tap azure/azd && brew install azd
    else
        curl -fsSL https://aka.ms/install-azd.sh | bash
    fi
fi

echo "🔍 Checking Azure authentication..."
if ! az account show &> /dev/null; then
    echo "🔐 Please log in to Azure..."
    az login
fi

echo "🔧 Building frontend for production..."
npm run build

echo "📦 Preparing backend deployment..."
cd "$PROJECT_ROOT/backend"
npm install --production
cd "$PROJECT_ROOT"

echo "🚀 Deploying to Azure..."

# Use existing designetica environment
echo "🔄 Using existing designetica environment..."
azd env select designetica

# Deploy with azd
azd up

# Get deployment outputs
echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is now live:"

# Get Static Web App URL
SWA_URL=$(az staticwebapp show --resource-group rg-Designetica --name stapp-35kjosu4rfnkc --query "defaultHostname" -o tsv 2>/dev/null || echo "")
if [ -n "$SWA_URL" ]; then
    echo "📱 Frontend: https://$SWA_URL"
fi

# Get Function App URL
FUNC_URL=$(az functionapp show --resource-group rg-designetica --name func-designetica-prod-xabnur6oyusju --query "defaultHostName" -o tsv 2>/dev/null || echo "")
if [ -n "$FUNC_URL" ]; then
    echo "🔧 Backend API: https://$FUNC_URL"
fi

echo ""
echo "🌐 Microsoft Azure URL: https://white-flower-006d2370f.1.azurestaticapps.net/"
echo "📊 Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/rg-designetica"
echo ""
echo "🎉 Deployment successful!"
