#!/bin/bash

# Enhanced Restart Azure Functions Script
# This script properly restarts functions with comprehensive health checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Enhanced Azure Functions Restart Script${NC}"
echo "================================================"

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
LOG_FILE="$BACKEND_DIR/restart.log"

# Create log file
mkdir -p "$BACKEND_DIR"
echo "$(date): Starting restart process" > "$LOG_FILE"

# Function to log with timestamp
log() {
    echo -e "${1}" | tee -a "$LOG_FILE"
    echo "$(date): ${1}" >> "$LOG_FILE"
}

log "${YELLOW}🛑 Step 1: Stopping existing processes...${NC}"

# More comprehensive process cleanup
processes_killed=0

# Kill func processes
if pgrep -f "func" > /dev/null; then
    log "   Found Azure Functions processes, terminating..."
    pkill -f "func" && processes_killed=$((processes_killed + 1))
    sleep 2
fi

# Kill processes on ports 7071-7075
for port in 7071 7072 7073 7074 7075; do
    if lsof -ti ":$port" > /dev/null 2>&1; then
        log "   Found process on port $port, terminating..."
        lsof -ti ":$port" | xargs kill -9 2>/dev/null && processes_killed=$((processes_killed + 1))
    fi
done

log "${GREEN}   Stopped $processes_killed processes${NC}"
sleep 3

log "${YELLOW}🔍 Step 2: Validating environment...${NC}"

# Navigate to backend directory
if [ ! -d "$BACKEND_DIR" ]; then
    log "${RED}❌ Error: Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

cd "$BACKEND_DIR" || {
    log "${RED}❌ Error: Could not access backend directory${NC}"
    exit 1
}

# Verify required files
if [ ! -f "host.json" ]; then
    log "${RED}❌ Error: host.json not found in $(pwd)${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    log "${RED}❌ Error: package.json not found${NC}"
    exit 1
fi

log "${GREEN}   ✅ Found required configuration files${NC}"

# Environment check
log "${YELLOW}� Step 3: Environment configuration check...${NC}"
if [ -f ".env" ]; then
    log "${GREEN}   ✅ .env file exists${NC}"
    
    # Check key environment variables
    env_vars_ok=0
    if grep -q "AZURE_OPENAI_ENDPOINT" .env; then
        ENDPOINT=$(grep "AZURE_OPENAI_ENDPOINT" .env | cut -d'=' -f2)
        log "   AZURE_OPENAI_ENDPOINT: ${ENDPOINT:0:20}... ✅"
        env_vars_ok=$((env_vars_ok + 1))
    else
        log "${YELLOW}   AZURE_OPENAI_ENDPOINT: Not found ⚠️${NC}"
    fi
    
    if grep -q "AZURE_OPENAI_API_KEY" .env; then
        KEY=$(grep "AZURE_OPENAI_API_KEY" .env | cut -d'=' -f2)
        log "   AZURE_OPENAI_API_KEY: ${KEY:0:8}... (${#KEY} chars) ✅"
        env_vars_ok=$((env_vars_ok + 1))
    else
        log "${YELLOW}   AZURE_OPENAI_API_KEY: Not found ⚠️${NC}"
    fi
    
    log "${GREEN}   Environment variables configured: $env_vars_ok/2${NC}"
else
    log "${YELLOW}   ⚠️ .env file not found - using environment variables${NC}"
fi

# Check Node.js and dependencies
log "${YELLOW}🔧 Step 4: Dependencies check...${NC}"
if ! command -v node &> /dev/null; then
    log "${RED}❌ Node.js not found${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
log "${GREEN}   ✅ Node.js version: $NODE_VERSION${NC}"

if ! command -v func &> /dev/null; then
    log "${RED}❌ Azure Functions Core Tools not found${NC}"
    log "   Install with: npm install -g azure-functions-core-tools@4 --unsafe-perm true"
    exit 1
fi

FUNC_VERSION=$(func --version)
log "${GREEN}   ✅ Azure Functions Core Tools: $FUNC_VERSION${NC}"

# Quick dependency check
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    log "${YELLOW}   ⚠️ Dependencies may be missing, running npm install...${NC}"
    npm install >> "$LOG_FILE" 2>&1
fi

log "${YELLOW}🚀 Step 5: Starting Azure Functions...${NC}"

# Clear any existing port state
rm -f "current-port.txt" "backend-started.txt" "backend.pid"

# Start with timeout and health check
log "   Starting on port 7071..."
timeout 60s func start --port 7071 &
FUNC_PID=$!
echo $FUNC_PID > "backend.pid"

# Wait for startup with progress indicator
log "   Waiting for startup (max 30 seconds)..."
for i in {1..30}; do
    if curl -s http://localhost:7071/api/health > /dev/null 2>&1; then
        log "${GREEN}   ✅ Functions started successfully on port 7071${NC}"
        echo "7071" > "current-port.txt"
        echo "$(date -u '+%Y-%m-%d %H:%M:%S UTC')" > "backend-started.txt"
        
        # Test AI endpoint
        log "${YELLOW}🤖 Step 6: Testing AI connectivity...${NC}"
        AI_HEALTH=$(curl -s http://localhost:7071/api/openai-health 2>/dev/null || echo "failed")
        if echo "$AI_HEALTH" | grep -q "healthy"; then
            log "${GREEN}   ✅ AI services are healthy${NC}"
        else
            log "${YELLOW}   ⚠️ AI services may need attention${NC}"
        fi
        
        log "${GREEN}🎉 Restart completed successfully!${NC}"
        log "${GREEN}📍 Health check: http://localhost:7071/api/health${NC}"
        log "${GREEN}📍 AI health: http://localhost:7071/api/openai-health${NC}"
        exit 0
    fi
    
    echo -n "."
    sleep 1
done

# If we get here, startup failed
log "${RED}❌ Functions failed to start within 30 seconds${NC}"
kill $FUNC_PID 2>/dev/null || true
rm -f "backend.pid"
exit 1