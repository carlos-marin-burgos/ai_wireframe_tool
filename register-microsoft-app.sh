#!/bin/bash

# Register Azure AD App in Microsoft Tenant
# Run this script to create the app registration

echo "🔐 Registering Azure AD App in Microsoft Tenant..."
echo ""

# Check if logged into Azure CLI
if ! az account show &>/dev/null; then
    echo "❌ Not logged into Azure CLI. Please run: az login"
    exit 1
fi

# Check if logged into correct tenant
CURRENT_TENANT=$(az account show --query tenantId -o tsv)
MICROSOFT_TENANT="72f988bf-86f1-41af-91ab-2d7cd011db47"

if [ "$CURRENT_TENANT" != "$MICROSOFT_TENANT" ]; then
    echo "⚠️  Current tenant: $CURRENT_TENANT"
    echo "⚠️  Need to switch to Microsoft tenant: $MICROSOFT_TENANT"
    echo ""
    echo "Run: az login --tenant 72f988bf-86f1-41af-91ab-2d7cd011db47"
    exit 1
fi

echo "✅ Logged into Microsoft tenant: $MICROSOFT_TENANT"
echo ""

# Static Web App URL
STATIC_WEB_APP_URL="https://delightful-pond-064d9a91e.1.azurestaticapps.net"
REDIRECT_URI="${STATIC_WEB_APP_URL}/.auth/login/aad/callback"

echo "📝 Creating app registration..."
APP_JSON=$(az ad app create \
    --display-name "Designetica Wireframe Tool" \
    --sign-in-audience AzureADMyOrg \
    --web-redirect-uris "$REDIRECT_URI" \
    --enable-id-token-issuance true \
    --output json)

if [ $? -ne 0 ]; then
    echo "❌ Failed to create app registration"
    exit 1
fi

# Extract values
APP_ID=$(echo "$APP_JSON" | jq -r '.appId')
OBJECT_ID=$(echo "$APP_JSON" | jq -r '.id')

echo "✅ App registration created!"
echo ""
echo "📋 Application Details:"
echo "  App Name: Designetica Wireframe Tool"
echo "  Client ID: $APP_ID"
echo "  Object ID: $OBJECT_ID"
echo "  Tenant ID: $MICROSOFT_TENANT"
echo "  Redirect URI: $REDIRECT_URI"
echo ""

# Create client secret
echo "🔑 Creating client secret..."
SECRET_JSON=$(az ad app credential reset \
    --id "$APP_ID" \
    --append \
    --display-name "Designetica Production" \
    --output json)

if [ $? -ne 0 ]; then
    echo "❌ Failed to create client secret"
    exit 1
fi

CLIENT_SECRET=$(echo "$SECRET_JSON" | jq -r '.password')

echo "✅ Client secret created!"
echo ""
echo "🎯 IMPORTANT: Save these values securely!"
echo "=================================================="
echo "AZURE_CLIENT_ID=$APP_ID"
echo "AZURE_CLIENT_SECRET=$CLIENT_SECRET"
echo "AZURE_TENANT_ID=$MICROSOFT_TENANT"
echo "=================================================="
echo ""
echo "⚡ Next Steps:"
echo "1. Add these secrets to your Azure Static Web App settings:"
echo "   az staticwebapp appsettings set \\"
echo "     --name delightful-pond-064d9a91e \\"
echo "     --setting-names \\"
echo "       AZURE_CLIENT_ID=$APP_ID \\"
echo "       AZURE_CLIENT_SECRET=$CLIENT_SECRET"
echo ""
echo "2. Your staticwebapp.config.json is already configured"
echo "3. Deploy your app with: azd deploy --no-prompt"
echo ""

# Save to local file for reference
cat > .azure-app-registration.txt <<EOF
Azure AD App Registration for Designetica
==========================================
Created: $(date)

Application (Client) ID: $APP_ID
Tenant ID: $MICROSOFT_TENANT
Object ID: $OBJECT_ID

Client Secret: $CLIENT_SECRET

Redirect URI: $REDIRECT_URI

⚠️  KEEP THIS FILE SECURE - DO NOT COMMIT TO GIT
EOF

echo "💾 Registration details saved to: .azure-app-registration.txt"
echo "⚠️  DO NOT commit this file to git!"
echo ""

# Add to .gitignore
if ! grep -q ".azure-app-registration.txt" .gitignore 2>/dev/null; then
    echo ".azure-app-registration.txt" >> .gitignore
    echo "✅ Added .azure-app-registration.txt to .gitignore"
fi
