#!/bin/bash

# 🔍 Designetica Deployment Verification Script
# Check if your Azure deployment is working correctly

echo "🔍 Verifying Designetica deployment on Azure..."
echo ""

# Get resource group resources
echo "📋 Checking Azure resources..."
if az group exists --name rg-designetica-prod; then
    echo "✅ Resource group exists"
    
    # List resources
    echo ""
    echo "🗂️  Resources in deployment:"
    az resource list --resource-group rg-designetica-prod --output table --query "[].{Name:name, Type:type, Location:location}"
    
    echo ""
    echo "🌐 Application URLs:"
    
    # Get Static Web App URL
    SWA_URL=$(az staticwebapp show --resource-group rg-designetica-prod --name swa-designetica-prod --query "defaultHostname" -o tsv 2>/dev/null)
    if [ -n "$SWA_URL" ]; then
        echo "📱 Frontend: https://$SWA_URL"
        
        # Test frontend health
        if curl -s -f "https://$SWA_URL" > /dev/null; then
            echo "   ✅ Frontend is responding"
        else
            echo "   ❌ Frontend is not responding"
        fi
    fi
    
    # Get Function App URL
    FUNC_URL=$(az functionapp show --resource-group rg-designetica-prod --name func-designetica-prod --query "defaultHostName" -o tsv 2>/dev/null)
    if [ -n "$FUNC_URL" ]; then
        echo "🔧 Backend API: https://$FUNC_URL"
        
        # Test backend health
        if curl -s -f "https://$FUNC_URL/api/health" > /dev/null; then
            echo "   ✅ Backend API is responding"
            
            # Get detailed health info
            echo ""
            echo "🏥 Backend Health Check:"
            curl -s "https://$FUNC_URL/api/health" | jq . 2>/dev/null || echo "   Health endpoint returned data"
        else
            echo "   ❌ Backend API is not responding"
        fi
    fi
    
    # Get OpenAI service status
    OPENAI_NAME=$(az resource list --resource-group rg-designetica-prod --resource-type Microsoft.CognitiveServices/accounts --query "[0].name" -o tsv 2>/dev/null)
    if [ -n "$OPENAI_NAME" ]; then
        echo ""
        echo "🤖 Azure OpenAI Service: $OPENAI_NAME"
        OPENAI_STATUS=$(az cognitiveservices account show --resource-group rg-designetica-prod --name "$OPENAI_NAME" --query "properties.provisioningState" -o tsv 2>/dev/null)
        if [ "$OPENAI_STATUS" = "Succeeded" ]; then
            echo "   ✅ Azure OpenAI is provisioned and ready"
        else
            echo "   ⚠️  Azure OpenAI status: $OPENAI_STATUS"
        fi
    fi
    
else
    echo "❌ Resource group 'rg-designetica-prod' not found"
    echo "🚀 Run './deploy.sh' to deploy your application"
fi

echo ""
echo "🔗 Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/rg-designetica-prod"
echo "📊 Monitor logs: az webapp log tail --resource-group rg-designetica-prod --name func-designetica-prod"
