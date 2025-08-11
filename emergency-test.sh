#!/bin/bash

# Emergency Backend Test Script
echo "🚨 EMERGENCY BACKEND DIAGNOSIS"
echo "================================"

echo ""
echo "1. Testing Backend Health:"
echo "   URL: https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/health"

# Test with timeout
timeout 10s curl -s "https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/health" > /tmp/health_test.json
if [ $? -eq 0 ]; then
    echo "   ✅ Backend responded!"
    echo "   Response:"
    cat /tmp/health_test.json | head -5
else
    echo "   ❌ Backend not responding (timeout or error)"
fi

echo ""
echo "2. Testing Wireframe Generation:"
echo "   URL: https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/generate-html-wireframe"

# Test wireframe generation with timeout
timeout 15s curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"description":"simple test button","fastMode":true}' \
  "https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/generate-html-wireframe" > /tmp/wireframe_test.json

if [ $? -eq 0 ]; then
    echo "   ✅ Wireframe API responded!"
    echo "   Response size: $(wc -c < /tmp/wireframe_test.json) bytes"
    echo "   Contains HTML: $(grep -o 'html' /tmp/wireframe_test.json | wc -l) occurrences"
else
    echo "   ❌ Wireframe API not responding (timeout or error)"
fi

echo ""
echo "3. Frontend Build Check:"
if [ -f "dist/assets/main-G05flp-d.js" ]; then
    echo "   ✅ Frontend build exists"
    echo "   Backend URL in build: $(grep -o 'func-designetica-vjib6nx2wh4a4.azurewebsites.net' dist/assets/main-*.js | head -1)"
else
    echo "   ❌ Frontend build missing"
fi

echo ""
echo "4. Production Site Test:"
echo "   Frontend: https://brave-island-04ba9f70f.2.azurestaticapps.net"
timeout 10s curl -s -w "Status: %{http_code}\n" "https://brave-island-04ba9f70f.2.azurestaticapps.net" > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend accessible"
else
    echo "   ❌ Frontend not accessible"
fi

echo ""
echo "🔧 RECOMMENDED ACTIONS:"
echo "   1. If backend fails: npm run deploy (full redeploy)"
echo "   2. If frontend fails: Check Azure portal for static web app status"  
echo "   3. If both work but wireframes fail: Check browser console for CORS errors"

# Cleanup
rm -f /tmp/health_test.json /tmp/wireframe_test.json
