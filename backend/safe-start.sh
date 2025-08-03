#!/bin/bash

# Safe startup script with integrity checks and auto-backup
echo "🛡️ Starting Designetica Backend with Safety Checks"
echo "=================================================="

# Change to backend directory
cd "$(dirname "$0")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Step 1: Pre-flight Checks${NC}"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js is available${NC}"

# Check if required files exist
REQUIRED_FILES=("working-server.js" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Required file missing: $file${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Found: $file${NC}"
done

echo -e "${BLUE}📋 Step 2: File Integrity Check${NC}"

# Run integrity check
if node integrity-checker.js check; then
    echo -e "${GREEN}✅ All files passed integrity check${NC}"
else
    echo -e "${YELLOW}⚠️ Integrity check failed. Attempting to restore from backup...${NC}"
    
    # Try to restore from backup
    if node auto-backup.js restore simple-server.js; then
        echo -e "${GREEN}✅ File restored from backup${NC}"
        # Re-check integrity
        if node integrity-checker.js check simple-server.js; then
            echo -e "${GREEN}✅ Restored file passed integrity check${NC}"
        else
            echo -e "${RED}❌ Restored file still has issues. Manual intervention required.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Could not restore from backup. Manual intervention required.${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📋 Step 3: Starting Auto-Backup System${NC}"

# Start auto-backup in background
node auto-backup.js &
BACKUP_PID=$!
echo -e "${GREEN}✅ Auto-backup system started (PID: $BACKUP_PID)${NC}"

echo -e "${BLUE}📋 Step 4: Starting Integrity Monitor${NC}"

# Start integrity monitor in background
node integrity-checker.js monitor &
MONITOR_PID=$!
echo -e "${GREEN}✅ Integrity monitor started (PID: $MONITOR_PID)${NC}"

echo -e "${BLUE}📋 Step 5: Starting Server${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down safely...${NC}"
    kill $BACKUP_PID 2>/dev/null
    kill $MONITOR_PID 2>/dev/null
    echo -e "${GREEN}✅ Background processes stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the server
echo -e "${GREEN}🚀 Starting Designetica Backend Server${NC}"
echo -e "${BLUE}Press Ctrl+C to stop safely${NC}"
echo ""

# Start server with monitoring
node working-server.js &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Server started successfully${NC}"
    echo -e "${BLUE}🌐 Server running on: http://localhost:5001${NC}"
    echo -e "${BLUE}🏥 Health check: http://localhost:5001/api/health${NC}"
    echo ""
    echo -e "${YELLOW}📊 Active Protection:${NC}"
    echo -e "  🔒 Auto-backup system (PID: $BACKUP_PID)"
    echo -e "  🛡️ Integrity monitor (PID: $MONITOR_PID)"
    echo -e "  🚀 Server process (PID: $SERVER_PID)"
    
    # Wait for server process
    wait $SERVER_PID
else
    echo -e "${RED}❌ Server failed to start${NC}"
    cleanup
    exit 1
fi
