#!/bin/bash

# 🛡️ Production-Ready Server Startup Script
# Ensures your wireframe server is bulletproof for users

set -e

SERVER_DIR="/Users/carlosmarinburgos/designetica/backend"
LOG_FILE="$SERVER_DIR/server.log"
PID_FILE="$SERVER_DIR/server.pid"

cd "$SERVER_DIR"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Clean up function
cleanup() {
    log "🔄 Cleaning up server processes..."
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
            log "✅ Server process $PID terminated"
        fi
        rm -f "$PID_FILE"
    fi
    
    # Kill any remaining server processes
    pkill -f "node simple-server.js" 2>/dev/null || true
    log "🧹 Cleanup complete"
}

# Set up signal handlers
trap cleanup EXIT
trap cleanup SIGTERM
trap cleanup SIGINT

log "🚀 Starting production wireframe server..."
log "📂 Working directory: $SERVER_DIR"
log "📋 Log file: $LOG_FILE"

# Check dependencies
if ! command -v node &> /dev/null; then
    log "❌ Node.js not found! Please install Node.js"
    exit 1
fi

if [ ! -f "simple-server.js" ]; then
    log "❌ simple-server.js not found!"
    exit 1
fi

if [ ! -f ".env" ]; then
    log "⚠️ .env file not found - server may not have AI capabilities"
fi

# Start server with auto-restart capability
RESTART_COUNT=0
MAX_RESTARTS=5
RESTART_WINDOW=300  # 5 minutes

while true; do
    log "🏃 Starting server (attempt $((RESTART_COUNT + 1)))"
    
    # Start the server
    node simple-server.js &
    SERVER_PID=$!
    echo $SERVER_PID > "$PID_FILE"
    
    log "✅ Server started with PID $SERVER_PID"
    
    # Wait for server to exit
    wait $SERVER_PID
    EXIT_CODE=$?
    
    log "❌ Server exited with code $EXIT_CODE"
    
    # Clean up PID file
    rm -f "$PID_FILE"
    
    # If exit was intentional (SIGTERM/SIGINT), don't restart
    if [ $EXIT_CODE -eq 130 ] || [ $EXIT_CODE -eq 143 ]; then
        log "🔄 Server stopped intentionally - not restarting"
        break
    fi
    
    # Increment restart counter
    RESTART_COUNT=$((RESTART_COUNT + 1))
    
    # Check if we've exceeded max restarts
    if [ $RESTART_COUNT -ge $MAX_RESTARTS ]; then
        log "💥 Maximum restart attempts ($MAX_RESTARTS) reached"
        log "🚨 Server appears to be failing persistently"
        exit 1
    fi
    
    # Wait before restarting
    RESTART_DELAY=5
    log "⏳ Waiting $RESTART_DELAY seconds before restart..."
    sleep $RESTART_DELAY
    
    # Reset restart counter if we've been running for a while
    CURRENT_TIME=$(date +%s)
    if [ ! -f "/tmp/server_start_time" ]; then
        echo $CURRENT_TIME > "/tmp/server_start_time"
    else
        START_TIME=$(cat "/tmp/server_start_time")
        if [ $((CURRENT_TIME - START_TIME)) -gt $RESTART_WINDOW ]; then
            log "🔄 Resetting restart counter (server was stable)"
            RESTART_COUNT=0
            echo $CURRENT_TIME > "/tmp/server_start_time"
        fi
    fi
done

log "🏁 Server startup script finished"
