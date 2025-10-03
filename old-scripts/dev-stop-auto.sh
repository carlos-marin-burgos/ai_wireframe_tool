#!/bin/bash

# Designetica Stop Script
# This script stops all running development services

set -e

WORKSPACE_DIR="/Users/carlosmarinburgos/designetica"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}🛑 Stopping Designetica Development Environment...${NC}"

# Function to kill process by PID file
kill_by_pidfile() {
    local pidfile=$1
    local service_name=$2
    
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo -e "${YELLOW}🔧 Stopping $service_name (PID: $pid)...${NC}"
            kill "$pid" 2>/dev/null || true
            sleep 2
            
            # Force kill if still running
            if ps -p "$pid" > /dev/null 2>&1; then
                echo -e "${YELLOW}⚠️  Force killing $service_name...${NC}"
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
        fi
        rm -f "$pidfile"
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Function to kill process by port
kill_by_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}🔧 Stopping $service_name on port $port...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}✅ $service_name stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  $service_name was not running on port $port${NC}"
    fi
}

# Stop services by PID files first
kill_by_pidfile "$WORKSPACE_DIR/.express.pid" "Express Server"
kill_by_pidfile "$WORKSPACE_DIR/.azure.pid" "Azure Functions"
kill_by_pidfile "$WORKSPACE_DIR/.frontend.pid" "Frontend"

# Fallback: Stop services by port
echo -e "${YELLOW}🔍 Checking for remaining processes...${NC}"
kill_by_port 5001 "Express Server"
kill_by_port 7072 "Azure Functions"
kill_by_port 5173 "Frontend"

# Clean up log files
echo -e "${YELLOW}🧹 Cleaning up log files...${NC}"
rm -f "$WORKSPACE_DIR/express-startup.log"
rm -f "$WORKSPACE_DIR/azure-functions-startup.log"
rm -f "$WORKSPACE_DIR/frontend-startup.log"

echo ""
echo -e "${GREEN}🎉 All services stopped successfully!${NC}"
echo -e "${YELLOW}💡 To start services again, run: ./dev-start-auto.sh${NC}"
