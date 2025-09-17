#!/bin/bash

# Scheduled deployment script for cron jobs
# This script runs environment checks and deploys if needed

cd "$(dirname "$0")"

echo "⏰ Scheduled deployment check at $(date)" >> deployment-cron.log

# Run environment check
if ./check-env.sh >> deployment-cron.log 2>&1; then
    echo "✅ Environment check passed" >> deployment-cron.log
    
    # Check if there are any pending changes to deploy
    # (This is a simple check - you can make it more sophisticated)
    
    # For now, we'll skip auto-deployment in cron to avoid unexpected deployments
    # Uncomment the line below if you want automatic scheduled deployments
    # ./deploy.sh >> deployment-cron.log 2>&1
    
    echo "ℹ️  Scheduled check completed - no auto-deployment" >> deployment-cron.log
else
    echo "❌ Environment check failed" >> deployment-cron.log
fi