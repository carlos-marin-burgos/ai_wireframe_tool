#!/bin/bash

# Feedback System - Cosmos DB Setup Script
# This script automates the creation and configuration of Cosmos DB for the feedback system

set -e  # Exit on error

echo "========================================================================"
echo "🚀 Feedback System - Cosmos DB Setup"
echo "========================================================================"
echo ""

# Variables
RESOURCE_GROUP="rg-designetica-prod"
COSMOS_ACCOUNT="cosmos-designetica-prod"
LOCATION="eastus"
DATABASE_NAME="designetica"
CONTAINER_NAME="feedback"
FUNCTION_APP="func-designetica-prod-vmlmp4vej4ckc"

echo "📋 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Cosmos Account: $COSMOS_ACCOUNT"
echo "  Database: $DATABASE_NAME"
echo "  Container: $CONTAINER_NAME"
echo "  Function App: $FUNCTION_APP"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
echo "🔐 Checking Azure authentication..."
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run: azd auth login"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Check if Cosmos DB account already exists
echo "🔍 Checking if Cosmos DB account already exists..."
if az cosmosdb show --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "ℹ️  Cosmos DB account '$COSMOS_ACCOUNT' already exists"
    COSMOS_EXISTS=true
else
    echo "Creating new Cosmos DB account..."
    COSMOS_EXISTS=false
fi
echo ""

# Create Cosmos DB account if it doesn't exist
if [ "$COSMOS_EXISTS" = false ]; then
    echo "🏗️  Step 1: Creating Cosmos DB account (this may take a few minutes)..."
    az cosmosdb create \
        --name $COSMOS_ACCOUNT \
        --resource-group $RESOURCE_GROUP \
        --locations regionName=$LOCATION \
        --capabilities EnableServerless \
        --kind GlobalDocumentDB \
        --default-consistency-level Session
    
    echo "✅ Cosmos DB account created"
    echo ""
fi

# Create database
echo "🏗️  Step 2: Creating database '$DATABASE_NAME'..."
if az cosmosdb sql database show \
    --account-name $COSMOS_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --name $DATABASE_NAME &> /dev/null; then
    echo "ℹ️  Database already exists"
else
    az cosmosdb sql database create \
        --account-name $COSMOS_ACCOUNT \
        --resource-group $RESOURCE_GROUP \
        --name $DATABASE_NAME
    echo "✅ Database created"
fi
echo ""

# Create container
echo "🏗️  Step 3: Creating container '$CONTAINER_NAME'..."
if az cosmosdb sql container show \
    --account-name $COSMOS_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --database-name $DATABASE_NAME \
    --name $CONTAINER_NAME &> /dev/null; then
    echo "ℹ️  Container already exists"
else
    az cosmosdb sql container create \
        --account-name $COSMOS_ACCOUNT \
        --resource-group $RESOURCE_GROUP \
        --database-name $DATABASE_NAME \
        --name $CONTAINER_NAME \
        --partition-key-path "/type"
    echo "✅ Container created"
fi
echo ""

# Get credentials
echo "🔑 Step 4: Retrieving Cosmos DB credentials..."
COSMOS_ENDPOINT=$(az cosmosdb show \
    --name $COSMOS_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --query documentEndpoint \
    --output tsv)

COSMOS_KEY=$(az cosmosdb keys list \
    --name $COSMOS_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --query primaryMasterKey \
    --output tsv)

echo "✅ Credentials retrieved"
echo ""

# Configure Function App
echo "⚙️  Step 5: Configuring Azure Function App..."
az functionapp config appsettings set \
    --name $FUNCTION_APP \
    --resource-group $RESOURCE_GROUP \
    --settings \
        COSMOS_ENDPOINT="$COSMOS_ENDPOINT" \
        COSMOS_KEY="$COSMOS_KEY" \
        COSMOS_DATABASE_ID="$DATABASE_NAME" \
        COSMOS_FEEDBACK_CONTAINER_ID="$CONTAINER_NAME" \
    --output none

echo "✅ Function App configured"
echo ""

# Update local .env file
echo "📝 Step 6: Updating local .env file..."
ENV_FILE="backend/.env"

# Backup existing .env if it exists
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_FILE.backup"
    echo "ℹ️  Backed up existing .env to .env.backup"
fi

# Add or update Cosmos DB settings
if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

# Remove old Cosmos settings if they exist
sed -i '' '/^COSMOS_ENDPOINT=/d' "$ENV_FILE" 2>/dev/null || true
sed -i '' '/^COSMOS_KEY=/d' "$ENV_FILE" 2>/dev/null || true
sed -i '' '/^COSMOS_DATABASE_ID=/d' "$ENV_FILE" 2>/dev/null || true
sed -i '' '/^COSMOS_FEEDBACK_CONTAINER_ID=/d' "$ENV_FILE" 2>/dev/null || true

# Add new settings
echo "" >> "$ENV_FILE"
echo "# Cosmos DB Configuration for Feedback System" >> "$ENV_FILE"
echo "COSMOS_ENDPOINT=$COSMOS_ENDPOINT" >> "$ENV_FILE"
echo "COSMOS_KEY=$COSMOS_KEY" >> "$ENV_FILE"
echo "COSMOS_DATABASE_ID=$DATABASE_NAME" >> "$ENV_FILE"
echo "COSMOS_FEEDBACK_CONTAINER_ID=$CONTAINER_NAME" >> "$ENV_FILE"

echo "✅ Local .env file updated"
echo ""

# Summary
echo "========================================================================"
echo "✅ Setup Complete!"
echo "========================================================================"
echo ""
echo "📊 Cosmos DB Details:"
echo "  Endpoint: $COSMOS_ENDPOINT"
echo "  Database: $DATABASE_NAME"
echo "  Container: $CONTAINER_NAME"
echo ""
echo "📍 View in Azure Portal:"
echo "  https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DocumentDB/databaseAccounts/$COSMOS_ACCOUNT/overview"
echo ""
echo "🧪 Next Steps:"
echo "  1. Deploy your app: npm run deploy:quick"
echo "  2. Test the feedback system by clicking the feedback button"
echo "  3. View feedback in Cosmos DB Data Explorer"
echo ""
echo "💡 To view feedback data:"
echo "  - Go to Azure Portal → Cosmos DB → Data Explorer"
echo "  - Navigate to: $DATABASE_NAME → $CONTAINER_NAME → Items"
echo ""
echo "========================================================================"
