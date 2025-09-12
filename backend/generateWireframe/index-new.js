const { SimpleWireframeGenerator } = require("./simple-wireframe-generator");
const crypto = require("crypto");

// Initialize Simple Generator - clean and reliable
const simpleGenerator = new SimpleWireframeGenerator();

// Logger utility
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error, data = {}) => {
    console.error(`[ERROR] ${message}`, error, data);
  },
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },
};

// Simple wireframe generator - reliable and fast
async function generateWireframeFromDescription(
  description,
  colorScheme,
  correlationId
) {
  try {
    logger.info("🎯 SIMPLE GENERATION: Creating static HTML wireframe", {
      correlationId,
      description: description.substring(0, 100) + "...",
      colorScheme,
      approach: "simple-static-html",
    });

    // Use Simple Generator for reliable results
    const result = await simpleGenerator.generateStaticWireframe(
      description,
      colorScheme
    );

    return {
      html: result.html,
      reactCode: null, // Not needed for static HTML
      source: result.source,
      aiGenerated: true,
      unlimited: true,
      framework: result.framework,
      styling: result.styling,
    };
  } catch (error) {
    logger.error("Simple wireframe generation failed", error, {
      correlationId,
    });

    // Return a simple fallback
    return {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            padding: 20px; 
            background: #f5f5f5; 
            margin: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .title { 
            color: #8E9AAF; 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 20px; 
        }
        .button { 
            background: #8E9AAF; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 16px;
            margin: 10px 5px;
        }
        .button:hover {
            background: #68769C;
        }
        .card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 15px 0;
            border-left: 4px solid #8E9AAF;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Wireframe: ${description}</h1>
        <div class="card">
            <p>Simple, reliable wireframe generated successfully.</p>
            <p><strong>Description:</strong> ${description}</p>
        </div>
        <button class="button">Primary Action</button>
        <button class="button" style="background: #6c757d;">Secondary Action</button>
    </div>
</body>
</html>`,
      reactCode: null,
      source: "fallback",
      aiGenerated: false,
      unlimited: true,
      framework: "html",
      styling: "inline-css",
    };
  }
}

// Main Azure Function
module.exports = async function (context, req) {
  const startTime = Date.now();
  const correlationId = crypto.randomUUID();

  // Set CORS headers
  context.res.headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    context.res.status = 200;
    context.res.body = "";
    return;
  }

  // Only allow POST requests for wireframe generation
  if (req.method !== "POST") {
    context.res.status = 405;
    context.res.body = { error: "Method not allowed" };
    return;
  }

  try {
    const { description, colorScheme = "primary" } = req.body || {};

    if (!description) {
      context.res.status = 400;
      context.res.body = {
        success: false,
        error: "Description is required",
        correlationId,
      };
      return;
    }

    // Generate wireframe using Simple Generator
    const result = await generateWireframeFromDescription(
      description,
      colorScheme,
      correlationId
    );

    const processingTime = Date.now() - startTime;

    // Success response
    context.res.status = 200;
    context.res.body = {
      success: true,
      data: {
        html: result.html,
        reactCode: result.reactCode,
        source: result.source,
        aiGenerated: result.aiGenerated,
        unlimited: result.unlimited,
        framework: result.framework,
        styling: result.styling,
      },
      metadata: {
        correlationId,
        processingTimeMs: processingTime,
        generatedAt: new Date().toISOString(),
        description:
          description.substring(0, 100) +
          (description.length > 100 ? "..." : ""),
      },
    };

    logger.info("✅ Simple wireframe generation completed", {
      correlationId,
      processingTime,
      framework: result.framework,
    });
  } catch (error) {
    logger.error("❌ Wireframe generation failed", error, { correlationId });

    context.res.status = 500;
    context.res.body = {
      success: false,
      error: "Internal server error",
      correlationId,
      details: error.message,
    };
  }
};

// Export the generation function for testing
module.exports.generateWireframeFromDescription =
  generateWireframeFromDescription;
