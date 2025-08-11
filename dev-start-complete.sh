#!/bin/bash

# Complete Development Environment Startup Script
# This script will start both frontend and backend and keep them running

set -e

echo "🚀 Starting Complete Development Environment..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill processes on a port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Cleaning up port $port...${NC}"
    if check_port $port; then
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to wait for service to start
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}Waiting for $name to start...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    echo -e "${RED}❌ $name failed to start after $max_attempts seconds${NC}"
    return 1
}

# Cleanup existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
kill_port 7072
kill_port 5173
kill_port 3000

# Ensure we're in the right directory
cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"

echo -e "${BLUE}📁 Project root: $PROJECT_ROOT${NC}"

# Start Azure Functions (Backend)
echo -e "${BLUE}🔧 Starting Azure Functions backend...${NC}"
cd "$PROJECT_ROOT/backend"

# Check if local.settings.json exists
if [ ! -f "local.settings.json" ]; then
    echo -e "${RED}❌ Missing local.settings.json in backend directory${NC}"
    exit 1
fi

# Start Azure Functions in background
nohup func start --port 7072 > "$PROJECT_ROOT/backend-logs.txt" 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID" > "$PROJECT_ROOT/.dev-pids"

# Wait for backend to start
if wait_for_service "http://localhost:7072/api/health" "Azure Functions Backend"; then
    echo -e "${GREEN}✅ Backend started successfully on port 7072${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    exit 1
fi

# Start Frontend
echo -e "${BLUE}🎨 Starting Vite frontend...${NC}"
cd "$PROJECT_ROOT"

# Start Vite in background
nohup npx vite --port 5173 > "$PROJECT_ROOT/frontend-logs.txt" 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID" >> "$PROJECT_ROOT/.dev-pids"

# Wait for frontend to start
if wait_for_service "http://localhost:5173" "Vite Frontend"; then
    echo -e "${GREEN}✅ Frontend started successfully on port 5173${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Test the full stack
echo -e "${BLUE}🧪 Testing full stack connection...${NC}"
if node test-full-stack.js; then
    echo -e "${GREEN}✅ Full stack test passed!${NC}"
else
    echo -e "${YELLOW}⚠️ Full stack test had issues, but services are running${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Development environment is ready!${NC}"
echo "=============================================="
echo -e "${BLUE}📍 Access Points:${NC}"
echo "   • Frontend: http://localhost:5173"
echo "   • Backend:  http://localhost:7072"
echo "   • Health:   http://localhost:7072/api/health"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo "   • Backend:  tail -f backend-logs.txt"
echo "   • Frontend: tail -f frontend-logs.txt"
echo ""
echo -e "${BLUE}🛑 To stop all services:${NC}"
echo "   • Run: ./dev-stop.sh"
echo "   • Or: npm run dev:stop"
echo ""
echo -e "${YELLOW}💡 Tip: Services will continue running in the background${NC}"
echo -e "${YELLOW}   Keep this terminal open to see the status${NC}"

# Keep script running and monitor services
echo -e "${BLUE}🔍 Monitoring services... (Press Ctrl+C to stop monitoring)${NC}"
while true; do
    sleep 30
    
    # Check if services are still running
    if ! check_port 7072; then
        echo -e "${RED}❌ Backend service stopped unexpectedly${NC}"
        break
    fi
    
    if ! check_port 5173; then
        echo -e "${RED}❌ Frontend service stopped unexpectedly${NC}"
        break
    fi
    
    echo -e "${GREEN}✅ All services running ($(date))${NC}"
done
