targetScope = 'resourceGroup'

metadata name = 'Designetica AI Wireframe Generator'
metadata description = 'Complete Azure infrastructure for Designetica AI wireframe generation platform'

@minLength(1)
@maxLength(64)
@description('Name of the environment. Used for generating resource names.')
param environmentName string = 'designetica'

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

@description('Location for OpenAI resources')
param openAiLocation string = 'eastus2'

@description('SKU name for the OpenAI service')
param openAiSkuName string = 'S0'

@description('GitHub username or organization for the repository')
param gitHubUserName string = ''

@description('Name of the GitHub repository')
param repositoryName string = 'designetica'

@description('Model deployments for Azure OpenAI')
param openAiModelDeployments array = [
  {
    name: 'gpt-4o'
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-08-06'
    }
    sku: {
      name: 'Standard'
      capacity: 10
    }
  }
]

// Generate a unique token for resource naming
var uniqueSuffix = uniqueString(subscription().id, resourceGroup().id, location, environmentName)
var abbreviations = loadJsonContent('abbreviations.json')

// Resource names using the token
<<<<<<< HEAD
var openAiAccountName = take('${abbreviations.cognitiveServices}-${environmentName}-${uniqueSuffix}', 64)
var storageAccountName = take('${abbreviations.storageAccount}${replace(environmentName, '-', '')}${uniqueSuffix}', 24)
var logAnalyticsName = take('${abbreviations.logAnalyticsWorkspace}-${environmentName}-${uniqueSuffix}', 63)
var applicationInsightsName = '${abbreviations.applicationInsights}-${environmentName}-${uniqueSuffix}'
var userAssignedIdentityName = '${abbreviations.userAssignedIdentity}-${environmentName}-${uniqueSuffix}'
var staticWebAppName = '${abbreviations.staticWebApp}-${environmentName}-${uniqueSuffix}'
=======
var openAiAccountName = take('${abbreviations.cognitiveServices}-${environmentName}-${resourceToken}', 64)
var storageAccountName = take('${abbreviations.storageAccount}${replace(environmentName, '-', '')}${resourceToken}', 24)
var logAnalyticsName = take('${abbreviations.logAnalyticsWorkspace}-${environmentName}-${resourceToken}', 63)
var applicationInsightsName = '${abbreviations.applicationInsights}-${environmentName}-${resourceToken}'
var userAssignedIdentityName = '${abbreviations.userAssignedIdentity}-${environmentName}-${resourceToken}'
var staticWebAppName = '${abbreviations.staticWebApp}-${environmentName}-${resourceToken}'
var keyVaultName = take('${abbreviations.keyVault}-${environmentName}-${resourceToken}', 24)
var functionAppName = '${abbreviations.functionApp}-${environmentName}-${resourceToken}'
var appServicePlanName = '${abbreviations.appServicePlan}-${environmentName}-${resourceToken}'
>>>>>>> c45591cd7c4527069b42e97fad093bcdd3b64ed7

// Tags for all resources
var tags = {
  'azd-env-name': environmentName
  environment: environmentName
  project: 'designetica'
  purpose: 'ai-wireframe-generator'
}

// Frontend service specific tags
var frontendTags = union(tags, {
  'azd-service-name': 'frontend'
})

// Create user-assigned managed identity
resource userAssignedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: userAssignedIdentityName
  location: location
  tags: tags
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      searchVersion: 1
      legacy: 0
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// Key Vault for secure secrets management
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

// Storage Account for Functions
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    dnsEndpointType: 'Standard'
    defaultToOAuthAuthentication: false
    publicNetworkAccess: 'Enabled'
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      requireInfrastructureEncryption: false
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

// Azure OpenAI Account
resource openAiAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: openAiAccountName
  location: openAiLocation
  tags: tags
  sku: {
    name: openAiSkuName
  }
  kind: 'OpenAI'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity.id}': {}
    }
  }
  properties: {
    customSubDomainName: openAiAccountName
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
  }
}

// OpenAI Model Deployments
resource openAiModelDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = [
  for deployment in openAiModelDeployments: {
    parent: openAiAccount
    name: deployment.name
    properties: {
      model: deployment.model
      raiPolicyName: deployment.?raiPolicyName
    }
    sku: deployment.sku
  }
]

// App Service Plan for Azure Functions (Premium)
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

// Azure Functions App for AI Builder Integration
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
          'https://api.designetica.com'
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

// Note: Using Static Web App with integrated APIs instead of separate Function App
// This provides better integration and simpler deployment

// Optimized role assignments (removed redundant ones)
// Storage Blob Data Owner includes both Contributor and Reader permissions
resource storageBlobDataOwnerRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, userAssignedIdentity.id, 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
    ) // Storage Blob Data Owner
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Storage Queue Data Contributor role assignment to managed identity
resource storageQueueDataContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, userAssignedIdentity.id, '974c5e8b-45b9-4653-ba55-5f855dd0fb88')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '974c5e8b-45b9-4653-ba55-5f855dd0fb88'
    ) // Storage Queue Data Contributor
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Storage Blob Data Contributor role assignment to managed identity
resource storageBlobDataContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, userAssignedIdentity.id, 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
    ) // Storage Blob Data Contributor
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Cognitive Services User role assignment to managed identity
resource cognitiveServicesUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openAiAccount.id, userAssignedIdentity.id, 'a97b65f3-24c7-4388-baec-2e87135dc908')
  scope: openAiAccount
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      'a97b65f3-24c7-4388-baec-2e87135dc908'
    ) // Cognitive Services User
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Note: Storage Blob Data Contributor role is redundant since Storage Blob Data Owner already provides all blob permissions

// Storage Table Data Contributor role assignment to managed identity
resource storageTableDataContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, userAssignedIdentity.id, '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3'
    ) // Storage Table Data Contributor
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Monitoring Metrics Publisher role assignment to managed identity
resource monitoringMetricsPublisherRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(applicationInsights.id, userAssignedIdentity.id, '3913510d-42f4-4e42-8a64-420c390055eb')
  scope: applicationInsights
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '3913510d-42f4-4e42-8a64-420c390055eb'
    ) // Monitoring Metrics Publisher
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Key Vault Secrets User role assignment to managed identity
resource keyVaultSecretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, userAssignedIdentity.id, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '4633458b-17de-408a-b874-0445c86b69e6'
    ) // Key Vault Secrets User
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Note: Static Web App settings must be configured separately 
// since the existing Static Web App is in a different resource group (rg-Designetica)
// Configure these settings manually or through a separate deployment:
// - AZURE_OPENAI_ENDPOINT: {openAiAccount.properties.endpoint}
// - AZURE_OPENAI_API_VERSION: '2024-08-01-preview'
// - FUNCTIONS_ENDPOINT: 'https://{functionApp.properties.defaultHostName}'

// ========================================
// Function App for Backend APIs
// ========================================
var functionAppName = '${abbreviations.functionApp}-${environmentName}-${uniqueSuffix}'
var hostingPlanName = '${abbreviations.appServicePlan}-${environmentName}-${uniqueSuffix}'

resource hostingPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: hostingPlanName
  location: 'eastus2'
  tags: tags
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {
    reserved: false
  }
}

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: functionAppName
  location: 'eastus2'
  kind: 'functionapp'
  tags: union(tags, {
    'azd-service-name': 'backend'
  })
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
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
          name: 'AZURE_OPENAI_KEY'
          value: openAiAccount.listKeys().key1
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://brave-island-04ba9f70f.2.azurestaticapps.net'
          'https://make.powerapps.com'
          'https://make.powerautomate.com'
          'https://flow.microsoft.com'
          'https://powerapps.microsoft.com'
          'http://localhost:5173'
          'https://localhost:5173'
        ]
        supportCredentials: false
      }
    }
    httpsOnly: true
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity.id}': {}
    }
  }
}

// ========================================
// Static Web App for Frontend with Integrated APIs
// ========================================
resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: 'eastus2'
  tags: frontendTags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: 'https://github.com/carlos-marin-burgos/ai_wireframe_tool'
    branch: 'main'
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist'
      apiLocation: 'backend'
    }
  }
}

// Configure Static Web App application settings
resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2024-04-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    AZURE_OPENAI_ENDPOINT: openAiAccount.properties.endpoint
    AZURE_OPENAI_API_VERSION: '2024-08-01-preview'
    AZURE_CLIENT_ID: userAssignedIdentity.properties.clientId
    APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsights.properties.ConnectionString
    FUNCTIONS_ENDPOINT: 'https://${functionApp.properties.defaultHostName}'
  }
}

// Output values
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = resourceGroup().name
output RESOURCE_GROUP_ID string = resourceGroup().id

output AZURE_OPENAI_ENDPOINT string = openAiAccount.properties.endpoint
output AZURE_OPENAI_ACCOUNT_NAME string = openAiAccount.name

output AZURE_USER_ASSIGNED_IDENTITY_NAME string = userAssignedIdentity.name
output AZURE_USER_ASSIGNED_IDENTITY_CLIENT_ID string = userAssignedIdentity.properties.clientId

output AZURE_STORAGE_ACCOUNT_NAME string = storageAccount.name
output AZURE_APPLICATION_INSIGHTS_NAME string = applicationInsights.name
output AZURE_LOG_ANALYTICS_WORKSPACE_NAME string = logAnalyticsWorkspace.name

// Function App outputs
output AZURE_FUNCTION_APP_NAME string = functionApp.name
output AZURE_FUNCTION_APP_URL string = 'https://${functionApp.properties.defaultHostName}'
output AZURE_FUNCTION_APP_HOSTNAME string = functionApp.properties.defaultHostName

// Key Vault outputs
output AZURE_KEY_VAULT_NAME string = keyVault.name
output AZURE_KEY_VAULT_URL string = keyVault.properties.vaultUri

// Static Web App outputs
output AZURE_STATIC_WEB_APP_NAME string = staticWebApp.name
output AZURE_STATIC_WEB_APP_URL string = 'https://${staticWebApp.properties.defaultHostname}'
output AZURE_STATIC_WEB_APP_HOSTNAME string = staticWebApp.properties.defaultHostname
