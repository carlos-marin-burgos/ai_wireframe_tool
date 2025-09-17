#!/bin/bash

# Direct deployment to lemon-field WITHOUT Git
# This script deploys directly to your Static Web App

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Direct Deployment to LEMON-FIELD (No Git!)${NC}"
echo "================================================"

# Build first
echo -e "${YELLOW}📦 Building frontend...${NC}"
npm run build

# Copy our updated monitor-analytics.html to dist
echo -e "${YELLOW}📋 Ensuring monitor-analytics.html is in dist...${NC}"
cp public/monitor-analytics.html dist/monitor-analytics.html

echo -e "${GREEN}✅ Build completed!${NC}"
echo ""
echo -e "${YELLOW}📂 Files ready in dist/ directory${NC}"
echo ""

echo -e "${BLUE}🌐 Your LEMON-FIELD site:${NC}"
echo "   https://lemon-field-08a1a0b0f.1.azurestaticapps.net"
echo ""

echo -e "${YELLOW}💡 Next steps to deploy without Git:${NC}"
echo "1. Go to Azure Portal → Static Web Apps → Your lemon-field app"
echo "2. Get the deployment token from Settings"
echo "3. Use: swa deploy ./dist --deployment-token YOUR_TOKEN"
echo ""
echo "Or we can find another direct deployment method!"

# Show what files are ready
echo -e "${YELLOW}📋 Built files ready for deployment:${NC}"
ls -la dist/monitor-analytics.html