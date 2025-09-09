#!/bin/bash

# Development Environment Health Check Script
# This script verifies all services are running correctly

echo "🔍 Development Environment Health Check"
echo "======================================"

# Check if required ports are available
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ $service is running on port $port"
        return 0
    else
        echo "❌ $service is NOT running on port $port"
        return 1
    fi
}

# Check if AI is working
check_ai() {
    local port=$1
    echo "🤖 Testing AI capabilities on port $port..."
    
    response=$(curl -s -X POST http://localhost:$port/api/generate-wireframe \
        -H "Content-Type: application/json" \
        -d '{"description": "simple test", "colorScheme": "primary"}' \
        --max-time 35)
    
    if echo "$response" | grep -q '"html"'; then
        echo "✅ AI is working on port $port"
        return 0
    else
        echo "❌ AI is NOT working on port $port"
        echo "Response: $response"
        return 1
    fi
}

echo ""
echo "📡 Checking Services..."

# Check frontend
check_port 5173 "Frontend (Vite)"
frontend_ok=$?

# Check primary backend
check_port 7071 "Backend (Primary)"
backend_primary_ok=$?

# Check fallback backend
check_port 7072 "Backend (Fallback)"
backend_fallback_ok=$?

echo ""
echo "🤖 Checking AI Capabilities..."

ai_primary_ok=1
ai_fallback_ok=1

if [ $backend_primary_ok -eq 0 ]; then
    check_ai 7071
    ai_primary_ok=$?
fi

if [ $backend_fallback_ok -eq 0 ]; then
    check_ai 7072
    ai_fallback_ok=$?
fi

echo ""
echo "📊 Health Check Summary"
echo "====================="

if [ $frontend_ok -eq 0 ] && [ $backend_primary_ok -eq 0 ] && [ $ai_primary_ok -eq 0 ]; then
    echo "🎉 All systems operational!"
    echo "✅ Frontend: http://localhost:5173"
    echo "✅ Backend: http://localhost:7071 (AI-enabled)"
else
    echo "⚠️  Issues detected:"
    [ $frontend_ok -ne 0 ] && echo "   - Frontend not running"
    [ $backend_primary_ok -ne 0 ] && echo "   - Primary backend not running"
    [ $ai_primary_ok -ne 0 ] && echo "   - AI not working on primary backend"
    
    echo ""
    echo "🛠️  Suggested fixes:"
    [ $frontend_ok -ne 0 ] && echo "   - Run: npm run dev"
    [ $backend_primary_ok -ne 0 ] && echo "   - Run: func start (in backend folder)"
    [ $ai_primary_ok -ne 0 ] && echo "   - Check Azure OpenAI configuration in local.settings.json"
fi

echo ""
echo "🔧 Configuration Files:"
echo "   - Frontend proxy: vite.config.ts (should point to :7071)"
echo "   - API config: src/config/api.ts (should use :7071)"
echo "   - Backend config: backend/local.settings.json"
