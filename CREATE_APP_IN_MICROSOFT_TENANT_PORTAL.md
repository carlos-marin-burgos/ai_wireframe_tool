# Create App Registration in Microsoft Tenant (Portal Method)

## Critical: Ensure You're in the RIGHT Tenant!

Before creating the app, you MUST verify you're in the **Microsoft tenant**, not Designetica or BAMI.

---

## Step 1: Switch to Microsoft Tenant

1. **Open Azure Portal**: https://portal.azure.com

2. **Check current tenant** (top-right corner):

   - Click on your account name/email
   - You'll see "Current directory" or tenant name
   - Click **"Switch directory"**

3. **Find Microsoft tenant**:

   - Look for tenant with ID: `72f988bf-86f1-41af-91ab-2d7cd011db47`
   - Or name: "Microsoft" (not "Designetica" or "BAMI")
   - Click **Switch** to that tenant

4. **Verify you're in Microsoft tenant**:
   - Top-right should show Microsoft tenant
   - URL might show: `portal.azure.com/?Microsoft_Azure...`

---

## Step 2: Create App Registration in Microsoft Tenant

1. **Search for "App registrations"** in top search bar

2. **Verify tenant again** - The page header should show you're in Microsoft tenant

3. **Click "+ New registration"**

4. **Fill in the form:**

   **Name**:

   ```
   Designetica AI Wireframe Tool - Production
   ```

   **Supported account types**:

   - ✅ Select: **"Accounts in this organizational directory only (Microsoft only - Single tenant)"**
   - This restricts access to Microsoft employees only

   **Redirect URI**:

   - Type: Select **"Web"** from dropdown
   - URL:

   ```
   https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback
   ```

5. **Click "Register"**

---

## Step 3: Configure Authentication

1. **After registration, go to "Authentication"** (left menu)

2. **Verify the redirect URI is there**

3. **Add platform configurations** (if not already added):

   - Click "+ Add a platform"
   - Select **Web**
   - Redirect URI: `https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback`

4. **Implicit grant and hybrid flows**:

   - ✅ Check: **"ID tokens (used for implicit and hybrid flows)"**

5. **Click "Save"**

---

## Step 4: Add API Permissions

1. **Go to "API permissions"** (left menu)

2. **You should see "User.Read" already added**

3. **Add email permission:**

   - Click "+ Add a permission"
   - Select **"Microsoft Graph"**
   - Select **"Delegated permissions"**
   - Search for: `email`
   - ✅ Check: **email**
   - Click "Add permissions"

4. **Optional - Grant admin consent:**
   - If you have permissions, click "Grant admin consent for Microsoft"
   - If not, users will see consent prompt on first login (this is OK)

---

## Step 5: Create Client Secret

1. **Go to "Certificates & secrets"** (left menu)

2. **Click "+ New client secret"**

3. **Description**:

   ```
   Designetica Production Secret
   ```

4. **Expires**: Choose **24 months** (or as per policy)

5. **Click "Add"**

6. **⚠️ CRITICAL - Copy the secret VALUE immediately!**
   - You'll see a **Value** column with a long string like: `abc123~defg456.hij789klm...`
   - Click the copy icon to copy it
   - **You CANNOT see this again!** If you lose it, you'll need to create a new secret

---

## Step 6: Copy Required Information

Go to **Overview** page and copy these values:

### 1. Application (client) ID

```
Example: 12345678-abcd-1234-abcd-123456789abc
```

**Your value:** ********\_********

### 2. Directory (tenant) ID

```
Should be: 72f988bf-86f1-41af-91ab-2d7cd011db47 (Microsoft tenant)
```

**Verify:** ********\_********

### 3. Client Secret Value (from Step 5)

```
Example: abc123~defg456.hij789klm...
```

**Your value:** ********\_********

---

## Step 7: Provide to Copilot

Once you have these 3 values, reply with:

```
Client ID: [paste Application (client) ID]
Secret: [paste Client Secret Value]
Tenant ID: [paste Directory (tenant) ID to verify it's Microsoft tenant]
```

Then I'll:

1. Update your Static Web App settings
2. Update staticwebapp.config.json
3. Deploy the changes
4. All Microsoft employees can access! 🚀

---

## Troubleshooting

### "You don't have permission to create app registrations"

- Your account might not have the "Application Developer" role in Microsoft tenant
- **Solution**: Contact IT/Identity team to either:
  - Grant you "Application Developer" role, OR
  - Create the app registration for you

### Can't find Microsoft tenant when switching directories

- You might not have access to Microsoft tenant in Azure Portal
- **Solution**: Contact IT to get access to Microsoft tenant
- **Alternative**: Ask IT team to create the app registration for you

### Portal keeps redirecting to Designetica tenant

- Clear browser cookies/cache
- Try InPrivate/Incognito window
- Make sure you're explicitly switching to Microsoft tenant

### Created app but in wrong tenant

- Check the Directory (tenant) ID on Overview page
- If wrong, delete it and recreate in correct tenant
- Can't move apps between tenants

---

## Summary

**What you're doing:**

- Creating app registration in **Microsoft tenant** (where all @microsoft.com users exist)
- This allows ANY Microsoft employee to authenticate
- App still hosted in Designetica subscription (separate from auth)

**End result:**

- ✅ All Microsoft employees can access Designetica
- ✅ No guest invitations needed
- ✅ Backend validates @microsoft.com for extra security
- ✅ You maintain control of hosting in Designetica subscription
