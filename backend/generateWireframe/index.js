const { MinimalWireframeGenerator } = require("./minimal-wireframe-generator");
const { TemplateManager, selectTemplate } = require("../template-manager");
const crypto = require("crypto");
// Import centralized color configuration
const { WIREFRAME_COLORS } = require("../config/colors");
// Import accessibility validation
const {
  AccessibilityValidationMiddleware,
} = require("../accessibility/validation-middleware");

// Initialize components
const minimalGenerator = new MinimalWireframeGenerator();
const templateManager = new TemplateManager();
const accessibilityMiddleware = new AccessibilityValidationMiddleware();

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
    // First check if we should use a template
    const selectedTemplate = selectTemplate(description);

    if (selectedTemplate) {
      logger.info("🎯 TEMPLATE SELECTED: Using template instead of AI", {
        correlationId,
        template: selectedTemplate,
        description: description.substring(0, 100) + "...",
      });

      try {
        const templateHtml = await templateManager.loadTemplate(
          selectedTemplate
        );
        return {
          html: templateHtml,
          reactCode: null,
          source: "template-system",
          aiGenerated: false,
          unlimited: true,
          framework: "html",
          styling: "inline-css",
        };
      } catch (templateError) {
        logger.warn("⚠️ Template loading failed, falling back to AI", {
          correlationId,
          template: selectedTemplate,
          error: templateError.message,
        });
        // Continue to AI generation if template fails
      }
    }

    logger.info("🎯 MINIMAL GENERATION: Testing natural AI intelligence", {
      correlationId,
      description: description.substring(0, 100) + "...",
      colorScheme,
      approach: "minimal-ai-generator",
    });

    // Use Minimal Generator to test AI's natural intelligence
    const result = await minimalGenerator.generateWireframe(
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
            color: ${WIREFRAME_COLORS.primary}; 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 20px; 
        }
        .button { 
            background: ${WIREFRAME_COLORS.secondary}; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 16px;
            margin: 10px 5px;
        }
        .button:hover {
            background: ${WIREFRAME_COLORS.hover};
        }
        .card {
            background: ${WIREFRAME_COLORS.surface};
            padding: 20px;
            border-radius: 6px;
            margin: 15px 0;
            border-left: 4px solid ${WIREFRAME_COLORS.primary};
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
        <button class="button" style="background: ${WIREFRAME_COLORS.secondary};">Secondary Action</button>
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

// Image-based wireframe generator using GPT-4V analysis
async function generateWireframeFromImageAnalysis(
  imageAnalysis,
  description,
  colorScheme,
  correlationId
) {
  try {
    logger.info("📸 Starting image-based wireframe generation", {
      correlationId,
      componentsCount: imageAnalysis.components.length,
      confidence: imageAnalysis.confidence,
      layoutType: imageAnalysis.layout?.type,
    });

    // Extract components and their properties WITH EXACT COLORS
    const components = imageAnalysis.components || [];
    const layout = imageAnalysis.layout || { type: "grid", columns: 12 };
    const designTokens = imageAnalysis.designTokens || {};

    // Use EXACT colors from analysis, or neutral wireframe fallbacks
    const analyzedColors = designTokens.colors || [];
    const colors =
      analyzedColors.length > 0
        ? analyzedColors
        : ["#8E9AAF", "#FFFFFF", "#3C4858"]; // Neutral wireframe colors from your palette
    const fonts = designTokens.fonts || ["Segoe UI", "Arial", "sans-serif"];

    // Extract unique colors from component properties
    const componentColors = components.reduce((acc, comp) => {
      const props = comp.properties || {};
      if (props.backgroundColor) acc.add(props.backgroundColor);
      if (props.textColor) acc.add(props.textColor);
      if (props.borderColor) acc.add(props.borderColor);
      if (props.color) acc.add(props.color);
      return acc;
    }, new Set());

    const allColors = [...componentColors, ...colors];
    const primaryColor = allColors[0] || "#8E9AAF"; // Medium blue-gray from your palette
    const secondaryColor = allColors[1] || "#FFFFFF";
    const textColor = allColors[2] || "#3C4858"; // Dark slate text for readability

    logger.info("🎨 Using extracted colors", {
      correlationId,
      analyzedColors: analyzedColors,
      componentColors: Array.from(componentColors),
      finalColors: [primaryColor, secondaryColor, textColor],
    });

    // Build component HTML from analysis
    let htmlContent = "";
    const componentsByPosition = components.sort((a, b) => {
      const aY = a.bounds?.y || 0;
      const bY = b.bounds?.y || 0;
      if (Math.abs(aY - bY) < 5) {
        // Same row
        return (a.bounds?.x || 0) - (b.bounds?.x || 0);
      }
      return aY - bY;
    });

    // Group components by approximate rows
    const rows = [];
    let currentRow = [];
    let lastY = -1;

    componentsByPosition.forEach((component) => {
      const y = component.bounds?.y || 0;
      if (lastY === -1 || Math.abs(y - lastY) < 10) {
        // Same row
        currentRow.push(component);
      } else {
        // New row
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [component];
      }
      lastY = y;
    });
    if (currentRow.length > 0) rows.push(currentRow);

    // Generate HTML for each row
    rows.forEach((row, rowIndex) => {
      htmlContent += `    <div class="row row-${rowIndex}">\n`;

      row.forEach((component, colIndex) => {
        const componentHtml = generateComponentHtml(component, allColors);
        htmlContent += `      ${componentHtml}\n`;
      });

      htmlContent += `    </div>\n`;
    });

    // Create the complete HTML with extracted colors and layout
    const wireframeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Wireframe from Image Analysis</title>
    <link href="https://cdn.jsdelivr.net/npm/@fluentui/web-components/dist/web-components.min.js" rel="module">
    <style>
        :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
            --text-color: ${textColor};
            --accent-color: ${allColors[3] || "#107c10"};
            --background-color: ${allColors[4] || "#faf9f8"};
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts[0] || "Segoe UI"}, ${
      fonts[1] || "Arial"
    }, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            line-height: 1.5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            ${
              layout.type === "grid"
                ? `display: grid; grid-template-columns: repeat(${
                    layout.columns || 12
                  }, 1fr); gap: 20px;`
                : ""
            }
        }
        
        .row {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
            ${layout.type === "grid" ? "grid-column: 1 / -1;" : ""}
        }
        
        .component {
            position: relative;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .component:hover {
            box-shadow: 0 4px 12px rgba(0, 120, 212, 0.15);
            transform: translateY(-1px);
        }
        
        .button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .button:hover {
            background-color: #68769C;
        }
        
        .button.secondary {
            background-color: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }
        
        .input {
            padding: 8px 12px;
            border: 1px solid #d2d0ce;
            border-radius: 4px;
            font-size: 14px;
            min-width: 200px;
        }
        
        .input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 1px var(--primary-color);
        }
        
        .text {
            font-size: 14px;
            line-height: 1.4;
        }
        
        .text.heading {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .text.subheading {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 6px;
        }
        
        .card {
            background: white;
            border: 1px solid #e1dfdd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .navigation {
            display: flex;
            align-items: center;
            gap: 24px;
            padding: 16px 0;
            border-bottom: 1px solid #e1dfdd;
            margin-bottom: 20px;
        }
        
        .logo {
            font-size: 18px;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .nav-link {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .nav-link:hover {
            background-color: #f3f2f1;
        }
        
        .image-placeholder {
            background-color: #f3f2f1;
            border: 2px dashed #d2d0ce;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 120px;
            color: #8a8886;
            font-style: italic;
        }
        
        .form {
            background: white;
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #e1dfdd;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
${htmlContent}    </div>

    <script>
        console.log('📸 Wireframe generated from image analysis:', {
            componentsDetected: ${components.length},
            confidence: ${imageAnalysis.confidence || 0},
            layoutType: '${layout.type}',
            colorsUsed: ${JSON.stringify(colors)}
        });
        
        // Add basic interactivity
        document.querySelectorAll('.button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Button clicked:', e.target.textContent);
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => e.target.style.transform = '', 150);
            });
        });
        
        document.querySelectorAll('.input').forEach(input => {
            input.addEventListener('focus', (e) => {
                console.log('Input focused:', e.target.placeholder || 'input');
            });
        });
    </script>
</body>
</html>`;

    logger.info("✅ Image-based wireframe generation completed", {
      correlationId,
      htmlLength: wireframeHtml.length,
      componentsProcessed: components.length,
    });

    return {
      html: wireframeHtml,
      reactCode: null,
      source: "image-analysis-enhanced",
      aiGenerated: true,
      unlimited: true,
      framework: "html",
      styling: "inline-css",
      imageAnalysis: {
        confidence: imageAnalysis.confidence,
        componentsCount: components.length,
        layoutType: layout.type,
      },
    };
  } catch (error) {
    logger.error("❌ Image-based wireframe generation failed", error, {
      correlationId,
    });

    // Fallback to description-based generation
    logger.info("🔄 Falling back to description-based generation", {
      correlationId,
    });
    return await generateWireframeFromDescription(
      description,
      colorScheme,
      correlationId
    );
  }
}

// Helper function to generate HTML for individual components
function generateComponentHtml(component, colors) {
  const bounds = component.bounds || {};
  const text = component.text || "";
  const type = component.type || "text";
  const properties = component.properties || {};

  // Use actual colors from analysis
  const bgColor =
    properties.backgroundColor || properties.color || colors[0] || "#8E9AAF";
  const textColor = properties.textColor || "#ffffff";
  const borderColor = properties.borderColor || bgColor;
  const fontSize = properties.fontSize || "14px";
  const fontWeight = properties.fontWeight || "400";

  const componentStyle = `
    background-color: ${bgColor};
    color: ${textColor};
    border: 1px solid ${borderColor};
    font-size: ${fontSize};
    font-weight: ${fontWeight};
  `.trim();

  switch (type.toLowerCase()) {
    case "button":
      const buttonStyle = properties.style || "primary";
      const actualText = text || "Button";
      return `<button class="component button" style="${componentStyle}">${actualText}</button>`;

    case "input":
    case "textbox":
    case "text input":
      const placeholderText = text || "Enter text...";
      return `<input type="text" class="component input" style="${componentStyle}" placeholder="${placeholderText}" />`;

    case "text":
    case "label":
      const displayText = text || "Text content";
      return `<span class="component text" style="${componentStyle}">${displayText}</span>`;

    case "heading":
    case "title":
    case "h1":
    case "h2":
    case "h3":
      const headingText = text || "Heading";
      const headingWeight = properties.fontWeight || "600";
      return `<h2 class="component text heading" style="${componentStyle}; font-weight: ${headingWeight};">${headingText}</h2>`;

    case "card":
      const cardTitle = text || "Card Title";
      return `<div class="component card" style="background: ${bgColor}; border: 1px solid ${borderColor}; color: ${textColor};">
        <h3 style="color: ${textColor};">${cardTitle}</h3>
        <p style="color: ${textColor};">Card content goes here...</p>
      </div>`;

    case "navigation":
    case "nav":
      const navItems = text
        ? text.split(/[,|]/).map((item) => item.trim())
        : ["Home", "About", "Contact"];
      const navLinks = navItems
        .map(
          (item) =>
            `<a href="#" class="nav-link" style="color: ${textColor};">${item}</a>`
        )
        .join("\n        ");
      return `<nav class="component navigation" style="${componentStyle}">
        <div class="logo" style="color: ${textColor};">Logo</div>
        ${navLinks}
      </nav>`;

    case "image":
    case "img":
      const imageText = text || "[Image placeholder]";
      return `<div class="component image-placeholder" style="${componentStyle}">
        ${imageText}
      </div>`;

    case "form":
      return `<form class="component form" style="${componentStyle}">
        <div class="form-group">
          <label class="label" style="color: ${textColor};">Form field</label>
          <input type="text" class="input" placeholder="Enter value..." />
        </div>
        <button type="submit" class="button">Submit</button>
      </form>`;

    default:
      const defaultText = text || `${type} component`;
      return `<div class="component text" style="${componentStyle}">${defaultText}</div>`;
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
    const {
      description,
      colorScheme = "primary",
      imageAnalysis,
    } = req.body || {};

    if (!description) {
      context.res.status = 400;
      context.res.body = {
        success: false,
        error: "Description is required",
        correlationId,
      };
      return;
    }

    logger.info("🎯 Processing wireframe generation request", {
      correlationId,
      hasImageAnalysis: !!imageAnalysis,
      componentsDetected: imageAnalysis?.components?.length || 0,
      confidence: imageAnalysis?.confidence,
      layoutType: imageAnalysis?.layout?.type,
    });

    // Generate wireframe - prioritize image analysis if available
    let result;
    if (
      imageAnalysis &&
      imageAnalysis.components &&
      imageAnalysis.components.length > 0
    ) {
      logger.info("📸 Using image-based wireframe generation", {
        correlationId,
        componentsDetected: imageAnalysis.components.length,
        confidence: imageAnalysis.confidence,
        layoutType: imageAnalysis.layout?.type,
      });

      result = await generateWireframeFromImageAnalysis(
        imageAnalysis,
        description,
        colorScheme,
        correlationId
      );
    } else {
      logger.info("📝 Using description-based wireframe generation", {
        correlationId,
      });

      result = await generateWireframeFromDescription(
        description,
        colorScheme,
        correlationId
      );
    }

    const processingTime = Date.now() - startTime;

    // 🚨 Apply accessibility validation and fixes
    const accessibilityResult = accessibilityMiddleware.validateAndFixWireframe(
      result.html,
      { enforceCompliance: true, logIssues: true }
    );

    // Use the accessibility-validated HTML
    const finalHtml = accessibilityResult.content;

    // Log accessibility status
    if (accessibilityResult.wasFixed) {
      logger.info("🎯 Wireframe accessibility issues automatically fixed", {
        correlationId,
        issuesFound: accessibilityResult.issues.length,
        isNowValid: accessibilityResult.isValid,
      });
    } else if (accessibilityResult.isValid) {
      logger.info("✅ Wireframe passed accessibility validation", {
        correlationId,
      });
    }

    // Success response
    context.res.status = 200;
    context.res.body = {
      success: true,
      data: {
        html: finalHtml, // Use accessibility-validated HTML
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
        accessibility: {
          isCompliant: accessibilityResult.isValid,
          wasFixed: accessibilityResult.wasFixed,
          issuesFound: accessibilityResult.issues.length,
          wcagLevel: accessibilityResult.isValid ? "AA" : "Partial",
        },
      },
    };

    logger.info("✅ Minimal wireframe generation completed", {
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
