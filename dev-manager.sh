#!/bin/bash

# DESIGNETICA DEV MANAGER - Simple, reliable development environment

PROJECT_DIR="/Users/carlosmarinburgos/designetica"
BACKEND_PORT=7071
FRONTEND_PORT=5173

start_backend() {
    echo "🚀 Starting Azure Functions Backend..."
    cd "$PROJECT_DIR/backend"
    
    # Kill existing backend processes
    lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null || true
    sleep 1
    
    # Start Azure Functions in background
    nohup func start --port $BACKEND_PORT > ../backend-keeper.log 2>&1 &
    echo $! > ../backend.pid
    
    # Wait for backend
    for i in {1..20}; do
        if curl -s "http://localhost:$BACKEND_PORT/api/health" > /dev/null 2>&1; then
            echo "✅ Backend ready on port $BACKEND_PORT"
            return 0
        fi
        sleep 1
    done
    echo "⚠️  Backend started but may not be ready yet"
}

start_frontend() {
    echo "🌐 Starting Vite Frontend with auto-restart..."
    cd "$PROJECT_DIR"
    
    # Use the Vite Keeper script
    nohup ./scripts/vite-keeper.sh > vite-keeper.log 2>&1 &
    echo $! > vite-keeper.pid
    
    sleep 3
    echo "✅ Vite Keeper started (auto-restart enabled)"
}

stop_services() {
    echo "🛑 Stopping all services..."
    
    # Stop Vite Keeper
    if [[ -f "$PROJECT_DIR/vite-keeper.pid" ]]; then
        KEEPER_PID=$(cat "$PROJECT_DIR/vite-keeper.pid")
        kill -TERM "$KEEPER_PID" 2>/dev/null
        rm -f "$PROJECT_DIR/vite-keeper.pid"
    fi
    
    # Stop Vite processes
    if [[ -f "$PROJECT_DIR/vite.pid" ]]; then
        VITE_PID=$(cat "$PROJECT_DIR/vite.pid")
        kill -TERM "$VITE_PID" 2>/dev/null
        rm -f "$PROJECT_DIR/vite.pid"
    fi
    
    # Stop Backend
    if [[ -f "$PROJECT_DIR/backend.pid" ]]; then
        BACKEND_PID=$(cat "$PROJECT_DIR/backend.pid")
        kill -TERM "$BACKEND_PID" 2>/dev/null
        rm -f "$PROJECT_DIR/backend.pid"
    fi
    
    # Force kill any remaining processes on our ports
    lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null || true
    lsof -ti:$FRONTEND_PORT | xargs kill -9 2>/dev/null || true
    
    echo "✅ All services stopped"
}

status() {
    echo "📊 Service Status:"
    
    # Check Backend
    if curl -s "http://localhost:$BACKEND_PORT/api/health" > /dev/null 2>&1; then
        echo "✅ Backend: Running on port $BACKEND_PORT"
    else
        echo "❌ Backend: Not responding on port $BACKEND_PORT"
    fi
    
    # Check Frontend  
    if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
        echo "✅ Frontend: Running on port $FRONTEND_PORT"
    else
        echo "❌ Frontend: Not responding on port $FRONTEND_PORT"
    fi
    
    echo ""
    echo "🔗 URLs:"
    echo "   Frontend: http://localhost:$FRONTEND_PORT"
    echo "   Backend:  http://localhost:$BACKEND_PORT"
    echo "   API Test: http://localhost:$FRONTEND_PORT/api/health"
}

case "${1:-start}" in
    "start")
        echo "🔧 Starting Designetica Development Environment"
        echo "================================================"
        stop_services  # Clean stop first
        sleep 2
        start_backend
        sleep 2
        start_frontend
        echo ""
        echo "🎉 Development environment started!"
        echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
        echo "⚡ Backend:  http://localhost:$BACKEND_PORT"
        echo ""
        echo "💡 Use './dev-manager.sh status' to check services"
        echo "💡 Use './dev-manager.sh stop' to stop all services"
        ;;
    "stop")
        stop_services
        ;;
    "status")
        status
        ;;
    "restart")
        echo "🔄 Restarting services..."
        stop_services
        sleep 3
        start_backend
        sleep 2
        start_frontend
        echo "✅ Services restarted"
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both backend and frontend (default)"
        echo "  stop    - Stop all services"
        echo "  status  - Check service status"
        echo "  restart - Restart all services"
        ;;
esac