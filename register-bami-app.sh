#!/bin/bash

# Register Azure AD App in Microsoft Tenant for BAMI Subscription
# This creates the app in the correct tenant

echo "🔐 Registering App in Microsoft Tenant (BAMI)"
echo "=============================================="
echo ""

# Verify current tenant
CURRENT_TENANT=$(az account show --query tenantId -o tsv)
CURRENT_USER=$(az account show --query user.name -o tsv)

echo "📋 Current Context:"
echo "  Tenant: $CURRENT_TENANT"
echo "  User: $CURRENT_USER"
echo ""

if [ "$CURRENT_TENANT" != "72f988bf-86f1-41af-91ab-2d7cd011db47" ]; then
    echo "❌ Error: Not in Microsoft tenant"
    echo "   Current tenant: $CURRENT_TENANT"
    echo "   Expected: 72f988bf-86f1-41af-91ab-2d7cd011db47"
    exit 1
fi

# Static Web App URL
STATIC_WEB_APP_URL="https://delightful-pond-064d9a91e.1.azurestaticapps.net"
REDIRECT_URI="${STATIC_WEB_APP_URL}/.auth/login/aad/callback"

echo "📝 Creating app registration in Microsoft tenant..."
APP_JSON=$(az ad app create \
    --display-name "Designetica Wireframe Tool - BAMI" \
    --sign-in-audience AzureADMyOrg \
    --web-redirect-uris "$REDIRECT_URI" \
    --enable-id-token-issuance true \
    --output json 2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Failed to create app registration"
    echo "$APP_JSON"
    exit 1
fi

# Extract values
APP_ID=$(echo "$APP_JSON" | jq -r '.appId')
OBJECT_ID=$(echo "$APP_JSON" | jq -r '.id')

echo "✅ App registration created!"
echo ""
echo "📋 Application Details:"
echo "  App Name: Designetica Wireframe Tool - BAMI"
echo "  Client ID: $APP_ID"
echo "  Object ID: $OBJECT_ID"
echo "  Tenant ID: $CURRENT_TENANT"
echo "  Redirect URI: $REDIRECT_URI"
echo ""

# Create client secret
echo "🔑 Creating client secret..."
SECRET_JSON=$(az ad app credential reset \
    --id "$APP_ID" \
    --append \
    --display-name "BAMI Production Secret" \
    --output json 2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Failed to create client secret"
    echo "$SECRET_JSON"
    exit 1
fi

CLIENT_SECRET=$(echo "$SECRET_JSON" | jq -r '.password')

echo "✅ Client secret created!"
echo ""
echo "🎯 IMPORTANT: Save these values!"
echo "=================================================="
echo "AZURE_CLIENT_ID=$APP_ID"
echo "AZURE_CLIENT_SECRET=$CLIENT_SECRET"
echo "AZURE_TENANT_ID=$CURRENT_TENANT"
echo "=================================================="
echo ""

# Save to local file
cat > .azure-bami-app-registration.txt <<EOF
Azure AD App Registration for Designetica (BAMI)
=================================================
Created: $(date)
Tenant: Microsoft (72f988bf-86f1-41af-91ab-2d7cd011db47)
Subscription: BAMI

Application (Client) ID: $APP_ID
Tenant ID: $CURRENT_TENANT
Object ID: $OBJECT_ID
Client Secret: $CLIENT_SECRET
Redirect URI: $REDIRECT_URI

⚠️  KEEP THIS FILE SECURE - DO NOT COMMIT TO GIT
EOF

echo "💾 Registration details saved to: .azure-bami-app-registration.txt"
echo ""

# Add to .gitignore
if ! grep -q ".azure-bami-app-registration.txt" .gitignore 2>/dev/null; then
    echo ".azure-bami-app-registration.txt" >> .gitignore
    echo "✅ Added to .gitignore"
fi

echo ""
echo "⚡ Next Steps:"
echo "1. Configure Azure Static Web App with new credentials:"
echo "   ./configure-auth-secrets.sh"
echo ""
echo "   When prompted, use:"
echo "   Client ID: $APP_ID"
echo "   Client Secret: [paste the secret above]"
echo ""
echo "2. Deploy: azd deploy --no-prompt"
echo ""
