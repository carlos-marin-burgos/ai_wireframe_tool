/**
 * OpenAI Health Check Endpoint
 * Tests actual connectivity to Azure OpenAI service
 */

const { AzureOpenAI } = require("openai");

let cachedOpenAI = null;
let lastHealthCheck = null;
let healthCheckCache = null;
const CACHE_DURATION = 30000; // 30 seconds cache

function initializeOpenAI() {
  if (cachedOpenAI) return cachedOpenAI;

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey =
      process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
    const apiVersion =
      process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

    if (!endpoint || !apiKey) {
      throw new Error("Missing OpenAI configuration");
    }

    cachedOpenAI = new AzureOpenAI({
      endpoint: endpoint,
      apiKey: apiKey,
      apiVersion: apiVersion,
      deployment: deployment,
    });

    return cachedOpenAI;
  } catch (error) {
    console.error("OpenAI initialization failed:", error);
    return null;
  }
}

async function testOpenAIConnectivity() {
  const startTime = Date.now();

  try {
    const openai = initializeOpenAI();
    if (!openai) {
      return {
        status: "down",
        error: "Configuration missing",
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    // Test with a minimal completion request
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [{ role: "user", content: 'Reply with just "OK"' }],
      max_tokens: 5,
      temperature: 0,
    });

    const responseTime = Date.now() - startTime;

    if (response && response.choices && response.choices[0]) {
      return {
        status: "up",
        responseTime: responseTime,
        timestamp: new Date().toISOString(),
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        usageTokens: response.usage ? response.usage.total_tokens : null,
      };
    } else {
      return {
        status: "degraded",
        error: "Invalid response format",
        responseTime: responseTime,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;

    let status = "down";
    let errorMessage = error.message;

    // Categorize errors
    if (error.status === 401) {
      status = "auth_error";
      errorMessage = "Authentication failed";
    } else if (error.status === 429) {
      status = "rate_limited";
      errorMessage = "Rate limit exceeded";
    } else if (error.status >= 500) {
      status = "server_error";
      errorMessage = "Azure OpenAI service error";
    } else if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      status = "connection_error";
      errorMessage = "Network connectivity issue";
    }

    return {
      status,
      error: errorMessage,
      errorCode: error.status || error.code,
      responseTime: responseTime,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = async function (context, req) {
  const startTime = Date.now();

  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    // Check cache first
    const now = Date.now();
    const force = req.query.force === "true";

    if (
      !force &&
      healthCheckCache &&
      lastHealthCheck &&
      now - lastHealthCheck < CACHE_DURATION
    ) {
      context.res.status = 200;
      context.res.body = {
        ...healthCheckCache,
        cached: true,
        cacheAge: now - lastHealthCheck,
      };
      return;
    }

    // Perform actual health check
    const openaiHealth = await testOpenAIConnectivity();

    // Overall health assessment
    const overallHealth = {
      service: "azure-openai",
      overall_status:
        openaiHealth.status === "up"
          ? "healthy"
          : openaiHealth.status === "degraded"
          ? "degraded"
          : "unhealthy",
      openai: openaiHealth,
      configuration: {
        hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
        hasApiKey: !!(
          process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY
        ),
        hasDeployment: !!process.env.AZURE_OPENAI_DEPLOYMENT,
        endpoint: process.env.AZURE_OPENAI_ENDPOINT
          ? process.env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "")
          : null,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      },
      timestamp: new Date().toISOString(),
      requestId: context.executionContext?.invocationId || "unknown",
      totalResponseTime: Date.now() - startTime,
    };

    // Cache the result
    healthCheckCache = overallHealth;
    lastHealthCheck = now;

    // Set appropriate HTTP status
    let httpStatus = 200;
    if (
      openaiHealth.status === "down" ||
      openaiHealth.status === "auth_error"
    ) {
      httpStatus = 503; // Service Unavailable
    } else if (
      openaiHealth.status === "degraded" ||
      openaiHealth.status === "rate_limited"
    ) {
      httpStatus = 200; // OK but with warnings
    }

    context.res.status = httpStatus;
    context.res.body = overallHealth;
  } catch (error) {
    const responseTime = Date.now() - startTime;

    context.res.status = 500;
    context.res.body = {
      service: "azure-openai",
      overall_status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
      requestId: context.executionContext?.invocationId || "unknown",
      totalResponseTime: responseTime,
    };
  }
};
