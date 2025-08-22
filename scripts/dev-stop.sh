#!/bin/bash

# Development Environment Stop Script
# This script will gracefully stop all development services

set -e

echo "🛑 Stopping Development Environment..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill processes on a port
kill_port() {
    local port=$1
    local service_name=$2
    
    echo -e "${YELLOW}Stopping $service_name (port $port)...${NC}"
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        sleep 1
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${RED}❌ Failed to stop $service_name${NC}"
        else
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        fi
    else
        echo -e "${GREEN}✅ $service_name was not running${NC}"
    fi
}

# Stop services
kill_port 7072 "Azure Functions Backend"
kill_port 5173 "Vite Frontend"
kill_port 3000 "Unified Server (if running)"

# Clean up PID file
if [ -f ".dev-pids" ]; then
    echo -e "${YELLOW}Cleaning up PID file...${NC}"
    rm -f ".dev-pids"
fi

# Clean up log files (optional)
if [ -f "backend-logs.txt" ] || [ -f "frontend-logs.txt" ]; then
    echo -e "${YELLOW}Cleaning up log files...${NC}"
    rm -f backend-logs.txt frontend-logs.txt
fi

echo ""
echo -e "${GREEN}✅ All development services stopped!${NC}"
echo "======================================"
