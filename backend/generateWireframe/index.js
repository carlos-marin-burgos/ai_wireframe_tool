const { OpenAI } = require("openai");
const EnhancedWireframeGenerator = require("../utils/enhancedWireframeGenerator");

// Atlas Top Navigation Component (Node ID: 11530:113245)
function generateAtlasTopNavigation() {
  return `
  <!-- Atlas Top Navigation - Always Present (Node ID: 11530:113245) -->
  <header class="atlas-top-navigation" data-node-id="11530:113245" style="
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 24px;
    gap: 21px;
    width: 100%;
    height: 54px;
    box-sizing: border-box;
    background: #FFFFFF;
    border-bottom: 1px solid #E0E0E0;
    position: sticky;
    top: 0;
    z-index: 1000;
  ">
    <!-- Logo & Menu Section -->
    <div style="display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 16px; flex-grow: 1;">
      <!-- Logo Container -->
      <div style="display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 13px;">
        <!-- Microsoft Logo -->
        <div style="position: relative; width: 26px; height: 26px;">
          <div style="position: absolute; top: 0; left: 0; width: 12px; height: 12px; background: #F26522;"></div>
          <div style="position: absolute; top: 0; right: 0; width: 12px; height: 12px; background: #8DC63F;"></div>
          <div style="position: absolute; bottom: 0; left: 0; width: 12px; height: 12px; background: #00AEEF;"></div>
          <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #FFC20E;"></div>
        </div>
        <!-- Separator -->
        <div style="width: 2px; height: 24px; background: #2F2F2F;"></div>
        <!-- Site Title -->
        <span style="font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 16px; color: #171717; text-decoration: none;">Learn</span>
      </div>
      
      <!-- Navigation Menu -->
      <nav style="display: flex; align-items: center;">
        <ul style="display: flex; align-items: center; gap: 8px; list-style: none; margin: 0; padding: 0;">
          <li style="display: flex; align-items: center; padding: 6px 8px; cursor: pointer;">
            <span style="font-family: 'Segoe UI', sans-serif; font-weight: 400; font-size: 14px; color: #171717;">Browse</span>
          </li>
          <li style="display: flex; align-items: center; padding: 6px 8px; cursor: pointer;">
            <span style="font-family: 'Segoe UI', sans-serif; font-weight: 400; font-size: 14px; color: #171717;">Reference</span>
          </li>
          <li style="display: flex; align-items: center; padding: 6px 8px; cursor: pointer;">
            <span style="font-family: 'Segoe UI', sans-serif; font-weight: 400; font-size: 14px; color: #171717;">Learn</span>
          </li>
          <li style="display: flex; align-items: center; padding: 6px 8px; cursor: pointer;">
            <span style="font-family: 'Segoe UI', sans-serif; font-weight: 400; font-size: 14px; color: #171717;">Q&A</span>
          </li>
        </ul>
      </nav>
    </div>
    
    <!-- Profile Section -->
    <div style="display: flex; align-items: center; gap: 8px;">
      <!-- User Avatar with Mina image -->
      <img src="mina.png" alt="Mina" style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #e1e1e1;
      " />
    </div>
  </header>
  `;
}

// Function to inject Atlas animations into HTML
function injectAtlasAnimations(html) {
  const animationCSS = `
<style>
/* Atlas Component Animations */
@keyframes atlasSlideIn {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes atlasGlow {
  0%, 100% { box-shadow: 0 4px 16px rgba(0,120,212,0.3); }
  50% { box-shadow: 0 8px 32px rgba(0,120,212,0.6); }
}

@keyframes atlasFlash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes atlasFadeInUp {
  0% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Atlas newly added indicator */
.atlas-newly-added {
  position: relative;
}

.atlas-new-indicator {
  z-index: 1000;
}

/* Hover effects for Atlas components */
.atlas-component {
  border: 2px dashed rgba(156, 163, 175, 0.4);
  transition: border-color 0.3s ease;
}

.atlas-component:hover {
  border-color: rgba(75, 85, 99, 0.8);
}
</style>`;

  // Find the head tag and inject CSS
  if (html.includes("</head>")) {
    html = html.replace("</head>", animationCSS + "\n</head>");
  } else if (html.includes("<head>")) {
    html = html.replace("<head>", "<head>" + animationCSS);
  } else {
    // If no head tag, add it at the beginning of the document
    html = html.replace(
      "<!DOCTYPE html>",
      "<!DOCTYPE html>\n<head>" + animationCSS + "\n</head>"
    );
  }

  return html;
}

// Function to fetch learning path component from Figma
async function fetchLearningPathFromFigma() {
  try {
    const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
    const FIGMA_FILE_ID = "PuWj05uKXhfbqrhmJLtCij"; // Atlas library file ID
    const LEARNING_PATH_NODE_ID = "1:3993"; // Card-Certification component

    if (!FIGMA_TOKEN) {
      console.log("⚠️ No FIGMA_ACCESS_TOKEN found, using fallback image");
      return "/course.png";
    }

    console.log(
      `🔄 Fetching learning path component from Figma (${LEARNING_PATH_NODE_ID})`
    );

    const response = await fetch(
      `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${LEARNING_PATH_NODE_ID}&format=png&scale=2`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
        timeout: 10000,
      }
    );

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.images && data.images[LEARNING_PATH_NODE_ID]) {
      const imageUrl = data.images[LEARNING_PATH_NODE_ID];
      console.log("✅ Successfully fetched learning path from Figma");
      return imageUrl;
    } else {
      throw new Error("No image URL returned from Figma API");
    }
  } catch (error) {
    console.error("❌ Error fetching from Figma:", error.message);
    console.log("🔄 Falling back to static image");
    return "/course.png"; // Fallback to static image
  }
}

// Function to fetch components using the FigmaComponentBrowser service
async function fetchFigmaComponents() {
  try {
    // Load local.settings.json values first if in development
    if (!process.env.FIGMA_ACCESS_TOKEN) {
      const fs = require("fs");
      const path = require("path");
      try {
        const localSettingsPath = path.join(
          __dirname,
          "..",
          "local.settings.json"
        );
        const localSettings = JSON.parse(
          fs.readFileSync(localSettingsPath, "utf8")
        );

        // Set environment variables from local.settings.json
        Object.keys(localSettings.Values).forEach((key) => {
          if (!process.env[key]) {
            process.env[key] = localSettings.Values[key];
          }
        });
        console.log("📁 Loaded local.settings.json for Figma integration");
      } catch (error) {
        console.error("⚠️ Could not load local.settings.json:", error.message);
      }
    }

    const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

    if (!FIGMA_TOKEN) {
      console.log("⚠️ No FIGMA_ACCESS_TOKEN found, using fallback images");
      return {
        learningPath: "/course.png",
        module: "/course.png",
        hero: "/Hero300.png",
        banner: "/banner.png",
      };
    }

    console.log(
      "🔄 Fetching components from Figma Component Browser service..."
    );

    // Try to use the FigmaComponentBrowser service if available
    try {
      const FigmaComponentBrowser = require("../../designetica-services/figmaComponentBrowser");
      const browser = new FigmaComponentBrowser();

      // Get popular/recent components
      const popularComponents = await browser.getPopularComponents(10);
      const allComponents = await browser.getAllComponents();

      console.log(
        `🎨 Found ${allComponents.length} total components in browser`
      );

      // Find specific component types we need
      const learningComponent = allComponents.find(
        (c) =>
          c.name.toLowerCase().includes("learning") ||
          c.name.toLowerCase().includes("card") ||
          c.category === "Education"
      );

      const heroComponent = allComponents.find(
        (c) =>
          c.name.toLowerCase().includes("hero") ||
          c.name.toLowerCase().includes("banner") ||
          c.category === "Marketing"
      );

      const bannerComponent = allComponents.find(
        (c) =>
          c.name.toLowerCase().includes("banner") ||
          c.name.toLowerCase().includes("info")
      );

      const components = {
        learningPath: learningComponent?.preview || "/course.png",
        module: learningComponent?.preview || "/course.png",
        hero: heroComponent?.preview || "/Hero300.png",
        banner: bannerComponent?.preview || "/banner.png",
        // Store component details for reference
        _componentDetails: {
          learning: learningComponent,
          hero: heroComponent,
          banner: bannerComponent,
          totalAvailable: allComponents.length,
        },
      };

      console.log(`✅ Successfully loaded components from browser:
        - Learning: ${learningComponent?.name || "fallback"}
        - Hero: ${heroComponent?.name || "fallback"} 
        - Banner: ${bannerComponent?.name || "fallback"}
        - Total components available: ${allComponents.length}`);

      return components;
    } catch (browserError) {
      console.warn(
        "⚠️ FigmaComponentBrowser service not available, falling back to direct API:",
        browserError.message
      );

      // Fallback to direct Figma API for specific components
      const FIGMA_FILE_ID = "PuWj05uKXhfbqrhmJLtCij"; // Atlas library file ID

      const componentNodeIds = {
        learningPath: "1:3993", // Card-Certification component
        hero: "1:4688", // Hero component from Figma
      };

      console.log("🔄 Fetching specific components from Figma API...");

      const nodeIds = Object.values(componentNodeIds).join(",");
      const response = await fetch(
        `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${nodeIds}&format=png&scale=2`,
        {
          headers: {
            "X-Figma-Token": FIGMA_TOKEN,
          },
          timeout: 15000,
        }
      );

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.status}`);
      }

      const data = await response.json();
      const components = {};

      Object.entries(componentNodeIds).forEach(([componentName, nodeId]) => {
        if (data.images && data.images[nodeId]) {
          components[componentName] = data.images[nodeId];
          console.log(
            `✅ Successfully fetched ${componentName} from Figma (${nodeId})`
          );
        } else {
          console.log(`⚠️ Failed to fetch ${componentName}, using fallback`);
          components[componentName] =
            componentName === "hero" ? "/Hero300.png" : "/course.png";
        }
      });

      components.module = components.learningPath;
      components.banner = "/banner.png";

      return components;
    }
  } catch (error) {
    console.error("❌ Error fetching components from Figma:", error.message);
    console.log("🔄 Falling back to static images");
    return {
      learningPath: "/course.png",
      module: "/course.png",
      hero: "/Hero300.png",
      banner: "/banner.png",
    };
  }
}

// Simple Atlas component post-processing (same as enhanced endpoint)
async function addAtlasComponents(html, description) {
  // Comprehensive input validation
  if (!html) {
    console.error("❌ addAtlasComponents received null/undefined html");
    return html;
  }

  if (typeof html !== "string") {
    console.error(
      "❌ addAtlasComponents received non-string html:",
      typeof html,
      html
    );
    return html;
  }

  console.log("🎨 Processing wireframe for Atlas components...");
  console.log("📏 Input HTML length:", html.length);
  console.log("📝 HTML type check:", typeof html);

  // Fetch all components from Figma Atlas library
  const atlasComponents = await fetchFigmaComponents();

  // Check if description SPECIFICALLY requests learning components
  const requestsLearningComponents =
    /add.*learning|include.*learning|with.*learning.*path|with.*module|learning.*component|atlas.*learning|atlas.*module/i.test(
      description
    );

  console.log(`🔍 Atlas component check:
    Description: "${description}"
    Specifically requests learning components: ${requestsLearningComponents}`);

  if (!requestsLearningComponents) {
    console.log("ℹ️ Learning components not specifically requested, skipping");
    return html; // Only add Atlas learning components when specifically requested
  }

  let processedHtml = html;

  try {
    // 1. Replace hero sections with Atlas Hero from Figma ONLY when specifically requested
    const heroPattern =
      /<section[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
    if (processedHtml.match(heroPattern) && requestsLearningComponents) {
      processedHtml = processedHtml.replace(
        heroPattern,
        `<section class="hero atlas-hero-section">
        <div class="container">
          <div class="atlas-component atlas-hero-figma" data-node-id="1:4688" data-source="figma" style="max-width: 100%; overflow: hidden;">
              <img src="${atlasComponents.hero}" alt="Atlas Hero Component from Figma (Node: 1:4688)" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
          </div>
        </div>
      </section>`
      );
      console.log(
        "✅ Hero section replaced with Atlas Hero component from Figma"
      );
    }

    // 2. Add learning content section if learning platform and not already present
    if (
      !processedHtml.includes("atlas-learning-path-card-figma") &&
      !processedHtml.includes("atlas-module-card-fluent")
    ) {
      const learningSection = `
    <!-- Atlas Learning Content Section - Using Figma Components -->
    <section class="learning-content atlas-learning-section atlas-newly-added" style="padding: 60px 0; background: #f8f9fa; animation: atlasSlideIn 0.8s ease-out, atlasGlow 2s ease-in-out; border: 2px solid #0078d4; margin: 20px 0; border-radius: 12px; position: relative; overflow: hidden;">
        <!-- New Component Indicator -->
        <div class="atlas-new-indicator" style="position: absolute; top: 0; left: 0; right: 0; background: linear-gradient(90deg, #0078d4, #40e0d0); color: white; text-align: center; padding: 8px; font-size: 14px; font-weight: bold; animation: atlasFlash 1.5s ease-in-out infinite;">
            ✨ FIGMA ATLAS COMPONENTS (Hero: 1:4688, Cards: 1:3993) ✨
        </div>
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 50px 20px 20px;">
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130; animation: atlasFadeInUp 1s ease-out 0.3s both;">🎓 Learning Paths (From Fluent UI)</h2>
            <div class="learning-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 50px;">
                                <div class="atlas-component atlas-learning-path-card-figma" data-type="learning-path" data-node-id="1:3993" data-source="figma" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 0.5s both; transform: translateY(20px);">
                    <img src="${atlasComponents.learningPath}" alt="Atlas Learning Path Component from Figma (Node: 1:3993)" style="width: 100%; height: auto; display: block;" />
                </div>
                                <div class="atlas-component atlas-learning-path-card-figma" data-type="learning-path" data-node-id="1:3993" data-source="figma" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 0.7s both; transform: translateY(20px);">
                    <img src="${atlasComponents.learningPath}" alt="Atlas Learning Path Component from Figma (Node: 1:3993)" style="width: 100%; height: auto; display: block;" />
                </div>
            </div>
            
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130; animation: atlasFadeInUp 1s ease-out 0.9s both;">📚 Available Modules (From Fluent UI)</h2>
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <div class="atlas-component atlas-module-card-fluent" data-type="module" data-source="fluent-ui" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.1s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module from Fluent UI Library" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-fluent" data-type="module" data-source="fluent-ui" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.3s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module from Fluent UI Library" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-fluent" data-type="module" data-source="fluent-ui" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.5s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module from Fluent UI Library" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-fluent" data-type="module" data-source="fluent-ui" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.7s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module from Fluent UI Library" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-fluent" data-type="module" data-source="fluent-ui" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.9s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module from Fluent UI Library" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-fluent" data-type="module" data-source="fluent-ui" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 2.1s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module from Fluent UI Library" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
            </div>
        </div>
    </section>`;

      // Insert learning section while preserving footer order
      // First, check if there's a footer and extract it
      const footerPattern = /<footer[\s\S]*?<\/footer>/gi;
      const footerMatch = processedHtml.match(footerPattern);
      let footerContent = "";

      if (footerMatch && footerMatch.length > 0) {
        footerContent = footerMatch[footerMatch.length - 1]; // Get the last footer
        // Remove the footer from the original position
        processedHtml = processedHtml.replace(footerPattern, "");
        console.log(
          "📍 Footer extracted and will be repositioned at the bottom"
        );
      }

      // Insert learning section at the TOP after navigation/header
      // Find insertion point after navigation or header
      let insertionPoint = processedHtml.indexOf("</nav>");
      let isNavTag = true;
      if (insertionPoint === -1) {
        insertionPoint = processedHtml.indexOf("</header>");
        isNavTag = false;
      }
      if (insertionPoint === -1) {
        // If no nav/header found, insert after opening body tag
        insertionPoint = processedHtml.indexOf("<body");
        if (insertionPoint !== -1) {
          insertionPoint = processedHtml.indexOf(">", insertionPoint) + 1;
        }
      } else {
        insertionPoint += isNavTag ? 6 : 9; // Move past the closing tag (</nav> = 6, </header> = 9)
      }

      if (insertionPoint > 0) {
        processedHtml =
          processedHtml.slice(0, insertionPoint) +
          "\n" +
          learningSection +
          "\n" +
          processedHtml.slice(insertionPoint);
        console.log(
          "✅ Added Atlas Learning Path and Module components at the TOP"
        );
      } else {
        // Fallback: add before closing body tag (old behavior)
        processedHtml = processedHtml.replace(
          "</body>",
          learningSection + "\n" + footerContent + "\n</body>"
        );
        console.log(
          "✅ Added Atlas Learning Path and Module components (fallback position)"
        );
      }

      // Reposition footer at the very bottom if it was extracted
      if (footerContent && insertionPoint > 0) {
        processedHtml = processedHtml.replace(
          "</body>",
          footerContent + "\n</body>"
        );
        console.log("📍 Footer repositioned at the bottom");
      }
    }

    // Count components for verification
    const heroCount = (processedHtml.match(/atlas-hero-fluent/g) || []).length;
    const moduleCount = (processedHtml.match(/atlas-module-card-fluent/g) || [])
      .length;
    const learningPathCount = (
      processedHtml.match(/atlas-learning-path-card-figma/g) || []
    ).length;

    console.log(
      `🎯 Atlas components added: Hero: ${heroCount}, Modules: ${moduleCount}, Learning Paths: ${learningPathCount}`
    );

    return processedHtml;
  } catch (error) {
    console.error("❌ Error in addAtlasComponents:", error.message);
    console.error("📝 HTML type at error:", typeof processedHtml);
    console.error("📏 HTML length at error:", processedHtml?.length || 0);
    // Return original HTML if processing fails
    return html;
  }
}

// Initialize OpenAI client
let openai = null;
let enhancedWireframeGenerator = null;

function initializeOpenAI() {
  try {
    // Load local.settings.json values if in development
    if (!process.env.AZURE_OPENAI_KEY) {
      const fs = require("fs");
      const path = require("path");
      try {
        const localSettingsPath = path.join(
          __dirname,
          "..",
          "local.settings.json"
        );
        const localSettings = JSON.parse(
          fs.readFileSync(localSettingsPath, "utf8")
        );

        console.log("📁 Loading local.settings.json...");

        // Set environment variables from local.settings.json
        Object.keys(localSettings.Values).forEach((key) => {
          if (!process.env[key]) {
            process.env[key] = localSettings.Values[key];
            console.log(
              `  Set ${key}: ${localSettings.Values[key]?.substring(0, 10)}...`
            );
          } else {
            console.log(
              `  Skipped ${key} (already set): ${process.env[key]?.substring(
                0,
                10
              )}...`
            );
          }
        });

        console.log("📁 Loaded local.settings.json for generateWireframe");
      } catch (error) {
        console.error("⚠️ Could not load local.settings.json:", error.message);
      }
    } else {
      console.log(
        "📁 AZURE_OPENAI_KEY already set, skipping local.settings.json"
      );
      console.log("🔍 Current env vars:");
      console.log(
        `  AZURE_OPENAI_KEY: ${process.env.AZURE_OPENAI_KEY?.substring(
          0,
          10
        )}...`
      );
      console.log(
        `  AZURE_OPENAI_ENDPOINT: ${process.env.AZURE_OPENAI_ENDPOINT}`
      );
    }
    if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
      const apiVersion =
        process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

      // DEBUG: Log the actual values being used
      console.log("🔍 DEBUG OpenAI Config:");
      console.log("  Endpoint:", endpoint);
      console.log("  Deployment:", deployment);
      console.log("  API Version:", apiVersion);
      console.log(
        "  API Key starts with:",
        process.env.AZURE_OPENAI_KEY?.substring(0, 10) + "..."
      );
      console.log(
        "  Base URL:",
        `${endpoint}/openai/deployments/${deployment}`
      );

      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: {
          "api-key": process.env.AZURE_OPENAI_KEY,
        },
      });

      console.log("✅ OpenAI client initialized successfully");
      console.log("🔑 Using endpoint:", endpoint);
      console.log("🎯 Using deployment:", deployment);
      return true;
    }
    console.log("⚠️ OpenAI environment variables not found");
    return false;
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI client:", error);
    return false;
  }
}

// Initialize on startup
const initialized = initializeOpenAI();
if (initialized && openai) {
  enhancedWireframeGenerator = new EnhancedWireframeGenerator(openai);
  console.log("🧠 Enhanced wireframe generator initialized");
}

// Simple fallback wireframe generator
// NO MORE FALLBACK FUNCTIONS - AI ONLY!

// Function to inject low-fidelity wireframe CSS
function injectLowFidelityCSS(html) {
  const lowFidelityCSS = `
<style>
/* Low-Fidelity Wireframe Styles */
/* Palette aligned with Learn light blues */
:root {
  --wf-blue-50: #f2f9ff;
  --wf-blue-75: #eaf4ff;
  --wf-blue-100: #e2f0ff;
  --wf-blue-150: #d6ecff;
  --wf-blue-200: #c7e3ff;
  --wf-blue-250: #b9dcff;
  --wf-blue-border: #a8d2ff;
  --wf-blue-accent: #0078d4;
  --wf-text-muted: #2f3b4a;
}

.text-placeholder-heading {
  background: var(--wf-blue-200);
  height: 14px;
  border-radius: 2px;
  margin: 8px 0;
  display: block;
  width: 60%;
  position: relative;
}

.text-placeholder-line {
  background: var(--wf-blue-150);
  height: 6px;
  border-radius: 3px;
  margin: 6px 0 0 0;
  display: block;
  width: 92%;
}

.text-placeholder-button {
  background: var(--wf-blue-250);
  height: 8px;
  width: 80px;
  border-radius: 3px;
  display: inline-block;
}

.wireframe-component {
  background: var(--wf-blue-75);
  border: 1px solid var(--wf-blue-border);
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
}

.wireframe-component.secondary {
  background: var(--wf-blue-100);
}

.wireframe-nav {
  background: var(--wf-blue-75);
  padding: 12px 20px;
  border-bottom: 1px solid var(--wf-blue-border);
  display: flex;
  align-items: center;
  gap: 20px;
}

.wireframe-button {
  background: var(--wf-blue-100);
  border: 1px solid var(--wf-blue-border);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.wireframe-image {
  background: var(--wf-blue-150);
  border: 1px solid var(--wf-blue-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wf-blue-accent);
  font-size: 14px;
  min-height: 120px;
}

.wireframe-card {
  background: #ffffff;
  border: 1px solid var(--wf-blue-border);
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* Override any earlier grey styles accidentally produced by model */
style + style .text-placeholder-line,
style + style .text-placeholder-heading,
style + style .text-placeholder-button { background: inherit; }

/* Paragraph simulation: create natural ragged edges */
.wireframe-component .text-placeholder-heading + .text-placeholder-line { width: 95%; }
.wireframe-component .text-placeholder-heading + .text-placeholder-line + .text-placeholder-line { width: 88%; }
.wireframe-component .text-placeholder-heading + .text-placeholder-line + .text-placeholder-line + .text-placeholder-line { width: 76%; }

/* Generic variation for any consecutive lines */
.wireframe-component .text-placeholder-line:nth-of-type(4n+1) { width: 93%; }
.wireframe-component .text-placeholder-line:nth-of-type(4n+2) { width: 87%; }
.wireframe-component .text-placeholder-line:nth-of-type(4n+3) { width: 74%; }
.wireframe-component .text-placeholder-line:nth-of-type(4n) { width: 60%; }
</style>`;

  // Insert CSS in the head section
  if (html.includes("<head>")) {
    html = html.replace("<head>", "<head>" + lowFidelityCSS);
  } else if (html.includes("<!DOCTYPE html>")) {
    html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>" + lowFidelityCSS);
  } else {
    html = lowFidelityCSS + html;
  }

  return html;
}

// AI wireframe generation
async function generateWithAI(description, imageAnalysis = null) {
  if (!openai) {
    throw new Error("OpenAI not initialized");
  }

  // Different prompts for uploaded images vs templates
  let prompt;
  let systemMessage;

  if (imageAnalysis) {
    // For uploaded images - create low-fidelity wireframe version
    systemMessage = `You are an expert wireframe designer who creates low-fidelity wireframes in Microsoft Learn documentation style.
    Transform uploaded designs into clean, minimal wireframe versions.
    Use light blue components and gray text placeholders for a professional wireframe aesthetic.`;

    prompt = `Create a low-fidelity wireframe replica of the uploaded design using Microsoft Learn documentation style.

CRITICAL: Use these EXACT CSS classes in your HTML:

1. ALL COMPONENTS must use: class="wireframe-component"
2. NAVIGATION elements: class="wireframe-nav" 
3. BUTTONS: class="wireframe-button"
4. IMAGES/PLACEHOLDERS: class="wireframe-image"
5. TEXT HEADINGS: class="text-placeholder-heading"
6. TEXT LINES: class="text-placeholder-line"
7. BUTTON TEXT: class="text-placeholder-button"

WIREFRAME TRANSFORMATION RULES:
- Convert ALL text to placeholder bars unless user specifies exact content
- Use light blue (#E3F2FD) component backgrounds via wireframe-component class
- Replace images with placeholder boxes using wireframe-image class
- Make buttons wireframe-style with wireframe-button class

EXAMPLE TRANSFORMATIONS:
- Original heading "Welcome" → <div class="text-placeholder-heading"></div>
- Original paragraph → <div class="text-placeholder-line"></div><div class="text-placeholder-line"></div>
- Original button → <div class="wireframe-button"><div class="text-placeholder-button"></div></div>
- Original image → <div class="wireframe-image">Image Placeholder</div>

USER CONTENT RULES:
- If description mentions specific text: Show actual text
- If no specific text given: Use placeholder bars
- Maintain layout structure but simplify styling

Generate ONLY the HTML code (starting with <!DOCTYPE html>) using these exact classes.`;
  } else {
    // For text descriptions - create low-fidelity wireframes
    systemMessage = `You are an expert wireframe designer specializing in low-fidelity Microsoft Learn-style wireframes.`;

    prompt = `Create a low-fidelity wireframe based on: "${description}"

CRITICAL: Use these EXACT CSS classes in your HTML:

1. ALL COMPONENTS: class="wireframe-component"
2. NAVIGATION: class="wireframe-nav"
3. BUTTONS: class="wireframe-button" 
4. IMAGES: class="wireframe-image"
5. HEADING TEXT: class="text-placeholder-heading"
6. BODY TEXT: class="text-placeholder-line"
7. BUTTON TEXT: class="text-placeholder-button"

WIREFRAME CONSTRUCTION RULES:
- Wrap all sections in <div class="wireframe-component">
- Convert text to placeholder bars unless user specifies exact content
- Use wireframe-button for all buttons
- Use wireframe-image for all images/media
- Use wireframe-nav for navigation areas

CONTENT INTERPRETATION:
- User says "login form" → Create form with wireframe-component wrapper, placeholder labels
- User says "welcome message with 'Hello World'" → Show actual "Hello World" text
- User says "three buttons" → Create 3 wireframe-button elements with text-placeholder-button
- User says "hero section" → Large wireframe-component with placeholder content

EXAMPLE OUTPUT STRUCTURE:
<div class="wireframe-component">
  <div class="text-placeholder-heading"></div>
  <div class="text-placeholder-line"></div>
  <div class="wireframe-button">
    <div class="text-placeholder-button"></div>
  </div>
</div>

Generate ONLY the HTML code (starting with <!DOCTYPE html>) using these exact classes for a clean wireframe.`;
  }

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt },
    ],
    max_tokens: 4000,
    temperature: 0.1, // Lower temperature for uploaded images for accuracy
  });

  let html = response.choices[0]?.message?.content;

  // Comprehensive type checking and error handling
  if (!html) {
    console.error("❌ OpenAI returned null/undefined content");
    throw new Error("OpenAI returned no content");
  }

  if (typeof html !== "string") {
    console.error("❌ OpenAI returned non-string content:", typeof html, html);
    throw new Error(`OpenAI returned ${typeof html} instead of string`);
  }

  // Clean up markdown formatting if present
  html = html
    .replace(/```html\n?/g, "")
    .replace(/```\n?$/g, "")
    .trim();

  // Inject low-fidelity wireframe CSS if not already present
  // Previous logic only injected when 'wireframe-component' missing which failed once HTML had classes but no styles
  if (html && !html.includes("Low-Fidelity Wireframe Styles")) {
    html = injectLowFidelityCSS(html);
  }

  // Final validation
  if (!html || typeof html !== "string") {
    throw new Error("HTML became invalid after cleanup");
  }

  return html;
}

// Main Azure Function
module.exports = async function (context, req) {
  const startTime = Date.now();

  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle OPTIONS request
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      context.res.body = "";
      return;
    }

    // Validate request
    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = JSON.stringify({ error: "Method not allowed" });
      return;
    }

    const { description, imageAnalysis } = req.body || {};

    // Normalize and validate description (avoid substring on non-string)
    let normalizedDescription = "";
    if (typeof description === "string") {
      normalizedDescription = description;
    } else if (description && typeof description === "object") {
      // Prefer common fields if provided
      if (typeof description.text === "string") {
        normalizedDescription = description.text;
      } else if (typeof description.description === "string") {
        normalizedDescription = description.description;
      } else {
        try {
          normalizedDescription = JSON.stringify(description);
        } catch {
          normalizedDescription = String(description);
        }
      }
    } else if (description != null) {
      normalizedDescription = String(description);
    }

    if (
      !normalizedDescription ||
      typeof normalizedDescription !== "string" ||
      normalizedDescription.trim().length === 0
    ) {
      context.res.status = 400;
      context.res.body = JSON.stringify({
        error: "Description is required (non-empty string)",
      });
      return;
    }
    normalizedDescription = normalizedDescription.trim();
    const previewDesc = `${normalizedDescription.slice(0, 100)}${
      normalizedDescription.length > 100 ? "..." : ""
    }`;

    console.log("🎨 Wireframe generation request", {
      description: previewDesc,
      hasImageAnalysis: !!imageAnalysis,
      imageAnalysisType: typeof imageAnalysis,
      componentsCount: imageAnalysis?.components?.length || 0,
      imageAnalysisKeys: imageAnalysis ? Object.keys(imageAnalysis) : [],
      designTokens: imageAnalysis?.designTokens,
      enhancedGeneratorAvailable: !!enhancedWireframeGenerator,
    });

    // Low-fidelity mode flag (default ON). Set LOW_FIDELITY_MODE=false to re-enable Atlas branding/animations.
    const lowFidelityMode =
      (process.env.LOW_FIDELITY_MODE || "true").toLowerCase() !== "false";
    if (lowFidelityMode) {
      console.log("🟦 Low-fidelity mode ACTIVE (Atlas branding suppressed)");
    } else {
      console.log(
        "🟨 Low-fidelity mode DISABLED (Atlas branding/components may be injected)"
      );
    }

    let html;
    let source = "openai";

    // ONLY AI generation - NO FALLBACKS!
    if (!openai) {
      // Try to reinitialize OpenAI
      const initialized = initializeOpenAI();
      if (!initialized) {
        context.res.status = 503;
        context.res.body = JSON.stringify({
          success: false,
          error: "AI_SERVICE_UNAVAILABLE",
          message:
            "AI service is not available. Please check the service status and try again.",
          timestamp: new Date().toISOString(),
        });
        return;
      }
      // Initialize enhanced generator if needed
      if (!enhancedWireframeGenerator && openai) {
        enhancedWireframeGenerator = new EnhancedWireframeGenerator(openai);
      }
    }

    const correlationId = `wireframe-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      // Use enhanced wireframe generator if available and we have image analysis
      if (enhancedWireframeGenerator && imageAnalysis) {
        console.log("🧠 Using enhanced OpenAI wireframe generation");
        html = await enhancedWireframeGenerator.generateEnhancedWireframe(
          normalizedDescription,
          imageAnalysis,
          correlationId
        );
        source = "enhanced-openai-generator";
      } else {
        console.log("🔧 Using standard AI wireframe generation");
        html = await generateWithAI(normalizedDescription, imageAnalysis);
        source = "standard-openai";
      }

      if (!html || typeof html !== "string") {
        throw new Error(`AI returned invalid response: ${typeof html}`);
      }

      if (!html.includes("<!DOCTYPE html>") || html.length < 1000) {
        throw new Error("AI response insufficient or invalid");
      }

      // 🎨 Add Atlas components to the generated wireframe (ONLY for non-uploaded-image wireframes)
      // Skip Atlas components for uploaded images to preserve accuracy
      console.log("🔍 Checking if should add Atlas components:", {
        hasImageAnalysis: !!imageAnalysis,
        imageAnalysisKeys: imageAnalysis ? Object.keys(imageAnalysis) : [],
        willSkipAtlas: !!imageAnalysis,
      });

      if (!imageAnalysis) {
        if (lowFidelityMode) {
          console.log(
            "ℹ️ Low-fidelity mode: Skipping Atlas components, animations, and top navigation"
          );
        } else {
          console.log(
            "📝 No image analysis - adding Atlas components (branding enabled)"
          );
          html = await addAtlasComponents(html, normalizedDescription);
          html = injectAtlasAnimations(html);
          const atlasTopNav = generateAtlasTopNavigation();
          if (html.includes("<body")) {
            const bodyTagEnd = html.indexOf(">", html.indexOf("<body")) + 1;
            html =
              html.slice(0, bodyTagEnd) +
              "\n" +
              atlasTopNav +
              "\n" +
              html.slice(bodyTagEnd);
            console.log("🧭 Atlas Top Navigation injected into wireframe body");
          } else {
            html = atlasTopNav + "\n" + html;
            console.log("🧭 Atlas Top Navigation prepended (fallback)");
          }
        }
      } else {
        console.log(
          "📸 Uploaded image detected - skipping additional branding for accuracy",
          {
            hasComponents: !!imageAnalysis.components,
            componentCount: imageAnalysis.components?.length || 0,
            hasDesignTokens: !!imageAnalysis.designTokens,
            colors: imageAnalysis.designTokens?.colors || [],
          }
        );
      }

      // Count Atlas components for stats
      const heroCount = (html.match(/atlas-hero-fluent/g) || []).length;
      const moduleCount = (html.match(/atlas-module-card-fluent/g) || [])
        .length;
      const learningPathCount = (
        html.match(/atlas-learning-path-card-figma/g) || []
      ).length;

      console.log(
        `✅ Wireframe completed with Atlas components: Hero: ${heroCount}, Modules: ${moduleCount}, Learning Paths: ${learningPathCount}`
      );
    } catch (aiError) {
      console.error("❌ AI generation failed:", aiError.message);

      context.res.status = 503;
      context.res.body = JSON.stringify({
        success: false,
        error: "AI_GENERATION_FAILED",
        message: `AI generation failed: ${aiError.message}. No fallback templates available - only real AI generation.`,
        timestamp: new Date().toISOString(),
        details: aiError.message,
      });
      return;
    }

    const processingTime = Date.now() - startTime;

    // Count Atlas components for response stats
    const heroCount = (html.match(/atlas-hero-fluent/g) || []).length;
    const moduleCount = (html.match(/atlas-module-card-fluent/g) || []).length;
    const learningPathCount = (
      html.match(/atlas-learning-path-card-figma/g) || []
    ).length;

    context.res.status = 200;
    context.res.body = {
      html,
      source,
      aiGenerated: source === "openai",
      processingTimeMs: processingTime,
      fallback: source === "fallback",
      stats: {
        atlasComponents: {
          hero: heroCount,
          modules: moduleCount,
          learningPaths: learningPathCount,
          total: heroCount + moduleCount + learningPathCount,
        },
      },
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("❌ Function error:", error);

    // NO EMERGENCY FALLBACK - Return proper error
    context.res.status = 500;
    context.res.body = JSON.stringify({
      success: false,
      error: "FUNCTION_ERROR",
      message:
        "Internal server error occurred. No fallback templates available.",
      timestamp: new Date().toISOString(),
      processingTimeMs: processingTime,
    });
  }
};
