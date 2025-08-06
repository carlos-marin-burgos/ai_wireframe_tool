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
param openAiLocation string = 'eastus'

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
var resourceToken = toLower(uniqueString(subscription().id, resourceGroup().id, location, environmentName))
var abbreviations = loadJsonContent('abbreviations.json')

// Resource names using the token
var openAiAccountName = take('${abbreviations.cognitiveServices}-${environmentName}-${resourceToken}', 64)
var storageAccountName = take('${abbreviations.storageAccount}${replace(environmentName, '-', '')}${resourceToken}', 24)
var logAnalyticsName = take('${abbreviations.logAnalyticsWorkspace}-${environmentName}-${resourceToken}', 63)
var applicationInsightsName = '${abbreviations.applicationInsights}-${environmentName}-${resourceToken}'
var userAssignedIdentityName = '${abbreviations.userAssignedIdentity}-${environmentName}-${resourceToken}'
var staticWebAppName = '${abbreviations.staticWebApp}-${environmentName}-${resourceToken}'

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

// Note: Static Web App settings must be configured separately 
// since the existing Static Web App is in a different resource group (rg-Designetica)
// Configure these settings manually or through a separate deployment:
// - AZURE_OPENAI_ENDPOINT: {openAiAccount.properties.endpoint}
// - AZURE_OPENAI_API_VERSION: '2024-08-01-preview'
// - FUNCTIONS_ENDPOINT: 'https://{functionApp.properties.defaultHostName}'

// ========================================
// Static Web App for Frontend with Integrated APIs
// ========================================
resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = if (gitHubUserName != '') {
  name: staticWebAppName
  location: location
  tags: frontendTags
  properties: {
    repositoryUrl: 'https://github.com/${gitHubUserName}/${repositoryName}'
    branch: 'main'
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
    buildProperties: {
      skipGithubActionWorkflowGeneration: false
      appLocation: '/'
      apiLocation: 'backend'
      outputLocation: 'dist'
    }
  }
}

// Configure Static Web App application settings
resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2024-04-01' = if (gitHubUserName != '') {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    AZURE_OPENAI_ENDPOINT: openAiAccount.properties.endpoint
    AZURE_OPENAI_API_VERSION: '2024-08-01-preview'
    AZURE_OPENAI_KEY: openAiAccount.listKeys().key1
    AZURE_CLIENT_ID: userAssignedIdentity.properties.clientId
    APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsights.properties.ConnectionString
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

// Static Web App outputs (only if created)
output AZURE_STATIC_WEB_APP_NAME string = gitHubUserName != '' ? staticWebApp.name : 'not-created'
output AZURE_STATIC_WEB_APP_URL string = gitHubUserName != ''
  ? 'https://${staticWebApp!.properties.defaultHostname}'
  : 'not-created'
output AZURE_STATIC_WEB_APP_HOSTNAME string = gitHubUserName != ''
  ? staticWebApp!.properties.defaultHostname
  : 'not-created'
