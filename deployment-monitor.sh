#!/bin/bash

echo "🚀 Azure Static Web App Deployment Monitor"
echo "==========================================="
echo "Monitoring: https://designetica.carlosmarin.net/"
echo "Target Backend: func-prod-fresh-u62277mynzfg4"
echo "Started at: $(date)"
echo ""

# Store initial timestamp
INITIAL_TIMESTAMP=$(curl -s -I "https://designetica.carlosmarin.net/" | grep -i "last-modified" | cut -d' ' -f2-)
echo "📅 Initial timestamp: $INITIAL_TIMESTAMP"
echo ""

for i in {1..20}; do
    echo "🔍 Check #$i - $(date '+%H:%M:%S')"
    
    # Get current timestamp
    CURRENT_TIMESTAMP=$(curl -s -I "https://designetica.carlosmarin.net/" | grep -i "last-modified" | cut -d' ' -f2-)
    
    # Check if backend has been updated
    BACKEND_CHECK=$(curl -s "https://designetica.carlosmarin.net/production-analytics.html" | grep -o "func-prod-fresh-u62277mynzfg4" || echo "OLD_BACKEND")
    
    if [[ "$BACKEND_CHECK" == "func-prod-fresh-u62277mynzfg4" ]]; then
        echo ""
        echo "🎉 ================================="
        echo "✅ DEPLOYMENT COMPLETE!"
        echo "🎯 New backend configuration detected!"
        echo "🔗 Your app is ready: https://designetica.carlosmarin.net/"
        echo "📊 Analytics: https://designetica.carlosmarin.net/production-analytics.html"
        echo "⏰ Completed at: $(date)"
        echo "================================="
        echo ""
        
        # Ring the bell and show notification
        echo -e "\a"  # Terminal bell
        osascript -e 'display notification "✅ Deployment Complete! Your wireframe tool is ready." with title "🚀 Azure Deployment"' 2>/dev/null || true
        
        exit 0
    else
        echo "   📅 Timestamp: $CURRENT_TIMESTAMP"
        if [[ "$CURRENT_TIMESTAMP" != "$INITIAL_TIMESTAMP" ]]; then
            echo "   🔄 Files updated but backend config still deploying..."
        else
            echo "   ⏳ Still waiting for deployment..."
        fi
    fi
    
    # Show progress indicator
    if (( i % 4 == 1 )); then echo -n "   ⏳ "; fi
    if (( i % 4 == 2 )); then echo -n "   ⏰ "; fi
    if (( i % 4 == 3 )); then echo -n "   ⌛ "; fi
    if (( i % 4 == 0 )); then echo -n "   🔄 "; fi
    echo "Monitoring..."
    echo ""
    
    sleep 30
done

echo "⚠️  Monitoring timeout after 10 minutes."
echo "   The deployment may still be in progress."
echo "   You can manually check: https://designetica.carlosmarin.net/"
