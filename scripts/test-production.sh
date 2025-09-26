#!/bin/bash

# Production Deployment Validation Script
# Tests all critical endpoints after deployment

echo "🧪 Testing Production Deployment..."
echo "================================="

BACKEND_URL="https://func-designetica-vdlmicyosd4ua.azurewebsites.net"
FRONTEND_URL="https://delightful-pond-064d9a91e.1.azurestaticapps.net"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${YELLOW}🏥 Testing Health Endpoints...${NC}"

# Test Health
echo -n "  Backend Health: "
if curl -s -w "%{http_code}" -o /dev/null "$BACKEND_URL/api/health" | grep -q "200"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
fi

# Test OpenAI Health
echo -n "  OpenAI Health:  "
if curl -s -w "%{http_code}" -o /dev/null "$BACKEND_URL/api/openai-health" | grep -q "200"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
fi

echo ""
echo -e "${YELLOW}🌐 Testing CORS & Frontend...${NC}"

# Test Frontend
echo -n "  Frontend Load:  "
if curl -s -w "%{http_code}" -o /dev/null "$FRONTEND_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
fi

echo ""
echo -e "${YELLOW}⚡ Testing AI Endpoints...${NC}"

# Test Suggestions (Fast)
echo -n "  Suggestions:    "
if timeout 30 curl -s -X POST "$BACKEND_URL/api/generate-suggestions" \
    -H "Content-Type: application/json" \
    -H "Origin: $FRONTEND_URL" \
    -d '{"description": "test"}' > /dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Failed/Timeout${NC}"
fi

# Test Wireframe (May be slow)
echo -n "  Wireframe Gen:  "
if timeout 60 curl -s -X POST "$BACKEND_URL/api/generate-html-wireframe" \
    -H "Content-Type: application/json" \
    -H "Origin: $FRONTEND_URL" \
    -d '{"description": "simple login page", "fastMode": true}' > /dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Failed/Timeout${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Infrastructure Check...${NC}"

# Check Function App Plan
echo -n "  App Service Plan: "
PLAN_TIER=$(az functionapp show --name func-designetica-vdlmicyosd4ua --resource-group rg-designetica-aibuilder-prod --query "appServicePlanId" -o tsv | xargs az appservice plan show --ids | jq -r '.sku.tier' 2>/dev/null)

if [[ "$PLAN_TIER" == "ElasticPremium" ]]; then
    echo -e "${GREEN}✅ Premium Plan${NC}"
elif [[ "$PLAN_TIER" == "Dynamic" ]]; then
    echo -e "${RED}❌ Consumption Plan (upgrade needed)${NC}"
else
    echo -e "${YELLOW}⚠️  Unknown Plan${NC}"
fi

echo ""
echo "================================="
echo -e "${GREEN}🎯 Production Test Complete!${NC}"
echo ""
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL:  $BACKEND_URL"
echo ""
echo "If any tests failed, check:"
echo "1. CORS configuration"
echo "2. Function App scaling settings"
echo "3. Azure OpenAI rate limits"
echo "4. Network connectivity"
