# Request Azure Permissions for Designetica Wireframe Tool

## 🚨 Current Situation

Your account `camarinb@microsoft.com` has **Reader-level access** to the BAMI subscription but lacks permissions to:

- Configure Static Web App settings
- Read/write application settings
- View role assignments
- Modify resource group configurations

**This is blocking**: Configuration of Microsoft employee authentication for the Designetica application.

---

## 📧 Email Template: Request Permissions

Copy and customize this email to send to your BAMI subscription administrator:

```
Subject: Request Contributor Access for Designetica Azure Resources

Hello [Subscription Admin Name],

I need access to configure authentication settings for the Designetica Wireframe Tool
application that I'm developing as part of my work.

PERMISSION REQUEST:
- Account: camarinb@microsoft.com
- Role Needed: Contributor (or Website Contributor)
- Scope: Resource Group or specific resource (see details below)

RESOURCE DETAILS:
- Subscription: OFP-TPA-drspott
- Subscription ID: fdd15bfe-0311-4f77-8ddf-346fbdc1ebff
- Resource Group: rg-designetica-prod
- Resource Name: swa-designetica-5gwyjxbwvr4s6
- Resource Type: Static Web App (Microsoft.Web/staticSites)

PURPOSE:
I need to add Azure AD authentication configuration to restrict access to
Microsoft employees only. Specifically, I need to add three application settings:
- AZURE_CLIENT_ID
- AZURE_CLIENT_SECRET
- AZURE_TENANT_ID

CURRENT ISSUE:
I can view the resource but cannot access the Configuration section or modify
application settings, which is required to complete the authentication setup.

ALTERNATIVE SCOPES (if full Contributor is too broad):
- Minimum: Contributor role on the specific Static Web App resource
- Preferred: Contributor role on the rg-designetica-prod resource group

Thank you for your assistance!

Best regards,
Carlos Marin Burgos
```

---

## 🔍 Finding Your BAMI Subscription Administrator

### Option 1: Check Subscription Owners via Portal

1. Go to: https://portal.azure.com
2. Navigate to: **Subscriptions**
3. Click on: **OFP-TPA-drspott**
4. Click: **Access control (IAM)** (you might have read access here)
5. Look for users with **Owner** role

### Option 2: Check Internal Microsoft Resources

- **Microsoft BAMI Portal**: Check internal documentation for BAMI subscription ownership
- **Your Manager**: They may know who manages your team's Azure subscriptions
- **IT Help Desk**: They can route your request to the right person

### Option 3: Check Azure Activity Log

1. In Azure Portal, go to the Static Web App resource
2. Click: **Activity log** (you have access to this)
3. Filter by: **Write** operations
4. Look for who created or last modified the resource

---

## 🛠️ What Happens After You Get Permissions

Once you receive **Contributor** access, you'll be able to:

### Step 1: Configure Authentication via Portal

Follow the guide in `PORTAL_APP_SETTINGS_GUIDE.md`:

1. Navigate to Static Web App → Configuration
2. Add the three application settings
3. Save changes

### Step 2: OR Use the Automated Script

Run the script we prepared:

```bash
./configure-auth-secrets.sh
```

It will prompt you for:

- Your new Azure AD App Client ID
- Your new Client Secret

Then automatically configure everything.

### Step 3: Deploy and Test

```bash
# Deploy the application
azd deploy --no-prompt

# Test authentication
./test-authentication.sh

# Or manually test
open https://delightful-pond-064d9a91e.1.azurestaticapps.net/
```

---

## 🔐 What Permissions You Currently Have

Based on the errors, you currently have:

✅ **What Works**:

- View subscription list
- See resource names (read-only)
- View activity logs (likely)
- Access some portal views

❌ **What Doesn't Work**:

- Read/write application settings
- Configure Static Web App
- View role assignments
- Modify resource group settings
- Use Azure CLI for resource management

---

## 📊 Required Permissions Breakdown

To complete the authentication setup, you need ONE of these:

### Option A: Contributor Role on Resource

```
Role: Contributor
Scope: /subscriptions/fdd15bfe-0311-4f77-8ddf-346fbdc1ebff/
       resourceGroups/rg-designetica-prod/
       providers/Microsoft.Web/staticSites/swa-designetica-5gwyjxbwvr4s6
```

### Option B: Contributor Role on Resource Group

```
Role: Contributor
Scope: /subscriptions/fdd15bfe-0311-4f77-8ddf-346fbdc1ebff/
       resourceGroups/rg-designetica-prod
```

### Option C: Website Contributor Role

```
Role: Website Contributor (built-in Azure role)
Scope: Resource or Resource Group (same as above)
```

---

## 🚀 Workaround: Alternative Deployment Method

If you cannot get permissions quickly, you could:

### Use Azure DevOps or GitHub Actions with Service Principal

1. **Create a Service Principal** (if you have permissions):

   ```bash
   az ad sp create-for-rbac --name "designetica-deploy" \
     --role Contributor \
     --scopes /subscriptions/fdd15bfe-0311-4f77-8ddf-346fbdc1ebff/resourceGroups/rg-designetica-prod
   ```

2. **Store credentials as GitHub Secrets**
3. **Use GitHub Actions to deploy** (already configured in your repo)

However, you'd still need permissions to create the service principal.

---

## 📋 Quick Reference

- **Your Account**: camarinb@microsoft.com
- **Subscription**: OFP-TPA-drspott (fdd15bfe-0311-4f77-8ddf-346fbdc1ebff)
- **Resource Group**: rg-designetica-prod
- **Static Web App**: swa-designetica-5gwyjxbwvr4s6
- **Needed Role**: Contributor or Website Contributor
- **Reason**: Configure Azure AD authentication settings

---

## ✅ Next Steps

1. **Identify the subscription administrator** (see Finding Your BAMI Subscription Administrator section above)
2. **Send the permission request email** (use the template above)
3. **Wait for approval** (this may take 1-2 business days depending on your org's process)
4. **Once approved**, follow the guides:
   - `PORTAL_APP_SETTINGS_GUIDE.md` for manual Portal configuration
   - OR run `./configure-auth-secrets.sh` for automated setup
5. **Deploy and test** authentication

---

## 💡 Additional Notes

- **BAMI subscriptions** often have strict access controls
- Your current **Reader-like access** is common for new users
- **Conditional Access policies** may also be affecting CLI operations
- Once you have permissions, everything should work smoothly!

---

Need help with anything else while waiting for permissions? I can:

- Help you prepare the Azure AD app registration (if not done yet)
- Review your code for any other improvements
- Set up documentation for the authentication flow
- Prepare testing scripts for when authentication is live
