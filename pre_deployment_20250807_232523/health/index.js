/**
 * Simple Health Check - Basic Version
 * Provides health status without analytics logging to avoid startup issues
 */

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

    // Collect health metrics
    const healthData = {
      status: "OK",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "production",
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
      services: {
        hasOpenAI: !!(
          process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT
        ),
        hasAppInsights: !!process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
        functionsVersion: process.env.FUNCTIONS_EXTENSION_VERSION,
      },
      performance: {
        responseTimeMs: Date.now() - startTime,
      },
    };

    context.res.status = 200;
    context.res.body = healthData;
  } catch (error) {
    const responseTime = Date.now() - startTime;

    context.res.status = 500;
    context.res.body = {
      status: "error",
      timestamp: new Date().toISOString(),
      error: error.message,
      performance: {
        responseTimeMs: responseTime,
      },
    };
  }
};
