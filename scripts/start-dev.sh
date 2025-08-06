#!/bin/bash

# Smart Development Start Script
# Automatically starts services in the correct order and verifies they're working

echo "🚀 Starting AI Wireframe Development Environment"
echo "=============================================="

# Function to wait for service to be ready
wait_for_service() {
    local port=$1
    local service=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/api/health >/dev/null 2>&1; then
            echo "✅ $service is ready!"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ $service failed to start within expected time"
    return 1
}

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:5173 | xargs -r kill -9 2>/dev/null || true
lsof -ti:7072 | xargs -r kill -9 2>/dev/null || true

sleep 2

# Start backend first
echo ""
echo "🖥️  Starting Azure Functions backend..."
cd backend
func start --port 7072 &
backend_pid=$!
cd ..

# Wait for backend to be ready
if wait_for_service 7072 "Backend"; then
    # Test AI capabilities
    echo "🤖 Testing AI capabilities..."
    response=$(curl -s -X POST http://localhost:7072/api/generate-html-wireframe \
        -H "Content-Type: application/json" \
        -d '{"description": "test"}' \
        --max-time 15)
    
    if echo "$response" | grep -q '"aiGenerated":true'; then
        echo "✅ AI is working correctly!"
    else
        echo "⚠️  AI test failed - check Azure OpenAI configuration"
        echo "Response: $response"
    fi
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo ""
echo "🌐 Starting frontend development server..."
npm run dev &
frontend_pid=$!

# Wait for frontend to be ready
if wait_for_service 5173 "Frontend"; then
    echo "✅ Frontend is ready!"
else
    echo "❌ Frontend failed to start"
    kill $backend_pid 2>/dev/null || true
    exit 1
fi

# Final health check
echo ""
echo "🔍 Running final health check..."
./scripts/health-check.sh

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:7072"
echo "   Health Check: http://localhost:7072/api/health"
echo ""
echo "To stop all services, press Ctrl+C or run: ./scripts/stop-dev.sh"

# Keep script running and handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development environment..."
    kill $backend_pid $frontend_pid 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

# Wait for background processes
wait
