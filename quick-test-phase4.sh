#!/bin/bash

# Quick Test Script for Smart Sidebar Phase 4 Backend
# Run this to verify backend is ready for frontend integration

echo "🧪 Smart Sidebar Phase 4 Quick Test"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "📍 Step 1: Check if backend is running..."
if curl -s http://localhost:7071/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 7071${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo "   Start it with: cd backend && func start"
    exit 1
fi

echo ""
echo "📍 Step 2: Test Phase 4 API with GitHub login..."

# Test API and store response
RESPONSE=$(curl -s -X POST http://localhost:7071/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/login"}')

# Check if request succeeded
if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API request successful${NC}"
else
    echo -e "${RED}❌ API request failed${NC}"
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "📍 Step 3: Verify patterns array exists..."
PATTERN_COUNT=$(echo "$RESPONSE" | jq -r '.patterns | length')
if [ "$PATTERN_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Patterns detected: $PATTERN_COUNT${NC}"
else
    echo -e "${RED}❌ No patterns detected${NC}"
    exit 1
fi

echo ""
echo "📍 Step 4: Verify suggestions array exists..."
SUGGESTION_COUNT=$(echo "$RESPONSE" | jq -r '.suggestions | length')
if [ "$SUGGESTION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Suggestions generated: $SUGGESTION_COUNT${NC}"
else
    echo -e "${RED}❌ No suggestions generated${NC}"
    exit 1
fi

echo ""
echo "📍 Step 5: Check pattern structure..."
FIRST_PATTERN=$(echo "$RESPONSE" | jq -r '.patterns[0]')

# Check required fields
HAS_TYPE=$(echo "$FIRST_PATTERN" | jq -e '.type' > /dev/null && echo "true" || echo "false")
HAS_TITLE=$(echo "$FIRST_PATTERN" | jq -e '.title' > /dev/null && echo "true" || echo "false")
HAS_CONFIDENCE=$(echo "$FIRST_PATTERN" | jq -e '.confidence' > /dev/null && echo "true" || echo "false")
HAS_PRIORITY=$(echo "$FIRST_PATTERN" | jq -e '.priority' > /dev/null && echo "true" || echo "false")

if [ "$HAS_TYPE" = "true" ] && [ "$HAS_TITLE" = "true" ] && [ "$HAS_CONFIDENCE" = "true" ] && [ "$HAS_PRIORITY" = "true" ]; then
    echo -e "${GREEN}✅ Pattern structure valid${NC}"
    echo "   Sample pattern:"
    echo "$FIRST_PATTERN" | jq '{type, title, confidence, priority}'
else
    echo -e "${RED}❌ Pattern structure incomplete${NC}"
    exit 1
fi

echo ""
echo "📍 Step 6: Check suggestion structure..."
FIRST_SUGGESTION=$(echo "$RESPONSE" | jq -r '.suggestions[0].suggestions[0]')

HAS_TITLE=$(echo "$FIRST_SUGGESTION" | jq -e '.title' > /dev/null && echo "true" || echo "false")
HAS_IMPACT=$(echo "$FIRST_SUGGESTION" | jq -e '.impact' > /dev/null && echo "true" || echo "false")
HAS_EFFORT=$(echo "$FIRST_SUGGESTION" | jq -e '.effort' > /dev/null && echo "true" || echo "false")

if [ "$HAS_TITLE" = "true" ] && [ "$HAS_IMPACT" = "true" ] && [ "$HAS_EFFORT" = "true" ]; then
    echo -e "${GREEN}✅ Suggestion structure valid${NC}"
    echo "   Sample suggestion:"
    echo "$FIRST_SUGGESTION" | jq '{title, impact, effort}'
else
    echo -e "${RED}❌ Suggestion structure incomplete${NC}"
    exit 1
fi

echo ""
echo "📍 Step 7: Test with another URL (Stripe)..."
RESPONSE2=$(curl -s -X POST http://localhost:7071/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url":"https://stripe.com"}')

PATTERN_COUNT2=$(echo "$RESPONSE2" | jq -r '.patterns | length')
if [ "$PATTERN_COUNT2" -gt 0 ]; then
    echo -e "${GREEN}✅ Stripe analysis successful: $PATTERN_COUNT2 patterns${NC}"
else
    echo -e "${YELLOW}⚠️  Stripe analysis returned no patterns${NC}"
fi

echo ""
echo "===================================="
echo -e "${GREEN}🎉 All Phase 4 backend tests passed!${NC}"
echo ""
echo "📊 Summary:"
echo "   • Backend: Running ✅"
echo "   • Phase 4 API: Working ✅"
echo "   • Pattern Detection: $PATTERN_COUNT patterns ✅"
echo "   • Suggestion Generation: $SUGGESTION_COUNT suggestions ✅"
echo "   • Data Structure: Valid ✅"
echo ""
echo "✅ Backend is ready for frontend integration!"
echo ""
echo "Next steps:"
echo "  1. Continue to Step 2: Update WebsiteAnalyzer service"
echo "  2. Or run comprehensive tests: node test-phase4-patterns.js"
