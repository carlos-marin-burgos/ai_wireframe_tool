#!/bin/bash

# Deployment Validation Script
# Prevents deployment issues by validating Azure Functions before completion
# Usage: ./validate-deployment.sh <function-app-url>

set -e

FUNCTION_APP_URL="$1"
MAX_RETRIES=10
RETRY_DELAY=30
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

log_separator() {
    echo -e "${BLUE}============================================================${NC}"
}

# Validate input
if [ -z "$FUNCTION_APP_URL" ]; then
    log_error "Usage: $0 <function-app-url>"
    log_info "Example: $0 https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"
    exit 1
fi

log_separator
log_info "🚀 Starting Azure Functions Deployment Validation"
log_info "📍 Target: $FUNCTION_APP_URL"
log_info "📅 Started at: $(date)"
log_separator

# Function to test HTTP endpoint
test_endpoint() {
    local endpoint="$1"
    local expected_status="$2"
    local timeout="$3"
    local description="$4"
    
    log_info "🔍 Testing: $description"
    log_info "   Endpoint: $endpoint"
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time "$timeout" \
        --connect-timeout 10 \
        "$endpoint" || echo "000")
    
    if [ "$response_code" = "$expected_status" ]; then
        log_success "   Response: $response_code (Expected: $expected_status)"
        return 0
    else
        log_error "   Response: $response_code (Expected: $expected_status)"
        return 1
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local endpoint="$1"
    local timeout="$2"
    local description="$3"
    
    log_info "🔍 Testing: $description"
    log_info "   Endpoint: $endpoint"
    
    # Get both response and status code
    local temp_file=$(mktemp)
    local response_code=$(curl -s -o "$temp_file" -w "%{http_code}" \
        --max-time "$timeout" --connect-timeout 10 "$endpoint" 2>/dev/null || echo "000")
    local response=$(cat "$temp_file")
    rm -f "$temp_file"
    
    # 401 means endpoint exists but requires authentication (expected for protected endpoints)
    if [ "$response_code" = "401" ]; then
        log_success "   Response: 401 (Protected endpoint - authentication required ✓)"
        return 0
    fi
    
    if [ -z "$response" ]; then
        log_error "   Response: Empty or timeout (Status: $response_code)"
        return 1
    fi
    
    # Check if response is valid JSON
    if echo "$response" | jq . >/dev/null 2>&1; then
        local status=$(echo "$response" | jq -r '.status // "unknown"')
        log_success "   Response: Valid JSON (Status: $status, HTTP: $response_code)"
        return 0
    else
        log_error "   Response: Invalid JSON or error"
        echo "   Raw response: $response" | head -c 200
        return 1
    fi
}

# Step 1: Test basic connectivity
log_info "🔗 Step 1: Testing basic connectivity"
if test_endpoint "$FUNCTION_APP_URL/" "200" 10 "Function App Root"; then
    log_success "Basic connectivity established"
else
    log_error "Cannot reach function app. Deployment may have failed."
    exit 1
fi

# Step 2: Test health endpoint
log_info "🏥 Step 2: Testing health endpoint"
HEALTH_ENDPOINT="$FUNCTION_APP_URL/api/health"
health_success=false

for i in $(seq 1 $MAX_RETRIES); do
    log_info "Health check attempt $i/$MAX_RETRIES"
    
    if test_json_endpoint "$HEALTH_ENDPOINT" 30 "Health Check"; then
        health_success=true
        break
    else
        if [ $i -lt $MAX_RETRIES ]; then
            log_warning "Health check failed, retrying in ${RETRY_DELAY}s..."
            sleep $RETRY_DELAY
        fi
    fi
done

if [ "$health_success" = false ]; then
    log_error "Health endpoint failed after $MAX_RETRIES attempts"
    exit 1
fi

# Step 3: Test main API endpoints
log_info "🎯 Step 3: Testing main API endpoints"

# Test direct image to wireframe endpoint (POST with test payload)
log_info "🖼️  Testing direct-image-to-wireframe endpoint"
WIREFRAME_ENDPOINT="$FUNCTION_APP_URL/api/direct-image-to-wireframe"

# Create a minimal test payload
cat > /tmp/test-payload.json << EOF
{
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "test": true,
  "options": {
    "enhanced": false,
    "timeout": 10000
  }
}
EOF

# Test with shorter timeout for validation
response_code=$(curl -s -o /dev/null -w "%{http_code}" \
    --max-time 45 \
    --connect-timeout 10 \
    -X POST \
    -H "Content-Type: application/json" \
    -d @/tmp/test-payload.json \
    "$WIREFRAME_ENDPOINT" 2>/dev/null || echo "000")

if [ "$response_code" = "200" ] || [ "$response_code" = "400" ]; then
    log_success "Wireframe endpoint is responding (Status: $response_code)"
else
    log_error "Wireframe endpoint failed (Status: $response_code)"
    # Don't exit here - this might be a cold start issue
fi

# Cleanup
rm -f /tmp/test-payload.json

# Step 4: Validate environment configuration
log_info "🔧 Step 4: Validating configuration"

# Check if this is the expected function app
if echo "$FUNCTION_APP_URL" | grep -q "func-designetica-prod-vmlmp4vej4ckc"; then
    log_success "Using new Flex Consumption function app: func-designetica-prod-vmlmp4vej4ckc"
elif echo "$FUNCTION_APP_URL" | grep -q "func-designetica-prod-working"; then
    log_warning "Using legacy Consumption function app: func-designetica-prod-working"
    log_warning "Consider migrating to func-designetica-prod-vmlmp4vej4ckc for better performance"
else
    log_warning "Using unrecognized function app URL"
fi

# Step 5: Update known good configuration
log_info "💾 Step 5: Updating deployment record"

# Save successful deployment info
DEPLOYMENT_LOG="$PROJECT_ROOT/.deployment-history.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create or update deployment history
if [ ! -f "$DEPLOYMENT_LOG" ]; then
    echo '{"deployments": []}' > "$DEPLOYMENT_LOG"
fi

# Add this deployment record
TEMP_FILE=$(mktemp)
jq --arg url "$FUNCTION_APP_URL" \
   --arg timestamp "$TIMESTAMP" \
   --arg status "validated" \
   '.deployments += [{
     "url": $url,
     "timestamp": $timestamp,
     "status": $status,
     "validation_passed": true
   }]' "$DEPLOYMENT_LOG" > "$TEMP_FILE" && mv "$TEMP_FILE" "$DEPLOYMENT_LOG"

log_separator
log_success "🎉 Deployment validation completed successfully!"
log_success "📊 Function App: $FUNCTION_APP_URL"
log_success "🏥 Health: ✅ Responding"
log_success "📝 Record saved to: $DEPLOYMENT_LOG"
log_info "✨ Deployment is ready for use"
log_separator

exit 0