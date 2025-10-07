#!/bin/bash

# Designetica Development Environment Startup Script
# This ensures both frontend and backend are always running

set -e  # Exit on error

echo "🚀 Starting Designetica Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}⏳ Waiting for $name to be ready...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    echo -e "${RED}❌ $name failed to start after $max_attempts seconds${NC}"
    return 1
}

# Check if backend is already running on port 7071
if check_port 7071; then
    echo -e "${GREEN}✅ Azure Functions already running on port 7071${NC}"
else
    echo -e "${YELLOW}🔧 Starting Azure Functions...${NC}"
    cd backend
    func start --port 7071 > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    cd ..
    
    # Wait for backend to be ready
    if ! wait_for_service "http://localhost:7071/api/health" "Azure Functions"; then
        echo -e "${RED}❌ Backend failed to start. Check logs/backend.log${NC}"
        exit 1
    fi
fi

# Check if frontend is already running on port 5173
if check_port 5173; then
    echo -e "${GREEN}✅ Frontend already running on port 5173${NC}"
else
    echo -e "${YELLOW}🔧 Starting Frontend (Vite)...${NC}"
    npm run dev > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > logs/frontend.pid
    
    # Wait for frontend to be ready
    if ! wait_for_service "http://localhost:5173" "Frontend"; then
        echo -e "${RED}❌ Frontend failed to start. Check logs/frontend.log${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}🎉 All services are running!${NC}"
echo ""
echo "📍 Services:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:7071"
echo "   Health:    http://localhost:7071/api/health"
echo ""
echo "📋 Logs:"
echo "   Backend:   tail -f logs/backend.log"
echo "   Frontend:  tail -f logs/frontend.log"
echo ""
echo "🛑 To stop all services, run: ./stop-dev.sh"
echo ""
