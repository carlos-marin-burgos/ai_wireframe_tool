# Fix: "Trying to sign you in" Login Loop

## 🔄 What's Happening

You're experiencing a redirect loop where:

1. You try to access the app
2. It redirects to Microsoft login
3. You authenticate successfully
4. It redirects back but immediately tries to authenticate again
5. Loop continues indefinitely

## ✅ Changes Made

### 1. Enabled ID Token Issuance

```bash
az ad app update --id b82c2a93-996a-475a-9117-4384d229a70b --enable-id-token-issuance true
```

**Why**: Azure Static Web Apps requires ID tokens to be enabled in the app registration.

### 2. Removed AZURE_TENANT_ID Setting

The app now only has:

- `AZURE_CLIENT_ID`: b82c2a93-996a-475a-9117-4384d229a70b
- `AZURE_CLIENT_SECRET`: [configured]

**Why**: When using `/common/` endpoint for multi-tenant, having a specific tenant ID can cause conflicts.

## 🧹 Clear Your Browser Cache

The redirect loop is often caused by cached authentication cookies. Try these steps:

### Option 1: Use Incognito/Private Window

1. **Chrome/Edge**: Press `Cmd+Shift+N`
2. **Safari**: Press `Cmd+Shift+N`
3. **Firefox**: Press `Cmd+Shift+P`
4. Navigate to: https://delightful-pond-064d9a91e.1.azurestaticapps.net/

### Option 2: Clear Site Data

1. Open: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
2. Open Developer Tools: `Cmd+Option+I`
3. Go to **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)
4. Right-click on the domain → **Clear site data**
5. Refresh the page

### Option 3: Clear Cookies Manually

1. Open: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
2. Open Developer Tools: `Cmd+Option+I`
3. Go to **Application** → **Cookies**
4. Delete all cookies for:
   - `delightful-pond-064d9a91e.1.azurestaticapps.net`
   - `login.microsoftonline.com`
5. Refresh the page

## 🔍 Verify the Fix

After clearing cache, the login flow should be:

```
1. Visit: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
   ↓
2. Auto-redirect to Microsoft login
   ↓
3. Sign in with @microsoft.com account
   ↓
4. Redirect back to app
   ↓
5. ✅ App loads successfully (no loop!)
```

## 🧪 Test Authentication

Once logged in, test the auth endpoint:

```bash
curl -s 'https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/me' -H "Cookie: [your-cookies]"
```

Should return:

```json
{
  "clientPrincipal": {
    "identityProvider": "aad",
    "userId": "...",
    "userDetails": "camarinb@microsoft.com",
    "userRoles": ["authenticated"]
  }
}
```

## 🚨 If Still Experiencing Issues

### Check App Registration Settings

1. Go to: https://portal.azure.com
2. Navigate to: **Azure Active Directory** → **App registrations**
3. Find: **Designetica Wireframe Tool** (b82c2a93-996a-475a-9117-4384d229a70b)
4. Check **Authentication** settings:

Should have:

- ✅ **Redirect URI**: `https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback`
- ✅ **Supported account types**: Accounts in any organizational directory (Any Azure AD directory - Multitenant)
- ✅ **ID tokens**: ENABLED
- ❌ **Access tokens**: Not required

### Alternative: Force Logout First

Try accessing the logout endpoint first, then login:

```
https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/logout
```

Then try accessing the app again.

## 📝 Current Configuration

### staticwebapp.config.json

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/common/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET"
        }
      }
    }
  },
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/aad?post_login_redirect_uri=.referrer",
      "statusCode": 302
    }
  }
}
```

### App Registration

- **Name**: Designetica Wireframe Tool
- **Client ID**: b82c2a93-996a-475a-9117-4384d229a70b
- **Sign-in audience**: AzureADMultipleOrgs
- **ID tokens**: ENABLED ✅

### Static Web App Settings

- **AZURE_CLIENT_ID**: b82c2a93-996a-475a-9117-4384d229a70b
- **AZURE_CLIENT_SECRET**: [configured]
- **AZURE_TENANT_ID**: [removed - not needed for multi-tenant]

## ✅ Next Steps

1. **Try incognito window** first (easiest)
2. If that works, **clear cache** in your main browser
3. If still not working, check the browser console for errors
4. Share any error messages you see

The configuration should now be correct - the issue is likely just cached authentication state in your browser!
