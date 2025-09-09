#!/bin/bash

# Monitor Azure deployment progress
echo "🚀 Monitoring Azure Deployment Progress..."
echo "=================================="

# Function to check deployment status
check_deployment_status() {
    echo "⏰ $(date): Checking deployment status..."
    
    # Check resource group contents
    echo "📦 Resources in rg-Designetica:"
    az resource list --resource-group rg-Designetica --output table
    
    # Check deployments
    echo "🔄 Recent deployments:"
    az deployment group list --resource-group rg-Designetica --output table
    
    # Check azd environment
    echo "🌍 AZD Environment status:"
    azd env get-values --environment designetica-prod
    
    echo "=================================="
}

# Initial check
check_deployment_status

<<<<<<< HEAD
# Monitor every 30 seconds
while true; do
    sleep 30
    check_deployment_status
=======
# Test wireframe generation
test_wireframe() {
    local url="$1/api/generate-wireframe"
    local test_payload='{"description": "test wireframe", "colorScheme": "primary"}'
>>>>>>> c45591cd7c4527069b42e97fad093bcdd3b64ed7
    
    # Check if we have resources deployed
    RESOURCE_COUNT=$(az resource list --resource-group rg-Designetica --query "length(@)" --output tsv)
    if [ "$RESOURCE_COUNT" -gt "0" ]; then
        echo "✅ Resources detected! Deployment appears to be progressing..."
        
        # Check if we have the key resources
        OPENAI_EXISTS=$(az resource list --resource-group rg-Designetica --resource-type "Microsoft.CognitiveServices/accounts" --query "length(@)" --output tsv)
        FUNCTION_EXISTS=$(az resource list --resource-group rg-Designetica --resource-type "Microsoft.Web/sites" --query "length(@)" --output tsv)
        
        if [ "$OPENAI_EXISTS" -gt "0" ] && [ "$FUNCTION_EXISTS" -gt "0" ]; then
            echo "🎉 Key resources (OpenAI + Function App) detected!"
            echo "🌐 Testing production site in 60 seconds..."
            sleep 60
            
            echo "🔍 Testing designetica.carlosmarin.net..."
            curl -I https://designetica.carlosmarin.net/ || echo "❌ Site not yet accessible"
            
            break
        fi
    fi
done

echo "✅ Deployment monitoring complete!"
