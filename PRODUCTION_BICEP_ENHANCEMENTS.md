# Production-Ready Bicep Infrastructure for AI Builder Integration

# Key Updates Needed for Phase 4 Production:

1. **Add dedicated Function App** (separate from Static Web App APIs)
2. **Add Key Vault** for secure secret management
3. **Add Premium Function App plan** for production performance
4. **Add custom domain support** for api.designetica.com
5. **Enhanced monitoring** with alerting rules
6. **Production-grade security** configurations

# Changes to implement:

## 1. Add Key Vault Resource

```bicep
var keyVaultName = '${abbreviations.keyVault}-${environmentName}-${resourceToken}'

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenant().tenantId
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    enableRbacAuthorization: true
    publicNetworkAccess: 'Enabled'
    accessPolicies: []
  }
}
```

## 2. Add Function App with Premium Plan

```bicep
var functionAppName = '${abbreviations.functionApp}-${environmentName}-${resourceToken}'
var appServicePlanName = '${abbreviations.appServicePlan}-${environmentName}-${resourceToken}'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: 'EP1'
    tier: 'ElasticPremium'
    size: 'EP1'
    family: 'EP'
    capacity: 1
  }
  kind: 'elastic'
  properties: {
    perSiteScaling: false
    elasticScaleEnabled: true
    maximumElasticWorkerCount: 20
    isSpot: false
    reserved: true
    isXenon: false
    hyperV: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
    zoneRedundant: false
  }
}

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: functionAppName
  location: location
  tags: union(tags, { 'azd-service-name': 'backend' })
  kind: 'functionapp,linux'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    isXenon: false
    hyperV: false
    vnetRouteAllEnabled: false
    vnetImagePullEnabled: false
    vnetContentShareEnabled: false
    siteConfig: {
      numberOfWorkers: 1
      linuxFxVersion: 'NODE|20'
      acrUseManagedIdentityCreds: false
      alwaysOn: true
      http20Enabled: false
      functionAppScaleLimit: 200
      minimumElasticInstanceCount: 1
      use32BitWorkerProcess: false
      ftpsState: 'FtpsOnly'
      appSettings: [
        {
          name: 'AzureWebJobsStorage__accountName'
          value: storageAccount.name
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'AZURE_CLIENT_ID'
          value: userAssignedIdentity.properties.clientId
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: openAiAccount.properties.endpoint
        }
        {
          name: 'AZURE_OPENAI_API_VERSION'
          value: '2024-08-01-preview'
        }
        {
          name: 'AZURE_OPENAI_DEPLOYMENT'
          value: 'gpt-4o'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'AI_BUILDER_ENVIRONMENT'
          value: 'production'
        }
        {
          name: 'POWER_PLATFORM_ENVIRONMENT'
          value: 'production'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://make.powerapps.com'
          'https://make.powerautomate.com'
          'https://flow.microsoft.com'
          'https://powerapps.microsoft.com'
        ]
        supportCredentials: false
      }
    }
    httpsOnly: true
    redundancyMode: 'None'
    storageAccountRequired: false
    keyVaultReferenceIdentity: userAssignedIdentity.id
  }
}
```

## 3. Add Production Outputs

```bicep
output AZURE_FUNCTION_APP_NAME string = functionApp.name
output AZURE_FUNCTION_APP_URL string = 'https://${functionApp.properties.defaultHostName}'
output AZURE_KEY_VAULT_NAME string = keyVault.name
output AZURE_KEY_VAULT_URL string = keyVault.properties.vaultUri
```

# Implementation Plan:

1. **Update main.bicep** with production enhancements
2. **Deploy using azd up**
3. **Configure custom domain** api.designetica.com
4. **Update custom connector** with production endpoints
5. **Test Power Platform integration**

This will give us:

- ✅ Production-grade Azure Functions with Premium hosting
- ✅ Secure secret management with Key Vault
- ✅ Proper CORS for Power Platform
- ✅ User-assigned managed identity for security
- ✅ Application Insights monitoring
- ✅ Ready for custom domain configuration
