# BAMI Subscription - Azure AD App Registration Guide

## 🚨 Issue

Your BAMI subscription has **Conditional Access policies** that block programmatic app registration via Azure CLI. You need to use the **Azure Portal** instead.

---

## ✅ Step-by-Step: Register App via Azure Portal

### 1. **Go to Azure Portal**

https://portal.azure.com

### 2. **Navigate to Azure Active Directory**

- Click the hamburger menu (☰) → **Azure Active Directory**
- Or search for "Azure Active Directory" in the top search bar

### 3. **Go to App Registrations**

- In the left sidebar, click **App registrations**
- Click **+ New registration**

### 4. **Fill in Registration Details**

```
Name: Designetica Wireframe Tool - BAMI

Supported account types:
  ⭕ Accounts in this organizational directory only
     (Microsoft only - Single tenant)

Redirect URI:
  Platform: Web
  URI: https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback
```

Click **Register**

### 5. **Copy the Application (Client) ID**

After registration, you'll see:

- **Application (client) ID**: `[COPY THIS - looks like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx]`
- **Directory (tenant) ID**: `72f988bf-86f1-41af-91ab-2d7cd011db47` (should match)

### 6. **Create a Client Secret**

- In the left sidebar, click **Certificates & secrets**
- Click **+ New client secret**
- Description: `BAMI Production Secret`
- Expires: **24 months** (recommended)
- Click **Add**
- **⚠️ IMMEDIATELY COPY THE SECRET VALUE** - You won't see it again!

---

## 🔐 After Registration

Once you have both values, run:

```bash
./configure-auth-secrets.sh
```

When prompted:

1. **Client ID**: Paste the Application (client) ID you copied
2. **Client Secret**: Paste the secret value you copied

Then deploy:

```bash
azd deploy --no-prompt
```

---

## 📋 Expected Values

After registration, you should have:

```
Application (client) ID: [NEW-CLIENT-ID]
Tenant ID: 72f988bf-86f1-41af-91ab-2d7cd011db47
Client Secret: [SECRET-VALUE]
Redirect URI: https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback
```

---

## ⚠️ Important Notes for BAMI

1. **Tenant**: Must be `72f988bf-86f1-41af-91ab-2d7cd011db47` (Microsoft corporate tenant)
2. **Account Type**: Must be "Single tenant" (Microsoft only)
3. **Redirect URI**: Must exactly match your Static Web App URL
4. **Conditional Access**: Portal bypasses CLI restrictions

---

## 🧪 After Configuration

Test at: https://delightful-pond-064d9a91e.1.azurestaticapps.net/

You should:

1. Be redirected to Microsoft login
2. Sign in with your @microsoft.com account (camarinb@microsoft.com)
3. Access the app after authentication

---

**Current Status**: Waiting for manual app registration via Azure Portal due to BAMI conditional access policies.
