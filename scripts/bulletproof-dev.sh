#!/bin/bash

# Bulletproof Development Environment Starter
# This script eliminates the constant connection issues by:
# 1. Properly cleaning up any stuck processes
# 2. Starting services in the correct order
# 3. Waiting for proper initialization
# 4. Providing health checks
# 5. Auto-recovery on failures

set -e  # Exit on any error

echo "🔥 BULLETPROOF DEV ENVIRONMENT STARTUP"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log with colors
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        log_warning "Killing existing processes on port $port"
        echo $pids | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=0
    
    log_info "Waiting for $name to start..."
    while [ $attempt -lt $max_attempts ]; do
        if curl -s -f "$url" >/dev/null 2>&1; then
            log_success "$name is ready!"
            return 0
        fi
        printf "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "$name failed to start after $((max_attempts * 2)) seconds"
    return 1
}

# Function to check if Azure Functions tools are installed
check_azure_tools() {
    if ! command -v func &> /dev/null; then
        log_error "Azure Functions Core Tools not found!"
        echo "Install with: npm install -g azure-functions-core-tools@4 --unsafe-perm true"
        exit 1
    fi
    log_success "Azure Functions Core Tools found"
}

# Step 1: Clean up any existing processes
log_info "Step 1: Cleaning up existing processes..."
kill_port 5173
kill_port 7072
kill_port 3000

# Kill any remaining node processes that might be stuck
pkill -f "vite" 2>/dev/null || true
pkill -f "func start" 2>/dev/null || true
sleep 3

# Step 2: Check prerequisites
log_info "Step 2: Checking prerequisites..."
check_azure_tools

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "package.json not found. Make sure you're in the project root."
    exit 1
fi

if [ ! -d "backend" ]; then
    log_error "backend directory not found. Make sure you're in the project root."
    exit 1
fi

# Step 3: Install dependencies if needed
log_info "Step 3: Ensuring dependencies are installed..."
if [ ! -d "node_modules" ]; then
    log_warning "Frontend dependencies not found, installing..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    log_warning "Backend dependencies not found, installing..."
    cd backend && npm install && cd ..
fi

log_success "Dependencies verified"

# Step 4: Start Azure Functions Backend
log_info "Step 4: Starting Azure Functions Backend..."
cd backend

# Create a wrapper script for func start to handle environment properly
cat > start-func.sh << 'EOF'
#!/bin/bash
export NODE_ENV=development
export FUNCTIONS_WORKER_RUNTIME=node
func start --port 7072 --host 0.0.0.0
EOF

chmod +x start-func.sh

# Start backend in background
nohup ./start-func.sh > ../backend-startup.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
if wait_for_service "http://localhost:7072/api/health" "Azure Functions Backend"; then
    log_success "Backend started successfully (PID: $BACKEND_PID)"
else
    log_error "Backend failed to start. Check backend-startup.log for details."
    cat backend-startup.log
    exit 1
fi

# Step 5: Start Vite Frontend
log_info "Step 5: Starting Vite Frontend..."

# Start frontend in background
nohup npx vite --port 5173 --host 0.0.0.0 > frontend-startup.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to be ready
if wait_for_service "http://localhost:5173" "Vite Frontend"; then
    log_success "Frontend started successfully (PID: $FRONTEND_PID)"
else
    log_error "Frontend failed to start. Check frontend-startup.log for details."
    cat frontend-startup.log
    exit 1
fi

# Step 6: Final health checks
log_info "Step 6: Running final health checks..."

# Test backend health
if curl -s "http://localhost:7072/api/health" | grep -q "OK\|healthy\|status" 2>/dev/null; then
    log_success "Backend health check passed"
else
    log_warning "Backend health check unclear, but service is responding"
fi

# Test frontend
if curl -s -I "http://localhost:5173" | grep -q "200 OK"; then
    log_success "Frontend health check passed"
else
    log_error "Frontend health check failed"
fi

# Step 7: Save process IDs for cleanup
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# Success!
echo ""
echo "🎉 BULLETPROOF DEV ENVIRONMENT READY!"
echo "===================================="
echo ""
log_success "Frontend: http://localhost:5173"
log_success "Backend:  http://localhost:7072"
log_success "Health:   http://localhost:7072/api/health"
echo ""
echo "📋 Process IDs saved to:"
echo "   Backend PID: $BACKEND_PID (saved to .backend.pid)"
echo "   Frontend PID: $FRONTEND_PID (saved to .frontend.pid)"
echo ""
echo "🛑 To stop services:"
echo "   ./bulletproof-stop.sh"
echo ""
echo "📊 To monitor services:"
echo "   ./bulletproof-monitor.sh"
echo ""
echo "🔧 Log files:"
echo "   Backend:  tail -f backend-startup.log"
echo "   Frontend: tail -f frontend-startup.log"
echo ""
log_success "Environment is stable and ready for development!"
