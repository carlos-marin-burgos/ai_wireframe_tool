#!/bin/bash

echo "========================================================================"
echo "🚀 Creating Cosmos DB for Feedback System"
echo "========================================================================"
echo ""

# Wait for provider registration
echo "⏳ Waiting for Microsoft.DocumentDB provider registration to complete..."
while [ "$(az provider show -n Microsoft.DocumentDB --query 'registrationState' -o tsv)" != "Registered" ]; do
    echo "   Still registering... (checking again in 10 seconds)"
    sleep 10
done

echo "✅ Provider registered!"
echo ""

# Variables
RESOURCE_GROUP="rg-designetica-prod"
COSMOS_ACCOUNT="cosmos-designetica-prod"
DATABASE_NAME="designetica"
CONTAINER_NAME="feedback"
FUNCTION_APP="func-designetica-prod-vmlmp4vej4ckc"

# Create Cosmos DB
echo "🏗️  Creating Cosmos DB account (Serverless mode)..."
az cosmosdb create \
  --name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --locations regionName=eastus \
  --capabilities EnableServerless \
  --kind GlobalDocumentDB \
  --default-consistency-level Session

echo "✅ Cosmos DB created!"
echo ""

# Create database
echo "🏗️  Creating database..."
az cosmosdb sql database create \
  --account-name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --name $DATABASE_NAME

echo "✅ Database created!"
echo ""

# Create container
echo "🏗️  Creating container..."
az cosmosdb sql container create \
  --account-name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --database-name $DATABASE_NAME \
  --name $CONTAINER_NAME \
  --partition-key-path "/type"

echo "✅ Container created!"
echo ""

# Get credentials
echo "🔑 Getting credentials..."
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

echo "✅ Credentials retrieved!"
echo ""

# Configure Function App
echo "⚙️  Configuring Function App..."
az functionapp config appsettings set \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --settings \
    COSMOS_ENDPOINT="$COSMOS_ENDPOINT" \
    COSMOS_KEY="$COSMOS_KEY" \
    COSMOS_DATABASE_ID="$DATABASE_NAME" \
    COSMOS_FEEDBACK_CONTAINER_ID="$CONTAINER_NAME" \
  --output none

echo "✅ Function App configured!"
echo ""

# Update local .env
echo "📝 Updating local .env file..."
ENV_FILE="backend/.env"

if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

# Remove old settings
grep -v "^COSMOS_ENDPOINT=" "$ENV_FILE" > "$ENV_FILE.tmp" && mv "$ENV_FILE.tmp" "$ENV_FILE" 2>/dev/null || true
grep -v "^COSMOS_KEY=" "$ENV_FILE" > "$ENV_FILE.tmp" && mv "$ENV_FILE.tmp" "$ENV_FILE" 2>/dev/null || true
grep -v "^COSMOS_DATABASE_ID=" "$ENV_FILE" > "$ENV_FILE.tmp" && mv "$ENV_FILE.tmp" "$ENV_FILE" 2>/dev/null || true
grep -v "^COSMOS_FEEDBACK_CONTAINER_ID=" "$ENV_FILE" > "$ENV_FILE.tmp" && mv "$ENV_FILE.tmp" "$ENV_FILE" 2>/dev/null || true

# Add new settings
echo "" >> "$ENV_FILE"
echo "# Cosmos DB - Feedback System" >> "$ENV_FILE"
echo "COSMOS_ENDPOINT=$COSMOS_ENDPOINT" >> "$ENV_FILE"
echo "COSMOS_KEY=$COSMOS_KEY" >> "$ENV_FILE"
echo "COSMOS_DATABASE_ID=$DATABASE_NAME" >> "$ENV_FILE"
echo "COSMOS_FEEDBACK_CONTAINER_ID=$CONTAINER_NAME" >> "$ENV_FILE"

echo "✅ Local .env updated!"
echo ""

echo "========================================================================"
echo "✅ Setup Complete!"
echo "========================================================================"
echo ""
echo "📊 Your Cosmos DB:"
echo "  Endpoint: $COSMOS_ENDPOINT"
echo "  Database: $DATABASE_NAME"
echo "  Container: $CONTAINER_NAME"
echo ""
echo "🚀 Next steps:"
echo "  1. Deploy: npm run deploy:quick"
echo "  2. Test the feedback button in your app"
echo "  3. View feedback in Azure Portal → Cosmos DB → Data Explorer"
echo ""
echo "========================================================================"
