# 🛡️ Deployment Prevention & Monitoring Guide

## Overview

This guide provides tools and procedures to prevent the issues you experienced from happening again.

## 🚨 What Happened Before

- OpenAI environment variables were missing/incorrect after deployment
- Fast mode logic was overriding user preferences
- No health monitoring to catch issues early

## ✅ Prevention Measures Now in Place

### 1. Pre-Deployment Validation

**Script:** `scripts/validate-before-deploy.sh`

Before every deployment, run:

```bash
./scripts/validate-before-deploy.sh
```

This checks:

- ✅ Azure CLI authentication
- ✅ Environment variables configuration
- ✅ Dependencies installation
- ✅ Build process
- ✅ Required files existence

### 2. Health Check Endpoint

**URL:** `https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/healthCheck`

Monitors:

- ✅ Function App status
- ✅ Environment variables presence
- ✅ OpenAI connectivity
- ✅ Memory usage
- ✅ System uptime

Example healthy response:

```json
{
  "status": "healthy",
  "checks": {
    "environment": { "status": "pass" },
    "openai": { "status": "pass" },
    "memory": { "status": "pass" }
  }
}
```

### 3. Post-Deployment Monitoring

**Script:** `scripts/monitor-deployment.sh`

After deployment, run:

```bash
./scripts/monitor-deployment.sh
```

This continuously monitors:

- ✅ Health check endpoint
- ✅ Wireframe generation functionality
- ✅ Application Insights logs
- ✅ Failure detection and alerting

### 4. Enhanced Error Tracking

Added comprehensive logging to track:

- ✅ OpenAI initialization attempts
- ✅ Environment variable status
- ✅ API version compatibility
- ✅ Fast mode decision logic

## 🔧 Recommended Workflow

### Before Every Deployment:

1. **Validate Environment:**

   ```bash
   ./scripts/validate-before-deploy.sh
   ```

2. **If validation passes, deploy:**

   ```bash
   azd deploy
   ```

3. **Monitor after deployment:**
   ```bash
   ./scripts/monitor-deployment.sh
   ```

### If Issues Occur:

1. **Check Health Status:**

   ```bash
   curl -s "https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/healthCheck" | jq .
   ```

2. **Check Application Insights:**

   ```bash
   az monitor app-insights query \
     --app 59c62182-daec-44b5-befd-c36531f70421 \
     --analytics-query "traces | where timestamp > ago(1h) | where severityLevel >= 2 | order by timestamp desc | limit 10"
   ```

3. **Test Wireframe Generation:**
   ```bash
   curl -X POST "https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/generateWireframe" \
     -H "Content-Type: application/json" \
     -d '{"description": "test wireframe", "colorScheme": "primary"}'
   ```

## 🔍 Key Monitoring URLs

- **Health Check:** https://func-designetica-vjib6nx2wh4a4.azurewebsites.net/api/healthCheck
- **Frontend:** https://mango-water-06e1c9c0f.1.azurestaticapps.net/
- **Application Insights:** https://portal.azure.com/#@/resource/subscriptions/4b74d7bc-bb7d-4bab-b21c-d1a3493d40fb/resourceGroups/rg-designetica/providers/microsoft.insights/components/appi-designetica-vjib6nx2wh4a4

## 🚨 Alert Thresholds

The monitoring system will alert you when:

- ❌ Health check fails 3 consecutive times
- ❌ Wireframe generation fails
- ❌ OpenAI connection is lost
- ❌ Environment variables are missing

## 🛠️ Quick Fixes

### If OpenAI stops working:

1. Check environment variables in Azure Function App
2. Verify API key hasn't expired
3. Check Azure OpenAI service status

### If deployment fails validation:

1. Run `az login` to re-authenticate
2. Check `backend/local.settings.json` configuration
3. Run `cd backend && npm install` to update dependencies

### If health check shows "degraded":

1. Check specific failed components in the response
2. Review Application Insights logs
3. May continue working with fallback systems

## 📊 Current Status

As of this deployment:

- ✅ All systems healthy
- ✅ OpenAI connectivity confirmed
- ✅ Environment variables properly configured
- ✅ Monitoring systems active

## 🎯 Success Metrics

Monitor these for ongoing health:

- Health check returns 200 status
- OpenAI check status = "pass"
- Memory usage < 500MB
- Wireframe generation completes successfully

This comprehensive monitoring approach should prevent future deployment issues and catch problems early!
