#!/bin/bash

# BAMI Subscription Deployment Script
# This script ensures you're using the correct BAMI subscription for deployments

echo "🔧 Setting up BAMI subscription for deployment..."

# BAMI Subscription Details
BAMI_SUBSCRIPTION_ID="330eaa36-e19f-4d4c-8dea-37c2332f754d"
BAMI_TENANT_ID="54ad0b60-7fda-456b-b965-230c533f1418"

echo "📋 BAMI Subscription ID: $BAMI_SUBSCRIPTION_ID"
echo "🏢 Tenant ID: $BAMI_TENANT_ID"

# Set the subscription
echo "⚙️ Setting Azure CLI subscription..."
az account set --subscription $BAMI_SUBSCRIPTION_ID

# Verify the subscription
echo "✅ Current subscription:"
az account show --query "{name:name, id:id, tenantId:tenantId}" --output table

# Check if logged in
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure CLI"
    echo "🔑 Please run: az login"
    exit 1
fi

echo "🎉 BAMI subscription configured successfully!"
echo ""
echo "🚀 You can now run deployment commands like:"
echo "   npm run deploy:quick"
echo "   az deployment group create..."
echo "   func azure functionapp publish..."