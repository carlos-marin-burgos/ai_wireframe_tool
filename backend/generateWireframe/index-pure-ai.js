// Fixed version of generateWireframe index.js with pure AI approach
const { OpenAI } = require("openai");
const { PureAIWireframeGenerator } = require("../pure-ai-wireframe-generator");

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

// Pure AI wireframe generator - replaces template-based system
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
      approach: "pure-ai-react",
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
        h1 { color: #8E9AAF; margin-bottom: 20px; }
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

module.exports = {
  generateWireframeFromDescription,
  convertReactToDisplayHTML,
  generateSimpleFallback,
};
