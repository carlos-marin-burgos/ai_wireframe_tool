# Designetica - Complete Architecture & Infrastructure Documentation

**Document Version:** 1.0  
**Last Updated:** October 9, 2025  
**Owner:** Carlos Marin Burgos (camarinb@microsoft.com)  
**Status:** Production

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Source Code & Repository](#source-code--repository)
3. [Azure Infrastructure](#azure-infrastructure)
4. [AI Services](#ai-services)
5. [Authentication & Security](#authentication--security)
6. [Deployment Pipeline](#deployment-pipeline)
7. [Access Control](#access-control)
8. [Database & Storage](#database--storage)
9. [Monitoring & Logging](#monitoring--logging)
10. [Network Architecture](#network-architecture)
11. [Cost & Resource Management](#cost--resource-management)

---

## 1. Overview

**Application Name:** Designetica Wireframe Tool  
**Purpose:** AI-powered wireframe generation from website URLs for Microsoft employees  
**Tech Stack:** React + TypeScript (Frontend), Node.js + Azure Functions (Backend), Azure OpenAI (AI)  
**Deployment Model:** Azure Static Web Apps + Azure Functions (Serverless)

---

## 2. Source Code & Repository

### GitHub Repository

- **Repository URL:** https://github.com/carlos-marin-burgos/ai_wireframe_tool
- **Owner:** carlos-marin-burgos (CarlosUX)
- **Repository Type:** Private
- **Primary Branch:** `main`
- **Active Development Branch:** `fix/remove-hardcoded-secrets`

### Repository Structure

```
ai_wireframe_tool/
├── src/                          # React frontend source code
├── backend/                      # Azure Functions (Node.js)
│   ├── getFeedback/             # Feedback retrieval API
│   ├── submit-feedback/         # Feedback submission API
│   └── [30+ other functions]    # Wireframe generation, analysis, etc.
├── public/                       # Static assets
├── infra/                        # Bicep infrastructure-as-code
├── .github/workflows/            # GitHub Actions CI/CD
└── azure.yaml                    # Azure Developer CLI config
```

### Repository Access

- **Primary Owner:** camarinb@microsoft.com
- **Visibility:** Private repository
- **Collaborators:** Currently only owner

---

## 3. Azure Infrastructure

### Azure Subscription

- **Subscription Name:** Designetica
- **Subscription ID:** `330eaa36-e19f-4d4c-8dea-37c2332f754d`
- **Tenant:** Designetica (`54ad0b60-7fda-456b-b965-230c533f1418`)
- **Tenant Domain:** designetica.onmicrosoft.com
- **Owner:** camarinb@microsoft.com

### Resource Groups

- **Production:** `rg-designetica-prod`
- **Location:** West US 2 & East US 2
- **Tags:** None currently applied

### Azure Resources

#### Frontend (Azure Static Web Apps)

- **Resource Name:** `swa-designetica-5gwyjxbwvr4s6`
- **Resource Type:** Microsoft.Web/staticSites
- **Location:** West US 2
- **URL:** https://delightful-pond-064d9a91e.1.azurestaticapps.net/
- **SKU:** Free
- **Framework:** React 18.3.1 + Vite
- **Build:** Automatic via GitHub Actions

#### Backend (Azure Functions)

- **Resource Name:** `func-designetica-prod-vmlmp4vej4ckc`
- **Resource Type:** Microsoft.Web/sites (Function App)
- **Runtime:** Node.js 20
- **Location:** East US 2
- **URL:** https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/
- **Hosting Plan:** Consumption (Serverless)
- **Functions Count:** 31 endpoints

**Key Function Endpoints:**

- `/api/getFeedback` - Retrieve feedback (authenticated)
- `/api/submit-feedback` - Submit feedback (anonymous)
- `/api/analyze-website` - Website analysis
- `/api/generate-wireframe` - Wireframe generation
- `/api/openai-chat` - OpenAI integration
- And 26 more endpoints

#### Database (Cosmos DB)

- **Resource Name:** `cosmos-designetica-prod`
- **Resource Type:** Microsoft.DocumentDB/databaseAccounts
- **API:** NoSQL (Core SQL API)
- **Location:** Primary: East US 2, Secondary: West US 2
- **Consistency:** Session
- **Database ID:** `designetica`
- **Containers:**
  - `feedback` - User feedback submissions
  - Additional containers for wireframe data

#### Storage (Azure Storage Account)

- **Resource Name:** `stdesignetica5gwyjxbwvr4s6`
- **Resource Type:** Microsoft.Storage/storageAccounts
- **SKU:** Standard_LRS
- **Location:** West US 2
- **Purpose:** Static web app storage, function app storage

#### Monitoring (Application Insights)

- **Resource Name:** `appi-designetica-5gwyjxbwvr4s6`
- **Resource Type:** Microsoft.Insights/components
- **Location:** East US 2
- **Linked to:** Function App & Static Web App

#### Logging (Log Analytics)

- **Resource Name:** `log-designetica-5gwyjxbwvr4s6`
- **Resource Type:** Microsoft.OperationalInsights/workspaces
- **Location:** East US 2
- **Retention:** 30 days (default)

#### Key Vault

- **Resource Name:** `kv-designetica-5gwyjxbwv`
- **Resource Type:** Microsoft.KeyVault/vaults
- **Location:** West US 2
- **Purpose:** Secrets management (though currently using app settings)

#### Managed Identity

- **Resource Name:** `id-designetica-5gwyjxbwvr4s6`
- **Resource Type:** Microsoft.ManagedIdentity/userAssignedIdentities
- **Client ID:** `1ef12460-aee2-4cf4-b177-db76ece40872`
- **Purpose:** Service-to-service authentication

---

## 4. AI Services

### Azure OpenAI Service

- **Resource Name:** `cog-designetica-5gwyjxbwvr4s6`
- **Resource Type:** Microsoft.CognitiveServices/accounts
- **Location:** East US 2
- **Endpoint:** https://cog-designetica-5gwyjxbwvr4s6.openai.azure.com/
- **Pricing Tier:** Standard

**Deployed Models:**

- **GPT-4** - For complex reasoning and wireframe generation
- **GPT-3.5-Turbo** - For faster, simpler tasks
- **Embeddings** - For semantic search (if applicable)

**Authentication Method:**

- **Type:** API Key (stored in Function App configuration)
- **Environment Variable:** `AZURE_OPENAI_API_KEY` or `AZURE_OPENAI_ENDPOINT`

### GitHub Copilot (Development)

- **Usage:** Code assistance during development
- **Access:** Via developer's GitHub account (camarinb@microsoft.com)
- **Scope:** Development environment only, not production

### AI Services NOT Currently Used

- ❌ Copilot Studio - Not integrated
- ❌ AI Foundry - Not integrated (separate from Azure OpenAI)
- ❌ Azure AI Search - Not currently deployed
- ❌ Azure AI Services (multi-service) - Using standalone OpenAI only

---

## 5. Authentication & Security

### Azure Active Directory App Registration

- **App Name:** Designetica Wireframe Tool
- **Application (Client) ID:** `b82c2a93-996a-475a-9117-4384d229a70b`
- **Tenant:** Designetica (`54ad0b60-7fda-456b-b965-230c533f1418`)
- **Sign-in Audience:** AzureADMultipleOrgs (Multi-tenant)
- **Redirect URI:** https://delightful-pond-064d9a91e.1.azurestaticapps.net/.auth/login/aad/callback

**Authentication Configuration:**

- **Type:** Azure AD OAuth 2.0
- **Client Secret:** Configured in Static Web App settings (encrypted)
- **ID Token Issuance:** ✅ Enabled
- **Access Token Issuance:** ❌ Disabled (not needed)

### Static Web App Authentication

**App Settings (Encrypted):**

- `AZURE_CLIENT_ID`: b82c2a93-996a-475a-9117-4384d229a70b
- `AZURE_CLIENT_SECRET`: [Encrypted secret value]

**Authentication Flow:**

1. User visits app → 401 Unauthorized
2. Auto-redirect to `/.auth/login/aad`
3. Microsoft login with `domain_hint=microsoft.com`
4. OAuth callback to Static Web App
5. Static Web App sets authentication cookie
6. User authenticated with `x-ms-client-principal` header

### Backend Security

- **Email Validation:** Backend enforces @microsoft.com domain
- **CORS:** Configured to allow Static Web App origin
- **API Authentication:** All endpoints (except submit-feedback) require authentication

**Protected Routes:**

- All `/*.html` pages require authentication
- All `/api/*` endpoints require authentication (except `/api/submit-feedback`)
- Static assets (CSS, JS, images) are anonymous

---

## 6. Deployment Pipeline

### Environments

#### Production Environment

- **Environment Name:** `designetica`
- **Azure Environment:** Production
- **Resource Group:** `rg-designetica-prod`
- **URL:** https://delightful-pond-064d9a91e.1.azurestaticapps.net/
- **Status:** ✅ Active

#### Other Environments (Configured but not actively used)

- `designetica-prod` - Duplicate config
- `production` - Alternative production config
- `production-bami` - BAMI subscription attempt (no permissions)
- `production-microsoft` - Microsoft tenant config
- `original-app.backup` - Backup configuration

**Note:** Currently only using ONE production environment (`designetica`)

### Deployment Methods

#### Method 1: Azure Developer CLI (azd) - **PRIMARY METHOD**

```bash
azd deploy --no-prompt
```

**Deployment Time:** 2-4 minutes  
**What it deploys:**

- Frontend: Static Web App (React build)
- Backend: Azure Functions (31 endpoints)
- Infrastructure: No changes (Bicep not updated each deploy)

**Configuration File:** `azure.yaml`

#### Method 2: GitHub Actions - **SECONDARY METHOD**

- **Workflow File:** `.github/workflows/azure-static-web-apps-delightful-pond-064d9a91e.yml`
- **Trigger:** Push to `main` or `fix/remove-hardcoded-secrets` branch
- **Deployment Time:** 10-15 minutes (slower than azd)
- **GitHub Secret:** `AZURE_STATIC_WEB_APPS_API_TOKEN`

**Deployment Steps:**

1. Build React app (`npm run build`)
2. Deploy to Azure Static Web Apps
3. Azure automatically deploys Functions from `/backend` folder

### CI/CD Configuration

- **Build Tool:** Vite (frontend), npm (backend)
- **Node Version:** 20.x
- **Package Manager:** npm
- **Build Output:** `dist/` folder

### Pre-Push Validation

- **Script:** `.husky/pre-push` or custom validation
- **Checks:**
  - Azure environment validation
  - Environment configuration check
  - OAuth configuration validation

---

## 7. Access Control

### Resource Access (Azure Subscription)

#### Owner/Administrator

- **Name:** Carlos Marin Burgos
- **Email:** camarinb@microsoft.com
- **Role:** Owner (full access)
- **Scope:** Entire subscription

#### Service Principal Access

- **Managed Identity:** `id-designetica-5gwyjxbwvr4s6`
- **Purpose:** Function App to Cosmos DB, Key Vault access
- **Scope:** Resource group level

### Application Access (End Users)

#### Who Can Access the Application

- ✅ **Microsoft Employees:** Any user with @microsoft.com email
- ❌ **External Users:** Denied (403 Forbidden)
- ❌ **Contractors:** Denied if non-Microsoft email
- ❌ **Personal Accounts:** Denied (@outlook.com, @hotmail.com)

**Access Validation:**

1. **Frontend:** Azure AD authentication (any organizational account)
2. **Backend:** Email domain validation (@microsoft.com only)

#### Current Users

- **Development/Testing:** camarinb@microsoft.com
- **Production Users:** Open to all Microsoft employees (not yet widely shared)

### GitHub Repository Access

- **Owner:** carlos-marin-burgos
- **Collaborators:** None currently
- **Visibility:** Private

### Secrets Management

**Where Secrets Are Stored:**

1. **GitHub Secrets:**

   - `AZURE_STATIC_WEB_APPS_API_TOKEN` - For GitHub Actions deployment

2. **Azure Static Web App Configuration:**

   - `AZURE_CLIENT_ID` - Azure AD app client ID
   - `AZURE_CLIENT_SECRET` - Azure AD app secret

3. **Azure Function App Configuration:**

   - `COSMOS_ENDPOINT` - Cosmos DB connection
   - `COSMOS_KEY` - Cosmos DB access key
   - `AZURE_OPENAI_ENDPOINT` - OpenAI service endpoint
   - `AZURE_OPENAI_API_KEY` - OpenAI API key

4. **Local Development (.env files - NOT in git):**
   - `.azure/designetica/.env` - Local environment config
   - Contains all connection strings and keys for local development

**Secret Rotation:** Not currently automated (manual process)

---

## 8. Database & Storage

### Cosmos DB Configuration

- **Endpoint:** https://cosmos-designetica-prod.documents.azure.com:443/
- **Access Key:** Stored in Function App configuration
- **Consistency Level:** Session
- **Database:** `designetica`
- **Containers:**
  - `feedback` (Feedback submissions)
    - Partition Key: `/id`
    - Throughput: Autoscale (400-4000 RU/s)

**Current Data:**

- **Feedback Submissions:** 2 test entries
  - `feedback-1760030481441-p2zmtupf6`
  - `feedback-1760030491217-jqa5t2tud`

### Azure Storage

- **Account:** `stdesignetica5gwyjxbwvr4s6`
- **Containers:**
  - `$web` - Static Web App content
  - Function app runtime storage
- **Access:** Managed Identity & Connection String

---

## 9. Monitoring & Logging

### Application Insights

- **Instrumentation Key:** Configured in both Static Web App and Function App
- **Telemetry:**
  - Request tracking
  - Dependency tracking (Cosmos DB, OpenAI)
  - Exception logging
  - Custom events

**Available Metrics:**

- Request count and response times
- Dependency call duration
- Exception rate
- Custom events (wireframe generation, feedback submission)

### Log Analytics Workspace

- **Workspace:** `log-designetica-5gwyjxbwvr4s6`
- **Data Sources:**
  - Application Insights
  - Function App logs
  - Static Web App logs

**Query Examples:**

```kusto
// View recent feedback submissions
traces
| where message contains "feedback"
| order by timestamp desc
| take 100

// Check authentication failures
traces
| where message contains "Unauthorized"
| order by timestamp desc
```

### Logging Strategy

- **Frontend:** Browser console (dev), Application Insights (prod)
- **Backend:** Context logging in Azure Functions
  - `context.log()` for info
  - `context.log.error()` for errors
  - `context.log.warn()` for warnings

---

## 10. Network Architecture

### Domain & URLs

- **Production URL:** https://delightful-pond-064d9a91e.1.azurestaticapps.net/
- **Custom Domain:** Not configured (using default Azure domain)
- **Backend API:** https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/

### Network Flow

```
User Browser
    ↓
Azure Static Web App (Frontend)
https://delightful-pond-064d9a91e.1.azurestaticapps.net/
    ↓
Azure Functions (Backend API)
https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/api/*
    ↓
├─→ Cosmos DB (Database)
├─→ Azure OpenAI (AI Processing)
└─→ Azure Storage (File storage)
```

### Security Configuration

- **HTTPS Only:** ✅ Enforced on all resources
- **TLS Version:** TLS 1.2 minimum
- **CORS:** Configured on Function App to allow Static Web App origin
- **Authentication:** Azure AD on frontend, email validation on backend

### IP Restrictions

- **Static Web App:** None (public, but auth required)
- **Function App:** None (public, but CORS configured)
- **Cosmos DB:** Accepts connections from Azure services
- **Storage Account:** Accepts connections from Azure services

---

## 11. Cost & Resource Management

### Current Pricing Tier

- **Static Web App:** Free tier
- **Function App:** Consumption plan (pay-per-execution)
- **Cosmos DB:** Provisioned throughput (autoscale 400-4000 RU/s)
- **Azure OpenAI:** Pay-per-token (Standard pricing)
- **Storage:** Standard LRS (low-cost)
- **Application Insights:** Pay-as-you-go

### Estimated Monthly Cost

**Note:** Based on current low usage (development/testing phase)

- **Static Web App:** $0 (Free tier)
- **Function App:** ~$5-10 (minimal executions)
- **Cosmos DB:** ~$25-50 (autoscale, low usage)
- **Azure OpenAI:** ~$10-50 (depends on usage)
- **Storage:** ~$1-2
- **Application Insights:** ~$5
- **Total Estimated:** ~$50-120/month

**Production Cost (with active users):** Could increase to $200-500/month depending on:

- Number of wireframe generations (OpenAI API calls)
- Feedback submissions (Cosmos DB operations)
- User traffic (Function executions)

### Resource Tags

**Current Status:** No tags applied

**Recommended Tags:**

```
Environment: Production
Owner: camarinb@microsoft.com
Project: Designetica
CostCenter: [Your cost center]
Department: Design/UX
```

---

## 12. Additional Technical Details

### Frontend Technology

- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.3
- **Language:** TypeScript 5.6.2
- **UI Library:** None (custom CSS)
- **State Management:** React hooks
- **Key Dependencies:**
  - `html2canvas` - Screenshot generation
  - `react-router-dom` - Routing

### Backend Technology

- **Runtime:** Node.js 20
- **Framework:** Azure Functions Core Tools
- **Key Dependencies:**
  - `@azure/cosmos` - Cosmos DB client
  - `@azure/openai` - OpenAI integration
  - `axios` - HTTP client

### Infrastructure as Code

- **Tool:** Azure Bicep
- **Location:** `/infra` folder
- **Main File:** `infra/main.bicep`
- **Deployment:** Via Azure Developer CLI (azd)

---

## 13. Disaster Recovery & Backup

### Current Backup Strategy

- **Cosmos DB:** No automatic backup configured (manual snapshots possible)
- **Code:** Version controlled in GitHub
- **Secrets:** Documented (need to be manually restored if lost)

### Recovery Time Objective (RTO)

- **Frontend:** < 5 minutes (redeploy from GitHub)
- **Backend:** < 10 minutes (redeploy functions)
- **Database:** Depends on backup availability (currently none)

**Recommendation:** Implement automated Cosmos DB backup for production

---

## 14. Security & Compliance

### Data Privacy

- **User Data Collected:**
  - Email address (from Azure AD authentication)
  - Feedback submissions (optional)
  - Usage telemetry (Application Insights)
- **Data Retention:** Indefinite (feedback), 30 days (logs)
- **Data Location:** East US 2 & West US 2

### Compliance

- **GDPR:** User data is within Microsoft ecosystem
- **Data Residency:** US regions only
- **Encryption:**
  - At rest: Azure-managed keys
  - In transit: HTTPS/TLS 1.2+

### Security Best Practices

- ✅ HTTPS enforced
- ✅ Authentication required
- ✅ Email domain validation
- ✅ Secrets in Azure configuration (not in code)
- ⚠️ No automatic secret rotation
- ⚠️ No network isolation (public endpoints)

---

## 15. Known Issues & Limitations

### Current Issues

1. **Login Loop:** Users may experience redirect loop

   - **Workaround:** Use incognito window or clear cache
   - **Root Cause:** Browser caching authentication state

2. **No Custom Domain:** Using default Azure domain

3. **Single Owner:** Only camarinb@microsoft.com has admin access

### Limitations

- **Scalability:** Current setup supports ~100 concurrent users
- **Backup:** No automated database backup
- **Monitoring:** Basic telemetry only
- **Error Handling:** Limited user-facing error messages

---

## 16. Contact & Support

### Technical Owner

- **Name:** Carlos Marin Burgos
- **Email:** camarinb@microsoft.com
- **Role:** Developer & Administrator

### Support Channels

- **Email:** camarinb@microsoft.com
- **Issues:** GitHub repository issues (for collaborators)

---

## 17. Quick Reference Links

### Production Resources

- **App:** https://delightful-pond-064d9a91e.1.azurestaticapps.net/
- **API:** https://func-designetica-prod-vmlmp4vej4ckc.azurewebsites.net/
- **GitHub:** https://github.com/carlos-marin-burgos/ai_wireframe_tool

### Azure Portal Direct Links

- **Subscription:** https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d
- **Resource Group:** https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/rg-designetica-prod
- **Static Web App:** https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/rg-designetica-prod/providers/Microsoft.Web/staticSites/swa-designetica-5gwyjxbwvr4s6
- **Function App:** https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/rg-designetica-prod/providers/Microsoft.Web/sites/func-designetica-prod-vmlmp4vej4ckc
- **Cosmos DB:** https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/rg-designetica-prod/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-designetica-prod
- **Azure OpenAI:** https://portal.azure.com/#@/resource/subscriptions/330eaa36-e19f-4d4c-8dea-37c2332f754d/resourceGroups/rg-designetica-prod/providers/Microsoft.CognitiveServices/accounts/cog-designetica-5gwyjxbwvr4s6
- **App Registration:** https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/b82c2a93-996a-475a-9117-4384d229a70b

---

## Document Change Log

| Date       | Version | Changes                             | Author       |
| ---------- | ------- | ----------------------------------- | ------------ |
| 2025-10-09 | 1.0     | Initial comprehensive documentation | Carlos Marin |

---

**END OF DOCUMENT**

_This document contains sensitive information. Distribution should be limited to team members and stakeholders with appropriate access levels._
