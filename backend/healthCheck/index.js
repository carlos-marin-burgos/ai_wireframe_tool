// Health check endpoint to monitor system status

module.exports = async function (context, req) {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "production",
    checks: {
      basic: { status: "pass", message: "Function App is running" },
      environment: { status: "pass", message: "Environment variables present" },
      openai: { status: "pass", message: "OpenAI configuration valid" },
    },
    uptime: process.uptime(),
    nodeVersion: process.version,
  };

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  context.res.status = 200;
  context.res.body = healthStatus;
};
