#!/bin/bash

# PRODUCTION-READY STARTUP SCRIPT
# This script ensures consistent port allocation and prevents port conflicts

echo "🔧 STARTING DESIGNETICA WITH CONSISTENT PORTS"
echo "=============================================="

# Define our FIXED ports (these should NEVER change)
BACKEND_PORT=7071
FRONTEND_PORT=5173

# Step 1: Kill any existing processes on our reserved ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null || true
lsof -ti:$FRONTEND_PORT | xargs kill -9 2>/dev/null || true
sleep 2

# Step 2: Start Azure Functions on the EXACT port we want
echo "🚀 Starting Azure Functions on port $BACKEND_PORT..."
cd backend
nohup func start --port $BACKEND_PORT > ../backend-startup.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for Azure Functions to start..."
for i in {1..30}; do
    if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
        echo "✅ Azure Functions ready on port $BACKEND_PORT"
        break
    fi
    sleep 1
done

# Step 3: Start Vite frontend with correct proxy
echo "🚀 Starting Vite frontend on port $FRONTEND_PORT..."
cd ..
nohup npx vite --port $FRONTEND_PORT --host 0.0.0.0 > frontend-startup.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo "⏳ Waiting for Vite frontend to start..."
for i in {1..15}; do
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        echo "✅ Vite frontend ready on port $FRONTEND_PORT"
        break
    fi
    sleep 1
done

echo ""
echo "🎉 DESIGNETICA IS READY!"
echo "========================"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop all services: kill $BACKEND_PID $FRONTEND_PID"

# Keep script running to maintain process monitoring
echo "📊 Monitoring services... Press Ctrl+C to stop all services"
trap 'echo ""; echo "🛑 Stopping all services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# Wait for processes to exist
wait