/**
 * Figma Component Fetcher
 * Fetches components from Figma design files using Figma REST API
 * Creates separate libraries for Fluent and Atlas design systems
 */

// Load environment variables from .env file
require("dotenv").config();

const fs = require("fs").promises;
const path = require("path");

// Figma API Configuration
const FIGMA_ACCESS_TOKEN =
  process.env.FIGMA_ACCESS_TOKEN || "YOUR_FIGMA_TOKEN_HERE";

// Figma File IDs (extracted from your URLs)
const FIGMA_FILES = {
  fluent: {
    fileId: "GvIcCw0tWaJVDSWD4f1OIW", // Fluent 2 web
    name: "Fluent 2 Design System",
    baseUrl:
      "https://www.figma.com/design/GvIcCw0tWaJVDSWD4f1OIW/Fluent-2-web?node-id=0-1&p=f&t=0UVE7Ann6oVPNlGW-0",
  },
  atlas: {
    fileId: "PuWj05uKXhfbqrhmJLtCij", // Atlas library for designetica
    name: "Atlas Design System",
    baseUrl:
      "https://www.figma.com/design/PuWj05uKXhfbqrhmJLtCij/Atlas-library-for-designetica?node-id=2-276&t=ZZG7ksmOtnLfGef2-0",
  },
};

/**
 * Fetch Figma file data using REST API
 */
async function fetchFigmaFile(fileId) {
  const url = `https://api.figma.com/v1/files/${fileId}`;

  try {
    console.log(`📡 Fetching Figma file: ${fileId}`);

    if (FIGMA_ACCESS_TOKEN === "YOUR_FIGMA_TOKEN_HERE") {
      console.log("⚠️  Figma API token not configured, using mock data");
      return null;
    }

    const response = await fetch(url, {
      headers: {
        "X-Figma-Token": FIGMA_ACCESS_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Error fetching Figma file ${fileId}:`, error.message);
    return null;
  }
}

/**
 * Extract components from Figma file data
 */
function extractComponents(figmaData, systemType) {
  if (!figmaData) return [];

  const components = [];

  // Traverse the Figma document tree to find components
  function traverseNode(node, path = "") {
    // Check if this is a component
    if (node.type === "COMPONENT") {
      // Filter out internal variants and focus on main components
      const componentName = node.name;

      // Skip components that are clearly internal variants or states
      if (shouldIncludeComponent(componentName)) {
        const component = {
          id: `figma-${systemType}-${node.id}`,
          name: node.name,
          description:
            node.description ||
            `${node.name} component from ${FIGMA_FILES[systemType].name}`,
          category: categorizeComponent(node.name),
          figmaNodeId: node.id,
          figmaPath: path,
          source: `figma-${systemType}`,
          playbook: "Figma Design System",
          sourceUrl: `${FIGMA_FILES[systemType].baseUrl}?node-id=${node.id}`,
          htmlCode: generateMockHTML(node, systemType),
        };
        components.push(component);
      }
    }

    // Recursively traverse children
    if (node.children) {
      node.children.forEach((child, index) => {
        traverseNode(child, `${path}/${child.name || index}`);
      });
    }
  }

  // Start traversal from document root
  if (figmaData.document) {
    traverseNode(figmaData.document);
  }

  return components;
}

/**
 * Filter function to decide which components to include
 */
function shouldIncludeComponent(componentName) {
  const name = componentName.toLowerCase();

  // Skip components that are clearly internal variants
  if (name.includes("state=") && name.includes("size=")) return false;
  if (name.includes("variant=")) return false;
  if (name.includes("property=")) return false;
  if (name.match(/=.*,.*=/)) return false; // Skip components with multiple property assignments

  // Skip documentation or example components
  if (name.includes("example")) return false;
  if (name.includes("documentation")) return false;
  if (name.includes("_internal")) return false;
  if (name.includes("_temp")) return false;

  // Skip components that are just color swatches or styles
  if (name.includes("color") && name.includes("swatch")) return false;
  if (name.includes("style guide")) return false;

  // Include main component definitions
  return true;
}

/**
 * Categorize components into meaningful groups
 */
function categorizeComponent(componentName) {
  const name = componentName.toLowerCase();
  const path = componentName.toLowerCase();

  // Buttons
  if (name.includes("button") || name.includes("btn")) return "Buttons";

  // Forms & Inputs
  if (
    name.includes("input") ||
    name.includes("textfield") ||
    name.includes("textarea") ||
    name.includes("form") ||
    name.includes("checkbox") ||
    name.includes("radio") ||
    name.includes("select") ||
    name.includes("dropdown") ||
    name.includes("combobox") ||
    name.includes("slider") ||
    name.includes("switch") ||
    name.includes("toggle")
  )
    return "Forms";

  // Navigation
  if (
    name.includes("nav") ||
    name.includes("menu") ||
    name.includes("breadcrumb") ||
    name.includes("tab") ||
    name.includes("link") ||
    name.includes("sidebar") ||
    name.includes("header") ||
    name.includes("footer")
  )
    return "Navigation";

  // Content & Display
  if (
    name.includes("card") ||
    name.includes("tile") ||
    name.includes("panel") ||
    name.includes("persona") ||
    name.includes("avatar") ||
    name.includes("image") ||
    name.includes("badge") ||
    name.includes("chip") ||
    name.includes("tag")
  )
    return "Content";

  // Data Display
  if (
    name.includes("table") ||
    name.includes("list") ||
    name.includes("grid") ||
    name.includes("tree") ||
    name.includes("pivot") ||
    name.includes("calendar") ||
    name.includes("date") ||
    name.includes("chart")
  )
    return "Data Display";

  // Overlays & Dialogs
  if (
    name.includes("dialog") ||
    name.includes("modal") ||
    name.includes("popup") ||
    name.includes("flyout") ||
    name.includes("callout") ||
    name.includes("panel") ||
    name.includes("drawer")
  )
    return "Overlays";

  // Feedback
  if (
    name.includes("tooltip") ||
    name.includes("popover") ||
    name.includes("message") ||
    name.includes("notification") ||
    name.includes("alert") ||
    name.includes("banner") ||
    name.includes("progress") ||
    name.includes("spinner") ||
    name.includes("loading")
  )
    return "Feedback";

  // Icons
  if (name.includes("icon") || name.includes("symbol")) return "Icons";

  // Layout
  if (
    name.includes("stack") ||
    name.includes("group") ||
    name.includes("container") ||
    name.includes("divider") ||
    name.includes("separator") ||
    name.includes("spacer")
  )
    return "Layout";

  return "Components";
}

/**
 * Generate mock HTML for component preview
 */
function generateMockHTML(node, systemType) {
  const componentName = node.name;
  const isFluentStyle = systemType === "fluent";

  // Basic component templates based on name patterns
  if (componentName.toLowerCase().includes("button")) {
    return generateButtonHTML(componentName, isFluentStyle);
  } else if (componentName.toLowerCase().includes("card")) {
    return generateCardHTML(componentName, isFluentStyle);
  } else if (componentName.toLowerCase().includes("nav")) {
    return generateNavHTML(componentName, isFluentStyle);
  } else {
    return generateGenericHTML(componentName, isFluentStyle);
  }
}

function generateButtonHTML(name, isFluentStyle) {
  const theme = isFluentStyle
    ? {
        primary: "#0078d4",
        background: "#ffffff",
        text: "#323130",
        border: "#8a8886",
      }
    : {
        primary: "#0078d4",
        background: "#ffffff",
        text: "#323130",
        border: "#e1e5e9",
      };

  return `
    <div style="padding: 16px; background: ${
      theme.background
    }; border-radius: 8px; font-family: 'Segoe UI', sans-serif;">
      <h4 style="margin: 0 0 12px 0; color: ${
        theme.text
      }; font-size: 14px;">${name}</h4>
      <button style="
        background: ${theme.primary}; 
        color: white; 
        border: none; 
        padding: 8px 16px; 
        border-radius: 4px; 
        cursor: pointer; 
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s;
      " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
        ${name.replace(/button/i, "").trim() || "Button"}
      </button>
      <p style="margin: 8px 0 0 0; font-size: 11px; color: #605e5c;">From Figma ${
        isFluentStyle ? "Fluent" : "Atlas"
      } Library</p>
    </div>`;
}

function generateCardHTML(name, isFluentStyle) {
  const theme = isFluentStyle ? "#f3f2f1" : "#faf9f8";

  return `
    <div style="
      background: white; 
      border: 1px solid #e1e5e9; 
      border-radius: 8px; 
      padding: 16px; 
      font-family: 'Segoe UI', sans-serif;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      <h4 style="margin: 0 0 8px 0; color: #323130; font-size: 16px;">${name}</h4>
      <p style="margin: 0 0 12px 0; color: #605e5c; font-size: 14px;">Sample content for ${name} component</p>
      <div style="background: ${theme}; padding: 8px; border-radius: 4px; font-size: 11px; color: #605e5c;">
        From Figma ${isFluentStyle ? "Fluent" : "Atlas"} Library
      </div>
    </div>`;
}

function generateNavHTML(name, isFluentStyle) {
  return `
    <nav style="
      background: white; 
      border: 1px solid #e1e5e9; 
      border-radius: 8px; 
      padding: 12px; 
      font-family: 'Segoe UI', sans-serif;
    ">
      <div style="font-weight: 600; color: #323130; margin-bottom: 8px; font-size: 14px;">${name}</div>
      <div style="display: flex; gap: 16px;">
        <a href="#" style="color: #0078d4; text-decoration: none; font-size: 14px;">Home</a>
        <a href="#" style="color: #605e5c; text-decoration: none; font-size: 14px;">About</a>
        <a href="#" style="color: #605e5c; text-decoration: none; font-size: 14px;">Contact</a>
      </div>
      <div style="margin-top: 8px; font-size: 11px; color: #605e5c;">
        From Figma ${isFluentStyle ? "Fluent" : "Atlas"} Library
      </div>
    </nav>`;
}

function generateGenericHTML(name, isFluentStyle) {
  return `
    <div style="
      background: white; 
      border: 1px solid #e1e5e9; 
      border-radius: 8px; 
      padding: 16px; 
      font-family: 'Segoe UI', sans-serif;
      text-align: center;
    ">
      <div style="
        width: 48px; 
        height: 48px; 
        background: #0078d4; 
        border-radius: 8px; 
        margin: 0 auto 12px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        color: white;
        font-weight: bold;
      ">
        {name.charAt(0).toUpperCase()}
      </div>
      <div style="font-weight: 600; color: #323130; margin-bottom: 4px; font-size: 14px;">${name}</div>
      <div style="font-size: 11px; color: #605e5c;">From Figma ${
        isFluentStyle ? "Fluent" : "Atlas"
      } Library</div>
    </div>`;
}

/**
 * Generate fallback components when API is not available
 */
function generateFallbackComponents(systemType) {
  const isFluentStyle = systemType === "fluent";
  const systemName = isFluentStyle ? "Fluent" : "Atlas";

  return [
    {
      id: `figma-${systemType}-button-primary`,
      name: `${systemName} Primary Button`,
      description: `Primary button component from ${systemName} Figma library`,
      category: "Buttons",
      source: `figma-${systemType}`,
      playbook: "Figma Design System",
      sourceUrl: FIGMA_FILES[systemType].baseUrl,
      htmlCode: generateButtonHTML(
        `${systemName} Primary Button`,
        isFluentStyle
      ),
    },
    {
      id: `figma-${systemType}-card-basic`,
      name: `${systemName} Card`,
      description: `Card component from ${systemName} Figma library`,
      category: "Content",
      source: `figma-${systemType}`,
      playbook: "Figma Design System",
      sourceUrl: FIGMA_FILES[systemType].baseUrl,
      htmlCode: generateCardHTML(`${systemName} Card`, isFluentStyle),
    },
    {
      id: `figma-${systemType}-navigation`,
      name: `${systemName} Navigation`,
      description: `Navigation component from ${systemName} Figma library`,
      category: "Navigation",
      source: `figma-${systemType}`,
      playbook: "Figma Design System",
      sourceUrl: FIGMA_FILES[systemType].baseUrl,
      htmlCode: generateNavHTML(`${systemName} Navigation`, isFluentStyle),
    },
  ];
}

/**
 * Main generation function
 */
async function generateFigmaLibraries() {
  console.log("🚀 Generating Figma Component Libraries...");
  console.log(
    `🔑 Using Figma API Token: ${
      FIGMA_ACCESS_TOKEN !== "YOUR_FIGMA_TOKEN_HERE"
        ? "✅ Configured"
        : "❌ Not configured"
    }`
  );

  const libraries = {};

  // Fetch components for each design system
  for (const [systemType, config] of Object.entries(FIGMA_FILES)) {
    console.log(`\n📋 Processing ${config.name}...`);

    const figmaData = await fetchFigmaFile(config.fileId);
    let components;

    if (figmaData) {
      components = extractComponents(figmaData, systemType);
      console.log(
        `✅ Extracted ${components.length} components from Figma API`
      );
    } else {
      components = generateFallbackComponents(systemType);
      console.log(
        `⚠️  Using ${components.length} fallback components (API not available)`
      );
    }

    libraries[systemType] = {
      version: "1.0.0",
      name: config.name,
      description: `Component library from ${config.name} Figma file`,
      lastUpdated: new Date().toISOString(),
      sourceUrl: config.baseUrl,
      figmaFileId: config.fileId,
      apiEnabled: !!figmaData,
      categories: [...new Set(components.map((c) => c.category))],
      components: components,
      totalComponents: components.length,
    };
  }

  // Save separate library files
  const outputDir = path.join(__dirname, "../public");

  try {
    // Save Fluent Figma library
    const fluentPath = path.join(outputDir, "figma-fluent-library.json");
    await fs.writeFile(fluentPath, JSON.stringify(libraries.fluent, null, 2));
    console.log(`\n✅ Fluent Figma library saved: ${fluentPath}`);

    // Save Atlas Figma library
    const atlasPath = path.join(outputDir, "figma-atlas-library.json");
    await fs.writeFile(atlasPath, JSON.stringify(libraries.atlas, null, 2));
    console.log(`✅ Atlas Figma library saved: ${atlasPath}`);

    // Save combined library for compatibility
    const combinedLibrary = {
      version: "1.0.0",
      name: "Figma Design Systems",
      description: "Combined Fluent and Atlas components from Figma",
      lastUpdated: new Date().toISOString(),
      libraries: libraries,
      totalComponents:
        libraries.fluent.totalComponents + libraries.atlas.totalComponents,
    };

    const combinedPath = path.join(outputDir, "figma-library.json");
    await fs.writeFile(combinedPath, JSON.stringify(combinedLibrary, null, 2));
    console.log(`✅ Combined Figma library saved: ${combinedPath}`);

    // Summary
    console.log("\n📊 Summary:");
    console.log(`   Fluent Components: ${libraries.fluent.totalComponents}`);
    console.log(`   Atlas Components: ${libraries.atlas.totalComponents}`);
    console.log(`   Total Components: ${combinedLibrary.totalComponents}`);
    console.log(
      `   API Status: ${
        libraries.fluent.apiEnabled ? "✅ Connected" : "❌ Using fallbacks"
      }`
    );
  } catch (error) {
    console.error("❌ Error saving libraries:", error);
  }
}

// Configuration instructions
function printSetupInstructions() {
  console.log("\n🛠️  SETUP INSTRUCTIONS:");
  console.log("1. Get your Figma Personal Access Token:");
  console.log("   - Go to https://www.figma.com/developers/api#access-tokens");
  console.log("   - Generate a new token");
  console.log("2. Set the token as environment variable:");
  console.log("   export FIGMA_ACCESS_TOKEN=your_token_here");
  console.log("3. Or create a .env file with:");
  console.log("   FIGMA_ACCESS_TOKEN=your_token_here");
  console.log(
    "4. Run the script again: node scripts/fetch-figma-components.cjs\n"
  );
}

// Run the generator
if (require.main === module) {
  generateFigmaLibraries()
    .then(() => {
      if (FIGMA_ACCESS_TOKEN === "YOUR_FIGMA_TOKEN_HERE") {
        printSetupInstructions();
      }
    })
    .catch(console.error);
}

module.exports = { generateFigmaLibraries };
