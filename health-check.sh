#!/bin/bash

# Designetica Development Environment Health Monitor
# Checks if services are running and restarts them if needed

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

check_and_restart() {
    local url=$1
    local service_name=$2
    local restart_command=$3
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is down! Restarting...${NC}"
        eval "$restart_command"
        sleep 5
        
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name restarted successfully${NC}"
        else
            echo -e "${RED}❌ Failed to restart $service_name${NC}"
            return 1
        fi
    fi
}

echo "🔍 Checking Designetica services..."
echo ""

# Check backend
check_and_restart "http://localhost:7071/api/health" \
    "Azure Functions (Backend)" \
    "cd backend && func start --port 7071 > ../logs/backend.log 2>&1 & echo \$! > ../logs/backend.pid && cd .."

echo ""

# Check frontend
check_and_restart "http://localhost:5173" \
    "Frontend (Vite)" \
    "npm run dev > logs/frontend.log 2>&1 & echo \$! > logs/frontend.pid"

echo ""
echo -e "${GREEN}Health check complete!${NC}"
