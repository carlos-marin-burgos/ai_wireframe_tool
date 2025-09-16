# Email to Figma Admin - OAuth2 Integration Request

**Subject:** Request for Figma OAuth2 App Configuration - Microsoft Enterprise Account Integration

---

**To:** [Figma Admin/IT Team]  
**From:** Carlos Marin Burgos (marin.carlos@microsoft.com)  
**Date:** September 16, 2025  
**Priority:** Medium

---

## Request Summary

I'm working on a design tool integration that connects our internal design system with Figma components via API. While I have a working Personal Access Token, I need to set up OAuth2 authentication to enable other designers on our team to connect their Figma accounts.

## Current Situation

**Working:**

- Personal Access Token authentication (`[REDACTED]`)
- Individual API access to Figma files and components
- Single-user functionality

**Not Working:**

- OAuth2 authentication flow for Microsoft enterprise accounts
- Multi-user access for team collaboration

## Technical Details

**Current OAuth2 App Configuration:**

- **Client ID:** `5RJ6QIWzuLLz9cT7ZxV0TA`
- **Client Secret:** `vurUe9x5YBtyaH7X55h4s3XhBk0kKP`
- **Redirect URI:** `https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaOAuthCallback`

**Error Details:**

- Authorization codes generate successfully
- Token exchange fails with HTTP 404 "Not found" from `https://www.figma.com/api/oauth/token`
- All tested authorization codes return the same 404 error immediately after generation

**Sample Failed Request:**

```bash
curl -X POST "https://www.figma.com/api/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=5RJ6QIWzuLLz9cT7ZxV0TA&client_secret=vurUe9x5YBtyaH7X55h4s3XhBk0kKP&redirect_uri=https://func-original-app-pgno4orkguix6.azurewebsites.net/api/figmaOAuthCallback&code=[AUTH_CODE]&grant_type=authorization_code"

# Response: {"status":404,"err":"Not found"}
```

## Questions for Figma Admin

1. **Enterprise Account Restrictions:** Are there special OAuth2 configurations required for Microsoft internal Figma accounts?

2. **App Registration:** Does the OAuth2 app need to be registered differently for enterprise users, or approved by IT?

3. **Redirect URI Requirements:** Are there specific patterns or domains required for redirect URIs in enterprise environments?

4. **Authentication Scope:** Do Microsoft internal accounts require different OAuth2 scopes or permissions?

5. **IT Approval Process:** Is there an internal approval process for third-party OAuth2 integrations that I should follow?

## Use Case Context

**Project:** AI-powered wireframe generator with Figma design system integration  
**Team:** Microsoft design team members who need to connect their individual Figma accounts  
**Purpose:** Streamline design-to-code workflow by importing Figma components directly into generated wireframes

**Business Value:**

- Automated design system compliance
- Faster prototyping with real components
- Consistent brand implementation across projects

## Requested Actions

1. **Investigate** why OAuth2 token exchange fails for Microsoft enterprise accounts
2. **Advise** on proper OAuth2 app configuration for enterprise users
3. **Provide** documentation for Microsoft-specific Figma OAuth2 requirements
4. **Approve** the integration if IT approval is required

## Alternative Solutions

If OAuth2 integration is not feasible due to enterprise restrictions, please advise on:

- Team-shared Personal Access Token approach
- Service account options
- Alternative authentication methods for multi-user access

## Timeline

**Preferred Response:** Within 5 business days  
**Project Deadline:** End of September 2025  
**Impact:** Currently blocking team collaboration features

## Contact Information

**Primary Contact:** Carlos Marin Burgos  
**Email:** marin.carlos@microsoft.com  
**Team:** [Your Team/Department]  
**Manager:** [If relevant]

**Technical Contact:** Same as above  
**Available for:** Screen sharing, technical calls, or additional debugging

## Additional Context

The application is currently deployed and functional with Personal Access Token authentication. The OAuth2 integration is the final piece needed to enable team-wide adoption. I'm happy to provide additional technical details, logs, or schedule a call to discuss the requirements.

Thank you for your assistance with this integration.

Best regards,  
Carlos Marin Burgos  
Microsoft  
marin.carlos@microsoft.com

---

## Attachments (if needed)

- OAuth2 flow diagrams
- Error logs
- Current app configuration screenshots
- Technical architecture overview
