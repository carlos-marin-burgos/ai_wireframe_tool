# Feedback System Setup Guide

## Overview

This guide will help you set up the feedback system with Azure Cosmos DB to store user feedback.

## Prerequisites

- Azure subscription
- Azure Cosmos DB account (or you can create one)
- Azure Functions deployed

## Step 1: Create/Configure Cosmos DB

### Option A: Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Azure Cosmos DB" and click "Create"
3. Choose "Azure Cosmos DB for NoSQL"
4. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Use same as your function app (e.g., `rg-designetica-prod`)
   - **Account Name**: e.g., `cosmos-designetica-prod`
   - **Location**: Same as your function app
   - **Capacity mode**: Serverless (recommended for lower cost)
5. Click "Review + Create" then "Create"

### Option B: Using Azure CLI

```bash
# Set variables
RESOURCE_GROUP="rg-designetica-prod"
COSMOS_ACCOUNT="cosmos-designetica-prod"
LOCATION="eastus"  # or your preferred location
DATABASE_NAME="designetica"
CONTAINER_NAME="feedback"

# Create Cosmos DB account (Serverless)
az cosmosdb create \
  --name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --locations regionName=$LOCATION \
  --capabilities EnableServerless \
  --kind GlobalDocumentDB

# Create database
az cosmosdb sql database create \
  --account-name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --name $DATABASE_NAME

# Create container for feedback
az cosmosdb sql container create \
  --account-name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --database-name $DATABASE_NAME \
  --name $CONTAINER_NAME \
  --partition-key-path "/type" \
  --throughput 400
```

## Step 2: Get Cosmos DB Connection Details

### Using Azure Portal:

1. Navigate to your Cosmos DB account
2. Go to "Keys" under Settings
3. Copy:
   - **URI** (this is your COSMOS_ENDPOINT)
   - **PRIMARY KEY** (this is your COSMOS_KEY)

### Using Azure CLI:

```bash
# Get endpoint
az cosmosdb show \
  --name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query documentEndpoint \
  --output tsv

# Get primary key
az cosmosdb keys list \
  --name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query primaryMasterKey \
  --output tsv
```

## Step 3: Configure Environment Variables

### For Local Development:

Add to `backend/.env`:

```bash
# Cosmos DB Configuration for Feedback
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
COSMOS_DATABASE_ID=designetica
COSMOS_FEEDBACK_CONTAINER_ID=feedback
```

### For Azure Functions (Production):

```bash
# Using Azure CLI
az functionapp config appsettings set \
  --name func-designetica-prod-vmlmp4vej4ckc \
  --resource-group rg-designetica-prod \
  --settings \
    COSMOS_ENDPOINT="https://your-cosmos-account.documents.azure.com:443/" \
    COSMOS_KEY="your-primary-key-here" \
    COSMOS_DATABASE_ID="designetica" \
    COSMOS_FEEDBACK_CONTAINER_ID="feedback"
```

Or using Azure Portal:

1. Go to your Function App
2. Click "Configuration" under Settings
3. Add new application settings for each variable above

## Step 4: Install Cosmos DB SDK

Make sure the Cosmos DB SDK is installed in your backend:

```bash
cd backend
npm install @azure/cosmos
```

## Step 5: Test the Feedback System

### Test locally:

```bash
cd backend
npm start

# In another terminal, test the endpoint:
curl -X POST http://localhost:7071/api/submit-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "type": "general",
    "rating": 5,
    "message": "Test feedback",
    "email": "test@example.com",
    "metadata": {
      "userAgent": "Test",
      "url": "http://localhost:5173"
    }
  }'
```

### Test in production:

Use the frontend feedback form, or test directly:

```bash
curl -X POST https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/submit-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "type": "general",
    "rating": 5,
    "message": "Test feedback from production",
    "email": "test@example.com",
    "metadata": {
      "userAgent": "Mozilla/5.0",
      "url": "https://delightful-pond-064d9a91e.1.azurestaticapps.net"
    }
  }'
```

## Step 6: View Feedback Data

### Using Azure Portal:

1. Go to your Cosmos DB account
2. Click "Data Explorer"
3. Navigate to: designetica → feedback → Items
4. You'll see all submitted feedback

### Using Azure CLI:

```bash
# Query all feedback
az cosmosdb sql container query \
  --account-name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --database-name $DATABASE_NAME \
  --name $CONTAINER_NAME \
  --query-text "SELECT * FROM c ORDER BY c.createdAt DESC"
```

## Feedback Document Structure

Each feedback document stored in Cosmos DB has this structure:

```json
{
  "id": "feedback-1696800000000-abc123xyz",
  "type": "bug|feature|general|praise",
  "rating": 4,
  "message": "User feedback message here",
  "email": "user@example.com",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "url": "https://...",
    "viewport": "1920x1080",
    "timestamp": "2025-10-08T16:00:00.000Z",
    "submittedAt": "2025-10-08T16:00:00.000Z",
    "ipAddress": "1.2.3.4"
  },
  "status": "new",
  "createdAt": "2025-10-08T16:00:00.000Z"
}
```

## Cost Optimization

- **Serverless mode**: Recommended for feedback (pay per request)
- **Provisioned throughput**: Only if you expect high volume
- **TTL (Time To Live)**: Optionally set to auto-delete old feedback after X days

## Monitoring

Monitor feedback in Azure Portal:

1. Go to Cosmos DB → Metrics
2. Check:
   - Request Units consumed
   - Total Requests
   - Storage usage

## Security Best Practices

1. ✅ Never commit Cosmos DB keys to source control
2. ✅ Use Key Vault for production secrets (optional but recommended)
3. ✅ Rotate keys periodically
4. ✅ Use serverless mode to control costs
5. ✅ Enable firewall rules if needed

## Troubleshooting

### "Database configuration error"

- Check that COSMOS_ENDPOINT and COSMOS_KEY are set correctly
- Verify the endpoint URL format includes `https://` and port `:443/`

### "Request rate too large" (429 errors)

- Increase throughput or switch to serverless mode
- Add retry logic (already built into SDK)

### "Unauthorized" errors

- Verify the COSMOS_KEY is correct
- Check that the key hasn't been regenerated

## Next Steps

1. Set up email notifications when feedback is received (optional)
2. Create a dashboard to view feedback analytics
3. Add feedback categories and tagging
4. Implement feedback status workflow (new → reviewed → resolved)

## Support

For issues, check:

- Azure Cosmos DB documentation: https://docs.microsoft.com/azure/cosmos-db/
- Function app logs in Azure Portal
- Browser console for frontend errors
