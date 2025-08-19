#!/bin/bash

# 🔑 GET SECOND RESOURCE API KEY
# Simple script to help you get the API key for cog-production-txknroiw7uvto

echo "🔑 GETTING SECOND RESOURCE API KEY"
echo "=================================="
echo ""
echo "Resource Name: cog-production-txknroiw7uvto"
echo "Endpoint: https://cog-production-txknroiw7uvto.openai.azure.com/"
echo ""

echo "📋 STEPS TO GET THE API KEY:"
echo "1. Go to Azure Portal (portal.azure.com)"
echo "2. Search for 'cog-production-txknroiw7uvto'"
echo "3. Click on the resource"
echo "4. In the left sidebar, click 'Keys and Endpoint'"
echo "5. Copy KEY 1 or KEY 2"
echo ""

echo "🔧 METHOD 1: Manual (Recommended)"
echo "Copy the key from Azure Portal and paste it below:"
read -p "Paste the API key here: " second_key

if [ ! -z "$second_key" ]; then
    echo ""
    echo "✅ Adding second resource to configuration..."
    
    # Add the secondary key to local.settings.json
    if [ -f "backend/local.settings.json" ]; then
        # Create backup
        cp backend/local.settings.json backend/local.settings.json.backup
        
        # Add secondary key using jq if available, otherwise manual
        if command -v jq &> /dev/null; then
            jq ".Values.AZURE_OPENAI_SECONDARY_KEY = \"$second_key\"" backend/local.settings.json > temp.json && mv temp.json backend/local.settings.json
            echo "✅ Successfully added AZURE_OPENAI_SECONDARY_KEY to local.settings.json"
        else
            echo ""
            echo "📝 MANUAL STEP NEEDED:"
            echo "Add this line to backend/local.settings.json in the Values section:"
            echo "\"AZURE_OPENAI_SECONDARY_KEY\": \"$second_key\","
        fi
    fi
    
    echo ""
    echo "🧪 Testing dual resource configuration..."
    
    # Test the configuration
    node -e "
    const generator = require('./backend/SmartDualResourceGenerator.js');
    const smartGen = new generator();
    
    console.log('📊 DUAL RESOURCE STATUS:');
    console.log(JSON.stringify(smartGen.getSystemStatus(), null, 2));
    
    if (smartGen.resourceClients.secondary) {
        console.log('');
        console.log('✅ SUCCESS! Both resources configured');
        console.log('🎯 You now have:');
        console.log('   • Double the quota capacity');
        console.log('   • Automatic failover between resources');
        console.log('   • Free usage with your Azure credits');
        console.log('   • Smart load balancing');
    } else {
        console.log('');
        console.log('⚠️ Secondary resource needs manual configuration');
        console.log('Please add AZURE_OPENAI_SECONDARY_KEY to local.settings.json');
    }
    "
    
else
    echo ""
    echo "❌ No key provided. You can:"
    echo "1. Run this script again with the key"
    echo "2. Manually add AZURE_OPENAI_SECONDARY_KEY to backend/local.settings.json"
    echo ""
    echo "🔧 METHOD 2: Using Azure CLI (if installed)"
    echo "az cognitiveservices account keys list --name cog-production-txknroiw7uvto --resource-group YOUR_RESOURCE_GROUP"
fi

echo ""
echo "🚀 NEXT STEPS AFTER CONFIGURATION:"
echo "1. Restart your development server"
echo "2. Test wireframe generation" 
echo "3. Enjoy double quota capacity!"
