const { OpenAI } = require("openai");

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

// Simple Atlas component post-processing (same as enhanced endpoint)
function addAtlasComponents(html, description) {
  if (!html || typeof html !== "string") return html;

  console.log("🎨 Processing wireframe for Atlas components...");

  // Atlas component image URLs (proven working from our tests)
  const atlasComponents = {
    hero: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7d68379c-75a0-4198-851c-0f86aa531834",
    learningPath:
      "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e84821f9-29a4-4997-a8fe-674d906f613b",
    module:
      "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e84821f9-29a4-4997-a8fe-674d906f613b",
  };

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

  // 1. Replace hero sections with Atlas Hero ONLY when specifically requested
  const heroPattern =
    /<section[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
  if (processedHtml.match(heroPattern) && requestsLearningComponents) {
    processedHtml = processedHtml.replace(
      heroPattern,
      `<section class="hero atlas-hero-section">
        <div class="container">
          <div class="atlas-component atlas-hero-figma" data-node-id="14647:163530" style="max-width: 100%; overflow: hidden;">
              <img src="${atlasComponents.hero}" alt="Atlas Hero Component" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
          </div>
        </div>
      </section>`
    );
    console.log("✅ Hero section replaced with Atlas Hero component");
  }

  // 2. Add learning content section if learning platform and not already present
  if (
    !processedHtml.includes("atlas-learning-path-card-figma") &&
    !processedHtml.includes("atlas-module-card-figma")
  ) {
    const learningSection = `
    <!-- Atlas Learning Content Section -->
    <section class="learning-content atlas-learning-section atlas-newly-added" style="padding: 60px 0; background: #f8f9fa; animation: atlasSlideIn 0.8s ease-out, atlasGlow 2s ease-in-out; border: 2px solid #0078d4; margin: 20px 0; border-radius: 12px; position: relative; overflow: hidden;">
        <!-- New Component Indicator -->
        <div class="atlas-new-indicator" style="position: absolute; top: 0; left: 0; right: 0; background: linear-gradient(90deg, #0078d4, #40e0d0); color: white; text-align: center; padding: 8px; font-size: 14px; font-weight: bold; animation: atlasFlash 1.5s ease-in-out infinite;">
            ✨ NEWLY ADDED ATLAS COMPONENTS ✨
        </div>
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 50px 20px 20px;">
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130; animation: atlasFadeInUp 1s ease-out 0.3s both;">🎓 Learning Paths</h2>
            <div class="learning-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 50px;">
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 0.5s both; transform: translateY(20px);">
                    <img src="${atlasComponents.learningPath}" alt="Learning Path" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 0.7s both; transform: translateY(20px);">
                    <img src="${atlasComponents.learningPath}" alt="Learning Path" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
            </div>
            
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130; animation: atlasFadeInUp 1s ease-out 0.9s both;">📚 Available Modules</h2>
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.1s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.3s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.5s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.7s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 1.9s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: atlasFadeInUp 1s ease-out 2.1s both; transform: translateY(20px);">
                    <img src="${atlasComponents.module}" alt="Learning Module" style="width: 100%; height: auto; display: block; object-fit: contain;" />
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
      console.log("📍 Footer extracted and will be repositioned at the bottom");
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
  const heroCount = (processedHtml.match(/atlas-hero-figma/g) || []).length;
  const moduleCount = (processedHtml.match(/atlas-module-card-figma/g) || [])
    .length;
  const learningPathCount = (
    processedHtml.match(/atlas-learning-path-card-figma/g) || []
  ).length;

  console.log(
    `🎯 Atlas components added: Hero: ${heroCount}, Modules: ${moduleCount}, Learning Paths: ${learningPathCount}`
  );

  return processedHtml;
}

// Initialize OpenAI client
let openai = null;

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
initializeOpenAI();

// Simple fallback wireframe generator
// NO MORE FALLBACK FUNCTIONS - AI ONLY!

// AI wireframe generation
async function generateWithAI(description) {
  if (!openai) {
    throw new Error("OpenAI not initialized");
  }

  const prompt = `Create a complete HTML wireframe based on: "${description}"

Requirements:
- Create ONLY what is requested in the description
- Use clean, modern design with proper semantics
- Use Segoe UI font family for Microsoft consistency
- Make it responsive and accessible
- Include semantic HTML and modern CSS
- Use white backgrounds and dark text for readability
- If it's a hero section, make it prominent and engaging
- If it's navigation, use dark text on light backgrounds

IMPORTANT: Generate ONLY the components requested. Do not add learning paths, courses, or modules unless specifically requested.

Generate ONLY the HTML code (starting with <!DOCTYPE html>).`;

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
    temperature: 0.7,
  });

  let html = response.choices[0]?.message?.content || "";

  // Clean up markdown formatting if present
  html = html
    .replace(/```html\n?/g, "")
    .replace(/```\n?$/g, "")
    .trim();

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

    const { description } = req.body || {};

    if (!description) {
      context.res.status = 400;
      context.res.body = JSON.stringify({ error: "Description is required" });
      return;
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
    }

    try {
      html = await generateWithAI(description);
      if (!html || !html.includes("<!DOCTYPE html>") || html.length < 1000) {
        throw new Error("AI response insufficient or invalid");
      }

      // 🎨 Add Atlas components to the generated wireframe
      html = addAtlasComponents(html, description);

      // ✨ Inject Atlas animations CSS
      html = injectAtlasAnimations(html);

      // 🧭 Always inject Atlas Top Navigation into every wireframe
      const atlasTopNav = generateAtlasTopNavigation();

      // Find the opening body tag and inject the navigation right after it
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
        // Fallback: prepend if no body tag found
        html = atlasTopNav + "\n" + html;
        console.log("🧭 Atlas Top Navigation prepended (fallback)");
      }

      // Count Atlas components for stats
      const heroCount = (html.match(/atlas-hero-figma/g) || []).length;
      const moduleCount = (html.match(/atlas-module-card-figma/g) || []).length;
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
    const heroCount = (html.match(/atlas-hero-figma/g) || []).length;
    const moduleCount = (html.match(/atlas-module-card-figma/g) || []).length;
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
