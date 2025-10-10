#!/bin/bash

# Quick Setup Script for After Portal Registration
# Run this after you've created the app in Azure Portal

echo "🔐 Post-Registration Setup for BAMI App"
echo "========================================"
echo ""
echo "This script will help you configure the app after registration."
echo ""
echo "📋 Prerequisites:"
echo "  ✅ App registered in Azure Portal"
echo "  ✅ You have the Client ID"
echo "  ✅ You have the Client Secret (copied immediately after creation)"
echo ""

# Ask for confirmation
read -p "Have you completed the app registration in Azure Portal? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the registration first."
    echo ""
    echo "📖 Follow the guide in BAMI_APP_REGISTRATION.md"
    echo "🌐 Or visit: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
    exit 1
fi

echo ""
echo "Great! Let's configure your Static Web App with the new credentials."
echo ""

# Run the configuration script
./configure-auth-secrets.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Configuration complete!"
    echo ""
    echo "🚀 Next step: Deploy the app"
    echo ""
    read -p "Deploy now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Deploying..."
        azd deploy --no-prompt
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Deployment complete!"
            echo ""
            echo "🧪 Test your app:"
            echo "   https://delightful-pond-064d9a91e.1.azurestaticapps.net/"
            echo ""
            echo "📋 Expected behavior:"
            echo "   1. Redirect to Microsoft login"
            echo "   2. Sign in with camarinb@microsoft.com"
            echo "   3. Access granted to Microsoft employees only"
            echo ""
            
            read -p "Open app in browser? (y/n) " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                open https://delightful-pond-064d9a91e.1.azurestaticapps.net/
            fi
        else
            echo "❌ Deployment failed. Check the error messages above."
        fi
    else
        echo ""
        echo "💡 Deploy manually when ready:"
        echo "   azd deploy --no-prompt"
    fi
else
    echo ""
    echo "❌ Configuration failed. Please check the error messages."
fi
