const { OpenAI } = require("openai");
const { PureAIWireframeGenerator } = require("../pure-ai-wireframe-generator");
const crypto = require("crypto");

// Initialize Pure AI Generator
const pureAIGenerator = new PureAIWireframeGenerator();

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

// Pure AI wireframe generator - replaces ALL template-based systems
async function generateWireframeFromDescription(
  description,
  colorScheme,
  correlationId,
  sessionId = null,
  generationContext = null
) {
  try {
    logger.info("🤖 PURE AI GENERATION: Creating wireframe from description", {
      correlationId,
      description: description.substring(0, 100) + "...",
      colorScheme,
      approach: "pure-ai-react-unlimited",
    });

    // Use Pure AI Generator for unlimited possibilities
    const aiResult = await pureAIGenerator.generateReactWireframe(description, {
      colorScheme,
      framework: "react",
      styling: "tailwind",
      includeInteractivity: true,
      accessibility: true,
      responsive: true,
    });

    // Convert React component to HTML for display
    const htmlResult = convertReactToDisplayHTML(aiResult.code, description);

    return {
      html: htmlResult,
      reactCode: aiResult.code, // Include React code for future use
      source: "pure-ai",
      aiGenerated: true,
      framework: aiResult.framework,
      styling: aiResult.styling,
      generatedAt: aiResult.generatedAt,
      unlimited: true, // Flag indicating this can handle ANY description
    };
  } catch (aiError) {
    logger.warn("⚠️ Pure AI generation failed, attempting fallback", {
      correlationId,
      error: aiError.message,
      fallbackReason: "ai_generation_failed",
    });

    // Minimal fallback
    const fallbackHtml = generateSimpleFallback(description, colorScheme);

    return {
      html: fallbackHtml,
      source: "emergency-fallback",
      aiGenerated: false,
      warning: "AI failed - using minimal fallback",
    };
  }
}

// Convert React component code to displayable HTML
function convertReactToDisplayHTML(reactCode, description) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8f9fa;
        }
        #root {
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        ${reactCode}
        
        // Render the component
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(ComponentName || (() => React.createElement('div', {}, 'Component Loading...'))));
    </script>
</body>
</html>`;
}

// Minimal fallback for emergencies
function generateSimpleFallback(description, colorScheme) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif;
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #0078d4; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; margin-bottom: 15px; }
        .placeholder { 
            background: #e9ecef; 
            padding: 20px; 
            border-radius: 4px; 
            margin: 20px 0;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Wireframe: ${description}</h1>
        <p>This wireframe shows the basic structure for: <strong>${description}</strong></p>
        <div class="placeholder">
            Content area for: ${description}
        </div>
        <div class="placeholder">
            Additional components would appear here
        </div>
    </div>
</body>
</html>`;
}

// Azure Function entry point
module.exports = async function (context, req) {
  const correlationId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // Set CORS headers first
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Correlation-ID": correlationId,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    };

    // Handle OPTIONS preflight request
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      context.res.body = "OK";
      return;
    }

    // Validate request
    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = { error: "Method not allowed" };
      return;
    }

    const { description, colorScheme = "primary" } = req.body || {};

    if (!description) {
      context.res.status = 400;
      context.res.body = {
        error: "Description is required",
        correlationId,
      };
      return;
    }

    logger.info("🌐 API Request received", {
      correlationId,
      description: description.substring(0, 100) + "...",
      colorScheme,
      method: req.method,
    });

    // Generate wireframe using Pure AI
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

    logger.info("✅ API Response sent successfully", {
      correlationId,
      processingTime,
      source: result.source,
      htmlLength: result.html.length,
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;

    logger.error("💥 API Error", error, {
      correlationId,
      processingTime,
    });

    context.res.status = 500;
    context.res.body = {
      success: false,
      error: {
        message: "Internal server error",
        correlationId,
        processingTimeMs: processingTime,
      },
    };
  }
};

// Export the main function for external use
module.exports.generateWireframeFromDescription =
  generateWireframeFromDescription;
