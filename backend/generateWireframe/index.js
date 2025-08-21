const { OpenAI } = require("openai");

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

  // Check if description contains learning/training/module keywords (but NOT just "hero")
  const isLearningPlatform =
    /learning|training|module|course|certification|education|path|skill|tutorial/i.test(
      description
    ) && !/^hero\s+section/i.test(description.trim());

  console.log(`🔍 Atlas component check:
    Description: "${description}"
    Contains learning keywords: ${/learning|training|module|course|certification|education|path|skill|tutorial/i.test(
      description
    )}
    Is hero section exclusion: ${/^hero\s+section/i.test(description.trim())}
    Final isLearningPlatform: ${isLearningPlatform}`);

  if (!isLearningPlatform) {
    console.log("ℹ️ Not a learning platform, skipping Atlas components");
    return html; // No Atlas components for non-learning platforms
  }

  let processedHtml = html;

  // 1. Replace hero sections with Atlas Hero ONLY for learning platforms
  const heroPattern =
    /<section[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
  if (processedHtml.match(heroPattern) && isLearningPlatform) {
    processedHtml = processedHtml.replace(
      heroPattern,
      `<section class="hero atlas-hero-section">
        <div class="container">
          <div class="atlas-component atlas-hero-figma" data-node-id="14647:163530" style="max-width: 100%; overflow: hidden;">
              <img src="${atlasComponents.hero}" alt="Atlas Hero Component from Figma" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              <div class="atlas-hero-overlay" style="text-align: center; margin-top: 12px;">
                  <p style="font-size: 12px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; display: inline-block;">✅ Official Atlas Design Library Hero Component (Node: 14647:163530)</p>
                  <p style="font-size: 11px; color: #484644; margin: 4px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 6px; border-radius: 3px; display: inline-block;">🎨 Fetched directly from Figma Atlas Design Library</p>
              </div>
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
    <section class="learning-content atlas-learning-section" style="padding: 60px 0; background: #f8f9fa;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130;">🎓 Learning Paths</h2>
            <div class="learning-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 50px;">
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.learningPath}" alt="Atlas Learning Path Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Learning Path Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.learningPath}" alt="Atlas Learning Path Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Learning Path Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
            </div>
            
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130;">📚 Available Modules</h2>
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #323130; margin: 0; background: rgba(255,255,255,0.9); padding: 3px 6px; border-radius: 3px; display: inline-block;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #484644; margin: 2px 0 0 0; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 2px; display: inline-block;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

    // Insert before the last closing body tag
    processedHtml = processedHtml.replace(
      "</body>",
      learningSection + "\n</body>"
    );
    console.log("✅ Added Atlas Learning Path and Module components");
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

  return response.choices[0]?.message?.content || "";
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
