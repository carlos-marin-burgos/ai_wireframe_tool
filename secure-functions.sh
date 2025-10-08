#!/bin/bash

# CRITICAL SECURITY FIX: Update all Azure Functions from anonymous to function auth level
# This prevents unauthorized access to Azure OpenAI and other costly services

echo "🚨 SECURING AZURE FUNCTIONS - Updating authLevel from 'anonymous' to 'function'"
echo ""

# Find all function.json files and update authLevel
count=0
for file in $(find backend -name "function.json"); do
    if grep -q '"authLevel": "anonymous"' "$file"; then
        echo "Securing: $file"
        # Use sed to replace anonymous with function
        sed -i '' 's/"authLevel": "anonymous"/"authLevel": "function"/g' "$file"
        ((count++))
    fi
done

echo ""
echo "✅ Updated $count Azure Functions to require function keys"
echo ""
echo "NEXT STEPS:"
echo "1. Deploy these changes to Azure"
echo "2. Get function keys from Azure Portal"
echo "3. Update frontend to use keys"
echo ""
echo "⚠️  Your APIs are now secured but you'll need to update frontend calls!"