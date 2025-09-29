# Azure Functions Migration Commands for BAM Subscription

# Subscription ID: 330eaa36-e19f-4d4c-8dea-37c2332f754d

## Step 1: Authenticate to Azure

az login

## Step 2: Set your specific BAM subscription

az account set --subscription "330eaa36-e19f-4d4c-8dea-37c2332f754d"

## Step 3: Verify you're using the correct subscription

az account show --query "{Name:name, SubscriptionId:id, TenantId:tenantId}" -o table

## Step 4: Find your Function Apps (to verify before migration)

# List all resource groups first

az group list --query "[].name" -o table

# Find Function Apps (replace RESOURCE_GROUP_NAME with your actual RG name)

az functionapp list --resource-group "RESOURCE_GROUP_NAME" --query "[].{Name:name, State:state, Kind:kind, Runtime:siteConfig.linuxFxVersion}" -o table

## Step 5: Deploy the updated infrastructure (this performs the migration)

azd deploy

## Step 6: Verify migration success

# Check the hosting plan after migration

az functionapp show --name "YOUR_FUNCTION_APP_NAME" --resource-group "RESOURCE_GROUP_NAME" --query "{Name:name, Kind:kind, State:state, HostingPlan:appServicePlanId}" -o table

# Test your function endpoints

curl -X GET "https://YOUR_FUNCTION_APP_NAME.azurewebsites.net/api/openai-health"

## Rollback (if needed)

# git checkout HEAD~1 -- infra/main.bicep

# azd deploy
