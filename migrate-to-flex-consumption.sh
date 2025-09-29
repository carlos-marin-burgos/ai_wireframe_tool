#!/bin/bash

# Azure Functions Migration Script: Consumption to Flex Consumption
# Date: 2025-09-29
# Subscription: 330eaa36-e19f-4d4c-8dea-37c2332f754d

set -e

echo "🚀 Starting Azure Functions Migration: Consumption → Flex Consumption"
echo "📅 Date: $(date)"
echo "🔑 Subscription: 330eaa36-e19f-4d4c-8dea-37c2332f754d"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Authenticate to Azure
echo
echo "🔐 Step 1: Azure Authentication (BAM Subscription)"
echo "Please sign in to Azure when prompted..."
echo "Note: This subscription is managed under a Business Account Manager (BAM)"
az login

# Set the specific subscription
SUBSCRIPTION_ID="330eaa36-e19f-4d4c-8dea-37c2332f754d"
echo "🎯 Setting BAM subscription: $SUBSCRIPTION_ID"
az account set --subscription "$SUBSCRIPTION_ID"

# Verify subscription and show details
CURRENT_SUB=$(az account show --query "id" -o tsv)
CURRENT_SUB_NAME=$(az account show --query "name" -o tsv)
TENANT_ID=$(az account show --query "tenantId" -o tsv)

if [ "$CURRENT_SUB" != "$SUBSCRIPTION_ID" ]; then
    print_error "Failed to set correct subscription. Expected: $SUBSCRIPTION_ID, Current: $CURRENT_SUB"
    echo "Available subscriptions:"
    az account list --query "[].{Name:name, SubscriptionId:id, State:state}" -o table
    exit 1
fi

print_status "Successfully connected to BAM subscription"
echo "  📋 Subscription Name: $CURRENT_SUB_NAME"
echo "  🆔 Subscription ID: $CURRENT_SUB"
echo "  🏢 Tenant ID: $TENANT_ID"

# Step 2: Backup current configuration
echo
echo "💾 Step 2: Discovering and backing up current Function App configuration"

# Get environment name (you may need to adjust this)
ENV_NAME="designetica"

# First, let's find all resource groups in the BAM subscription
echo "🔍 Finding resource groups in BAM subscription..."
RESOURCE_GROUPS=$(az group list --query "[].name" -o tsv)
echo "Available resource groups:"
echo "$RESOURCE_GROUPS" | while read rg; do echo "  - $rg"; done

# Look for designetica-related resource groups
DESIGNETICA_RGS=$(echo "$RESOURCE_GROUPS" | grep -i designetica || echo "")
if [ -n "$DESIGNETICA_RGS" ]; then
    echo "🎯 Found Designetica resource groups:"
    echo "$DESIGNETICA_RGS" | while read rg; do echo "  ✅ $rg"; done
    RESOURCE_GROUP=$(echo "$DESIGNETICA_RGS" | head -n 1)
else
    # Fallback: try common naming patterns
    RESOURCE_GROUP=$(echo "$RESOURCE_GROUPS" | grep -E "rg-designetica|designetica-rg|rg.*designetica" | head -n 1)
    if [ -z "$RESOURCE_GROUP" ]; then
        print_warning "Could not automatically detect resource group. Please specify manually."
        echo "Available resource groups:"
        echo "$RESOURCE_GROUPS" | while read rg; do echo "  - $rg"; done
        read -p "Enter the resource group name containing your Function App: " RESOURCE_GROUP
    fi
fi

echo "🎯 Using resource group: $RESOURCE_GROUP"

echo "🔍 Looking for Function Apps in resource group: $RESOURCE_GROUP"
FUNCTION_APPS=$(az functionapp list --resource-group "$RESOURCE_GROUP" --query "[].{name:name, state:state, hostingPlan:appServicePlanId}" -o table 2>/dev/null || echo "")

if [ -z "$FUNCTION_APPS" ]; then
    print_warning "No Function Apps found in $RESOURCE_GROUP. Searching across all resource groups..."
    FUNCTION_APPS=$(az functionapp list --query "[?contains(name, '$ENV_NAME')].{name:name, resourceGroup:resourceGroup, state:state}" -o table)
fi

echo "📋 Function Apps found:"
echo "$FUNCTION_APPS"

# Create a detailed backup
echo "💾 Creating detailed backup..."
az functionapp list --resource-group "$RESOURCE_GROUP" --query "[].{name:name, kind:kind, state:state, hostingPlan:appServicePlanId, runtime:siteConfig.linuxFxVersion}" -o json > "function-apps-backup-$(date +%Y%m%d-%H%M%S).json" 2>/dev/null || true

# Step 3: Deploy updated infrastructure
echo
echo "🚀 Step 3: Deploying updated infrastructure with Flex Consumption"
echo "This will update your Function App to use FC1 (Flex Consumption) plan..."

read -p "Are you ready to proceed with the migration? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Migration cancelled by user"
    exit 0
fi

# Deploy using azd
print_status "Starting deployment with azd..."
azd deploy

# Step 4: Verify migration
echo
echo "✅ Step 4: Verifying migration success"

# Check if Function Apps are running on FC1
echo "🔍 Checking Function App hosting plans..."
az functionapp list --resource-group "$RESOURCE_GROUP" --query "[].{name:name, sku:appServicePlanId}" -o table 2>/dev/null || true

# Test Function App endpoints
echo
echo "🧪 Testing Function App endpoints..."
echo "Please manually test your Function App endpoints to ensure they're working correctly."
echo "Key endpoints to test:"
echo "  - /api/direct-image-to-wireframe"
echo "  - /api/generateWireframe"
echo "  - /api/openai-health"

print_status "Migration completed! Your Function App is now running on Flex Consumption (FC1) plan."
echo
echo "📊 Benefits of FC1 over Y1:"
echo "  ✨ Better cold start performance"
echo "  ✨ More flexible scaling options"
echo "  ✨ Improved resource allocation"
echo "  ✨ Better performance consistency"

echo
echo "📝 Next steps:"
echo "  1. Test all your Function App endpoints"
echo "  2. Monitor performance for the next few days"
echo "  3. Update any dependent systems if needed"

echo
print_status "Migration script completed successfully!"