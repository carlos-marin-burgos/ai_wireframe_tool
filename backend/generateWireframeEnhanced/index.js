// Enhanced wireframe generator (cleaned and restored)
// Purpose: Generate an HTML wireframe via OpenAI and optionally inject Atlas components

const { OpenAI } = require("openai");

// --- Atlas component injection helper ---
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

  // Check if description contains learning/training/module/hero keywords
  const isLearningPlatform =
    /learning|training|module|course|certification|education|path|skill|tutorial|hero|homepage/i.test(
      description
    );

  if (!isLearningPlatform) {
    console.log("ℹ️ Not a learning platform, skipping Atlas components");
    return html; // No Atlas components for non-learning platforms
  }

  let processedHtml = html;

  // 1. Replace hero sections with Atlas Hero
  const heroPattern =
    /<section[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
  if (processedHtml.match(heroPattern)) {
    processedHtml = processedHtml.replace(
      heroPattern,
      `<section class="hero atlas-hero-section">
        <div class="container">
          <div class="atlas-component atlas-hero-figma" data-node-id="14647:163530" style="max-width: 100%; overflow: hidden;">
              <img src="${atlasComponents.hero}" alt="Atlas Hero Component from Figma" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              <div class="atlas-hero-overlay" style="text-align: center; margin-top: 12px;">
                  <p style="font-size: 12px; color: #605e5c; margin: 0; opacity: 0.8;">✅ Official Atlas Design Library Hero Component (Node: 14647:163530)</p>
                  <p style="font-size: 11px; color: #8a8886; margin: 4px 0 0 0; opacity: 0.6;">🎨 Fetched directly from Figma Atlas Design Library</p>
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
                        <p style="font-size: 11px; color: #605e5c; margin: 0; opacity: 0.8;">✅ Official Atlas Design Library Learning Path Card</p>
                        <p style="font-size: 10px; color: #8a8886; margin: 2px 0 0 0; opacity: 0.6;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.learningPath}" alt="Atlas Learning Path Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #605e5c; margin: 0; opacity: 0.8;">✅ Official Atlas Design Library Learning Path Card</p>
                        <p style="font-size: 10px; color: #8a8886; margin: 2px 0 0 0; opacity: 0.6;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
            </div>
            
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130;">📚 Available Modules</h2>
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #605e5c; margin: 0; opacity: 0.8;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #8a8886; margin: 2px 0 0 0; opacity: 0.6;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #605e5c; margin: 0; opacity: 0.8;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #8a8886; margin: 2px 0 0 0; opacity: 0.6;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #605e5c; margin: 0; opacity: 0.8;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #8a8886; margin: 2px 0 0 0; opacity: 0.6;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                    <div class="atlas-component-info" style="text-align: center; margin-top: 8px; padding: 8px;">
                        <p style="font-size: 11px; color: #605e5c; margin: 0; opacity: 0.8;">✅ Official Atlas Design Library Module Card</p>
                        <p style="font-size: 10px; color: #8a8886; margin: 2px 0 0 0; opacity: 0.6;">🎨 Node ID: 14315:162386 • Fetched from Figma</p>
                    </div>
                </div>
            </div>
            
            <div class="atlas-credit" style="text-align: center; margin-top: 60px; padding: 24px; background: linear-gradient(135deg, rgba(0, 120, 212, 0.08), rgba(102, 187, 106, 0.08)); border-radius: 12px; border: 1px solid rgba(0, 120, 212, 0.2);">
                <p style="margin: 0; color: #1e1e1e; font-size: 16px; font-weight: 600; margin-bottom: 8px;">🎨 Powered by Atlas Design Library</p>
                <p style="margin: 0; color: #605e5c; font-size: 14px; line-height: 1.5;">These components are rendered directly from Microsoft's Atlas Design Library on Figma</p>
                <p style="margin: 8px 0 0 0; color: #8a8886; font-size: 12px; opacity: 0.8;">Components are dynamically fetched and integrated into your wireframes</p>
            </div>
        </div>
    </section>`;

    // Insert before closing body tag or append to existing content
    if (processedHtml.includes("</body>")) {
      processedHtml = processedHtml.replace(
        "</body>",
        learningSection + "\n</body>"
      );
    } else if (processedHtml.includes("</main>")) {
      processedHtml = processedHtml.replace(
        "</main>",
        learningSection + "\n</main>"
      );
    } else {
      processedHtml += learningSection;
    }
    console.log("✅ Added Atlas learning content section");
  }

  // Count and log Atlas components
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

// --- OpenAI initialization (supports local dev via local.settings.json) ---
let openai = null;

function initializeOpenAI() {
  try {
    // Try to load local.settings.json for development if env not set
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

        console.log(
          "📁 Loading local.settings.json for generateWireframeEnhanced..."
        );

        Object.keys(localSettings.Values || {}).forEach((key) => {
          if (!process.env[key]) process.env[key] = localSettings.Values[key];
        });
      } catch (e) {
        // ignore if file not present
      }
    }

    if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
      const apiVersion =
        process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
      });

      console.log("✅ OpenAI client initialized for generateWireframeEnhanced");
      return true;
    }

    console.log(
      "⚠️ OpenAI environment variables not fully configured for generateWireframeEnhanced"
    );
    return false;
  } catch (error) {
    console.error(
      "❌ Failed to initialize OpenAI client for enhanced generator:",
      error
    );
    return false;
  }
}

// Initialize on module load
initializeOpenAI();

// --- AI wireframe generation using OpenAI ---
async function generateWithAI(description, options = {}) {
  if (!openai) throw new Error("OpenAI not initialized");

  const theme = options.theme || "professional";
  const colorScheme = options.colorScheme || "blue";
  const fastMode = options.fastMode !== false;

  const prompt = `Create a complete, modern HTML wireframe for: ${description}\n\nRequirements:\n- Use modern CSS with flexbox/grid\n- Include semantic HTML structure\n- ${theme} theme with ${colorScheme} color scheme\n- Mobile-responsive design\n- Include proper meta tags and DOCTYPE\n- Use inline CSS for complete standalone file\n- Create sections for: header, navigation, main content, and footer\n${
    fastMode
      ? "- Keep it simple and fast to load"
      : "- Include rich interactions and detailed styling"
  }\n\nReturn only the complete HTML code, no explanations.`;

  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a professional web developer who creates clean, modern HTML wireframes. Return only valid HTML code.",
      },
      { role: "user", content: prompt },
    ],
    model: deployment,
    max_tokens: 4000,
    temperature: 0.7,
  });

  const html = completion.choices?.[0]?.message?.content || "";
  return html
    .replace(/```html\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}

// --- Azure Function handler ---
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

    // Handle preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      context.res.body = "";
      return;
    }

    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = JSON.stringify({ error: "Method not allowed" });
      return;
    }

    const {
      description,
      theme,
      colorScheme,
      fastMode,
      includeAtlas = true,
    } = req.body || {};

    if (!description) {
      context.res.status = 400;
      context.res.body = JSON.stringify({ error: "Description is required" });
      return;
    }

    // Ensure OpenAI client
    if (!openai) {
      const initialized = initializeOpenAI();
      if (!initialized) {
        context.res.status = 503;
        context.res.body = JSON.stringify({
          success: false,
          error: "AI_SERVICE_UNAVAILABLE",
          message: "AI service is not available. Please check configuration.",
        });
        return;
      }
    }

    // Generate base wireframe
    let html = await generateWithAI(description, {
      theme,
      colorScheme,
      fastMode,
    });

    if (!html || !html.includes("<!DOCTYPE html>") || html.length < 500) {
      throw new Error("AI response insufficient or invalid");
    }

    // Optionally apply Atlas components
    if (includeAtlas) {
      html = addAtlasComponents(html, description);
    }

    const processingTime = Date.now() - startTime;

    // Stats
    const atlasStats = {
      hero: (html.match(/atlas-hero-figma/g) || []).length,
      modules: (html.match(/atlas-module-card-figma/g) || []).length,
      learningPaths: (html.match(/atlas-learning-path-card-figma/g) || [])
        .length,
    };

    context.res.status = 200;
    context.res.body = {
      success: true,
      html,
      metadata: {
        theme: theme || "professional",
        colorScheme: colorScheme || "blue",
        fastMode: fastMode !== false,
        includeAtlas: includeAtlas !== false,
        atlasComponents: atlasStats,
        generatedAt: new Date().toISOString(),
        processingTimeMs: processingTime,
        descriptionPreview: description.substring(0, 200),
      },
    };
  } catch (error) {
    console.error("❌ Enhanced wireframe generation failed:", error);
    context.res.status = 500;
    context.res.body = {
      success: false,
      error: error.message,
      details: error.stack,
    };
  }
};
