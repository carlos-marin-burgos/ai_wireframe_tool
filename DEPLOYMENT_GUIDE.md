# 🚀 Phase 1 & 2 Deployment Guide

**Date:** October 3, 2025  
**Status:** Ready to deploy Phase 1 & 2 improvements  
**Target:** Azure Functions + Static Web App

---

## ✅ Pre-Deployment Checklist

### 1. **Code Verification**

- ✅ Phase 1 improvements implemented (real colors, typography, dynamic loading)
- ✅ Phase 2 improvements implemented (layout, screenshots, responsive, CSS, frameworks)
- ✅ No syntax errors in websiteAnalyzer/index.js
- ✅ Backward compatible (all old fields still present)
- ⏳ **Local testing complete** (run tests before deploying)

### 2. **Dependencies Check**

- ✅ puppeteer: 23.11.1 (required for Phase 1 & 2)
- ✅ cheerio: 1.1.0 (HTML parsing)
- ✅ All dependencies in package.json
- ⏳ **Run `npm install` in backend folder**

### 3. **Performance Considerations**

- ⚠️ **Analysis time increased:** 15-30s → 30-60s (Phase 2)
- ⚠️ **Memory usage increased:** Screenshots + responsive testing
- ⚠️ **Timeout settings:** Consider increasing Azure Function timeout to 120s

### 4. **Azure Configuration**

- ✅ azure.yaml present
- ✅ Backend: Azure Functions (Node 18+)
- ✅ Frontend: Static Web App
- ⏳ **Check Azure Function timeout settings**

---

## 🧪 Pre-Deployment Testing

### **CRITICAL: Test locally before deploying!**

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Start local Azure Functions
func start

# 3. In another terminal, run Phase 1 tests
cd ..
node test-accuracy-improvements.js

# 4. Run Phase 2 tests (comprehensive)
node test-phase2-improvements.js

# 5. Test specific website manually
curl -X POST http://localhost:7071/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}' \
  | jq '.analysis' > test-result.json

# 6. Verify Phase 2 features in output
jq '.layout.measurements' test-result.json
jq '.responsive' test-result.json
jq '.styling.advancedCSS' test-result.json
jq '.frameworks' test-result.json
jq '.screenshot' test-result.json
```

### **Expected Results:**

- ✅ Colors are NOT hardcoded (different per site)
- ✅ Typography is NOT hardcoded
- ✅ Layout measurements present
- ✅ Responsive data for 3 breakpoints
- ✅ Advanced CSS extracted
- ✅ Frameworks detected (where applicable)
- ✅ Screenshot captured

---

## 🚀 Deployment Steps

### **Option A: Using Existing Deploy Script (Recommended)**

```bash
# Make sure you're in project root
cd /Users/carlosmarinburgos/designetica

# Run deployment script
./deploy.sh

# Script will:
# 1. Check azd is installed
# 2. Verify environment (designetica)
# 3. Show deployment targets
# 4. Ask for confirmation
# 5. Run azd up
# 6. Verify deployment
```

### **Option B: Manual Azure Deploy**

```bash
# 1. Ensure correct environment
azd env select designetica

# 2. Deploy everything
azd up

# This will:
# - Build frontend (npm run build)
# - Package backend functions
# - Deploy to Azure
# - Update infrastructure if needed
```

### **Option C: Backend Only Deploy**

If you only want to deploy the backend (websiteAnalyzer changes):

```bash
# Deploy just the backend
azd deploy backend

# Or use Azure Functions Core Tools
cd backend
func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
```

---

## ⚙️ Azure Function Configuration

### **Recommended Settings for Phase 2:**

1. **Timeout:** Increase to 120 seconds (Phase 2 needs more time)
2. **Memory:** 512MB minimum (screenshots + Puppeteer)
3. **Node Version:** 18.x or higher
4. **Always On:** Enable (if using dedicated plan)

### **Update via Azure Portal:**

```
1. Go to Azure Portal → Function App
2. Configuration → General Settings
3. Set functionTimeout: "00:02:00" (2 minutes)
4. Save and restart
```

### **Or via Bicep/ARM template:**

```json
{
  "functionAppScaleLimit": 10,
  "minimumElasticInstanceCount": 1,
  "functionTimeout": "00:02:00"
}
```

---

## 🔍 Post-Deployment Verification

### **1. Check Deployment Status**

```bash
# Get function app URL
FUNCTION_URL=$(azd env get-values | grep AZURE_FUNCTION_APP_URL | cut -d'=' -f2 | tr -d '"')
echo "Function URL: $FUNCTION_URL"

# Test health endpoint
curl $FUNCTION_URL/api/health
```

### **2. Test WebsiteAnalyzer with Phase 2 Features**

```bash
# Test with a real website
curl -X POST $FUNCTION_URL/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}' \
  > production-test.json

# Verify Phase 2 features
jq '.analysis.layout.measurements' production-test.json
jq '.analysis.responsive' production-test.json
jq '.analysis.styling.advancedCSS' production-test.json
jq '.analysis.frameworks' production-test.json
jq '.analysis.screenshot.dimensions' production-test.json
```

### **3. Check Azure Logs**

```bash
# Stream logs from Azure
azd monitor --logs

# Or in Azure Portal:
# Function App → Monitor → Log Stream
```

### **4. Test Different Website Types**

```bash
# Test various sites to verify accuracy
sites=(
  "https://stripe.com"
  "https://tailwindcss.com"
  "https://react.dev"
  "https://getbootstrap.com"
)

for site in "${sites[@]}"; do
  echo "Testing: $site"
  curl -X POST $FUNCTION_URL/api/websiteAnalyzer \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$site\"}" \
    | jq '.success'
done
```

---

## 📊 Performance Monitoring

### **Expected Metrics:**

| Metric            | Before    | Phase 1   | Phase 2   |
| ----------------- | --------- | --------- | --------- |
| **Response Time** | 10-15s    | 15-25s    | 30-60s    |
| **Memory Usage**  | 100-150MB | 150-200MB | 200-300MB |
| **Success Rate**  | 85-90%    | 90-95%    | 90-95%    |

### **Monitor in Azure Portal:**

1. **Application Insights** → Performance
2. Watch for:
   - Response times
   - Failure rates
   - Exception counts
   - Memory usage

---

## 🐛 Troubleshooting

### **Issue: Timeout Errors**

```bash
# Symptom: "FunctionTimeoutException"
# Solution: Increase function timeout to 120s or 180s
```

### **Issue: Puppeteer Fails**

```bash
# Symptom: "Error launching Puppeteer"
# Solution: Ensure Azure Linux plan with Chromium support
# Or: Use Puppeteer with --no-sandbox flag (already set)
```

### **Issue: Screenshot Too Large**

```bash
# Symptom: Response size exceeds limit
# Solution: Screenshot is already optimized (JPEG 80% quality)
# Alternative: Make screenshot optional via query param
```

### **Issue: Memory Errors**

```bash
# Symptom: "JavaScript heap out of memory"
# Solution: Increase function app memory allocation
# Go to: Function App → Scale up → Choose higher tier
```

---

## 🔄 Rollback Plan

### **If deployment fails or issues arise:**

```bash
# 1. Check last successful deployment
azd env get-values | grep DEPLOYMENT_ID

# 2. Use Azure Portal to rollback:
# Function App → Deployment Center → Deployments → Select previous

# 3. Or redeploy from backup
git log --oneline  # Find last working commit
git checkout <commit-hash>
azd up
git checkout main  # Return to latest
```

---

## ✅ Deployment Success Criteria

### **Verify these work in production:**

- ✅ **Colors extracted:** Not hardcoded values
- ✅ **Typography extracted:** Real font families
- ✅ **Layout measurements:** Width, height, padding present
- ✅ **Responsive data:** Mobile, tablet, desktop layouts
- ✅ **Advanced CSS:** Shadows, gradients detected
- ✅ **Frameworks:** React, Material-UI, etc. detected
- ✅ **Screenshots:** Base64 data present
- ✅ **No timeouts:** Completes within 120s
- ✅ **No crashes:** Handles errors gracefully

---

## 📝 Deployment Command Summary

```bash
# Quick deployment (recommended)
./deploy.sh

# Or manual
azd env select designetica
azd up

# Backend only
azd deploy backend

# Test after deployment
curl -X POST $FUNCTION_URL/api/websiteAnalyzer \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}' | jq '.'
```

---

## 🎯 Next Steps After Deployment

1. **Monitor for 24 hours** - Watch for errors, timeouts
2. **Test with real users** - Get feedback on accuracy
3. **Document results** - Track accuracy improvements
4. **Optimize if needed** - Performance tuning based on usage
5. **Plan Phase 3** - If accuracy still needs improvement

---

## 📞 Support

**If you encounter issues:**

1. Check Azure Function logs: `azd monitor --logs`
2. Review error messages in Application Insights
3. Test locally first: `func start` → test → deploy
4. Check timeout settings (must be ≥120s)
5. Verify Puppeteer works in Azure environment

---

**Ready to deploy?** Run `./deploy.sh` from project root! 🚀
