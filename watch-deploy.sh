#!/bin/bash

# File Watcher Auto-Deployment Script
# Monitors file changes and auto-deploys when needed

echo "👀 Starting file watcher for auto-deployment..."
echo "Monitoring: backend/, src/, azure.yaml, package.json"
echo "Press Ctrl+C to stop"

# Check if fswatch is available (macOS)
if ! command -v fswatch &> /dev/null; then
    echo "Installing fswatch..."
    if command -v brew &> /dev/null; then
        brew install fswatch
    else
        echo "❌ Please install fswatch: brew install fswatch"
        exit 1
    fi
fi

# Debounce mechanism to avoid multiple rapid deployments
LAST_DEPLOY_TIME=0
DEPLOY_COOLDOWN=300  # 5 minutes cooldown between deployments

deploy_if_needed() {
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - LAST_DEPLOY_TIME))
    
    if [ $TIME_DIFF -lt $DEPLOY_COOLDOWN ]; then
        echo "⏳ Deployment on cooldown (${TIME_DIFF}s ago)"
        return
    fi
    
    echo "🚀 Files changed, starting deployment..."
    LAST_DEPLOY_TIME=$CURRENT_TIME
    
    # Run environment check first
    if ./check-env.sh > /dev/null 2>&1; then
        echo "✅ Environment validated, deploying..."
        ./deploy.sh
    else
        echo "❌ Environment validation failed, skipping deployment"
    fi
}

# Watch for changes
fswatch -o \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="*.log" \
    --exclude="*.tmp" \
    backend/ src/ azure.yaml package.json \
    | while read f; do
        echo "📁 Files changed at $(date)"
        deploy_if_needed
    done