const { OpenAI } = require("openai");
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
  // Clean TypeScript syntax for browser compatibility (preserve JSX)
  let cleanedCode = reactCode
    .replace(/import React from 'react';?\n?/g, "")
    .replace(/import.*from.*react.*;\n?/g, "")
    .replace(/interface\s+\w+\s*\{[^}]*\}\s*/g, "") // Remove interface definitions
    .replace(/type\s+\w+\s*=\s*\{[^}]*\};\s*/g, "") // Remove type definitions
    .replace(/:\s*React\.FC(<[^>]*>)?\s*/g, "") // Remove React.FC type annotations
    .replace(/:\s*\w+(\[\])?\s*/g, "") // Remove parameter type annotations
    .replace(/:\s*\{[^}]*\}\s*/g, "") // Remove object type annotations
    .replace(/\s*\|\s*undefined/g, "") // Remove union with undefined
    .replace(/\s*\|\s*null/g, "") // Remove union with null
    .replace(/export\s+default\s+/g, "") // Remove export default
    .replace(/module\.exports\s*=\s*/g, "") // Remove module.exports
    .replace(/exports\./g, "") // Remove exports.
    .replace(/require\(['"`][^'"`]*['"`]\)/g, "{}") // Replace require() with empty object
    // DON'T remove JSX tags - they're needed for React components!
    .trim();

  // Ensure we have React available
  cleanedCode = `const React = window.React;\n${cleanedCode}`;

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
        
        /* Additional Tailwind-like styles for better rendering */
        .bg-primary { background-color: #0078d4; }
        .bg-primary-light { background-color: #106ebe; }
        .bg-primary-dark { background-color: #005a9e; }
        .text-primary { color: #0078d4; }
        .border-primary { border-color: #0078d4; }
        .ring-primary { --tw-ring-color: #0078d4; }
        .focus\\:ring-primary:focus { --tw-ring-color: #0078d4; box-shadow: 0 0 0 2px #0078d4; }
        .focus\\:border-primary:focus { border-color: #0078d4; }
        .hover\\:bg-primary-dark:hover { background-color: #005a9e; }
        .hover\\:bg-primary-light:hover { background-color: #106ebe; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        ${cleanedCode}
        
        // Find and render the component
        const root = ReactDOM.createRoot(document.getElementById('root'));
        
        try {
            // Extract component name from the code
            const componentMatch = \`${cleanedCode}\`.match(/const\\s+(\\w+)\\s*=\\s*\\(/);
            const componentName = componentMatch ? componentMatch[1] : 'MainComponent';
            
            // Create a script element with proper Babel transformation
            const script = document.createElement('script');
            script.type = 'text/babel';
            script.textContent = \`
                const React = window.React;
                ${cleanedCode}
                
                // Make component available globally
                window.GeneratedComponent = ${componentName};
                
                // Render the component
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement(window.GeneratedComponent));
            \`;
            document.head.appendChild(script);
            
        } catch (error) {
            console.error('Component error:', error);
            
            // Show a styled error instead of the fallback
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(
                React.createElement('div', { 
                    className: 'p-8 max-w-4xl mx-auto',
                    style: { fontFamily: 'system-ui' }
                }, [
                    React.createElement('h1', { 
                        key: 'title',
                        className: 'text-2xl font-bold text-gray-800 mb-4'
                    }, '${description}'),
                    React.createElement('div', { 
                        key: 'error',
                        className: 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4'
                    }, [
                        React.createElement('p', { 
                            key: 'msg',
                            className: 'text-red-700 font-medium'
                        }, 'Component failed to render'),
                        React.createElement('p', { 
                            key: 'detail',
                            className: 'text-red-600 text-sm mt-2'
                        }, error.message)
                    ])
                ])
            );
        }
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
