# Authentication Testing Guide

## 🔐 Microsoft Employee Authentication

Your Designetica app is now protected with Microsoft employee authentication.

---

## ✅ What Was Configured

### Azure AD App Registration

- **Application ID**: `b82c2a93-996a-475a-9117-4384d229a70b`
- **Tenant**: Microsoft (`72f988bf-86f1-41af-91ab-2d7cd011db47`)
- **Account Type**: Single tenant (Microsoft employees only)
- **Redirect URI**: `https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback`

### Static Web App Configuration

- **Resource**: `swa-designetica-5gwyjxbwvr4s6`
- **Resource Group**: `rg-designetica-prod`
- **Authentication**: Enabled with Azure AD
- **Access Control**: Microsoft employees only

---

## 🧪 How to Test

### 1. **Access the Application**

Visit: https://delightful-pond-064d9a91e.1.azurestaticapps.net/

### 2. **Expected Flow**

1. **Redirect to Microsoft Login**: You'll be automatically redirected to login.microsoftonline.com
2. **Sign In**: Use your Microsoft employee credentials (@microsoft.com)
3. **Consent**: First-time users may need to consent to app permissions
4. **Access Granted**: After successful authentication, you'll be redirected to the app

### 3. **What Gets Authenticated**

✅ **Protected** (requires authentication):

- All HTML pages (`/`, `/index.html`, `/feedback-management.html`, etc.)
- All API endpoints (`/api/*`)
- User dashboard and features

🌐 **Public** (no authentication needed):

- Static assets (CSS, JS, images)
- Authentication endpoints (`/.auth/*`)
- Submit feedback endpoint (for anonymous feedback)

---

## 🔍 Troubleshooting

### Issue: "401 Unauthorized"

**Cause**: Static assets were blocked by authentication
**Fix**: ✅ Fixed - Static assets now have anonymous access

### Issue: "AADSTS700016: Application not found"

**Cause**: App not registered in Microsoft tenant or wrong tenant
**Fix**: ✅ Fixed - App registered in correct Microsoft tenant

### Issue: "Access Denied"

**Possible Causes**:

1. Not signed in with @microsoft.com account
2. App not consented to by user or admin
3. User not in Microsoft tenant

**Solutions**:

- Sign out: https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/logout
- Sign in with Microsoft account: https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad

---

## 🔐 Security Features

### Single Sign-On (SSO)

- Uses Microsoft's enterprise authentication
- No passwords stored in your app
- Automatic token refresh

### Access Control

- Only Microsoft tenant users can access
- Email domain verification (@microsoft.com, @azure.microsoft.com)
- Backend API also validates Microsoft employee status

### Session Management

- Sessions managed by Azure Static Web Apps
- Automatic logout after inactivity
- Token-based authentication

---

## 📋 Useful Commands

### Check Authentication Status

```bash
# View current authentication settings
az staticwebapp appsettings list \
  --name swa-designetica-5gwyjxbwvr4s6 \
  --resource-group rg-designetica-prod
```

### Update Authentication Secrets

```bash
# Run the configuration script
./configure-auth-secrets.sh
```

### Deploy Updated Configuration

```bash
# Quick deploy
azd deploy --no-prompt

# Or push to trigger GitHub Actions
git push
```

### Test Authentication API

```bash
# Check who's logged in (run in browser console or with cookies)
curl https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/me
```

---

## 📚 Additional Resources

- [Azure Static Web Apps Authentication](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Custom Authentication Providers](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-custom)

---

## 🎯 Next Steps

1. **Test the authentication flow** with your Microsoft account
2. **Verify access control** works correctly
3. **Test the feedback management page** at `/feedback-management.html`
4. **Monitor authentication logs** in Azure Portal

---

**Last Updated**: October 9, 2025
**Deployment**: Production
**Status**: ✅ Active and secured with Microsoft authentication
