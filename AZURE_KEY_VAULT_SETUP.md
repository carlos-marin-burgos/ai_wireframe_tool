# 🔐 Azure Key Vault Setup Guide

**Date:** October 9, 2025  
**Purpose:** Migrate secrets from environment variables to Azure Key Vault

---

## 📋 Prerequisites

- Access to Azure Portal
- Contributor role on `rg-designetica-prod`
- Function App: `func-designetica-prod-vmlmp4vej4ckc`

---

## 🚀 Step 1: Create Azure Key Vault

### **Via Azure Portal:**

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Key vaults"
3. Click **+ Create**
4. Fill in:
   - **Subscription:** OFP-TPA-drspott
   - **Resource group:** `rg-designetica-prod`
   - **Key vault name:** `kv-designetica-prod` (must be globally unique)
   - **Region:** West US 2 (same as your Function App)
   - **Pricing tier:** Standard
5. Click **Review + Create** → **Create**

### **Via Azure CLI (if you get access):**

```bash
az keyvault create \
  --name kv-designetica-prod \
  --resource-group rg-designetica-prod \
  --location westus2
```

---

## 🔑 Step 2: Add Secrets to Key Vault

Go to your Key Vault → **Secrets** → **+ Generate/Import**

### **Add these secrets:**

| Secret Name            | Value                       | Source                            |
| ---------------------- | --------------------------- | --------------------------------- |
| `AZURE-OPENAI-API-KEY` | Your regenerated OpenAI key | Azure Portal → Cognitive Services |
| `FIGMA-CLIENT-ID`      | Your Figma client ID        | Figma developers portal           |
| `FIGMA-CLIENT-SECRET`  | Your Figma client secret    | Figma developers portal           |
| `AZURE-CLIENT-SECRET`  | Your Azure AD client secret | App Registration                  |

**Note:** Key Vault secret names use hyphens, not underscores.

---

## 🔐 Step 3: Enable Managed Identity for Function App

1. Go to **Function App** → `func-designetica-prod-vmlmp4vej4ckc`
2. Click **Identity** (left menu)
3. Under **System assigned** tab:
   - Toggle **Status** to **On**
   - Click **Save**
   - Copy the **Object (principal) ID** that appears

---

## 🔓 Step 4: Grant Function App Access to Key Vault

1. Go back to your **Key Vault** → `kv-designetica-prod`
2. Click **Access policies** (left menu)
3. Click **+ Create**
4. **Permissions:**
   - Secret permissions: Select **Get** and **List**
5. **Principal:**
   - Search for `func-designetica-prod-vmlmp4vej4ckc`
   - Select it
6. Click **Review + Create** → **Create**

---

## ⚙️ Step 5: Update Function App Settings

Go to **Function App** → **Environment variables** → **App settings**

### **Update these settings:**

**Before (current):**

```
AZURE_OPENAI_API_KEY = actual-key-value-here
FIGMA_CLIENT_ID = actual-client-id-here
FIGMA_CLIENT_SECRET = actual-secret-here
```

**After (Key Vault references):**

```
AZURE_OPENAI_API_KEY = @Microsoft.KeyVault(SecretUri=https://kv-designetica-prod.vault.azure.net/secrets/AZURE-OPENAI-API-KEY/)
FIGMA_CLIENT_ID = @Microsoft.KeyVault(SecretUri=https://kv-designetica-prod.vault.azure.net/secrets/FIGMA-CLIENT-ID/)
FIGMA_CLIENT_SECRET = @Microsoft.KeyVault(SecretUri=https://kv-designetica-prod.vault.azure.net/secrets/FIGMA-CLIENT-SECRET/)
```

**How to update:**

1. Click **Advanced edit**
2. Replace the value with Key Vault reference format above
3. Or use **+ Add** → Choose "Key Vault Reference" type
4. Click **Apply** and **Save**

---

## 🧪 Step 6: Test the Configuration

### **Test 1: Verify Key Vault Connection**

1. Go to Function App → **Environment variables**
2. Each Key Vault reference should show a **green checkmark** ✅
3. If you see a **red X** ❌, check:
   - Managed Identity is enabled
   - Access policy is configured correctly
   - Secret names match exactly

### **Test 2: Test Function Endpoint**

```bash
curl https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/health
```

Should return `200 OK`

### **Test 3: Monitor Application Insights**

1. Go to Function App → **Application Insights**
2. Check logs for any Key Vault access errors
3. Look for successful secret retrieval messages

---

## 📊 Benefits of Key Vault

✅ **Centralized secret management** - All secrets in one place  
✅ **Automatic rotation** - Can be configured for auto-rotation  
✅ **Audit logging** - Track who accesses secrets and when  
✅ **Access control** - Fine-grained permissions  
✅ **Encryption** - Secrets encrypted at rest  
✅ **No secrets in code** - References only, not actual values

---

## 🔄 Secret Rotation Process

When you need to rotate a secret:

1. **Update in Key Vault:**

   - Go to Key Vault → Secrets
   - Click the secret name
   - Click **+ New Version**
   - Add the new secret value
   - Click **Create**

2. **Function App automatically picks up new version**
   - No code changes needed
   - No Function App restart needed
   - Changes take effect within minutes

---

## 🧹 Step 7: Clean Up (After Verification)

Once Key Vault is working:

1. **Remove old app settings:**

   - Delete the direct secret values from Function App settings
   - Keep only the Key Vault references

2. **Delete local .env files:**

   ```bash
   # Add to .gitignore if not already there
   echo ".env" >> .gitignore
   echo ".env.local" >> .gitignore

   # Remove from your local machine (optional)
   rm backend/.env 2>/dev/null
   ```

3. **Update documentation:**
   - Update README with Key Vault setup instructions
   - Remove any references to storing secrets in .env files

---

## 📝 Key Vault Reference Format

```
@Microsoft.KeyVault(SecretUri=https://<vault-name>.vault.azure.net/secrets/<secret-name>/)
```

**Components:**

- `<vault-name>`: Your Key Vault name (e.g., `kv-designetica-prod`)
- `<secret-name>`: The secret name in Key Vault (use hyphens, not underscores)

**Optional - Pin to specific version:**

```
@Microsoft.KeyVault(SecretUri=https://kv-designetica-prod.vault.azure.net/secrets/AZURE-OPENAI-API-KEY/abc123)
```

(Not recommended - prevents automatic rotation)

---

## 🐛 Troubleshooting

### **Error: "Key Vault secret not found"**

- Verify secret name matches exactly (case-sensitive)
- Check secret hasn't expired
- Ensure secret URI is correct

### **Error: "Access denied"**

- Verify Managed Identity is enabled
- Check access policy includes "Get" and "List" permissions
- Confirm Function App's identity is added to access policy

### **Error: "Configuration reference failed"**

- Restart the Function App
- Check Key Vault firewall settings
- Verify no network restrictions blocking access

---

## 📚 Additional Resources

- [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
- [Use Key Vault references for App Service](https://docs.microsoft.com/azure/app-service/app-service-key-vault-references)
- [Managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/)

---

## ✅ Completion Checklist

- [ ] Key Vault created in `rg-designetica-prod`
- [ ] All secrets added to Key Vault
- [ ] Managed Identity enabled on Function App
- [ ] Access policy configured for Function App
- [ ] App settings updated with Key Vault references
- [ ] Green checkmarks showing for all references
- [ ] API endpoints tested and working
- [ ] Old secret values removed from app settings
- [ ] Local .env files cleaned up
- [ ] Documentation updated

---

**Status:** Ready to implement  
**Estimated time:** 30 minutes  
**Last updated:** October 9, 2025
