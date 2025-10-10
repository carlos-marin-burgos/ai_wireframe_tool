#!/bin/bash

# Security Testing Script for Designetica
# Tests authentication on all protected endpoints

echo "🔐 Designetica Security Testing Script"
echo "======================================"
echo ""

# Configuration
FUNCTION_APP_URL="https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net"
STATIC_WEB_APP_URL="https://delightful-pond-064d9a91e.1.azurestaticapps.net"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test an endpoint without authentication
test_endpoint_no_auth() {
    local endpoint=$1
    local method=$2
    local description=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $description... "
    
    # Make request without authentication
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$FUNCTION_APP_URL/api/$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d '{"test": "data"}' \
            "$FUNCTION_APP_URL/api/$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    # Check if we get 403 (expected for protected endpoints)
    if [ "$status_code" = "403" ]; then
        echo -e "${GREEN}✓ PASS${NC} (403 Forbidden - Authentication required)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    elif [ "$status_code" = "200" ]; then
        echo -e "${RED}✗ FAIL${NC} (200 OK - Endpoint is NOT protected!)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "  Response: $body"
    else
        echo -e "${YELLOW}⚠ UNEXPECTED${NC} (Status: $status_code)"
        echo "  Response: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to test public endpoints
test_public_endpoint() {
    local endpoint=$1
    local method=$2
    local description=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $description... "
    
    # Make request without authentication
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$FUNCTION_APP_URL/api/$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d '{"test": "data"}' \
            "$FUNCTION_APP_URL/api/$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    # Check if we get 200 (expected for public endpoints)
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✓ PASS${NC} (200 OK - Public endpoint accessible)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Status: $status_code - Expected 200)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "  Response: $body"
    fi
}

echo -e "${BLUE}=== Testing Protected Endpoints (Should Return 403) ===${NC}"
echo ""

# Test AI-Powered Endpoints
echo -e "${BLUE}AI-Powered Endpoints:${NC}"
test_endpoint_no_auth "generateWireframe" "POST" "generateWireframe"
test_endpoint_no_auth "generateWireframeEnhanced" "POST" "generateWireframeEnhanced"
test_endpoint_no_auth "analyzeImage" "POST" "analyzeImage"
test_endpoint_no_auth "generateWireframeFromUrl" "POST" "generateWireframeFromUrl"
test_endpoint_no_auth "designConsultant" "POST" "designConsultant"
test_endpoint_no_auth "websiteAnalyzer" "POST" "websiteAnalyzer"
test_endpoint_no_auth "analyzeUIImage" "POST" "analyzeUIImage"
test_endpoint_no_auth "generateSuggestions" "POST" "generateSuggestions"
test_endpoint_no_auth "directImageToWireframe" "POST" "directImageToWireframe"
echo ""

# Test Figma Endpoints
echo -e "${BLUE}Figma & Design Asset Endpoints:${NC}"
test_endpoint_no_auth "figmaComponents" "GET" "figmaComponents"
test_endpoint_no_auth "figmaNodeImporter" "POST" "figmaNodeImporter"
test_endpoint_no_auth "figmaImport" "POST" "figmaImport"
test_endpoint_no_auth "addFigmaComponent" "POST" "addFigmaComponent"
test_endpoint_no_auth "atlasComponents" "GET" "atlasComponents"
echo ""

# Test Data & Configuration Endpoints
echo -e "${BLUE}Data & Configuration Endpoints:${NC}"
test_endpoint_no_auth "validateAccessibility" "POST" "validateAccessibility"
test_endpoint_no_auth "updateThemeColors" "POST" "updateThemeColors"
test_endpoint_no_auth "get-template" "POST" "get-template"
echo ""

echo -e "${BLUE}=== Testing Public Endpoints (Should Return 200) ===${NC}"
echo ""

# Test Public Endpoints
test_public_endpoint "health" "GET" "health"
test_public_endpoint "openai-health" "GET" "openai-health"
echo ""

# Summary
echo "======================================"
echo -e "${BLUE}Test Summary:${NC}"
echo "  Total Tests: $TOTAL_TESTS"
echo -e "  ${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "  ${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Security is properly configured.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Review the output above.${NC}"
    echo ""
    echo "Common issues:"
    echo "  - If protected endpoints return 200: Authentication not properly configured"
    echo "  - If public endpoints return 403: Endpoints may have been accidentally protected"
    echo "  - Check SECURITY_TESTING_PLAN.md for debugging steps"
    exit 1
fi
