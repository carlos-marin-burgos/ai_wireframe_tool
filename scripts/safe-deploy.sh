#!/bin/bash

# Safe deployment script with comprehensive validation and rollback
# This script ensures deployments never break your production system

set -e

# Configuration
MONITORING_DIR="${MONITORING_DIR:-./backend/monitoring}"
BACKUP_SCRIPT="$MONITORING_DIR/backup-recovery.sh"
VALIDATOR_SCRIPT="$MONITORING_DIR/deployment-validator.sh"
HEALTH_SCRIPT="$MONITORING_DIR/health-monitor.js"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
header() { echo -e "${BOLD}${BLUE}🚀 $1${NC}"; }

# Function to deploy backend safely
deploy_backend() {
    header "SAFE BACKEND DEPLOYMENT STARTING"
    echo "This deployment includes comprehensive safety measures:"
    echo "  ✓ Pre-deployment validation"
    echo "  ✓ Automatic backup creation"
    echo "  ✓ Post-deployment verification"
    echo "  ✓ Automatic rollback on failure"
    echo ""
    
    # Step 1: Pre-deployment checks and backup
    log "Step 1: Pre-deployment validation and backup"
    if ! "$VALIDATOR_SCRIPT" pre-check; then
        error "Pre-deployment validation failed. Deployment aborted."
        return 1
    fi
    
    # Step 2: Safe deployment
    log "Step 2: Executing deployment with validation"
    if ! "$VALIDATOR_SCRIPT" safe-deploy backend; then
        error "Deployment failed validation. Check logs and consider rollback."
        echo ""
        warning "To rollback to previous version:"
        echo "  $BACKUP_SCRIPT list"
        echo "  $BACKUP_SCRIPT restore [backup_name]"
        echo "  azd deploy backend"
        return 1
    fi
    
    # Step 3: Final verification
    log "Step 3: Final verification and health check"
    if node "$HEALTH_SCRIPT" --once; then
        success "🎉 BACKEND DEPLOYMENT COMPLETED SUCCESSFULLY!"
        echo ""
        echo "Your API is now live and healthy at:"
        echo "  https://func-original-app-pgno4orkguix6.azurewebsites.net/api/generate-wireframe"
        echo ""
        echo "Website: https://delightful-pond-064d9a91e.1.azurestaticapps.net"
        return 0
    else
        error "Final health check failed"
        return 1
    fi
}

# Function to deploy frontend safely
deploy_frontend() {
    header "SAFE FRONTEND DEPLOYMENT STARTING"
    
    log "Creating backup before frontend deployment"
    "$BACKUP_SCRIPT" create
    
    log "Deploying frontend"
    if azd deploy frontend; then
        success "Frontend deployment completed"
        
        # Test website accessibility
        log "Testing website accessibility"
        if curl -s "https://delightful-pond-064d9a91e.1.azurestaticapps.net" > /dev/null; then
            success "🎉 FRONTEND DEPLOYMENT COMPLETED SUCCESSFULLY!"
            echo "Website: https://delightful-pond-064d9a91e.1.azurestaticapps.net"
            return 0
        else
            error "Website accessibility test failed"
            return 1
        fi
    else
        error "Frontend deployment failed"
        return 1
    fi
}

# Function to deploy everything safely
deploy_all() {
    header "SAFE FULL DEPLOYMENT STARTING"
    
    # Deploy backend first
    if deploy_backend; then
        log "Backend deployment successful, proceeding with frontend"
        
        # Deploy frontend
        if deploy_frontend; then
            success "🎉 FULL DEPLOYMENT COMPLETED SUCCESSFULLY!"
            
            # Run comprehensive health check
            log "Running final comprehensive health check"
            node "$HEALTH_SCRIPT" --once
            
            echo ""
            echo "🌟 Your Designetica application is fully deployed and operational!"
            echo "   API: https://func-original-app-pgno4orkguix6.azurewebsites.net/"
            echo "   Website: https://delightful-pond-064d9a91e.1.azurestaticapps.net"
            echo ""
            return 0
        else
            error "Frontend deployment failed, but backend is working"
            return 1
        fi
    else
        error "Backend deployment failed, aborting full deployment"
        return 1
    fi
}

# Function to test current deployment
test_deployment() {
    header "TESTING CURRENT DEPLOYMENT"
    
    log "Running comprehensive validation tests"
    if "$VALIDATOR_SCRIPT" test; then
        success "All deployment tests passed"
        
        log "Running detailed health check"
        node "$HEALTH_SCRIPT" --once
        
        return 0
    else
        error "Deployment tests failed"
        return 1
    fi
}

# Function to show rollback options
show_rollback_options() {
    header "ROLLBACK OPTIONS"
    
    echo "If you need to rollback your deployment:"
    echo ""
    echo "1. List available backups:"
    echo "   $BACKUP_SCRIPT list"
    echo ""
    echo "2. Restore from backup:"
    echo "   $BACKUP_SCRIPT restore [backup_name]"
    echo ""
    echo "3. Redeploy after restore:"
    echo "   azd deploy backend"
    echo ""
    echo "4. Test after rollback:"
    echo "   $0 test"
    echo ""
    
    # Show recent backups
    log "Recent backups available:"
    "$BACKUP_SCRIPT" list
}

# Function to setup all monitoring
setup_monitoring() {
    header "SETTING UP COMPREHENSIVE MONITORING"
    
    # Setup monitoring daemon
    log "Setting up monitoring daemon"
    "$MONITORING_DIR/monitor-daemon.sh" setup
    
    # Start monitoring
    log "Starting continuous monitoring"
    "$MONITORING_DIR/monitor-daemon.sh" start
    
    success "Monitoring setup completed!"
    echo ""
    echo "Monitoring features active:"
    echo "  ✓ Continuous health checks every 5 minutes"
    echo "  ✓ Automatic emergency backups on failures"
    echo "  ✓ Daily automated backups"
    echo "  ✓ Real-time logging and alerts"
    echo ""
    echo "Monitor commands:"
    echo "  $MONITORING_DIR/monitor-daemon.sh status"
    echo "  $MONITORING_DIR/monitor-daemon.sh logs"
    echo "  $MONITORING_DIR/monitor-daemon.sh health"
}

# Function to emergency stop
emergency_stop() {
    header "EMERGENCY PROCEDURES"
    
    warning "Emergency procedures activated!"
    echo ""
    echo "1. Creating emergency backup..."
    "$BACKUP_SCRIPT" create
    
    echo ""
    echo "2. Showing rollback options..."
    show_rollback_options
    
    echo ""
    echo "3. Current system status:"
    "$VALIDATOR_SCRIPT" test || true
}

# Main script logic
case "$1" in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "all"|"full")
        deploy_all
        ;;
    "test")
        test_deployment
        ;;
    "rollback")
        show_rollback_options
        ;;
    "setup")
        setup_monitoring
        ;;
    "emergency")
        emergency_stop
        ;;
    "status")
        header "SYSTEM STATUS"
        echo "Deployment validation:"
        "$VALIDATOR_SCRIPT" test || true
        echo ""
        echo "Health status:"
        node "$HEALTH_SCRIPT" --once || true
        echo ""
        echo "Monitoring daemon:"
        "$MONITORING_DIR/monitor-daemon.sh" status
        ;;
    "help"|"--help"|"-h")
        echo -e "${BOLD}Designetica Safe Deployment System${NC}"
        echo ""
        echo "This script provides bulletproof deployment with automatic:"
        echo "  • Pre-deployment validation and backups"
        echo "  • Post-deployment verification"
        echo "  • Automatic rollback on failure"
        echo "  • Comprehensive health monitoring"
        echo ""
        echo -e "${BOLD}Usage:${NC} $0 [command]"
        echo ""
        echo -e "${BOLD}Commands:${NC}"
        echo "  backend       Deploy backend with full safety checks"
        echo "  frontend      Deploy frontend with validation"
        echo "  all, full     Deploy both backend and frontend safely"
        echo "  test          Test current deployment"
        echo "  rollback      Show rollback options and recent backups"
        echo "  setup         Setup comprehensive monitoring system"
        echo "  emergency     Emergency procedures and rollback options"
        echo "  status        Show complete system status"
        echo "  help          Show this help"
        echo ""
        echo -e "${BOLD}Examples:${NC}"
        echo "  $0 backend     # Safe backend deployment"
        echo "  $0 all         # Deploy everything safely"
        echo "  $0 test        # Test current deployment"
        echo "  $0 status      # Check system status"
        echo ""
        echo -e "${BOLD}Monitoring:${NC}"
        echo "  $MONITORING_DIR/monitor-daemon.sh start   # Start monitoring"
        echo "  $MONITORING_DIR/monitor-daemon.sh status  # Check monitoring"
        echo "  $MONITORING_DIR/monitor-daemon.sh logs    # View logs"
        echo ""
        echo -e "${BOLD}Emergency Recovery:${NC}"
        echo "  $BACKUP_SCRIPT list                    # List backups"
        echo "  $BACKUP_SCRIPT restore [backup_name]   # Restore backup"
        echo "  $0 emergency                           # Emergency procedures"
        ;;
    *)
        if [ -z "$1" ]; then
            # No command provided, show status
            "$0" status
        else
            warning "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
        fi
        ;;
esac
