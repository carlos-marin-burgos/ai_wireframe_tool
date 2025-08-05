const { app } = require('@azure/functions');

// Azure OpenAI configuration
const { OpenAI } = require("openai");

// Initialize OpenAI client with error handling
let openai = null;

function initializeOpenAI() {
  try {
    console.log("🔧 Initializing OpenAI for image analysis...");
    
    if (!process.env.AZURE_OPENAI_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
      console.error("❌ Missing OpenAI configuration for image analysis");
      return false;
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "designetica-gpt4o";
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

    openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });

    console.log("✅ OpenAI initialized for image analysis");
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
app.http('analyzeUIImage', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request, context) => {
    const correlationId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      const body = await request.json();
      const { image, prompt } = body;

      if (!image) {
        return {
          status: 400,
          body: JSON.stringify({
            error: "Image data is required",
            correlationId
          })
        };
      }

      console.log("🔍 Analyzing UI image with GPT-4V", { 
        correlationId,
        imageSize: image.length,
        hasCustomPrompt: !!prompt
      });

      // Enhanced prompt for UI component detection
      const analysisPrompt = prompt || `
        Analyze this UI/website screenshot image and provide a detailed breakdown of ALL visible components and layout structure.

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

      // Call Azure OpenAI GPT-4V
      const response = await Promise.race([
        openai.chat.completions.create({
          model: process.env.AZURE_OPENAI_DEPLOYMENT || "designetica-gpt4o",
          messages: [
            {
              role: "system",
              content: "You are an expert UI/UX analyzer specializing in converting website screenshots into detailed component breakdowns and wireframe descriptions. You have deep knowledge of web design patterns, Microsoft Design System, and modern UI frameworks."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: analysisPrompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: image,
                    detail: "high"
                  }
                }
              ]
            }
          ],
          max_tokens: 4000,
          temperature: 0.1 // Low temperature for consistent analysis
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("GPT-4V request timeout")), 45000)
        )
      ]);

      const processingTime = Date.now() - startTime;

      if (response?.choices?.[0]?.message?.content) {
        let analysisResult = response.choices[0].message.content.trim();

        // Clean up any markdown formatting
        if (analysisResult.startsWith("```json")) {
          analysisResult = analysisResult.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        } else if (analysisResult.startsWith("```")) {
          analysisResult = analysisResult.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");
        }

        try {
          // Parse the JSON response
          const parsedResult = JSON.parse(analysisResult);

          // Validate the structure
          if (!parsedResult.components || !Array.isArray(parsedResult.components)) {
            throw new Error("Invalid response structure");
          }

          console.log("✅ UI image analysis completed successfully", {
            correlationId,
            processingTimeMs: processingTime,
            componentsFound: parsedResult.components.length,
            layoutType: parsedResult.layout?.type,
            confidence: parsedResult.confidence
          });

          return {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate"
            },
            body: JSON.stringify({
              ...parsedResult,
              correlationId,
              processingTimeMs: processingTime,
              source: "gpt4v-vision-analysis"
            })
          };

        } catch (parseError) {
          console.error("❌ Failed to parse GPT-4V response as JSON", {
            correlationId,
            parseError: parseError.message,
            rawResponse: analysisResult.substring(0, 500)
          });

          // Return a fallback response with extracted description
          return {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              components: [],
              layout: { type: "unknown" },
              designTokens: { colors: [], fonts: [], spacing: [] },
              wireframeDescription: analysisResult,
              confidence: 0.3,
              correlationId,
              processingTimeMs: processingTime,
              source: "gpt4v-text-fallback"
            })
          };
        }
      } else {
        throw new Error("No analysis response from GPT-4V");
      }

    } catch (error) {
      const processingTime = Date.now() - startTime;

      console.error("❌ UI image analysis failed", {
        correlationId,
        error: error.message,
        processingTimeMs: processingTime
      });

      // Return fallback analysis
      return {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          components: [
            {
              id: "fallback-1",
              type: "text",
              bounds: { x: 10, y: 10, width: 80, height: 10 },
              text: "UI components detected from uploaded image",
              properties: { color: "#323130" },
              confidence: 0.5
            }
          ],
          layout: {
            type: "unknown",
            sections: ["main"]
          },
          designTokens: {
            colors: ["#0078d4", "#ffffff", "#323130"],
            fonts: ["Segoe UI"],
            spacing: [16, 24, 32]
          },
          wireframeDescription: "Unable to analyze image - using fallback wireframe structure",
          confidence: 0.2,
          correlationId,
          processingTimeMs: processingTime,
          source: "error-fallback",
          error: error.message
        })
      };
    }
  }
});
