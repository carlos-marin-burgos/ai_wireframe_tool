#!/bin/bash

# 🩺 Designetica Offline Mode Diagnostic & Fix Script
# This script diagnoses and fixes the "offline mode - backend unavailable" issue

echo "🩺 DESIGNETICA OFFLINE MODE DIAGNOSTIC & FIX"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check what's running on development ports
echo "📡 STEP 1: Checking Development Ports"
echo "------------------------------------"

check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $service is running on port $port${NC}"
        return 0
    else
        echo -e "${RED}❌ $service is NOT running on port $port${NC}"
        return 1
    fi
}

# Check all relevant ports
frontend_ok=1
backend_primary_ok=1
backend_fallback_ok=1

check_port 5173 "Frontend (Vite)"
frontend_ok=$?

check_port 5001 "Backend (Primary/Express)"
backend_primary_ok=$?

check_port 7072 "Backend (Azure Functions Fallback)"
backend_fallback_ok=$?

echo ""

# Step 2: Test connectivity to running backends
echo "🔗 STEP 2: Testing Backend Connectivity"
echo "--------------------------------------"

test_backend() {
    local port=$1
    local name=$2
    
    echo "Testing $name on port $port..."
    
    # Test health endpoint
    response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "http://localhost:$port/api/health" 2>/dev/null)
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ $name health endpoint responding (HTTP $http_code)${NC}"
        
        # Test if it has AI capabilities
        ai_response=$(curl -s -X POST "http://localhost:$port/api/generate-wireframe" \
            -H "Content-Type: application/json" \
            -d '{"description": "test"}' \
            --max-time 5 2>/dev/null)
        
        if echo "$ai_response" | grep -q '"html"'; then
            echo -e "${GREEN}✅ $name has AI capabilities${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  $name responding but AI may not be working${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $name not responding (HTTP $http_code)${NC}"
        return 1
    fi
}

working_backend=""
if [ $backend_primary_ok -eq 0 ]; then
    if test_backend 5001 "Express Backend"; then
        working_backend="5001"
    fi
fi

if [ $backend_fallback_ok -eq 0 ]; then
    if test_backend 7072 "Azure Functions Backend"; then
        working_backend="7072"
    fi
fi

echo ""

# Step 3: Check frontend configuration
echo "⚙️  STEP 3: Checking Frontend Configuration"
echo "-----------------------------------------"

# Read current API configuration
api_config_file="src/config/api.ts"
if [ -f "$api_config_file" ]; then
    current_port=$(grep -o 'development\..*: [0-9]*' "$api_config_file" | head -1 | grep -o '[0-9]*')
    echo "Current frontend is configured to use port: $current_port"
    
    # Check if it matches the working backend
    if [ "$working_backend" != "" ] && [ "$current_port" != "$working_backend" ]; then
        echo -e "${YELLOW}⚠️  Frontend configured for port $current_port but working backend is on port $working_backend${NC}"
        echo ""
        echo "🔧 APPLYING FIX: Updating frontend configuration..."
        
        # Create backup
        cp "$api_config_file" "${api_config_file}.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Update configuration based on working backend
        if [ "$working_backend" = "7072" ]; then
            # Use fallback port (Azure Functions)
            sed -i '' 's/PORTS\.development\.primary/PORTS.development.fallback/' "$api_config_file"
            echo -e "${GREEN}✅ Updated frontend to use Azure Functions backend (port 7072)${NC}"
        elif [ "$working_backend" = "5001" ]; then
            # Use primary port (Express)
            sed -i '' 's/PORTS\.development\.fallback/PORTS.development.primary/' "$api_config_file"
            echo -e "${GREEN}✅ Updated frontend to use Express backend (port 5001)${NC}"
        fi
        
        echo -e "${BLUE}💡 Frontend configuration updated. Please refresh your browser.${NC}"
    elif [ "$working_backend" != "" ]; then
        echo -e "${GREEN}✅ Frontend configuration matches working backend (port $working_backend)${NC}"
    fi
else
    echo -e "${RED}❌ API configuration file not found: $api_config_file${NC}"
fi

echo ""

# Step 4: Provide next steps
echo "🎯 STEP 4: Next Steps & Recommendations"
echo "--------------------------------------"

if [ "$working_backend" != "" ]; then
    echo -e "${GREEN}✅ Working backend found on port $working_backend${NC}"
    
    if [ $frontend_ok -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend is running${NC}"
        echo ""
        echo -e "${BLUE}🚀 TO FIX: Refresh your browser at http://localhost:5173${NC}"
        echo -e "${BLUE}   The 'offline mode' message should disappear!${NC}"
    else
        echo -e "${RED}❌ Frontend is not running${NC}"
        echo ""
        echo -e "${YELLOW}🚀 TO FIX: Start the frontend:${NC}"
        echo "   npm run dev"
    fi
else
    echo -e "${RED}❌ No working backend found${NC}"
    echo ""
    echo -e "${YELLOW}🚀 TO FIX: Start a backend:${NC}"
    
    if [ $backend_fallback_ok -ne 0 ]; then
        echo "   Option 1 (Recommended): Start Azure Functions"
        echo "   cd backend && func start --port 7072"
        echo ""
    fi
    
    if [ $backend_primary_ok -ne 0 ]; then
        echo "   Option 2: Start Express server"
        echo "   cd backend && node simple-server.js"
        echo ""
    fi
fi

echo ""
echo "🔍 DIAGNOSTIC COMPLETE"
echo "===================="

# Final status summary
if [ "$working_backend" != "" ] && [ $frontend_ok -eq 0 ]; then
    echo -e "${GREEN}STATUS: Should be working! Refresh your browser.${NC}"
    exit 0
elif [ "$working_backend" != "" ]; then
    echo -e "${YELLOW}STATUS: Backend OK, start frontend${NC}"
    exit 1
else
    echo -e "${RED}STATUS: Need to start backend${NC}"
    exit 1
fi
