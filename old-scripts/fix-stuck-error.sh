#!/bin/bash
# Quick fix for stuck "Backend Down" error

echo "🔧 Fixing stuck backend error..."

# Kill and restart everything fresh
echo "🛑 Stopping all services..."
kill -9 $(lsof -ti:5173) 2>/dev/null || true
kill -9 $(lsof -ti:7071) 2>/dev/null || true
sleep 2

# Start backend first
echo "🚀 Starting backend..."
cd /Users/carlosmarinburgos/designetica/backend
func start --port 7071 > /tmp/backend-restart.log 2>&1 &
sleep 8

# Check backend is up
if curl -s -f -m 5 http://localhost:7071/api/health > /dev/null; then
    echo "✅ Backend is UP"
else
    echo "❌ Backend failed to start - check /tmp/backend-restart.log"
    exit 1
fi

# Start frontend
echo "🌐 Starting frontend..."
cd /Users/carlosmarinburgos/designetica
npm run dev > /tmp/frontend-restart.log 2>&1 &
sleep 5

echo ""
echo "✅ Everything restarted!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: http://localhost:5173"
echo "2. Press Cmd+Shift+R (hard refresh)"
echo "3. If you still see the error modal, click outside it to close"
echo ""
echo "The backend is DEFINITELY running now! ✅"
