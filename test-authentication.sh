#!/bin/bash

# Authentication Testing Script for Designetica
# This script helps verify the Microsoft authentication is working

echo "🔐 Testing Designetica Authentication"
echo "======================================"
echo ""

APP_URL="https://delightful-pond-064d9a91e.1.azurestaticapps.net"

# Test 1: Main page (should require authentication)
echo "1️⃣  Testing main page (should return 401 Unauthorized)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/")
if [ "$RESPONSE" = "401" ]; then
    echo "   ✅ PASS: Main page requires authentication (401)"
else
    echo "   ❌ FAIL: Expected 401, got $RESPONSE"
fi
echo ""

# Test 2: Auth endpoint (should be accessible)
echo "2️⃣  Testing auth endpoint (should return 200)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/.auth/me")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS: Auth endpoint accessible (200)"
else
    echo "   ❌ FAIL: Expected 200, got $RESPONSE"
fi
echo ""

# Test 3: Static assets (should be accessible without auth)
echo "3️⃣  Testing static asset access (checking for CSS/JS)..."
# Try to get the index.html and extract asset references
ASSETS=$(curl -s "$APP_URL/" 2>&1 | grep -o 'src="[^"]*\.js' | head -1 | sed 's/src="//;s/\.js/.js/')
if [ ! -z "$ASSETS" ]; then
    ASSET_URL="$APP_URL$ASSETS"
    echo "   Testing asset: $ASSET_URL"
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$ASSET_URL")
    if [ "$RESPONSE" = "200" ]; then
        echo "   ✅ PASS: Static assets accessible without auth (200)"
    else
        echo "   ⚠️  Asset returned: $RESPONSE (may need anonymous access)"
    fi
else
    echo "   ⏭️  SKIP: Could not extract asset URL from 401 page"
fi
echo ""

# Test 4: Verify authentication settings
echo "4️⃣  Verifying Azure authentication configuration..."
AUTH_CONFIG=$(az staticwebapp appsettings list \
    --name swa-designetica-5gwyjxbwvr4s6 \
    --resource-group rg-designetica-prod \
    --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    CLIENT_ID=$(echo "$AUTH_CONFIG" | python3 -c "import sys, json; print(json.load(sys.stdin).get('properties', {}).get('AZURE_CLIENT_ID', 'NOT SET'))")
    TENANT_ID=$(echo "$AUTH_CONFIG" | python3 -c "import sys, json; print(json.load(sys.stdin).get('properties', {}).get('AZURE_TENANT_ID', 'NOT SET'))")
    SECRET_SET=$(echo "$AUTH_CONFIG" | python3 -c "import sys, json; print('YES' if json.load(sys.stdin).get('properties', {}).get('AZURE_CLIENT_SECRET') else 'NO')")
    
    echo "   Client ID: $CLIENT_ID"
    echo "   Tenant ID: $TENANT_ID"
    echo "   Secret Configured: $SECRET_SET"
    
    if [ "$CLIENT_ID" != "NOT SET" ] && [ "$TENANT_ID" != "NOT SET" ] && [ "$SECRET_SET" = "YES" ]; then
        echo "   ✅ PASS: Authentication settings configured correctly"
    else
        echo "   ❌ FAIL: Authentication settings incomplete"
    fi
else
    echo "   ⚠️  Could not verify settings (check Azure CLI login)"
fi
echo ""

# Test 5: Check staticwebapp.config.json
echo "5️⃣  Checking staticwebapp.config.json..."
if [ -f "staticwebapp.config.json" ]; then
    # Check for auth configuration
    HAS_AUTH=$(grep -c "azureActiveDirectory" staticwebapp.config.json)
    HAS_ANONYMOUS_ROUTES=$(grep -c '"allowedRoles": \["anonymous"\]' staticwebapp.config.json)
    HAS_AUTH_ROUTES=$(grep -c '"allowedRoles": \["authenticated"\]' staticwebapp.config.json)
    
    echo "   Azure AD Config: $([ $HAS_AUTH -gt 0 ] && echo '✅ Found' || echo '❌ Missing')"
    echo "   Anonymous Routes: $HAS_ANONYMOUS_ROUTES"
    echo "   Authenticated Routes: $HAS_AUTH_ROUTES"
    
    if [ $HAS_AUTH -gt 0 ] && [ $HAS_ANONYMOUS_ROUTES -gt 0 ] && [ $HAS_AUTH_ROUTES -gt 0 ]; then
        echo "   ✅ PASS: Configuration looks correct"
    else
        echo "   ⚠️  Configuration may need review"
    fi
else
    echo "   ❌ FAIL: staticwebapp.config.json not found"
fi
echo ""

# Summary
echo "======================================"
echo "🎯 SUMMARY"
echo "======================================"
echo ""
echo "Your app should now:"
echo "  1. Redirect unauthenticated users to Microsoft login"
echo "  2. Allow Microsoft employees to access after sign-in"
echo "  3. Allow static assets to load for the login page"
echo ""
echo "🧪 MANUAL TEST:"
echo "  1. Open in incognito/private window:"
echo "     $APP_URL"
echo ""
echo "  2. You should be redirected to:"
echo "     https://login.microsoftonline.com/..."
echo ""
echo "  3. Sign in with your @microsoft.com account"
echo ""
echo "  4. After successful authentication, you should see the app"
echo ""
echo "📋 If you get 401 errors after signing in:"
echo "  - Clear browser cache/cookies"
echo "  - Try different browser"
echo "  - Check Azure AD app permissions"
echo ""
