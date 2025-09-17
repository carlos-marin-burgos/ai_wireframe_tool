# Designetica Deployment Guide

## 🎯 Overview

This document outlines the proper deployment workflow for the Designetica AI Wireframe Generator to avoid multiple deployment environments and ensure consistency.

## 🏗️ Architecture

**Production Environment**: `original-app`

- **Backend**: https://func-original-app-pgno4orkguix6.azurewebsites.net/
- **Frontend**: https://lemon-field-08a1a0b0f.1.azurestaticapps.net/
- **OAuth Callback**: https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaOAuthCallback

## 📋 Prerequisites

1. **Azure Developer CLI (azd)** installed

   ```bash
   # Install azd
   curl -fsSL https://aka.ms/install-azd.sh | bash

   # Update to latest version
   curl -fsSL https://aka.ms/install-azd.sh | bash
   ```

2. **Required Tools**
   - Node.js (for Functions development)
   - Git
   - Azure CLI (optional, for manual operations)

## 🤖 Automation Options

For automatic deployment instead of manual runs, see **[AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md)**

### Quick Automation Setup

```bash
# Git hooks for team consistency
./setup-hooks.sh

# File watcher for active development
./watch-deploy.sh
```

## 🚀 Deployment Process

### Option 1: Safe Deployment Script (Recommended)

```bash
# Use the automated deployment script
./deploy.sh
```

This script:

- ✅ Validates environment selection
- ✅ Confirms deployment targets
- ✅ Performs health checks
- ✅ Validates OAuth configuration

### Option 2: Manual Deployment

```bash
# 1. Check current environment
./check-env.sh

# 2. Ensure correct environment is selected
azd env select original-app

# 3. Deploy
azd up
```

## 🔍 Environment Management

### Check Current Environment

```bash
./check-env.sh
```

### Switch to Production Environment

```bash
azd env select original-app
```

### List All Environments

```bash
azd env list
```

## ⚠️ Important Rules

### ✅ DO

- Always use `azd env select original-app` before deployment
- Run `./check-env.sh` to verify environment
- Use the `./deploy.sh` script for safe deployments
- Test OAuth flow after deployment

### ❌ DON'T

- Deploy to random environments
- Create new environments without documentation
- Skip environment validation
- Deploy without checking OAuth configuration

## 🔐 OAuth Configuration

The Figma OAuth app is registered with:

- **Redirect URI**: `https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaOAuthCallback`
- **Client ID**: `zI87Ip3V3g22QLF6Td64Rq`

**Environment Variables Required:**

- `FIGMA_CLIENT_ID`: OAuth client ID
- `FIGMA_CLIENT_SECRET`: OAuth client secret
- `FIGMA_REDIRECT_URI_PROD`: Production callback URL

## 🧪 Testing After Deployment

### 1. Health Check

```bash
curl https://func-original-app-pgno4orkguix6.azurewebsites.net/api/health
```

### 2. OAuth Diagnostics

```bash
curl https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaOAuthDiagnostics
```

### 3. OAuth Flow Test

```bash
curl -X POST https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaOAuthStart \
  -H "Content-Type: application/json" -d '{}'
```

Expected response should include:

```json
{
  "auth_url": "https://www.figma.com/oauth?...redirect_uri=https%3A%2F%2Ffunc-original-app-pgno4orkguix6.azurewebsites.net%2Fapi%2FfigmaOAuthCallback..."
}
```

## 🧹 Cleanup Unused Environments

To avoid confusion and costs, unused environments should be removed:

```bash
# List environments
azd env list

# Delete unused environment (be careful!)
azd env delete <environment-name>
```

**⚠️ Warning**: Only delete environments you're certain are unused!

## 🔧 Troubleshooting

### Environment Issues

- **Problem**: Wrong environment selected
- **Solution**: Run `azd env select original-app`

### OAuth Issues

- **Problem**: Redirect URI mismatch
- **Solution**: Ensure deployment is on `original-app` environment

### Multiple Deployments

- **Problem**: Accidentally created multiple environments
- **Solution**: Use cleanup procedure above

## 📱 Scripts Reference

- `./deploy.sh` - Safe deployment with validation
- `./check-env.sh` - Environment validation and status
- `./azure.yaml` - AZD configuration file

## 🎯 Best Practices

1. **Single Production Environment**: Use only `original-app` for production
2. **Environment Validation**: Always check environment before deployment
3. **OAuth Consistency**: Ensure redirect URI matches registration
4. **Health Checks**: Verify deployment after completion
5. **Documentation**: Keep this guide updated with changes

## 📞 Support

If you encounter issues:

1. Run `./check-env.sh` to diagnose
2. Check Azure portal for resource status
3. Review deployment logs with `azd up --debug`
4. Test OAuth flow manually

---

**Last Updated**: September 17, 2025  
**Environment**: original-app  
**Status**: ✅ Production Ready
