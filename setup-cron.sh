#!/bin/bash

# Cron setup script for scheduled deployments
echo "📅 Setting up scheduled deployment checks..."

# Make the scheduled script executable
chmod +x scheduled-deploy.sh

# Get current directory
SCRIPT_DIR=$(pwd)

echo ""
echo "To set up scheduled environment checks, add one of these to your crontab:"
echo "(Run 'crontab -e' to edit)"
echo ""
echo "# Check environment every hour"
echo "0 * * * * cd $SCRIPT_DIR && ./scheduled-deploy.sh"
echo ""
echo "# Check environment twice daily (9 AM and 5 PM)"
echo "0 9,17 * * * cd $SCRIPT_DIR && ./scheduled-deploy.sh"
echo ""
echo "# Check environment once daily at 9 AM"
echo "0 9 * * * cd $SCRIPT_DIR && ./scheduled-deploy.sh"
echo ""
echo "📝 Logs will be written to: deployment-cron.log"
echo ""
echo "💡 To enable auto-deployment, edit scheduled-deploy.sh and uncomment the deploy line"