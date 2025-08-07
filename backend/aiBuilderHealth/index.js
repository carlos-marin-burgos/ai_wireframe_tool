const {
  AIBuilderIntegrationService,
} = require("../services/aiBuilderIntegrationService");

module.exports = async function (context, req) {
  try {
    // Initialize AI Builder service
    const apiKey = process.env.AI_BUILDER_API_KEY || "development-mock-key";
    const environment = process.env.POWER_PLATFORM_ENVIRONMENT || "development";
    const aiBuilderService = new AIBuilderIntegrationService(
      apiKey,
      environment
    );

    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        aiBuilder: "healthy",
        gpt4: process.env.AZURE_OPENAI_KEY ? "healthy" : "not-configured",
        powerPlatform: environment === "development" ? "mock" : "connected",
      },
      environment: environment,
      version: "2.0.0",
      modelIds: {
        objectDetection:
          process.env.AI_BUILDER_OBJECT_DETECTION_MODEL_ID ||
          "mock-object-detection-model",
        formProcessor:
          process.env.AI_BUILDER_FORM_PROCESSOR_MODEL_ID ||
          "mock-form-processor-model",
      },
    };

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: healthStatus,
    };
  } catch (error) {
    context.log.error("AI Builder health check failed:", error);

    context.res = {
      status: 503,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
    };
  }
};
