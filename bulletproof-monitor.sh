#!/bin/bash

# Bulletproof Monitor Script
# Continuously monitors the health of your development services

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

check_service() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" >/dev/null 2>&1; then
        log_success "$name is running"
        return 0
    else
        log_error "$name is DOWN"
        return 1
    fi
}

auto_restart() {
    log_warning "Attempting auto-restart..."
    ./bulletproof-stop.sh
    sleep 3
    ./bulletproof-dev.sh
}

echo "🔍 BULLETPROOF MONITOR"
echo "===================="
echo "Monitoring your development environment..."
echo "Press Ctrl+C to stop monitoring"
echo ""

FAILURE_COUNT=0
MAX_FAILURES=3

while true; do
    clear
    echo "🔍 BULLETPROOF MONITOR - $(date)"
    echo "===================="
    
    # Check processes by PID
    if [ -f ".backend.pid" ] && [ -f ".frontend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        FRONTEND_PID=$(cat .frontend.pid)
        
        if kill -0 $BACKEND_PID 2>/dev/null; then
            log_success "Backend process running (PID: $BACKEND_PID)"
        else
            log_error "Backend process not found (PID: $BACKEND_PID)"
        fi
        
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            log_success "Frontend process running (PID: $FRONTEND_PID)"
        else
            log_error "Frontend process not found (PID: $FRONTEND_PID)"
        fi
    else
        log_warning "PID files not found - services may not be started with bulletproof script"
    fi
    
    echo ""
    
    # Check port availability
    if lsof -i:5173 >/dev/null 2>&1; then
        log_success "Port 5173 (Frontend) is in use"
    else
        log_error "Port 5173 (Frontend) is free - service not running"
    fi
    
    if lsof -i:7072 >/dev/null 2>&1; then
        log_success "Port 7072 (Backend) is in use"
    else
        log_error "Port 7072 (Backend) is free - service not running"
    fi
    
    echo ""
    
    # Check service health
    FRONTEND_OK=false
    BACKEND_OK=false
    
    if check_service "http://localhost:5173" "Frontend (Vite)"; then
        FRONTEND_OK=true
    fi
    
    if check_service "http://localhost:7072/api/health" "Backend (Azure Functions)"; then
        BACKEND_OK=true
    fi
    
    echo ""
    
    # Auto-restart logic
    if [ "$FRONTEND_OK" = false ] || [ "$BACKEND_OK" = false ]; then
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
        log_warning "Service failure detected (Count: $FAILURE_COUNT/$MAX_FAILURES)"
        
        if [ $FAILURE_COUNT -ge $MAX_FAILURES ]; then
            log_error "Multiple failures detected - attempting auto-restart..."
            auto_restart
            FAILURE_COUNT=0
        fi
    else
        FAILURE_COUNT=0
        log_success "All services healthy"
    fi
    
    echo ""
    echo "📊 Service URLs:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:7072"
    echo "   Health:   http://localhost:7072/api/health"
    echo ""
    echo "🔄 Next check in 10 seconds... (Ctrl+C to stop)"
    
    sleep 10
done
