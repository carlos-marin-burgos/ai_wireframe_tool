# Phase 4: Production Deployment Plan

## 🚀 Azure Production Deployment Strategy

### Overview

Deploy the AI Builder integration Azure Functions to production Azure infrastructure with custom domain, authentication, monitoring, and Power Platform integration.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Azure Production Environment            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │  Azure Functions│    │ Application      │               │
│  │  (Linux Premium)│────│ Insights         │               │
│  │                 │    │                  │               │
│  └─────────────────┘    └──────────────────┘               │
│           │                                                 │
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │  Key Vault      │    │ Storage Account  │               │
│  │  (Secrets)      │    │ (Function Data)  │               │
│  └─────────────────┘    └──────────────────┘               │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┤
│  │              Azure Front Door / CDN                     │
│  │  api.designetica.com/ai-builder/*                      │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
                             │
                    ┌────────────────────┐
                    │  Power Platform    │
                    │  Custom Connector  │
                    │                    │
                    └────────────────────┘
```

## Step 1: Azure Infrastructure Setup

### 1.1 Resource Group Creation

```bash
# Create resource group
az group create \
  --name "rg-designetica-aibuilder-prod" \
  --location "eastus2"
```

### 1.2 Storage Account for Functions

```bash
# Create storage account
az storage account create \
  --name "stdesigneticaaibldr" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --location "eastus2" \
  --sku "Standard_LRS" \
  --kind "StorageV2"
```

### 1.3 Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app "appinsights-designetica-aibuilder" \
  --location "eastus2" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --application-type "web"
```

### 1.4 Key Vault for Secrets

```bash
# Create Key Vault
az keyvault create \
  --name "kv-designetica-aibuilder" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --location "eastus2" \
  --sku "standard"
```

## Step 2: Function App Production Configuration

### 2.1 Create Function App

```bash
# Create Function App with Premium plan
az functionapp plan create \
  --resource-group "rg-designetica-aibuilder-prod" \
  --name "plan-designetica-aibuilder" \
  --location "eastus2" \
  --number-of-workers 1 \
  --sku EP1 \
  --is-linux true

az functionapp create \
  --resource-group "rg-designetica-aibuilder-prod" \
  --plan "plan-designetica-aibuilder" \
  --name "func-designetica-aibuilder" \
  --storage-account "stdesigneticaaibldr" \
  --runtime "node" \
  --runtime-version "20" \
  --os-type "Linux" \
  --app-insights "appinsights-designetica-aibuilder"
```

### 2.2 Configure Function App Settings

```bash
# Store secrets in Key Vault
az keyvault secret set \
  --vault-name "kv-designetica-aibuilder" \
  --name "azure-openai-key" \
  --value "EAXLS3w8Pa05KJjqcv2GgE7KtOb5nNBN2DNbaLfZ8zt4RZN5foAKJQQJ99BGACYeBjFXJ3w3AAABACOGqheY"

# Configure Function App to use Key Vault references
az functionapp config appsettings set \
  --name "func-designetica-aibuilder" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --settings \
    "AZURE_OPENAI_KEY=@Microsoft.KeyVault(VaultName=kv-designetica-aibuilder;SecretName=azure-openai-key)" \
    "AZURE_OPENAI_ENDPOINT=https://cog-designetica-vjib6nx2wh4a4.openai.azure.com/" \
    "AZURE_OPENAI_DEPLOYMENT=gpt-4o" \
    "AZURE_OPENAI_API_VERSION=2024-08-01-preview" \
    "NODE_ENV=production" \
    "AI_BUILDER_ENVIRONMENT=production" \
    "POWER_PLATFORM_ENVIRONMENT=production"
```

## Step 3: Custom Domain and SSL

### 3.1 Custom Domain Setup

```bash
# Add custom domain to Function App
az functionapp config hostname add \
  --webapp-name "func-designetica-aibuilder" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --hostname "api.designetica.com"

# Bind SSL certificate (managed certificate)
az functionapp config ssl bind \
  --certificate-source "AppService" \
  --hostname "api.designetica.com" \
  --name "func-designetica-aibuilder" \
  --resource-group "rg-designetica-aibuilder-prod"
```

### 3.2 DNS Configuration

```
# DNS Record to add to your domain provider:
CNAME api.designetica.com func-designetica-aibuilder.azurewebsites.net
```

## Step 4: Authentication and Security

### 4.1 Azure AD App Registration

```bash
# Create Azure AD App Registration for the Function App
az ad app create \
  --display-name "Designetica AI Builder API" \
  --sign-in-audience "AzureADMyOrg" \
  --web-redirect-uris "https://api.designetica.com/.auth/login/aad/callback"

# Configure Function App Authentication
az functionapp auth config \
  --name "func-designetica-aibuilder" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --enabled true \
  --action "LoginWithAzureActiveDirectory"
```

### 4.2 CORS Configuration

```bash
# Configure CORS for Power Platform
az functionapp cors add \
  --name "func-designetica-aibuilder" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --allowed-origins \
    "https://make.powerapps.com" \
    "https://make.powerautomate.com" \
    "https://flow.microsoft.com" \
    "https://powerapps.microsoft.com"
```

## Step 5: Deployment Process

### 5.1 Prepare Production Build

```bash
# In your local environment
cd /Users/carlosmarinburgos/designetica/backend

# Install production dependencies
npm ci --only=production

# Create deployment package
func azure functionapp publish func-designetica-aibuilder --build remote
```

### 5.2 Alternative: Azure DevOps Pipeline

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - backend/*

variables:
  functionAppName: "func-designetica-aibuilder"
  resourceGroupName: "rg-designetica-aibuilder-prod"

stages:
  - stage: Build
    jobs:
      - job: BuildFunction
        pool:
          vmImage: "ubuntu-latest"
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: "20.x"
            displayName: "Install Node.js"

          - script: |
              cd backend
              npm ci
              npm run build --if-present
            displayName: "npm install and build"

          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: "backend"
              includeRootFolder: false
              archiveType: "zip"
              archiveFile: "$(Build.ArtifactStagingDirectory)/function-app.zip"
            displayName: "Archive function app"

          - publish: "$(Build.ArtifactStagingDirectory)/function-app.zip"
            artifact: "function-app"

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployFunction
        environment: "production"
        pool:
          vmImage: "ubuntu-latest"
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureFunctionApp@1
                  inputs:
                    azureSubscription: "azure-subscription"
                    appType: "functionAppLinux"
                    appName: "$(functionAppName)"
                    package: "$(Pipeline.Workspace)/function-app/function-app.zip"
```

## Step 6: Production Custom Connector

### 6.1 Update Custom Connector Configuration

```json
{
  "swagger": "2.0",
  "info": {
    "title": "Designetica AI Builder Integration - Production",
    "description": "Production AI Builder integration for wireframe analysis and generation",
    "version": "1.0.0"
  },
  "host": "api.designetica.com",
  "basePath": "/api",
  "schemes": ["https"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "securityDefinitions": {
    "azure_auth": {
      "type": "oauth2",
      "authorizationUrl": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      "tokenUrl": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      "flow": "accessCode",
      "scopes": {
        "https://graph.microsoft.com/.default": "Access API"
      }
    }
  },
  "security": [
    {
      "azure_auth": ["https://graph.microsoft.com/.default"]
    }
  ]
}
```

### 6.2 Power Platform Connector Deployment

1. **Export from Development**: Export the working connector from development environment
2. **Import to Production**: Import to production Power Platform environment
3. **Update Host**: Change host from localhost:7072 to api.designetica.com
4. **Test Production**: Validate all endpoints in production environment

## Step 7: Monitoring and Diagnostics

### 7.1 Application Insights Configuration

```bash
# Enable detailed monitoring
az monitor app-insights component update \
  --app "appinsights-designetica-aibuilder" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --retention-time 90
```

### 7.2 Log Analytics Queries

```kusto
// Function execution monitoring
requests
| where cloud_RoleName == "func-designetica-aibuilder"
| summarize count() by operation_Name, resultCode
| order by count_ desc

// Performance monitoring
dependencies
| where cloud_RoleName == "func-designetica-aibuilder"
| summarize avg(duration) by name
| order by avg_duration desc

// Error tracking
exceptions
| where cloud_RoleName == "func-designetica-aibuilder"
| summarize count() by type, outerMessage
| order by count_ desc
```

## Step 8: Backup and Recovery

### 8.1 Automated Backups

```bash
# Create Logic App for automated backups
az logic workflow create \
  --resource-group "rg-designetica-aibuilder-prod" \
  --location "eastus2" \
  --name "backup-designetica-functions" \
  --definition @backup-workflow.json
```

### 8.2 Disaster Recovery Plan

1. **Multi-Region Deployment**: Deploy to secondary region
2. **Traffic Manager**: Configure automatic failover
3. **Data Replication**: Sync Key Vault and storage across regions
4. **Recovery Testing**: Monthly disaster recovery drills

## Step 9: Production Testing

### 9.1 Health Check Endpoints

```bash
# Test production health
curl -X GET "https://api.designetica.com/api/ai-builder/health"

# Test wireframe generation
curl -X POST "https://api.designetica.com/api/generate-wireframe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description": "Production test wireframe", "type": "web"}'
```

### 9.2 Load Testing

```bash
# Install Azure Load Testing CLI
az extension add --name load

# Create load test
az load test create \
  --name "designetica-ai-builder-load-test" \
  --resource-group "rg-designetica-aibuilder-prod" \
  --load-test-config-file "load-test-config.yaml"
```

## Step 10: Go-Live Checklist

### Pre-Deployment

- [ ] All secrets stored in Key Vault
- [ ] Custom domain configured and SSL enabled
- [ ] Authentication configured
- [ ] CORS settings applied for Power Platform
- [ ] Application Insights enabled
- [ ] Backup strategy implemented

### Post-Deployment

- [ ] Health endpoints responding correctly
- [ ] Custom connector updated in Power Platform
- [ ] Load testing completed successfully
- [ ] Monitoring dashboards configured
- [ ] Documentation updated with production URLs
- [ ] Team trained on production operations

### Power Platform Integration

- [ ] Custom connector published to organization
- [ ] Sample Canvas Apps updated for production
- [ ] Power Automate flows tested in production
- [ ] User access permissions configured
- [ ] Training materials updated

---

## 🎯 Success Criteria

✅ **Azure Functions deployed to production with premium hosting**  
✅ **Custom domain with SSL certificate configured**  
✅ **Authentication and authorization implemented**  
✅ **Monitoring and alerting operational**  
✅ **Power Platform custom connector working in production**  
✅ **Load testing validates performance requirements**  
✅ **Backup and disaster recovery plan implemented**

**Estimated Timeline**: 2-3 days for full production deployment  
**Next Phase**: User adoption and feature enhancement based on production feedback

Ready to begin the production deployment process! 🚀
