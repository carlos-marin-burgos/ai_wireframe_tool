#!/bin/bash

echo "🔧 Complete Clean Restart"
echo "========================"

# Stop everything
echo "🛑 Stopping all services..."
kill -9 $(lsof -ti:5173) 2>/dev/null || true
kill -9 $(lsof -ti:7071) 2>/dev/null || true
sleep 3

# Start backend
echo "🚀 Starting backend on port 7071..."
cd /Users/carlosmarinburgos/designetica/backend
func start --port 7071 > /tmp/backend.log 2>&1 &
sleep 12

# Test backend
if curl -s -m 5 http://localhost:7071/api/health > /dev/null 2>&1; then
    echo "✅ Backend is UP and responding!"
else
    echo "❌ Backend failed to start"
    tail -20 /tmp/backend.log
    exit 1
fi

# Start frontend
echo "🌐 Starting frontend on port 5173..."
cd /Users/carlosmarinburgos/designetica
npm run dev > /tmp/frontend.log 2>&1 &
sleep 10

# Test frontend
if curl -s -m 5 http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend is UP!"
else
    echo "❌ Frontend failed to start"
    tail -20 /tmp/frontend.log
    exit 1
fi

# Test Vite proxy
echo ""
echo "🔍 Testing Vite proxy (critical test)..."
if curl -s -m 10 http://localhost:5173/api/health 2>&1 | grep -q "status"; then
    echo "✅ Vite proxy is WORKING!"
    echo ""
    echo "🎉 Everything is ready!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to http://localhost:5173"
    echo "2. Press Cmd+Shift+R (hard refresh)"
    echo "3. Test your Figma connection fix!"
else
    echo "⚠️  Vite proxy might have issues"
    echo "But the services are running. Try hard refresh in browser."
fi

echo ""
echo "✅ Services running:"
echo "   Backend: http://localhost:7071"
echo "   Frontend: http://localhost:5173"
