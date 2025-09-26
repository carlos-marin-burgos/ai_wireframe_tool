#!/bin/bash

# Environment Validation Script
# Checks and displays current Azure environment status

set -e

echo "🔍 Azure Environment Status Check"
echo "=================================="

# Check if azd is installed
if ! command -v azd &> /dev/null; then
    echo "❌ Azure Developer CLI (azd) is not installed"
    exit 1
fi

# Check azd version
AZD_VERSION=$(azd version --output json 2>/dev/null | jq -r '.azd.version' || echo "unknown")
echo "📦 azd version: $AZD_VERSION"

# List all environments
echo ""
echo "📂 Available Environments:"
azd env list

# Get current environment details
CURRENT_ENV=$(azd env list --output json 2>/dev/null | jq -r '.[] | select(.IsDefault) | .Name' || echo "none")
echo ""
echo "🌍 Current Default Environment: $CURRENT_ENV"

# Check if we're using a valid production environment
VALID_ENVS=("designetica" "production")
if [[ ! " ${VALID_ENVS[@]} " =~ " ${CURRENT_ENV} " ]]; then
    echo "⚠️  WARNING: Not using a recognized production environment!"
    echo "💡 Valid environments: ${VALID_ENVS[*]}"
    echo "💡 Current: $CURRENT_ENV"
    echo "💡 To fix: azd env select designetica"
    exit 1
fi

echo "✅ Using valid environment: $CURRENT_ENV"

# Show environment variables
echo ""
echo "⚙️  Environment Configuration:"
echo "$(azd env get-values | grep -E "AZURE_(FUNCTION_APP_URL|STATIC_WEB_APP_URL|ENV_NAME)" | sort)"

# Check if OAuth is configured
OAUTH_PROD_URI=$(azd env get-values | grep FIGMA_REDIRECT_URI_PROD || echo "FIGMA_REDIRECT_URI_PROD=not set")
echo ""
echo "🔐 OAuth Configuration:"
echo "$OAUTH_PROD_URI"

# Validate OAuth configuration
FUNCTION_URL=$(azd env get-values | grep AZURE_FUNCTION_APP_URL | cut -d'=' -f2 | tr -d '"')
if [[ "$OAUTH_PROD_URI" == *"func-original-app-pgno4orkguix6.azurewebsites.net"* ]]; then
    echo "✅ OAuth redirect URI matches registered Figma app"
else
    echo "⚠️  OAuth redirect URI may not match Figma registration"
fi

echo ""
echo "✅ Environment validation complete"