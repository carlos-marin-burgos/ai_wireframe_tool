# Quick Cosmos DB Setup for Feedback System

## Step 1: Create Cosmos DB in Azure Portal

1. **Go to Azure Portal**: https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Azure Cosmos DB"** and click **Create**
4. Select **"Azure Cosmos DB for NoSQL"**
5. Fill in the details:
   - **Subscription**: Select **"Designetica"**
   - **Resource Group**: Select **"rg-designetica-prod"** (same as your function app)
   - **Account Name**: `cosmos-designetica-prod`
   - **Location**: Choose the same region as your function app (likely East US)
   - **Capacity mode**: Select **"Serverless"** (pay per request, no minimum cost)
   - **Global Distribution**: Leave defaults
6. Click **"Review + Create"** then **"Create"**
7. Wait 2-3 minutes for deployment to complete

## Step 2: Create Database and Container

1. Once deployment is complete, click **"Go to resource"**
2. In the left menu, click **"Data Explorer"**
3. Click **"New Database"**
   - **Database id**: `designetica`
   - Click **OK**
4. Expand the `designetica` database
5. Click **"New Container"**
   - **Database id**: Use existing `designetica`
   - **Container id**: `feedback`
   - **Partition key**: `/type`
   - Click **OK**

## Step 3: Get Connection Details

1. In your Cosmos DB account, go to **"Keys"** (under Settings in left menu)
2. Copy these values:
   - **URI** - This is your `COSMOS_ENDPOINT`
   - **PRIMARY KEY** - This is your `COSMOS_KEY`

## Step 4: Add to Azure Function App

1. Go to your Function App: **func-designetica-prod-vmlmp4vej4ckc**
2. Click **"Configuration"** (under Settings)
3. Click **"+ New application setting"** and add these 4 settings:

   | Name                           | Value                                                      |
   | ------------------------------ | ---------------------------------------------------------- |
   | `COSMOS_ENDPOINT`              | `https://cosmos-designetica-prod.documents.azure.com:443/` |
   | `COSMOS_KEY`                   | (paste your PRIMARY KEY from step 3)                       |
   | `COSMOS_DATABASE_ID`           | `designetica`                                              |
   | `COSMOS_FEEDBACK_CONTAINER_ID` | `feedback`                                                 |

4. Click **"Save"** at the top
5. Wait for the function app to restart

## Step 5: Add to Local Development

Create or update `backend/.env` file with:

```bash
# Cosmos DB Configuration for Feedback System
COSMOS_ENDPOINT=https://cosmos-designetica-prod.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
COSMOS_DATABASE_ID=designetica
COSMOS_FEEDBACK_CONTAINER_ID=feedback
```

## Step 6: Deploy and Test

```bash
npm run deploy:quick
```

Then test by:

1. Opening your app
2. Clicking the feedback button in the toolbar
3. Submitting feedback
4. Checking Cosmos DB Data Explorer to see the feedback

## Quick Reference

**Your Resources:**

- Subscription: `Designetica`
- Resource Group: `rg-designetica-prod`
- Cosmos DB: `cosmos-designetica-prod`
- Database: `designetica`
- Container: `feedback`
- Function App: `func-designetica-prod-vmlmp4vej4ckc`

**View Feedback:**
Portal → Cosmos DB → Data Explorer → designetica → feedback → Items

**Estimated Cost:**
~$0.03/month for 100 feedback submissions (Serverless mode)

---

💡 **Tip**: If you prefer, I can help you with each step if you share what you see on your screen!
