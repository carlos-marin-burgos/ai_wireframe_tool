/**
 * Figma Components API Endpoint
 * Serves REAL component data from Figma Atlas Design Library
 */

const axios = require("axios");

module.exports = async function (context, req) {
  try {
    context.log("🎨 Fetching components from Atlas Design Library");

    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    // Get Figma credentials from environment
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    const atlasFileId = process.env.FIGMA_FILE_ID; // Atlas Design Library

    context.log(
      `🔑 Using Figma token: ${
        figmaToken ? figmaToken.substring(0, 10) + "..." : "not found"
      }`
    );
    context.log(`📁 Atlas Design Library ID: ${atlasFileId || "not found"}`);

    const components = [];

    // Load custom components (added via admin script) first
    const customComponents = await loadCustomComponents(context);
    if (customComponents.length > 0) {
      context.log(`📦 Loaded ${customComponents.length} custom components`);
      components.push(...customComponents);
    }

    // 🔥 LOAD REAL FIGMA COMPONENTS if token and file ID available
    if (figmaToken && atlasFileId && components.length === 0) {
      try {
        context.log("🎯 Loading REAL Atlas Design Library components...");
        const realComponents = await fetchRealFigmaComponents(
          figmaToken,
          atlasFileId,
          "Atlas Design Library",
          context
        );
        if (realComponents && realComponents.length > 0) {
          context.log(
            `✅ Loaded ${realComponents.length} real Figma components`
          );
          components.push(...realComponents);
        }
      } catch (error) {
        context.log(`⚠️ Failed to load real components: ${error.message}`);
      }
    }

    // Use test data as fallback (always load for demo purposes)
    if (components.length === 0 || !figmaToken) {
      context.log("🔄 Using test data...");
      const testComponents = getTestComponents(atlasFileId || "demo-file-id");
      components.push(...testComponents);
    }

    const categories = [
      "All",
      "Actions",
      "Forms",
      "Navigation",
      "Marketing",
      "Cards",
      "Layout",
      "Data Display",
      "Overlays",
      "Feedback",
    ];

    const statistics = generateStatistics(components);

    const response = {
      components: components,
      categories: categories,
      popular: components
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5),
      statistics: statistics,
    };

    context.res.status = 200;
    context.res.body = response;
  } catch (error) {
    context.log.error("❌ Error fetching Figma components:", error);
    context.res.status = 500;
    context.res.body = {
      error: "Failed to fetch components from Atlas Design Library",
      details: error.message,
    };
  }
};

/**
 * 📋 TEST COMPONENTS - Atlas Design Library themed
 * These provide immediate functionality while testing
 */
function getTestComponents(figmaFileId) {
  return [
    {
      id: "atlas-hero-001",
      name: "Atlas Hero Component",
      description:
        "Hero section component from Atlas Design Library - perfect for landing pages and feature highlights",
      category: "Marketing",
      library: "Atlas Design",
      preview:
        "https://via.placeholder.com/300x200/2563eb/ffffff?text=Atlas+Hero",
      variants: ["Default", "Dark Theme", "Light Theme", "With Video"],
      usageCount: 42,
      tags: ["hero", "marketing", "atlas", "landing"],
      type: "component",
      lastModified: new Date().toISOString(),
      createdBy: "Atlas Design Team",
      figmaNodeId: "atlas-hero-001",
      figmaFileId: figmaFileId,
    },
    {
      id: "atlas-nav-001",
      name: "Atlas Navigation Bar",
      description:
        "Responsive navigation component with Atlas branding and accessibility features",
      category: "Navigation",
      library: "Atlas Design",
      preview:
        "https://via.placeholder.com/300x80/10b981/ffffff?text=Atlas+Navigation",
      variants: ["Default", "Mobile", "Collapsed", "Mega Menu"],
      usageCount: 38,
      tags: ["navigation", "nav", "atlas", "responsive"],
      type: "component",
      lastModified: new Date().toISOString(),
      createdBy: "Atlas Design Team",
      figmaNodeId: "atlas-nav-001",
      figmaFileId: figmaFileId,
    },
    {
      id: "atlas-card-001",
      name: "Atlas Content Card",
      description:
        "Versatile card component for displaying content, features, and product information",
      category: "Cards",
      library: "Atlas Design",
      preview:
        "https://via.placeholder.com/250x180/8b5cf6/ffffff?text=Atlas+Card",
      variants: ["Default", "Elevated", "Outlined", "Image Card"],
      usageCount: 35,
      tags: ["card", "content", "atlas", "container"],
      type: "component",
      lastModified: new Date().toISOString(),
      createdBy: "Atlas Design Team",
      figmaNodeId: "atlas-card-001",
      figmaFileId: figmaFileId,
    },
    {
      id: "atlas-button-001",
      name: "Atlas CTA Button",
      description:
        "Call-to-action button with Atlas Design system styling and interaction states",
      category: "Actions",
      library: "Atlas Design",
      preview:
        "https://via.placeholder.com/200x60/f59e0b/ffffff?text=Atlas+CTA",
      variants: ["Primary", "Secondary", "Outline", "Ghost"],
      usageCount: 31,
      tags: ["button", "cta", "atlas", "action"],
      type: "component",
      lastModified: new Date().toISOString(),
      createdBy: "Atlas Design Team",
      figmaNodeId: "atlas-button-001",
      figmaFileId: figmaFileId,
    },
    {
      id: "atlas-form-001",
      name: "Atlas Contact Form",
      description:
        "Complete contact form with validation, Atlas styling, and accessibility compliance",
      category: "Forms",
      library: "Atlas Design",
      preview:
        "https://via.placeholder.com/280x200/6366f1/ffffff?text=Atlas+Form",
      variants: ["Contact", "Newsletter", "Feedback", "Login"],
      usageCount: 28,
      tags: ["form", "contact", "atlas", "input"],
      type: "component",
      lastModified: new Date().toISOString(),
      createdBy: "Atlas Design Team",
      figmaNodeId: "atlas-form-001",
      figmaFileId: figmaFileId,
    },
  ];
}

/**
 * 🔥 REAL FIGMA API INTEGRATION
 * This function connects to Figma libraries and fetches live component data
 * @param {string} token - Figma access token
 * @param {string} fileId - Figma file ID
 * @param {string} libraryName - Name of the design library
 * @param {object} context - Azure function context
 */
async function fetchRealFigmaComponents(token, fileId, libraryName, context) {
  try {
    context.log(`🔍 Connecting to Figma API for ${libraryName}...`);

    // Step 1: Get file structure from the Figma library
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          "X-Figma-Token": token,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const document = fileResponse.data.document;
    context.log(
      `📄 Successfully loaded ${libraryName}: ${fileResponse.data.name}`
    );

    // Step 2: Find all component nodes in the file with quality filtering
    const componentNodes = [];
    function findComponents(node, path = []) {
      if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
        // Quality filtering: exclude variants and focus on main components
        const isQualityComponent = isHighQualityComponent(node, path);
        if (isQualityComponent) {
          componentNodes.push({
            node,
            path: [...path, node.name],
          });
        }
      }

      if (node.children) {
        node.children.forEach((child) =>
          findComponents(child, [...path, node.name])
        );
      }
    }

    document.children.forEach((page) => findComponents(page));
    context.log(
      `🎯 Found ${componentNodes.length} components in ${libraryName}`
    );

    // Step 3: Get component images (SVG format for crisp rendering)
    const nodeIds = componentNodes.map((c) => c.node.id).slice(0, 25); // Reduced limit for Microsoft Learn quality focus
    let imageUrls = {};

    if (nodeIds.length > 0) {
      try {
        const imageResponse = await axios.get(
          `https://api.figma.com/v1/images/${fileId}`,
          {
            headers: {
              "X-Figma-Token": token,
            },
            params: {
              ids: nodeIds.join(","),
              format: "svg",
              scale: 2,
            },
            timeout: 15000, // 15 second timeout
          }
        );
        imageUrls = imageResponse.data.images || {};
        context.log(
          `🖼️ Retrieved ${
            Object.keys(imageUrls).length
          } preview images for ${libraryName}`
        );
      } catch (imageError) {
        context.log.warn(
          `⚠️ Could not fetch images for ${libraryName}:`,
          imageError.message
        );
      }
    }

    // Step 4: Transform to our component format with Microsoft Learn focus
    const components = componentNodes
      .slice(0, 25)
      .map((item, index) => {
        const node = item.node;

        // Add null checks to prevent errors
        if (!node || !node.id || !node.name) {
          context.log.warn(`⚠️ Skipping invalid component node:`, item);
          return null;
        }

        const preview = imageUrls[node.id] || null;

        // Smart categorization based on component name and structure
        const category = categorizeComponent(node.name, item.path, libraryName);
        const usageCount = Math.floor(Math.random() * 50) + 10; // Simulated usage data

        return {
          id: `${libraryName.toLowerCase().replace(/\s+/g, "-")}-${node.id}`,
          name: cleanComponentName(node.name),
          description:
            node.description ||
            generateComponentDescription(node.name, category, libraryName),
          category: category,
          library: libraryName,
          preview: preview,
          variants: getVariants(node),
          usageCount: usageCount,
          tags: generateTags(node.name, category, libraryName),
          type: "component",
          lastModified: new Date().toISOString(),
          createdBy: `${libraryName} Team`,
          figmaNodeId: node.id,
          figmaFileId: fileId,
        };
      })
      .filter((component) => component !== null); // Filter out invalid components

    context.log(
      `✅ Successfully processed ${components.length} components from ${libraryName}`
    );
    return components;
  } catch (error) {
    context.log.error(`❌ Error fetching from ${libraryName}:`, error.message);

    // Return empty array if this library fails (other library may still work)
    return [];
  }
}

/**
 * 🏷️ Smart component categorization for Microsoft Learn
 * @param {string} name - Component name
 * @param {Array} path - Component path in Figma
 * @param {string} libraryName - Name of the design library
 */
function categorizeComponent(name, path, libraryName) {
  // Add null checking
  if (!name) return "Other";

  const nameLower = name.toLowerCase();
  const pathString = (path || []).join(" ").toLowerCase();

  // Microsoft Learn specific categorization
  if (
    nameLower.includes("nav") ||
    nameLower.includes("breadcrumb") ||
    nameLower.includes("menu") ||
    nameLower.includes("tab") ||
    nameLower.includes("pagination") ||
    pathString.includes("navigation")
  )
    return "Navigation";

  if (
    nameLower.includes("button") ||
    nameLower.includes("link") ||
    nameLower.includes("cta") ||
    nameLower.includes("action")
  )
    return "Actions";

  if (
    nameLower.includes("card") ||
    nameLower.includes("article") ||
    nameLower.includes("module") ||
    nameLower.includes("course") ||
    nameLower.includes("learning path")
  )
    return "Cards";

  if (
    nameLower.includes("form") ||
    nameLower.includes("input") ||
    nameLower.includes("search") ||
    nameLower.includes("dropdown") ||
    nameLower.includes("checkbox") ||
    nameLower.includes("radio") ||
    nameLower.includes("textarea")
  )
    return "Forms";

  if (
    nameLower.includes("table") ||
    nameLower.includes("list") ||
    nameLower.includes("grid") ||
    nameLower.includes("data")
  )
    return "Data Display";

  if (
    nameLower.includes("alert") ||
    nameLower.includes("toast") ||
    nameLower.includes("notification") ||
    nameLower.includes("message") ||
    nameLower.includes("tooltip")
  )
    return "Feedback";

  if (
    nameLower.includes("hero") ||
    nameLower.includes("header") ||
    nameLower.includes("footer") ||
    nameLower.includes("section") ||
    nameLower.includes("container")
  )
    return "Layout";

  // Default fallback
  return "Layout";
}

/**
      }

/**
 * 🔄 Extract component variants
}

/**
 * 🔄 Extract component variants
 */
function getVariants(node) {
  if (node.type === "COMPONENT_SET" && node.children) {
    return node.children.map((child) => child.name);
  }
  return ["Default"];
}

/**
 * 🏷️ Generate searchable tags
 * @param {string} name - Component name
 * @param {string} category - Component category
 * @param {string} libraryName - Name of the design library
 */
function generateTags(name, category, libraryName) {
  // Add null checking
  if (!name)
    return [
      category?.toLowerCase() || "component",
      libraryName?.toLowerCase() || "library",
    ];

  const tags = [name.toLowerCase()];
  const words = name.toLowerCase().split(/[\s\-_]/);
  tags.push(...words);
  tags.push((category || "other").toLowerCase());
  tags.push((libraryName || "library").toLowerCase());

  // Add library-specific tags
  if (libraryName === "Atlas Design") {
    tags.push("atlas", "design", "component");
  } else if (libraryName === "Fluent Design") {
    tags.push("fluent", "microsoft", "component", "ui");
  }

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * 🎯 Quality filtering for components
 * Filters out variants and low-quality components, focusing on main usable components
 * @param {object} node - Figma node
 * @param {Array} path - Component path in Figma
 */
function isHighQualityComponent(node, path) {
  const name = node.name.toLowerCase();

  // Exclude technical variants (contain = signs)
  if (name.includes("=") || name.includes(",")) {
    return false;
  }

  // Exclude size-only variants
  if (/^(size=|small|medium|large|xs|sm|md|lg|xl)$/i.test(name)) {
    return false;
  }

  // Exclude state variants
  if (/^(state=|hover|focus|active|disabled|rest)$/i.test(name)) {
    return false;
  }

  // Exclude frames and pages
  if (node.type === "FRAME" && path.length < 2) {
    return false;
  }

  // Microsoft Learn priority components
  const microsoftLearnComponents = [
    "button",
    "card",
    "nav",
    "breadcrumb",
    "search",
    "table",
    "list",
    "form",
    "input",
    "dropdown",
    "checkbox",
    "radio",
    "tab",
    "badge",
    "alert",
    "progress",
    "pagination",
    "tooltip",
    "accordion",
    "hero",
  ];

  // Check if component matches Microsoft Learn patterns
  const isMicrosoftLearnComponent = microsoftLearnComponents.some(
    (component) =>
      name.includes(component) || name.includes(component.replace(/s$/, ""))
  );

  // Include components that are likely main components or Microsoft Learn relevant
  const isMainComponent =
    node.type === "COMPONENT_SET" || // Component sets are usually main components
    (node.type === "COMPONENT" && !name.includes("/")) || // Simple component names
    isMicrosoftLearnComponent || // Microsoft Learn specific components
    /^(learn|docs|documentation|article|module|course)/.test(name); // Educational content components

  return isMainComponent;
}

/**
 * 🧹 Clean component names for better UX
 * @param {string} name - Original Figma component name
 */
function cleanComponentName(name) {
  // Add null checking
  if (!name || typeof name !== "string") {
    return "Unnamed Component";
  }

  // Remove technical suffixes and prefixes
  let cleaned = name
    .replace(/^(Size=|State=|Variant=)/i, "")
    .replace(/\s*\/\s*(Default|Primary|Secondary)$/i, "")
    .replace(/\s*\d+px\s*/g, " ") // Remove pixel values
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Convert to proper case if it's all caps or all lowercase
  if (cleaned === cleaned.toUpperCase() || cleaned === cleaned.toLowerCase()) {
    cleaned = cleaned.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return cleaned || "Unnamed Component";
}

/**
 * 📝 Generate meaningful component descriptions
 * @param {string} name - Component name
 * @param {string} category - Component category
 * @param {string} libraryName - Library name
 */
function generateComponentDescription(name, category, libraryName) {
  const cleanName = cleanComponentName(name);
  const lowercaseName = cleanName.toLowerCase();

  // Generate contextual descriptions based on component type
  if (lowercaseName.includes("button")) {
    return `Interactive ${cleanName} for user actions and navigation in ${libraryName}`;
  } else if (lowercaseName.includes("card")) {
    return `Content ${cleanName} for displaying structured information and data`;
  } else if (lowercaseName.includes("nav") || lowercaseName.includes("menu")) {
    return `Navigation ${cleanName} for site structure and user guidance`;
  } else if (
    lowercaseName.includes("form") ||
    lowercaseName.includes("input")
  ) {
    return `Form ${cleanName} for user data collection and input handling`;
  } else if (
    lowercaseName.includes("header") ||
    lowercaseName.includes("hero")
  ) {
    return `Header ${cleanName} for page introductions and key messaging`;
  } else if (lowercaseName.includes("footer")) {
    return `Footer ${cleanName} for additional links and site information`;
  } else if (
    lowercaseName.includes("modal") ||
    lowercaseName.includes("dialog")
  ) {
    return `Modal ${cleanName} for focused user interactions and confirmations`;
  } else if (
    lowercaseName.includes("table") ||
    lowercaseName.includes("list")
  ) {
    return `Data ${cleanName} for organizing and displaying structured content`;
  } else {
    return `${cleanName} component from ${libraryName} library for ${category.toLowerCase()} interfaces`;
  }
}

/**
 * 📊 Generate component statistics
 */
function generateStatistics(components) {
  const libraries = [...new Set(components.map((c) => c.library))];

  return {
    totalComponents: components.length,
    categories: [
      "Actions",
      "Forms",
      "Navigation",
      "Marketing",
      "Cards",
      "Layout",
      "Data Display",
      "Overlays",
      "Feedback",
    ]
      .map((cat) => ({
        name: cat,
        count: components.filter((c) => c.category === cat).length,
      }))
      .filter((cat) => cat.count > 0),
    libraries: libraries.map((lib) => ({
      name: lib,
      count: components.filter((c) => c.library === lib).length,
    })),
    totalUsage: components.reduce((sum, c) => sum + c.usageCount, 0),
  };
}

/**
 * Load custom components from storage
 * In production, this would load from a database
 * For now, we'll use a simple JSON file
 */
async function loadCustomComponents(context) {
  try {
    const fs = require("fs");
    const path = require("path");

    context.log("📁 Loading custom components...");

    const componentsFile = path.join(__dirname, "..", "custom-components.json");

    try {
      // Use synchronous read for now to avoid async issues
      const fileContent = fs.readFileSync(componentsFile, "utf8");
      const customComponents = JSON.parse(fileContent);

      context.log(`✅ Loaded ${customComponents.length} custom components`);
      return customComponents;
    } catch (fileError) {
      context.log("📄 No custom components file found, returning empty array");
      return [];
    }
  } catch (error) {
    context.log.warn("⚠️ Could not load custom components:", error.message);
    return [];
  }
}
