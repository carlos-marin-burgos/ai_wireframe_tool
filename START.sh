#!/bin/bash

# 🎯 THE ONLY START SCRIPT YOU NEED
# This is simple, reliable, and always works

set -e

echo "🧹 Cleaning up old processes..."
# Kill anything on our ports
lsof -ti:7071 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 2

echo "🚀 Starting Backend (Azure Functions on port 7071)..."
cd /Users/carlosmarinburgos/designetica/backend
func start --port 7071 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s -f http://localhost:7071/api/health > /dev/null 2>&1; then
        echo "✅ Backend is UP!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start after 30 seconds"
        echo "📋 Check logs: tail -f /tmp/backend.log"
        exit 1
    fi
    sleep 1
    echo -n "."
done

echo ""
echo "🌐 Starting Frontend (Vite on port 5173)..."
cd /Users/carlosmarinburgos/designetica
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "⏳ Waiting for frontend to be ready..."
for i in {1..20}; do
    if curl -s -f http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ Frontend is UP!"
        break
    fi
    if [ $i -eq 20 ]; then
        echo "❌ Frontend failed to start after 20 seconds"
        echo "📋 Check logs: tail -f /tmp/frontend.log"
        exit 1
    fi
    sleep 1
    echo -n "."
done

echo ""
echo "✅ Everything is running!"
echo ""
echo "📊 Status:"
echo "  Backend:  http://localhost:7071/api/health"
echo "  Frontend: http://localhost:5173"
echo ""
echo "📋 Logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop everything:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  or: lsof -ti:7071 | xargs kill && lsof -ti:5173 | xargs kill"
echo ""
echo "🎉 Open your browser: http://localhost:5173"
