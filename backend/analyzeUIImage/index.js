// Azure OpenAI configuration
const { OpenAI } = require("openai");

// Enhanced image analysis utilities
const ImagePreprocessor = require("../utils/imagePreprocessor");
const MultiPassAnalyzer = require("../utils/multiPassAnalyzer");

// Initialize OpenAI client with error handling
let openai = null;
let imagePreprocessor = null;
let multiPassAnalyzer = null;

function initializeOpenAI() {
  try {
    console.log("🔧 Initializing OpenAI for image analysis...");

    // Load local.settings.json values if in development
    if (!process.env.AZURE_OPENAI_KEY) {
      const fs = require("fs");
      const path = require("path");
      try {
        const localSettingsPath = path.join(
          __dirname,
          "..",
          "local.settings.json"
        );
        const localSettings = JSON.parse(
          fs.readFileSync(localSettingsPath, "utf8")
        );

        // Set environment variables from local.settings.json
        Object.keys(localSettings.Values).forEach((key) => {
          if (!process.env[key]) {
            process.env[key] = localSettings.Values[key];
          }
        });

        console.log("📁 Loaded local.settings.json for analyzeUIImage");
      } catch (error) {
        console.error("⚠️ Could not load local.settings.json:", error.message);
      }
    }

    if (!process.env.AZURE_OPENAI_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
      console.error("❌ Missing OpenAI configuration for image analysis");
      return false;
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
    const apiVersion =
      process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

    openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });

    console.log("✅ OpenAI initialized for image analysis");
    console.log("🔑 Using endpoint:", endpoint);
    console.log("🎯 Using deployment:", deployment);

    // Initialize enhancement utilities
    try {
      imagePreprocessor = new ImagePreprocessor();
      multiPassAnalyzer = new MultiPassAnalyzer(openai);
      console.log("🚀 Image enhancement utilities initialized");
    } catch (utilError) {
      console.warn(
        "⚠️ Image enhancement utilities unavailable:",
        utilError.message
      );
      // Continue without enhancement capabilities
    }

    return true;
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI for image analysis:", error);
    return false;
  }
}

// Initialize on startup
initializeOpenAI();

/**
 * Analyzes UI images using Azure OpenAI GPT-4 Vision to detect components and layout
 */
module.exports = async function (context, req) {
  // Set CORS headers first
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    },
  };

  const correlationId = `img-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const startTime = Date.now();

  try {
    console.log("🖼️ Starting UI image analysis", { correlationId });

    // Initialize OpenAI if needed
    if (!openai) {
      const initialized = initializeOpenAI();
      if (!initialized) {
        throw new Error("OpenAI client not available for image analysis");
      }
    }

    // Parse request body
    const body = req.body;
    const { image, prompt } = body;

    if (!image) {
      context.res.status = 400;
      context.res.body = JSON.stringify({
        error: "Image data is required",
        correlationId,
      });
      return;
    }

    console.log("🔍 Analyzing UI image with enhanced processing", {
      correlationId,
      imageSize: image.length,
      hasCustomPrompt: !!prompt,
      enhancementAvailable: !!imagePreprocessor,
      multiPassAvailable: !!multiPassAnalyzer,
    });

    // Phase 1: Image Quality Enhancement (if available)
    let processedImage = image;
    let imageVariants = { original: image };
    let enhancementMetadata = null;

    if (imagePreprocessor) {
      try {
        console.log("🔧 Phase 1: Enhancing image quality...");
        const enhancementResult = await imagePreprocessor.enhanceImageQuality(
          image
        );
        processedImage = enhancementResult.enhanced;
        enhancementMetadata = enhancementResult.metadata;

        // Create multiple analysis variants
        imageVariants = await imagePreprocessor.createAnalysisVariants(
          processedImage
        );
        console.log(
          "✅ Image enhancement completed with variants:",
          Object.keys(imageVariants)
        );
      } catch (enhanceError) {
        console.warn(
          "⚠️ Image enhancement failed, using original:",
          enhanceError.message
        );
        processedImage = image;
      }
    }

    // Phase 2: Multi-Pass Analysis (if available)
    if (multiPassAnalyzer && imageVariants) {
      try {
        console.log("🎯 Phase 2: Performing multi-pass analysis...");
        const multiPassResults =
          await multiPassAnalyzer.performMultiPassAnalysis(
            processedImage,
            imageVariants,
            correlationId
          );

        if (
          multiPassResults.consolidated &&
          multiPassResults.confidence > 0.5
        ) {
          console.log("✅ Multi-pass analysis successful", {
            correlationId,
            confidence: multiPassResults.confidence,
            componentsFound:
              multiPassResults.consolidated.components?.length || 0,
            processingTimeMs: multiPassResults.processingTime,
          });

          const processingTime = Date.now() - startTime;

          context.res.status = 200;
          context.res.headers = {
            ...context.res.headers,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          };
          context.res.body = JSON.stringify({
            ...multiPassResults.consolidated,
            correlationId,
            processingTimeMs: processingTime,
            source: "multi-pass-gpt4v-enhanced",
            enhancement: enhancementMetadata,
            analysisMethod: "multi-pass",
            passResults: {
              totalPasses: Object.keys(multiPassResults.passes).length,
              successfulPasses: Object.values(multiPassResults.passes).filter(
                (pass) => !pass.error
              ).length,
            },
          });
          return;
        } else {
          console.warn(
            "⚠️ Multi-pass analysis quality insufficient, falling back to standard analysis"
          );
        }
      } catch (multiPassError) {
        console.warn(
          "⚠️ Multi-pass analysis failed, falling back to standard analysis:",
          multiPassError.message
        );
      }
    }

    // Phase 3: Standard Enhanced Analysis (fallback with preprocessing)
    console.log("🔍 Phase 3: Performing standard enhanced analysis...");

    // Enhanced prompt for UI component detection with preprocessing context
    const analysisPrompt =
      prompt ||
      `
        Analyze this UI/website screenshot image and provide a detailed breakdown of ALL visible components and layout structure.
        ${
          enhancementMetadata
            ? `\n[IMAGE ENHANCED: Resolution improved by ${
                enhancementMetadata.improvement?.resolutionGain || "0%"
              }, optimized for component detection]`
            : ""
        }

        For EACH component you identify, provide:
        1. **Type**: button, input, card, navigation, header, text, image, form, table, list, modal, dropdown, search, menu, footer, sidebar
        2. **Position**: approximate percentage coordinates (x, y, width, height) relative to the image
        3. **Text Content**: exact text visible (if any)
        4. **Properties**: colors, styling, size hints
        5. **Confidence**: 0.0-1.0 how certain you are about this component

        Also analyze:
        - **Layout Structure**: grid, flexbox, absolute positioning, columns
        - **Design Tokens**: color palette, typography styles, spacing patterns
        - **Navigation Pattern**: header nav, sidebar, breadcrumbs, pagination
        - **Content Areas**: main content, sidebar, footer sections

        Return the response in this EXACT JSON format:
        {
          "components": [
            {
              "id": "component-1",
              "type": "button",
              "bounds": { "x": 20, "y": 10, "width": 15, "height": 8 },
              "text": "Get Started",
              "properties": {
                "color": "#0078d4",
                "style": "primary",
                "size": "medium"
              },
              "confidence": 0.95
            }
          ],
          "layout": {
            "type": "grid",
            "columns": 12,
            "sections": ["header", "main", "footer"],
            "navigationPattern": "top-nav"
          },
          "designTokens": {
            "colors": ["#0078d4", "#ffffff", "#f8f9fa"],
            "fonts": ["Segoe UI", "Arial"],
            "spacing": [8, 16, 24, 32]
          },
          "wireframeDescription": "A modern landing page with top navigation, hero section with call-to-action button, feature cards grid, and footer",
          "confidence": 0.87
        }

        Be VERY thorough - identify every button, input field, card, navigation element, text block, and image you can see.
      `;

    // Call Azure OpenAI GPT-4V with enhanced image
    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert UI/UX analyzer specializing in converting website screenshots into detailed component breakdowns and wireframe descriptions. You have deep knowledge of web design patterns, Microsoft Design System, and modern UI frameworks. You excel at detecting enhanced and preprocessed images.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analysisPrompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: processedImage, // Use enhanced image
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 4000,
        temperature: 0.1, // Low temperature for consistent analysis
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("GPT-4V request timeout")), 45000)
      ),
    ]);

    const processingTime = Date.now() - startTime;

    if (response?.choices?.[0]?.message?.content) {
      let analysisResult = response.choices[0].message.content.trim();

      // Clean up any markdown formatting
      if (analysisResult.startsWith("```json")) {
        analysisResult = analysisResult
          .replace(/^```json\n?/, "")
          .replace(/\n?```$/, "");
      } else if (analysisResult.startsWith("```")) {
        analysisResult = analysisResult
          .replace(/^```[a-zA-Z]*\n?/, "")
          .replace(/\n?```$/, "");
      }

      try {
        // Parse the JSON response
        const parsedResult = JSON.parse(analysisResult);

        // Validate the structure
        if (
          !parsedResult.components ||
          !Array.isArray(parsedResult.components)
        ) {
          throw new Error("Invalid response structure");
        }

        console.log("✅ UI image analysis completed successfully", {
          correlationId,
          processingTimeMs: processingTime,
          componentsFound: parsedResult.components.length,
          layoutType: parsedResult.layout?.type,
          confidence: parsedResult.confidence,
          enhanced: !!enhancementMetadata,
          analysisMethod: "standard-enhanced",
        });

        context.res.status = 200;
        context.res.headers = {
          ...context.res.headers,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        };
        context.res.body = JSON.stringify({
          ...parsedResult,
          correlationId,
          processingTimeMs: processingTime,
          source: enhancementMetadata
            ? "gpt4v-enhanced-analysis"
            : "gpt4v-vision-analysis",
          enhancement: enhancementMetadata,
          analysisMethod: "standard-enhanced",
        });
        return;
      } catch (parseError) {
        console.error("❌ Failed to parse GPT-4V response as JSON", {
          correlationId,
          parseError: parseError.message,
          rawResponse: analysisResult.substring(0, 500),
        });

        // Return a fallback response with extracted description
        context.res.status = 200;
        context.res.body = JSON.stringify({
          components: [],
          layout: { type: "unknown" },
          designTokens: { colors: [], fonts: [], spacing: [] },
          wireframeDescription: analysisResult,
          confidence: 0.3,
          correlationId,
          processingTimeMs: processingTime,
          source: "gpt4v-text-fallback",
          enhancement: enhancementMetadata,
          analysisMethod: "fallback",
        });
        return;
      }
    } else {
      throw new Error("No analysis response from GPT-4V");
    }
  } catch (error) {
    const processingTime = Date.now() - startTime;

    console.error("❌ UI image analysis failed", {
      correlationId,
      error: error.message,
      processingTimeMs: processingTime,
    });

    // Return fallback analysis
    context.res.status = 200;
    context.res.body = JSON.stringify({
      components: [
        {
          id: "fallback-1",
          type: "text",
          bounds: { x: 10, y: 10, width: 80, height: 10 },
          text: "UI components detected from uploaded image",
          properties: { color: "#323130" },
          confidence: 0.5,
        },
      ],
      layout: {
        type: "unknown",
        sections: ["main"],
      },
      designTokens: {
        colors: ["#0078d4", "#ffffff", "#323130"],
        fonts: ["Segoe UI"],
        spacing: [16, 24, 32],
      },
      wireframeDescription:
        "Unable to analyze image - using fallback wireframe structure",
      confidence: 0.2,
      correlationId,
      processingTimeMs: processingTime,
      source: "error-fallback",
      error: error.message,
    });
    return;
  }
};
