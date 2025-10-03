#!/bin/bash

# Smart Development Environment Starter
# Integrates all auto-recovery systems for the best development experience

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 Smart Development Environment${NC}"
echo "====================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if auto-recovery system exists
if [ ! -f "$SCRIPT_DIR/auto-recovery.sh" ]; then
    echo "❌ Auto-recovery system not found"
    exit 1
fi

# Run full auto-recovery
echo -e "${BLUE}🔧 Running intelligent auto-recovery...${NC}"
if "$SCRIPT_DIR/auto-recovery.sh" auto; then
    echo -e "${GREEN}✅ Auto-recovery completed successfully${NC}"
else
    echo -e "${YELLOW}⚠️ Some issues detected but system should work${NC}"
fi

# Start health monitoring in background
echo -e "${BLUE}👁️ Starting continuous health monitoring...${NC}"
"$SCRIPT_DIR/auto-recovery.sh" start-monitor

echo ""
echo -e "${GREEN}🎉 Smart development environment is ready!${NC}"
echo "-------------------------------------------"
echo -e "${CYAN}📊 Current Status:${NC}"
"$SCRIPT_DIR/auto-recovery.sh" status

echo ""
echo -e "${CYAN}💡 Available Commands:${NC}"
echo "  ./auto-recovery.sh status     # Check system health"
echo "  ./auto-recovery.sh auto       # Auto-fix all issues"
echo "  ./auto-recovery.sh logs       # View recent logs"
echo "  ./auto-recovery.sh stop-monitor # Stop health monitoring"
echo ""
echo -e "${GREEN}Development environment is now self-monitoring and self-healing! 🔮${NC}"