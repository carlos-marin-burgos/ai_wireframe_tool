# How to Check Which Tenant an App Registration Belongs To

## Method 1: Azure Portal - Direct Link

**Check the app you just mentioned:**

1. Open this link in your browser:

   ```
   https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/e28aa9b0-8153-4fa8-82ea-8ea9aac158??/isMSAApp~/false
   ```

   (Replace the ?? with the last 2 characters of your Client ID)

2. **Look at the URL after it loads** - it will show the tenant:

   - If URL contains: `72f988bf-86f1-41af-91ab-2d7cd011db47` → **Microsoft tenant** ✅
   - If URL contains: `54ad0b60-7fda-456b-b965-230c533f1418` → **Designetica tenant**

3. **Or look at the "Directory (tenant) ID"** field on the Overview page

---

## Method 2: Azure Portal - Search

1. **Go to Azure Portal**: https://portal.azure.com

2. **Search for "App registrations"** in the top search bar

3. **Make sure you're looking at the right tenant:**

   - Look at the top right corner - your account name
   - Click on it → "Switch directory"
   - You'll see which tenant you're viewing

4. **Check "Owned applications" or "All applications"** tab

   - Search for: `e28aa9b0-8153-4fa8-82ea-8ea9aac158`
   - Or search by name: "Designetica"

5. **Click on the app** → On the Overview page:
   - **Application (client) ID**: This is what you're looking for
   - **Directory (tenant) ID**: This tells you which tenant it's in
     - `72f988bf-86f1-41af-91ab-2d7cd011db47` = Microsoft tenant ✅
     - `54ad0b60-7fda-456b-b965-230c533f1418` = Designetica tenant

---

## Method 3: Check Your Existing App Registrations

You have these app registrations already configured:

### App 1: `601ccf59-8309-4c7b-b4e3-b4d2ab99d29e`

- **Location**: Found in `.env.local` as `VITE_AZURE_CLIENT_ID`
- **Check tenant**: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/601ccf59-8309-4c7b-b4e3-b4d2ab99d29e

### App 2: `b82c2a93-996a-475a-9117-4384d229a70b`

- **Location**: Currently used in Static Web App (AZURE_CLIENT_ID)
- **Tenant**: Designetica tenant (54ad0b60-7fda-456b-b965-230c533f1418) ✅ Confirmed
- **Check**: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/b82c2a93-996a-475a-9117-4384d229a70b

### App 3: `e28aa9b0-8153-4fa8-82ea-8ea9aac158??` (New one you mentioned)

- **Need to find**: Complete Client ID and which tenant it's in

---

## What We Need to Know

For the app registration in **Microsoft tenant**, I need:

1. ✅ **Complete Client ID** (36 characters):

   - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - You said: `e28aa9b0-8153-4fa8-82ea-8ea9aac158` (seems incomplete)

2. ✅ **Client Secret Value**:

   - Go to: App registration → "Certificates & secrets"
   - If you don't have one, create a new client secret
   - Copy the **Value** (not the Secret ID)
   - Format: `abc123~defg456.hij789klm...`

3. ✅ **Confirm Tenant**:
   - Directory (tenant) ID should be: `72f988bf-86f1-41af-91ab-2d7cd011db47` (Microsoft tenant)

---

## Quick Actions

**Option A: Use existing app `601ccf59-8309-4c7b-b4e3-b4d2ab99d29e`**

- Check if this is in Microsoft tenant
- If yes, just need the client secret
- Then I can configure it immediately

**Option B: Use new app `e28aa9b0-8153-4fa8-82ea-8ea9aac158??`**

- Get complete Client ID
- Get client secret
- Confirm it's in Microsoft tenant
- Then I can configure it

**Option C: Create new app registration**

- Follow the guide: `MICROSOFT_TENANT_APP_REGISTRATION_GUIDE.md`
- Create fresh app in Microsoft tenant
- Get Client ID and Secret

---

## Next Steps

1. Check which of your apps is in the **Microsoft tenant** (72f988bf-86f1...)
2. Get the **complete Client ID** (36 characters)
3. Get the **Client Secret value**
4. Reply with those 2 values
5. I'll configure and deploy! 🚀
