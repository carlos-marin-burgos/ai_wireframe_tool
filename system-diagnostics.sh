#!/bin/bash

# System Diagnostics and Auto-Fix Script
# Detects and automatically fixes common development environment issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🔧 System Diagnostics & Auto-Fix Tool${NC}"
echo "==========================================="

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
LOG_FILE="$SCRIPT_DIR/diagnostics.log"

# Initialize log
echo "$(date): Starting system diagnostics" > "$LOG_FILE"

# Function to log with color and timestamp
log() {
    echo -e "${1}" | tee -a "$LOG_FILE"
    echo "$(date): $(echo -e "${1}" | sed 's/\x1b\[[0-9;]*m//g')" >> "$LOG_FILE"
}

# Function to run a command and capture output
run_check() {
    local description="$1"
    local command="$2"
    local fix_command="$3"
    
    log "${YELLOW}🔍 Checking: $description${NC}"
    
    if eval "$command" >> "$LOG_FILE" 2>&1; then
        log "${GREEN}   ✅ OK${NC}"
        return 0
    else
        log "${RED}   ❌ FAILED${NC}"
        if [ -n "$fix_command" ]; then
            log "${BLUE}   🔧 Attempting auto-fix...${NC}"
            if eval "$fix_command" >> "$LOG_FILE" 2>&1; then
                log "${GREEN}   ✅ FIXED${NC}"
                return 0
            else
                log "${RED}   ❌ Auto-fix failed${NC}"
                return 1
            fi
        fi
        return 1
    fi
}

# System checks with auto-fixes
fixes_applied=0
issues_found=0

log "${PURPLE}=== SYSTEM REQUIREMENTS ===${NC}"

# Node.js check
if ! run_check "Node.js installation" "command -v node" ""; then
    log "${RED}❌ Node.js is required but not installed${NC}"
    log "   Install from: https://nodejs.org/"
    issues_found=$((issues_found + 1))
fi

# Azure Functions Core Tools check
if ! run_check "Azure Functions Core Tools" "command -v func" "npm install -g azure-functions-core-tools@4 --unsafe-perm true"; then
    log "${RED}❌ Azure Functions Core Tools installation failed${NC}"
    issues_found=$((issues_found + 1))
fi

# Git check
run_check "Git installation" "command -v git" ""

log "${PURPLE}=== ENVIRONMENT CONFIGURATION ===${NC}"

# Check backend directory
if ! run_check "Backend directory exists" "[ -d '$BACKEND_DIR' ]" ""; then
    log "${RED}❌ Backend directory missing${NC}"
    issues_found=$((issues_found + 1))
else
    cd "$BACKEND_DIR"
    
    # Check configuration files
    run_check "host.json exists" "[ -f 'host.json' ]" ""
    run_check "package.json exists" "[ -f 'package.json' ]" ""
    
    # Check and fix dependencies
    if ! run_check "Node modules installed" "[ -d 'node_modules' ] && [ -f 'node_modules/.package-lock.json' ]" "npm install"; then
        issues_found=$((issues_found + 1))
    else
        fixes_applied=$((fixes_applied + 1))
    fi
    
    # Environment variables check
    if [ -f ".env" ]; then
        log "${GREEN}   ✅ .env file found${NC}"
        
        # Check critical environment variables
        for var in "AZURE_OPENAI_ENDPOINT" "AZURE_OPENAI_API_KEY" "AZURE_OPENAI_DEPLOYMENT_NAME"; do
            if grep -q "$var" .env; then
                VALUE=$(grep "$var" .env | cut -d'=' -f2)
                if [ -n "$VALUE" ]; then
                    log "${GREEN}   ✅ $var configured${NC}"
                else
                    log "${YELLOW}   ⚠️ $var empty${NC}"
                fi
            else
                log "${YELLOW}   ⚠️ $var missing${NC}"
            fi
        done
    else
        log "${YELLOW}   ⚠️ .env file not found${NC}"
    fi
fi

log "${PURPLE}=== PORT AND PROCESS CHECKS ===${NC}"

# Check for port conflicts
conflicting_processes=0
for port in 7071 7072 7073 7074 7075; do
    if lsof -ti ":$port" > /dev/null 2>&1; then
        PROCESS_INFO=$(lsof -ti ":$port" | head -1 | xargs ps -p 2>/dev/null || echo "unknown")
        log "${YELLOW}   ⚠️ Port $port in use by: $PROCESS_INFO${NC}"
        conflicting_processes=$((conflicting_processes + 1))
    fi
done

if [ $conflicting_processes -gt 1 ]; then
    log "${RED}❌ Multiple backend processes detected${NC}"
    log "${BLUE}   🔧 Run './stop-backend.sh' to clean up${NC}"
    issues_found=$((issues_found + 1))
fi

# Check frontend port
if lsof -ti ":5173" > /dev/null 2>&1; then
    log "${GREEN}   ✅ Frontend dev server running on port 5173${NC}"
else
    log "${YELLOW}   ⚠️ Frontend dev server not running${NC}"
fi

log "${PURPLE}=== BACKEND HEALTH CHECKS ===${NC}"

# Try to detect working backend
backend_healthy=false
working_port=""

for port in 7071 7072 7073 7074 7075; do
    if curl -s "http://localhost:$port/api/health" > /dev/null 2>&1; then
        log "${GREEN}   ✅ Backend responding on port $port${NC}"
        working_port=$port
        backend_healthy=true
        
        # Test AI endpoint
        AI_RESPONSE=$(curl -s "http://localhost:$port/api/openai-health" 2>/dev/null || echo "failed")
        if echo "$AI_RESPONSE" | grep -q "healthy"; then
            log "${GREEN}   ✅ AI services healthy on port $port${NC}"
        else
            log "${YELLOW}   ⚠️ AI services may need attention on port $port${NC}"
        fi
        break
    fi
done

if [ "$backend_healthy" = false ]; then
    log "${RED}❌ No healthy backend detected${NC}"
    log "${BLUE}   🔧 Run './start-backend.sh' to start backend${NC}"
    issues_found=$((issues_found + 1))
fi

log "${PURPLE}=== MEMORY AND PERFORMANCE ===${NC}"

# Check system memory
if command -v free >/dev/null 2>&1; then
    MEMORY_INFO=$(free -h | head -2)
    log "${BLUE}   Memory usage:${NC}"
    log "   $MEMORY_INFO"
elif command -v vm_stat >/dev/null 2>&1; then
    # macOS memory check
    MEMORY_INFO=$(vm_stat | head -5)
    log "${BLUE}   Memory usage (macOS):${NC}"
    log "   $MEMORY_INFO"
fi

# Check disk space
DISK_USAGE=$(df -h . | tail -1)
log "${BLUE}   Disk usage: $DISK_USAGE${NC}"

log "${PURPLE}=== AUTOMATED FIXES ===${NC}"

# Auto-fix stale PID files
if [ -f "$BACKEND_DIR/backend.pid" ]; then
    PID=$(cat "$BACKEND_DIR/backend.pid")
    if ! ps -p "$PID" > /dev/null 2>&1; then
        log "${BLUE}   🔧 Removing stale PID file${NC}"
        rm -f "$BACKEND_DIR/backend.pid"
        fixes_applied=$((fixes_applied + 1))
    fi
fi

# Auto-fix stale port files if backend is not running
if [ "$backend_healthy" = false ] && [ -f "$BACKEND_DIR/current-port.txt" ]; then
    log "${BLUE}   🔧 Removing stale port file${NC}"
    rm -f "$BACKEND_DIR/current-port.txt"
    fixes_applied=$((fixes_applied + 1))
fi

# Summary
log "${PURPLE}=== SUMMARY ===${NC}"
log "${GREEN}✅ Fixes applied: $fixes_applied${NC}"
log "${RED}❌ Issues found: $issues_found${NC}"

if [ $issues_found -eq 0 ]; then
    log "${GREEN}🎉 All systems healthy!${NC}"
    exit 0
elif [ $issues_found -le 2 ]; then
    log "${YELLOW}⚠️ Minor issues detected - system should work${NC}"
    exit 1
else
    log "${RED}🚨 Multiple issues detected - manual intervention may be required${NC}"
    exit 2
fi