#!/bin/bash

# 🎬 Designetica AI - Presentation Setup Script
# Run this before your presentation to ensure everything works

echo "🎭 Setting up Designetica AI for presentation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -i :$1 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Port $1 is active${NC}"
        return 0
    else
        echo -e "${RED}❌ Port $1 is not active${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:7071/api/health)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ API health check passed${NC}"
        return 0
    else
        echo -e "${RED}❌ API health check failed (HTTP $response)${NC}"
        return 1
    fi
}

echo "🔍 Checking system status..."

# Check if backend is running
if check_port 7071; then
    echo "🏥 Testing API health..."
    if test_api; then
        echo -e "${GREEN}🎉 Backend is ready for presentation!${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend port is active but API not responding${NC}"
    fi
else
    echo -e "${YELLOW}🚀 Starting backend...${NC}"
    echo "Run this in a separate terminal:"
    echo -e "${BLUE}cd backend && func start --port 7071${NC}"
fi

# Check if frontend is running
if check_port 5173; then
    echo -e "${GREEN}🎉 Frontend is ready for presentation!${NC}"
else
    echo -e "${YELLOW}🌐 Starting frontend...${NC}"
    echo "Run this in a separate terminal:"
    echo -e "${BLUE}npm run dev${NC}"
fi

echo ""
echo "📋 Presentation Checklist:"
echo -e "${GREEN}✅ Presentation script created: PRESENTATION_SCRIPT.md${NC}"
echo "🔗 Frontend URL: http://localhost:5173"
echo "🔗 API Health: http://localhost:7071/api/health"

echo ""
echo "🎯 Quick Demo Commands:"
echo -e "${BLUE}# Test wireframe generation${NC}"
echo 'curl -X POST http://localhost:7071/api/generate-wireframe -H "Content-Type: application/json" -d '"'"'{"description":"modern dashboard", "colorScheme":"primary"}'"'"''

echo ""
echo -e "${BLUE}# Test fast mode${NC}"
echo 'curl -X POST http://localhost:7071/api/generate-wireframe -H "Content-Type: application/json" -d '"'"'{"description":"contact form", "fastMode":true}'"'"''

echo ""
echo "🎭 Ready for your presentation! Break a leg!"
