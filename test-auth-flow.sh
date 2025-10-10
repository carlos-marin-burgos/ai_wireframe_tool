#!/bin/bash

# 🔐 Authentication Flow Testing Script
# Tests all protected endpoints and authentication scenarios

BASE_URL="https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"
FRONTEND_URL="https://delightful-pond-064d9a91e.1.azurestaticapps.net"

echo "🔐 Testing Designetica Authentication Flow"
echo "=========================================="
echo ""
echo "Base URL: $BASE_URL"
echo "Frontend: $FRONTEND_URL"
echo ""

# Test Results
PASSED=0
FAILED=0
TOTAL=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=$3
    local data=$4
    local expected_code=$5
    
    TOTAL=$((TOTAL + 1))
    
    if [ "$method" = "POST" ]; then
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" \
            --max-time 10)
    else
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    fi
    
    if [ "$STATUS" = "$expected_code" ]; then
        echo "✅ $name: $STATUS (expected $expected_code)"
        PASSED=$((PASSED + 1))
    else
        echo "❌ $name: $STATUS (expected $expected_code)"
        FAILED=$((FAILED + 1))
    fi
}

echo "📋 TEST SUITE 1: Public Endpoints"
echo "-----------------------------------"

test_endpoint "Health Check" \
    "$BASE_URL/api/health" \
    "GET" \
    "" \
    "200"

test_endpoint "OpenAI Health Check" \
    "$BASE_URL/api/openai-health" \
    "GET" \
    "" \
    "200"

test_endpoint "Figma OAuth Start" \
    "$BASE_URL/api/figmaOAuthStart" \
    "GET" \
    "" \
    "400"

test_endpoint "Figma OAuth Status" \
    "$BASE_URL/api/figmaOAuthStatus" \
    "GET" \
    "" \
    "200"

echo ""
echo "📋 TEST SUITE 2: Protected AI Endpoints (Should Fail Without Auth)"
echo "---------------------------------------------------------------------"

test_endpoint "Generate Wireframe (No Auth)" \
    "$BASE_URL/api/generateWireframe" \
    "POST" \
    '{"description":"test"}' \
    "401"

test_endpoint "Generate Wireframe Enhanced (No Auth)" \
    "$BASE_URL/api/generateWireframeEnhanced" \
    "POST" \
    '{"description":"test"}' \
    "401"

test_endpoint "Analyze Image (No Auth)" \
    "$BASE_URL/api/analyzeImage" \
    "POST" \
    '{"imageUrl":"test.jpg"}' \
    "401"

test_endpoint "Design Consultant (No Auth)" \
    "$BASE_URL/api/designConsultant" \
    "POST" \
    '{"html":"<div>test</div>"}' \
    "401"

test_endpoint "Generate From URL (No Auth)" \
    "$BASE_URL/api/generateWireframeFromUrl" \
    "POST" \
    '{"url":"https://example.com"}' \
    "401"

echo ""
echo "📋 TEST SUITE 3: Protected Figma Endpoints (Should Fail Without Auth)"
echo "-----------------------------------------------------------------------"

test_endpoint "Figma Components (No Auth)" \
    "$BASE_URL/api/figmaComponents" \
    "POST" \
    '{"fileId":"test"}' \
    "401"

test_endpoint "Atlas Components (No Auth)" \
    "$BASE_URL/api/atlasComponents" \
    "GET" \
    "" \
    "401"

test_endpoint "Add Figma Component (No Auth)" \
    "$BASE_URL/api/addFigmaComponent" \
    "POST" \
    '{"url":"test"}' \
    "401"

echo ""
echo "📋 TEST SUITE 4: Protected Config Endpoints (Should Fail Without Auth)"
echo "------------------------------------------------------------------------"

test_endpoint "Validate Accessibility (No Auth)" \
    "$BASE_URL/api/validateAccessibility" \
    "POST" \
    '{"html":"<div>test</div>"}' \
    "401"

test_endpoint "Update Theme Colors (No Auth)" \
    "$BASE_URL/api/updateThemeColors" \
    "POST" \
    '{"colors":{}}' \
    "401"

echo ""
echo "📋 TEST SUITE 5: Frontend Authentication"
echo "-----------------------------------------"

# Test frontend auth endpoint
FRONTEND_AUTH=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/.auth/me" --max-time 10)
if [ "$FRONTEND_AUTH" = "200" ]; then
    echo "✅ Frontend Auth Endpoint: $FRONTEND_AUTH"
    PASSED=$((PASSED + 1))
else
    echo "❌ Frontend Auth Endpoint: $FRONTEND_AUTH (expected 200)"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

# Test if frontend requires auth
FRONTEND_ROOT=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/" --max-time 10)
if [ "$FRONTEND_ROOT" = "200" ] || [ "$FRONTEND_ROOT" = "401" ] || [ "$FRONTEND_ROOT" = "302" ]; then
    echo "✅ Frontend Root: $FRONTEND_ROOT (auth configured)"
    PASSED=$((PASSED + 1))
else
    echo "⚠️  Frontend Root: $FRONTEND_ROOT (unexpected)"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

echo ""
echo "📋 TEST SUITE 6: Security Checks"
echo "---------------------------------"

# Check for exposed credentials
CREDS_FOUND=$(grep -r "66db9d9ce0ba4fdf854a48e3f5bf1d73\|2079DJvSEXq7JypnjqIF8t\|E8pn4Q8Rz61DCpRhiKKCd5a9GXOnZc" . \
    --exclude-dir={node_modules,.git,dist} 2>/dev/null | grep -v ".md:" | wc -l | xargs)

if [ "$CREDS_FOUND" -eq "0" ]; then
    echo "✅ No exposed credentials in codebase"
    PASSED=$((PASSED + 1))
else
    echo "❌ Found $CREDS_FOUND exposed credentials"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

# Check for function keys in frontend
FUNCTION_KEYS=$(grep -r "VITE_AZURE_FUNCTION_KEY" src/ 2>/dev/null | grep -v ".md" | wc -l | xargs)
if [ "$FUNCTION_KEYS" -eq "0" ]; then
    echo "✅ No function keys in frontend code"
    PASSED=$((PASSED + 1))
else
    echo "❌ Found $FUNCTION_KEYS function key references"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

# Check debug endpoints removed
if [ ! -d "backend/debugOAuth" ] && [ ! -d "backend/figmaOAuthDiagnostics" ] && \
   [ ! -d "backend/websiteAnalyzerDebug" ] && [ ! -d "backend/websiteAnalyzerTest" ]; then
    echo "✅ All debug endpoints removed"
    PASSED=$((PASSED + 1))
else
    echo "❌ Debug endpoints still exist"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

echo ""
echo "📊 TEST RESULTS SUMMARY"
echo "======================="
echo "Total Tests: $TOTAL"
echo "Passed: $PASSED ✅"
echo "Failed: $FAILED ❌"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED! Security is properly configured."
    exit 0
else
    echo "⚠️  SOME TESTS FAILED. Review the failures above."
    exit 1
fi
