// Enhanced wireframe generator (cleaned and restored)
// Purpose: Generate an HTML wireframe via OpenAI and optionally inject Atlas components

const { OpenAI } = require("openai");

// Fluent UI Playbook imports and utilities
const fluentPlaybook = {
  // Fluent UI Web Components CDN
  webComponentsCSS:
    "https://unpkg.com/@fluentui/web-components/dist/fluent-design-system.css",
  webComponentsJS:
    "https://unpkg.com/@fluentui/web-components/dist/web-components.min.js",

  // Fluent UI React CSS (if needed)
  reactCSS: "https://unpkg.com/@fluentui/react/dist/css/fabric.min.css",

  // Common Fluent Playbook patterns
  patterns: {
    navigation:
      "https://docs.microsoft.com/en-us/fluent-ui/web-components/components/navigation",
    cards:
      "https://docs.microsoft.com/en-us/fluent-ui/web-components/components/card",
    forms:
      "https://docs.microsoft.com/en-us/fluent-ui/web-components/components/form",
    buttons:
      "https://docs.microsoft.com/en-us/fluent-ui/web-components/components/button",
  },
};

// --- Fluent Playbook component injection helper ---
function addFluentPlaybookComponents(html) {
  if (!html || typeof html !== "string") return html;

  console.log("🎨 Processing wireframe for Fluent Playbook components...");

  // Inject Fluent UI CSS and JS into the head
  const fluentResources = `
    <link rel="stylesheet" href="${fluentPlaybook.webComponentsCSS}">
    <script type="module" src="${fluentPlaybook.webComponentsJS}"></script>
  `;

  // Add Fluent resources to head
  if (html.includes("</head>")) {
    html = html.replace("</head>", `  ${fluentResources}\n</head>`);
  }

  // Replace common elements with Fluent UI Web Components
  html = html.replace(
    /<button([^>]*)>(.*?)<\/button>/gi,
    "<fluent-button$1>$2</fluent-button>"
  );
  html = html.replace(
    /<input([^>]*type="text"[^>]*)>/gi,
    "<fluent-text-field$1></fluent-text-field>"
  );
  html = html.replace(
    /<input([^>]*type="email"[^>]*)>/gi,
    '<fluent-text-field$1 type="email"></fluent-text-field>'
  );
  html = html.replace(
    /<input([^>]*type="password"[^>]*)>/gi,
    '<fluent-text-field$1 type="password"></fluent-text-field>'
  );
  html = html.replace(/<select([^>]*)>/gi, "<fluent-select$1>");
  html = html.replace(/<\/select>/gi, "</fluent-select>");
  html = html.replace(/<option([^>]*)>/gi, "<fluent-option$1>");
  html = html.replace(/<\/option>/gi, "</fluent-option>");

  console.log("✅ Fluent Playbook components injected successfully");
  return html;
}

// --- Atlas component injection helper ---
function addAtlasComponents(html, description) {
  if (!html || typeof html !== "string") return html;

  console.log("🎨 Processing wireframe for Atlas components...");

  // Atlas component image URLs (proper Microsoft Learn badges)
  // Atlas learning components using pure HTML/CSS (no images)
  const atlasComponents = {
    hero: generateAtlasHeroHTML(),
    learningPath: generateLearningPathHTML(),
    module: generateModuleCardHTML(),
  };

  // Helper functions to generate pure HTML/CSS components
  function generateAtlasHeroHTML() {
    return `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 40px; color: white; text-align: center; box-shadow: 0 8px 24px rgba(102,126,234,0.3);">
      <div style="max-width: 800px; margin: 0 auto;">
        <h1 style="margin: 0 0 16px 0; font-size: 48px; font-weight: 700; font-family: 'Segoe UI', sans-serif;">Master Microsoft Technologies</h1>
        <p style="margin: 0 0 32px 0; font-size: 20px; opacity: 0.9; font-family: 'Segoe UI', sans-serif;">Accelerate your career with hands-on learning paths and industry-recognized certifications</p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button style="background: white; color: #667eea; border: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">Start Learning</button>
          <button style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 14px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Explore Paths</button>
        </div>
      </div>
    </div>`;
  }

  function generateLearningPathHTML() {
    return `
    <div style="background: white; border: 1px solid #e1e5e9; border-radius: 16px; padding: 24px; font-family: 'Segoe UI', sans-serif; width: 100%; max-width: 100%; box-shadow: 0 4px 16px rgba(0,0,0,0.1); box-sizing: border-box;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; height: 120px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; position: relative;">
        <div style="color: white; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎓</div>
          <div style="font-size: 14px; font-weight: 600; opacity: 0.9;">Learning Path</div>
        </div>
        <div style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.9); color: #667eea; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">6 modules</div>
      </div>
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: clamp(16px, 4vw, 20px); font-weight: 600; color: #1a1a1a;">Azure Fundamentals</h3>
        <p style="margin: 0 0 12px 0; color: #6b7280; font-size: clamp(13px, 3vw, 15px); line-height: 1.5;">Learn the fundamentals of cloud computing and how Azure provides secure, reliable cloud services.</p>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <div style="flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden;">
            <div style="width: 65%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
          </div>
          <span style="font-size: 12px; color: #6b7280; font-weight: 500; white-space: nowrap;">65%</span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <span style="background: #f0f2ff; color: #667eea; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">Beginner</span>
          <span style="background: #f0f2ff; color: #667eea; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">4h 30m</span>
        </div>
        <button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap;">Continue</button>
      </div>
    </div>`;
  }

  function generateModuleCardHTML() {
    return `
    <div style="background: white; border: 1px solid #e1e5e9; border-radius: 12px; padding: 20px; font-family: 'Segoe UI', sans-serif; width: 100%; max-width: 100%; box-shadow: 0 2px 12px rgba(0,0,0,0.08); box-sizing: border-box;">
      <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <div style="color: white; font-size: 20px;">📚</div>
        </div>
        <div style="flex: 1; min-width: 0;">
          <h4 style="margin: 0 0 6px 0; font-size: clamp(14px, 3.5vw, 18px); font-weight: 600; color: #1a1a1a;">Introduction to Azure</h4>
          <p style="margin: 0; color: #6b7280; font-size: clamp(12px, 3vw, 14px); line-height: 1.4;">Understand core Azure concepts and services in this foundational module.</p>
        </div>
      </div>
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 12px; color: #6b7280; font-weight: 500;">Progress</span>
          <span style="font-size: 12px; color: #1a1a1a; font-weight: 600; white-space: nowrap;">3 of 5 units</span>
        </div>
        <div style="width: 100%; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden;">
          <div style="width: 60%; height: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%);"></div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <span style="background: #ecfdf5; color: #047857; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 500;">25 min</span>
          <span style="background: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 500;">Beginner</span>
        </div>
        <button style="background: #667eea; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap;">Continue</button>
      </div>
    </div>`;
  }

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
              ${atlasComponents.hero}
              <div class="atlas-hero-overlay" style="text-align: center; margin-top: 12px; background: rgba(255,255,255,0.95); padding: 8px; border-radius: 6px; border: 1px solid #e1e1e1;">
                  <p style="font-size: 12px; color: #323130; margin: 0; font-weight: 600;">✅ Atlas Hero Component (Node: 14647:163530)</p>
                  <p style="font-size: 11px; color: #605e5c; margin: 4px 0 0 0; font-weight: 500;">🎨 Pure HTML/CSS Component</p>
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
            <div class="learning-grid" style="display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 50px; width: 100%;">
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${atlasComponents.learningPath}
                </div>
            </div>
            
            <h2 style="text-align: center; margin-bottom: 40px; color: #323130;">📚 Modules</h2>
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; width: 100%;">
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${atlasComponents.module}
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${atlasComponents.module}
                </div>
                <div class="atlas-component atlas-module-card-figma" data-node-id="14315:162386" data-type="module" style="width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${atlasComponents.module}
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

// --- Low-fidelity CSS injection helper (mirrors primary function behavior) ---
function injectLowFidelityCSS(html) {
  const marker = "Low-Fidelity Wireframe Styles";
  if (html.includes(marker)) return html; // already injected
  const css = `\n<style>\n/* ${marker} */\n:root {\n  --wf-blue-50: #f2f9ff;\n  --wf-blue-75: #eaf4ff;\n  --wf-blue-100: #e2f0ff;\n  --wf-blue-150: #d6ecff;\n  --wf-blue-200: #c7e3ff;\n  --wf-blue-250: #b9dcff;\n  --wf-blue-border: #a8d2ff;\n  --wf-blue-accent: #0078d4;\n  --wf-text-muted: #2f3b4a;\n}\n.text-placeholder-heading {\n  background: var(--wf-blue-200);\n  height: 14px;\n  border-radius: 2px;\n  margin: 8px 0;\n  display: block;\n  width: 60%;\n  position: relative;\n}\n.text-placeholder-line {\n  background: var(--wf-blue-150);\n  height: 6px;\n  border-radius: 3px;\n  margin: 6px 0 0 0;\n  display: block;\n  width: 92%;\n}\n.text-placeholder-button {\n  background: var(--wf-blue-250);\n  height: 8px;\n  width: 80px;\n  border-radius: 3px;\n  display: inline-block;\n}\n.wireframe-component {\n  background: var(--wf-blue-75);\n  border: 1px solid var(--wf-blue-border);\n  border-radius: 6px;\n  padding: 16px;\n  margin: 8px 0;\n}\n.wireframe-component.secondary {\n  background: var(--wf-blue-100);\n}\n.wireframe-nav {\n  background: var(--wf-blue-75);\n  padding: 12px 20px;\n  border-bottom: 1px solid var(--wf-blue-border);\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.wireframe-button {\n  background: var(--wf-blue-100);\n  border: 1px solid var(--wf-blue-border);\n  padding: 8px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.wireframe-image {\n  background: var(--wf-blue-150);\n  border: 1px solid var(--wf-blue-border);\n  border-radius: 4px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--wf-blue-accent);\n  font-size: 14px;\n  min-height: 120px;\n}\n.wireframe-card {\n  background: #ffffff;\n  border: 1px solid var(--wf-blue-border);\n  border-radius: 6px;\n  padding: 16px;\n  margin: 8px 0;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);\n}\n/* Override any earlier grey styles accidentally produced by model */\nstyle + style .text-placeholder-line,\nstyle + style .text-placeholder-heading,\nstyle + style .text-placeholder-button { background: inherit; }\n/* Paragraph simulation: create natural ragged edges */\n.wireframe-component .text-placeholder-heading + .text-placeholder-line { width: 95%; }\n.wireframe-component .text-placeholder-heading + .text-placeholder-line + .text-placeholder-line { width: 88%; }\n.wireframe-component .text-placeholder-heading + .text-placeholder-line + .text-placeholder-line + .text-placeholder-line { width: 76%; }\n/* Generic variation for any consecutive lines */\n.wireframe-component .text-placeholder-line:nth-of-type(4n+1) { width: 93%; }\n.wireframe-component .text-placeholder-line:nth-of-type(4n+2) { width: 87%; }\n.wireframe-component .text-placeholder-line:nth-of-type(4n+3) { width: 74%; }\n.wireframe-component .text-placeholder-line:nth-of-type(4n) { width: 60%; }\n</style>`;
  if (html.includes("<head")) {
    return html.replace(/<head[^>]*>/i, (m) => m + css);
  }
  return `<!DOCTYPE html><head>${css}</head>` + html;
}

// --- AI wireframe generation using OpenAI (supports low-fidelity mode) ---
async function generateWithAI(description, options = {}) {
  if (!openai) throw new Error("OpenAI not initialized");

  const lowFidelityMode =
    (process.env.LOW_FIDELITY_MODE || "true").toLowerCase() !== "false";
  const theme = options.theme || "professional";
  const colorScheme = options.colorScheme || "blue";
  const fastMode = options.fastMode !== false;

  let prompt;
  let systemMessage;

  if (lowFidelityMode) {
    systemMessage =
      "You create LOW-FIDELITY Microsoft Learn style wireframes with placeholder bars and specific CSS classes.";
    prompt = `Create a LOW-FIDELITY wireframe for: "${description}"\n\nSTRICT CLASS RULES:\n1. Wrap logical groups in <div class=\"wireframe-component\">\n2. Navigation areas: wireframe-nav\n3. Buttons: wireframe-button (with nested <div class=\"text-placeholder-button\"></div> if text unspecified)\n4. Images/media: wireframe-image\n5. Headings: text-placeholder-heading (unless exact heading text explicitly provided)\n6. Body text lines: text-placeholder-line\n7. Actual user-specified text must be preserved EXACTLY if quoted or clearly specified in description.\n\nTRANSFORM RULES:\n- If description says "login form" create username + password inputs and a submit button using components above.\n- Use placeholder bars for any unspecified text.\n- Do NOT add branding, Microsoft logos, Fluent UI components, complex gradients, animations, or Atlas components. Pure wireframe only.\n- Keep structure semantic where possible but minimal (divs acceptable).\n\nOUTPUT:\nReturn ONLY full standalone HTML starting with <!DOCTYPE html>.`;
  } else {
    systemMessage =
      "You are a professional web developer producing clean, modern HTML wireframes.";
    prompt = `Create a complete, modern HTML wireframe for: ${description}\n\nRequirements:\n- Use modern CSS with flexbox/grid\n- Include semantic HTML structure\n- ${theme} theme with ${colorScheme} color scheme\n- Mobile-responsive design\n- Include proper meta tags and DOCTYPE\n- Create sections for: header, main content, and footer (navigation provided separately)\n- DO NOT create any navigation elements (nav, header with navigation)\n${
      fastMode
        ? "- Keep it simple and fast to load"
        : "- Include richer styling"
    }\nReturn only the complete HTML code.`;
  }

  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt },
    ],
    model: deployment,
    max_tokens: 4000,
    temperature: lowFidelityMode ? 0.2 : 0.7,
  });

  const html = completion.choices?.[0]?.message?.content || "";
  const cleanedHtml = html
    .replace(/```html\n?/g, "")
    .replace(/```javascript\n?/g, "")
    .replace(/```css\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/`{3,}/g, "")
    .trim();

  console.log("🧹 OpenAI Response Cleanup (ENHANCED):", {
    lowFidelityMode,
    rawLength: html.length,
    cleanedLength: cleanedHtml.length,
  });
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
      imageAnalysis,
    } = req.body || {};

    const lowFidelityMode =
      (process.env.LOW_FIDELITY_MODE || "true").toLowerCase() !== "false";

    console.log("🎨 Enhanced wireframe generation request", {
      description: description.substring(0, 100) + "...",
      hasImageAnalysis: !!imageAnalysis,
      imageAnalysisType: typeof imageAnalysis,
      componentsCount: imageAnalysis?.components?.length || 0,
      imageAnalysisKeys: imageAnalysis ? Object.keys(imageAnalysis) : [],
      designTokens: imageAnalysis?.designTokens,
      lowFidelityMode,
    });

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

    // Generate base wireframe HTML first
    let html = await generateWithAI(description, {
      theme,
      colorScheme,
      fastMode,
    });

    if (!html || !html.includes("<!DOCTYPE html>")) {
      throw new Error("AI response insufficient or invalid");
    }

    // Conditionally apply Atlas components (skip for uploaded images)
    if (!lowFidelityMode) {
      if (!imageAnalysis && includeAtlas) {
        console.log("📝 Branding mode: adding Atlas components");
        html = addAtlasComponents(html, description);
      } else if (imageAnalysis) {
        console.log(
          "📸 Skipping Atlas components for uploaded image to preserve accuracy"
        );
      }
    } else {
      console.log("ℹ️ Low-fidelity mode: Skipping Atlas components");
    }

    // Apply Fluent Playbook components (only for template-based wireframes, NOT uploaded images)
    if (!imageAnalysis && !lowFidelityMode) {
      html = addFluentPlaybookComponents(html);
      console.log("🎨 Applied Fluent Playbook components (branding mode)");
    } else if (lowFidelityMode) {
      console.log("ℹ️ Low-fidelity mode: Skipping Fluent Playbook components");
    } else {
      console.log("📸 Uploaded image: skipping Fluent components");
    }

    // Inject low-fidelity CSS if in that mode
    if (lowFidelityMode) {
      html = injectLowFidelityCSS(html);
      if (!/wireframe-component/.test(html)) {
        console.warn(
          "⚠️ Low-fidelity expected classes missing; AI output may not respect prompt."
        );
      }
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
        includeAtlas: includeAtlas !== false && !lowFidelityMode,
        lowFidelityMode,
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
