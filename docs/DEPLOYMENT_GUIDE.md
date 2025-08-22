# 🚀 Designetica - Simple Deployment Guide

## ONE Environment, Zero Confusion!

Your Designetica app now uses **ONE** simple production environment. No more confusion with multiple environments!

### 🌐 Production URLs

- **Frontend**: https://brave-island-04ba9f70f.2.azurestaticapps.net
- **Backend**: https://func-designetica-vdlmicyosd4ua.azurewebsites.net

### 📦 Quick Commands

```bash
# Check production status
npm run production:status

# Deploy everything (slower, but complete)
npm run deploy

# Quick deploy (code only, faster)
npm run deploy:quick

# Test production site
npm run production:test
```

### 🛠️ Development vs Production

**Local Development:**

```bash
npm run dev          # Start local development
```

**Production Deployment:**

```bash
npm run deploy       # Deploy to production
```

### 🎯 How It Works

1. **Development**: Work locally with `npm run dev`
2. **Deploy**: When ready, run `npm run deploy:quick`
3. **Test**: Check your changes at the production URL
4. **Done**: No environment switching, no confusion!

### 🆘 If Something Goes Wrong

1. Check status: `npm run production:status`
2. Full redeploy: `npm run deploy`
3. Test manually: `npm run production:test`

### 📋 Manual Test Checklist

When you visit the production site:

- ✅ Does the site load correctly?
- ✅ Can you generate a wireframe?
- ✅ Do the AI suggestions work?
- ✅ Can you save/load wireframes?

### 🔍 Environment Details

- **Environment Name**: `designetica`
- **Azure Subscription**: Visual Studio Enterprise Subscription
- **Resource Group**: rg-designetica-aibuilder-prod
- **Location**: East US 2

---

**That's it!** One environment, simple commands, zero confusion. 🎉
