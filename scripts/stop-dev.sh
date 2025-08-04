#!/bin/bash

# Stop Development Environment Script
# Safely stops all development services

echo "🛑 Stopping AI Wireframe Development Environment"
echo "==============================================="

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local service=$2
    
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pids" ]; then
        echo "🔪 Stopping $service (port $port)..."
        echo "$pids" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        remaining_pids=$(lsof -ti:$port 2>/dev/null)
        if [ -n "$remaining_pids" ]; then
            echo "   Force killing remaining processes..."
            echo "$remaining_pids" | xargs kill -9 2>/dev/null || true
        fi
        
        echo "✅ $service stopped"
    else
        echo "ℹ️  No $service processes found on port $port"
    fi
}

# Stop services in reverse order
kill_port 5173 "Frontend"
kill_port 7071 "Backend"
kill_port 7072 "Fallback Backend"

# Also kill any remaining Node.js and func processes related to our project
echo ""
echo "🧹 Cleaning up remaining processes..."

# Kill any func processes
pkill -f "func start" 2>/dev/null || true

# Kill any Node.js processes running our project files
pkill -f "vite" 2>/dev/null || true
pkill -f "simple-server.js" 2>/dev/null || true

echo "✅ All development services stopped"
echo ""
echo "💡 To start again, run: ./scripts/start-dev.sh"
