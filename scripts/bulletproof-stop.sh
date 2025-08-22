#!/bin/bash

# Bulletproof Stop Script
# Cleanly stops all development services

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🛑 STOPPING BULLETPROOF DEV ENVIRONMENT"
echo "======================================"

# Stop by PID if available
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        log_info "Stopping backend (PID: $BACKEND_PID)"
        kill $BACKEND_PID
        sleep 2
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill -9 $BACKEND_PID
        fi
    fi
    rm -f .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        log_info "Stopping frontend (PID: $FRONTEND_PID)"
        kill $FRONTEND_PID
        sleep 2
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill -9 $FRONTEND_PID
        fi
    fi
    rm -f .frontend.pid
fi

# Fallback: kill by port
log_info "Cleaning up any remaining processes..."

# Kill processes on ports
for port in 5173 7072 3000; do
    pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        log_info "Killing processes on port $port"
        echo $pids | xargs kill -9 2>/dev/null || true
    fi
done

# Kill by process name
pkill -f "vite" 2>/dev/null || true
pkill -f "func start" 2>/dev/null || true
pkill -f "azure-functions" 2>/dev/null || true

sleep 2

log_success "All development services stopped"
echo "✅ Ports 5173, 7072, and 3000 are now free"
