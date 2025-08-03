# Setting Up AI-Powered Suggestions with Azure OpenAI - Enhanced v2.0

This document outlines how we've set up Azure OpenAI integration for the Designetica application with **Enhanced AI Capabilities**.

## 🚀 **Enhanced AI Features (NEW)**

The application now includes advanced AI capabilities:

- **🧠 Context-Aware Generation:** AI remembers user preferences and design history
- **🎨 Multi-Pass Enhancement:** Advanced prompting with quality optimization
- **💡 Intelligent Suggestions:** AI-powered design recommendations
- **📊 Advanced Analytics:** Comprehensive performance and usage tracking
- **🔄 Conversation Continuity:** Maintains design consistency across sessions

## 1. Azure OpenAI Resource

We're using the following Azure OpenAI resource:

```ini
Resource Name: designetica-openai
Resource Group: designetica-rg
Location: East US
Endpoint: https://eastus.api.cognitive.microsoft.com
API Key 1: 66db9d9ce0ba4fdf854a48e3f5bf1d73
API Key 2: 77e262d86a75461b92a3f5e7a4939963
```

## 2. Model Deployment

We have two model deployments available:

### GPT-4o (Current)

```ini
Model Name: gpt-4o
Model Version: 2024-08-06
Deployment Name: designetica-gpt4o
Capacity: 1
```

### GPT-3.5 Turbo (Previous)

```ini
Model Name: gpt-35-turbo
Model Version: 0125
Deployment Name: designetica-gpt35
Capacity: 1
```

## 3. Backend Configuration

The backend is configured in the `.env` file with:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_KEY=66db9d9ce0ba4fdf854a48e3f5bf1d73
AZURE_OPENAI_ENDPOINT=https://eastus.api.cognitive.microsoft.com
AZURE_OPENAI_DEPLOYMENT=designetica-gpt4o

# Server Configuration
PORT=5001
```

## 4. Running the Application

1. Start the backend server:

   ```bash
   cd backend
   node simple-server.js
   ```

2. You should see the following messages:

   ```console
   ✅ Loading environment variables from .env file
   ✅ OpenAI client initialized successfully
   ✅ Using model deployment: designetica-gpt4o
   🚀 Simple server running on port 5001
   ```

3. Start the frontend application:

   ```bash
   cd /path/to/designetica
   npm run dev
   ```

## 5. Testing the Integration

You can test the API endpoints directly:

### **Original Endpoints:**
```bash
# Test the health endpoint
curl http://localhost:5001/api/health

# Test the suggestion endpoint
curl -X POST http://localhost:5001/api/generate-suggestions \
-H "Content-Type: application/json" \
-d '{"description": "A dashboard for monitoring cloud resources"}'

# Test the wireframe generation endpoint
curl -X POST http://localhost:5001/api/generate-html-wireframe \
-H "Content-Type: application/json" \
-d '{"description": "A dashboard for monitoring cloud resources", "designTheme": "microsoftlearn"}' \
-o wireframe.html
```

### **🚀 Enhanced AI Endpoints (NEW):**
```bash
# Test enhanced wireframe generation with context awareness
curl -X POST http://localhost:5001/api/generate-enhanced-wireframe \
-H "Content-Type: application/json" \
-d '{
  "description": "Create a comprehensive user dashboard with analytics and notifications",
  "sessionId": "test-session-123",
  "designTheme": "microsoftlearn",
  "colorScheme": "primary",
  "enhanceQuality": true
}' \
-o enhanced-wireframe.html

# Test AI design suggestions
curl -X POST http://localhost:5001/api/generate-design-suggestions \
-H "Content-Type: application/json" \
-d '{
  "description": "Improve user engagement on dashboard",
  "sessionId": "test-session-123"
}'

# Get AI analytics and performance metrics
curl http://localhost:5001/api/ai-analytics
```

## 6. Azure CLI Commands Used

For reference, here are the Azure CLI commands we used:

```bash
# List available models
az cognitiveservices account list-models --resource-group designetica-rg --name designetica-openai --output table

# Get API keys
az cognitiveservices account keys list --resource-group designetica-rg --name designetica-openai

# Get endpoint
az cognitiveservices account show --resource-group designetica-rg --name designetica-openai --query properties.endpoint

# Deploy GPT-3.5 Turbo model
az cognitiveservices account deployment create --resource-group designetica-rg --name designetica-openai --deployment-name designetica-gpt35 --model-name gpt-35-turbo --model-version 0125 --model-format OpenAI --sku-capacity 1

# Deploy GPT-4o model
az cognitiveservices account deployment create --resource-group designetica-rg --name designetica-openai --deployment-name designetica-gpt4o --model-name gpt-4o --model-version 2024-08-06 --model-format OpenAI --sku-capacity 1

# List deployments
az cognitiveservices account deployment list --resource-group designetica-rg --name designetica-openai --output table
```

## 7. Troubleshooting

- If you see "Azure OpenAI configuration incomplete, will use fallback suggestions", check that your `.env` file has the correct values.
- If you receive an authentication error, verify your API key is correct.
- If you receive an error about the deployment, make sure your deployment name is correct and the model is actually deployed in your Azure OpenAI resource.
- Check the browser console and server logs for any CORS or network-related issues.
- Verify that the frontend's API configuration in `src/config/api.ts` is pointing to the correct backend URL.
