# 🛡️ CRITICAL BACKUP INFORMATION - DESIGNETICA

**Created:** August 7, 2025 - Before Power Apps Integration
**Status:** ALL SYSTEMS WORKING PERFECTLY ✅

## 🚨 WORKING CONFIGURATION - DO NOT CHANGE WITHOUT BACKUP!

### ✅ Current Working State

- **Frontend**: https://designetica.carlosmarin.net ✅ WORKING
- **Backend API**: https://func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net ✅ WORKING
- **AI Wireframe Generation**: ✅ WORKING (generates custom wireframes matching descriptions)
- **CORS**: ✅ CONFIGURED for both domains
- **Custom Domain SSL**: ✅ WORKING with DigiCert certificate

### 🔧 Critical Environment Variables (Azure Functions)

```
AZURE_OPENAI_ENDPOINT=https://cog-designetica-prod-rjsqzg4bs3fc6.openai.azure.com/
AZURE_OPENAI_KEY=[RETRIEVED FROM AZURE KEY VAULT OR PORTAL]
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-08-01-preview
NODE_ENV=production
```

### 🌐 Critical Azure Resources

- **Resource Group**: rg-Designetica
- **Functions App**: func-designetica-prod-rjsqzg4bs3fc6
- **Static Web App**: swa-designetica-prod-rjsqzg4bs3fc6
- **OpenAI Service**: cog-designetica-prod-rjsqzg4bs3fc6
- **Storage Account**: stdesigneticaprodrjsqzg4
- **Custom Domain**: designetica.carlosmarin.net

### 🔒 CORS Configuration

**Allowed Origins:**

- https://designetica.carlosmarin.net
- https://happy-forest-0e9d7fa0f.2.azurestaticapps.net
- https://make.powerapps.com
- https://make.powerautomate.com
- https://flow.microsoft.com
- https://powerapps.microsoft.com
- https://api.designetica.com

### 📁 File Backups Created

- **Full Repository**: /Users/carlosmarinburgos/designetica-backup-20250807\_\*
- **Git Branch**: working-version (up to date)
- **Critical Files**: All backend fixes preserved

### 🧪 Last Verified Test (WORKING)

```bash
curl -X POST "https://func-designetica-prod-rjsqzg4bs3fc6.azurewebsites.net/api/generate-wireframe" \
-H "Content-Type: application/json" \
-H "Origin: https://designetica.carlosmarin.net" \
-d '{"description": "Create a yellow warning box with black text that says WARNING: TEST MODE", "theme": "minimal"}'
```

**Result**: ✅ `aiGenerated: true` - Generated yellow warning box as requested

## ⚠️ BEFORE ANY POWER APPS CHANGES

1. ✅ Repository backup created
2. ✅ Azure resources documented
3. ✅ Environment variables saved
4. ✅ CORS configuration recorded
5. ✅ Working state verified

**🔥 CRITICAL: Test this curl command before and after any changes to ensure API still works!**
