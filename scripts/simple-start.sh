#!/bin/bash

# SIMPLE ONE-COMMAND STARTUP
# Run this whenever you want to start development
# No more 100 scripts, no more issues!

echo "🚀 Starting your app..."
./bulletproof-stop.sh >/dev/null 2>&1
./bulletproof-dev.sh

echo ""
echo "🎉 Your app is ready!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:7072"
echo ""
echo "💡 Commands:"
echo "   ./simple-start.sh     - Start everything"
echo "   ./bulletproof-stop.sh - Stop everything"
echo "   ./bulletproof-monitor.sh - Monitor health"
