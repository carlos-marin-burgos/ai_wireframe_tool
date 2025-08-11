#!/bin/bash

# Azure OpenAI Service Recovery Script
# This script can be run manually or scheduled via cron to check and recover the service

set -e

# Configuration
BACKEND_DIR="/Users/carlosmarinburgos/designetica/backend"
LOG_FILE="$BACKEND_DIR/service-recovery.log"
MAX_RETRIES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}$message${NC}"
    log "$message"
}

print_status "$BLUE" "🔧 Azure OpenAI Service Recovery Script Started"

# Change to backend directory
cd "$BACKEND_DIR"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_status "$RED" "❌ .env file not found in $BACKEND_DIR"
    exit 1
fi

# Run health check
print_status "$BLUE" "🔍 Running Azure OpenAI health check..."

# Capture the full output and check for success
health_output=$(node azure-openai-monitor.js check 2>&1)
if echo "$health_output" | grep -q "Azure OpenAI service is HEALTHY"; then
    print_status "$GREEN" "✅ Azure OpenAI service is healthy - no action needed"
    exit 0
fi

print_status "$YELLOW" "⚠️ Azure OpenAI service appears to be down - attempting recovery..."
print_status "$YELLOW" "Health check output: $health_output"

# Recovery steps
recovery_attempt=1

while [ $recovery_attempt -le $MAX_RETRIES ]; do
    print_status "$BLUE" "🔄 Recovery attempt $recovery_attempt of $MAX_RETRIES"
    
    # Step 1: Check DNS resolution
    print_status "$BLUE" "🌐 Checking DNS resolution..."
    if ! nslookup cog-35kjosu4rfnkc.openai.azure.com >/dev/null 2>&1; then
        print_status "$YELLOW" "⚠️ DNS resolution failed - this may be the root cause"
        
        # Try flushing DNS cache (macOS)
        if command -v sudo >/dev/null 2>&1; then
            print_status "$BLUE" "🔄 Flushing DNS cache..."
            sudo dscacheutil -flushcache 2>/dev/null || true
            sudo killall -HUP mDNSResponder 2>/dev/null || true
        fi
    fi
    
    # Step 2: Check internet connectivity
    print_status "$BLUE" "🌍 Checking internet connectivity..."
    if ! curl -s --max-time 5 https://www.google.com >/dev/null; then
        print_status "$RED" "❌ No internet connectivity - cannot recover Azure OpenAI service"
        exit 1
    fi
    
    # Step 3: Verify Azure OpenAI endpoint format
    print_status "$BLUE" "🔍 Verifying Azure OpenAI configuration..."
    
    # Load environment variables
    source .env
    
    if [ -z "$AZURE_OPENAI_ENDPOINT" ]; then
        print_status "$RED" "❌ AZURE_OPENAI_ENDPOINT not set in .env file"
        exit 1
    fi
    
    if [ -z "$AZURE_OPENAI_KEY" ]; then
        print_status "$RED" "❌ AZURE_OPENAI_KEY not set in .env file"
        exit 1
    fi
    
    # Step 4: Test endpoint with curl
    print_status "$BLUE" "🧪 Testing Azure OpenAI endpoint with curl..."
    
    if curl -s --max-time 10 \
        -H "api-key: $AZURE_OPENAI_KEY" \
        -H "Content-Type: application/json" \
        "$AZURE_OPENAI_ENDPOINT" >/dev/null 2>&1; then
        print_status "$GREEN" "✅ Azure OpenAI endpoint is reachable"
        break
    else
        print_status "$YELLOW" "⚠️ Azure OpenAI endpoint test failed"
    fi
    
    # Step 5: Wait before retry
    if [ $recovery_attempt -lt $MAX_RETRIES ]; then
        sleep_time=$((recovery_attempt * 10))
        print_status "$BLUE" "⏳ Waiting ${sleep_time}s before next attempt..."
        sleep $sleep_time
    fi
    
    recovery_attempt=$((recovery_attempt + 1))
done

# Final health check
print_status "$BLUE" "🔍 Running final health check..."
final_health_output=$(node azure-openai-monitor.js check 2>&1)
if echo "$final_health_output" | grep -q "Azure OpenAI service is HEALTHY"; then
    print_status "$GREEN" "✅ Recovery successful! Azure OpenAI service is now healthy"
    
    # Restart the backend server to ensure it picks up the working connection
    print_status "$BLUE" "🔄 Restarting backend server..."
    pkill -f "simple-server.js" 2>/dev/null || true
    sleep 2
    nohup node simple-server.js > server.log 2>&1 &
    print_status "$GREEN" "✅ Backend server restarted"
    
    exit 0
else
    print_status "$RED" "❌ Recovery failed after $MAX_RETRIES attempts"
    print_status "$YELLOW" "💡 Manual intervention required:"
    print_status "$YELLOW" "   1. Check Azure OpenAI resource status in Azure Portal"
    print_status "$YELLOW" "   2. Verify AZURE_OPENAI_ENDPOINT URL is correct"
    print_status "$YELLOW" "   3. Verify AZURE_OPENAI_KEY is valid and not expired"
    print_status "$YELLOW" "   4. Check Azure service health status"
    exit 1
fi
