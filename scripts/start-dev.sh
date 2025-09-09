#!/bin/bash

# Development startup script for Designetica
# Starts both frontend and backend servers

echo "🚀 Starting Designetica Development Environment"
echo "=============================================="

# Get the project root (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Change to project root and check if we're in the right directory
cd "$PROJECT_ROOT"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in $PROJECT_ROOT${NC}"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Backend directory not found${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-flight checks...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

# Check if Azure Functions Core Tools is installed
if ! command -v func &> /dev/null; then
    echo -e "${YELLOW}⚠️ Azure Functions Core Tools not found. Installing...${NC}"
    npm install -g azure-functions-core-tools@4 --unsafe-perm true
fi

echo -e "${GREEN}✅ Pre-flight checks completed${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
    cd "$PROJECT_ROOT/backend" && npm install && cd "$PROJECT_ROOT"
fi

# Check if concurrently is installed
if ! npm list concurrently &> /dev/null; then
    echo -e "${BLUE}📦 Installing concurrently...${NC}"
    npm install --save-dev concurrently@8.2.2
fi

echo -e "${GREEN}✅ Dependencies ready${NC}"

# Start both servers
echo -e "${BLUE}🚀 Starting both frontend and backend servers...${NC}"
echo -e "${YELLOW}Frontend will be available at: http://localhost:5173${NC}"
echo -e "${YELLOW}Backend will be available at: http://localhost:7071${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"
echo ""

# Start with concurrently
npm run dev:full
