#!/bin/bash

# SIMPLE ONE-COMMAND STARTUP
# Run this whenever you want to start development
# No more 100 scripts, no more issues!

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Starting your app..."
"$SCRIPT_DIR/bulletproof-stop.sh" >/dev/null 2>&1
"$SCRIPT_DIR/bulletproof-dev.sh"

echo ""
echo "🎉 Your app is ready!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:7072"
echo ""
echo "💡 Commands:"
echo "   ./scripts/simple-start.sh     - Start everything"
echo "   ./scripts/bulletproof-stop.sh - Stop everything"
echo "   ./scripts/bulletproof-monitor.sh - Monitor health"
