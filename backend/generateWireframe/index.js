// Unified Intelligent Wireframe Generator
// Purpose: Generate HTML wireframes via OpenAI with maximum intelligence and optional component integration

const { OpenAI } = require("openai");
// Import centralized color configuration
const { WIREFRAME_COLORS, ColorUtils } = require("../config/colors");
const {
  AccessibilityValidationMiddleware,
} = require("../accessibility/validation-middleware");
const { fixContainerNesting } = require("../utils/containerNestingFix");

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

  console.log(`🔍 Atlas component check:
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
                  <p style="font-size: 12px; color: #3C4858; margin: 0; font-weight: 600;">✅ Atlas Hero Component (Node: 14647:163530)</p>
                  <p style="font-size: 11px; color: #68769C; margin: 4px 0 0 0; font-weight: 500;">🎨 Pure HTML/CSS Component</p>
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
    <section class="learning-content atlas-learning-section" style="padding: 60px 0; background: ${WIREFRAME_COLORS.surface};">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; margin-bottom: 40px; color: #3C4858;">🎓 Learning Path</h2>
            <div class="learning-grid" style="display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 50px; width: 100%;">
                <div class="atlas-component atlas-learning-path-card-figma" data-node-id="14315:162386" data-type="learning-path" style="width: 100%; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${atlasComponents.learningPath}
                </div>
            </div>
            
            <h2 style="text-align: center; margin-bottom: 40px; color: #3C4858;">📚 Modules</h2>
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
    if (!process.env.AZURE_OPENAI_API_KEY) {
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
          "📁 Loading local.settings.json for unified wireframe generator..."
        );

        Object.keys(localSettings.Values || {}).forEach((key) => {
          if (!process.env[key]) process.env[key] = localSettings.Values[key];
        });
      } catch (e) {
        // ignore if file not present
      }
    }

    if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
      const apiVersion =
        process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
      });

      console.log(
        "✅ OpenAI client initialized for unified wireframe generator"
      );
      return true;
    }

    console.log(
      "⚠️ OpenAI environment variables not fully configured for unified wireframe generator"
    );
    return false;
  } catch (error) {
    console.error(
      "❌ Failed to initialize OpenAI client for unified generator:",
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
  const websiteAnalysis = options.websiteAnalysis || null;
  const strictMode = options.strictMode === true; // new flag

  // Base prompt for wireframe generation
  let basePrompt = `Create a complete, modern HTML wireframe for: ${description}\n\nRequirements:\n- Use modern CSS with flexbox/grid\n- Include semantic HTML structure\n- ${theme} theme with ${colorScheme} color scheme\n- Mobile-responsive design\n- Include proper meta tags and DOCTYPE\n- Use inline CSS for complete standalone file\n- Focus ONLY on the requested component/feature\n- NO navigation bars, headers, footers, or branding unless specifically requested\n- Keep designs clean and minimal\n- DO NOT include the description text anywhere in the visible wireframe content\n- DO NOT add "Create a..." or similar instruction text in the HTML\n- Generate ONLY the actual UI components requested, not meta-descriptions about them\n\nSPECIAL HANDLING FOR WIDGETS:\n- When user asks for "widgets", generate them as direct <div class="widget"> elements, NOT nested section > article\n- Widgets should be siblings in a grid/flex container, not wrapped in sections\n- Each widget should be: <div class="widget" data-widget-index="n"> with title and content\n- For left navigation layouts: use CSS flexbox with nav (fixed width) + main (flex: 1) structure\n- Add responsive design: @media (max-width: 768px) { body { flex-direction: column; } nav { width: 100%; } }`;

  // Enhanced prompt with website analysis data
  if (websiteAnalysis) {
    console.log(
      "🎯 Using website analysis data for enhanced wireframe generation"
    );

    basePrompt += `\n\n=== WEBSITE STRUCTURE ANALYSIS ===\n`;
    basePrompt += `Based on analysis of: ${websiteAnalysis.url}\n`;
    basePrompt += `Page Title: ${websiteAnalysis.pageInfo.title}\n\n`;

    if (websiteAnalysis.layout?.sections?.length > 0) {
      basePrompt += `SECTIONS TO INCLUDE (${websiteAnalysis.layout.sections.length} found):\n`;
      websiteAnalysis.layout.sections.slice(0, 10).forEach((section, index) => {
        basePrompt += `${index + 1}. ${section.type}: ${
          section.heading || "Content section"
        }\n`;
      });
      basePrompt += `\n`;
    }

    if (websiteAnalysis.layout?.navigation?.links?.length > 0) {
      const navLinks = websiteAnalysis.layout.navigation.links.slice(0, 8);
      basePrompt += `NAVIGATION STRUCTURE (${navLinks.length} main links):\n`;
      navLinks.forEach((link, index) => {
        basePrompt += `${index + 1}. ${link.text}\n`;
      });
      basePrompt += `\n`;
    }

    if (websiteAnalysis.styling?.components) {
      basePrompt += `UI COMPONENTS TO INCLUDE:\n`;
      if (websiteAnalysis.styling.components.buttons?.length > 0) {
        basePrompt += `- ${websiteAnalysis.styling.components.buttons.length} buttons\n`;
      }
      if (websiteAnalysis.styling.components.forms?.length > 0) {
        basePrompt += `- ${websiteAnalysis.styling.components.forms.length} forms\n`;
      }
      if (websiteAnalysis.styling.components.images?.length > 0) {
        basePrompt += `- ${websiteAnalysis.styling.components.images.length} images/media\n`;
      }
      basePrompt += `\n`;
    }

    basePrompt += `LAYOUT REQUIREMENTS:\n`;
    basePrompt += `- Match the exact section structure and hierarchy from the analyzed website\n`;
    basePrompt += `- Recreate the navigation pattern and content organization\n`;
    basePrompt += `- Use similar component layouts and spacing\n`;
    basePrompt += `- Apply Microsoft Design System colors while preserving the original structure\n`;
    basePrompt += `- Ensure the wireframe reflects the actual website's information architecture\n`;
    basePrompt += `- EACH SECTION MUST have data-section-index=\"<index>\" and data-section-type=\"<type>\" attributes\n`;
    basePrompt += `- The <main> element MUST include data-sections=\"${
      websiteAnalysis.layout?.sections?.length || 0
    }\"\n`;
    basePrompt += `- If cards or repeated feature blocks appear: wrap them in a grid container with class=\"card-grid\" and each card as <article class=\\"card\\" data-card-index=\\"n\\">\n`;
    basePrompt += `- Keep nesting shallow (max 3 levels) and avoid redundant wrappers\n\n`;
  }

  // Replace original prompt block
  const prompt =
    basePrompt +
    `\n\n🚨 CRITICAL CONTAINER & INDEXING RULES FOR DRAG-AND-DROP:\n- AVOID excessive div nesting - maximum 2-3 levels deep\n- Use semantic HTML tags (main, section, article) instead of generic divs\n- EVERY <section> MUST include data-section-index and data-section-type when websiteAnalysis provided\n- The <main> MUST have data-sections with the total number\n- For widgets: use <div class="widget" data-widget-index="n"> directly, NOT section > article\n- Cards should be direct children of grid/flex containers\n- Card containers: display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;\n- Each card must be <article class="card" data-card-index="n"> with accessible structure\n- DO NOT add cursor:grab or cursor:pointer styles - let the app handle interaction styles\n- DO NOT wrap single components in multiple container divs\n- Keep hierarchy shallow for rearrangement\n\n🎨 CRITICAL ACCESSIBILITY & READABILITY RULES:\n- BUTTONS: Use high-contrast combinations only:\n  • Primary: background: #194a7a; color: #ffffff;\n  • Secondary: background: #ffffff; color: #194a7a; border: 2px solid #194a7a;\n  • Danger: background: #d13438; color: #ffffff;\n  • Success: background: #107c10; color: #ffffff;\n- TEXT CONTRAST: Always dark text on light backgrounds (#fff, ${
      WIREFRAME_COLORS.surface
    }, #E9ECEF)\n- NEVER use opacity below 1.0 for important text\n- NEVER use light on light or dark on dark\n- Button hover: darken background ~15% maintain white text\n- Button padding: >= 12px 24px; border-radius: 4px\n${
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
          "You are a professional web developer who creates clean, minimal wireframes with PERFECT ACCESSIBILITY and OPTIMAL CONTAINER STRUCTURE. When provided with website analysis data, you MUST recreate the exact structure, sections, navigation, and component layout of the analyzed website while applying Microsoft Design System styling. CRITICAL: All buttons must have high contrast (dark blue #194a7a background with white text, or white background with dark blue text and border). NEVER use light colors on light backgrounds or dark colors on dark backgrounds. AVOID excessive div nesting - use maximum 2-3 container levels. Cards must be direct children of grid containers for proper rearrangement. Use semantic HTML (main, section, article) instead of generic divs. When users ask for 'widgets', create them as direct <div class=\"widget\"> elements, NOT nested section > article structures. DO NOT add cursor styles - let the app control interactions. DO NOT include navigation bars, headers, footers, or branding unless specifically requested or found in the website analysis. Focus ONLY on the requested component with readable, accessible design and clean container structure. NEVER include the user's description text or instruction phrases like 'Create a...' in the visible HTML content - generate only actual UI components that match the analyzed website structure.",
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

  console.log("🧹 OpenAI Response Cleanup (MAXIMUM INTELLIGENCE):");
  console.log("Raw response length:", html.length);
  console.log("Cleaned response length:", cleanedHtml.length);
  console.log(
    "First 100 chars of cleaned response:",
    cleanedHtml.substring(0, 100)
  );

  return cleanedHtml;
}

// --- Deterministic Strict Scaffold Builder ---
function buildStrictScaffold(
  websiteAnalysis,
  { theme = "professional", colorScheme = "blue" } = {}
) {
  if (!websiteAnalysis || typeof websiteAnalysis !== "object") return null;
  try {
    const title =
      (websiteAnalysis.pageInfo && websiteAnalysis.pageInfo.title) ||
      websiteAnalysis.url ||
      "Analyzed Site";
    const sections =
      (websiteAnalysis.layout && websiteAnalysis.layout.sections) || [];
    const navLinks =
      (websiteAnalysis.layout &&
        websiteAnalysis.layout.navigation &&
        websiteAnalysis.layout.navigation.links) ||
      [];

    // Limit to a reasonable number to keep scaffold light
    const limitedSections = sections.slice(0, 12);
    const limitedNav = navLinks.slice(0, 10);

    const colorSurface = WIREFRAME_COLORS.surface || "#FFFFFF";
    const colorPrimary = ColorUtils.primary || "#194a7a";

    // Navigation (if any)
    const navHTML = limitedNav.length
      ? `<nav data-ia-role="navigation" style="background:${colorPrimary}; padding:16px;">
        <ul style="list-style:none; margin:0; padding:0; display:flex; gap:24px; flex-wrap:wrap;">
          ${limitedNav
            .map(
              (l, i) =>
                `<li data-nav-index="${i}"><a href="${
                  l.href || "#"
                }" style="color:#fff; text-decoration:none; font-weight:600;">${
                  l.text || l.href || "Link"
                }</a></li>`
            )
            .join("\n")} 
        </ul>
      </nav>`
      : "";

    const sectionHTML = limitedSections
      .map((s, i) => {
        const tag = "section";
        const type = s.type || "section";
        const heading = s.heading || `${type} ${i + 1}`;
        const hasCards = /card|grid|list|feature|module/i.test(type);
        const cards = hasCards
          ? `<div class="card-grid" data-section-cards style="display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:24px; margin-top:24px;">
              ${Array.from({
                length: Math.min((s.cards && s.cards.length) || 3, 6),
              })
                .map(
                  (
                    _,
                    ci
                  ) => `<article class="card" data-card-index="${ci}" style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:16px; box-shadow:0 2px 4px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:8px; cursor:grab;">
                  <h3 style="margin:0; font-size:16px;">${heading} Item ${
                    ci + 1
                  }</h3>
                  <p style="margin:0; font-size:14px; color:#475569;">Placeholder content derived from analysis for ${heading}.</p>
                  <button style="align-self:flex-start; background:#194a7a; color:#fff; border:none; padding:8px 16px; border-radius:4px; font-size:14px; cursor:pointer;">Action</button>
                </article>`
                )
                .join("\n")}
            </div>`
          : "";
        return `<${tag} data-section-index="${i}" data-section-type="${type}" style="padding:60px 20px; background:${
          i % 2 === 0 ? colorSurface : "#F8FAFC"
        };">
            <div class="container" style="max-width:1200px; margin:0 auto;">
              <h2 style="margin-top:0; font-size:clamp(20px,4vw,32px);">${heading}</h2>
              <p style="max-width:760px; line-height:1.5; font-size:16px; color:#475569;">Structural placeholder generated in strict mode to mirror analyzed site section “${heading}”.</p>
              ${cards}
            </div>
          </${tag}>`;
      })
      .join("\n\n");

    const html = `<!DOCTYPE html>
<html lang="en" data-generated="strict-scaffold">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title} – Structural Scaffold</title>
  <style>
    body { margin:0; font-family: 'Segoe UI', system-ui, sans-serif; background:${colorSurface}; color:#1e293b; }
    main { display:block; width:100%; }
    nav ul li a:hover { text-decoration:underline; }
    .card-grid .card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.08); transform:translateY(-2px); }
    .card { transition: box-shadow .2s ease, transform .2s ease; }
    button { font-weight:600; }
    @media (max-width: 640px) { nav ul { gap:12px; } }
  </style>
</head>
<body>
  ${navHTML}
  <main data-sections="${limitedSections.length}">
    ${
      sectionHTML ||
      '<section data-section-index="0" data-section-type="generic" style="padding:60px 20px;"><div class="container" style="max-width:1200px; margin:0 auto;"><h2>Content</h2><p>Placeholder section generated because the analyzer returned no explicit sections.</p></div></section>'
    }
  </main>
</body>
</html>`;
    return html;
  } catch (e) {
    console.warn("⚠️ Failed to build strict scaffold:", e.message);
    return null;
  }
}

// --- Button Readability Fixer ---
function fixButtonReadability(html) {
  console.log("🔧 Applying button readability fixes...");

  let fixedHtml = html;

  // Fix common button readability issues
  const buttonFixes = [
    // Fix buttons with poor contrast combinations
    {
      pattern: /background-color:\s*#0078d4[^;]*;[^}]*color:\s*#0078d4/gi,
      replacement: "background-color: #194a7a; color: #ffffff",
      description: "Blue on blue button text",
    },
    {
      pattern: /background:\s*#0078d4[^;]*;[^}]*color:\s*#0078d4/gi,
      replacement: "background: #194a7a; color: #ffffff",
      description: "Blue on blue button (shorthand)",
    },

    // Fix light text on light backgrounds
    {
      pattern:
        /background[^:]*:\s*#(?:fff|ffffff|f8f9fa|e9ecef)[^;]*;[^}]*color:\s*#(?:fff|ffffff|f8f9fa|e9ecef)/gi,
      replacement: "background-color: #194a7a; color: #ffffff",
      description: "Light text on light background",
    },

    // Fix buttons with insufficient opacity
    {
      pattern: /(\.button[^{]*{[^}]*opacity:\s*0\.[1-8][^}]*})/gi,
      replacement: (match) =>
        match.replace(/opacity:\s*0\.[1-8]/, "opacity: 1.0"),
      description: "Low opacity buttons",
    },

    // Fix Microsoft blue buttons to use accessible colors
    {
      pattern: /background[^:]*:\s*#0078d4/gi,
      replacement: "background-color: #194a7a",
      description: "Microsoft blue to accessible dark blue",
    },

    // Ensure button text is white on dark backgrounds
    {
      pattern:
        /(background[^:]*:\s*#(?:194a7a|476f95|005a9e|d13438|107c10)[^;]*;[^}]*color:\s*#)(?:000|333|194a7a|476f95)/gi,
      replacement: "$1ffffff",
      description: "Dark button backgrounds should have white text",
    },
  ];

  let fixesApplied = 0;
  buttonFixes.forEach((fix) => {
    const beforeLength = fixedHtml.length;
    if (typeof fix.replacement === "function") {
      fixedHtml = fixedHtml.replace(fix.pattern, fix.replacement);
    } else {
      fixedHtml = fixedHtml.replace(fix.pattern, fix.replacement);
    }
    const afterLength = fixedHtml.length;
    if (beforeLength !== afterLength) {
      fixesApplied++;
      console.log(`   ✓ Fixed: ${fix.description}`);
    }
  });

  // Add button hover states for better UX
  if (fixedHtml.includes(".button") && !fixedHtml.includes(".button:hover")) {
    const hoverCSS = `
        .button:hover, button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(25, 74, 122, 0.3);
        }
        .button:active, button:active {
          transform: translateY(0);
        }`;

    fixedHtml = fixedHtml.replace("</style>", hoverCSS + "\n    </style>");
    fixesApplied++;
    console.log("   ✓ Added button hover states");
  }

  console.log(`🎯 Applied ${fixesApplied} button readability fixes`);
  return fixedHtml;
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

    let {
      description,
      prompt, // legacy/alternate name
      theme,
      colorScheme,
      fastMode,
      includeAtlas = false,
      websiteAnalysis = null,
      strictMode = false,
    } = req.body || {};

    // Backwards compatibility: allow `prompt` if `description` absent
    if (!description && typeof prompt === "string" && prompt.trim().length) {
      description = prompt;
      console.log(
        "⚠️ Using legacy 'prompt' field as description (will be deprecated)."
      );
    }

    if (!description || !description.trim()) {
      context.res.status = 400;
      context.res.body = JSON.stringify({ error: "Description is required" });
      return;
    }

    console.log("🔍 Request contains website analysis:", !!websiteAnalysis);

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

    // STRICT MODE: deterministic scaffold bypassing AI creativity
    if (strictMode && websiteAnalysis) {
      console.log(
        "🚧 Strict mode active: building deterministic scaffold from analysis"
      );
      const scaffold = buildStrictScaffold(websiteAnalysis, {
        theme,
        colorScheme,
      });
      if (scaffold) {
        const processingTime = Date.now() - startTime;
        context.res.status = 200;
        context.res.body = {
          success: true,
          html: scaffold,
          metadata: {
            strictMode: true,
            deterministic: true,
            sections:
              (websiteAnalysis.layout &&
                websiteAnalysis.layout.sections &&
                websiteAnalysis.layout.sections.length) ||
              0,
            theme: theme || "professional",
            colorScheme: colorScheme || "blue",
            generatedAt: new Date().toISOString(),
            processingTimeMs: processingTime,
            descriptionPreview: description.substring(0, 200),
            promptVersion: "v2",
          },
        };
        return; // early return
      } else {
        console.log(
          "⚠️ Strict mode scaffold failed, falling back to AI generation"
        );
      }
    }

    // Generate base wireframe with website analysis if available (non-strict or fallback)

    // --- Prompt v2 Construction (tighter constraints) ---
    // We build a structured instruction block to reduce hallucinations and enforce layout fidelity.
    const promptVersion = "v2";

    // Normalize theme & colorScheme early for consistent interpolation
    const resolvedTheme = theme || "professional";
    const resolvedScheme = colorScheme || "blue";

    // Base deterministic instruction preamble
    const SYSTEM_PREAMBLE = `You are an expert UX wireframe generator. Produce a SINGLE, COMPLETE, SELF-CONTAINED HTML5 document (<!DOCTYPE html> ... </html>) with inline <style>. Do NOT include explanatory text before or after the HTML.`;

    // Hard constraints list (kept compact to control tokens)
    const HARD_RULES = [
      "Single full HTML document only",
      "Inline CSS only (no external fetches)",
      "No external scripts unless explicitly required",
      "Semantic HTML5 tags",
      "Accessible landmarks: header / nav / main / footer where appropriate",
      "Meaningful aria-* only when needed (avoid redundancy)",
      "Mobile-first responsive CSS (use flex or grid)",
      "Keep placeholder text concise (no large lorem blocks)",
      "No mock analytics / tracking code",
      "No base64 mega images (simple shapes / divs / short SVG only)",
      "Do not fabricate data beyond minimal illustrative placeholders",
      "If tables are used, provide <thead> and scope attributes",
      "Color palette must align with requested theme & scheme",
      "Avoid duplicate IDs",
      "All interactive elements must have discernible text",
      "Prefer CSS variables for key brand colors",
    ];

    // Build analysis-derived structural contract (safe guards)
    let analysisContract = "";
    if (websiteAnalysis && typeof websiteAnalysis === "object") {
      try {
        const sections = Array.isArray(websiteAnalysis?.layout?.sections)
          ? websiteAnalysis.layout.sections
          : [];
        const navLinks = Array.isArray(websiteAnalysis?.layout?.navigation)
          ? websiteAnalysis.layout.navigation
          : [];
        analysisContract += `\nSTRUCTURAL CONTRACT:\n`;
        if (sections.length) {
          analysisContract += `Sections (${sections.length}):\n`;
          sections.slice(0, 18).forEach((s, i) => {
            const tag = s.tag || s.type || "section";
            const label = (s.role || s.content || s.type || tag || "")
              .toString()
              .trim()
              .substring(0, 80);
            analysisContract += `${i + 1}. <${tag}> - ${label}\n`;
          });
        }
        if (navLinks.length) {
          analysisContract += `Navigation (${navLinks.length}):\n`;
          navLinks.slice(0, 12).forEach((l, i) => {
            const txt = (l.text || l.label || "link")
              .toString()
              .trim()
              .substring(0, 60);
            analysisContract += `- ${i + 1}. ${txt}\n`;
          });
        }
        if (!sections.length && !navLinks.length) {
          analysisContract += `No structural elements extracted; generate a logical, minimal hierarchy.\n`;
        }
      } catch (e) {
        console.log("⚠️ Failed to build analysis contract:", e.message);
      }
    }

    // Compose final prompt to model
    const FINAL_PROMPT = [
      SYSTEM_PREAMBLE,
      `PURPOSE: ${description.trim().substring(0, 500)}`,
      `THEME: ${resolvedTheme} | COLOR SCHEME: ${resolvedScheme}`,
      HARD_RULES.length ? `HARD RULES:\n- ${HARD_RULES.join("\n- ")}` : "",
      analysisContract,
      "OUTPUT FORMAT: Return ONLY the HTML document without backticks.",
    ]
      .filter(Boolean)
      .join("\n\n");

    // We replace the old basePrompt variable usage below by referencing FINAL_PROMPT.
    // (To minimize invasive refactor, we keep variable name basePrompt where referenced further down if needed.)
    const basePrompt = FINAL_PROMPT;
    let html = await generateWithAI(description, {
      theme,
      colorScheme,
      fastMode,
      websiteAnalysis,
      strictMode: false,
    });

    if (!html || !html.includes("<!DOCTYPE html>") || html.length < 500) {
      throw new Error("AI response insufficient or invalid");
    }

    // No automatic injections - clean wireframe generation
    console.log("✅ Clean wireframe generation without automatic injections");

    // Only apply Atlas components if explicitly requested
    if (includeAtlas) {
      html = addAtlasComponents(html, description);
    }

    // Only apply Fluent components if explicitly requested
    if (req.body?.includeFluent) {
      html = addFluentPlaybookComponents(html);
    }

    // 🎯 ALWAYS apply button readability fixes
    html = fixButtonReadability(html);

    // 🔧 Fix container nesting issues that prevent rearrangement
    html = fixContainerNesting(html);

    // 🛡️ Apply comprehensive accessibility validation
    const accessibilityMiddleware = new AccessibilityValidationMiddleware();
    const accessibilityResult = accessibilityMiddleware.validateAndFixWireframe(
      html,
      {
        enforceCompliance: true,
        logIssues: true,
      }
    );

    if (
      accessibilityResult &&
      accessibilityResult.content &&
      accessibilityResult.content !== html
    ) {
      html = accessibilityResult.content;
      console.log(
        `🔧 Applied accessibility fixes - was fixed: ${
          accessibilityResult.wasFixed || false
        }`
      );
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
        includeAtlas: includeAtlas === true,
        atlasComponents: atlasStats,
        generatedAt: new Date().toISOString(),
        processingTimeMs: processingTime,
        descriptionPreview: description.substring(0, 200),
        strictMode: false,
        promptVersion: "v2",
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
