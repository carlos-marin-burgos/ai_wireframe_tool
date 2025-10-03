#!/bin/bash

# 🧪 Production Parity Test for Figma Connection Fix
# This script helps you test if your Figma connection fix will work in production

set -e

echo "🔍 Production Parity Test Suite"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0
WARNINGS=0

# Function to print test results
pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((PASSED++))
}

fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    ((WARNINGS++))
}

info() {
    echo -e "${BLUE}ℹ️  INFO${NC}: $1"
}

echo "📋 Phase 1: Configuration Validation"
echo "======================================"

# Test 1: Check if production environment variables are set
if [ -f ".env.production" ]; then
    pass "Production environment file exists"
    
    if grep -q "VITE_API_ENDPOINT" .env.production; then
        pass "Production API endpoint configured"
    else
        fail "Production API endpoint not found in .env.production"
    fi
    
    if grep -q "azurewebsites.net" .env.production; then
        pass "Production endpoint points to Azure"
    else
        warn "Production endpoint might not be pointing to Azure Functions"
    fi
else
    fail "No .env.production file found"
fi

# Test 2: Check if backend is currently running
echo ""
echo "🔌 Phase 2: Backend Availability"
echo "================================"

if curl -s -f -m 5 http://localhost:7071/api/health > /dev/null 2>&1; then
    pass "Local backend is running on port 7071"
    
    # Check if it has OpenAI configured
    if curl -s -m 5 http://localhost:7071/api/health | grep -q "openai\|ai"; then
        pass "Backend has AI capabilities"
    else
        warn "Backend health endpoint doesn't mention AI - might not be fully configured"
    fi
else
    fail "Local backend not running on port 7071 - start it with './start-backend.sh'"
fi

# Test 3: Check production backend
echo ""
PROD_BACKEND=$(grep VITE_BACKEND_BASE_URL .env.production 2>/dev/null | cut -d'=' -f2)

if [ -n "$PROD_BACKEND" ]; then
    info "Testing production backend: $PROD_BACKEND"
    
    if curl -s -f -m 30 "$PROD_BACKEND/api/health" > /dev/null 2>&1; then
        pass "Production backend is reachable"
        
        # Check response time (cold start detection)
        START_TIME=$(date +%s%N)
        curl -s -m 30 "$PROD_BACKEND/api/health" > /dev/null
        END_TIME=$(date +%s%N)
        RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
        
        if [ $RESPONSE_TIME -lt 3000 ]; then
            pass "Production backend is warm (${RESPONSE_TIME}ms)"
        elif [ $RESPONSE_TIME -lt 10000 ]; then
            warn "Production backend might be cold starting (${RESPONSE_TIME}ms)"
        else
            warn "Production backend very slow (${RESPONSE_TIME}ms) - possible cold start"
        fi
    else
        fail "Production backend not reachable or very slow"
    fi
fi

# Test 4: Check Figma OAuth configuration
echo ""
echo "🔐 Phase 3: Figma OAuth Configuration"
echo "====================================="

if grep -r "figmaoauthcallback\|figmaOAuthCallback" src/ backend/ > /dev/null 2>&1; then
    pass "Figma OAuth callback endpoint exists in code"
else
    fail "Cannot find Figma OAuth callback endpoint in code"
fi

# Check if session management code exists
if grep -r "FIGMA_TRUSTED_SESSION_KEY\|figma_oauth_session" src/ > /dev/null 2>&1; then
    pass "Figma session management code found"
else
    fail "Figma session management code not found"
fi

# Check if handleClose preserves session
if grep -A 10 "handleClose.*=.*useCallback" src/components/FigmaIntegrationModal.tsx 2>/dev/null | grep -q "extendTrustedSession\|preserve\|persist"; then
    pass "handleClose appears to preserve session"
else
    fail "handleClose might not preserve session - check FigmaIntegrationModal.tsx"
fi

# Test 5: Build and serve production locally
echo ""
echo "🏗️  Phase 4: Production Build Test"
echo "=================================="

info "Building production version..."
if npm run build > /dev/null 2>&1; then
    pass "Production build successful"
    
    # Check if dist folder exists
    if [ -d "dist" ]; then
        pass "dist/ folder created"
        
        # Check if staticwebapp.config.json is included
        if [ -f "dist/staticwebapp.config.json" ] || [ -f "staticwebapp.config.json" ]; then
            pass "Static Web App configuration found"
        else
            warn "staticwebapp.config.json not found - Azure routing might not work"
        fi
    else
        fail "dist/ folder not created"
    fi
else
    fail "Production build failed - check npm run build output"
fi

# Test 6: Check for common production issues
echo ""
echo "🔍 Phase 5: Common Production Issues"
echo "===================================="

# Check for hardcoded localhost URLs
if grep -r "localhost:7071\|localhost:5173" src/ --include="*.tsx" --include="*.ts" | grep -v "vite.config\|api.ts\|test\|\.md" > /dev/null 2>&1; then
    warn "Found hardcoded localhost URLs in source files - might cause production issues"
    grep -r "localhost:7071\|localhost:5173" src/ --include="*.tsx" --include="*.ts" | grep -v "vite.config\|api.ts\|test\|\.md" | head -3
else
    pass "No hardcoded localhost URLs in source files"
fi

# Check for console.log in production code
LOG_COUNT=$(grep -r "console\.log" src/ --include="*.tsx" --include="*.ts" | wc -l | tr -d ' ')
if [ "$LOG_COUNT" -gt 50 ]; then
    warn "Many console.log statements found ($LOG_COUNT) - consider removing for production"
else
    pass "Reasonable amount of console.log statements ($LOG_COUNT)"
fi

# Check if error handling exists for API calls
if grep -r "try.*catch\|\.catch(" src/services/ src/config/ > /dev/null 2>&1; then
    pass "Error handling found in services"
else
    warn "Limited error handling in services - might cause production issues"
fi

# Test 7: Session persistence test
echo ""
echo "💾 Phase 6: Session Persistence Simulation"
echo "=========================================="

info "Simulating session persistence test..."

# Create test HTML file
cat > /tmp/figma-session-test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Figma Session Test</title>
</head>
<body>
    <h1>Figma Session Persistence Test</h1>
    <div id="results"></div>
    <script>
        const FIGMA_TRUSTED_SESSION_KEY = 'figma_oauth_session';
        const results = document.getElementById('results');
        
        // Test 1: Can we write to localStorage?
        try {
            localStorage.setItem('test', 'value');
            localStorage.removeItem('test');
            results.innerHTML += '<p>✅ localStorage is available</p>';
        } catch (e) {
            results.innerHTML += '<p>❌ localStorage not available: ' + e.message + '</p>';
        }
        
        // Test 2: Simulate session creation
        const session = {
            source: 'oauth',
            connectedAt: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
            user: { email: 'test@example.com' }
        };
        
        try {
            localStorage.setItem(FIGMA_TRUSTED_SESSION_KEY, JSON.stringify(session));
            results.innerHTML += '<p>✅ Can write Figma session</p>';
        } catch (e) {
            results.innerHTML += '<p>❌ Cannot write Figma session: ' + e.message + '</p>';
        }
        
        // Test 3: Read session back
        try {
            const stored = localStorage.getItem(FIGMA_TRUSTED_SESSION_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.source === 'oauth') {
                    results.innerHTML += '<p>✅ Can read Figma session correctly</p>';
                } else {
                    results.innerHTML += '<p>❌ Session data corrupted</p>';
                }
            } else {
                results.innerHTML += '<p>❌ Cannot read Figma session</p>';
            }
        } catch (e) {
            results.innerHTML += '<p>❌ Error reading session: ' + e.message + '</p>';
        }
        
        // Test 4: Session expiry
        const expiryDate = new Date(session.expiresAt);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry === 7) {
            results.innerHTML += '<p>✅ Session expiry set correctly (7 days)</p>';
        } else {
            results.innerHTML += '<p>⚠️ Session expiry might be wrong: ' + daysUntilExpiry + ' days</p>';
        }
        
        // Cleanup
        localStorage.removeItem(FIGMA_TRUSTED_SESSION_KEY);
        results.innerHTML += '<p>✅ Cleanup successful</p>';
    </script>
</body>
</html>
EOF

if command -v open &> /dev/null; then
    open /tmp/figma-session-test.html
    pass "Opened session persistence test in browser"
else
    info "Session test HTML created at /tmp/figma-session-test.html - open it manually"
fi

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical tests passed!${NC}"
    echo ""
    echo "✅ Your Figma connection fix appears ready for production"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test production build locally: npx serve -s dist -l 8080"
    echo "2. Verify Figma OAuth app has both callback URLs:"
    echo "   - http://localhost:5173/api/figmaoauthcallback"
    echo "   - https://delightful-pond-064d9a91e.1.azurestaticapps.net/api/figmaoauthcallback"
    echo "3. Deploy to production: git push origin main"
    echo "4. Test immediately after deployment"
    echo "5. Test again after 30 minutes (cold start scenario)"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed - review before deploying${NC}"
    echo ""
    echo "❌ Fix the failed tests before deploying to production"
    echo ""
    exit 1
fi
