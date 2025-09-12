// TEMPORARILY DISABLED: This file uses the v4 programming model (app.http). It interferes with classic (v3) model HTTP binding.
// To re-enable later, extract each handler into its own classic function folder with function.json OR migrate entire app to v4.
// For now we export a simple function and skip app.http registrations to restore proper req binding in other functions.
if (process.env.DISABLE_AI_BUILDER !== "false") {
  module.exports = async function (context, req) {
    return {
      status: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "AI Builder Integration is temporarily disabled",
        status: "disabled",
      }),
    };
  };
  return; // Prevent further execution and app.http registrations
}

const { app } = require("@azure/functions");
// Note: multipart parsing would need proper library - using mock for now
const {
  AIBuilderIntegrationService,
} = require("../services/aiBuilderIntegrationService");

/**
 * AI Builder Integration Endpoint for Power Platform
 * Handles wireframe analysis, component detection, and AI Builder operations
 */

// Initialize AI Builder service
let aiBuilderService;

async function initializeAIBuilderService() {
  if (!aiBuilderService) {
    const apiKey = process.env.AI_BUILDER_API_KEY || "mock-key";
    const environment = process.env.POWER_PLATFORM_ENVIRONMENT || "development";
    aiBuilderService = new AIBuilderIntegrationService(apiKey, environment);
  }
  return aiBuilderService;
}

// Health check endpoint
app.http("aiBuilderHealth", {
  methods: ["GET"],
  authLevel: "function",
  route: "ai-builder/health",
  handler: async (request, context) => {
    try {
      const service = await initializeAIBuilderService();

      // Check service availability
      const healthStatus = {
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

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        jsonBody: healthStatus,
      };
    } catch (error) {
      context.log.error("Health check failed:", error);

      return {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        jsonBody: {
          status: "unhealthy",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },
});

// Analyze wireframe image with AI Builder
app.http("analyzeWireframeImage", {
  methods: ["POST"],
  authLevel: "function",
  route: "ai-builder/analyze-image",
  handler: async (request, context) => {
    try {
      const service = await initializeAIBuilderService();
      const contentType = request.headers.get("content-type") || "";

      let imageBuffer;
      let analysisOptions = {
        analysisDepth: "detailed",
        detectComponents: true,
        analyzeLayout: true,
      };

      // Handle multipart form data - simplified for now
      if (contentType.includes("multipart/form-data")) {
        // For now, expect JSON with base64 - multipart parsing needs proper implementation
        const body = await request.json();
        if (body.imageBase64) {
          imageBuffer = Buffer.from(body.imageBase64, "base64");
        }
        analysisOptions = { ...analysisOptions, ...body.options };
      } else {
        // Handle JSON with base64 image
        const body = await request.json();
        if (body.imageBase64) {
          imageBuffer = Buffer.from(body.imageBase64, "base64");
        }
        analysisOptions = { ...analysisOptions, ...body.options };
      }

      if (!imageBuffer) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          jsonBody: {
            error: {
              code: "MISSING_IMAGE",
              message: "No image provided for analysis",
            },
          },
        };
      }

      context.log.info("Starting AI Builder wireframe analysis", {
        imageSize: imageBuffer.length,
        analysisOptions,
      });

      // Perform AI Builder component detection
      const analysisResult = await service.detectWireframeComponents(
        imageBuffer
      );

      // Generate improvement recommendations
      const recommendations =
        generateImprovementRecommendations(analysisResult);

      // Calculate accessibility and usability scores
      const scores = calculateDesignScores(analysisResult);

      const response = {
        components: analysisResult.components,
        layout: analysisResult.layout,
        designPatterns: analysisResult.designPatterns,
        confidence: analysisResult.confidence,
        recommendations: recommendations,
        scores: scores,
        metadata: {
          ...analysisResult.metadata,
          analysisDepth: analysisOptions.analysisDepth,
          processingTime: analysisResult.processingTime,
        },
      };

      context.log.info("AI Builder analysis completed successfully", {
        componentCount: analysisResult.components.length,
        confidence: analysisResult.confidence,
        processingTime: analysisResult.processingTime,
      });

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        jsonBody: response,
      };
    } catch (error) {
      context.log.error("AI Builder analysis failed:", error);

      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        jsonBody: {
          error: {
            code: "ANALYSIS_FAILED",
            message: "Failed to analyze wireframe image",
            details: error.message,
          },
        },
      };
    }
  },
});

// Compare two wireframes using AI Builder
app.http("compareWireframes", {
  methods: ["POST"],
  authLevel: "function",
  route: "ai-builder/compare",
  handler: async (request, context) => {
    try {
      const service = await initializeAIBuilderService();
      const contentType = request.headers.get("content-type") || "";

      let wireframe1Buffer, wireframe2Buffer;
      let comparisonType = "comprehensive";

      // Handle multipart form data - simplified for now
      if (contentType.includes("multipart/form-data")) {
        // For now, expect JSON with base64 - multipart parsing needs proper implementation
        const body = await request.json();
        if (body.wireframe1Base64) {
          wireframe1Buffer = Buffer.from(body.wireframe1Base64, "base64");
        }
        if (body.wireframe2Base64) {
          wireframe2Buffer = Buffer.from(body.wireframe2Base64, "base64");
        }
        comparisonType = body.comparisonType || "comprehensive";
      } else {
        // Handle JSON with base64 images
        const body = await request.json();
        if (body.wireframe1Base64) {
          wireframe1Buffer = Buffer.from(body.wireframe1Base64, "base64");
        }
        if (body.wireframe2Base64) {
          wireframe2Buffer = Buffer.from(body.wireframe2Base64, "base64");
        }
        comparisonType = body.comparisonType || "comprehensive";
      }

      if (!wireframe1Buffer || !wireframe2Buffer) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          jsonBody: {
            error: {
              code: "MISSING_WIREFRAMES",
              message: "Both wireframe images are required for comparison",
            },
          },
        };
      }

      context.log.info("Starting AI Builder wireframe comparison", {
        wireframe1Size: wireframe1Buffer.length,
        wireframe2Size: wireframe2Buffer.length,
        comparisonType,
      });

      // Perform AI Builder comparison
      const comparisonResult = await service.compareWireframes(
        wireframe1Buffer,
        wireframe2Buffer
      );

      // Add Power Platform specific formatting
      const response = {
        similarity: comparisonResult.similarity,
        differences: comparisonResult.differences,
        recommendations: comparisonResult.recommendations,
        detailedAnalysis: comparisonResult.detailedAnalysis,
        comparisonType: comparisonType,
        summary: {
          overallSimilarity: Math.round(
            comparisonResult.similarity.overall * 100
          ),
          majorDifferences: comparisonResult.differences.filter(
            (d) => d.severity === "high"
          ).length,
          improvementPotential: calculateImprovementPotential(comparisonResult),
        },
      };

      context.log.info("Wireframe comparison completed", {
        overallSimilarity: response.summary.overallSimilarity,
        majorDifferences: response.summary.majorDifferences,
      });

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        jsonBody: response,
      };
    } catch (error) {
      context.log.error("Wireframe comparison failed:", error);

      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        jsonBody: {
          error: {
            code: "COMPARISON_FAILED",
            message: "Failed to compare wireframes",
            details: error.message,
          },
        },
      };
    }
  },
});

// Generate wireframe variations using AI Builder insights
app.http("generateWireframeVariations", {
  methods: ["POST"],
  authLevel: "function",
  route: "ai-builder/generate-variations",
  handler: async (request, context) => {
    try {
      const service = await initializeAIBuilderService();
      const body = await request.json();

      const {
        baseWireframeId,
        variationTypes = ["layout", "color"],
        maxVariations = 5,
        targetDevices = ["desktop"],
      } = body;

      if (!baseWireframeId) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          jsonBody: {
            error: {
              code: "MISSING_BASE_WIREFRAME",
              message: "Base wireframe ID is required",
            },
          },
        };
      }

      context.log.info("Generating wireframe variations", {
        baseWireframeId,
        variationTypes,
        maxVariations,
        targetDevices,
      });

      // Get base wireframe components (mock implementation)
      const baseComponents = await getWireframeComponents(baseWireframeId);

      // Generate variations using AI Builder insights
      const variations = await service.generateWireframeVariations(
        baseComponents,
        variationTypes
      );

      // Limit to requested number of variations
      const limitedVariations = variations.slice(0, maxVariations);

      // Add device-specific optimizations
      const optimizedVariations = await optimizeVariationsForDevices(
        limitedVariations,
        targetDevices
      );

      const response = {
        variations: optimizedVariations,
        totalGenerated: limitedVariations.length,
        variationTypes: variationTypes,
        targetDevices: targetDevices,
        processingTime: Date.now(), // Simplified timing
      };

      context.log.info("Wireframe variations generated successfully", {
        variationCount: limitedVariations.length,
        variationTypes,
      });

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        jsonBody: response,
      };
    } catch (error) {
      context.log.error("Variation generation failed:", error);

      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        jsonBody: {
          error: {
            code: "VARIATION_FAILED",
            message: "Failed to generate wireframe variations",
            details: error.message,
          },
        },
      };
    }
  },
});

// Get AI design suggestions
app.http("getAIDesignSuggestions", {
  methods: ["POST"],
  authLevel: "function",
  route: "ai-builder/ai-suggestions",
  handler: async (request, context) => {
    try {
      const service = await initializeAIBuilderService();
      const body = await request.json();

      const {
        wireframeData,
        suggestionTypes = ["accessibility", "usability"],
        targetAudience = "general",
        businessGoals = [],
      } = body;

      if (!wireframeData) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          jsonBody: {
            error: {
              code: "MISSING_WIREFRAME_DATA",
              message: "Wireframe data is required for AI suggestions",
            },
          },
        };
      }

      context.log.info("Generating AI design suggestions", {
        suggestionTypes,
        targetAudience,
        businessGoals: businessGoals.length,
      });

      // Analyze wireframe if image provided
      let analysisResult;
      if (wireframeData.imageBase64) {
        const imageBuffer = Buffer.from(wireframeData.imageBase64, "base64");
        analysisResult = await service.detectWireframeComponents(imageBuffer);
      } else if (wireframeData.components) {
        analysisResult = { components: wireframeData.components };
      }

      // Generate AI-powered suggestions
      const suggestions = await generateAISuggestions(
        analysisResult,
        suggestionTypes,
        targetAudience,
        businessGoals
      );

      // Calculate improvement score
      const improvementScore = calculateImprovementScore(suggestions);

      // Prioritize recommendations
      const priorityRecommendations = suggestions
        .filter((s) => s.priority === "high")
        .slice(0, 5)
        .map((s) => s.title);

      const response = {
        suggestions: suggestions,
        priorityRecommendations: priorityRecommendations,
        improvementScore: improvementScore,
        targetAudience: targetAudience,
        suggestionTypes: suggestionTypes,
        metadata: {
          totalSuggestions: suggestions.length,
          highPriority: suggestions.filter((s) => s.priority === "high").length,
          mediumPriority: suggestions.filter((s) => s.priority === "medium")
            .length,
          lowPriority: suggestions.filter((s) => s.priority === "low").length,
        },
      };

      context.log.info("AI suggestions generated successfully", {
        totalSuggestions: suggestions.length,
        improvementScore: improvementScore,
      });

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        jsonBody: response,
      };
    } catch (error) {
      context.log.error("AI suggestions generation failed:", error);

      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        jsonBody: {
          error: {
            code: "SUGGESTIONS_FAILED",
            message: "Failed to generate AI suggestions",
            details: error.message,
          },
        },
      };
    }
  },
});

// AI Builder model status endpoint
app.http("aiBuilderModelStatus", {
  methods: ["GET"],
  authLevel: "function",
  route: "ai-builder/models/status",
  handler: async (request, context) => {
    try {
      // Mock implementation - replace with actual AI Builder SDK calls
      const modelStatus = {
        objectDetectionModel: {
          id:
            process.env.AI_BUILDER_OBJECT_DETECTION_MODEL_ID ||
            "mock-object-detection-model",
          status: "ready",
          accuracy: 0.87,
          lastTrained: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          trainingDataCount: 500,
        },
        formProcessorModel: {
          id:
            process.env.AI_BUILDER_FORM_PROCESSOR_MODEL_ID ||
            "mock-form-processor-model",
          status: "ready",
          accuracy: 0.91,
          lastTrained: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          documentsProcessed: 1200,
        },
        environment: process.env.POWER_PLATFORM_ENVIRONMENT || "development",
        lastChecked: new Date().toISOString(),
      };

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        jsonBody: modelStatus,
      };
    } catch (error) {
      context.log.error("Failed to get model status:", error);

      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        jsonBody: {
          error: {
            code: "MODEL_STATUS_FAILED",
            message: "Failed to retrieve AI Builder model status",
            details: error.message,
          },
        },
      };
    }
  },
});

// Helper functions
function generateImprovementRecommendations(analysisResult) {
  const recommendations = [];

  // Accessibility recommendations
  if (
    analysisResult.components.filter((c) => c.type === "button").length > 10
  ) {
    recommendations.push({
      category: "accessibility",
      title: "Reduce Button Count",
      description:
        "Consider consolidating buttons or using progressive disclosure to improve accessibility",
      priority: "medium",
      impactScore: 0.7,
    });
  }

  // Layout recommendations
  if (analysisResult.layout.columns > 4) {
    recommendations.push({
      category: "usability",
      title: "Simplify Layout",
      description:
        "Complex multi-column layouts can be overwhelming. Consider a simpler grid structure",
      priority: "high",
      impactScore: 0.8,
    });
  }

  // Component balance recommendations
  const componentTypes = analysisResult.components.map((c) => c.type);
  const uniqueTypes = [...new Set(componentTypes)];

  if (uniqueTypes.length < 3) {
    recommendations.push({
      category: "design",
      title: "Increase Component Variety",
      description:
        "Add more diverse components to create a richer user experience",
      priority: "low",
      impactScore: 0.5,
    });
  }

  return recommendations;
}

function calculateDesignScores(analysisResult) {
  // Calculate accessibility score based on component detection
  const accessibilityScore = Math.min(
    1.0,
    (analysisResult.components.filter((c) =>
      ["button", "input", "navigation"].includes(c.type)
    ).length /
      Math.max(1, analysisResult.components.length)) *
      1.2
  );

  // Calculate usability score based on layout structure
  const usabilityScore = Math.min(
    1.0,
    (analysisResult.layout.sections.length <= 5 ? 0.9 : 0.6) *
      (analysisResult.layout.columns <= 3 ? 1.0 : 0.7)
  );

  return {
    accessibility: Math.round(accessibilityScore * 100),
    usability: Math.round(usabilityScore * 100),
    overall: Math.round(((accessibilityScore + usabilityScore) / 2) * 100),
  };
}

function calculateImprovementPotential(comparisonResult) {
  const similarityScore = comparisonResult.similarity.overall;
  const highSeverityDiffs = comparisonResult.differences.filter(
    (d) => d.severity === "high"
  ).length;

  // Lower similarity and more high-severity differences = higher improvement potential
  return Math.round((1 - similarityScore) * 100 + highSeverityDiffs * 10);
}

async function getWireframeComponents(wireframeId) {
  // Mock implementation - replace with actual database query
  return [
    {
      type: "navigation",
      confidence: 0.9,
      boundingBox: { x: 0, y: 0, width: 800, height: 60 },
      properties: { size: "large", position: { x: 0, y: 0 } },
    },
    {
      type: "hero",
      confidence: 0.85,
      boundingBox: { x: 0, y: 60, width: 800, height: 200 },
      properties: { size: "large", position: { x: 0, y: 60 } },
    },
  ];
}

async function optimizeVariationsForDevices(variations, targetDevices) {
  // Apply device-specific optimizations
  return variations.map((variation) => ({
    ...variation,
    deviceOptimizations: targetDevices.reduce((acc, device) => {
      acc[device] = {
        optimized: true,
        adjustments: getDeviceAdjustments(variation, device),
      };
      return acc;
    }, {}),
  }));
}

function getDeviceAdjustments(variation, device) {
  const adjustments = {
    desktop: { columns: 3, fontSize: "16px", spacing: "normal" },
    tablet: { columns: 2, fontSize: "16px", spacing: "comfortable" },
    mobile: { columns: 1, fontSize: "18px", spacing: "compact" },
  };

  return adjustments[device] || adjustments.desktop;
}

async function generateAISuggestions(
  analysisResult,
  suggestionTypes,
  targetAudience,
  businessGoals
) {
  const suggestions = [];

  if (suggestionTypes.includes("accessibility")) {
    suggestions.push({
      category: "accessibility",
      title: "Add Alt Text for Images",
      description:
        "Ensure all images have descriptive alt text for screen readers",
      priority: "high",
      impactScore: 0.9,
    });

    if (analysisResult?.components) {
      const buttonCount = analysisResult.components.filter(
        (c) => c.type === "button"
      ).length;
      if (buttonCount > 8) {
        suggestions.push({
          category: "accessibility",
          title: "Reduce Cognitive Load",
          description: `${buttonCount} buttons detected. Consider grouping or prioritizing actions`,
          priority: "medium",
          impactScore: 0.7,
        });
      }
    }
  }

  if (suggestionTypes.includes("usability")) {
    suggestions.push({
      category: "usability",
      title: "Improve Visual Hierarchy",
      description:
        "Use consistent spacing and typography to guide user attention",
      priority: "medium",
      impactScore: 0.8,
    });

    if (targetAudience === "elderly") {
      suggestions.push({
        category: "usability",
        title: "Increase Touch Target Size",
        description:
          "Make buttons and interactive elements larger for easier interaction",
        priority: "high",
        impactScore: 0.9,
      });
    }
  }

  if (suggestionTypes.includes("performance")) {
    suggestions.push({
      category: "performance",
      title: "Optimize Image Loading",
      description:
        "Implement lazy loading for images to improve page performance",
      priority: "medium",
      impactScore: 0.6,
    });
  }

  if (businessGoals.includes("conversion")) {
    suggestions.push({
      category: "conversion",
      title: "Add Clear Call-to-Action",
      description:
        "Include a prominent, action-oriented CTA to guide user behavior",
      priority: "high",
      impactScore: 0.95,
    });
  }

  return suggestions;
}

function calculateImprovementScore(suggestions) {
  if (suggestions.length === 0) return 0;

  const weightedScore = suggestions.reduce((total, suggestion) => {
    const priorityWeight = {
      high: 1.0,
      medium: 0.7,
      low: 0.4,
    };

    return total + suggestion.impactScore * priorityWeight[suggestion.priority];
  }, 0);

  return Math.round((weightedScore / suggestions.length) * 100);
}

module.exports = { app };
