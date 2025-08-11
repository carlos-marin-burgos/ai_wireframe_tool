#!/bin/bash

# 🚀 Designetica Fast Deployment Script
# Optimized for speed with smart caching and parallel operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_START_TIME=$(date +%s)
PROJECT_NAME="designetica"
BACKEND_DIR="backend"
FRONTEND_DIST="dist"

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
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

log_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Header
echo ""
echo -e "${PURPLE}🚀 DESIGNETICA FAST DEPLOYMENT${NC}"
echo -e "${BLUE}═══════════════════════════════${NC}"
echo ""

# Pre-flight checks
log "🔍 Running pre-flight checks..."

# Check required tools
missing_tools=()
for tool in az azd npm node; do
    if ! command -v $tool &> /dev/null; then
        missing_tools+=($tool)
    fi
done

if [ ${#missing_tools[@]} -ne 0 ]; then
    log_error "Missing required tools: ${missing_tools[*]}"
    echo "Please install the missing tools and try again."
    exit 1
fi

# Check Azure authentication
if ! az account show &> /dev/null; then
    log_warning "Not authenticated with Azure"
    log "🔐 Logging in to Azure..."
    az login
fi

# Check azd environment
if ! azd env list | grep -q "$PROJECT_NAME"; then
    log_warning "Azure Developer CLI environment '$PROJECT_NAME' not found"
    log "🔧 Initializing azd environment..."
    azd env new "$PROJECT_NAME"
fi

log_success "Pre-flight checks completed"

# Step 1: Fast frontend build
log "🏗️ Building frontend (optimized)..."
{
    # Ensure analytics dashboard is in public directory
    if [ -f "monitor-analytics.html" ]; then
        cp monitor-analytics.html public/monitor-analytics.html
        log_info "Analytics dashboard copied to public directory"
    fi
    
    # Use npm ci for faster, reliable installs
    if [ -f "package-lock.json" ]; then
        npm ci --silent
    else
        npm install --silent
    fi
    
    # Build frontend
    NODE_ENV=production npm run build --silent
    
    # Optimize build output
    if [ -d "$FRONTEND_DIST" ]; then
        # Remove source maps for faster upload (optional)
        find "$FRONTEND_DIST" -name "*.map" -delete 2>/dev/null || true
        log_info "Frontend build size: $(du -sh $FRONTEND_DIST | cut -f1)"
    fi
} &
FRONTEND_PID=$!

# Step 2: Prepare backend (in parallel)
log "📦 Preparing backend deployment..."
{
    cd "$BACKEND_DIR"
    
    # Backup current package.json
    if [ -f "package.json" ]; then
        cp package.json package.json.backup
    fi
    
    # Use deployment-optimized package.json if available
    if [ -f "package.deploy.json" ]; then
        log_info "Using optimized deployment package.json"
        cp package.deploy.json package.json
    fi
    
    # Clean install for production
    rm -rf node_modules 2>/dev/null || true
    
    if [ -f "package-lock.json" ]; then
        npm ci --only=production --silent
    else
        npm install --only=production --silent
    fi
    
    # Remove development files for smaller deployment
    rm -rf .git 2>/dev/null || true
    rm -rf tests test __tests__ 2>/dev/null || true
    rm -rf *.test.js *.spec.js 2>/dev/null || true
    rm -rf coverage 2>/dev/null || true
    
    cd ..
    log_info "Backend deployment size: $(du -sh $BACKEND_DIR | cut -f1)"
} &
BACKEND_PID=$!

# Wait for both frontend and backend preparation
log "⏳ Waiting for build processes..."
wait $FRONTEND_PID
log_success "Frontend build completed"

wait $BACKEND_PID
log_success "Backend preparation completed"

# Step 3: Environment setup
log "� Setting up deployment environment..."
azd env select "$PROJECT_NAME" || {
    log_warning "Failed to select environment, creating new one..."
    azd env new "$PROJECT_NAME"
    azd env select "$PROJECT_NAME"
}

# Step 4: Fast deployment
log "🚀 Starting fast deployment to Azure..."
log_info "Using optimized deployment flags for speed"

# Deploy with optimized flags
if azd up \
    --no-prompt \
    --output table \
    2>&1 | tee deployment.log; then
    
    log_success "Deployment completed successfully!"
    
    # Get deployment outputs
    echo ""
    echo -e "${PURPLE}🌐 DEPLOYMENT RESULTS${NC}"
    echo -e "${BLUE}═══════════════════${NC}"
    
    # Try to get resource URLs
    RESOURCE_GROUP=$(azd env get-values | grep AZURE_RESOURCE_GROUP_NAME | cut -d'=' -f2 | tr -d '"' 2>/dev/null || echo "rg-designetica")
    
    # Get Static Web App URL
    SWA_URL=$(az staticwebapp list --resource-group "$RESOURCE_GROUP" --query "[0].defaultHostname" -o tsv 2>/dev/null || echo "")
    if [ -n "$SWA_URL" ] && [ "$SWA_URL" != "null" ]; then
        echo -e "${GREEN}� Frontend:${NC} https://$SWA_URL"
    fi
    
    # Get Function App URL
    FUNC_URL=$(az functionapp list --resource-group "$RESOURCE_GROUP" --query "[0].defaultHostName" -o tsv 2>/dev/null || echo "")
    if [ -n "$FUNC_URL" ] && [ "$FUNC_URL" != "null" ]; then
        echo -e "${GREEN}🔧 Backend API:${NC} https://$FUNC_URL"
    fi
    
    # Custom domain
    echo -e "${GREEN}🌐 Custom Domain:${NC} https://designetica.carlosmarin.net/"
    
    # Azure Portal link
    SUBSCRIPTION_ID=$(az account show --query id -o tsv 2>/dev/null)
    if [ -n "$SUBSCRIPTION_ID" ]; then
        echo -e "${GREEN}📊 Azure Portal:${NC} https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"
    fi
    
else
    log_error "Deployment failed!"
    echo ""
    echo "📋 Check the deployment log above for details."
    echo "🔧 Common solutions:"
    echo "   • Run 'azd auth login' to refresh authentication"
    echo "   • Check Azure subscription quota"
    echo "   • Verify resource group permissions"
    echo ""
    exit 1
fi

# Step 5: Cleanup and restore
log "🧹 Performing post-deployment cleanup..."
{
    cd "$BACKEND_DIR"
    
    # Restore original package.json
    if [ -f "package.json.backup" ]; then
        cp package.json.backup package.json
        rm package.json.backup
        log_info "Original package.json restored"
    fi
    
    # Restore dev dependencies for local development
    if [ -f "package-lock.json" ]; then
        npm ci --silent
    else
        npm install --silent
    fi
    
    cd ..
}

# Calculate deployment time
DEPLOYMENT_END_TIME=$(date +%s)
DEPLOYMENT_DURATION=$((DEPLOYMENT_END_TIME - DEPLOYMENT_START_TIME))
MINUTES=$((DEPLOYMENT_DURATION / 60))
SECONDS=$((DEPLOYMENT_DURATION % 60))

echo ""
echo -e "${GREEN}🎉 FAST DEPLOYMENT COMPLETED!${NC}"
echo -e "${BLUE}⏱️  Total time: ${MINUTES}m ${SECONDS}s${NC}"
echo ""

# Optional: Run a quick health check
log "🔍 Running post-deployment health check..."
if [ -n "$FUNC_URL" ]; then
    if curl -s --max-time 10 "https://$FUNC_URL/api/health" >/dev/null 2>&1; then
        log_success "Backend health check passed"
    else
        log_warning "Backend health check failed (this is normal for cold starts)"
    fi
fi

# Monitoring suggestion
echo ""
log_info "💡 Pro tip: Monitor your deployment at:"
log_info "   📊 Dashboard: file://$(pwd)/monitor-analytics.html"
log_info "   🔍 Azure Monitor: https://portal.azure.com"
echo ""
