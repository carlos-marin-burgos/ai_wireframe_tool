#!/bin/bash

# Smart Backend Startup Script
# Ensures Azure Functions run consistently and handles port conflicts automatically

set -e  # Exit on any error

# Configuration
PREFERRED_PORT=7071
FALLBACK_PORT=7072
MAX_RETRIES=3
BACKEND_DIR="$(dirname "$0")/backend"
PID_FILE="$BACKEND_DIR/azure-functions.pid"
LOG_FILE="$BACKEND_DIR/startup.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Designetica Backend Services...${NC}"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    echo -e "${YELLOW}⚠️  Killing processes on port $port...${NC}"
    if lsof -ti:$port >/dev/null 2>&1; then
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to find an available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while check_port $port; do
        echo -e "${YELLOW}⚠️  Port $port is in use, trying next port...${NC}"
        port=$((port + 1))
        if [ $port -gt $((start_port + 10)) ]; then
            echo -e "${RED}❌ No available ports found in range $start_port-$((start_port + 10))${NC}"
            return 1
        fi
    done
    
    echo $port
}

# Function to stop existing Azure Functions
stop_existing_functions() {
    echo -e "${YELLOW}🛑 Stopping any existing Azure Functions...${NC}"
    
    # Kill by PID file first
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 $pid 2>/dev/null; then
            echo -e "${YELLOW}Stopping process $pid...${NC}"
            kill $pid 2>/dev/null || true
            sleep 2
            kill -9 $pid 2>/dev/null || true
        fi
        rm -f "$PID_FILE"
    fi
    
    # Kill by process name
    pkill -f "func start" 2>/dev/null || true
    pkill -f "Azure.Functions.Cli" 2>/dev/null || true
    
    # Kill by port
    kill_port $PREFERRED_PORT
    kill_port $FALLBACK_PORT
    
    sleep 3
}

# Function to start Azure Functions
start_functions() {
    local port=$1
    local attempt=$2
    
    echo -e "${BLUE}🔄 Starting Azure Functions on port $port (attempt $attempt/$MAX_RETRIES)...${NC}"
    
    cd "$BACKEND_DIR"
    
    # Start Azure Functions in background
    nohup func start --port $port > "$LOG_FILE" 2>&1 &
    local func_pid=$!
    
    # Save PID
    echo $func_pid > "$PID_FILE"
    
    echo -e "${BLUE}⏳ Waiting for Azure Functions to start (PID: $func_pid)...${NC}"
    
    # Wait for startup (max 60 seconds)
    local timeout=60
    local elapsed=0
    local started=false
    
    while [ $elapsed -lt $timeout ]; do
        if check_port $port; then
            # Test if the API is responding
            if curl -s -f "http://localhost:$port/api/health" >/dev/null 2>&1; then
                started=true
                break
            fi
        fi
        
        # Check if process is still running
        if ! kill -0 $func_pid 2>/dev/null; then
            echo -e "${RED}❌ Azure Functions process died unexpectedly${NC}"
            return 1
        fi
        
        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done
    
    echo ""
    
    if [ "$started" = true ]; then
        echo -e "${GREEN}✅ Azure Functions started successfully on port $port${NC}"
        echo -e "${GREEN}📍 Health check: http://localhost:$port/api/health${NC}"
        echo -e "${GREEN}📍 Direct Image API: http://localhost:$port/api/direct-image-to-wireframe${NC}"
        echo $port > "$BACKEND_DIR/current-port.txt"
        return 0
    else
        echo -e "${RED}❌ Azure Functions failed to start within $timeout seconds${NC}"
        kill $func_pid 2>/dev/null || true
        rm -f "$PID_FILE"
        return 1
    fi
}

# Function to update Vite config with the correct port
update_vite_config() {
    local port=$1
    local vite_config="$(dirname "$0")/vite.config.ts"
    
    echo -e "${BLUE}🔧 Updating Vite proxy configuration to use port $port...${NC}"
    
    # Create backup
    cp "$vite_config" "$vite_config.backup"
    
    # Update the target port in vite.config.ts
    sed -i.tmp "s|target: \"http://localhost:[0-9]*\"|target: \"http://localhost:$port\"|g" "$vite_config"
    rm -f "$vite_config.tmp"
    
    echo -e "${GREEN}✅ Vite config updated${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🔍 Checking system status...${NC}"
    
    # Stop any existing processes
    stop_existing_functions
    
    # Try to start on preferred port first
    local selected_port=$PREFERRED_PORT
    
    if check_port $PREFERRED_PORT; then
        echo -e "${YELLOW}⚠️  Preferred port $PREFERRED_PORT is in use${NC}"
        selected_port=$(find_available_port $PREFERRED_PORT)
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Could not find an available port${NC}"
            exit 1
        fi
    fi
    
    echo -e "${BLUE}🎯 Selected port: $selected_port${NC}"
    
    # Try to start Azure Functions
    local attempt=1
    while [ $attempt -le $MAX_RETRIES ]; do
        if start_functions $selected_port $attempt; then
            # Update Vite config to match the port we're using
            update_vite_config $selected_port
            
            echo -e "${GREEN}🎉 Backend started successfully!${NC}"
            echo -e "${GREEN}📝 Logs: $LOG_FILE${NC}"
            echo -e "${GREEN}🔗 Backend URL: http://localhost:$selected_port${NC}"
            echo ""
            echo -e "${BLUE}💡 To stop the backend, run: ./stop-backend.sh${NC}"
            exit 0
        else
            echo -e "${YELLOW}⚠️  Attempt $attempt failed${NC}"
            if [ $attempt -lt $MAX_RETRIES ]; then
                echo -e "${BLUE}🔄 Retrying in 5 seconds...${NC}"
                sleep 5
            fi
        fi
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ Failed to start Azure Functions after $MAX_RETRIES attempts${NC}"
    exit 1
}

# Check if we're in the right directory
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Run main function
main