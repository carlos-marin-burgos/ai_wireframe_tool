# Production Deployment Guide

## ⚠️ Critical Production Issues Fixed

This guide documents the production connectivity issues and how to prevent them.

### Issues That Were Breaking Production

1. **Hardcoded Function App URLs** - Bypassed Static Web App routing
2. **Wrong Development Ports** - Config showed 7071 but backend ran on 7072
3. **Mixed Environment Logic** - Unreliable production detection
4. **No Environment Variables** - Hardcoded values instead of flexible config

## ✅ Fixes Applied

### 1. Corrected Port Configuration

```typescript
// BEFORE (BROKEN)
development: {
  primary: 7071, // ❌ Wrong port
}

// AFTER (FIXED)
development: {
  primary: 7072, // ✅ Matches actual backend
}
```

### 2. Fixed Production API Routing

```typescript
// BEFORE (BROKEN)
BASE_URL: isProduction
  ? FUNCTION_APP_URL // ❌ Hardcoded direct Function App URL

// AFTER (FIXED)
BASE_URL: isProduction
  ? "" // ✅ Use Static Web App automatic /api/* routing
```

### 3. Improved Environment Detection

```typescript
// BEFORE (BROKEN)
const isProduction = window.location.hostname === PRODUCTION_DOMAIN;

// AFTER (FIXED)
const isProduction = !isDevelopment && !isLocalhost;
```

## 🛡️ How Azure Static Web Apps Work

### Automatic API Routing

- Static Web Apps automatically proxy `/api/*` requests to the associated Function App
- **Don't hardcode Function App URLs** - let Azure handle the routing
- Use relative URLs (`/api/endpoint`) in production

### Environment Variables

Set these in your Azure Static Web App configuration:

```bash
# Optional - for custom backend URLs
VITE_API_BASE_URL=""  # Leave empty to use automatic routing

# For development override
VITE_BACKEND_BASE_URL=""  # Only needed if using non-standard setup
```

## 🚨 What Could Still Go Wrong

### 1. CORS Issues

If you bypass Static Web App routing, you may hit CORS restrictions.

### 2. Authentication

Static Web Apps handle auth differently than direct Function App calls.

### 3. Port Changes

If backend port changes, update both:

- `vite.config.ts` proxy configuration
- `src/config/api.ts` PORTS configuration

## 🔍 How to Debug Production Issues

### 1. Check Browser Network Tab

- API calls should go to `/api/endpoint`, not `https://func-...`
- Look for 404s, CORS errors, or timeout issues

### 2. Test API Health

```bash
# Should work in production
curl https://your-site.azurestaticapps.net/api/health

# Should NOT be needed - avoid direct Function App calls
curl https://func-xyz.azurewebsites.net/api/health
```

### 3. Check Static Web App Configuration

Ensure `staticwebapp.config.json` doesn't block API routes:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ]
}
```

## 📋 Deployment Checklist

Before deploying:

- [ ] ✅ Port configurations match actual backend ports
- [ ] ✅ No hardcoded Function App URLs in production
- [ ] ✅ Environment variables configured properly
- [ ] ✅ API routes use relative paths (`/api/*`)
- [ ] ✅ Test API health endpoint works
- [ ] ✅ Test actual AI wireframe generation

### Testing Commands

```bash
# Test development
curl http://localhost:5173/api/health
curl -X POST http://localhost:5173/api/generate-wireframe \
  -H "Content-Type: application/json" \
  -d '{"description":"test","theme":"microsoft"}'

# Test production
curl https://your-site.azurestaticapps.net/api/health
curl -X POST https://your-site.azurestaticapps.net/api/generate-wireframe \
  -H "Content-Type: application/json" \
  -d '{"description":"test","theme":"microsoft"}'
```

## 🔄 If Issues Persist

1. **Check Azure Function App logs** in Azure Portal
2. **Verify Static Web App is linked to Function App** in Azure Portal
3. **Test Function App directly** (temporarily) to isolate issues
4. **Check Application Insights** for error traces

## 🎯 Key Takeaway

**Always use Azure Static Web App's built-in API routing (`/api/*`) instead of hardcoding Function App URLs. This ensures proper authentication, CORS handling, and routing.**
