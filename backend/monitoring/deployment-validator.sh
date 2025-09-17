#!/bin/bash

# Deployment validation and safety system for Designetica
# Ensures deployments are successful and rolls back on failure

set -e

# Configuration
API_ENDPOINT="https://func-original-app-pgno4orkguix6.azurewebsites.net/api/generate-html-wireframe"
HEALTH_ENDPOINT="https://func-original-app-pgno4orkguix6.azurewebsites.net/api/health"
WEBSITE_ENDPOINT="https://designetica.carlosmarin.net"
TIMEOUT=60
MAX_RETRIES=3
VALIDATION_WAIT=30

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

# Function to test API endpoint
test_api() {
    local endpoint="$1"
    local method="$2"
    local data="$3"
    local expected_status="${4:-200}"
    
    log "Testing $endpoint with $method"
    
    local response
    local status_code
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            --max-time "$TIMEOUT" \
            --connect-timeout 10)
    else
        response=$(curl -s -w "%{http_code}" "$endpoint" \
            --max-time "$TIMEOUT" \
            --connect-timeout 10)
    fi
    
    # Extract status code (last 3 characters)
    status_code="${response: -3}"
    response_body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        success "$endpoint responded with $status_code"
        return 0
    else
        error "$endpoint responded with $status_code (expected $expected_status)"
        echo "Response: $response_body"
        return 1
    fi
}

# Function to validate API functionality
validate_api_functionality() {
    log "Validating API functionality"
    
    local test_payload='{"context": "deployment test", "requirements": "simple layout", "additionalContext": "validation test"}'
    
    for i in $(seq 1 $MAX_RETRIES); do
        log "Attempt $i/$MAX_RETRIES"
        
        if test_api "$API_ENDPOINT" "POST" "$test_payload" "200"; then
            success "API functionality validated"
            return 0
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            warning "Retrying in 10 seconds..."
            sleep 10
        fi
    done
    
    error "API functionality validation failed after $MAX_RETRIES attempts"
    return 1
}

# Function to validate health endpoint
validate_health_endpoint() {
    log "Validating health endpoint"
    
    for i in $(seq 1 $MAX_RETRIES); do
        log "Attempt $i/$MAX_RETRIES"
        
        if test_api "$HEALTH_ENDPOINT" "GET" "" "200"; then
            success "Health endpoint validated"
            return 0
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            warning "Retrying in 5 seconds..."
            sleep 5
        fi
    done
    
    error "Health endpoint validation failed after $MAX_RETRIES attempts"
    return 1
}

# Function to validate website accessibility
validate_website() {
    log "Validating website accessibility"
    
    for i in $(seq 1 $MAX_RETRIES); do
        log "Attempt $i/$MAX_RETRIES"
        
        if test_api "$WEBSITE_ENDPOINT" "GET" "" "200"; then
            success "Website accessibility validated"
            return 0
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            warning "Retrying in 5 seconds..."
            sleep 5
        fi
    done
    
    error "Website validation failed after $MAX_RETRIES attempts"
    return 1
}

# Function to run pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks"
    
    # Check if required files exist
    local required_files=(
        "/Users/carlosmarinburgos/designetica/backend/generateWireframe/index.js"
        "/Users/carlosmarinburgos/designetica/backend/package.json"
        "/Users/carlosmarinburgos/designetica/src/config/api.ts"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            success "Required file exists: $file"
        else
            error "Required file missing: $file"
            return 1
        fi
    done
    
    # Check for syntax errors in main function
    log "Checking JavaScript syntax"
    if node -c "/Users/carlosmarinburgos/designetica/backend/generateWireframe/index.js"; then
        success "JavaScript syntax check passed"
    else
        error "JavaScript syntax errors detected"
        return 1
    fi
    
    # Create pre-deployment backup
    log "Creating pre-deployment backup"
    /Users/carlosmarinburgos/designetica/backend/monitoring/backup-recovery.sh pre-deploy
    
    success "Pre-deployment checks completed"
    return 0
}

# Function to run post-deployment validation
post_deployment_validation() {
    log "Starting post-deployment validation"
    
    # Wait for deployment to stabilize
    log "Waiting $VALIDATION_WAIT seconds for deployment to stabilize..."
    sleep "$VALIDATION_WAIT"
    
    local validation_failed=false
    
    # Validate health endpoint
    if ! validate_health_endpoint; then
        validation_failed=true
    fi
    
    # Validate API functionality
    if ! validate_api_functionality; then
        validation_failed=true
    fi
    
    # Validate website
    if ! validate_website; then
        validation_failed=true
    fi
    
    if [ "$validation_failed" = true ]; then
        error "Post-deployment validation failed"
        return 1
    else
        success "Post-deployment validation passed"
        return 0
    fi
}

# Function to perform safe deployment
safe_deploy() {
    local component="$1"
    
    if [ -z "$component" ]; then
        component="backend"
    fi
    
    log "Starting safe deployment of $component"
    
    # Pre-deployment checks
    if ! pre_deployment_checks; then
        error "Pre-deployment checks failed. Aborting deployment."
        return 1
    fi
    
    # Store current API status for rollback validation
    log "Checking current API status before deployment"
    local pre_deploy_status=0
    test_api "$API_ENDPOINT" "POST" '{"context": "pre-deploy test", "requirements": "test", "additionalContext": "test"}' "200" || pre_deploy_status=1
    
    # Deploy
    log "Deploying $component"
    if azd deploy "$component"; then
        success "Deployment command completed"
    else
        error "Deployment command failed"
        return 1
    fi
    
    # Post-deployment validation
    if post_deployment_validation; then
        success "Safe deployment completed successfully"
        
        # Run health check
        log "Running post-deployment health check"
        node /Users/carlosmarinburgos/designetica/backend/monitoring/health-monitor.js --once
        
        return 0
    else
        error "Post-deployment validation failed. Consider rollback."
        
        # If API was working before and now broken, suggest rollback
        if [ "$pre_deploy_status" = 0 ]; then
            warning "API was working before deployment but is now broken."
            warning "Consider rolling back with: ./backup-recovery.sh restore [backup_name]"
            warning "List available backups with: ./backup-recovery.sh list"
        fi
        
        return 1
    fi
}

# Function to monitor deployment status
monitor_deployment() {
    log "Monitoring deployment status"
    
    local start_time=$(date +%s)
    local max_wait=300  # 5 minutes
    
    while true; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [ $elapsed -gt $max_wait ]; then
            error "Deployment monitoring timed out after $max_wait seconds"
            return 1
        fi
        
        log "Checking deployment status... (${elapsed}s elapsed)"
        
        if validate_health_endpoint; then
            if validate_api_functionality; then
                success "Deployment is healthy and functional"
                return 0
            fi
        fi
        
        log "Deployment not ready yet, waiting 30 seconds..."
        sleep 30
    done
}

# Function to emergency rollback
emergency_rollback() {
    error "EMERGENCY ROLLBACK INITIATED"
    
    # List recent backups
    echo "Available backups for rollback:"
    /Users/carlosmarinburgos/designetica/backend/monitoring/backup-recovery.sh list
    
    echo ""
    warning "To rollback, run:"
    echo "  ./backup-recovery.sh restore [backup_name]"
    echo "  azd deploy backend"
    echo ""
    
    # Try to find the most recent pre-deployment backup
    local latest_backup
    latest_backup=$(ls -1t /Users/carlosmarinburgos/designetica/backups/pre_deployment_*.tar.gz 2>/dev/null | head -1 || echo "")
    
    if [ -n "$latest_backup" ]; then
        local backup_name
        backup_name=$(basename "$latest_backup" .tar.gz)
        warning "Most recent pre-deployment backup: $backup_name"
        echo "Quick rollback command: ./backup-recovery.sh restore $backup_name && azd deploy backend"
    fi
}

# Main script logic
case "$1" in
    "pre-check")
        pre_deployment_checks
        ;;
    "post-validate")
        post_deployment_validation
        ;;
    "safe-deploy")
        safe_deploy "$2"
        ;;
    "monitor")
        monitor_deployment
        ;;
    "rollback")
        emergency_rollback
        ;;
    "test")
        log "Running full validation test"
        validate_health_endpoint && validate_api_functionality && validate_website
        ;;
    "help"|"--help"|"-h")
        echo "Designetica Deployment Validation System"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  pre-check         Run pre-deployment checks"
        echo "  post-validate     Run post-deployment validation"
        echo "  safe-deploy [component]  Perform safe deployment with validation"
        echo "  monitor           Monitor deployment until healthy"
        echo "  rollback          Show rollback instructions"
        echo "  test              Test all endpoints"
        echo "  help              Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 safe-deploy backend"
        echo "  $0 test"
        echo "  $0 monitor"
        ;;
    *)
        warning "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
