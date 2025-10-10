#!/bin/bash

echo "🔐 Security Testing - Designetica"
echo "=================================="
echo ""

echo "Test 1: Public health endpoint (should return 200)"
curl -s -o /dev/null -w "✓ Health: %{http_code}\n" https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/health

echo ""
echo "Test 2: Protected endpoint without auth (should return 401/403)"
curl -s -X POST https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/generateWireframe \
  -H "Content-Type: application/json" \
  -d '{"description":"test"}' \
  -o /dev/null -w "✓ Protected API: %{http_code}\n"

echo ""
echo "Test 3: Check for exposed credentials in code"
FOUND=$(grep -r "66db9d9ce0ba4fdf854a48e3f5bf1d73\|2079DJvSEXq7JypnjqIF8t\|E8pn4Q8Rz61DCpRhiKKCd5a9GXOnZc" . --exclude-dir={node_modules,.git,dist} 2>/dev/null | grep -v ".md:" | wc -l | xargs)
if [ "$FOUND" -eq "0" ]; then
    echo "✓ No exposed credentials found"
else
    echo "⚠ Found $FOUND instances of exposed credentials"
fi

echo ""
echo "Test 4: Verify debug endpoints removed"
if [ ! -d "backend/debugOAuth" ] && [ ! -d "backend/figmaOAuthDiagnostics" ]; then
    echo "✓ Debug endpoints removed"
else
    echo "⚠ Debug endpoints still exist"
fi

echo ""
echo "Test 5: Frontend - No function keys"
if ! grep -r "VITE_AZURE_FUNCTION_KEY" src/ 2>/dev/null | grep -v ".md"; then
    echo "✓ No function keys in frontend code"
else
    echo "⚠ Function keys found in frontend"
fi

echo ""
echo "✅ Security tests complete!"
