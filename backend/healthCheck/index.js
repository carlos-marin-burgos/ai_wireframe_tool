// Health check endpoint to monitor system status
const { OpenAI } = require("openai");

module.exports = async function (context, req) {
  context.log("🏥 Health check initiated");

  const healthStatus = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "production",
    checks: {
      basic: { status: "pass", message: "Function App is running" },
      environment: { status: "unknown", details: {} },
      openai: { status: "unknown", details: {} },
      memory: { status: "unknown", details: {} },
    },
    uptime: process.uptime(),
    nodeVersion: process.version,
  };

  try {
    // 1. Environment Variables Check
    const requiredEnvVars = [
      "AZURE_OPENAI_ENDPOINT",
      "AZURE_OPENAI_KEY",
      "AZURE_OPENAI_DEPLOYMENT",
      "AZURE_OPENAI_API_VERSION",
    ];

    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingVars.length === 0) {
      healthStatus.checks.environment = {
        status: "pass",
        message: "All required environment variables present",
        details: {
          endpoint: process.env.AZURE_OPENAI_ENDPOINT,
          deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
          apiVersion: process.env.AZURE_OPENAI_API_VERSION,
          keyPresent: !!process.env.AZURE_OPENAI_KEY,
        },
      };
    } else {
      healthStatus.checks.environment = {
        status: "fail",
        message: `Missing environment variables: ${missingVars.join(", ")}`,
        details: { missing: missingVars },
      };
      healthStatus.status = "unhealthy";
    }

    // 2. OpenAI Connection Test
    if (missingVars.length === 0) {
      try {
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

        const openai = new OpenAI({
          apiKey: process.env.AZURE_OPENAI_KEY,
          baseURL: `${endpoint}/openai/deployments/${deployment}`,
          defaultQuery: { "api-version": apiVersion },
          defaultHeaders: {
            "api-key": process.env.AZURE_OPENAI_KEY,
          },
        });

        // Test with a minimal request (with timeout)
        const testPromise = openai.chat.completions.create({
          model: deployment,
          messages: [{ role: "user", content: "test" }],
          max_tokens: 1,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("OpenAI test timeout")), 5000)
        );

        await Promise.race([testPromise, timeoutPromise]);

        healthStatus.checks.openai = {
          status: "pass",
          message: "OpenAI connection successful",
          details: {
            endpoint: endpoint,
            deployment: deployment,
            apiVersion: apiVersion,
          },
        };
      } catch (error) {
        healthStatus.checks.openai = {
          status: "fail",
          message: `OpenAI connection failed: ${error.message}`,
          details: {
            errorType: error.name,
            errorStatus: error.status || "unknown",
          },
        };
        healthStatus.status = "degraded"; // Not completely unhealthy since fallbacks exist
      }
    } else {
      healthStatus.checks.openai = {
        status: "skip",
        message: "Skipped due to missing environment variables",
      };
    }

    // 3. Memory Usage Check
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    };

    const memoryThreshold = 500; // MB
    if (memUsageMB.heapUsed < memoryThreshold) {
      healthStatus.checks.memory = {
        status: "pass",
        message: "Memory usage within limits",
        details: memUsageMB,
      };
    } else {
      healthStatus.checks.memory = {
        status: "warn",
        message: "High memory usage detected",
        details: memUsageMB,
      };
    }

    // 4. Overall Status Determination
    const failedChecks = Object.values(healthStatus.checks).filter(
      (check) => check.status === "fail"
    );
    const warnChecks = Object.values(healthStatus.checks).filter(
      (check) => check.status === "warn"
    );

    if (failedChecks.length > 0) {
      healthStatus.status = "unhealthy";
    } else if (warnChecks.length > 0) {
      healthStatus.status = "degraded";
    }

    context.log("🏥 Health check completed:", healthStatus.status);

    // Return appropriate HTTP status codes
    const httpStatus =
      healthStatus.status === "healthy"
        ? 200
        : healthStatus.status === "degraded"
        ? 200
        : 503;

    context.res = {
      status: httpStatus,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: healthStatus,
    };
  } catch (error) {
    context.log.error("🚨 Health check failed:", error);

    context.res = {
      status: 503,
      headers: { "Content-Type": "application/json" },
      body: {
        timestamp: new Date().toISOString(),
        status: "unhealthy",
        error: {
          message: error.message,
          type: error.name,
        },
      },
    };
  }
};
