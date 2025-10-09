# Azure Portal: Configure Static Web App Authentication Settings

## 🎯 Goal

Add the authentication secrets to your Azure Static Web App so Microsoft employee authentication works.

---

## 📍 Step-by-Step Instructions

### Step 1: Open Azure Portal

1. Go to: https://portal.azure.com
2. Sign in with your `camarinb@microsoft.com` account

### Step 2: Navigate to Your Static Web App

1. In the top search bar, type: `swa-designetica-5gwyjxbwvr4s6`
2. Click on the resource that appears in the results

**OR**

1. Click on **Resource groups** in the left sidebar
2. Click on: `rg-designetica-prod`
3. Find and click: `swa-designetica-5gwyjxbwvr4s6` (Type: Static Web App)

### Step 3: Access Configuration Settings

```
┌─────────────────────────────────────────────────────────────────┐
│ swa-designetica-5gwyjxbwvr4s6                                   │
│ Static Web App                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Left Sidebar:                                                   │
│   Overview                                                      │
│   Activity log                                                  │
│   Access control (IAM)                                          │
│   Tags                                                          │
│                                                                 │
│   SETTINGS                                                      │
│   → Configuration          ← CLICK HERE                         │
│   → Custom domains                                              │
│   → Role management                                             │
│   → APIs                                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

1. In the **left sidebar**, scroll down to the **Settings** section
2. Click on: **Configuration**

### Step 4: Add Application Settings

You'll see a page with tabs. Make sure you're on the **Application settings** tab:

```
┌─────────────────────────────────────────────────────────────────┐
│ Configuration                                                   │
├─────────────────────────────────────────────────────────────────┤
│ [Application settings] [Environment variables] [Functions]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Application settings                                            │
│                                                                 │
│ [+ Add] [+ Add bulk] [Advanced edit]                           │
│                                                                 │
│ Name                      Value                      Source     │
│ ───────────────────────────────────────────────────────────     │
│ AZURE_CLIENT_ID           b82c2a93-996a-...         Manual     │
│ AZURE_CLIENT_SECRET       ••••••••••••••••          Manual     │
│ AZURE_TENANT_ID           72f988bf-86f1-...         Manual     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### If settings already exist (shown above):

1. Click on **AZURE_CLIENT_ID** row to edit it
2. Replace the Value with your **new Client ID** from app registration
3. Click **OK**

4. Click on **AZURE_CLIENT_SECRET** row to edit it
5. Replace the Value with your **new Client Secret**
6. Click **OK**

7. Verify **AZURE_TENANT_ID** = `72f988bf-86f1-41af-91ab-2d7cd011db47`
   - If different, click to edit and update it

#### If settings don't exist:

1. Click **[+ Add]** button
2. Enter:
   - **Name**: `AZURE_CLIENT_ID`
   - **Value**: [Your new Client ID from app registration]
3. Click **OK**

4. Click **[+ Add]** again
5. Enter:
   - **Name**: `AZURE_CLIENT_SECRET`
   - **Value**: [Your new Client Secret]
6. Click **OK**

7. Click **[+ Add]** again
8. Enter:
   - **Name**: `AZURE_TENANT_ID`
   - **Value**: `72f988bf-86f1-41af-91ab-2d7cd011db47`
9. Click **OK**

### Step 5: Save Changes

```
┌─────────────────────────────────────────────────────────────────┐
│ Configuration                                     [Save] [Discard]
└─────────────────────────────────────────────────────────────────┘
```

1. Click the **[Save]** button at the top of the page
2. Wait for the confirmation message: "Successfully saved the application settings"

---

## ✅ Verification

After saving, you should see all three settings listed:

| Name                | Value                                | Source |
| ------------------- | ------------------------------------ | ------ |
| AZURE_CLIENT_ID     | [your-new-client-id]                 | Manual |
| AZURE_CLIENT_SECRET | •••••••••••••••••••                  | Manual |
| AZURE_TENANT_ID     | 72f988bf-86f1-41af-91ab-2d7cd011db47 | Manual |

---

## 🚀 Next Steps

After configuring the settings in the Portal:

1. **Deploy the app** (if not already deployed):

   ```bash
   azd deploy --no-prompt
   ```

2. **Test authentication**:

   - Open: https://delightful-pond-064d9a91e.1.azurestaticapps.net/
   - You should be redirected to Microsoft login
   - Sign in with your `@microsoft.com` account
   - You should be granted access

3. **Run automated tests**:
   ```bash
   ./test-authentication.sh
   ```

---

## 🆘 Troubleshooting

### ⚠️ "I don't see the Configuration option" (CURRENT ISSUE)

**Cause**: You don't have write permissions on the Static Web App resource.

**What you're seeing**:

```
Left Sidebar (Limited View):
  Overview
  Activity log
  Access control (IAM)
  Tags

  SETTINGS (section exists but Configuration is missing)
  → Custom domains
  → Role management
  → APIs
```

**Missing**: The **Configuration** option that should appear under SETTINGS.

**Solution Options**:

#### Option A: Request Permissions from Subscription Owner (Recommended)

The Static Web App was likely created by someone else or with a service principal. You need to request access:

1. **Find the subscription owner**:

   - Subscription: `OFP-TPA-drspott` (fdd15bfe-0311-4f77-8ddf-346fbdc1ebff)
   - Ask your manager or check internal docs for who manages BAMI subscriptions

2. **Request one of these roles**:

   - **Contributor** (on the resource or resource group)
   - **Owner** (on the resource or resource group)
   - **Website Contributor** (built-in Azure role)

3. **Provide these details in your request**:
   ```
   Resource Name: swa-designetica-5gwyjxbwvr4s6
   Resource Type: Static Web App
   Resource Group: rg-designetica-prod
   Subscription: OFP-TPA-drspott (fdd15bfe-0311-4f77-8ddf-346fbdc1ebff)
   Your Account: camarinb@microsoft.com
   Needed Permission: Contributor or Website Contributor role
   Reason: Need to configure authentication settings for Microsoft employee access
   ```

#### Option B: Check Access Control (IAM)

You can check who has permissions and potentially request access:

1. In the Static Web App resource page, click: **Access control (IAM)**
2. Click: **Role assignments** tab
3. Look for who has **Owner** or **Contributor** roles
4. Contact them to request access

#### Option C: Use a Service Principal with Permissions

If you have access to create a service principal with the right permissions:

1. Create a service principal with Contributor role on the resource
2. Use `az login --service-principal` with those credentials
3. Run the `./configure-auth-secrets.sh` script

### "I can see Configuration but can't edit"

**Cause**: Read-only permissions.

**Solution**: Request write permissions from your subscription administrator.

### "Changes saved but authentication still not working"

**Cause**:

- Wrong Client ID or Secret
- App registration incomplete
- Cache issue

**Solution**:

1. Verify app registration is complete (see `BAMI_APP_REGISTRATION.md`)
2. Double-check Client ID and Secret are correct
3. Try in incognito/private browser window
4. Check browser console for errors (F12)

---

## 📋 Quick Reference

- **Portal URL**: https://portal.azure.com
- **Resource Group**: `rg-designetica-prod`
- **Static Web App**: `swa-designetica-5gwyjxbwvr4s6`
- **Tenant ID**: `72f988bf-86f1-41af-91ab-2d7cd011db47`
- **App URL**: https://delightful-pond-064d9a91e.1.azurestaticapps.net/

---

## 🔍 Visual Path Summary

```
Azure Portal
  └── Search: "swa-designetica-5gwyjxbwvr4s6"
      └── Click resource
          └── Left Sidebar > Settings > Configuration
              └── Application settings tab
                  └── Add/Edit: AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID
                      └── Click Save
```
