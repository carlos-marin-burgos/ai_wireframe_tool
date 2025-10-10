#!/bin/bash

# Script to configure Azure Static Web App with Microsoft authentication secrets
# Run this after creating your Azure AD app registration

echo "🔐 Configuring Azure Static Web App Authentication"
echo "=================================================="
echo ""

# Prompt for values
read -p "Enter your Azure AD Client ID: " CLIENT_ID
read -sp "Enter your Azure AD Client Secret: " CLIENT_SECRET
echo ""
echo ""

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Error: Client ID and Secret are required"
    exit 1
fi

TENANT_ID="72f988bf-86f1-41af-91ab-2d7cd011db47"
STATIC_WEB_APP_NAME="swa-designetica-5gwyjxbwvr4s6"
RESOURCE_GROUP="rg-designetica-prod"

echo "📝 Configuration Details:"
echo "  Static Web App: $STATIC_WEB_APP_NAME"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Tenant ID: $TENANT_ID"
echo "  Client ID: $CLIENT_ID"
echo "  Client Secret: [HIDDEN]"
echo ""

# Verify Azure CLI is logged in
if ! az account show &>/dev/null; then
    echo "❌ Not logged into Azure CLI. Please run: az login"
    exit 1
fi

echo "🔄 Setting application settings..."
az staticwebapp appsettings set \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --setting-names \
        AZURE_CLIENT_ID="$CLIENT_ID" \
        AZURE_CLIENT_SECRET="$CLIENT_SECRET" \
        AZURE_TENANT_ID="$TENANT_ID"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Authentication secrets configured successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update staticwebapp.config.json with the correct tenant ID (already done)"
    echo "2. Deploy your app: azd deploy --no-prompt"
    echo "3. Test authentication at: https://$STATIC_WEB_APP_NAME.1.azurestaticapps.net"
    echo ""
    
    # Save configuration to local file (without secret)
    cat > .azure-auth-config.txt <<EOF
Azure AD Configuration for Designetica
======================================
Configured: $(date)

Tenant ID: $TENANT_ID
Client ID: $CLIENT_ID
Static Web App: $STATIC_WEB_APP_NAME
Resource Group: $RESOURCE_GROUP

Redirect URI: https://$STATIC_WEB_APP_NAME.1.azurestaticapps.net/.auth/login/aad/callback

✅ Secrets have been configured in Azure Static Web App
EOF
    
    echo "💾 Configuration saved to: .azure-auth-config.txt"
    
    # Add to .gitignore
    if ! grep -q ".azure-auth-config.txt" .gitignore 2>/dev/null; then
        echo ".azure-auth-config.txt" >> .gitignore
        echo "✅ Added .azure-auth-config.txt to .gitignore"
    fi
else
    echo ""
    echo "❌ Failed to configure authentication secrets"
    echo ""
    echo "💡 Manual Configuration:"
    echo "Run this command manually:"
    echo ""
    echo "az staticwebapp appsettings set \\"
    echo "  --name $STATIC_WEB_APP_NAME \\"
    echo "  --resource-group $RESOURCE_GROUP \\"
    echo "  --setting-names \\"
    echo "    AZURE_CLIENT_ID=\"$CLIENT_ID\" \\"
    echo "    AZURE_CLIENT_SECRET=\"[YOUR_SECRET]\""
    exit 1
fi
