# Designetica Migration Plan: Personal to New Microsoft Account

## Current Setup (Personal Account)

- **Subscription**: Visual Studio Enterprise (4b74d7bc-bb7d-4bab-b21c-d1a3493d40fb)
- **Resource Group**: rg-designetica-aibuilder-prod
- **Location**: East US 2
- **Static Web App**: https://brave-island-04ba9f70f.2.azurestaticapps.net
- **Azure Functions**: https://func-designetica-vjib6nx2wh4a4.azurewebsites.net
- **OpenAI**: cog-designetica-vdlmicyosd4ua.openai.azure.com

## Migration Options

### Option 1: Deploy to New Microsoft Subscription ⭐ (RECOMMENDED - IN PROGRESS)

**Action Required**: Contact your Microsoft administrator

**Request**:

1. **Contributor role** on subscription: `AEP_CorePlatform_Playground_Dev` (84ca48fe-c942-42e5-b492-d56681d058fa)
2. OR access to an **existing resource group** with deployment permissions

**Benefits**:

- ✅ Clean deployment using `azd up`
- ✅ Full infrastructure as code
- ✅ Easy maintenance and updates
- ✅ Automated CI/CD possible

### Option 2: Manual Resource Creation

**If permissions can't be granted immediately**

**Steps**:

1. **Use Azure Portal** to manually create resources:

   - Static Web App
   - Function App
   - Cognitive Services (OpenAI)
   - Application Insights

2. **Deploy code manually**:
   - Upload static site to Static Web App
   - Deploy functions using VS Code Azure extension

**Limitations**:

- ❌ No infrastructure as code
- ❌ Manual maintenance required
- ❌ Harder to replicate

### Option 3: Use Existing Resource Group

**If you can identify a resource group with permissions**

**Command to try**:

```bash
# List available resource groups
az group list --query "[].{Name:name, Location:location}" -o table

# Try deployment to existing group
azd up --environment production-bami --resource-group <existing-rg-name>
```

## Configuration for BAMI Deployment

### Environment Variables for New Account

```bash
# Set these when deploying to BAMI
AZURE_SUBSCRIPTION_ID="84ca48fe-c942-42e5-b492-d56681d058fa"  # AEP_CorePlatform_Playground_Dev
AZURE_LOCATION="eastus2"  # Confirmed available
AZURE_ENV_NAME="production-bami"
AZURE_RESOURCE_GROUP="designetica-bami"  # When permissions available
```

### Required Services in BAMI (All Available)

- ✅ Static Web Apps (no quota limits)
- ✅ Azure Functions (no quota limits)
- ✅ Cognitive Services OpenAI (300k tokens/min available)
- ✅ Application Insights (no quota limits)

## Data Migration (When Applicable)

### What to Export from Personal Account

1. **Application Code** (already in Git)
2. **Configuration Settings** (backed up above)
3. **Custom AI Models/Fine-tuning** (if any)
4. **Analytics Data** (limited export possible)

### What Cannot be Migrated

- ❌ Resource IDs (will be different)
- ❌ Managed Identity assignments
- ❌ Historical logs and metrics
- ❌ SSL certificates (will regenerate)

## Next Steps

### Immediate Actions

1. **Save this plan** for reference
2. **Contact Microsoft admin** for permissions
3. **Test deployment** once permissions granted

### Alternative Quick Start

If you need immediate access:

1. **Use Azure Portal** to manually create a Static Web App
2. **Deploy frontend** directly from GitHub
3. **Create Function App** manually
4. **Configure OpenAI** service manually

### Commands Ready for Deployment

```bash
# Once permissions are granted:
azd auth login
azd env select production-bami
azd up

# Or with specific resource group:
azd up --resource-group <provided-rg-name>
```

## Cost Considerations for BAMI

- **BAMI accounts** typically have spending limits
- **Resource quotas** may be lower than commercial accounts
- **Automatic cleanup** may occur periodically
- **Test/dev pricing** often applies

## Support Contacts

- **Azure Support**: Internal Microsoft channels
- **BAMI Admin**: Your Microsoft sponsor/administrator
- **Subscription Owner**: AEP CorePlatform team
