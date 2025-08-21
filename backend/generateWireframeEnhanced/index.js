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

  // Check if description SPECIFICALLY requests learning components
  const requestsLearningComponents =
    /add.*learning|include.*learning|with.*learning.*path|with.*module|learning.*component|atlas.*learning|atlas.*module/i.test(
      description
    );

  console.log(`🔍 Atlas component check (ENHANCED):
    Description: "${description}"
    Specifically requests learning components: ${requestsLearningComponents}`);

  if (!requestsLearningComponents) {
    console.log("ℹ️ Learning components not specifically requested, skipping");
    return html; // Only add Atlas learning components when specifically requested
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
              <div class="atlas-hero-overlay" style="text-align: center; margin-top: 12px; background: rgba(255,255,255,0.95); padding: 8px; border-radius: 6px; border: 1px solid #e1e1e1;">
                  <p style="font-size: 12px; color: #323130; margin: 0; font-weight: 600;">✅ Atlas Hero Component (Node: 14647:163530)</p>
                  <p style="font-size: 11px; color: #605e5c; margin: 4px 0 0 0; font-weight: 500;">🎨 Fetched directly from Figma</p>
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
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130;">🎓 Learning Path</h2>
            <div class="learning-grid" style="display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 50px; max-width: 400px; margin-left: auto; margin-right: auto;">
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.learningPath}" alt="Atlas Learning Path Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
            </div>
            
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130;">📚 Module</h2>
            <div class="modules-grid" style="display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 350px; margin-left: auto; margin-right: auto;">
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="max-width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${atlasComponents.module}" alt="Atlas Module Card Component from Figma (Node: 14315:162386)" style="width: 100%; height: auto; display: block; object-fit: contain;" />
                </div>
            </div>
        </div>
    </section>`;

    // Insert before footer to maintain proper page structure
    if (processedHtml.includes("</footer>")) {
      processedHtml = processedHtml.replace(
        "<footer",
        learningSection + "\n    <footer"
      );
    } else if (processedHtml.includes("</main>")) {
      processedHtml = processedHtml.replace(
        "</main>",
        learningSection + "\n</main>"
      );
    } else if (processedHtml.includes("</body>")) {
      processedHtml = processedHtml.replace(
        "</body>",
        learningSection + "\n</body>"
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

  const prompt = `Create a complete, modern HTML wireframe for: ${description}\n\nRequirements:\n- Use modern CSS with flexbox/grid\n- Include semantic HTML structure\n- ${theme} theme with ${colorScheme} color scheme\n- Mobile-responsive design\n- Include proper meta tags and DOCTYPE\n- Use inline CSS for complete standalone file\n- Create sections for: header, main content, and footer (navigation will be provided separately)\n- DO NOT create any navigation elements (nav, header with navigation) as navigation is provided\n- IMPORTANT: Ensure proper color contrast - use dark text (#333) on light backgrounds (#fff, #f8f9fa) and light text (#fff) only on dark backgrounds (#333, #007bff)\n- Avoid opacity values below 0.9 for text to ensure readability\n${
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

  // Comprehensive markdown cleanup
  const cleanedHtml = html
    .replace(/```html\n?/g, "")
    .replace(/```javascript\n?/g, "")
    .replace(/```css\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/`{3,}/g, "")
    .trim();

  console.log("🧹 OpenAI Response Cleanup (ENHANCED):");
  console.log("Raw response length:", html.length);
  console.log("Cleaned response length:", cleanedHtml.length);
  console.log(
    "First 100 chars of cleaned response:",
    cleanedHtml.substring(0, 100)
  );

  return cleanedHtml;
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

    // ✨ ALWAYS inject Atlas Navigation as clean topnav
    console.log("🧭 Injecting clean Atlas Navigation for ALL wireframes...");
    const atlasNavigation = `
      <!-- Atlas Navigation - Always Present at TOP -->
      <style>
        .atlas-navigation {
          /* No animations - just static navigation */
        }
      </style>
      
      <header class="atlas-navigation" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 24px;
        background: #ffffff !important;
        background-color: #ffffff !important;
        border-bottom: 1px solid #e1e5e9;
        position: sticky;
        top: 0;
        z-index: 1000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
      ">
        <!-- Logo & Brand -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <!-- Microsoft Logo -->
            <div style="position: relative; width: 20px; height: 20px;">
              <div style="position: absolute; top: 0; left: 0; width: 9px; height: 9px; background: #F26522;"></div>
              <div style="position: absolute; top: 0; right: 0; width: 9px; height: 9px; background: #8DC63F;"></div>
              <div style="position: absolute; bottom: 0; left: 0; width: 9px; height: 9px; background: #00AEEF;"></div>
              <div style="position: absolute; bottom: 0; right: 0; width: 9px; height: 9px; background: #FFC20E;"></div>
            </div>
            <span style="font-size: 18px; font-weight: 600; color: #323130; margin-left: 8px;">Learn</span>
          </div>
          
          <!-- Navigation Menu -->
          <nav style="display: flex; gap: 24px; margin-left: 32px;">
            <a href="#" style="color: #323130; text-decoration: none; font-weight: 500; padding: 8px 0; border-bottom: 2px solid transparent; transition: all 0.2s;">Browse</a>
            <a href="#" style="color: #323130; text-decoration: none; font-weight: 500; padding: 8px 0; border-bottom: 2px solid transparent; transition: all 0.2s;">Reference</a>
            <a href="#" style="color: #0078d4; text-decoration: none; font-weight: 500; padding: 8px 0; border-bottom: 2px solid #0078d4; transition: all 0.2s;">Learn</a>
            <a href="#" style="color: #323130; text-decoration: none; font-weight: 500; padding: 8px 0; border-bottom: 2px solid transparent; transition: all 0.2s;">Q&A</a>
          </nav>
        </div>
        
        <!-- User Section -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <button style="padding: 6px; border: none; background: none; border-radius: 4px; cursor: pointer;">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#605e5c">
              <path d="M8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.6464 17.3536L17.3536 16.6464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5C14 5.46243 11.5376 3 8.5 3ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z"/>
            </svg>
          </button>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #0078d4, #106ebe); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 12px;">U</div>
        </div>
      </header>`;

    // Inject navigation right after <body> tag
    if (html.includes("<body>")) {
      html = html.replace("<body>", `<body>\n${atlasNavigation}`);
      console.log("✅ Atlas Navigation injected after <body> tag");
    } else if (html.includes("<body ")) {
      const bodyTagMatch = html.match(/<body[^>]*>/);
      if (bodyTagMatch) {
        html = html.replace(
          bodyTagMatch[0],
          `${bodyTagMatch[0]}\n${atlasNavigation}`
        );
        console.log("✅ Atlas Navigation injected after <body ...> tag");
      }
    } else {
      console.log("⚠️ No <body> tag found, appending navigation to content");
      html = atlasNavigation + html;
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
