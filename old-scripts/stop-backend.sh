#!/bin/bash

# Backend Stop Script
# Safely stops all Designetica backend services

set -e

# Configuration
BACKEND_DIR="$(dirname "$0")/backend"
PID_FILE="$BACKEND_DIR/azure-functions.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping Designetica Backend Services...${NC}"

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    if lsof -ti:$port >/dev/null 2>&1; then
        echo -e "${YELLOW}Killing processes on port $port...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Stop by PID file
if [ -f "$PID_FILE" ]; then
    local pid=$(cat "$PID_FILE")
    if kill -0 $pid 2>/dev/null; then
        echo -e "${BLUE}Stopping Azure Functions (PID: $pid)...${NC}"
        kill $pid 2>/dev/null || true
        sleep 2
        # Force kill if still running
        kill -9 $pid 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
fi

# Stop by process name
echo -e "${BLUE}Stopping func processes...${NC}"
pkill -f "func start" 2>/dev/null || true
pkill -f "Azure.Functions.Cli" 2>/dev/null || true

# Stop by common ports
kill_port 7071
kill_port 7072

# Clean up port tracking file
rm -f "$BACKEND_DIR/current-port.txt"

echo -e "${GREEN}✅ Backend services stopped${NC}"