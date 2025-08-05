#!/bin/bash

# Post-deployment monitoring script
# This script continuously monitors the health of your deployed application

echo "📊 Starting post-deployment monitoring..."

# Configuration
HEALTH_CHECK_URL=""
CHECK_INTERVAL=30  # seconds
MAX_FAILURES=3
CURRENT_FAILURES=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get the function app URL
get_function_app_url() {
    if command -v azd &> /dev/null && [ -d ".azure" ]; then
        # Try to get URL from azd
        local env_name=$(azd env list --output json 2>/dev/null | jq -r '.[0].Name // empty' 2>/dev/null)
        if [ ! -z "$env_name" ]; then
            azd env select "$env_name" &>/dev/null
            local url=$(azd show --output json 2>/dev/null | jq -r '.services.backend.endpoint // empty' 2>/dev/null)
            if [ ! -z "$url" ]; then
                echo "$url"
                return
            fi
        fi
    fi
    
    # Fallback: try to get from Azure CLI
    if command -v az &> /dev/null; then
        local app_name=$(az functionapp list --query "[?contains(name, 'designetica')].name" -o tsv 2>/dev/null | head -1)
        if [ ! -z "$app_name" ]; then
            echo "https://$app_name.azurewebsites.net"
            return
        fi
    fi
    
    echo ""
}

# Check health endpoint
check_health() {
    local url="$1/api/healthCheck"
    local response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "$url" 2>/dev/null)
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        local status=$(cat /tmp/health_response.json | jq -r '.status // "unknown"' 2>/dev/null)
        echo "$http_code:$status"
    else
        echo "$http_code:unknown"
    fi
}

# Test wireframe generation
test_wireframe() {
    local url="$1/api/generateWireframe"
    local test_payload='{"description": "test wireframe", "colorScheme": "primary"}'
    
    local response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        -o /tmp/wireframe_response.json "$url" 2>/dev/null)
    
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        # Check if response contains HTML
        if cat /tmp/wireframe_response.json | jq -r '.html // ""' | grep -q "<!DOCTYPE html>"; then
            echo "$http_code:success"
        else
            echo "$http_code:no_html"
        fi
    else
        echo "$http_code:failed"
    fi
}

# Get Application Insights logs
check_logs() {
    if command -v az &> /dev/null; then
        echo -e "${BLUE}📋 Recent Application Insights logs:${NC}"
        az monitor app-insights query \
            --app 59c62182-daec-44b5-befd-c36531f70421 \
            --analytics-query "traces | where timestamp > ago(5m) | where severityLevel >= 2 | project timestamp, message | order by timestamp desc | limit 5" \
            --output table 2>/dev/null || echo "No recent errors in logs"
    fi
}

# Main monitoring loop
main() {
    echo "🔍 Detecting Function App URL..."
    HEALTH_CHECK_URL=$(get_function_app_url)
    
    if [ -z "$HEALTH_CHECK_URL" ]; then
        echo -e "${RED}❌ Could not detect Function App URL${NC}"
        echo "Please ensure your app is deployed and accessible"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Monitoring: $HEALTH_CHECK_URL${NC}"
    echo "Press Ctrl+C to stop monitoring"
    echo ""
    
    while true; do
        timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        echo -e "${BLUE}[$timestamp]${NC} Checking health..."
        
        # Health check
        health_result=$(check_health "$HEALTH_CHECK_URL")
        http_code=$(echo "$health_result" | cut -d':' -f1)
        status=$(echo "$health_result" | cut -d':' -f2)
        
        if [ "$http_code" = "200" ] && [ "$status" = "healthy" ]; then
            echo -e "${GREEN}✅ Health: OK ($status)${NC}"
            CURRENT_FAILURES=0
        elif [ "$http_code" = "200" ] && [ "$status" = "degraded" ]; then
            echo -e "${YELLOW}⚠️ Health: DEGRADED ($status)${NC}"
            CURRENT_FAILURES=$((CURRENT_FAILURES + 1))
        else
            echo -e "${RED}❌ Health: FAILED (HTTP $http_code, status: $status)${NC}"
            CURRENT_FAILURES=$((CURRENT_FAILURES + 1))
        fi
        
        # Test wireframe generation
        echo "  🧪 Testing wireframe generation..."
        wireframe_result=$(test_wireframe "$HEALTH_CHECK_URL")
        wire_http_code=$(echo "$wireframe_result" | cut -d':' -f1)
        wire_status=$(echo "$wireframe_result" | cut -d':' -f2)
        
        if [ "$wire_http_code" = "200" ] && [ "$wire_status" = "success" ]; then
            echo -e "  ${GREEN}✅ Wireframe: OK${NC}"
        else
            echo -e "  ${RED}❌ Wireframe: FAILED (HTTP $wire_http_code, result: $wire_status)${NC}"
            CURRENT_FAILURES=$((CURRENT_FAILURES + 1))
        fi
        
        # Check if we've hit max failures
        if [ $CURRENT_FAILURES -ge $MAX_FAILURES ]; then
            echo ""
            echo -e "${RED}🚨 ALERT: $CURRENT_FAILURES consecutive failures detected!${NC}"
            echo -e "${RED}🚨 Your application may be experiencing issues.${NC}"
            echo ""
            check_logs
            echo ""
            echo "Continuing monitoring..."
            CURRENT_FAILURES=0  # Reset to avoid spam
        fi
        
        echo ""
        sleep $CHECK_INTERVAL
    done
}

# Handle Ctrl+C gracefully
trap 'echo -e "\n${YELLOW}👋 Monitoring stopped${NC}"; exit 0' INT

main
