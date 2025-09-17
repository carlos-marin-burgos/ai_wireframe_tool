#!/bin/bash

# Environment Cleanup Script
# Safely removes unused Azure environments

set -e

echo "🧹 Azure Environment Cleanup"
echo "============================="

echo "⚠️  WARNING: This will delete Azure environments and their resources!"
echo ""

# Show current environments
echo "📂 Current Environments:"
azd env list

echo ""
echo "🎯 Production Environment: original-app (will NOT be deleted)"
echo ""

# List potentially unused environments
UNUSED_ENVS=("designetica" "designetica-prod" "production-bami" "production-microsoft")

for env in "${UNUSED_ENVS[@]}"; do
    if azd env list --output table | grep -q "$env"; then
        echo "❓ Found environment: $env"
        
        # Try to get environment info
        if azd env select "$env" 2>/dev/null && azd env get-values | grep -q "AZURE_FUNCTION_APP_URL"; then
            FUNCTION_URL=$(azd env get-values | grep AZURE_FUNCTION_APP_URL | cut -d'=' -f2 | tr -d '"')
            echo "   📍 Function URL: $FUNCTION_URL"
            
            # Test if it's still active
            if curl -sf --connect-timeout 5 "$FUNCTION_URL/api/health" > /dev/null 2>&1; then
                echo "   ✅ Environment is ACTIVE - skipping deletion"
            else
                echo "   💤 Environment appears inactive"
                
                read -p "   🗑️  Delete environment '$env'? (y/N): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    echo "   🧹 Deleting environment: $env"
                    # Note: This will require manual confirmation
                    azd env delete "$env" || echo "   ⚠️  Manual deletion may be required"
                else
                    echo "   ⏭️  Skipped: $env"
                fi
            fi
        else
            echo "   ❌ Cannot access environment info - may already be partially deleted"
        fi
        echo ""
    fi
done

# Restore production environment
echo "🔄 Switching back to production environment..."
azd env select original-app

echo ""
echo "✅ Cleanup process complete!"
echo "📋 Run './check-env.sh' to verify current state"