#!/bin/bash

# Continuous monitoring daemon for Designetica
# Runs health checks and alerts on issues

# Configuration
MONITOR_INTERVAL=300  # 5 minutes
HEALTH_SCRIPT="/Users/carlosmarinburgos/designetica/backend/monitoring/health-monitor.js"
BACKUP_SCRIPT="/Users/carlosmarinburgos/designetica/backend/monitoring/backup-recovery.sh"
LOG_FILE="/Users/carlosmarinburgos/designetica/backend/monitoring/daemon.log"
PID_FILE="${PID_FILE:-$(dirname "$0")/daemon.pid}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    echo -e "${BLUE}${message}${NC}"
    echo "$message" >> "$LOG_FILE"
}

success() {
    local message="✅ $1"
    echo -e "${GREEN}${message}${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $message" >> "$LOG_FILE"
}

warning() {
    local message="⚠️ $1"
    echo -e "${YELLOW}${message}${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $message" >> "$LOG_FILE"
}

error() {
    local message="❌ $1"
    echo -e "${RED}${message}${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $message" >> "$LOG_FILE"
}

# Function to check if daemon is running
is_running() {
    if [ -f "$PID_FILE" ]; then
        local pid
        pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Function to start monitoring daemon
start_daemon() {
    if is_running; then
        warning "Monitor daemon is already running (PID: $(cat "$PID_FILE"))"
        return 1
    fi
    
    log "Starting Designetica monitoring daemon"
    
    # Create log file if it doesn't exist
    touch "$LOG_FILE"
    
    # Start daemon in background
    nohup bash -c "
        echo \$\$ > '$PID_FILE'
        
        # Initial health check
        node '$HEALTH_SCRIPT' --once >> '$LOG_FILE' 2>&1
        
        # Main monitoring loop
        while true; do
            sleep $MONITOR_INTERVAL
            
            echo '[$(date +'%Y-%m-%d %H:%M:%S')] Running scheduled health check' >> '$LOG_FILE'
            
            # Run health check
            if node '$HEALTH_SCRIPT' --once >> '$LOG_FILE' 2>&1; then
                echo '[$(date +'%Y-%m-%d %H:%M:%S')] ✅ Health check passed' >> '$LOG_FILE'
            else
                echo '[$(date +'%Y-%m-%d %H:%M:%S')] ❌ Health check failed' >> '$LOG_FILE'
                
                # Create emergency backup on failure
                echo '[$(date +'%Y-%m-%d %H:%M:%S')] Creating emergency backup due to health check failure' >> '$LOG_FILE'
                '$BACKUP_SCRIPT' create >> '$LOG_FILE' 2>&1
            fi
            
            # Daily backup at 2 AM
            if [ \$(date +%H%M) = '0200' ]; then
                echo '[$(date +'%Y-%m-%d %H:%M:%S')] Creating daily backup' >> '$LOG_FILE'
                '$BACKUP_SCRIPT' create >> '$LOG_FILE' 2>&1
            fi
        done
    " > /dev/null 2>&1 &
    
    # Wait a moment for the daemon to start
    sleep 2
    
    if is_running; then
        success "Monitor daemon started (PID: $(cat "$PID_FILE"))"
        log "Monitoring interval: ${MONITOR_INTERVAL} seconds"
        log "Log file: $LOG_FILE"
        return 0
    else
        error "Failed to start monitor daemon"
        return 1
    fi
}

# Function to stop monitoring daemon
stop_daemon() {
    if ! is_running; then
        warning "Monitor daemon is not running"
        return 1
    fi
    
    local pid
    pid=$(cat "$PID_FILE")
    
    log "Stopping monitor daemon (PID: $pid)"
    
    # Kill the process
    kill "$pid" 2>/dev/null
    
    # Wait for it to stop
    local count=0
    while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 10 ]; do
        sleep 1
        count=$((count + 1))
    done
    
    # Force kill if necessary
    if ps -p "$pid" > /dev/null 2>&1; then
        warning "Force killing daemon"
        kill -9 "$pid" 2>/dev/null
    fi
    
    rm -f "$PID_FILE"
    success "Monitor daemon stopped"
}

# Function to restart daemon
restart_daemon() {
    log "Restarting monitor daemon"
    stop_daemon
    sleep 2
    start_daemon
}

# Function to show daemon status
show_status() {
    echo "Designetica Monitor Daemon Status"
    echo "=================================="
    
    if is_running; then
        local pid
        pid=$(cat "$PID_FILE")
        success "Daemon is running (PID: $pid)"
        
        # Show process info
        echo ""
        echo "Process Information:"
        ps -p "$pid" -o pid,ppid,etime,pcpu,pmem,cmd
        
        # Show recent logs
        echo ""
        echo "Recent Activity (last 10 lines):"
        tail -n 10 "$LOG_FILE" 2>/dev/null || echo "No log entries found"
        
    else
        warning "Daemon is not running"
    fi
    
    echo ""
    echo "Configuration:"
    echo "  Monitor Interval: ${MONITOR_INTERVAL} seconds"
    echo "  Log File: $LOG_FILE"
    echo "  PID File: $PID_FILE"
    echo "  Health Script: $HEALTH_SCRIPT"
    echo "  Backup Script: $BACKUP_SCRIPT"
}

# Function to show logs
show_logs() {
    local lines="${1:-50}"
    
    echo "Designetica Monitor Logs (last $lines lines)"
    echo "==========================================="
    
    if [ -f "$LOG_FILE" ]; then
        tail -n "$lines" "$LOG_FILE"
    else
        warning "Log file not found: $LOG_FILE"
    fi
}

# Function to run immediate health check
run_health_check() {
    log "Running immediate health check"
    
    if node "$HEALTH_SCRIPT" --once; then
        success "Health check completed successfully"
    else
        error "Health check failed"
        return 1
    fi
}

# Function to setup monitoring (install as service)
setup_monitoring() {
    log "Setting up Designetica monitoring"
    
    # Create monitoring directory if it doesn't exist
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Test all scripts
    log "Testing health monitor script"
    if [ ! -f "$HEALTH_SCRIPT" ]; then
        error "Health monitor script not found: $HEALTH_SCRIPT"
        return 1
    fi
    
    if node "$HEALTH_SCRIPT" --once; then
        success "Health monitor script test passed"
    else
        error "Health monitor script test failed"
        return 1
    fi
    
    log "Testing backup script"
    if [ ! -f "$BACKUP_SCRIPT" ]; then
        error "Backup script not found: $BACKUP_SCRIPT"
        return 1
    fi
    
    if "$BACKUP_SCRIPT" test; then
        success "Backup script test passed"
    else
        error "Backup script test failed"
        return 1
    fi
    
    # Create initial backup
    log "Creating initial backup"
    "$BACKUP_SCRIPT" create
    
    success "Monitoring setup completed"
    
    echo ""
    echo "To start monitoring:"
    echo "  $0 start"
    echo ""
    echo "To check status:"
    echo "  $0 status"
    echo ""
    echo "To view logs:"
    echo "  $0 logs"
}

# Main script logic
case "$1" in
    "start")
        start_daemon
        ;;
    "stop")
        stop_daemon
        ;;
    "restart")
        restart_daemon
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "health")
        run_health_check
        ;;
    "setup")
        setup_monitoring
        ;;
    "help"|"--help"|"-h")
        echo "Designetica Monitoring Daemon"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  start         Start the monitoring daemon"
        echo "  stop          Stop the monitoring daemon"
        echo "  restart       Restart the monitoring daemon"
        echo "  status        Show daemon status"
        echo "  logs [lines]  Show recent logs (default: 50 lines)"
        echo "  health        Run immediate health check"
        echo "  setup         Setup monitoring system"
        echo "  help          Show this help"
        echo ""
        echo "The daemon will:"
        echo "  - Run health checks every $((MONITOR_INTERVAL / 60)) minutes"
        echo "  - Create emergency backups on failures"
        echo "  - Create daily backups at 2 AM"
        echo "  - Log all activities"
        ;;
    *)
        if [ -z "$1" ]; then
            show_status
        else
            warning "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
        fi
        ;;
esac
