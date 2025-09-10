#!/bin/bash

# Designetica Auto-Start Script
# This script ensures both backend servers are running automatically

set -e

WORKSPACE_DIR="/Users/carlosmarinburgos/designetica"
BACKEND_DIR="$WORKSPACE_DIR/backend"
EXPRESS_PORT=5001
AZURE_FUNCTIONS_PORT=7072

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Designetica Full Development Environment...${NC}"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}⚠️  Killing existing process on port $port${NC}"
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Function to start Express server
start_express_server() {
    echo -e "${GREEN}🔧 Starting Express Server (Port $EXPRESS_PORT)...${NC}"
    
    if check_port $EXPRESS_PORT; then
        echo -e "${YELLOW}⚠️  Port $EXPRESS_PORT is already in use${NC}"
        kill_port $EXPRESS_PORT
    fi
    
    cd "$BACKEND_DIR"
    
    # Start Express server in background
    nohup node simple-server.js > "$WORKSPACE_DIR/express-startup.log" 2>&1 &
    EXPRESS_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Check if server is running
    if check_port $EXPRESS_PORT; then
        echo -e "${GREEN}✅ Express Server started successfully (PID: $EXPRESS_PID)${NC}"
        echo -e "${GREEN}📍 Health endpoint: http://localhost:$EXPRESS_PORT/api/health${NC}"
    else
        echo -e "${RED}❌ Failed to start Express Server${NC}"
        echo -e "${RED}📋 Check logs: $WORKSPACE_DIR/express-startup.log${NC}"
        exit 1
    fi
}

# Function to start Azure Functions
start_azure_functions() {
    echo -e "${GREEN}⚡ Starting Azure Functions (Port $AZURE_FUNCTIONS_PORT)...${NC}"
    
    if check_port $AZURE_FUNCTIONS_PORT; then
        echo -e "${YELLOW}⚠️  Port $AZURE_FUNCTIONS_PORT is already in use${NC}"
        kill_port $AZURE_FUNCTIONS_PORT
    fi
    
    cd "$BACKEND_DIR"
    
    # Start Azure Functions in background
    nohup func start --port $AZURE_FUNCTIONS_PORT --host 0.0.0.0 > "$WORKSPACE_DIR/azure-functions-startup.log" 2>&1 &
    AZURE_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Check if server is running
    if check_port $AZURE_FUNCTIONS_PORT; then
        echo -e "${GREEN}✅ Azure Functions started successfully (PID: $AZURE_PID)${NC}"
        echo -e "${GREEN}📍 Functions endpoint: http://localhost:$AZURE_FUNCTIONS_PORT${NC}"
    else
        echo -e "${RED}❌ Failed to start Azure Functions${NC}"
        echo -e "${RED}📋 Check logs: $WORKSPACE_DIR/azure-functions-startup.log${NC}"
        exit 1
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "${GREEN}🌐 Starting Frontend Dev Server (Port 5173)...${NC}"
    
    cd "$WORKSPACE_DIR"
    
    # Check if frontend is already running
    if check_port 5173; then
        echo -e "${GREEN}✅ Frontend is already running on port 5173${NC}"
        return 0
    fi
    
    # Start frontend in background
    nohup npm run dev > "$WORKSPACE_DIR/frontend-startup.log" 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Check if server is running
    if check_port 5173; then
        echo -e "${GREEN}✅ Frontend started successfully (PID: $FRONTEND_PID)${NC}"
        echo -e "${GREEN}📍 Frontend URL: http://localhost:5173${NC}"
    else
        echo -e "${RED}❌ Failed to start Frontend${NC}"
        echo -e "${RED}📋 Check logs: $WORKSPACE_DIR/frontend-startup.log${NC}"
        exit 1
    fi
}

# Function to test backend health
test_backend_health() {
    echo -e "${GREEN}🏥 Testing backend health...${NC}"
    
    # Test Express server
    if curl -f -s "http://localhost:$EXPRESS_PORT/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Express Server health check passed${NC}"
    else
        echo -e "${RED}❌ Express Server health check failed${NC}"
    fi
    
    # Test Azure Functions
    if curl -f -s "http://localhost:$AZURE_FUNCTIONS_PORT/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Azure Functions health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Azure Functions health check failed (may not have health endpoint)${NC}"
    fi
}

# Function to save PIDs for later cleanup
save_pids() {
    echo "$EXPRESS_PID" > "$WORKSPACE_DIR/.express.pid" 2>/dev/null || true
    echo "$AZURE_PID" > "$WORKSPACE_DIR/.azure.pid" 2>/dev/null || true
    echo "$FRONTEND_PID" > "$WORKSPACE_DIR/.frontend.pid" 2>/dev/null || true
}

# Main execution
echo -e "${GREEN}📂 Working directory: $WORKSPACE_DIR${NC}"

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

# Check if required files exist
if [ ! -f "$BACKEND_DIR/simple-server.js" ]; then
    echo -e "${RED}❌ Express server file not found: $BACKEND_DIR/simple-server.js${NC}"
    exit 1
fi

# Start all services
start_express_server
start_azure_functions
start_frontend

# Save process IDs
save_pids

# Test health
sleep 2
test_backend_health

echo ""
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo -e "${GREEN}🔗 Access your app at: http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}📝 Service Status:${NC}"
echo -e "${GREEN}   • Express Server: http://localhost:$EXPRESS_PORT (Primary Backend)${NC}"
echo -e "${GREEN}   • Azure Functions: http://localhost:$AZURE_FUNCTIONS_PORT (Fallback Backend)${NC}"
echo -e "${GREEN}   • Frontend: http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}📋 Logs:${NC}"
echo -e "   • Express: $WORKSPACE_DIR/express-startup.log"
echo -e "   • Azure Functions: $WORKSPACE_DIR/azure-functions-startup.log"
echo -e "   • Frontend: $WORKSPACE_DIR/frontend-startup.log"
echo ""
echo -e "${YELLOW}🛑 To stop all services, run: ./dev-stop.sh${NC}"
