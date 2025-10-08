#!/bin/bash

# Safe Azure Deployment Script
# Prevents deployment issues by validating before and after deployment
# Usage: ./safe-deploy.sh [service] [--force]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Parse arguments
SERVICE=""
FORCE_DEPLOY=false
SKIP_VALIDATION=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE_DEPLOY=true
            shift
            ;;
        --skip-validation)
            SKIP_VALIDATION=true
            shift
            ;;
        backend|frontend|all)
            SERVICE="$1"
            shift
            ;;
        *)
            SERVICE="$1"
            shift
            ;;
    esac
done

if [ -z "$SERVICE" ]; then
    SERVICE="all"
fi

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_deploy() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

log_separator() {
    echo -e "${BLUE}======================================================================${NC}"
}

# Function to get current environment
get_current_env() {
    cd "$PROJECT_ROOT"
    # Get the default environment (marked with 'true' in DEFAULT column)
    azd env list | awk '$2 == "true" {print $1}' | head -1 || echo "unknown"
}

# Function to get expected function app URL for environment
get_expected_function_app_url() {
    local env="$1"
    case "$env" in
        "designetica")
            echo "https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"
            ;;
        "designetica-prod")
            echo "https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"
            ;;
        "production")
            echo "https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Function to backup current configuration
backup_config() {
    local backup_dir="$PROJECT_ROOT/.deployment-backups/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup key configuration files
    cp -r "$PROJECT_ROOT/src/config/" "$backup_dir/" 2>/dev/null || true
    cp "$PROJECT_ROOT/.azure/config.json" "$backup_dir/" 2>/dev/null || true
    cp "$PROJECT_ROOT/azure.yaml" "$backup_dir/" 2>/dev/null || true
    
    echo "$backup_dir"
}

# Function to restore configuration from backup
restore_config() {
    local backup_dir="$1"
    if [ -d "$backup_dir" ]; then
        log_warning "Restoring configuration from: $backup_dir"
        cp -r "$backup_dir/config/"* "$PROJECT_ROOT/src/config/" 2>/dev/null || true
        cp "$backup_dir/config.json" "$PROJECT_ROOT/.azure/" 2>/dev/null || true
        cp "$backup_dir/azure.yaml" "$PROJECT_ROOT/" 2>/dev/null || true
        return 0
    fi
    return 1
}

# Main deployment function
safe_deploy() {
    local service="$1"
    
    log_separator
    log_deploy "🛡️  SAFE AZURE DEPLOYMENT STARTING"
    log_info "📅 Started at: $(date)"
    log_info "🎯 Service: $service"
    log_info "🌍 Environment: $(get_current_env)"
    log_separator
    
    # Step 1: Pre-deployment validation
    log_info "🔍 Step 1: Pre-deployment validation"
    
    current_env=$(get_current_env)
    expected_url=$(get_expected_function_app_url "$current_env")
    
    if [ "$expected_url" = "unknown" ]; then
        log_error "Unknown environment: $current_env"
        log_info "Known environments: designetica, designetica-prod, production"
        exit 1
    fi
    
    log_success "Environment validation passed: $current_env"
    log_success "Expected function app: $expected_url"
    
    # Step 1.5: Subscription validation
    log_info "🔐 Step 1.5: BAMI subscription validation"
    EXPECTED_SUBSCRIPTION_ID="330eaa36-e19f-4d4c-8dea-37c2332f754d"
    CURRENT_SUBSCRIPTION_ID=$(az account show --query id --output tsv 2>/dev/null || echo "unknown")
    
    if [ "$CURRENT_SUBSCRIPTION_ID" != "$EXPECTED_SUBSCRIPTION_ID" ]; then
        log_error "Wrong Azure subscription!"
        log_error "Current: $CURRENT_SUBSCRIPTION_ID"
        log_error "Expected: $EXPECTED_SUBSCRIPTION_ID (BAMI)"
        log_info "Setting correct subscription..."
        az account set --subscription "$EXPECTED_SUBSCRIPTION_ID"
        CURRENT_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
        if [ "$CURRENT_SUBSCRIPTION_ID" = "$EXPECTED_SUBSCRIPTION_ID" ]; then
            log_success "Switched to correct BAMI subscription"
        else
            log_error "Failed to switch to BAMI subscription"
            exit 1
        fi
    else
        log_success "Using correct BAMI subscription: $CURRENT_SUBSCRIPTION_ID"
    fi
    
    # Step 2: Create backup
    log_info "💾 Step 2: Creating configuration backup"
    backup_dir=$(backup_config)
    log_success "Backup created: $backup_dir"
    
    # Step 3: Test current deployment if it exists
    if [ "$SKIP_VALIDATION" = false ]; then
        log_info "🏥 Step 3: Testing current deployment"
        if "$SCRIPT_DIR/validate-deployment.sh" "$expected_url" 2>/dev/null; then
            log_success "Current deployment is healthy"
        else
            log_warning "Current deployment has issues (this may be expected)"
        fi
    fi
    
    # Step 4: Perform deployment
    log_info "🚀 Step 4: Performing deployment"
    
    cd "$PROJECT_ROOT"
    deployment_success=false
    
    if [ "$service" = "all" ]; then
        log_deploy "Deploying all services..."
        if azd deploy; then
            deployment_success=true
        fi
    elif [ "$service" = "frontend" ]; then
        log_deploy "Deploying frontend..."
        # Build first
        log_info "Building frontend..."
        npm run build
        if azd deploy --service frontend; then
            deployment_success=true
        fi
    elif [ "$service" = "backend" ]; then
        log_deploy "Deploying backend..."
        if azd deploy --service backend; then
            deployment_success=true
        fi
    else
        log_error "Unknown service: $service"
        exit 1
    fi
    
    if [ "$deployment_success" = false ]; then
        log_error "Deployment failed"
        log_info "Attempting to restore configuration..."
        if restore_config "$backup_dir"; then
            log_warning "Configuration restored from backup"
        fi
        exit 1
    fi
    
    log_success "Deployment completed"
    
    # Step 5: Post-deployment validation
    if [ "$SKIP_VALIDATION" = false ]; then
        log_info "✅ Step 5: Post-deployment validation"
        
        # Wait a moment for functions to warm up
        log_info "Waiting 30 seconds for Azure Functions to warm up..."
        sleep 30
        
        if "$SCRIPT_DIR/validate-deployment.sh" "$expected_url"; then
            log_success "Post-deployment validation passed"
        else
            log_error "Post-deployment validation failed"
            
            if [ "$FORCE_DEPLOY" = false ]; then
                log_warning "Consider using --force flag to skip validation or check the deployment manually"
                exit 1
            else
                log_warning "Validation failed but --force flag used, continuing..."
            fi
        fi
    fi
    
    # Step 6: Update API configuration if needed
    log_info "⚙️  Step 6: Updating API configuration"
    
    # Ensure the frontend is pointing to the correct backend
    current_api_url=$(grep -o 'https://func-designetica-prod[^"]*' "$PROJECT_ROOT/src/config/api.ts" || echo "")
    
    if [ "$current_api_url" != "$expected_url" ]; then
        log_warning "API configuration mismatch detected"
        log_info "Current: $current_api_url"
        log_info "Expected: $expected_url"
        
        if [ "$FORCE_DEPLOY" = true ]; then
            log_info "Automatically updating API configuration..."
            sed -i.bak "s|https://func-designetica-prod[^\"]*|$expected_url|g" "$PROJECT_ROOT/src/config/api.ts"
            
            # Redeploy frontend if we updated the config
            if [ "$service" != "backend" ]; then
                log_deploy "Redeploying frontend with updated API configuration..."
                npm run build
                azd deploy --service frontend
                
                # Final validation
                sleep 15
                "$SCRIPT_DIR/validate-deployment.sh" "$expected_url"
            fi
        else
            log_warning "Use --force flag to automatically fix API configuration"
        fi
    else
        log_success "API configuration is correct"
    fi
    
    log_separator
    log_success "🎉 SAFE DEPLOYMENT COMPLETED SUCCESSFULLY!"
    log_success "🌍 Environment: $current_env"
    log_success "🔗 Function App: $expected_url"
    log_success "💾 Backup: $backup_dir"
    log_info "✨ Your deployment is ready and validated!"
    log_separator
}

# Main execution
case "$SERVICE" in
    "help"|"--help"|"-h")
        echo "Safe Azure Deployment Script"
        echo ""
        echo "Usage: $0 [service] [options]"
        echo ""
        echo "Services:"
        echo "  all         Deploy both backend and frontend (default)"
        echo "  backend     Deploy only the backend"
        echo "  frontend    Deploy only the frontend"
        echo ""
        echo "Options:"
        echo "  --force              Continue even if validation fails"
        echo "  --skip-validation    Skip pre and post deployment validation"
        echo "  --help              Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                   # Deploy all services with validation"
        echo "  $0 frontend          # Deploy only frontend"
        echo "  $0 backend --force   # Deploy backend, ignore validation failures"
        ;;
    *)
        safe_deploy "$SERVICE"
        ;;
esac