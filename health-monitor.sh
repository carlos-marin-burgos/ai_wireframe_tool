#!/bin/bash

# Continuous Health Monitor
# Runs in background and automatically fixes common issues

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
LOG_FILE="$SCRIPT_DIR/health-monitor.log"
PID_FILE="$SCRIPT_DIR/health-monitor.pid"
CHECK_INTERVAL=30  # seconds between checks
MAX_LOG_LINES=1000  # maximum log file lines

# Store our PID
echo $$ > "$PID_FILE"

# Initialize log
echo "$(date): Health monitor started (PID: $$)" > "$LOG_FILE"

# Function to log with timestamp
log() {
    echo "$(date): $1" >> "$LOG_FILE"
    if [ "${2:-}" = "console" ]; then
        echo -e "$1"
    fi
    
    # Rotate log if too large
    if [ $(wc -l < "$LOG_FILE") -gt $MAX_LOG_LINES ]; then
        tail -n 500 "$LOG_FILE" > "$LOG_FILE.tmp"
        mv "$LOG_FILE.tmp" "$LOG_FILE"
        echo "$(date): Log rotated" >> "$LOG_FILE"
    fi
}

# Function to check if backend is healthy
check_backend_health() {
    local port="$1"
    if curl -s --max-time 5 "http://localhost:$port/api/health" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to check AI health
check_ai_health() {
    local port="$1"
    local response=$(curl -s --max-time 10 "http://localhost:$port/api/openai-health" 2>/dev/null || echo "failed")
    if echo "$response" | grep -q "healthy"; then
        return 0
    else
        return 1
    fi
}

# Function to auto-restart backend
auto_restart_backend() {
    log "🔧 Auto-restarting backend..." "console"
    
    # Kill existing processes
    pkill -f "func start" 2>/dev/null || true
    sleep 3
    
    # Start new backend
    cd "$BACKEND_DIR"
    nohup func start --port 7071 > "$SCRIPT_DIR/backend-auto-restart.log" 2>&1 &
    
    # Wait for startup
    for i in {1..30}; do
        if check_backend_health 7071; then
            log "✅ Backend auto-restart successful"
            return 0
        fi
        sleep 2
    done
    
    log "❌ Backend auto-restart failed"
    return 1
}

# Function to cleanup orphaned processes
cleanup_orphaned_processes() {
    log "🧹 Cleaning up orphaned processes..."
    
    # Find and kill orphaned func processes
    orphaned_count=0
    for port in 7072 7073 7074 7075; do
        if lsof -ti ":$port" > /dev/null 2>&1; then
            log "   Killing orphaned process on port $port"
            lsof -ti ":$port" | xargs kill -9 2>/dev/null || true
            orphaned_count=$((orphaned_count + 1))
        fi
    done
    
    if [ $orphaned_count -gt 0 ]; then
        log "✅ Cleaned up $orphaned_count orphaned processes"
    fi
}

# Function to check memory usage
check_memory_usage() {
    if [ -f "$BACKEND_DIR/backend.pid" ]; then
        local pid=$(cat "$BACKEND_DIR/backend.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
            # Get memory usage in MB (works on both Linux and macOS)
            local memory_kb=$(ps -o rss= -p "$pid" 2>/dev/null || echo "0")
            local memory_mb=$((memory_kb / 1024))
            
            if [ $memory_mb -gt 500 ]; then
                log "⚠️ High memory usage detected: ${memory_mb}MB (PID: $pid)"
                return 1
            fi
        fi
    fi
    return 0
}

# Graceful shutdown handler
cleanup() {
    log "🛑 Health monitor stopping..." "console"
    rm -f "$PID_FILE"
    exit 0
}

trap cleanup SIGTERM SIGINT

log "🔍 Health monitor started - checking every ${CHECK_INTERVAL}s" "console"
log "📋 Monitoring: Backend health, AI services, memory usage, orphaned processes"

# Main monitoring loop
while true; do
    # Check if backend is running
    backend_running=false
    backend_port=""
    
    for port in 7071 7072 7073 7074 7075; do
        if check_backend_health "$port"; then
            backend_running=true
            backend_port="$port"
            break
        fi
    done
    
    if [ "$backend_running" = false ]; then
        log "❌ Backend not responding - attempting auto-restart"
        if auto_restart_backend; then
            backend_running=true
            backend_port="7071"
        fi
    else
        # Backend is running, check AI health
        if ! check_ai_health "$backend_port"; then
            log "⚠️ AI services unhealthy on port $backend_port"
            
            # Count consecutive AI failures
            AI_FAILURE_COUNT_FILE="$SCRIPT_DIR/.ai_failure_count"
            if [ -f "$AI_FAILURE_COUNT_FILE" ]; then
                AI_FAILURES=$(cat "$AI_FAILURE_COUNT_FILE")
                AI_FAILURES=$((AI_FAILURES + 1))
            else
                AI_FAILURES=1
            fi
            echo $AI_FAILURES > "$AI_FAILURE_COUNT_FILE"
            
            # Restart after 3 consecutive failures
            if [ $AI_FAILURES -ge 3 ]; then
                log "🔧 AI services failing repeatedly - restarting backend"
                auto_restart_backend
                rm -f "$AI_FAILURE_COUNT_FILE"
            fi
        else
            # AI is healthy, reset failure count
            rm -f "$SCRIPT_DIR/.ai_failure_count"
        fi
        
        # Check memory usage
        if ! check_memory_usage; then
            log "🧠 High memory usage - backend may need restart"
        fi
    fi
    
    # Cleanup orphaned processes every 5 minutes
    if [ $(($(date +%s) % 300)) -lt $CHECK_INTERVAL ]; then
        cleanup_orphaned_processes
    fi
    
    # Health status log (every 10 minutes)
    if [ $(($(date +%s) % 600)) -lt $CHECK_INTERVAL ]; then
        if [ "$backend_running" = true ]; then
            log "📊 Health status: Backend ✅ (port $backend_port), AI ✅"
        else
            log "📊 Health status: Backend ❌, AI ❌"
        fi
    fi
    
    sleep $CHECK_INTERVAL
done