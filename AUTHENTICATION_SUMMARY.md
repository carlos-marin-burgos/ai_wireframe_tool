# Designetica - Microsoft Employee Authentication

## 🎯 Current Configuration

**Access Policy**: Only users with `@microsoft.com` email addresses can access the application.

---

## ✅ How It Works

### 1. **Azure AD Multi-Tenant Configuration**

- **App Registration**: `Designetica Wireframe Tool` (ID: `b82c2a93-996a-475a-9117-4384d229a70b`)
- **Sign-in Audience**: `AzureADMultipleOrgs` (any organizational Microsoft account)
- **OpenID Issuer**: `https://login.microsoftonline.com/common/v2.0` (multi-tenant endpoint)

### 2. **Frontend Authentication (Azure Static Web App)**

All HTML pages and API endpoints require authentication:

```json
{
  "route": "/*.html",
  "allowedRoles": ["authenticated"]
}
```

**Exceptions** (anonymous access allowed):

- Static assets: CSS, JS, images, JSON files
- `.auth/*` endpoints (for login/logout flows)
- `/api/submit-feedback` (for public feedback submission)

### 3. **Backend Validation (Azure Functions)**

The backend enforces strict email domain validation:

```javascript
// Only @microsoft.com emails allowed
const isMicrosoftEmployee =
  userEmail && userEmail.toLowerCase().endsWith("@microsoft.com");
```

**Rejected domains**:

- ❌ @outlook.com
- ❌ @hotmail.com
- ❌ @azure.microsoft.com (unless it's an alias for @microsoft.com)
- ❌ Any other domain

---

## 🔐 Authentication Flow

```
1. User visits: https://delightful-pond-064d9a91e.1.azurestaticapps.net/

2. Azure Static Web App checks authentication
   ↓
   Not authenticated? → Redirect to Microsoft login

3. User signs in with organizational account
   ↓
   Can be from ANY organization (multi-tenant)

4. Static Web App receives authentication token
   ↓
   Sets x-ms-client-principal header with user info

5. User accesses protected API endpoint
   ↓
   Backend validates email domain
   ↓
   ✅ @microsoft.com → Access granted
   ❌ Other domain → 403 Forbidden
```

---

## 👥 Who Can Access?

### ✅ **Allowed**

- Any user with `@microsoft.com` email address
- Examples:
  - `camarinb@microsoft.com` ✅
  - `satyan@microsoft.com` ✅
  - `billg@microsoft.com` ✅

### ❌ **Denied**

- Users from other organizations
- Personal Microsoft accounts (@outlook.com, @hotmail.com)
- Examples:
  - `user@contoso.com` ❌
  - `personal@outlook.com` ❌
  - `guest@gmail.com` ❌

---

## 🧪 Testing Authentication

### Test as a Microsoft Employee

1. **Open the app** in a browser (or incognito window):

   ```
   https://delightful-pond-064d9a91e.1.azurestaticapps.net/
   ```

2. **You'll be redirected** to Microsoft login

3. **Sign in** with your `@microsoft.com` account

4. **You should see** the main application page

5. **Test protected endpoint**:
   - Navigate to: `/feedback-management.html`
   - Should load successfully (you're authenticated)

### Test Authentication Status

Visit the authentication endpoint:

```
https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/me
```

**Response when authenticated**:

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

**Response when not authenticated**:

```json
{
  "clientPrincipal": null
}
```

### Automated Testing

Run the test script:

```bash
./test-authentication.sh
```

This checks:

- ✅ Main page requires authentication (401)
- ✅ Auth endpoints accessible (200)
- ✅ Static assets load anonymously (200)
- ✅ App settings configured correctly

---

## 🔧 Configuration Files

### 1. **staticwebapp.config.json**

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
  }
}
```

### 2. **Azure Static Web App Settings**

```
AZURE_CLIENT_ID = b82c2a93-996a-475a-9117-4384d229a70b
AZURE_CLIENT_SECRET = [secret value]
AZURE_TENANT_ID = 72f988bf-86f1-41af-91ab-2d7cd011db47
```

### 3. **Backend Validation** (`backend/getFeedback/index.js`)

```javascript
const isMicrosoftEmployee =
  userEmail && userEmail.toLowerCase().endsWith("@microsoft.com");
```

---

## 🚨 Troubleshooting

### Issue: "Other Microsoft employees can't access"

**Check**:

1. App registration is multi-tenant (`AzureADMultipleOrgs`) ✅ (Already configured)
2. OpenID issuer uses `/common/` endpoint ✅ (Already configured)
3. Backend validation allows @microsoft.com ✅ (Already configured)

**Test**: Have another Microsoft employee try to access the app

### Issue: "Authentication not working"

**Possible causes**:

1. **App settings not configured**: Check Azure Portal → Static Web App → Configuration
2. **Wrong Client ID/Secret**: Verify `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET`
3. **Cache issue**: Try incognito/private browsing window
4. **Old deployment**: Ensure latest code is deployed (`azd deploy`)

### Issue: "403 Forbidden after login"

**This is expected** if:

- User email is NOT `@microsoft.com`
- User is from different organization

**Check backend logs**:

```bash
az functionapp logs tail --name func-designetica-prod-vmlmp4vej4ckc --resource-group rg-designetica-prod
```

Look for: `🚫 Unauthorized access attempt by: [email]`

---

## 📊 Current Status

- ✅ **Authentication Enabled**: Yes
- ✅ **Multi-Tenant**: Yes (any org can authenticate)
- ✅ **Domain Restriction**: @microsoft.com ONLY
- ✅ **Backend Validation**: Active
- ✅ **Deployed**: https://delightful-pond-064d9a91e.1.azurestaticapps.net/

---

## 📝 Notes

- **Multi-tenant** means any organizational account can _attempt_ to sign in
- **Backend validation** enforces the @microsoft.com restriction
- This provides maximum compatibility while maintaining security
- Users from other orgs will see a 403 error after successful login
- The app registration is in the **Designetica tenant** but accepts logins from the **Microsoft tenant**

---

## 🔗 Resources

- **App URL**: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
- **App Registration**: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/b82c2a93-996a-475a-9117-4384d229a70b
- **Static Web App**: https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/rg-designetica-prod/providers/Microsoft.Web/staticSites/swa-designetica-5gwyjxbwvr4s6
- **Function App**: https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/rg-designetica-prod/providers/Microsoft.Web/sites/func-designetica-prod-vmlmp4vej4ckc

---

## ✅ Summary

**Yes, other Microsoft employees CAN access the app!**

1. They visit the URL
2. Sign in with their @microsoft.com account
3. Azure AD authenticates them
4. Backend validates their email domain
5. Access granted! ✅

The configuration is complete and deployed. Any Microsoft employee can now use the application.
