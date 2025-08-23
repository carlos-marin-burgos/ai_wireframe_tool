/**
 * Figma Node Importer - Direct Node URL Import
 * Extracts specific components from Figma URLs and generates accurate HTML/CSS
 */

const axios = require("axios");

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
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    if (!figmaToken) {
      throw new Error("Figma access token not configured");
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

    context.res.status = 200;
    context.res.body = {
      success: true,
      component: {
        id: urlInfo.nodeId,
        name: componentData.name,
        description: componentData.description || `Component from Figma`,
        category: categorizeFromFigma(componentData),
        html: htmlComponent.html,
        css: htmlComponent.css,
        figmaUrl: figmaUrl,
        fileId: urlInfo.fileId,
        nodeId: urlInfo.nodeId,
        designTokens: htmlComponent.designTokens,
      },
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

    // Get the specific node
    const nodeResponse = await axios.get(
      `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`,
      {
        headers: {
          "X-Figma-Token": token,
        },
        timeout: 10000,
      }
    );

    const nodeData = nodeResponse.data.nodes[nodeId];
    if (!nodeData || !nodeData.document) {
      throw new Error(`Node ${nodeId} not found`);
    }

    const node = nodeData.document;
    context.log(`✅ Found node: ${node.name} (${node.type})`);

    // Get component image for reference
    let imageUrl = null;
    try {
      const imageResponse = await axios.get(
        `https://api.figma.com/v1/images/${fileId}`,
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
      ...node,
      imageUrl,
      figmaFileId: fileId,
      figmaNodeId: nodeId,
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

    // Extract design properties from Figma node
    const designTokens = extractDesignTokens(componentData);

    // Generate component based on type and properties
    const htmlStructure = generateComponentStructure(
      componentData,
      designTokens
    );

    // Generate CSS from Figma properties
    const css = generateCSSFromFigma(designTokens);

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

  switch (componentType) {
    case "button":
      return generateButtonHTML(node, tokens);
    case "card":
      return generateCardHTML(node, tokens);
    case "input":
      return generateInputHTML(node, tokens);
    case "text":
      return generateTextHTML(node, tokens);
    default:
      return generateGenericHTML(node, tokens);
  }
}

/**
 * Detect component type from Figma node
 */
function detectComponentType(node, tokens) {
  const name = node.name.toLowerCase();

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

  return "generic";
}

/**
 * Generate button HTML
 */
function generateButtonHTML(node, tokens) {
  const text = extractTextContent(node) || "Button";
  const className = `figma-btn figma-btn-${node.figmaNodeId?.replace(
    ":",
    "-"
  )}`;

  return `<button class="${className}" type="button">${text}</button>`;
}

/**
 * Generate card HTML
 */
function generateCardHTML(node, tokens) {
  const className = `figma-card figma-card-${node.figmaNodeId?.replace(
    ":",
    "-"
  )}`;
  const content = generateChildrenHTML(node, tokens);

  return `<div class="${className}">
    ${content || '<div class="figma-card-content">Card Content</div>'}
  </div>`;
}

/**
 * Generate input HTML
 */
function generateInputHTML(node, tokens) {
  const className = `figma-input figma-input-${node.figmaNodeId?.replace(
    ":",
    "-"
  )}`;
  const placeholder = extractTextContent(node) || "Enter text...";

  return `<input class="${className}" type="text" placeholder="${placeholder}">`;
}

/**
 * Generate text HTML
 */
function generateTextHTML(node, tokens) {
  const text = node.characters || "Text";
  const className = `figma-text figma-text-${node.figmaNodeId?.replace(
    ":",
    "-"
  )}`;

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
 * Generate generic container HTML
 */
function generateGenericHTML(node, tokens) {
  const className = `figma-component figma-component-${node.figmaNodeId?.replace(
    ":",
    "-"
  )}`;
  const content = generateChildrenHTML(node, tokens);

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

  // Generate unique class name
  const className = `.figma-component-${tokens.name
    ?.toLowerCase()
    .replace(/\s+/g, "-")}`;

  css += `${className} {\n`;

  // Dimensions
  if (tokens.width !== "auto") {
    css += `  width: ${tokens.width}px;\n`;
  }
  if (tokens.height !== "auto") {
    css += `  height: ${tokens.height}px;\n`;
  }

  // Background
  if (tokens.fills && tokens.fills.length > 0) {
    css += `  background-color: ${tokens.fills[0].color};\n`;
  }

  // Border
  if (tokens.strokes && tokens.strokes.length > 0) {
    const stroke = tokens.strokes[0];
    css += `  border: ${stroke.weight}px solid ${stroke.color};\n`;
  }

  // Border radius
  if (tokens.cornerRadius > 0) {
    css += `  border-radius: ${tokens.cornerRadius}px;\n`;
  }

  // Padding
  if (tokens.padding && Object.keys(tokens.padding).length > 0) {
    const p = tokens.padding;
    css += `  padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px;\n`;
  }

  // Typography
  if (tokens.typography && Object.keys(tokens.typography).length > 0) {
    const t = tokens.typography;
    if (t.fontFamily) css += `  font-family: '${t.fontFamily}', sans-serif;\n`;
    if (t.fontSize) css += `  font-size: ${t.fontSize}px;\n`;
    if (t.fontWeight) css += `  font-weight: ${t.fontWeight};\n`;
    if (t.lineHeight) css += `  line-height: ${t.lineHeight};\n`;
    if (t.textAlign) css += `  text-align: ${t.textAlign};\n`;
    if (t.color) css += `  color: ${t.color};\n`;
  }

  css += "}\n\n";

  // Generate CSS for children
  if (tokens.children && tokens.children.length > 0) {
    tokens.children.forEach((childTokens) => {
      css += generateCSSFromFigma(childTokens);
    });
  }

  return css;
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
