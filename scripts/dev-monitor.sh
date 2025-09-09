#!/bin/bash

# Service Health Monitor
# This script continuously monitors the health of development services

echo "🔍 Development Environment Health Monitor"
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check service health
check_service() {
    local url=$1
    local name=$2
    
    if curl -s "$url" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $name${NC}"
        return 0
    else
        echo -e "${RED}❌ $name${NC}"
        return 1
    fi
}

# Function to check port
check_port() {
    local port=$1
    local name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $name (port $port)${NC}"
        return 0
    else
        echo -e "${RED}❌ $name (port $port)${NC}"
        return 1
    fi
}

# Main monitoring loop
while true; do
    clear
    echo -e "${BLUE}🔍 Development Environment Status - $(date)${NC}"
    echo "=============================================="
    
    echo -e "${BLUE}Port Status:${NC}"
    check_port 7072 "Azure Functions Backend"
    check_port 5173 "Vite Frontend"
    
    echo ""
    echo -e "${BLUE}Service Health:${NC}"
    check_service "http://localhost:7072/api/health" "Backend Health Endpoint"
    check_service "http://localhost:5173" "Frontend"
    
    echo ""
    echo -e "${BLUE}Full Stack Test:${NC}"
    if node test-full-stack.js >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Full Stack Integration${NC}"
    else
        echo -e "${RED}❌ Full Stack Integration${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop monitoring${NC}"
    echo "=============================================="
    
    sleep 10
done
