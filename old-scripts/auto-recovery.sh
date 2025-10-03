#!/bin/bash

# Master Auto-Recovery Script
# Orchestrates all recovery scenarios and provides a unified interface

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/auto-recovery.log"

# Function to display usage
show_usage() {
    echo -e "${CYAN}🔧 Auto-Recovery System${NC}"
    echo "=================================="
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  diagnose           Run full system diagnostics"
    echo "  fix-backend        Fix backend connectivity issues"
    echo "  fix-ai             Fix AI/OpenAI service issues"  
    echo "  fix-ports          Fix port conflicts"
    echo "  fix-memory         Fix memory/performance issues"
    echo "  fix-dependencies   Fix missing or corrupted dependencies"
    echo "  start-monitor      Start continuous health monitoring"
    echo "  stop-monitor       Stop health monitoring"
    echo "  auto               Auto-detect and fix all issues"
    echo "  status             Show current system status"
    echo "  logs               Show recent auto-recovery logs"
    echo ""
    echo "Examples:"
    echo "  $0 auto              # Auto-detect and fix all issues"
    echo "  $0 fix-backend       # Fix only backend issues"
    echo "  $0 start-monitor     # Start background monitoring"
    echo ""
}

# Logging function
log() {
    echo -e "${1}"
    echo "$(date): $(echo -e "${1}" | sed 's/\x1b\[[0-9;]*m//g')" >> "$LOG_FILE"
}

# Function to run a recovery script and capture result
run_recovery() {
    local script="$1"
    local description="$2"
    
    log "${YELLOW}🔧 Running: $description${NC}"
    
    if [ -f "$script" ] && [ -x "$script" ]; then
        if "$script" >> "$LOG_FILE" 2>&1; then
            log "${GREEN}   ✅ SUCCESS: $description${NC}"
            return 0
        else
            log "${RED}   ❌ FAILED: $description${NC}"
            return 1
        fi
    else
        log "${RED}   ❌ Script not found or not executable: $script${NC}"
        return 1
    fi
}

# Auto-detection and fixing
auto_fix() {
    log "${CYAN}🤖 Auto-Recovery Mode - Detecting and fixing issues...${NC}"
    
    local fixes_applied=0
    local total_issues=0
    
    # Run diagnostics first
    log "${PURPLE}=== DIAGNOSTICS PHASE ===${NC}"
    if run_recovery "$SCRIPT_DIR/system-diagnostics.sh" "System diagnostics"; then
        log "${GREEN}✅ Diagnostics completed${NC}"
    else
        log "${YELLOW}⚠️ Diagnostics found issues - proceeding with fixes${NC}"
        total_issues=$((total_issues + 1))
    fi
    
    # Check and fix backend
    log "${PURPLE}=== BACKEND RECOVERY ===${NC}"
    backend_healthy=false
    for port in 7071 7072 7073 7074 7075; do
        if curl -s --max-time 3 "http://localhost:$port/api/health" > /dev/null 2>&1; then
            log "${GREEN}✅ Backend healthy on port $port${NC}"
            backend_healthy=true
            break
        fi
    done
    
    if [ "$backend_healthy" = false ]; then
        log "${RED}❌ Backend not responding${NC}"
        if run_recovery "$SCRIPT_DIR/start-backend.sh" "Backend startup"; then
            fixes_applied=$((fixes_applied + 1))
        fi
        total_issues=$((total_issues + 1))
    fi
    
    # Check AI services
    log "${PURPLE}=== AI SERVICES RECOVERY ===${NC}"
    if [ "$backend_healthy" = true ]; then
        # Find working backend port
        working_port=""
        for port in 7071 7072 7073 7074 7075; do
            if curl -s --max-time 3 "http://localhost:$port/api/health" > /dev/null 2>&1; then
                working_port=$port
                break
            fi
        done
        
        if [ -n "$working_port" ]; then
            ai_response=$(curl -s --max-time 10 "http://localhost:$working_port/api/openai-health" 2>/dev/null || echo "failed")
            if echo "$ai_response" | grep -q "healthy"; then
                log "${GREEN}✅ AI services healthy${NC}"
            else
                log "${RED}❌ AI services unhealthy${NC}"
                if run_recovery "$SCRIPT_DIR/restart-functions.sh" "AI services restart"; then
                    fixes_applied=$((fixes_applied + 1))
                fi
                total_issues=$((total_issues + 1))
            fi
        fi
    fi
    
    # Check for port conflicts
    log "${PURPLE}=== PORT CONFLICT RECOVERY ===${NC}"
    active_ports=0
    for port in 7071 7072 7073 7074 7075; do
        if lsof -ti ":$port" > /dev/null 2>&1; then
            active_ports=$((active_ports + 1))
        fi
    done
    
    if [ $active_ports -gt 1 ]; then
        log "${RED}❌ Multiple backend processes detected${NC}"
        if run_recovery "$SCRIPT_DIR/stop-backend.sh" "Process cleanup" && 
           run_recovery "$SCRIPT_DIR/start-backend.sh" "Clean restart"; then
            fixes_applied=$((fixes_applied + 1))
        fi
        total_issues=$((total_issues + 1))
    else
        log "${GREEN}✅ No port conflicts detected${NC}"
    fi
    
    # Summary
    log "${PURPLE}=== AUTO-RECOVERY SUMMARY ===${NC}"
    log "${GREEN}✅ Fixes applied: $fixes_applied${NC}"
    log "${YELLOW}⚠️ Issues detected: $total_issues${NC}"
    
    if [ $total_issues -eq 0 ]; then
        log "${GREEN}🎉 System is healthy!${NC}"
        return 0
    elif [ $fixes_applied -gt 0 ]; then
        log "${GREEN}🔧 Issues fixed - system should be working${NC}"
        return 0
    else
        log "${RED}🚨 Issues detected but could not auto-fix${NC}"
        return 1
    fi
}

# Individual fix functions
fix_backend() {
    log "${CYAN}🔧 Backend Recovery${NC}"
    run_recovery "$SCRIPT_DIR/start-backend.sh" "Backend startup"
}

fix_ai() {
    log "${CYAN}🤖 AI Services Recovery${NC}"
    run_recovery "$SCRIPT_DIR/restart-functions.sh" "AI services restart"
}

fix_ports() {
    log "${CYAN}🔄 Port Conflict Resolution${NC}"
    run_recovery "$SCRIPT_DIR/stop-backend.sh" "Stop all processes"
    sleep 2
    run_recovery "$SCRIPT_DIR/start-backend.sh" "Clean restart"
}

fix_memory() {
    log "${CYAN}🧠 Memory/Performance Recovery${NC}"
    run_recovery "$SCRIPT_DIR/restart-functions.sh" "Memory cleanup restart"
}

fix_dependencies() {
    log "${CYAN}📦 Dependencies Recovery${NC}"
    log "   Installing backend dependencies..."
    cd "$SCRIPT_DIR/backend"
    npm install >> "$LOG_FILE" 2>&1
    cd "$SCRIPT_DIR"
    run_recovery "$SCRIPT_DIR/start-backend.sh" "Restart with fresh dependencies"
}

start_monitor() {
    log "${CYAN}👁️ Starting Health Monitor${NC}"
    
    if [ -f "$SCRIPT_DIR/health-monitor.pid" ]; then
        local pid=$(cat "$SCRIPT_DIR/health-monitor.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
            log "${YELLOW}⚠️ Health monitor already running (PID: $pid)${NC}"
            return 0
        fi
    fi
    
    nohup "$SCRIPT_DIR/health-monitor.sh" > /dev/null 2>&1 &
    log "${GREEN}✅ Health monitor started${NC}"
}

stop_monitor() {
    log "${CYAN}🛑 Stopping Health Monitor${NC}"
    
    if [ -f "$SCRIPT_DIR/health-monitor.pid" ]; then
        local pid=$(cat "$SCRIPT_DIR/health-monitor.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
            kill "$pid"
            rm -f "$SCRIPT_DIR/health-monitor.pid"
            log "${GREEN}✅ Health monitor stopped${NC}"
        else
            log "${YELLOW}⚠️ Health monitor not running${NC}"
            rm -f "$SCRIPT_DIR/health-monitor.pid"
        fi
    else
        log "${YELLOW}⚠️ Health monitor PID file not found${NC}"
    fi
}

show_status() {
    log "${CYAN}📊 System Status${NC}"
    
    # Backend status
    backend_status="${RED}❌ Down${NC}"
    ai_status="${RED}❌ Down${NC}"
    working_port=""
    
    for port in 7071 7072 7073 7074 7075; do
        if curl -s --max-time 3 "http://localhost:$port/api/health" > /dev/null 2>&1; then
            backend_status="${GREEN}✅ Running (port $port)${NC}"
            working_port=$port
            break
        fi
    done
    
    if [ -n "$working_port" ]; then
        ai_response=$(curl -s --max-time 5 "http://localhost:$working_port/api/openai-health" 2>/dev/null || echo "failed")
        if echo "$ai_response" | grep -q "healthy"; then
            ai_status="${GREEN}✅ Healthy${NC}"
        else
            ai_status="${YELLOW}⚠️ Degraded${NC}"
        fi
    fi
    
    # Health monitor status
    monitor_status="${RED}❌ Stopped${NC}"
    if [ -f "$SCRIPT_DIR/health-monitor.pid" ]; then
        local pid=$(cat "$SCRIPT_DIR/health-monitor.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
            monitor_status="${GREEN}✅ Running (PID: $pid)${NC}"
        fi
    fi
    
    # Frontend status
    frontend_status="${RED}❌ Down${NC}"
    if curl -s --max-time 3 "http://localhost:5173" > /dev/null 2>&1; then
        frontend_status="${GREEN}✅ Running (port 5173)${NC}"
    fi
    
    echo ""
    echo -e "Backend:        $backend_status"
    echo -e "AI Services:    $ai_status"
    echo -e "Frontend:       $frontend_status"
    echo -e "Health Monitor: $monitor_status"
    echo ""
}

show_logs() {
    log "${CYAN}📋 Recent Auto-Recovery Logs${NC}"
    if [ -f "$LOG_FILE" ]; then
        tail -n 50 "$LOG_FILE"
    else
        log "${YELLOW}No logs found${NC}"
    fi
}

# Main command handling
case "${1:-}" in
    "diagnose")
        run_recovery "$SCRIPT_DIR/system-diagnostics.sh" "System diagnostics"
        ;;
    "fix-backend")
        fix_backend
        ;;
    "fix-ai")
        fix_ai
        ;;
    "fix-ports")
        fix_ports
        ;;
    "fix-memory")
        fix_memory
        ;;
    "fix-dependencies")
        fix_dependencies
        ;;
    "start-monitor")
        start_monitor
        ;;
    "stop-monitor")
        stop_monitor
        ;;
    "auto")
        auto_fix
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    *)
        show_usage
        exit 1
        ;;
esac