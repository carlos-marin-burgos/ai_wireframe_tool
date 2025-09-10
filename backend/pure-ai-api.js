/**
 * API endpoint for Pure AI Wireframe Generation
 * Replaces template-based system with unlimited AI generation
 */

const express = require("express");
const router = express.Router();
const {
  generateWireframeFromDescription,
} = require("../generateWireframe/index");
const { PureAIWireframeGenerator } = require("../pure-ai-wireframe-generator");

// Initialize Pure AI Generator
const pureAIGenerator = new PureAIWireframeGenerator();

/**
 * POST /api/pure-ai-wireframe
 * Generate any wireframe using pure AI approach
 */
router.post("/pure-ai-wireframe", async (req, res) => {
  try {
    const {
      description,
      colorScheme = "primary",
      options = {},
      sessionId = null,
    } = req.body;

    if (!description) {
      return res.status(400).json({
        error: "Description is required",
        success: false,
      });
    }

    console.log("🤖 Pure AI Wireframe Request:", {
      description: description.substring(0, 100) + "...",
      colorScheme,
      timestamp: new Date().toISOString(),
    });

    // Generate wireframe using Pure AI
    const result = await generateWireframeFromDescription(
      description,
      colorScheme,
      `pure-ai-${Date.now()}`,
      sessionId,
      null // no generation context needed for pure AI
    );

    res.json({
      success: true,
      html: result.html,
      reactCode: result.reactCode,
      metadata: {
        source: result.source,
        aiGenerated: result.aiGenerated,
        framework: result.framework,
        styling: result.styling,
        generatedAt: result.generatedAt,
        unlimited: result.unlimited,
        capabilities: "Can generate ANY wireframe from description",
      },
      description,
      colorScheme,
    });
  } catch (error) {
    console.error("❌ Pure AI wireframe generation failed:", error);
    res.status(500).json({
      error: "Pure AI generation failed",
      details: error.message,
      success: false,
      fallback: "Check logs for details",
    });
  }
});

/**
 * POST /api/pure-ai-variations
 * Generate multiple variations of the same wireframe
 */
router.post("/pure-ai-variations", async (req, res) => {
  try {
    const {
      description,
      count = 3,
      colorSchemes = ["primary", "secondary", "accent"],
    } = req.body;

    if (!description) {
      return res.status(400).json({
        error: "Description is required",
        success: false,
      });
    }

    console.log("🔄 Generating variations:", {
      description: description.substring(0, 50) + "...",
      count,
      colorSchemes,
    });

    const variations = await pureAIGenerator.generateVariations(
      description,
      count
    );

    res.json({
      success: true,
      variations: variations.map((v) => ({
        ...v,
        html: convertReactToDisplayHTML(v.code, description),
      })),
      metadata: {
        totalVariations: variations.length,
        approach: "pure-ai-variations",
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Pure AI variations failed:", error);
    res.status(500).json({
      error: "Variations generation failed",
      details: error.message,
      success: false,
    });
  }
});

/**
 * GET /api/pure-ai-examples
 * Show examples of what Pure AI can generate
 */
router.get("/pure-ai-examples", (req, res) => {
  const examples = {
    navigation: [
      "left navigation sidebar with collapsible menu sections",
      "top navigation with dropdown menus and search bar",
      "mobile hamburger menu with slide-out animation",
      "breadcrumb navigation for multi-level hierarchy",
      "tab navigation with active states and icons",
    ],
    dashboards: [
      "analytics dashboard with real-time charts and KPIs",
      "admin dashboard with user management widgets",
      "sales dashboard with revenue tracking and forecasts",
      "monitoring dashboard with system health metrics",
      "social media dashboard with engagement statistics",
    ],
    tables: [
      "data table with sorting, filtering, and pagination",
      "editable table with inline validation and bulk actions",
      "comparison table with feature highlighting",
      "pricing table with plan comparison and CTAs",
      "invoice table with line item calculations",
    ],
    ecommerce: [
      "product catalog with filters and search",
      "shopping cart with quantity updates and totals",
      "checkout flow with payment form validation",
      "product detail page with image gallery and reviews",
      "wishlist with save for later functionality",
    ],
    forms: [
      "multi-step form with progress indicator",
      "contact form with file upload support",
      "user registration with password strength meter",
      "survey form with conditional question logic",
      "settings form with toggle switches and preferences",
    ],
    creative: [
      "kanban project board with drag and drop",
      "calendar scheduler with appointment booking",
      "chat interface with message bubbles and emoji picker",
      "file manager with folder tree and preview pane",
      "photo editor with tools panel and layer management",
      "music player with playlist and audio controls",
      "video streaming platform with player controls",
      "recipe app with ingredient calculator and timer",
    ],
  };

  res.json({
    success: true,
    message: "Pure AI can generate ANY of these wireframes (and more!)",
    examples,
    note: "Just provide any description and Pure AI will create a React component for it",
    capabilities: [
      "Unlimited wireframe types",
      "No template constraints",
      "Modern React components",
      "Tailwind CSS styling",
      "Responsive design",
      "Accessibility compliant",
      "Interactive functionality",
      "TypeScript interfaces",
    ],
  });
});

// Helper function (duplicated here for the API)
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

module.exports = router;
