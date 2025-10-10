# Create App Registration in Microsoft Tenant for Designetica

## Goal

Allow all Microsoft employees to authenticate to Designetica by creating an app registration in the Microsoft corporate tenant (not Designetica tenant).

## Prerequisites

- Access to Azure Portal: https://portal.azure.com
- Sign in with your camarinb@microsoft.com account
- You need permissions to create app registrations in Microsoft tenant

---

## Step 1: Create the App Registration

1. **Open Azure Portal**: https://portal.azure.com
2. **Navigate to Microsoft Entra ID** (Azure Active Directory)
   - Click the hamburger menu (☰) or search for "Microsoft Entra ID"
3. **Go to App registrations**

   - In the left menu: `App registrations`
   - Click `+ New registration`

4. **Fill in the registration form:**
   - **Name**: `Designetica AI Wireframe Tool`
   - **Supported account types**: Select **"Accounts in this organizational directory only (Microsoft only - Single tenant)"**
     - This restricts to Microsoft employees only
   - **Redirect URI**: Select `Web` and enter:
     ```
     https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback
     ```
   - Click `Register`

---

## Step 2: Configure Authentication

1. **After registration, go to Authentication** (left menu)
2. **Add another redirect URI** (if needed for local testing):
   ```
   http://localhost:5173/.auth/login/aad/callback
   ```
3. **Implicit grant and hybrid flows**:
   - ✅ Check **"ID tokens (used for implicit and hybrid flows)"**
4. **Save** changes

---

## Step 3: Add API Permissions

1. **Go to API permissions** (left menu)
2. **You should see `User.Read` already added**
3. **Add email permission:**
   - Click `+ Add a permission`
   - Select `Microsoft Graph`
   - Select `Delegated permissions`
   - Search for and check: `email`
   - Click `Add permissions`
4. **Grant admin consent** (if you have permissions):
   - Click `Grant admin consent for Microsoft`
   - Confirm

---

## Step 4: Create Client Secret

1. **Go to Certificates & secrets** (left menu)
2. **Click `+ New client secret`**
3. **Add a description**: `Designetica Production Secret`
4. **Expires**: Choose `24 months` (or as per your policy)
5. **Click `Add`**
6. **⚠️ IMPORTANT: Copy the secret VALUE immediately** - you won't be able to see it again!
   - It looks like: `abc123~defg456.hij789klm...`

---

## Step 5: Get Required Information

**Copy these values** - you'll need them for configuration:

1. **Application (client) ID**:

   - On the `Overview` page
   - Example: `12345678-1234-1234-1234-123456789abc`

2. **Directory (tenant) ID**:

   - On the `Overview` page
   - Should be: `72f988bf-86f1-41af-91ab-2d7cd011db47` (Microsoft tenant)

3. **Client Secret Value** (from Step 4)

---

## Step 6: Update Designetica Configuration

Once you have the Client ID and Secret, provide them to me and I'll:

1. Update the Static Web App application settings with new credentials
2. Update staticwebapp.config.json to use Microsoft tenant endpoint
3. Deploy the changes
4. Test authentication with your account and another Microsoft employee

---

## Troubleshooting

### Can't create app registration

- **Error**: "You don't have permission"
- **Solution**: Contact your IT admin or identity team to create the app registration for you
- **Alternative**: Use the Microsoft self-service portal if available

### Can't grant admin consent

- **This is OK!** The app will still work, users will just see a consent prompt on first login
- **Or**: Ask your IT admin to grant admin consent later

### Conditional Access blocks portal

- **Try**: Use InPrivate/Incognito browser window
- **Try**: Access from on-premises network if required
- **Contact**: IT support for assistance

---

## Next Steps

After creating the app registration, reply with:

- ✅ Application (client) ID: `[paste here]`
- ✅ Client Secret Value: `[paste here]`

I'll then update your Designetica app to use these credentials!

---

## Summary

**What we're doing:**

- Creating app registration in **Microsoft tenant** (where all @microsoft.com users exist)
- Keeping Designetica app hosted in **Designetica subscription** (where you have access)
- Separating authentication (Microsoft tenant) from hosting (Designetica subscription)

**Result:**

- ✅ All Microsoft employees can authenticate
- ✅ No need to invite guests
- ✅ App stays in your controlled subscription
