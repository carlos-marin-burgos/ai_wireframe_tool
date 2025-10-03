# 🔍 Localhost vs Production: Critical Differences

## Overview

**You are CORRECT** - localhost and production can behave differently. This document explains the key differences and how to test for production parity.

---

## 🏗️ Architecture Differences

### **Localhost (Development)**

```
Browser (localhost:5173)
  ↓ Vite Proxy
Azure Functions (localhost:7071)
  ↓ Direct API calls
OpenAI / Figma APIs
```

**Characteristics:**

- ✅ Instant hot reload
- ✅ Detailed error messages
- ✅ No cold starts
- ✅ Direct debugging
- ❌ Different security context
- ❌ Different domain for OAuth

### **Production (Azure Static Web Apps)**

```
Browser (*.azurestaticapps.net)
  ↓ Azure CDN
Static Web App (Frontend)
  ↓ Built-in API proxy
Azure Function App (Backend)
  ↓ Cold starts possible
OpenAI / Figma APIs
```

**Characteristics:**

- ✅ Production security
- ✅ Global CDN distribution
- ✅ Same domain for OAuth
- ❌ Cold starts (5-30s delay)
- ❌ Limited error visibility
- ❌ Caching can hide issues

---

## 🔐 Session Storage & OAuth

### **Critical Issue: Figma Connection Persistence**

#### Localhost Behavior

```javascript
// Domain: http://localhost:5173
localStorage.getItem("figma_oauth_session");
// ✅ Works - session persists across page reloads
// ✅ OAuth callback: http://localhost:5173/api/figmaoauthcallback
```

#### Production Behavior

```javascript
// Domain: https://delightful-pond-064d9a91e.1.azurestaticapps.net
localStorage.getItem("figma_oauth_session");
// ⚠️ DIFFERENT localStorage - must re-authenticate!
// ⚠️ OAuth callback: https://*.azurestaticapps.net/api/figmaoauthcallback
```

### **Why Sessions Act Differently**

1. **Different Domains = Different localStorage**

   - Browsers isolate localStorage by domain
   - Your localhost session won't exist in production
   - Users must reconnect Figma after deployment

2. **OAuth Redirect URLs**

   - Figma OAuth app must whitelist BOTH:
     - Development: `http://localhost:5173/api/figmaoauthcallback`
     - Production: `https://delightful-pond-064d9a91e.1.azurestaticapps.net/api/figmaoauthcallback`

3. **Security Context**
   - Localhost: `http://` (insecure context)
   - Production: `https://` (secure context)
   - Some browser APIs behave differently

---

## ⚡ Performance Differences

### **Cold Starts in Production**

**What is a Cold Start?**

- Azure Functions "sleep" after 20 minutes of inactivity
- First request after sleep takes 5-30 seconds
- User might see "connection lost" during cold start

**How to Test:**

```bash
# Test production endpoint directly
curl -X POST https://func-original-app-pgno4orkguix6.azurewebsites.net/api/generate-wireframe \
  -H "Content-Type: application/json" \
  -d '{"description":"test","fastMode":true}'

# First call might be slow (cold start)
# Second call should be fast (warm)
```

**Mitigation in Code:**

```typescript
// src/config/api.ts already handles this with extended timeouts
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  timeout = 90000, // 90 seconds to handle cold starts
  maxRetries = 2
) => {
  // ... retry logic handles cold starts
};
```

### **Caching Differences**

**Localhost:**

```typescript
// No caching - always fresh
server: {
  proxy: {
    "/api": {
      target: "http://localhost:7071",
      changeOrigin: true,
    }
  }
}
```

**Production:**

```json
// staticwebapp.config.json
{
  "routes": [
    {
      "route": "/",
      "headers": {
        "cache-control": "no-cache, no-store, must-revalidate"
      }
    }
  ]
}
```

- Static Web App CDN caching
- Function App response caching
- Browser caching policies

---

## 🧪 Testing for Production Parity

### **1. Test Production Build Locally**

Build and serve the production version locally:

```bash
# Build for production
npm run build

# Serve production build locally
npx serve -s dist -l 8080

# Test at http://localhost:8080
```

**What to test:**

- ✅ Figma OAuth flow
- ✅ Session persistence
- ✅ API calls timing
- ✅ Error handling

### **2. Test Against Production Backend**

Point your local frontend to production backend:

```bash
# Create .env.local
cat > .env.local << EOF
VITE_API_ENDPOINT=https://func-original-app-pgno4orkguix6.azurewebsites.net/api
VITE_BACKEND_BASE_URL=https://func-original-app-pgno4orkguix6.azurewebsites.net
VITE_ENV=production-test
EOF

# Start dev server
npm run dev

# Now you're using production backend with local frontend
```

**Test:**

- ✅ Cold start handling
- ✅ Production rate limits
- ✅ Production API keys
- ⚠️ OAuth will still use localhost URLs

### **3. Test Production App with DevTools**

```bash
# Open production app
open https://delightful-pond-064d9a91e.1.azurestaticapps.net

# In Chrome DevTools:
# 1. Application > Storage > Local Storage
#    - Check figma_oauth_session
#    - Check figma_oauth_tokens
# 2. Network > Filter: /api/
#    - Monitor cold starts (slow first request)
#    - Check response times
# 3. Console > Check for errors
```

---

## 🐛 Common Production-Only Issues

### **Issue 1: Figma Connection Lost After Modal Close**

**Symptoms:**

- ✅ Works in localhost
- ❌ Fails in production after closing modal
- localStorage shows session exists but connection fails

**Root Causes:**

1. Cold start delays make connection check timeout
2. CORS issues with production domain
3. Cache serving stale connection status

**Debug:**

```javascript
// Add to browser console in production
console.log("🔍 Debugging Figma session:");
console.log("Session:", localStorage.getItem("figma_oauth_session"));
console.log("Tokens:", localStorage.getItem("figma_oauth_tokens"));
console.log("Domain:", window.location.hostname);

// Test backend directly
fetch(
  "https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaoauthstatus"
)
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

### **Issue 2: API Calls Work Locally But Not in Production**

**Possible Causes:**

- Missing environment variables in Azure Function App
- Different OpenAI keys with different rate limits
- CORS configuration issues
- Network routing differences

**Fix:**

```bash
# Check Azure Function App environment variables
az functionapp config appsettings list \
  --name func-original-app-pgno4orkguix6 \
  --resource-group rg-designetica-prod

# Compare with local .env
diff <(cat backend/.env | sort) \
     <(az functionapp config appsettings list \
        --name func-original-app-pgno4orkguix6 \
        --resource-group rg-designetica-prod \
        --output tsv | awk '{print $2"="$3}' | sort)
```

### **Issue 3: OAuth Redirect Fails**

**Symptoms:**

- OAuth popup opens but doesn't redirect back
- "Invalid redirect URI" error

**Fix:**

```javascript
// Verify Figma OAuth app configuration
// Must include BOTH:
// - http://localhost:5173/api/figmaoauthcallback
// - https://delightful-pond-064d9a91e.1.azurestaticapps.net/api/figmaoauthcallback

// In src/config/api.ts, ensure correct callback URL:
export const getApiUrl = (endpoint: string, customBaseUrl?: string) => {
  const baseUrl = customBaseUrl || API_CONFIG.BASE_URL;
  console.log("🔗 OAuth Callback will use:", `${baseUrl}${endpoint}`);
  return `${baseUrl}${endpoint}`;
};
```

---

## ✅ Production Parity Checklist

Before deploying a fix (like Figma connection persistence):

### **Phase 1: Local Testing**

- [ ] Test in development mode (`npm run dev`)
- [ ] Test production build locally (`npm run build && npx serve -s dist`)
- [ ] Test with production backend locally (`.env.local` override)
- [ ] Test cold start simulation (add artificial delay)

### **Phase 2: Pre-Deployment**

- [ ] Verify environment variables match (local vs Azure)
- [ ] Check OAuth redirect URLs are whitelisted
- [ ] Review `staticwebapp.config.json` for cache headers
- [ ] Test with real production API keys (if different from dev)

### **Phase 3: Post-Deployment**

- [ ] Test immediately after deployment (cache is fresh)
- [ ] Test after 30 minutes (cold start scenario)
- [ ] Test session persistence across multiple days
- [ ] Monitor Application Insights for errors

### **Phase 4: User Acceptance**

- [ ] Have multiple users test from different networks
- [ ] Test on different browsers (Chrome, Safari, Edge, Firefox)
- [ ] Test on mobile devices
- [ ] Test with ad blockers / privacy extensions enabled

---

## 🔧 Recommended Testing Workflow

### **For Your Figma Connection Fix:**

```bash
# 1. Test locally first
npm run dev
# ✅ Connect to Figma
# ✅ Close modal
# ✅ Reopen modal - should still be connected

# 2. Test production build locally
npm run build
npx serve -s dist -l 8080
# ✅ Connect to Figma (will use localhost backend)
# ✅ Close modal
# ✅ Reopen modal - should still be connected

# 3. Deploy to staging/preview (if available)
git push origin feature/figma-connection-fix
# Wait for Azure Static Web Apps preview deployment
# ✅ Test on preview URL
# ✅ Monitor for 1 hour to catch cold start issues

# 4. Deploy to production
git push origin main
# ✅ Test immediately
# ✅ Test after 30 minutes (cold start)
# ✅ Monitor Application Insights for 24 hours
```

---

## 📊 Monitoring Production Behavior

### **Application Insights Queries**

```kusto
// Check Figma OAuth success rate
requests
| where name contains "figmaoauth"
| summarize
    Total = count(),
    Success = countif(success == true),
    Failed = countif(success == false),
    AvgDuration = avg(duration)
  by name
| extend SuccessRate = (Success * 100.0) / Total

// Check for cold starts
requests
| where name contains "api"
| where duration > 5000 // > 5 seconds
| project timestamp, name, duration, resultCode
| order by timestamp desc

// Check localStorage issues (custom events)
customEvents
| where name contains "figma" or name contains "session"
| project timestamp, name, customDimensions
| order by timestamp desc
```

### **Real-Time Monitoring**

Add telemetry to track production behavior:

```typescript
// In FigmaIntegrationModal.tsx
const handleClose = useCallback(() => {
  // Log to Application Insights
  if (typeof window !== "undefined" && (window as any).appInsights) {
    (window as any).appInsights.trackEvent({
      name: "FigmaModalClosed",
      properties: {
        wasConnected: isConnected,
        sessionExists: !!readTrustedSession(),
        environment: import.meta.env.MODE,
        domain: window.location.hostname,
      },
    });
  }

  // ... rest of close logic
}, [isConnected, onClose]);
```

---

## 🎯 Key Takeaways

1. **Localhost ≠ Production** - Always test your fix in a production-like environment
2. **Session Storage is Domain-Specific** - Users must re-auth when you deploy
3. **Cold Starts Are Real** - Production has delays localhost doesn't
4. **OAuth Needs Both URLs** - Whitelist both localhost and production callbacks
5. **Monitor After Deployment** - Production issues often appear hours later

---

## 🚀 Next Steps for Your Figma Fix

1. ✅ Your fix looks good for localhost
2. ⚠️ Need to verify it handles production cold starts
3. ⚠️ Need to ensure Figma OAuth app has production callback URL
4. ⚠️ Need to add telemetry for production monitoring
5. ✅ Documentation (this file) is critical for future debugging

**Recommended:**

```bash
# Add cold start simulation to your tests
# In FigmaIntegrationModal.tsx, add a test mode:

const simulateColdStart = import.meta.env.MODE === 'test-coldstart';

if (simulateColdStart) {
    await new Promise(resolve => setTimeout(resolve, 15000)); // 15s delay
}
```

Then test with:

```bash
VITE_MODE=test-coldstart npm run dev
```
