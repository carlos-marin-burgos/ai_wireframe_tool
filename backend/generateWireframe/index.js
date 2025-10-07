// Unified Intelligent Wireframe Generator
// Purpose: Generate HTML wireframes via Azure OpenAI GPT-4o (Lovable-style approach)
// Optimized with component library and simplified prompts

const { OpenAI } = require("openai");
const { getComponentList } = require("../lib/componentLibrary");
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

// --- AI wireframe generation using Azure OpenAI GPT-4o (Lovable-style optimized) ---
async function generateWithAI(description, options = {}) {
  const theme = options.theme || "professional";
  const colorScheme = options.colorScheme || "blue";
  const websiteAnalysis = options.websiteAnalysis || null;
  const strictMode = options.strictMode === true;
  const fastMode = options.fastMode !== false; // Default to true if not specified

  // Use Azure OpenAI GPT-4o (you already have this configured!)
  if (!openai) {
    const initialized = initializeOpenAI();
    if (!initialized) {
      throw new Error(
        "Azure OpenAI is not initialized - check your configuration"
      );
    }
  }

  console.log("🚀 Using Azure OpenAI GPT-4o (Lovable-optimized approach)...");

  // Base prompt for wireframe generation
  let basePrompt = `Create a complete, modern HTML wireframe for: ${description}

REQUIREMENTS:
- Use modern CSS with flexbox/grid
- Include semantic HTML structure
- ${theme} theme with ${colorScheme} color scheme
- **FULLY RESPONSIVE mobile-first design (MANDATORY)**
- Include proper meta tags and DOCTYPE
- Use inline CSS for complete standalone file
- Focus ONLY on the requested component/feature
- NO navigation bars, headers, footers, or branding unless specifically requested
- Keep designs clean and minimal
- DO NOT include the description text anywhere in the visible wireframe content
- DO NOT add "Create a..." or similar instruction text in the HTML
- Generate ONLY the actual UI components requested, not meta-descriptions about them

🔥 CRITICAL RESPONSIVE DESIGN REQUIREMENTS (MANDATORY):
1. Mobile-First Approach:
   - Base styles for mobile (320px+)
   - Scale up for tablets and desktops
   - Use relative units (%, rem, em) instead of fixed pixels

2. Required Media Queries (MUST INCLUDE ALL):
   @media (max-width: 768px) {
     /* Tablet and mobile adjustments */
     - Single column layouts
     - Reduced font sizes
     - Full-width buttons
     - Simplified navigation
     - Stack flex/grid items vertically
   }
   
   @media (max-width: 480px) {
     /* Small mobile phones */
     - Smaller padding/margins
     - Larger tap targets (min 44px)
     - Hide/collapse non-essential elements
     - Simplified forms
   }

3. Flexible Containers:
   - Use max-width instead of fixed width
   - Add width: 100% for mobile
   - Use padding: 20px for breathing room
   - Box-sizing: border-box on all elements

4. Grid/Flex Responsive Patterns:
   - Grid: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
   - Flex: flex-wrap: wrap with appropriate breakpoints
   - Cards/widgets: full width on mobile, grid on desktop

5. Typography:
   - Responsive font sizes: clamp(1rem, 2.5vw, 1.5rem)
   - Line height 1.5+ for readability
   - Adjust heading sizes for mobile

6. Images & Media:
   - max-width: 100%; height: auto;
   - object-fit: cover for backgrounds

7. Forms:
   - Full width inputs on mobile
   - Stack labels above inputs
   - Large touch-friendly buttons

SPECIAL HANDLING FOR WIDGETS:
- When user asks for "widgets", generate them as direct <div class="widget"> elements, NOT nested section > article
- Widgets should be siblings in a grid/flex container, not wrapped in sections
- Each widget should be: <div class="widget" data-widget-index="n"> with title and content
- For left navigation layouts: use CSS flexbox with nav (fixed width) + main (flex: 1) structure
- Add responsive: @media (max-width: 768px) { body { flex-direction: column; } nav { width: 100%; position: relative; } main { width: 100%; } }`;

  // Enhanced prompt with website analysis data
  if (websiteAnalysis) {
    console.log(
      "🎯 Using website analysis data for enhanced wireframe generation"
    );

    basePrompt += `\n\n=== WEBSITE STRUCTURE ANALYSIS ===\n`;
    basePrompt += `Based on analysis of: ${websiteAnalysis.url}\n`;
    basePrompt += `Page Title: ${websiteAnalysis.pageInfo.title}\n\n`;

    // Include visual hierarchy information if available
    if (websiteAnalysis.layout?.visualHierarchy) {
      const vh = websiteAnalysis.layout.visualHierarchy;
      basePrompt += `VISUAL LAYOUT:\n`;
      basePrompt += `- Layout Type: ${vh.layout}\n`;
      basePrompt += `- Has Hero Section: ${vh.hasHero ? "Yes" : "No"}\n`;
      basePrompt += `- Has Sidebar: ${vh.hasSidebar ? "Yes" : "No"}\n`;
      if (vh.headerHeight > 0) {
        basePrompt += `- Header Height: ${vh.headerHeight}px\n`;
      }
      basePrompt += `\n`;
    }

    if (websiteAnalysis.layout?.sections?.length > 0) {
      basePrompt += `SECTIONS TO RECREATE (${websiteAnalysis.layout.sections.length} found):\n\n`;
      websiteAnalysis.layout.sections.slice(0, 12).forEach((section, index) => {
        // Use enhanced section data
        const sectionType = section.type
          ? section.type.toUpperCase()
          : "SECTION";
        const heading = section.heading || "Untitled Section";

        basePrompt += `${index + 1}. ${sectionType} - "${heading}"\n`;

        // Add the actual text content from the section
        if (section.text && section.text.trim().length > 0) {
          const cleanedText = section.text
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 200);
          basePrompt += `   Content: "${cleanedText}${
            section.text.length > 200 ? "..." : ""
          }"\n`;
        }

        // Add subheadings if available
        if (section.subheadings && section.subheadings.length > 0) {
          basePrompt += `   Subheadings: ${section.subheadings
            .slice(0, 3)
            .join(", ")}\n`;
        }

        // Add component information
        const components = [];
        if (section.counts?.buttons > 0)
          components.push(`${section.counts.buttons} buttons`);
        if (section.counts?.images > 0)
          components.push(`${section.counts.images} images`);
        if (section.counts?.links > 0)
          components.push(`${section.counts.links} links`);
        if (section.counts?.forms > 0)
          components.push(`${section.counts.forms} forms`);

        if (components.length > 0) {
          basePrompt += `   Elements: ${components.join(", ")}\n`;
        }

        // Add CTAs if present with EXACT button HTML
        if (section.ctas && section.ctas.length > 0) {
          basePrompt += `   Buttons to create:\n`;
          section.ctas.forEach((cta) => {
            basePrompt += `   <button style="padding: 12px 24px; border: 2px solid #999; background: #fff; color: #333; border-radius: 4px; font-size: 16px; cursor: pointer;">${cta}</button>\n`;
          });
        }

        basePrompt += `\n`;
      });
    }

    if (websiteAnalysis.layout?.navigation?.links?.length > 0) {
      const navLinks = websiteAnalysis.layout.navigation.links.slice(0, 8);
      basePrompt += `NAVIGATION STRUCTURE (${navLinks.length} main links):\n`;
      navLinks.forEach((link, index) => {
        basePrompt += `${index + 1}. ${link.text}\n`;
      });
      basePrompt += `\n`;
    }

    basePrompt += `LAYOUT REQUIREMENTS:\n`;
    basePrompt += `- Create EXACTLY ${websiteAnalysis.layout.sections.length} sections, one for each section listed above\n`;
    basePrompt += `- Use the ACTUAL content text provided for each section - don't make up placeholder text\n`;
    basePrompt += `- Use the ACTUAL button text from "Button Text" field - these are the real CTAs from the site\n`;
    basePrompt += `- Match the section TYPE (hero = large banner, features = cards/grid, content = text block)\n\n`;

    basePrompt += `🔴 CRITICAL HTML STRUCTURE - COPY THIS EXACTLY:\n`;
    basePrompt += `<style>\n`;
    basePrompt += `  * { margin: 0; padding: 0; box-sizing: border-box; }\n`;
    basePrompt += `  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n`;
    basePrompt += `  section { padding: 40px 20px; border-bottom: 1px solid #e0e0e0; }\n`;
    basePrompt += `  .hero { background: #f5f5f5; min-height: 300px; padding: 60px 20px; }\n`;
    basePrompt += `  .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding: 40px 20px; }\n`;
    basePrompt += `  .card { border: 1px solid #e0e0e0; padding: 24px; background: #fafafa; border-radius: 4px; }\n`;
    basePrompt += `  button, .btn { padding: 12px 24px; border: 2px solid #999; background: #fff; color: #333; border-radius: 4px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; }\n`;
    basePrompt += `  button:hover, .btn:hover { background: #f5f5f5; }\n`;
    basePrompt += `  h1 { font-size: 32px; margin-bottom: 16px; }\n`;
    basePrompt += `  h2 { font-size: 24px; margin-bottom: 12px; }\n`;
    basePrompt += `  p { margin-bottom: 16px; color: #666; }\n`;
    basePrompt += `</style>\n\n`;
    basePrompt += `Use this CSS in a <style> tag at the top. All sections MUST use these classes.\n`;
    basePrompt += `For feature cards, wrap them in: <div class="features"><div class="card">...</div></div>\n\n`;

    basePrompt += `🚨 BUTTONS - COPY THE EXACT HTML PROVIDED ABOVE:\n`;
    basePrompt += `I have provided the EXACT <button> HTML for each section above.\n`;
    basePrompt += `DO NOT create your own button HTML. COPY the <button> tags I provided character-for-character.\n`;
    basePrompt += `Each button already has all the inline styles needed. Just copy and paste them.\n\n`;

    basePrompt += `⚠️ VALIDATION: Generate exactly ${websiteAnalysis.layout.sections.length} sections with indexes 1 to ${websiteAnalysis.layout.sections.length}.\n\n`;
  }

  // DESIGNETICA-INSPIRED UNIVERSAL APPROACH (C.L.E.A.R. Framework)
  let lovablePrompt = basePrompt;

  // Semantic analysis of user PURPOSE and FUNCTIONALITY (like Designetica's C.L.E.A.R.)
  const requestAnalysis = {
    // Determine the primary interface type
    primaryType:
      /dashboard|analytics|admin|control panel|reporting|metrics|KPI|chart|graph/i.test(
        description
      )
        ? "dashboard"
        : /form|login|signup|register|contact|submit|input|field/i.test(
            description
          )
        ? "form"
        : /landing|homepage|marketing|hero|cta|feature|about/i.test(description)
        ? "landing"
        : /profile|account|settings|user|personal/i.test(description)
        ? "profile"
        : /list|table|grid|catalog|directory|browse|search/i.test(description)
        ? "listing"
        : /card|widget|component|module|section/i.test(description)
        ? "component"
        : /blog|article|content|news|post/i.test(description)
        ? "content"
        : "general",

    // Analyze complexity and functional needs
    complexity:
      description.length > 300
        ? "high"
        : description.length > 150
        ? "medium"
        : "simple",

    functionalNeeds: {
      navigation: /nav|menu|sidebar|header|breadcrumb|link/i.test(description),
      data: /data|table|list|api|database|fetch|load|content/i.test(
        description
      ),
      interaction:
        /button|click|drag|drop|hover|interactive|action|submit/i.test(
          description
        ),
      visual: /chart|graph|image|video|media|visualization/i.test(description),
      ecommerce: /shop|store|product|cart|checkout|payment|order/i.test(
        description
      ),
      responsive: /mobile|responsive|device|tablet|phone/i.test(description),
    },
  };

  // ADAPTIVE CONTEXT GENERATION (Designetica's adaptive approach)
  lovablePrompt += `\n\n🎯 DESIGNETICA-STYLE ANALYSIS:\n`;
  lovablePrompt += `Interface Type: ${requestAnalysis.primaryType.toUpperCase()}\n`;
  lovablePrompt += `Complexity Level: ${requestAnalysis.complexity}\n`;
  lovablePrompt += `Primary Goal: Understand what the user is trying to accomplish and create the most appropriate interface.\n\n`;

  // Add TYPE-SPECIFIC guidance (not rigid templates, but intelligent adaptation)
  switch (requestAnalysis.primaryType) {
    case "dashboard":
      lovablePrompt += `💼 DASHBOARD INTELLIGENCE: Create comprehensive data interfaces with navigation, metrics display, and interactive controls based on the specific business context.\n`;
      break;
    case "form":
      lovablePrompt += `📝 FORM INTELLIGENCE: Focus on clear user flow, proper validation, accessibility, and conversion optimization.\n`;
      break;
    case "landing":
      lovablePrompt += `🚀 LANDING INTELLIGENCE: Emphasize value proposition, visual hierarchy, social proof, and clear call-to-action flow.\n`;
      break;
    case "component":
      lovablePrompt += `🧩 COMPONENT INTELLIGENCE: Create focused, reusable elements that serve specific functions within larger interfaces.\n`;
      break;
    case "listing":
      lovablePrompt += `📋 LISTING INTELLIGENCE: Design for browsing, filtering, searching, and organizing content or data efficiently.\n`;
      break;
    default:
      lovablePrompt += `🎨 GENERAL INTELLIGENCE: Analyze the functional requirements and create the most appropriate interface pattern.\n`;
  }

  // Add FUNCTIONAL REQUIREMENTS based on detected needs
  if (Object.values(requestAnalysis.functionalNeeds).some((need) => need)) {
    lovablePrompt += `\nDetected Functional Needs:\n`;
    if (requestAnalysis.functionalNeeds.navigation)
      lovablePrompt += `- Navigation: Include appropriate navigation patterns\n`;
    if (requestAnalysis.functionalNeeds.data)
      lovablePrompt += `- Data Display: Create proper data presentation and organization\n`;
    if (requestAnalysis.functionalNeeds.interaction)
      lovablePrompt += `- Interactions: Include meaningful interactive elements\n`;
    if (requestAnalysis.functionalNeeds.visual)
      lovablePrompt += `- Visual Elements: Incorporate charts, media, or visual content\n`;
    if (requestAnalysis.functionalNeeds.ecommerce)
      lovablePrompt += `- E-commerce: Include shopping and transaction functionality\n`;
  }

  lovablePrompt += `\n`;

  // Replace original prompt block
  const prompt =
    lovablePrompt +
    `\n\n🧠 INTELLIGENT WIREFRAME GENERATION:\n- ANALYZE the user's request to understand the underlying PURPOSE and GOALS\n- THINK about what components and layout would best serve those goals\n- GENERATE appropriate HTML structure based on functional requirements, not templates\n- CONSIDER user experience and information architecture principles\n- CREATE realistic, professional layouts that make functional sense\n- INCLUDE necessary navigation, controls, and content areas based on the specific use case\n- APPLY proper visual hierarchy and spacing for the type of interface requested\n\n🚨 CRITICAL LAYOUT CONSTRAINTS:\n- ALL content MUST fit within the wireframe container boundaries - NO overflow outside main area\n- Use ONLY these CSS classes for dashboard layouts: .dashboard-layout, .dashboard-header, .dashboard-sidebar, .dashboard-main\n- For KPI cards: Use .kpi-grid container with .kpi-card children\n- For charts: Use .chart-container with .chart-placeholder inside\n- For data tables: Use .data-table-container with .data-table inside\n- Navigation: Use .sidebar-nav with proper <a> tags containing VISIBLE TEXT LABELS\n- NO custom CSS - only use the predefined classes from the styling system\n- Container hierarchy: wireframe-container > dashboard-layout > (header/sidebar/main)\n- NEVER create scrolling conflicts - only .dashboard-main should scroll if needed\n\n🎨 STYLING REQUIREMENTS:\n- Use Microsoft Design System principles with professional spacing and typography\n- High contrast accessibility: #194a7a buttons with white text, proper color contrast\n- Semantic HTML structure: header, nav, main, aside, section, article\n- ALL buttons MUST have visible text labels - NO icon-only buttons\n- Navigation links MUST have text content, not just icons\n- Use .sidebar-icon class for nav icons ALONGSIDE text labels\n- Clean container hierarchy: maximum 2-3 nesting levels\n- Professional spacing: 16px, 24px, 32px grid system\n\n${
      fastMode
        ? "- Focus on core functionality with clean, simple design"
        : "- Include rich interactions and sophisticated layout patterns"
    }\n\nIMPORTANT: Generate HTML that uses ONLY the CSS classes provided in the styling system. Do NOT create custom styles or classes. Return only the complete HTML code that will render properly within the wireframe container.`;

  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          'You are an expert UX/UI designer who creates wireframes that work perfectly within the Designetica wireframe system. You must follow specific constraints to ensure proper rendering.\n\n🚨 CRITICAL CONSTRAINTS:\n- ALL content MUST be contained within the existing wireframe container - NO elements should extend outside\n- Use ONLY the predefined CSS classes - do not create custom styles or classes\n- For dashboards: Start with <div class="dashboard-layout"> as the root container\n- Navigation text MUST be visible - every nav link needs readable text, not just icons\n- Buttons MUST have text labels - no icon-only buttons allowed\n- Container hierarchy: dashboard-layout > (dashboard-header + dashboard-sidebar + dashboard-main)\n- Only .dashboard-main should scroll - never create double scrollbars\n\n🏗️ REQUIRED DASHBOARD STRUCTURE:\n- Use .dashboard-layout as the main container\n- Header: .dashboard-header with logo, search, and user actions\n- Sidebar: .dashboard-sidebar with .sidebar-nav containing <a> links with text\n- Main: .dashboard-main with all content (KPI cards, charts, tables)\n- KPI Cards: .kpi-grid container with .kpi-card children\n- Charts: .chart-container with .chart-header and .chart-placeholder\n- Tables: .data-table-container with .data-table inside\n- Buttons: Use .action-btn class with visible text content\n\n🎨 STYLING RULES:\n- Use only predefined classes: .dashboard-*, .kpi-*, .chart-*, .data-table-*, .action-btn, etc.\n- All navigation links must have text content alongside any icons\n- Buttons must have descriptive text labels\n- Use semantic HTML: header, nav, main, aside, section, article\n- Apply accessibility principles with proper heading hierarchy\n\n💡 INTELLIGENT DESIGN:\n- Analyze the user\'s functional requirements\n- Create layouts that serve the actual user needs\n- Include appropriate components based on the request context\n- Apply professional UX patterns intelligently\n- Generate realistic, functional content\n\nGenerate clean HTML that uses ONLY the existing CSS classes and renders properly within the wireframe container boundaries.',
      },
      { role: "user", content: prompt },
    ],
    model: deployment,
    max_tokens:
      requestAnalysis.complexity === "high"
        ? 6000
        : requestAnalysis.complexity === "medium"
        ? 5000
        : 4000,
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
