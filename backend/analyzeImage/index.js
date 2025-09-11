const {
  aiBuilderIntegrationService,
} = require("../services/aiBuilderIntegrationService");

module.exports = async function (context, req) {
  context.log("Analyze Image function processed a request.");

  // Handle CORS
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
    return;
  }

  try {
    const { imageUrl, imageData, fileName } = req.body;

    if (!imageUrl && !imageData) {
      context.res = {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: {
          error: "Image URL or image data is required",
        },
      };
      return;
    }

    // Use the AI Builder integration service to analyze the image
    const analysisResult =
      await aiBuilderIntegrationService.detectWireframeComponents(
        imageUrl || imageData,
        fileName || "uploaded-image"
      );

    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: {
        success: true,
        analysis: analysisResult,
        message: "Image analysis completed successfully",
      },
    };
  } catch (error) {
    context.log.error("Error analyzing image:", error);

    context.res = {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: {
        error: "Failed to analyze image",
        details: error.message,
      },
    };
  }
};
