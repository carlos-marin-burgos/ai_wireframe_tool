#!/bin/bash

# VITE KEEPER - Ensures Vite stays running
# This script monitors and automatically restarts Vite if it stops

VITE_PORT=5173
VITE_HOST="0.0.0.0"
PROJECT_DIR="/Users/carlosmarinburgos/designetica"
LOG_FILE="$PROJECT_DIR/vite-keeper.log"
PID_FILE="$PROJECT_DIR/vite.pid"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cleanup() {
    log_message "🛑 Shutting down Vite Keeper..."
    if [[ -f "$PID_FILE" ]]; then
        VITE_PID=$(cat "$PID_FILE")
        if kill -0 "$VITE_PID" 2>/dev/null; then
            log_message "Stopping Vite process $VITE_PID"
            kill "$VITE_PID"
            sleep 2
            kill -9 "$VITE_PID" 2>/dev/null
        fi
        rm -f "$PID_FILE"
    fi
    exit 0
}

start_vite() {
    log_message "🚀 Starting Vite on port $VITE_PORT..."
    cd "$PROJECT_DIR"
    
    # Kill any existing Vite processes on our port
    lsof -ti:$VITE_PORT | xargs kill -9 2>/dev/null || true
    
    # Start Vite in background
    nohup npx vite --port $VITE_PORT --host $VITE_HOST > vite-output.log 2>&1 &
    VITE_PID=$!
    echo $VITE_PID > "$PID_FILE"
    
    log_message "Vite started with PID: $VITE_PID"
    
    # Wait for Vite to be ready
    for i in {1..15}; do
        if curl -s "http://localhost:$VITE_PORT" > /dev/null 2>&1; then
            log_message "✅ Vite is ready and responding on port $VITE_PORT"
            return 0
        fi
        sleep 1
    done
    
    log_message "⚠️  Vite might not be responding yet, but process is running"
    return 0
}

is_vite_running() {
    if [[ -f "$PID_FILE" ]]; then
        VITE_PID=$(cat "$PID_FILE")
        if kill -0 "$VITE_PID" 2>/dev/null; then
            # Check if it's actually listening on the port
            if lsof -i:$VITE_PORT > /dev/null 2>&1; then
                return 0  # Running and listening
            fi
        fi
    fi
    return 1  # Not running
}

# Trap signals for clean shutdown
trap cleanup SIGINT SIGTERM

log_message "🔧 Vite Keeper starting..."
log_message "Port: $VITE_PORT, Host: $VITE_HOST"
log_message "Project: $PROJECT_DIR"

# Initial start
start_vite

# Monitor loop
while true; do
    if ! is_vite_running; then
        log_message "❌ Vite stopped! Restarting..."
        start_vite
    else
        # Optional: Test if Vite is actually responding
        if ! curl -s "http://localhost:$VITE_PORT" > /dev/null 2>&1; then
            log_message "⚠️  Vite process exists but not responding, restarting..."
            cleanup
            start_vite
        fi
    fi
    
    sleep 10  # Check every 10 seconds
done