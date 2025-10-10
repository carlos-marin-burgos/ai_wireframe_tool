#!/bin/bash

# Link Function App backend to Static Web App frontend
# This enables the /api/* proxy routes to work

set -e

echo "🔗 Linking Function App backend to Static Web App..."
echo ""

STATIC_WEB_APP_NAME="swa-designetica-5gwyjxbwvr4s6"
FUNCTION_APP_NAME="func-designetica-prod-vmlmp4vej4ckc"
RESOURCE_GROUP="rg-designetica-prod"
FUNCTION_APP_URL="https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"

echo "📋 Configuration:"
echo "   Static Web App: $STATIC_WEB_APP_NAME"
echo "   Function App: $FUNCTION_APP_NAME"
echo "   Resource Group: $RESOURCE_GROUP"
echo ""

# Link the Function App as the backend
echo "🔧 Creating backend link..."
az staticwebapp backends link \
  --name "$STATIC_WEB_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --backend-resource-id "/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$FUNCTION_APP_NAME" \
  --backend-region "westus2"

echo ""
echo "✅ Backend linked successfully!"
echo "   Now /api/* requests will proxy to: $FUNCTION_APP_URL"
echo ""
echo "⏳ Note: Changes may take a few minutes to propagate"
echo ""
