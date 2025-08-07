module.exports = async function (context, req) {
  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Check if this is an AI Builder health check request
  if (req.url && req.url.includes("ai-builder")) {
    context.res.status = 200;
    context.res.body = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        aiBuilder: "healthy",
        gpt4: "healthy",
        database: "healthy",
      },
      environment: process.env.POWER_PLATFORM_ENVIRONMENT || "development",
      version: "2.0.0",
    };
    return;
  }

  context.res.status = 200;
  context.res.body = {
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
  };
};
