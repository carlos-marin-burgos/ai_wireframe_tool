#!/bin/bash

# 🔍 AZURE OPENAI RESOURCE DISCOVERY
# Helps you identify and configure your two OpenAI resources

echo "🔍 DISCOVERING YOUR AZURE OPENAI RESOURCES"
echo "=========================================="
echo ""

echo "📊 CURRENT CONFIGURATION:"
echo "Resource 1: cog-designetica-vdlmicyosd4ua"
echo "Endpoint: https://cog-designetica-vdlmicyosd4ua.openai.azure.com/"
echo "Status: Currently configured in your app"
echo ""

echo "🔎 SEARCHING FOR YOUR SECOND RESOURCE..."
echo ""

# Try to find Azure CLI
if command -v az &> /dev/null; then
    echo "✅ Azure CLI found. Searching for OpenAI resources..."
    echo ""
    
    # List all OpenAI resources
    echo "📋 ALL YOUR OPENAI RESOURCES:"
    az cognitiveservices account list --query "[?kind=='OpenAI'].[name,location,sku.name,properties.endpoint]" --output table 2>/dev/null || {
        echo "❌ Azure CLI not logged in or no resources found"
        echo "Please run 'az login' first"
    }
    
    echo ""
    echo "🔍 DETAILED RESOURCE INFORMATION:"
    az cognitiveservices account list --query "[?kind=='OpenAI']" --output json 2>/dev/null | jq -r '.[] | "Name: \(.name)\nLocation: \(.location)\nTier: \(.sku.name)\nEndpoint: \(.properties.endpoint)\n---"' 2>/dev/null || {
        echo "❌ Could not get detailed information"
        echo "Please check Azure CLI setup"
    }
    
else
    echo "❌ Azure CLI not found"
    echo ""
    echo "🔧 MANUAL DISCOVERY STEPS:"
    echo "1. Go to Azure Portal (portal.azure.com)"
    echo "2. Search for 'Cognitive Services'"
    echo "3. Look for OpenAI resources"
    echo "4. Note down:"
    echo "   • Resource names"
    echo "   • Endpoints"
    echo "   • Pricing tiers"
    echo "   • Locations"
fi

echo ""
echo "📝 PLEASE PROVIDE THE FOLLOWING INFORMATION:"
echo "============================================="
echo ""

echo "❓ What is the name of your SECOND OpenAI resource?"
echo "   (Not cog-designetica-vdlmicyosd4ua)"
read -p "Second resource name: " second_resource_name

echo ""
echo "❓ What is the endpoint URL of your second resource?"
echo "   (Should look like: https://your-resource-name.openai.azure.com/)"
read -p "Second resource endpoint: " second_endpoint

echo ""
echo "❓ Which resource would you prefer to upgrade to Standard tier?"
echo "   1) Current resource (cog-designetica-vdlmicyosd4ua)"
echo "   2) Second resource ($second_resource_name)"
echo "   3) Both resources"
read -p "Choose (1/2/3): " upgrade_choice

echo ""
echo "✅ RESOURCE CONFIGURATION SUMMARY:"
echo "================================="
echo ""
echo "🔧 CURRENT RESOURCE:"
echo "Name: cog-designetica-vdlmicyosd4ua"
echo "Endpoint: https://cog-designetica-vdlmicyosd4ua.openai.azure.com/"
echo "Current Usage: Normal mode (2 AI calls)"
echo ""

echo "🆕 SECOND RESOURCE:"
echo "Name: $second_resource_name"
echo "Endpoint: $second_endpoint"
echo "Proposed Usage: Maximum AI mode (11 AI calls)"
echo ""

case $upgrade_choice in
    1)
        echo "📈 UPGRADE PLAN: Current Resource"
        echo "• Upgrade cog-designetica-vdlmicyosd4ua to Standard"
        echo "• Keep $second_resource_name as S0 backup"
        echo "• Cost: Premium for all usage"
        ;;
    2)
        echo "📈 UPGRADE PLAN: Second Resource (RECOMMENDED)"
        echo "• Keep cog-designetica-vdlmicyosd4ua on S0 (free)"
        echo "• Upgrade $second_resource_name to Standard"
        echo "• Cost: Premium only for maximum AI mode"
        ;;
    3)
        echo "📈 UPGRADE PLAN: Both Resources"
        echo "• Upgrade both to Standard"
        echo "• Maximum reliability and performance"
        echo "• Cost: Premium for all usage"
        ;;
    *)
        echo "❓ Invalid choice. Defaulting to recommended option 2."
        ;;
esac

echo ""
echo "🎯 NEXT STEPS:"
echo "============="
echo "1. Note down your second resource information above"
echo "2. Go to Azure Portal to upgrade the chosen resource(s)"
echo "3. Run the dual-resource configuration script"
echo "4. Enjoy optimal cost and maximum AI power!"
echo ""

# Save configuration for later use
cat > dual-resource-config.txt << EOF
# Dual OpenAI Resource Configuration
# Generated: $(date)

CURRENT_RESOURCE_NAME=cog-designetica-vdlmicyosd4ua
CURRENT_ENDPOINT=https://cog-designetica-vdlmicyosd4ua.openai.azure.com/
CURRENT_PURPOSE=normal_mode

SECOND_RESOURCE_NAME=$second_resource_name
SECOND_ENDPOINT=$second_endpoint
SECOND_PURPOSE=maximum_ai_mode

UPGRADE_CHOICE=$upgrade_choice
EOF

echo "💾 Configuration saved to: dual-resource-config.txt"
