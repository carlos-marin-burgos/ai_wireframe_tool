# 🛡️ Safe Deployment Guide - Never Break Production Again!

## 🚨 CRITICAL - READ THIS FIRST

**After September 26, 2025, we implemented bulletproof deployment safeguards to prevent the API endpoint confusion that caused production outages.**

## ✅ The RIGHT Way to Deploy (Always Use These)

```bash
# 🎯 ALWAYS use these safe deployment commands:
npm run deploy              # Full deployment with all safeguards
npm run deploy:frontend     # Frontend only with validation  
npm run deploy:backend      # Backend only with validation
npm run deploy:validate     # Just validate current deployment
```

## ❌ NEVER Use These Dangerous Commands

```bash
# 🚫 DANGEROUS - Can break production:
azd deploy                  # Raw deployment, no safeguards
azd deploy --service backend # No validation, may use wrong function app
npm run deploy:quick        # OLD - bypasses validation
```

## 🔧 What Our Safeguards Do

### 1. **Pre-Deployment Validation**
- ✅ Verifies you're in the correct Azure environment
- ✅ Confirms target function app URL is correct
- ✅ Creates automatic configuration backup

### 2. **Smart Function App Management** 
- ✅ **Always uses**: `func-designetica-prod-working.azurewebsites.net`
- ❌ **Never uses**: `func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net` (broken)
- ✅ Automatically fixes API configuration mismatches

### 3. **Post-Deployment Validation**
- ✅ Health checks all endpoints
- ✅ Validates API responses
- ✅ Tests image-to-wireframe functionality
- ✅ Records successful deployments

### 4. **Automatic Rollback**
- ✅ Backs up configuration before deployment
- ✅ Restores previous config if validation fails
- ✅ Prevents broken deployments from reaching production

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Static Web App)                                 │
│  https://delightful-pond-064d9a91e.1.azurestaticapps.net/  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  ✅ WORKING Function App (Always Use This)                 │
│  https://func-designetica-prod-working.azurewebsites.net    │
│  • Health endpoint: /api/health                            │
│  • Main API: /api/direct-image-to-wireframe                │
│  • Enhanced Phase 1 system with color extraction           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ❌ BROKEN Function App (Never Use)                        │
│  https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net │
│  • Returns 404 errors                                      │
│  • Deployment issues                                       │
│  • Should be avoided                                       │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Step-by-Step Safe Deployment Process

### For Frontend Changes
```bash
1. npm run build                    # Build with latest changes
2. npm run deploy:frontend          # Deploy with validation
3. # ✅ Script automatically validates endpoints
4. # ✅ Updates API config if needed  
5. # ✅ Confirms everything works
```

### For Backend Changes  
```bash
1. npm run deploy:backend           # Deploy with full validation
2. # ✅ Script validates environment
3. # ✅ Backs up current config
4. # ✅ Tests deployment health
5. # ✅ Rollback if issues detected
```

### For Full Deployment
```bash
1. npm run deploy                   # Full stack with all safeguards
2. # ✅ Validates environment first
3. # ✅ Deploys both services
4. # ✅ Comprehensive endpoint testing
5. # ✅ API configuration sync
```

## 🚑 Emergency Procedures

### If Deployment Fails
```bash
# The safe deployment script automatically handles this:
1. Detects validation failure
2. Restores backup configuration  
3. Provides rollback instructions
4. Logs incident for investigation
```

### Manual Health Check
```bash
npm run deploy:validate
# Tests all endpoints and provides detailed status
```

### Check Current Configuration
```bash
# View deployment history
cat .deployment-history.json

# Check current API endpoint
grep -n "func-designetica-prod" src/config/api.ts
```

## 🔍 Troubleshooting Common Issues

### Issue: "404 Not Found" on API calls
**Cause**: Frontend pointing to broken function app  
**Solution**: 
```bash
npm run deploy:frontend --force  # Auto-fixes API config
```

### Issue: "Deployment validation failed"
**Cause**: Function app not responding  
**Solution**:
1. Check Azure portal for function app health
2. Wait 2-3 minutes for cold start
3. Re-run validation: `npm run deploy:validate`

### Issue: "Wrong environment" error  
**Cause**: azd environment mismatch  
**Solution**:
```bash
azd env select designetica-prod
npm run deploy
```

## 📊 Deployment History Tracking

Every successful deployment is logged in `.deployment-history.json`:
```json
{
  "deployments": [
    {
      "url": "https://func-designetica-prod-working.azurewebsites.net",
      "timestamp": "2025-09-26T17:30:00Z", 
      "status": "validated",
      "validation_passed": true
    }
  ]
}
```

## 🎯 Key Success Metrics

- ✅ **Zero 404 errors** on production API calls
- ✅ **Automatic endpoint validation** before deployment completion  
- ✅ **Instant rollback** capability for failed deployments
- ✅ **Environment protection** prevents wrong-target deployments
- ✅ **Configuration drift detection** and auto-correction

## 🔧 Advanced Usage

### Force Deployment Despite Warnings
```bash
npm run deploy -- --force
# Proceeds even if validation has warnings
```

### Skip Validation (NOT RECOMMENDED)
```bash
./scripts/safe-deploy-new.sh all --skip-validation  
# Only use for emergency fixes
```

### Test Deployment Without Changes
```bash
npm run deploy:validate
# Validates current production status
```

## 📚 Related Documentation

- `./scripts/validate-deployment.sh` - Core validation logic
- `./scripts/safe-deploy-new.sh` - Main deployment wrapper  
- `.deployment-history.json` - Deployment tracking
- `src/config/api.ts` - API endpoint configuration

## 🎉 Success! 

With these safeguards, you should never experience the September 26, 2025 deployment confusion again. The system will:

1. **Prevent** you from using broken function apps
2. **Validate** all deployments before completion
3. **Auto-correct** API configuration issues  
4. **Rollback** failed deployments automatically
5. **Track** all deployment history for debugging

**Happy deploying! 🚀**