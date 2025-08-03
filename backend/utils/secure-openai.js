// Secure key management for Azure OpenAI integration
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

let openaiClientInstance = null;

/**
 * Securely initializes the OpenAI client using Azure Managed Identity or API key
 * @returns {Promise<object|null>} The initialized OpenAI client or null if initialization failed
 */
async function getOpenAIClient() {
  // Return cached instance if available
  if (openaiClientInstance) {
    return openaiClientInstance;
  }

  try {
    const { OpenAI } = require("openai");
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";
    const clientId = process.env.AZURE_CLIENT_ID;
    let apiKey = process.env.AZURE_OPENAI_KEY;
    const keyVaultUrl = process.env.KEY_VAULT_URL;

    // Validate required parameters
    if (!endpoint || !deployment) {
      console.error("❌ Missing required OpenAI configuration parameters");
      console.log("Environment variables:");
      console.log("AZURE_OPENAI_ENDPOINT:", endpoint ? "SET" : "MISSING");
      console.log("AZURE_OPENAI_DEPLOYMENT:", deployment ? "SET" : "MISSING");
      console.log("AZURE_CLIENT_ID:", clientId ? "SET" : "MISSING");
      console.log("AZURE_OPENAI_KEY:", apiKey ? "SET" : "MISSING");
      throw new Error("Incomplete OpenAI configuration");
    }

    // Try managed identity authentication first
    if (clientId && !apiKey) {
      console.log("🔑 Using Azure Managed Identity authentication...");
      try {
        const credential = new DefaultAzureCredential({
          managedIdentityClientId: clientId
        });
        
        // Get access token for Azure OpenAI
        const tokenResponse = await credential.getToken("https://cognitiveservices.azure.com/.default");
        
        // Initialize OpenAI client with managed identity token
        openaiClientInstance = new OpenAI({
          apiKey: tokenResponse.token,
          baseURL: `${endpoint}/openai/deployments/${deployment}`,
          defaultQuery: { "api-version": apiVersion },
          defaultHeaders: {
            "Authorization": `Bearer ${tokenResponse.token}`,
          },
        });

        console.log("✅ OpenAI client initialized with managed identity");
        return openaiClientInstance;
      } catch (managedIdentityError) {
        console.error("❌ Managed identity authentication failed:", managedIdentityError.message);
        console.log("🔄 Falling back to API key authentication...");
      }
    }

    // Check if we should use Key Vault for API key
    if (keyVaultUrl && !apiKey) {
      console.log("🔑 Retrieving API key from Azure Key Vault...");
      try {
        const credential = new DefaultAzureCredential();
        const secretClient = new SecretClient(keyVaultUrl, credential);
        const openaiKeySecret = await secretClient.getSecret("azure-openai-key");
        apiKey = openaiKeySecret.value;
        console.log("✅ Successfully retrieved API key from Key Vault");
      } catch (keyVaultError) {
        console.error("❌ Error retrieving API key from Key Vault:", keyVaultError.message);
        throw new Error("Failed to retrieve API key from Key Vault");
      }
    }

    // Fall back to API key authentication
    if (apiKey) {
      console.log("🔑 Using API key authentication...");
      openaiClientInstance = new OpenAI({
        apiKey: apiKey,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: {
          "api-key": apiKey,
        },
      });

      console.log("✅ OpenAI client initialized with API key");
      return openaiClientInstance;
    }

    throw new Error("No valid authentication method available (managed identity or API key)");

  } catch (error) {
    console.error("❌ Failed to initialize OpenAI client:", error.message);
    return null;
  }
}

/**
 * Securely calls the OpenAI API with retry logic and error handling
 * @param {Function} apiCallFn Function that takes an OpenAI client and returns a Promise
 * @param {number} maxRetries Maximum number of retry attempts (default: 3)
 * @returns {Promise<any>} The API call result
 */
async function secureOpenAICall(apiCallFn, maxRetries = 3) {
  let retries = 0;
  let lastError;

  while (retries <= maxRetries) {
    try {
      const client = await getOpenAIClient();
      if (!client) {
        throw new Error("OpenAI client initialization failed");
      }

      return await apiCallFn(client);
    } catch (error) {
      lastError = error;
      console.error(`OpenAI API error (attempt ${retries + 1}/${maxRetries + 1}):`, error.message);

      // Check for retryable errors
      const isRetryable = error.status === 429 || // Rate limit
                          error.status >= 500 ||  // Server errors
                          error.code === "ECONNRESET" ||
                          error.code === "ETIMEDOUT";

      if (isRetryable && retries < maxRetries) {
        retries++;
        // Exponential backoff with jitter
        const delay = Math.min(1000 * 2 ** retries + Math.random() * 1000, 10000);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}

module.exports = {
  getOpenAIClient,
  secureOpenAICall
};
