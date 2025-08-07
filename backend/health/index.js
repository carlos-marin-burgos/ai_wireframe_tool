/**
 * Enhanced Health Check with Analytics Logging
 * Provides health status and performance metrics for Power BI Dashboard
 */

const analyticsLogger = require("../utils/analytics-logger");

module.exports = async function (context, req) {
  const startTime = Date.now();
  const correlationId = require("crypto").randomUUID();

  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Correlation-ID": correlationId,
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
      correlationId,
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

    // Log health check analytics
    analyticsLogger.logAPIPerformance(
      "/api/health",
      req.method,
      200,
      healthData.performance.responseTimeMs
    );
    analyticsLogger.logBusinessMetrics("health_check", 1, {
      hasOpenAI: healthData.services.hasOpenAI,
      hasAppInsights: healthData.services.hasAppInsights,
      memoryUsedMB: Math.round(
        healthData.system.memoryUsage.used / 1024 / 1024
      ),
      uptimeHours: Math.round(healthData.system.uptime / 3600),
    });

    context.res.status = 200;
    context.res.body = healthData;

    // Flush analytics
    analyticsLogger.flush();
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Log error analytics
    analyticsLogger.logAPIPerformance(
      "/api/health",
      req.method,
      500,
      responseTime,
      error.message
    );

    context.res.status = 500;
    context.res.body = {
      status: "error",
      timestamp: new Date().toISOString(),
      correlationId,
      error: error.message,
      performance: {
        responseTimeMs: responseTime,
      },
    };

    analyticsLogger.flush();
  }
};
