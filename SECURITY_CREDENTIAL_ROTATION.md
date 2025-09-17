# 🚨 SECURITY ALERT: Credential Rotation Required

## Exposed Credentials That Must Be Rotated IMMEDIATELY

### 1. Azure OpenAI API Key

**Exposed Key:** `CnGZHVd6QVM4mHigBcWm7tQ2yqoGIHiImCozLODvVXBAG2QVUWp1JQQJ99BHACYeBjFXJ3w3AAABACOGFPTI`
**Service:** Azure OpenAI Service
**Impact:** Full access to your Azure OpenAI resource, API calls, potential billing abuse

**To Rotate:**

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Azure OpenAI resource: `cog-designetica-vdlmicyosd4ua`
3. Go to "Keys and Endpoint"
4. Click "Regenerate Key 1" or "Regenerate Key 2"
5. Update your `local.settings.json` with the new key
6. Update any Azure Functions app settings with the new key

### 2. GitHub OAuth Application

**Exposed Client Secret:** `7d9ea1d8e4576aea63cb59999ce2bd67fd1537c3`
**Exposed Client ID:** `Ov23liOMC7KWf9F9LaqJ`
**Service:** GitHub OAuth App
**Impact:** Unauthorized access to GitHub on behalf of users

**To Rotate:**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Find your OAuth App (or go to Organizations if it's under an org)
3. Click on the app name
4. Generate a new client secret
5. Consider regenerating the Client ID as well for maximum security
6. Update your `local.settings.json` with new credentials
7. Update any production environment variables

### 3. Figma OAuth Application

**Exposed Client Secret:** `vurUe9x5YBtyaH7X55h4s3XhBk0kKP`
**Exposed Client ID:** `5RJ6QIWzuLLz9cT7ZxV0TA`
**Service:** Figma OAuth App
**Impact:** Unauthorized access to Figma on behalf of users

**To Rotate:**

1. Go to [Figma Developers](https://www.figma.com/developers/apps)
2. Find your app: "Designetica"
3. Go to app settings
4. Regenerate the Client Secret
5. Consider creating a new app for maximum security
6. Update your `local.settings.json` with new credentials

## Additional Security Measures

### 4. Environment Variable Security

- ✅ `local.settings.json` is already in `.gitignore`
- ✅ Template file created with placeholder values
- ⚠️ Check Azure Functions production settings for these same credentials

### 5. Monitoring & Detection

- Set up Azure Monitor alerts for unusual API usage
- Monitor GitHub OAuth app usage
- Check Figma API usage logs

## Immediate Action Checklist

- [ ] Regenerate Azure OpenAI API key
- [ ] Regenerate GitHub OAuth credentials
- [ ] Regenerate Figma OAuth credentials
- [ ] Update `local.settings.json` with new credentials
- [ ] Update Azure Functions production app settings
- [ ] Test all integrations with new credentials
- [ ] Monitor for any unauthorized usage of old credentials

## Prevention for Future

1. **Never commit secrets** - Always use environment variables
2. **Use Azure Key Vault** for production secrets
3. **Implement secret rotation policies**
4. **Use managed identities** where possible
5. **Regular security audits** of configuration files

---

**Created:** $(date)
**Priority:** CRITICAL - Act within 24 hours
**Status:** Credentials exposed and require immediate rotation
