#!/bin/bash

# Azure Static Web Apps Deployment Monitor
# Monitors the deployment status of frontend configuration updates

FRONTEND_URL="https://gray-stone-01d7ca70f.2.azurestaticapps.net"
ANALYTICS_URL="https://gray-stone-01d7ca70f.2.azurestaticapps.net/production-analytics.html"
BACKEND_URL="https://func-prod-fresh-u62277mynzfg4.azurewebsites.net/api"
NEW_ENDPOINT="func-prod-fresh-u62277mynzfg4"

echo "🚀 Static Web Apps Deployment Monitor"
echo "====================================="
echo ""
echo "📍 Monitoring URLs:"
echo "   Frontend:  $FRONTEND_URL"
echo "   Analytics: $ANALYTICS_URL"
echo "   Backend:   $BACKEND_URL"
echo ""

# Function to test endpoint with content verification
test_endpoint() {
    local url=$1
    local name=$2
    local expect_content=$3
    
    echo -n "🧪 Testing $name... "
    
    response=$(curl -s -w "%{http_code}" "$url" -m 10 2>/dev/null)
    http_code="${response: -3}"
    content="${response%???}"
    
    if [ "$http_code" -eq 200 ]; then
        if [ -n "$expect_content" ] && [[ "$content" == *"$expect_content"* ]]; then
            echo "✅ OK (Updated)"
            return 0
        elif [ -z "$expect_content" ]; then
            echo "✅ OK (Accessible)"
            return 0
        else
            echo "⏳ OK (Old config)"
            return 1
        fi
    else
        echo "❌ Failed ($http_code)"
        return 1
    fi
}

# Function to test backend API
test_backend() {
    echo "🔧 Backend API Check:"
    
    echo -n "   Health endpoint... "
    health_response=$(curl -s "$BACKEND_URL/health" -m 5 2>/dev/null)
    if [[ "$health_response" == *"\"status\":\"OK\""* ]]; then
        echo "✅ Healthy"
    else
        echo "❌ Unhealthy"
        return 1
    fi
    
    echo -n "   Wireframe API... "
    wireframe_response=$(curl -s -X POST "$BACKEND_URL/generate-wireframe" \
        -H "Content-Type: application/json" \
        -d '{"description": "test", "fastTest": true}' \
        -m 15 2>/dev/null)
    if [[ "$wireframe_response" == *"html"* ]]; then
        echo "✅ Working"
        return 0
    else
        echo "❌ Not responding"
        return 1
    fi
}

# Function to check GitHub commit status
check_git_status() {
    echo "📊 Git Status:"
    echo "   Last commit: $(git log -1 --oneline)"
    echo "   Current branch: $(git branch --show-current)"
    echo "   Repository: https://github.com/carlos-marin-burgos/ai_wireframe_tool"
    echo ""
}

# Function to monitor deployment progress
monitor_deployment() {
    local max_attempts=20
    local attempt=1
    local success=false
    
    echo "⏰ Starting deployment monitoring (max 10 minutes)..."
    echo ""
    
    while [ $attempt -le $max_attempts ] && [ "$success" = false ]; do
        echo "🔄 Check #$attempt of $max_attempts ($(date '+%H:%M:%S'))"
        echo "─────────────────────────────────────────"
        
        # Test backend (should always work)
        if ! test_backend; then
            echo "⚠️  Backend issue detected - this should be working"
        fi
        echo ""
        
        # Test frontend
        frontend_ok=false
        if test_endpoint "$FRONTEND_URL" "Frontend" ""; then
            frontend_ok=true
        fi
        
        # Test analytics page for new endpoint
        analytics_ok=false
        if test_endpoint "$ANALYTICS_URL" "Analytics" "$NEW_ENDPOINT"; then
            analytics_ok=true
        fi
        
        # Test if the actual JavaScript config is updated
        config_ok=false
        echo -n "🧪 Testing API config... "
        config_response=$(curl -s "$FRONTEND_URL" -m 10 2>/dev/null)
        if [[ "$config_response" == *"$NEW_ENDPOINT"* ]]; then
            echo "✅ Updated"
            config_ok=true
        else
            echo "⏳ Old config"
        fi
        
        echo ""
        
        # Check if deployment is complete
        if [ "$frontend_ok" = true ] && [ "$analytics_ok" = true ] && [ "$config_ok" = true ]; then
            echo "🎉 DEPLOYMENT COMPLETE!"
            echo "✅ Frontend is accessible"
            echo "✅ Analytics page has new endpoint"
            echo "✅ API configuration updated"
            echo ""
            echo "🔗 Your application is ready:"
            echo "   🌐 Frontend:  $FRONTEND_URL"
            echo "   📊 Analytics: $ANALYTICS_URL"
            echo "   🔌 Backend:   $BACKEND_URL"
            echo ""
            echo "📋 Next steps:"
            echo "   1. Test wireframe generation from frontend"
            echo "   2. Check analytics page production mode"
            echo "   3. Verify all features working end-to-end"
            success=true
        else
            echo "⏳ Deployment in progress..."
            echo "   Frontend accessible: $([ "$frontend_ok" = true ] && echo "✅" || echo "⏳")"
            echo "   Analytics updated: $([ "$analytics_ok" = true ] && echo "✅" || echo "⏳")"
            echo "   Config updated: $([ "$config_ok" = true ] && echo "✅" || echo "⏳")"
            echo ""
            
            if [ $attempt -lt $max_attempts ]; then
                echo "⏰ Waiting 30 seconds..."
                sleep 30
            fi
        fi
        
        ((attempt++))
    done
    
    if [ "$success" = false ]; then
        echo ""
        echo "⚠️  Deployment taking longer than expected (>10 minutes)"
        echo ""
        echo "🔧 Troubleshooting:"
        echo "   1. Check GitHub Actions: https://github.com/carlos-marin-burgos/ai_wireframe_tool/actions"
        echo "   2. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)"
        echo "   3. Check Azure Static Web Apps deployment logs"
        echo "   4. Manual test: Open $ANALYTICS_URL and check for new endpoint"
        echo ""
        echo "ℹ️  Note: CDN propagation can sometimes take 15-20 minutes"
    fi
}

# Main execution
echo "🚀 Starting deployment monitoring for configuration update..."
echo ""
check_git_status
monitor_deployment
