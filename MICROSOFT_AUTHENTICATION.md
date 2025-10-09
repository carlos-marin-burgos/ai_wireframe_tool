# 🔐 Microsoft Employee Authentication

## Overview

The **Designetica** application is now secured with **Azure Active Directory (Azure AD)** authentication, restricting access to **Microsoft employees only**.

## Authentication Configuration

### Azure Static Web App Configuration

The entire application requires authentication via `staticwebapp.config.json`:

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET"
        }
      }
    }
  }
}
```

**Tenant ID:** `72f988bf-86f1-41af-91ab-2d7cd011db47` (Microsoft Corporation)

### Protected Routes

All routes require authentication except:
- `/.auth/*` - Azure authentication endpoints (anonymous access)
- `/api/submit-feedback` - Public feedback submission (anonymous access)

**All other routes require `authenticated` role:**
- `/` - Homepage
- `/*.html` - All HTML pages
- `/api/*` - All API endpoints (except submit-feedback)
- All static assets (JS, CSS, images)

## How It Works

### 1. User Access Flow

```
User visits app → Azure AD check → Not authenticated? → Redirect to Microsoft login
                                  → Authenticated? → Grant access
```

### 2. Authentication Process

1. **User visits**: `https://delightful-pond-064d9a91e.1.azurestaticapps.net`
2. **Azure checks**: Is user authenticated?
3. **If NO**: Redirect to `/.auth/login/aad`
4. **Microsoft login**: User signs in with Microsoft account
5. **Tenant validation**: Azure AD validates user is from Microsoft tenant
6. **Access granted**: User redirected to original URL

### 3. Backend API Protection

Backend APIs automatically receive authenticated user information via headers:

```javascript
// In Azure Functions
const clientPrincipal = req.headers['x-ms-client-principal'];
if (clientPrincipal) {
  const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
  const userEmail = principal.userDetails;
  
  // Verify Microsoft employee
  const isMicrosoftEmployee = 
    userEmail.endsWith('@microsoft.com') || 
    userEmail.endsWith('@azure.microsoft.com');
}
```

## Required Azure Configuration

### Azure Static Web App Settings

Configure these **Application Settings** in Azure Portal:

```bash
AZURE_CLIENT_ID=<your-azure-ad-app-client-id>
AZURE_CLIENT_SECRET=<your-azure-ad-app-client-secret>
```

### Azure AD App Registration

1. **Create App Registration** in Azure Portal
2. **Configure Redirect URIs**:
   - `https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback`
3. **Set Supported Account Types**: 
   - **Single tenant** (Microsoft employees only)
4. **Create Client Secret**:
   - Navigate to "Certificates & secrets"
   - Create new client secret
   - Copy value to `AZURE_CLIENT_SECRET` setting

## Testing Authentication

### Local Development

**Note:** Authentication is **disabled** for local development (localhost):

```javascript
// Backend bypasses auth for localhost
if (process.env.NODE_ENV !== 'production' && 
    req.headers.host?.includes('localhost')) {
  context.log("🧪 Local development - bypassing authentication");
}
```

### Production Testing

1. **Test authentication page**: `/test-auth.html`
   - Shows authentication status
   - Displays user email and claims
   - Tests feedback API access

2. **Login manually**:
   ```
   https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad
   ```

3. **Check auth status**:
   ```
   https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/me
   ```

4. **Logout**:
   ```
   https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/logout
   ```

## User Experience

### Anonymous User

1. Visits app URL
2. Automatically redirected to Microsoft sign-in
3. Signs in with Microsoft account
4. Redirected back to app
5. Full access to all features

### Authenticated User

- Seamless access to all pages
- No login prompts
- Session persists across browser sessions
- Automatic token refresh

### Non-Microsoft User

- Can sign in with any Microsoft account
- Access **denied** if email doesn't match:
  - `@microsoft.com`
  - `@azure.microsoft.com`
  - `@outlook.com` (for testing)

## API Authentication Details

### Headers Sent to Backend

Azure Static Web Apps automatically adds these headers to API requests:

```
x-ms-client-principal: <base64-encoded-user-info>
x-ms-client-principal-id: <user-object-id>
x-ms-client-principal-idp: aad
x-ms-client-principal-name: <user-email>
```

### Decoded Principal Structure

```json
{
  "identityProvider": "aad",
  "userId": "user-object-id",
  "userDetails": "user@microsoft.com",
  "userRoles": ["authenticated"],
  "claims": [
    {
      "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      "val": "user@microsoft.com"
    },
    {
      "typ": "name",
      "val": "User Name"
    }
  ]
}
```

## Security Benefits

✅ **Enterprise SSO**: Microsoft employees use existing credentials  
✅ **No password management**: Azure AD handles authentication  
✅ **MFA support**: Enforced by Microsoft corporate policy  
✅ **Automatic session management**: Tokens managed by Azure  
✅ **Audit logging**: All access logged by Azure AD  
✅ **Conditional access**: Can enforce device/location policies  

## Deployment

### Deploy Updated Configuration

```bash
# Commit changes
git add staticwebapp.config.json
git commit -m "Require Microsoft authentication for entire app"

# Push to trigger deployment
git push

# Or use Azure Developer CLI
azd deploy --no-prompt
```

### Verify Deployment

1. Visit app URL (not logged in)
2. Should immediately redirect to Microsoft login
3. After login, should return to app
4. Test `/test-auth.html` to verify authentication

## Troubleshooting

### "Authentication failed"

**Solution:** Check Azure AD App Registration redirect URIs match exactly

### "Access Denied"

**Solution:** Verify user email ends with approved domain (`@microsoft.com`)

### Local development not working

**Solution:** Authentication is bypassed locally - test in production

### Users can't access after login

**Solution:** 
1. Check `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET` are configured
2. Verify tenant ID matches Microsoft tenant
3. Check Azure AD app is configured for single tenant

## Additional Resources

- [Azure Static Web Apps Authentication](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Static Web Apps Configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)

## Support

For authentication issues, contact:
- **App Owner**: Carlos Marin Burgos
- **Azure AD Support**: Microsoft IT Helpdesk
