/**
 * Figma Node Importer - Direct Node URL Import
 * Extracts specific components from Figma URLs and generates accurate HTML/CSS
 */

const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

// Import OAuth token management
const { loadTokens } = require("../figmaOAuthStatus/index");

module.exports = async function (context, req) {
  try {
    context.log("🎯 Figma Node Importer - Direct URL Processing");

    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = { error: "Method not allowed" };
      return;
    }

    const { figmaUrl } = req.body;

    if (!figmaUrl) {
      context.res.status = 400;
      context.res.body = { error: "Figma URL is required" };
      return;
    }

    context.log(`🏢 Processing Microsoft Figma URL: ${figmaUrl}`);

    // Extract file ID and node ID from Figma URL
    const urlInfo = extractFigmaUrlInfo(figmaUrl);
    if (!urlInfo) {
      context.res.status = 400;
      context.res.body = { error: "Invalid Figma URL format" };
      return;
    }

    context.log(`📁 File ID: ${urlInfo.fileId}`);
    context.log(`🎯 Node ID: ${urlInfo.nodeId}`);

    // Get Figma credentials
    // Get OAuth token (prioritize OAuth over personal access token)
    let figmaToken = null;
    const oauthTokens = loadTokens();

    if (oauthTokens && oauthTokens.access_token) {
      figmaToken = oauthTokens.access_token;
      context.log("🔐 Using OAuth token for Microsoft Figma access");
    } else {
      figmaToken = process.env.FIGMA_ACCESS_TOKEN;
      context.log("🔐 Using personal access token as fallback");
    }

    if (!figmaToken) {
      throw new Error(
        "No Figma access token available - please complete OAuth setup"
      );
    }

    // Fetch the specific node data
    const componentData = await fetchFigmaNode(
      figmaToken,
      urlInfo.fileId,
      urlInfo.nodeId,
      context
    );

    // Generate accurate HTML/CSS from Figma data
    const htmlComponent = await generateAccurateHTML(componentData, context);

    // Create component data structure
    const componentDataToStore = {
      id: `atlas-design-${urlInfo.nodeId}`,
      name: componentData.name,
      description: componentData.description || `Component from Figma`,
      category: categorizeFromFigma(componentData),
      library: "Atlas Design",
      htmlCode: htmlComponent.html,
      css: htmlComponent.css,
      type: "component",
      lastModified: new Date().toISOString(),
      createdBy: "Figma Import",
      figmaUrl: figmaUrl,
      figmaFileId: urlInfo.fileId,
      figmaNodeId: urlInfo.nodeId,
      designTokens: htmlComponent.designTokens,
    };

    // Store component persistently
    await storeComponent(componentDataToStore, context);

    context.res.status = 200;
    context.res.body = {
      success: true,
      component: componentDataToStore,
    };
  } catch (error) {
    context.log.error("❌ Figma Node Import Error:", error.message);
    context.res.status = 500;
    context.res.body = {
      error: "Failed to import Figma component",
      details: error.message,
    };
  }
};

/**
 * Extract file ID and node ID from Figma URL
 */
function extractFigmaUrlInfo(url) {
  try {
    // Handle different Figma URL formats
    const patterns = [
      // Standard design URL: https://www.figma.com/design/FILE_ID/TITLE?node-id=NODE_ID
      /figma\.com\/design\/([^\/]+)\/[^?]*\?.*node-id=([^&]+)/,
      // File URL: https://www.figma.com/file/FILE_ID/TITLE?node-id=NODE_ID
      /figma\.com\/file\/([^\/]+)\/[^?]*\?.*node-id=([^&]+)/,
      // Proto URL: https://www.figma.com/proto/FILE_ID/TITLE?node-id=NODE_ID
      /figma\.com\/proto\/([^\/]+)\/[^?]*\?.*node-id=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          fileId: match[1],
          nodeId: match[2].replace(/-/g, ":"), // Convert 1-2274 to 1:2274
        };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch specific node data from Figma API
 */
async function fetchFigmaNode(token, fileId, nodeId, context) {
  try {
    context.log(`🔍 Fetching node ${nodeId} from file ${fileId}`);

    // Determine API base URL - Microsoft private Figma vs public Figma
    const figmaApiBase =
      process.env.FIGMA_API_BASE || "https://api.figma.com/v1";
    context.log(`🌐 Using Figma API: ${figmaApiBase}`);

    // Use components endpoint which works with Microsoft Figma
    context.log(`� Fetching components to locate node ${nodeId}`);
    const componentsResponse = await axios.get(
      `${figmaApiBase}/files/${fileId}/components`,
      {
        headers: {
          "X-Figma-Token": token,
        },
        timeout: 15000,
      }
    );

    // Find the specific component by node ID
    const components = componentsResponse.data.meta.components || {};
    let targetComponent = null;

    for (const [componentId, componentData] of Object.entries(components)) {
      if (componentData.node_id === nodeId) {
        targetComponent = {
          id: componentId,
          node_id: componentData.node_id,
          name: componentData.name,
          description: componentData.description || "",
          type: "COMPONENT",
          // Add basic properties that the rest of the code expects
          fills: [],
          effects: [],
          constraints: { horizontal: "LEFT", vertical: "TOP" },
          absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
        };
        break;
      }
    }

    if (!targetComponent) {
      throw new Error(
        `Component with node ID ${nodeId} not found in components list`
      );
    }

    context.log(`✅ Found component: ${targetComponent.name}`);

    // Get component image for reference
    let imageUrl = null;
    try {
      const imageResponse = await axios.get(
        `${figmaApiBase}/images/${fileId}`,
        {
          headers: {
            "X-Figma-Token": token,
          },
          params: {
            ids: nodeId,
            format: "svg",
            scale: 2,
          },
          timeout: 10000,
        }
      );
      imageUrl = imageResponse.data.images[nodeId];
    } catch (imageError) {
      context.log.warn("⚠️ Could not fetch component image");
    }

    return {
      ...targetComponent,
      imageUrl,
      figmaFileId: fileId,
      figmaNodeId: nodeId,
      id: nodeId, // Add id property for easier access
    };
  } catch (error) {
    throw new Error(`Failed to fetch Figma node: ${error.message}`);
  }
}

/**
 * Generate accurate HTML/CSS from Figma component data
 */
async function generateAccurateHTML(componentData, context) {
  try {
    context.log(`🎨 Generating HTML for: ${componentData.name}`);

    // Ensure the root component has a proper node ID
    componentData.figmaNodeId = componentData.figmaNodeId || componentData.id;

    // Extract design properties from Figma node
    const designTokens = extractDesignTokens(componentData);
    designTokens.figmaNodeId = componentData.figmaNodeId;

    // Generate component based on type and properties
    const htmlStructure = generateComponentStructure(
      componentData,
      designTokens
    );

    // Generate CSS from Figma properties
    const componentCSS = generateCSSFromFigma(designTokens);
    const commonCSS = addCommonCSS();
    const css = componentCSS + commonCSS;

    return {
      html: htmlStructure,
      css: css,
      designTokens: designTokens,
    };
  } catch (error) {
    context.log.error("❌ HTML generation failed:", error.message);
    throw error;
  }
}

/**
 * Extract design tokens from Figma component
 */
function extractDesignTokens(node) {
  const tokens = {
    name: node.name,
    type: node.type,
    width: node.absoluteBoundingBox?.width || "auto",
    height: node.absoluteBoundingBox?.height || "auto",
    fills: [],
    strokes: [],
    cornerRadius: 0,
    padding: {},
    typography: {},
    children: [],
  };

  // Extract fills (background colors)
  if (node.fills && node.fills.length > 0) {
    tokens.fills = node.fills.map((fill) => {
      if (fill.type === "SOLID") {
        const color = fill.color;
        return {
          type: "solid",
          color: `rgba(${Math.round(color.r * 255)}, ${Math.round(
            color.g * 255
          )}, ${Math.round(color.b * 255)}, ${fill.opacity || 1})`,
          opacity: fill.opacity || 1,
        };
      }
      return fill;
    });
  }

  // Extract strokes (borders)
  if (node.strokes && node.strokes.length > 0) {
    tokens.strokes = node.strokes.map((stroke) => {
      if (stroke.type === "SOLID") {
        const color = stroke.color;
        return {
          type: "solid",
          color: `rgba(${Math.round(color.r * 255)}, ${Math.round(
            color.g * 255
          )}, ${Math.round(color.b * 255)}, ${stroke.opacity || 1})`,
          weight: node.strokeWeight || 1,
        };
      }
      return stroke;
    });
  }

  // Extract corner radius
  if (node.cornerRadius !== undefined) {
    tokens.cornerRadius = node.cornerRadius;
  }

  // Extract typography for text nodes
  if (node.type === "TEXT" && node.style) {
    tokens.typography = {
      fontFamily: node.style.fontFamily || "inherit",
      fontSize: node.style.fontSize || 16,
      fontWeight: node.style.fontWeight || 400,
      lineHeight: node.style.lineHeightPercent
        ? `${node.style.lineHeightPercent}%`
        : "normal",
      textAlign: node.style.textAlignHorizontal?.toLowerCase() || "left",
      color: tokens.fills[0]?.color || "#000000",
    };
  }

  // Extract padding from layout properties
  if (node.paddingLeft !== undefined) {
    tokens.padding = {
      top: node.paddingTop || 0,
      right: node.paddingRight || 0,
      bottom: node.paddingBottom || 0,
      left: node.paddingLeft || 0,
    };
  }

  // Process children recursively
  if (node.children && node.children.length > 0) {
    tokens.children = node.children.map((child) => extractDesignTokens(child));
  }

  return tokens;
}

/**
 * Generate component HTML structure
 */
function generateComponentStructure(node, tokens) {
  const componentType = detectComponentType(node, tokens);

  // Add node ID to all child nodes for proper CSS class generation
  if (node.figmaNodeId && node.children) {
    node.children.forEach((child, index) => {
      child.figmaNodeId = `${node.figmaNodeId}-${index}`;
    });
  }

  switch (componentType) {
    case "button":
      return generateButtonHTML(node, tokens);
    case "card":
      return generateCardHTML(node, tokens);
    case "input":
      return generateInputHTML(node, tokens);
    case "text":
      return generateTextHTML(node, tokens);
    case "hero":
      return generateHeroHTML(node, tokens);
    case "image":
      return generateImageHTML(node, tokens);
    default:
      return generateGenericHTML(node, tokens);
  }
}

/**
 * Detect component type from Figma node
 */
function detectComponentType(node, tokens) {
  const name = node.name.toLowerCase();

  if (name.includes("hero")) {
    return "hero";
  }

  if (name.includes("button") || name.includes("btn")) {
    return "button";
  }

  if (name.includes("card") || name.includes("tile")) {
    return "card";
  }

  if (
    name.includes("input") ||
    name.includes("field") ||
    name.includes("textbox")
  ) {
    return "input";
  }

  if (node.type === "TEXT") {
    return "text";
  }

  // Detect images and visual elements
  if (
    name.includes("image") ||
    name.includes("icon") ||
    name.includes("logo") ||
    name.includes("keyart") ||
    name.includes("vector") ||
    node.type === "VECTOR"
  ) {
    return "image";
  }

  return "generic";
}

/**
 * Generate button HTML
 */
function generateButtonHTML(node, tokens) {
  const text = extractTextContent(node) || "Button";
  const nodeId = node.figmaNodeId || node.id || "unknown";
  const className = `figma-btn figma-btn-${nodeId.replace(":", "-")}`;

  return `<button class="${className}" type="button">${text}</button>`;
}

/**
 * Generate card HTML
 */
function generateCardHTML(node, tokens) {
  const nodeId = node.figmaNodeId || node.id || "unknown";
  const className = `figma-card figma-card-${nodeId.replace(":", "-")}`;
  const content = generateChildrenHTML(node, tokens);

  return `<div class="${className}">
    ${content || '<div class="figma-card-content">Card Content</div>'}
  </div>`;
}

/**
 * Generate input HTML
 */
function generateInputHTML(node, tokens) {
  const nodeId = node.figmaNodeId || node.id || "unknown";
  const className = `figma-input figma-input-${nodeId.replace(":", "-")}`;
  const placeholder = extractTextContent(node) || "Enter text...";

  return `<input class="${className}" type="text" placeholder="${placeholder}">`;
}

/**
 * Generate text HTML
 */
function generateTextHTML(node, tokens) {
  const text = node.characters || "Text";
  const nodeId = node.figmaNodeId || node.id || "unknown";
  const className = `figma-text figma-text-${nodeId.replace(":", "-")}`;

  // Choose appropriate tag based on text size/weight
  const fontSize = tokens.typography.fontSize || 16;
  const fontWeight = tokens.typography.fontWeight || 400;

  if (fontSize > 24 || fontWeight > 600) {
    return `<h3 class="${className}">${text}</h3>`;
  } else if (fontSize > 18) {
    return `<h4 class="${className}">${text}</h4>`;
  } else {
    return `<p class="${className}">${text}</p>`;
  }
}

/**
 * Generate hero component HTML
 */
function generateHeroHTML(node, tokens) {
  const nodeId = node.figmaNodeId || node.id || "unknown";
  const className = `figma-hero figma-hero-${nodeId.replace(":", "-")}`;

  // Extract hero content
  let heroContent = "";
  let heroImage = "";

  if (node.children) {
    node.children.forEach((child, index) => {
      const childTokens = tokens.children[index] || extractDesignTokens(child);
      child.figmaNodeId = `${nodeId}-${index}`;

      const childName = child.name.toLowerCase();
      if (
        childName.includes("image") ||
        childName.includes("keyart") ||
        childName.includes("abstract")
      ) {
        heroImage = generateImageHTML(child, childTokens);
      } else {
        heroContent += generateComponentStructure(child, childTokens);
      }
    });
  }

  return `<section class="${className}">
    <div class="figma-hero-content">
      ${heroContent}
    </div>
    <div class="figma-hero-image">
      ${heroImage}
    </div>
  </section>`;
}

/**
 * Generate image HTML
 */
function generateImageHTML(node, tokens) {
  const nodeId = node.figmaNodeId || node.id || "unknown";
  const className = `figma-image figma-image-${nodeId.replace(":", "-")}`;
  const alt = node.name || "Image";

  // For now, use a placeholder div styled to match Figma dimensions
  // In a real implementation, you'd fetch the actual image from Figma
  return `<div class="${className}" role="img" aria-label="${alt}">
    <span class="figma-image-placeholder">${alt}</span>
  </div>`;
}

/**
 * Generate generic container HTML
 */
function generateGenericHTML(node, tokens) {
  const nodeId = node.figmaNodeId || node.id || "unknown";
  const className = `figma-component figma-component-${nodeId.replace(
    ":",
    "-"
  )}`;
  const content = generateChildrenHTML(node, tokens);

  // Choose appropriate semantic HTML based on node type and name
  const name = node.name.toLowerCase();

  if (
    name.includes("section") ||
    name.includes("container") ||
    node.type === "FRAME"
  ) {
    return `<div class="${className}">
      ${content || `<div class="figma-content">${node.name}</div>`}
    </div>`;
  }

  if (name.includes("nav") || name.includes("menu")) {
    return `<nav class="${className}">
      ${content || `<div class="figma-content">${node.name}</div>`}
    </nav>`;
  }

  if (name.includes("header")) {
    return `<header class="${className}">
      ${content || `<div class="figma-content">${node.name}</div>`}
    </header>`;
  }

  if (name.includes("footer")) {
    return `<footer class="${className}">
      ${content || `<div class="figma-content">${node.name}</div>`}
    </footer>`;
  }

  return `<div class="${className}">
    ${content || `<div class="figma-content">${node.name}</div>`}
  </div>`;
}

/**
 * Generate HTML for children nodes
 */
function generateChildrenHTML(node, tokens) {
  if (!node.children || node.children.length === 0) {
    return "";
  }

  return node.children
    .map((child, index) => {
      const childTokens = tokens.children[index] || extractDesignTokens(child);
      // Ensure child has proper node ID
      const parentNodeId = node.figmaNodeId || node.id || "unknown";
      child.figmaNodeId = child.figmaNodeId || `${parentNodeId}-${index}`;
      return generateComponentStructure(child, childTokens);
    })
    .join("\n");
}

/**
 * Extract text content from node and children
 */
function extractTextContent(node) {
  if (node.type === "TEXT" && node.characters) {
    return node.characters;
  }

  if (node.children) {
    for (const child of node.children) {
      const text = extractTextContent(child);
      if (text) return text;
    }
  }

  return null;
}

/**
 * Generate CSS from Figma design tokens
 */
function generateCSSFromFigma(tokens) {
  let css = "";

  // Generate unique class name with better sanitization
  const safeNodeId = (
    tokens.figmaNodeId ||
    tokens.id ||
    tokens.name ||
    "unknown"
  )
    .toLowerCase()
    .replace(/[\s:]/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const className = `.figma-component-${safeNodeId}`;

  css += `${className} {\n`;

  // Dimensions with proper units
  if (tokens.width && tokens.width !== "auto") {
    css += `  width: ${tokens.width}px;\n`;
  }
  if (tokens.height && tokens.height !== "auto") {
    css += `  height: ${tokens.height}px;\n`;
  }

  // Background with fallback check
  if (
    tokens.fills &&
    tokens.fills.length > 0 &&
    tokens.fills[0].color &&
    tokens.fills[0].color !== "undefined"
  ) {
    css += `  background-color: ${tokens.fills[0].color};\n`;
  }

  // Border with proper syntax
  if (tokens.strokes && tokens.strokes.length > 0) {
    const stroke = tokens.strokes[0];
    if (stroke.color && stroke.color !== "undefined") {
      css += `  border: ${stroke.weight || 1}px solid ${stroke.color};\n`;
    }
  }

  // Border radius
  if (tokens.cornerRadius && tokens.cornerRadius > 0) {
    css += `  border-radius: ${tokens.cornerRadius}px;\n`;
  }

  // Padding with proper fallbacks
  if (tokens.padding && Object.keys(tokens.padding).length > 0) {
    const p = tokens.padding;
    css += `  padding: ${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${
      p.left || 0
    }px;\n`;
  }

  // Typography with proper fallbacks
  if (tokens.typography && Object.keys(tokens.typography).length > 0) {
    const t = tokens.typography;
    if (t.fontFamily) css += `  font-family: '${t.fontFamily}', sans-serif;\n`;
    if (t.fontSize) css += `  font-size: ${t.fontSize}px;\n`;
    if (t.fontWeight) css += `  font-weight: ${t.fontWeight};\n`;
    if (t.lineHeight) css += `  line-height: ${t.lineHeight};\n`;
    if (t.textAlign) css += `  text-align: ${t.textAlign};\n`;
    if (t.color && t.color !== "undefined") css += `  color: ${t.color};\n`;
  }

  // Layout properties for better structure
  css += `  display: flex;\n`;
  css += `  flex-direction: column;\n`;
  css += `  position: relative;\n`;

  css += "}\n\n";

  // Generate CSS for children
  if (tokens.children && tokens.children.length > 0) {
    tokens.children.forEach((childTokens, index) => {
      // Ensure child tokens have proper ID
      childTokens.figmaNodeId =
        childTokens.figmaNodeId ||
        `${tokens.figmaNodeId || tokens.name || "unknown"}-${index}`;
      css += generateCSSFromFigma(childTokens);
    });
  }

  return css;
}

// Add common component CSS at the end of the generation
function addCommonCSS() {
  return `
/* Common Figma Component Styles */
.figma-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  min-height: 100px;
  background-size: cover;
  background-position: center;
}

.figma-image-placeholder {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.figma-hero {
  display: flex;
  align-items: stretch;
  min-height: 300px;
  overflow: hidden;
}

.figma-hero-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.figma-hero-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.figma-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.figma-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.figma-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.figma-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.figma-text {
  margin: 0;
  line-height: 1.4;
}

.figma-component {
  box-sizing: border-box;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .figma-hero {
    flex-direction: column;
  }
  
  .figma-hero-content {
    padding: 1rem;
  }
}
`;
}

/**
 * Categorize component from Figma data
 */
function categorizeFromFigma(componentData) {
  const name = componentData.name.toLowerCase();

  if (name.includes("button") || name.includes("btn")) return "Actions";
  if (name.includes("card") || name.includes("tile")) return "Cards";
  if (name.includes("nav") || name.includes("menu")) return "Navigation";
  if (name.includes("input") || name.includes("form")) return "Forms";
  if (name.includes("text") || name.includes("heading")) return "Typography";
  if (name.includes("icon") || name.includes("image")) return "Media";

  return "Layout";
}

/**
 * Store component in persistent storage
 */
async function storeComponent(componentData, context) {
  try {
    const componentsFile = path.join(__dirname, "..", "custom-components.json");

    // Load existing components
    let existingComponents = [];
    try {
      const fileContent = await fs.readFile(componentsFile, "utf8");
      existingComponents = JSON.parse(fileContent);
    } catch (error) {
      context.log("📁 Creating new components file");
      existingComponents = [];
    }

    // Remove existing component with same ID
    existingComponents = existingComponents.filter(
      (comp) => comp.id !== componentData.id
    );

    // Add new component
    existingComponents.push(componentData);

    // Save back to file
    await fs.writeFile(
      componentsFile,
      JSON.stringify(existingComponents, null, 2)
    );

    context.log(
      `💾 Stored component: ${componentData.name} (${componentData.id})`
    );
  } catch (error) {
    context.log.error("❌ Failed to store component:", error.message);
  }
}
