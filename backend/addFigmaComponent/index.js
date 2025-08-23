/**
 * Add Figma Component by URL - Admin Function
 * Extracts design specifications from Figma node URLs and adds to library
 */

const axios = require("axios");

module.exports = async function (context, req) {
  try {
    context.log("🎨 Adding component from Figma URL");

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

    const { figmaUrl, componentName, category } = req.body;

    if (!figmaUrl) {
      throw new Error("Figma URL is required");
    }

    // Extract file ID and node ID from Figma URL
    const urlMatch = figmaUrl.match(
      /figma\.com\/design\/([^\/]+).*node-id=([^&]+)/
    );
    if (!urlMatch) {
      throw new Error("Invalid Figma URL format");
    }

    const fileId = urlMatch[1];
    const nodeId = urlMatch[2].replace("-", ":"); // Convert 1-2274 to 1:2274

    context.log(`📁 File ID: ${fileId}`);
    context.log(`🎯 Node ID: ${nodeId}`);

    // Get Figma credentials
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    if (!figmaToken) {
      throw new Error("Figma token not configured");
    }

    // Fetch the specific component from Figma
    const componentData = await fetchFigmaComponentByNode(
      figmaToken,
      fileId,
      nodeId,
      componentName,
      category,
      context
    );

    context.res = {
      ...context.res,
      status: 200,
      body: {
        success: true,
        component: componentData,
        message: `Component "${componentData.name}" added successfully`,
      },
    };
  } catch (error) {
    context.log.error("❌ Error adding Figma component:", error.message);

    context.res = {
      ...context.res,
      status: 500,
      body: {
        success: false,
        error: error.message,
      },
    };
  }
};

/**
 * Fetch specific component by node ID and extract design specifications
 */
async function fetchFigmaComponentByNode(
  token,
  fileId,
  nodeId,
  componentName,
  category,
  context
) {
  try {
    // Step 1: Get the specific node
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
      throw new Error(`Component node ${nodeId} not found`);
    }

    const component = nodeData.document;
    context.log(`✅ Found component: ${component.name}`);

    // Step 2: Get component image (high quality)
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
            format: "png",
            scale: 2,
          },
          timeout: 15000,
        }
      );
      imageUrl = imageResponse.data.images[nodeId];
    } catch (imageError) {
      context.log.warn(
        "⚠️ Could not fetch component image:",
        imageError.message
      );
    }

    // Step 3: Extract design specifications
    const designSpecs = extractDesignSpecifications(component);

    // Step 4: Generate accurate HTML/CSS based on design specs
    const htmlContent = generateAccurateHTML(component, designSpecs, context);

    // Step 5: Create component object
    const componentData = {
      id: `custom-${fileId}-${nodeId}`,
      name: componentName || cleanComponentName(component.name),
      description: `Custom component from Figma: ${component.name}`,
      category: category || categorizeFromName(component.name),
      library: "Custom Atlas",
      preview: imageUrl,
      variants: ["Default"],
      usageCount: 0,
      tags: generateTags(component.name, category),
      type: "component",
      lastModified: new Date().toISOString(),
      createdBy: "Design Team",
      figmaNodeId: nodeId,
      figmaFileId: fileId,
      figmaUrl: `https://www.figma.com/design/${fileId}?node-id=${nodeId.replace(
        ":",
        "-"
      )}`,
      designSpecs: designSpecs,
      content: htmlContent, // This is the accurate HTML
    };

    context.log(`🎉 Component "${componentData.name}" processed successfully`);
    return componentData;
  } catch (error) {
    context.log.error(`❌ Error fetching component ${nodeId}:`, error.message);
    throw error;
  }
}

/**
 * Extract design specifications from Figma component
 */
function extractDesignSpecifications(component) {
  const specs = {
    type: component.type,
    dimensions: {
      width: component.absoluteBoundingBox?.width || "auto",
      height: component.absoluteBoundingBox?.height || "auto",
    },
    fills: [],
    strokes: [],
    effects: [],
    typography: null,
    cornerRadius: null,
    padding: null,
  };

  // Extract fills (background colors)
  if (component.fills && component.fills.length > 0) {
    specs.fills = component.fills.map((fill) => {
      if (fill.type === "SOLID") {
        const color = fill.color;
        const opacity = fill.opacity || 1;
        return {
          type: "solid",
          color: `rgba(${Math.round(color.r * 255)}, ${Math.round(
            color.g * 255
          )}, ${Math.round(color.b * 255)}, ${opacity})`,
        };
      }
      return fill;
    });
  }

  // Extract strokes (borders)
  if (component.strokes && component.strokes.length > 0) {
    specs.strokes = component.strokes.map((stroke) => {
      if (stroke.type === "SOLID") {
        const color = stroke.color;
        const opacity = stroke.opacity || 1;
        return {
          type: "solid",
          color: `rgba(${Math.round(color.r * 255)}, ${Math.round(
            color.g * 255
          )}, ${Math.round(color.b * 255)}, ${opacity})`,
          weight: component.strokeWeight || 1,
        };
      }
      return stroke;
    });
  }

  // Extract corner radius
  if (component.cornerRadius !== undefined) {
    specs.cornerRadius = component.cornerRadius;
  }

  // Extract effects (shadows, etc.)
  if (component.effects && component.effects.length > 0) {
    specs.effects = component.effects.filter(
      (effect) => effect.visible !== false
    );
  }

  // Extract typography (for text nodes)
  if (component.type === "TEXT" && component.style) {
    specs.typography = {
      fontFamily: component.style.fontFamily,
      fontSize: component.style.fontSize,
      fontWeight: component.style.fontWeight,
      lineHeight: component.style.lineHeightPx,
      textAlign: component.style.textAlignHorizontal?.toLowerCase(),
      color: extractTextColor(component),
    };
  }

  return specs;
}

/**
 * Generate accurate HTML/CSS based on Figma design specifications
 */
function generateAccurateHTML(component, specs, context) {
  const componentType = detectComponentType(component);
  context.log(`🔧 Generating HTML for component type: ${componentType}`);

  switch (componentType) {
    case "button":
      return generateButtonHTML(component, specs);
    case "card":
      return generateCardHTML(component, specs);
    case "input":
      return generateInputHTML(component, specs);
    case "text":
      return generateTextHTML(component, specs);
    default:
      return generateGenericHTML(component, specs);
  }
}

/**
 * Detect component type from Figma data
 */
function detectComponentType(component) {
  const name = component.name.toLowerCase();

  if (name.includes("button") || name.includes("btn")) return "button";
  if (name.includes("card")) return "card";
  if (name.includes("input") || name.includes("field")) return "input";
  if (component.type === "TEXT") return "text";

  return "generic";
}

/**
 * Generate button HTML with accurate styling
 */
function generateButtonHTML(component, specs) {
  const styles = [];
  const classes = ["btn", "figma-component"];

  // Background color
  if (specs.fills.length > 0 && specs.fills[0].color) {
    styles.push(`background-color: ${specs.fills[0].color}`);
  }

  // Border
  if (specs.strokes.length > 0) {
    const stroke = specs.strokes[0];
    styles.push(`border: ${stroke.weight || 1}px solid ${stroke.color}`);
  } else {
    styles.push("border: none");
  }

  // Border radius
  if (specs.cornerRadius !== null) {
    styles.push(`border-radius: ${specs.cornerRadius}px`);
  }

  // Dimensions
  if (specs.dimensions.width !== "auto") {
    styles.push(`width: ${specs.dimensions.width}px`);
  }
  if (specs.dimensions.height !== "auto") {
    styles.push(`height: ${specs.dimensions.height}px`);
  }

  // Text content (try to extract from children)
  let buttonText = component.name;
  if (component.children) {
    const textNode = component.children.find((child) => child.type === "TEXT");
    if (textNode && textNode.characters) {
      buttonText = textNode.characters;
    }
  }

  const styleAttr = styles.length > 0 ? ` style="${styles.join("; ")}"` : "";

  return `<button class="${classes.join(" ")}" type="button"${styleAttr}>
    ${buttonText}
  </button>`;
}

/**
 * Generate card HTML with accurate styling
 */
function generateCardHTML(component, specs) {
  const styles = [];

  // Background
  if (specs.fills.length > 0 && specs.fills[0].color) {
    styles.push(`background-color: ${specs.fills[0].color}`);
  }

  // Border
  if (specs.strokes.length > 0) {
    const stroke = specs.strokes[0];
    styles.push(`border: ${stroke.weight || 1}px solid ${stroke.color}`);
  }

  // Border radius
  if (specs.cornerRadius !== null) {
    styles.push(`border-radius: ${specs.cornerRadius}px`);
  }

  // Shadows
  if (specs.effects.length > 0) {
    const shadow = specs.effects.find(
      (effect) => effect.type === "DROP_SHADOW"
    );
    if (shadow) {
      const { offset, radius, color } = shadow;
      styles.push(
        `box-shadow: ${offset?.x || 0}px ${offset?.y || 0}px ${radius || 0}px ${
          color || "rgba(0,0,0,0.1)"
        }`
      );
    }
  }

  // Padding (default for cards)
  styles.push("padding: 20px");

  const styleAttr = styles.length > 0 ? ` style="${styles.join("; ")}"` : "";

  return `<div class="card figma-component"${styleAttr}>
    <div class="card-body">
      <h5 class="card-title">${component.name}</h5>
      <p class="card-text">Card content from Figma design</p>
    </div>
  </div>`;
}

/**
 * Generate generic HTML for unknown component types
 */
function generateGenericHTML(component, specs) {
  const styles = [];

  if (specs.fills.length > 0 && specs.fills[0].color) {
    styles.push(`background-color: ${specs.fills[0].color}`);
  }

  if (specs.strokes.length > 0) {
    const stroke = specs.strokes[0];
    styles.push(`border: ${stroke.weight || 1}px solid ${stroke.color}`);
  }

  if (specs.cornerRadius !== null) {
    styles.push(`border-radius: ${specs.cornerRadius}px`);
  }

  styles.push("padding: 15px");

  const styleAttr = styles.length > 0 ? ` style="${styles.join("; ")}"` : "";

  return `<div class="figma-component"${styleAttr}>
    <h6>${component.name}</h6>
    <p>Custom component from Figma</p>
  </div>`;
}

/**
 * Helper functions
 */
function extractTextColor(component) {
  if (component.fills && component.fills.length > 0) {
    const fill = component.fills[0];
    if (fill.type === "SOLID") {
      const color = fill.color;
      const opacity = fill.opacity || 1;
      return `rgba(${Math.round(color.r * 255)}, ${Math.round(
        color.g * 255
      )}, ${Math.round(color.b * 255)}, ${opacity})`;
    }
  }
  return "#000000";
}

function cleanComponentName(name) {
  return name.replace(/[^\w\s]/g, "").trim();
}

function categorizeFromName(name) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("button")) return "Actions";
  if (nameLower.includes("card")) return "Cards";
  if (nameLower.includes("nav")) return "Navigation";
  if (nameLower.includes("input") || nameLower.includes("form")) return "Forms";
  return "Components";
}

function generateTags(name, category) {
  const tags = [name.toLowerCase()];
  if (category) tags.push(category.toLowerCase());
  tags.push("figma", "custom");
  return tags;
}
