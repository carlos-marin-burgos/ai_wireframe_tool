#!/bin/bash

# Designetica Development Environment Stop Script

set -e

echo "🛑 Stopping Designetica Development Environment..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to stop a service by PID file
stop_service() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        PID=$(cat "$pid_file")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${YELLOW}Stopping $service_name (PID: $PID)...${NC}"
            kill $PID
            sleep 2
            
            # Force kill if still running
            if ps -p $PID > /dev/null 2>&1; then
                echo -e "${YELLOW}Force stopping $service_name...${NC}"
                kill -9 $PID
            fi
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name not running (stale PID file)${NC}"
        fi
        rm "$pid_file"
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Stop backend
stop_service "logs/backend.pid" "Azure Functions"

# Stop frontend
stop_service "logs/frontend.pid" "Frontend"

# Also kill any remaining processes on those ports
if lsof -i :7071 > /dev/null 2>&1; then
    echo -e "${YELLOW}Cleaning up port 7071...${NC}"
    lsof -ti :7071 | xargs kill -9 2>/dev/null || true
fi

if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "${YELLOW}Cleaning up port 5173...${NC}"
    lsof -ti :5173 | xargs kill -9 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}✅ All services stopped${NC}"
echo ""
