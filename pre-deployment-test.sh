#!/bin/bash

# Pre-Deployment Test Script
# Run this BEFORE deploying to verify Phase 1 & 2 work locally

set -e

echo "🧪 Pre-Deployment Test Suite"
echo "============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "1️⃣  Checking if Azure Functions backend is running..."
if curl -sf http://localhost:7071/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo ""
    echo "Please start the backend first:"
    echo "  cd backend"
    echo "  func start"
    echo ""
    exit 1
fi

# Test websiteAnalyzer endpoint
echo ""
echo "2️⃣  Testing websiteAnalyzer endpoint..."
RESPONSE=$(curl -sf -X POST http://localhost:7071/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' 2>&1)

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ WebsiteAnalyzer endpoint works${NC}"
else
    echo -e "${RED}❌ WebsiteAnalyzer endpoint failed${NC}"
    echo "Response: $RESPONSE"
    exit 1
fi

# Test Phase 1 features
echo ""
echo "3️⃣  Testing Phase 1 features (colors & typography)..."

# Extract colors
COLORS=$(echo "$RESPONSE" | jq -r '.analysis.styling.colors')
BG_COLOR=$(echo "$COLORS" | jq -r '.background')
PRIMARY_COLOR=$(echo "$COLORS" | jq -r '.primary')

if [ "$BG_COLOR" != "null" ] && [ "$PRIMARY_COLOR" != "null" ]; then
    echo -e "${GREEN}✅ Colors extracted: bg=$BG_COLOR, primary=$PRIMARY_COLOR${NC}"
    
    # Check if colors are hardcoded (would indicate Phase 1 not working)
    if [ "$BG_COLOR" == "#ffffff" ] && [ "$PRIMARY_COLOR" == "#0066cc" ]; then
        echo -e "${YELLOW}⚠️  Warning: Colors appear to be hardcoded defaults${NC}"
    fi
else
    echo -e "${RED}❌ Colors not extracted${NC}"
fi

# Extract typography
TYPOGRAPHY=$(echo "$RESPONSE" | jq -r '.analysis.styling.typography')
FONT_FAMILY=$(echo "$TYPOGRAPHY" | jq -r '.fontFamily')

if [ "$FONT_FAMILY" != "null" ] && [ "$FONT_FAMILY" != "sans-serif" ]; then
    echo -e "${GREEN}✅ Typography extracted: font=$FONT_FAMILY${NC}"
else
    echo -e "${YELLOW}⚠️  Typography might be using defaults: $FONT_FAMILY${NC}"
fi

# Test Phase 2 features
echo ""
echo "4️⃣  Testing Phase 2 features..."

# Check layout measurements
MEASUREMENTS=$(echo "$RESPONSE" | jq -r '.analysis.layout.measurements')
if [ "$MEASUREMENTS" != "null" ]; then
    VIEWPORT_WIDTH=$(echo "$MEASUREMENTS" | jq -r '.viewport.width')
    echo -e "${GREEN}✅ Layout measurements present (viewport: ${VIEWPORT_WIDTH}px)${NC}"
else
    echo -e "${RED}❌ Layout measurements missing${NC}"
fi

# Check responsive data
RESPONSIVE=$(echo "$RESPONSE" | jq -r '.analysis.responsive')
if [ "$RESPONSIVE" != "null" ]; then
    HAS_MOBILE=$(echo "$RESPONSIVE" | jq -r '.mobile')
    if [ "$HAS_MOBILE" != "null" ]; then
        echo -e "${GREEN}✅ Responsive data present (mobile, tablet, desktop)${NC}"
    else
        echo -e "${RED}❌ Responsive data incomplete${NC}"
    fi
else
    echo -e "${RED}❌ Responsive data missing${NC}"
fi

# Check advanced CSS
ADVANCED_CSS=$(echo "$RESPONSE" | jq -r '.analysis.styling.advancedCSS')
if [ "$ADVANCED_CSS" != "null" ]; then
    SHADOWS_COUNT=$(echo "$ADVANCED_CSS" | jq -r '.commonEffects.shadows | length')
    echo -e "${GREEN}✅ Advanced CSS present (${SHADOWS_COUNT} shadows found)${NC}"
else
    echo -e "${RED}❌ Advanced CSS missing${NC}"
fi

# Check framework detection
FRAMEWORKS=$(echo "$RESPONSE" | jq -r '.analysis.frameworks')
if [ "$FRAMEWORKS" != "null" ]; then
    echo -e "${GREEN}✅ Framework detection present${NC}"
else
    echo -e "${RED}❌ Framework detection missing${NC}"
fi

# Check screenshot
SCREENSHOT=$(echo "$RESPONSE" | jq -r '.analysis.screenshot')
if [ "$SCREENSHOT" != "null" ]; then
    SCREENSHOT_SIZE=$(echo "$SCREENSHOT" | jq -r '.data' | wc -c)
    SCREENSHOT_KB=$((SCREENSHOT_SIZE / 1024))
    echo -e "${GREEN}✅ Screenshot captured (${SCREENSHOT_KB}KB)${NC}"
else
    echo -e "${RED}❌ Screenshot missing${NC}"
fi

# Performance check
echo ""
echo "5️⃣  Performance check..."
echo "Testing analysis time (should be <60s)..."

START_TIME=$(date +%s)
PERF_RESPONSE=$(curl -sf -X POST http://localhost:7071/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}' 2>&1)
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

if [ $ELAPSED -lt 60 ]; then
    echo -e "${GREEN}✅ Analysis completed in ${ELAPSED}s (good!)${NC}"
elif [ $ELAPSED -lt 120 ]; then
    echo -e "${YELLOW}⚠️  Analysis took ${ELAPSED}s (acceptable but slow)${NC}"
else
    echo -e "${RED}❌ Analysis took ${ELAPSED}s (too slow!)${NC}"
fi

# Final summary
echo ""
echo "=========================================="
echo "📊 Pre-Deployment Test Summary"
echo "=========================================="

TESTS_PASSED=0
TESTS_TOTAL=8

# Count passed tests based on exit status
if echo "$RESPONSE" | grep -q '"success":true'; then ((TESTS_PASSED++)); fi
if [ "$BG_COLOR" != "null" ]; then ((TESTS_PASSED++)); fi
if [ "$FONT_FAMILY" != "null" ]; then ((TESTS_PASSED++)); fi
if [ "$MEASUREMENTS" != "null" ]; then ((TESTS_PASSED++)); fi
if [ "$RESPONSIVE" != "null" ]; then ((TESTS_PASSED++)); fi
if [ "$ADVANCED_CSS" != "null" ]; then ((TESTS_PASSED++)); fi
if [ "$FRAMEWORKS" != "null" ]; then ((TESTS_PASSED++)); fi
if [ "$SCREENSHOT" != "null" ]; then ((TESTS_PASSED++)); fi

PASS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))

echo ""
echo "Tests Passed: $TESTS_PASSED/$TESTS_TOTAL ($PASS_RATE%)"
echo ""

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Ready to deploy!${NC}"
    echo ""
    echo "To deploy, run:"
    echo "  ./deploy.sh"
    exit 0
elif [ $TESTS_PASSED -ge 6 ]; then
    echo -e "${YELLOW}⚠️  MOST TESTS PASSED. Review warnings above.${NC}"
    echo ""
    echo "You can deploy, but some features might not work perfectly."
    echo ""
    read -p "Deploy anyway? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "To deploy, run: ./deploy.sh"
        exit 0
    else
        echo "Deployment cancelled. Fix issues and try again."
        exit 1
    fi
else
    echo -e "${RED}❌ TOO MANY TESTS FAILED. Do NOT deploy yet.${NC}"
    echo ""
    echo "Fix the issues above and run this test again."
    exit 1
fi
