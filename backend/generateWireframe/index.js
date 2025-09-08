const { OpenAI } = require("openai");
const {
  fluentCommunityLibrary,
  generateFluentWireframeHTML,
  analyzeDescriptionForComponents,
} = require("../fluent-community-library");

// Import missing dependencies
const AtlasComponentLibrary = require("../components/AtlasComponentLibrary");
const analyticsLogger = require("../utils/analytics-logger");
const { fixWireframeImages } = require("../utils/imagePlaceholders");

// Initialize Atlas Library
const atlasLibrary = new AtlasComponentLibrary();

// Logger utility
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error, data = {}) => {
    console.error(`[ERROR] ${message}`, error, data);
  },
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },
};

// Initialize OpenAI client
let openai = null;
let openaiInitializationAttempts = 0;
let lastOpenaiError = null;

function initializeOpenAI() {
  try {
    if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
      const apiVersion =
        process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: {
          "api-key": process.env.AZURE_OPENAI_KEY,
        },
      });

      console.log("✅ OpenAI client initialized successfully");
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
function createSimpleWireframe(description) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f3f2f1; 
            color: #171717; 
            line-height: 1.5; 
        }
        .header { 
            background: #0078d4; 
            color: white; 
            padding: 16px 24px; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
        }
        .logo { font-size: 20px; font-weight: 600; }
        .nav { display: flex; gap: 24px; }
        .nav a { color: white; text-decoration: none; }
        .main { 
            max-width: 1200px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .hero { 
            background: #E8E6DF; 
            color: #161616; 
            padding: 60px 40px; 
            border-radius: 8px; 
            margin-bottom: 40px; 
            text-align: center; 
        }
        .hero h1 { 
            font-size: 32px; 
            margin-bottom: 16px; 
            font-weight: 600; 
        }
        .hero p { font-size: 18px; margin-bottom: 24px; }
        .btn { 
            background: #0078d4; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            font-size: 16px; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
        }
        .content { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 24px; 
        }
        .card { 
            background: white; 
            padding: 24px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd; 
        }
        .card h3 { color: #0078d4; margin-bottom: 12px; }
        .footer { 
            background: #ffffff; 
            border-top: 1px solid #e1dfdd; 
            padding: 40px 24px; 
            margin-top: 60px; 
            text-align: center; 
            color: #737373; 
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">Microsoft Learn</div>
        <nav class="nav">
            <a href="#">Browse</a>
            <a href="#">Certifications</a>
            <a href="#">Documentation</a>
            <a href="#">Community</a>
        </nav>
    </header>
    
    <main class="main">
        <section class="hero">
            <h1>${description}</h1>
            <p>Learn, build, and grow with Microsoft technologies.</p>
            <a href="#" class="btn">Get Started</a>
        </section>
        
        <div class="content">
            <div class="card">
                <h3>Interactive Learning</h3>
                <p>Hands-on modules that teach through doing. Practice with real code and see immediate results.</p>
            </div>
            <div class="card">
                <h3>Expert Guidance</h3>
                <p>Learn from Microsoft experts and industry professionals with step-by-step guidance.</p>
            </div>
            <div class="card">
                <h3>Earn Recognition</h3>
                <p>Complete learning paths and earn badges to showcase your skills to the world.</p>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <p>© Microsoft Learn - AI Wireframe Generator</p>
    </footer>
</body>
</html>`;
}

// Generate wireframe with OpenAI
async function generateWireframeWithAI(description, theme = "microsoftlearn") {
  if (!openai) {
    console.log("OpenAI not available, using fallback");
    return null;
  }

  try {
    const prompt = `Create a complete HTML wireframe for Microsoft Learn platform based on: "${description}"

MANDATORY REQUIREMENTS - Microsoft Fluent Web Components:
- You MUST use Microsoft Fluent Web Components from @fluentui/web-components
- Include the CDN: <script type="module" src="https://unpkg.com/@fluentui/web-components"></script>
- Include Fluent design tokens: <link rel="stylesheet" href="https://res.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-core/11.0.0/css/fabric.min.css">

CRITICAL: ALWAYS USE THESE FLUENT COMPONENTS IN THE BODY (NO EXCEPTIONS):
- <fluent-button>Button Text</fluent-button> instead of <button> - NEVER use <button>
- <fluent-text-field type="text" placeholder="Text"></fluent-text-field> instead of <input type="text"> - NEVER use <input>
- <fluent-text-area placeholder="Text"></fluent-text-area> instead of <textarea> - NEVER use <textarea>
- <fluent-card>Card Content</fluent-card> for ANY content containers, module cards, product cards, info cards
- <fluent-progress value="50" max="100"></fluent-progress> for ALL progress indicators, progress bars, completion status
- <fluent-radio-group> and <fluent-radio> for radio buttons
- <fluent-checkbox>Label</fluent-checkbox> instead of <input type="checkbox">
- <fluent-select><fluent-option>Option</fluent-option></fluent-select> instead of <select> - NEVER use <select>
- <fluent-badge>Status</fluent-badge> for status indicators, labels, tags
- <fluent-divider></fluent-divider> for separators

🚫 NEVER use div class="card" or div class="progress" - ALWAYS use fluent-card and fluent-progress!
🚫 SYNTAX RULE: NEVER use self-closing syntax like <fluent-text-field />
✅ ALWAYS use proper closing tags: <fluent-text-field></fluent-text-field>

MANDATORY COMPONENT USAGE:
- For ANY cards, modules, containers → Use <fluent-card>
- For ANY progress bars, tracking, completion → Use <fluent-progress>
- For ANY buttons, actions → Use <fluent-button>
- For ANY input fields → Use <fluent-text-field>

VERIFICATION: Your response MUST contain fluent-card and fluent-progress when cards or progress are mentioned!

DESIGN REQUIREMENTS:
- Use Microsoft Learn design (Segoe UI font, #0078d4 primary color)
- Include responsive layout with header, main content, and footer
- Use semantic HTML structure with Fluent components
- Include proper Fluent design tokens and styling
- Make it professional and accessible
- RESPONSIVE: Desktop-first design (1024px+ = desktop, 768px+ = tablet, <768px = mobile)
- BUTTONS: All fluent-button elements MUST have visible text content (never empty)
- VIEWPORT: Always include <meta name="viewport" content="width=device-width, initial-scale=1.0">
- Include proper appearance attributes: appearance="accent|lightweight|stealth"

Generate ONLY the HTML code (starting with <!DOCTYPE html>) with mandatory Microsoft Fluent Web Components.

FINAL CHECK: Ensure your HTML body contains at least one <fluent-button>, <fluent-text-field>, or other Fluent component.`;

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert UI/UX designer creating HTML wireframes for Microsoft Learn platform.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    if (response?.choices?.[0]?.message?.content) {
      let html = response.choices[0].message.content.trim();

      // Clean up markdown formatting
      if (html.startsWith("```html")) {
        html = html.replace(/^```html\n?/, "").replace(/\n?```$/, "");
      } else if (html.startsWith("```")) {
        html = html.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");
      }

      return html;
    }

    return null;
  } catch (error) {
    console.error("AI generation failed:", error.message);
    return null;
  }
}

// CRITICAL: Verify OpenAI configuration immediately
function verifyOpenAIConfiguration() {
  const requiredEnvVars = [
    "AZURE_OPENAI_ENDPOINT",
    "AZURE_OPENAI_KEY",
    "AZURE_OPENAI_DEPLOYMENT",
    "AZURE_OPENAI_API_VERSION",
  ];

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    console.error("🚨 CRITICAL: Missing OpenAI configuration:", missing);
    console.error(
      "🔧 Please check your local.settings.json or environment variables"
    );
    return false;
  }

  console.log("✅ OpenAI Configuration Valid:");
  console.log(`   📡 Endpoint: ${process.env.AZURE_OPENAI_ENDPOINT}`);
  console.log(
    `   🔑 Key: ${process.env.AZURE_OPENAI_KEY?.substring(0, 10)}...`
  );
  console.log(`   🚀 Deployment: ${process.env.AZURE_OPENAI_DEPLOYMENT}`);
  return true;
}

// Run configuration check immediately
const isOpenAIConfigured = verifyOpenAIConfiguration();

// --- Fluent UI Component Conversion Function ---
function addFluentPlaybookComponents(html) {
  if (!html || typeof html !== "string") return html;

  console.log("🎨 Processing wireframe for Fluent Playbook components...");

  // ENHANCED Fluent UI Web Components CDN resources with cache busting
  const timestamp = Date.now();
  const fluentResources = `
    <link rel="stylesheet" href="https://unpkg.com/@fluentui/web-components/dist/fluent-design-system.css?v=${timestamp}">
    <script type="module" src="https://unpkg.com/@fluentui/web-components/dist/web-components.min.js?v=${timestamp}"></script>
    <script>
      // Force Fluent components to register immediately
      window.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 FLUENT COMPONENTS LOADING - Cache Bust: ${timestamp}');
        // Force re-register all Fluent components
        if (window.fluentDesignSystem) {
          console.log('✅ Fluent Design System is available');
        }
      });
    </script>
    <style>
      /* FORCE Fluent components to display properly */
      fluent-button, fluent-text-field, fluent-text-area, fluent-select, fluent-checkbox {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    </style>
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
  html = html.replace(
    /<input([^>]*type="checkbox"[^>]*)>/gi,
    "<fluent-checkbox$1></fluent-checkbox>"
  );
  html = html.replace(
    /<textarea([^>]*)>(.*?)<\/textarea>/gi,
    "<fluent-text-area$1>$2</fluent-text-area>"
  );

  console.log("✅ Fluent Playbook components injected successfully");
  return html;
}

// Import our advanced AI systems for context-aware generation
const { AdvancedPromptEngine } = require("../ai/advanced-prompt-engine");
const { EnhancedAIEngine } = require("../ai/enhanced-ai-engine");
const { AIContextManager } = require("../ai/ai-context-manager");

// Atlas Component Library is already imported and initialized above

/**
 * Post-process generated HTML to use existing hero component
 * instead of AI-generated hero sections
 */
function useExistingHeroComponent(html, description) {
  if (!html || typeof html !== "string") return html;

  // Check if this wireframe should have a hero section
  const heroKeywords = [
    "landing",
    "hero",
    "banner",
    "homepage",
    "main page",
    "welcome",
    "introduction",
    "featured",
    "showcase",
    "marketing",
    "promotional",
  ];
  const needsHero =
    heroKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    ) ||
    description.toLowerCase().includes("page") ||
    description.toLowerCase().includes("site") ||
    description.toLowerCase().includes("website");

  if (!needsHero) return html;

  // Extract title from description for hero
  const heroTitle =
    description.length > 50
      ? "Build your next great idea"
      : description.charAt(0).toUpperCase() + description.slice(1);

  const heroSubtitle =
    "Transform your vision into reality with Microsoft Learn's comprehensive resources and tools.";

  // Generate hero component using Atlas Component Library - ONLY source
  const existingHero = atlasLibrary.generateComponent("hero-section", {
    title: heroTitle,
    subtitle: heroSubtitle,
    ctaText: "Get Started",
  });

  // Find and replace any existing hero/banner sections with our component
  // Look for common hero section patterns
  const heroPatterns = [
    /<section[^>]*class="[^"]*hero[^"]*"[^>]*>.*?<\/section>/gis,
    /<header[^>]*class="[^"]*hero[^"]*"[^>]*>.*?<\/header>/gis,
    /<div[^>]*class="[^"]*hero[^"]*"[^>]*>.*?<\/div>/gis,
    /<section[^>]*hero[^>]*>.*?<\/section>/gis,
    /<div[^>]*style="[^"]*background[^"]*linear-gradient[^"]*"[^>]*>.*?<\/div>/gis,
    /<section[^>]*style="[^"]*background[^"]*#[0-9a-fA-F]{6}[^"]*"[^>]*>.*?<\/section>/gis,
  ];

  let processedHtml = html;
  let heroReplaced = false;

  // Try to replace each hero pattern
  for (const pattern of heroPatterns) {
    if (pattern.test(processedHtml)) {
      processedHtml = processedHtml.replace(pattern, existingHero);
      heroReplaced = true;
      break; // Only replace the first hero section found
    }
  }

  // If no hero was found but one is needed, insert after the nav
  if (!heroReplaced) {
    const navEndIndex = processedHtml.indexOf("</header>");
    if (navEndIndex !== -1) {
      const insertPoint = navEndIndex + "</header>".length;
      processedHtml =
        processedHtml.slice(0, insertPoint) +
        "\n" +
        existingHero +
        "\n" +
        processedHtml.slice(insertPoint);
    }
  }

  return processedHtml;
}

// Import our template system - wrapped in try/catch for production
let createFallbackWireframe = null;
let createInlineFallbackTemplate = null;
try {
  const fallbackGenerator = require("../fallback-generator");
  createFallbackWireframe = fallbackGenerator.createFallbackWireframe;
  createInlineFallbackTemplate = fallbackGenerator.createInlineFallbackTemplate;
} catch (error) {
  console.log("Fallback generator not found, using simple fallback");
  createFallbackWireframe = (context, requirements) => {
    return `
      <div class="wireframe-container">
        <header class="hero-section">
          <h1>Welcome to ${context}</h1>
          <p>Professional solution based on: ${requirements}</p>
        </header>
        <main class="content-area">
          <section class="features">
            <h2>Key Features</h2>
            <div class="feature-grid">
              <div class="feature">Feature 1</div>
              <div class="feature">Feature 2</div>
              <div class="feature">Feature 3</div>
            </div>
          </section>
        </main>
        <footer>
          <p>Contact us for more information</p>
        </footer>
      </div>
    `;
  };
}

// Initialize advanced AI systems for context-aware generation
const promptEngine = new AdvancedPromptEngine();
const aiEngine = new EnhancedAIEngine();
const contextManager = new AIContextManager();

// Azure OpenAI configuration with fallback handling
function initializeOpenAI() {
  try {
    openaiInitializationAttempts++;
    console.log(
      `🔧 initializeOpenAI called (attempt #${openaiInitializationAttempts})`
    );

    // Check if OpenAI is disabled via environment variable
    if (process.env.DISABLE_OPENAI === "true") {
      console.log("🚫 OpenAI disabled via DISABLE_OPENAI environment variable");
      return false;
    }

    // Log all environment variables for debugging
    console.log("🔍 Environment variables check:");
    console.log("  AZURE_OPENAI_KEY:", !!process.env.AZURE_OPENAI_KEY);
    console.log("  AZURE_OPENAI_ENDPOINT:", process.env.AZURE_OPENAI_ENDPOINT);
    console.log(
      "  AZURE_OPENAI_DEPLOYMENT:",
      process.env.AZURE_OPENAI_DEPLOYMENT
    );
    console.log(
      "  AZURE_OPENAI_API_VERSION:",
      process.env.AZURE_OPENAI_API_VERSION
    );

    // Only initialize if we have the required environment variables
    if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      console.log(
        "✅ Required environment variables found, initializing OpenAI..."
      );

      const { OpenAI } = require("openai");

      // Ensure endpoint format is correct for Azure OpenAI
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, ""); // Remove trailing slash
      const deployment =
        process.env.AZURE_OPENAI_DEPLOYMENT || "designetica-gpt4o";
      const apiVersion =
        process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

      console.log("🔧 Creating OpenAI client with:");
      console.log("  endpoint:", endpoint);
      console.log("  deployment:", deployment);
      console.log("  apiVersion:", apiVersion);
      console.log("  baseURL:", `${endpoint}/openai/deployments/${deployment}`);

      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: {
          "api-key": process.env.AZURE_OPENAI_KEY,
        },
      });

      console.log("🤖 OpenAI client initialized successfully");
      logger.info("🤖 OpenAI client initialized successfully", {
        endpoint: endpoint,
        deployment: deployment,
        apiVersion: apiVersion,
        keyPresent: !!process.env.AZURE_OPENAI_KEY,
        attempt: openaiInitializationAttempts,
      });

      // Clear any previous errors
      lastOpenaiError = null;
      return true;
    } else {
      console.log("⚠️ Missing required environment variables:");
      console.log("  AZURE_OPENAI_KEY missing:", !process.env.AZURE_OPENAI_KEY);
      console.log(
        "  AZURE_OPENAI_ENDPOINT missing:",
        !process.env.AZURE_OPENAI_ENDPOINT
      );

      logger.warn(
        "⚠️ OpenAI environment variables not found, using pattern-based generation"
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI client:", error);
    logger.error("❌ Failed to initialize OpenAI client", error, {
      attempt: openaiInitializationAttempts,
      errorType: error.name,
      errorMessage: error.message,
    });

    // Store the error for health checks
    lastOpenaiError = {
      message: error.message,
      type: error.name,
      timestamp: new Date().toISOString(),
      attempt: openaiInitializationAttempts,
    };

    openai = null;
    return false;
  }
}

// Create wireframe prompt for OpenAI
function createWireframePrompt(
  description,
  style = "default",
  colorScheme = "primary"
) {
  // Get the official site header from Atlas Component Library - ONLY source for components
  const officialSiteHeader = atlasLibrary.generateComponent("site-header");

  const basePrompt = `You are an expert UI/UX designer creating HTML wireframes for Microsoft Learn platform using AI-powered Fluent UI Web Components.

Create a complete, responsive HTML wireframe based on this description: "${description}"

MANDATORY FLUENT UI WEB COMPONENTS REQUIREMENTS:
- MUST use Microsoft Fluent UI Web Components from @fluentui/web-components
- Include the CDN: <script type="module" src="https://unpkg.com/@fluentui/web-components"></script>
- MUST use Fluent components instead of regular HTML:
  * <fluent-button> instead of <button>
  * <fluent-text-field> instead of <input type="text">
  * <fluent-text-area> instead of <textarea>
  * <fluent-card> for content containers
  * <fluent-anchor> instead of <a>
  * <fluent-radio-group> and <fluent-radio> for radio buttons
  * <fluent-checkbox> instead of <input type="checkbox">
  * <fluent-select> and <fluent-option> instead of <select>
  * <fluent-progress> for progress indicators
  * <fluent-badge> for status indicators
  * <fluent-divider> for separators

FLUENT DESIGN REQUIREMENTS:
- Use appearance attributes: appearance="accent", appearance="lightweight", appearance="stealth"
- Include proper Fluent Design System CSS variables
- Use Microsoft Learn design system (Segoe UI font, #0078d4 primary color)
- Include proper semantic HTML structure with Fluent components
- Make it responsive and accessible
- Professional Microsoft Learn aesthetic

CRITICAL REQUIREMENTS:
- MANDATORY: Use ONLY the provided official Microsoft Learn site header below - DO NOT generate your own
- MANDATORY: DO NOT create any custom CSS for any header elements - use the provided header exactly as-is
- MANDATORY: DO NOT generate any <header> tags or header CSS - the site header is already provided
- The site header is already styled - just use it as the first body element
- Add minimal CSS for Fluent component styling and layout only
- Use Microsoft Learn color palette: #0078d4 (primary), #f3f2f1 (background), #171717 (text)
- For hero sections, banners, and footers use tan background: #E8E6DF (no blue backgrounds!)
- Use tan (#E8E6DF) for card backgrounds and section backgrounds instead of blue

MANDATORY SITE HEADER - USE EXACTLY AS PROVIDED:
The wireframe MUST start with this exact official Microsoft Learn site header (DO NOT MODIFY):

${officialSiteHeader}

FLUENT COMPONENT EXAMPLES:
- Navigation: <fluent-anchor href="#link">Link Text</fluent-anchor>
- Buttons: <fluent-button appearance="accent">Primary</fluent-button>
- Cards: <fluent-card><h3>Card Title</h3><p>Card content</p></fluent-card>
- Forms: <fluent-text-field placeholder="Enter text"></fluent-text-field>
- Layout: Use CSS Grid and Flexbox with Fluent components

FLUENT BUTTON STYLING:
- Primary: <fluent-button appearance="accent">Text</fluent-button>
- Secondary: <fluent-button appearance="lightweight">Text</fluent-button>
- Subtle: <fluent-button appearance="stealth">Text</fluent-button>

IMPORTANT: 
- DO NOT create CSS for .site-header, .site-header-logo, or any header classes
- DO NOT generate your own header - use the provided one exactly
- DO NOT create any <header> tags in your HTML
- The header above is complete and styled - just place it at the start of <body>
- Focus your CSS on Fluent component styling and layout only
- After the provided site header, start with <main> containing Fluent components

FLUENT COMPONENT REQUIREMENTS:
- All interactive elements MUST use Fluent UI Web Components
- Primary buttons: <fluent-button appearance="accent">Button Text</fluent-button>
- Secondary buttons: <fluent-button appearance="lightweight">Button Text</fluent-button>
- Text inputs: <fluent-text-field placeholder="Enter text"></fluent-text-field>
- Links: <fluent-anchor href="#url">Link Text</fluent-anchor>
- Cards: <fluent-card>Content</fluent-card>
- Include Fluent initialization script at the end

Generate ONLY the complete HTML code with mandatory Fluent UI Web Components (starting with <!DOCTYPE html> and ending with </html>). No explanations or markdown formatting. DO NOT include any <header> tags or header-related CSS in your response.`;

  return basePrompt;
}

// Create wireframe prompt based on image analysis results
function createImageBasedWireframePrompt(
  imageAnalysis,
  colorScheme = "primary"
) {
  // Get the official site header from Atlas Component Library
  const officialSiteHeader = atlasLibrary.generateComponent("site-header");

  const { components, layout, designTokens, wireframeDescription, confidence } =
    imageAnalysis;

  // Build component descriptions
  const componentDescriptions = components
    .map((comp) => {
      const pos = comp.bounds
        ? `at position ${comp.bounds.x}%, ${comp.bounds.y}%`
        : "";
      const text = comp.text ? `with text "${comp.text}"` : "";
      const style = comp.properties
        ? `styled as ${JSON.stringify(comp.properties)}`
        : "";
      return `- ${comp.type} ${pos} ${text} ${style}`.trim();
    })
    .join("\n");

  const basePrompt = `You are an expert UI/UX designer creating HTML wireframes that EXACTLY match uploaded images.

Create a complete, responsive HTML wireframe that recreates the EXACT layout and components from this analyzed image:

IMAGE ANALYSIS RESULTS:
Overall Description: ${wireframeDescription}
Confidence: ${confidence}

DETECTED COMPONENTS:
${componentDescriptions}

LAYOUT STRUCTURE:
- Type: ${layout.type}
- Columns: ${layout.columns || "auto"}
- Sections: ${layout.sections?.join(", ") || "main"}

DESIGN TOKENS FROM IMAGE:
- Colors: ${designTokens.colors?.join(", ") || "#0078d4, #ffffff"}
- Fonts: ${designTokens.fonts?.join(", ") || "Segoe UI"}
- Spacing: ${designTokens.spacing?.join("px, ") || "16, 24, 32"}px

CRITICAL REQUIREMENTS:
- MANDATORY: Use Microsoft Fluent Web Components from @fluentui/web-components
- Include CDN: <script type="module" src="https://unpkg.com/@fluentui/web-components"></script>
- Include design tokens: <link rel="stylesheet" href="https://res.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-core/11.0.0/css/fabric.min.css">
- MANDATORY: Use ONLY the provided official Microsoft Learn site header below
- RECREATE the EXACT layout structure detected in the image using Fluent components
- REPLACE detected HTML elements with Fluent equivalents:
  * buttons → <fluent-button>
  * text inputs → <fluent-text-field>
  * checkboxes → <fluent-checkbox>
  * dropdowns → <fluent-select>
  * cards/containers → <fluent-card>
- PLACE Fluent components in their EXACT positions as detected
- USE the detected colors and styling from the image analysis
- MATCH the component types and text content exactly as analyzed
- MAINTAIN the same visual hierarchy and spacing patterns
- Include proper semantic HTML structure with Fluent components
- Make it responsive and accessible

MANDATORY SITE HEADER - USE EXACTLY AS PROVIDED:
${officialSiteHeader}

RECREATION INSTRUCTIONS:
1. Include Microsoft Fluent Web Components CDN and design tokens
2. Start with the provided site header (DO NOT MODIFY)
3. Recreate the exact layout type: ${layout.type} using Fluent components
4. Replace detected components with Fluent equivalents (buttons→fluent-button, inputs→fluent-text-field, etc.)
5. Place each Fluent component in its detected position
6. Use the detected colors: ${designTokens.colors?.slice(0, 3).join(", ")}
7. Match the text content exactly as detected
8. Maintain the same visual proportions and spacing

TARGET: Create a wireframe that looks EXACTLY like the uploaded image but using clean HTML/CSS code.

Generate ONLY the complete HTML code (starting with <!DOCTYPE html> and ending with </html>). No explanations or markdown formatting.`;

  return basePrompt;
}

// Generate wireframe from image analysis using OpenAI
async function generateWireframeFromImageAnalysis(
  imageAnalysis,
  colorScheme = "primary",
  correlationId
) {
  try {
    if (!openai) {
      logger.warn("🔄 OpenAI client not available for image-based generation", {
        correlationId,
      });
      return null;
    }

    logger.info("📸 Generating wireframe from image analysis", {
      correlationId,
      componentsCount: imageAnalysis.components?.length || 0,
      layoutType: imageAnalysis.layout?.type,
      confidence: imageAnalysis.confidence,
    });

    // Create specialized prompt for image-based wireframe
    const imagePrompt = createImageBasedWireframePrompt(
      imageAnalysis,
      colorScheme
    );

    // Call OpenAI with image analysis context
    const startTime = Date.now();
    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "designetica-gpt4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert UI recreator who converts image analysis data into pixel-perfect HTML wireframes. You excel at matching layouts, positioning, and styling from visual analysis data.",
          },
          {
            role: "user",
            content: imagePrompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.3, // Lower temperature for more accurate recreation
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Image wireframe generation timeout")),
          35000
        )
      ),
    ]);

    const processingTime = Date.now() - startTime;

    if (response?.choices?.[0]?.message?.content) {
      let html = response.choices[0].message.content.trim();

      // Clean up any markdown formatting
      if (html.startsWith("```html")) {
        html = html.replace(/^```html\n?/, "").replace(/\n?```$/, "");
      } else if (html.startsWith("```")) {
        html = html.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");
      }

      // Validate HTML response
      if (html.includes("<!DOCTYPE html>") && html.includes("</html>")) {
        logger.info("✅ Image-based wireframe generated successfully", {
          correlationId,
          processingTimeMs: processingTime,
          htmlLength: html.length,
          confidence: imageAnalysis.confidence,
        });
        return html;
      } else {
        logger.warn("⚠️ Invalid HTML format from image-based generation", {
          correlationId,
        });
        return null;
      }
    } else {
      logger.warn("⚠️ No response from image-based generation", {
        correlationId,
      });
      return null;
    }
  } catch (error) {
    logger.error("❌ Image-based wireframe generation failed", error, {
      correlationId,
      errorType: error.name,
      errorMessage: error.message,
    });
    return null;
  }
}

// Generate wireframe using OpenAI with robust error handling
async function generateWireframeWithOpenAI(
  description,
  colorScheme = "primary",
  correlationId,
  sessionId = null,
  generationContext = null
) {
  try {
    if (!openai) {
      logger.warn(
        "🔄 OpenAI client not available, falling back to pattern-based generation",
        { correlationId }
      );
      return null;
    }

    logger.info("� Generating context-aware wireframe", {
      correlationId,
      description: description.substring(0, 50) + "...",
      colorScheme,
      hasContext: !!generationContext,
      historyLength: generationContext?.recentHistory?.length || 0,
    });

    // Use advanced AI engine for comprehensive analysis
    const designAnalysis = await aiEngine.analyzeDesignIntent(description);

    // Generate sophisticated context-aware prompt
    const advancedPrompt = promptEngine.generateAdvancedPrompt({
      description,
      context: generationContext,
      designAnalysis,
      designTheme: "microsoftlearn",
      colorScheme,
      qualityTargets: {
        targetAccessibility: 0.95,
        targetPerformance: 0.9,
        targetResponsive: 0.95,
      },
    });

    logger.info("🎯 Advanced prompt generated with context", {
      correlationId,
      promptLength: advancedPrompt.length,
      designComplexity: designAnalysis.designComplexity,
      recommendedComponents: designAnalysis.recommendedComponents?.length || 0,
    });

    // Call OpenAI with advanced context-aware prompt
    const startTime = Date.now();
    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "designetica-gpt4o",
        messages: [
          {
            role: "system",
            content:
              "You are a world-class Senior Frontend Architect and UX Designer with 15+ years of experience creating production-ready, accessible interfaces that exceed industry standards.",
          },
          {
            role: "user",
            content: advancedPrompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
      // 30 second timeout for complex wireframes
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("OpenAI request timeout")), 30000)
      ),
    ]);

    const openaiTime = Date.now() - startTime;

    if (response?.choices?.[0]?.message?.content) {
      let html = response.choices[0].message.content.trim();

      // Clean up any markdown formatting from AI response
      if (html.startsWith("```html")) {
        html = html.replace(/^```html\n?/, "").replace(/\n?```$/, "");
      } else if (html.startsWith("```")) {
        html = html.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");
      }

      // Enhanced validation of HTML response
      // Accept both complete documents and HTML fragments
      const hasDoctype =
        html.includes("<!DOCTYPE html>") && html.includes("</html>");
      const isValidFragment =
        html.includes("<") && html.includes(">") && html.length > 10;

      if (hasDoctype || isValidFragment) {
        // If it's a fragment, wrap it in a complete HTML document
        if (!hasDoctype && isValidFragment) {
          html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif;
            margin: 40px;
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
        }

        logger.info("✅ OpenAI wireframe generated successfully", {
          correlationId,
          openaiTimeMs: openaiTime,
          htmlLength: html.length,
          wasFragment: !hasDoctype,
        });
        return html;
      } else {
        logger.warn("⚠️ OpenAI returned invalid HTML format", {
          correlationId,
          htmlContent: html.substring(0, 200),
        });
        return null;
      }
    } else {
      logger.warn("⚠️ OpenAI returned empty response", { correlationId });
      return null;
    }
  } catch (error) {
    // Handle specific error types
    if (error.status === 401) {
      logger.error(
        "🔐 OpenAI authentication failed - API key may be invalid or expired",
        error,
        { correlationId }
      );
      // Disable OpenAI for subsequent requests to avoid repeated failures
      openai = null;
    } else if (error.status === 404) {
      logger.error(
        "🔍 OpenAI deployment not found - check deployment name",
        error,
        { correlationId }
      );
      openai = null;
    } else if (error.message?.includes("timeout")) {
      logger.error("⏰ OpenAI request timed out", error, { correlationId });
    } else {
      logger.error("❌ OpenAI wireframe generation failed", error, {
        correlationId,
        errorType: error.name,
        errorMessage: error.message,
        errorStatus: error.status,
      });
    }
    return null;
  }
}

// Smart wireframe generator with AI-first approach - ALWAYS prioritize AI
async function generateWireframeFromDescription(
  description,
  colorScheme,
  correlationId,
  sessionId = null,
  generationContext = null
) {
  try {
    // ABSOLUTE PRIORITY 1: OpenAI with multiple retry attempts
    if (openai) {
      logger.info(
        "🤖 AI-FIRST APPROACH: Attempting OpenAI generation with retries",
        {
          correlationId,
          hasContext: !!generationContext,
          contextHistory: generationContext?.recentHistory?.length || 0,
          description: description.substring(0, 100) + "...",
        }
      );

      // Try AI with up to 3 attempts for robustness
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          logger.info(`🎯 AI Attempt ${attempt}/3`, { correlationId });
          const aiHtml = await generateWireframeWithOpenAI(
            description,
            colorScheme,
            correlationId,
            sessionId,
            generationContext
          );

          if (aiHtml && aiHtml.length > 500) {
            // Ensure we got substantial content
            logger.info("✅ SUCCESS: AI-generated wireframe created", {
              correlationId,
              attempt,
              contentLength: aiHtml.length,
              hasDoctype: aiHtml.includes("<!DOCTYPE html>"),
            });

            // Post-process to use existing hero component instead of AI-generated heroes
            const processedHtml = useExistingHeroComponent(aiHtml, description);

            // Record successful AI interaction
            if (sessionId && generationContext !== null) {
              contextManager.addDesignInteraction(sessionId, {
                description,
                generationMethod: "openai_context_aware",
                success: true,
                attempt,
                qualityMetrics: {
                  hasValidHTML: processedHtml.includes("<!DOCTYPE html>"),
                  contentLength: processedHtml.length,
                  hasComponents: processedHtml.includes("class="),
                  usesExistingHero: processedHtml.includes("ms-learn-hero"),
                },
              });
            }

            return {
              html: processedHtml,
              source: "openai-context-aware",
              aiGenerated: true,
              attempt,
            };
          } else {
            logger.warn(
              `⚠️ AI attempt ${attempt} produced insufficient content`,
              {
                correlationId,
                contentLength: aiHtml?.length || 0,
              }
            );
          }
        } catch (aiError) {
          logger.warn(`🔄 AI attempt ${attempt} failed:`, aiError.message, {
            correlationId,
          });
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Progressive delay
          }
        }
      }

      logger.error("❌ ALL AI ATTEMPTS FAILED - This should be rare!", {
        correlationId,
      });
    } else {
      logger.error(
        "🚫 CRITICAL: OpenAI client not initialized - Check configuration!",
        { correlationId }
      );
    }

    // EMERGENCY FALLBACK ONLY: Templates when AI completely fails
    logger.warn(
      "🚨 EMERGENCY FALLBACK: Using templates (AI failed completely)",
      {
        correlationId,
        description: description.substring(0, 50) + "...",
        reason: "All AI attempts exhausted",
      }
    );

    try {
      const templateHtml = createFallbackWireframe(
        description,
        "microsoftlearn",
        colorScheme
      );

      // Only use templates as absolute last resort
      if (templateHtml && templateHtml.length > 5000) {
        logger.warn("⚠️ FALLBACK: Using template (AI unavailable)", {
          correlationId,
          templateLength: templateHtml.length,
          reason: "AI completely failed",
        });

        // Post-process fallback template to use existing hero component
        const processedTemplateHtml = useExistingHeroComponent(
          templateHtml,
          description
        );

        // Record that we had to use fallback
        if (sessionId && generationContext !== null) {
          contextManager.addDesignInteraction(sessionId, {
            description,
            generationMethod: "emergency_template",
            success: false,
            fallbackReason: "ai_completely_failed",
          });
        }

        return {
          html: processedTemplateHtml,
          source: "emergency-template",
          aiGenerated: false,
          warning: "AI failed - using template fallback",
        };
      }
    } catch (templateError) {
      logger.error("💥 Even template fallback failed!", templateError, {
        correlationId,
      });
    }

    // Fallback to pattern-based generation
    logger.info("🔧 Using pattern-based wireframe generation", {
      correlationId,
    });
    const desc = description.toLowerCase();

    // Check for common wireframe patterns
    if (
      desc.includes("form") ||
      desc.includes("textbox") ||
      desc.includes("input") ||
      desc.includes("submit")
    ) {
      // Use Atlas Component Library for form components - ONLY source
      const formHtml = generateFormWireframeFromAtlas(description, colorScheme);
      return {
        html: useExistingHeroComponent(formHtml, description),
        source: "pattern-form-atlas",
        aiGenerated: false,
      };
    } else if (
      desc.includes("dashboard") ||
      desc.includes("chart") ||
      desc.includes("analytics")
    ) {
      const dashboardHtml = generateDashboardWireframe(
        description,
        colorScheme
      );
      return {
        html: useExistingHeroComponent(dashboardHtml, description),
        source: "pattern-dashboard",
        aiGenerated: false,
      };
    } else if (
      desc.includes("landing") ||
      desc.includes("hero") ||
      desc.includes("marketing")
    ) {
      const landingHtml = generateLandingWireframe(description, colorScheme);
      return {
        html: useExistingHeroComponent(landingHtml, description),
        source: "pattern-landing",
        aiGenerated: false,
      };
    } else if (
      desc.includes("blog") ||
      desc.includes("article") ||
      desc.includes("content")
    ) {
      const contentHtml = generateContentWireframe(description, colorScheme);
      return {
        html: useExistingHeroComponent(contentHtml, description),
        source: "pattern-content",
        aiGenerated: false,
      };
    } else {
      // Use the enhanced fallback template with Microsoft Learn navigation
      const fallbackHtml = createInlineFallbackTemplate
        ? createInlineFallbackTemplate(
            description,
            "microsoftlearn",
            colorScheme
          )
        : createSimpleFallback(description, colorScheme);
      return {
        html: useExistingHeroComponent(fallbackHtml, description),
        source: "pattern-generic",
        aiGenerated: false,
      };
    }
  } catch (error) {
    logger.error(
      "💥 Error in wireframe generation, using emergency fallback",
      error,
      { correlationId }
    );
    const emergencyHtml = createInlineFallbackTemplate
      ? createInlineFallbackTemplate(
          "Emergency fallback",
          "microsoftlearn",
          colorScheme
        )
      : createSimpleFallback("Emergency fallback", colorScheme);
    return {
      html: useExistingHeroComponent(emergencyHtml, description),
      source: "emergency-fallback",
      aiGenerated: false,
    };
  }
}

// Generate form wireframe using ONLY Atlas Component Library
function generateFormWireframeFromAtlas(description, colorScheme) {
  const siteHeader = atlasLibrary.generateComponent("site-header");
  const container = atlasLibrary.generateComponent("container", {
    content: `
      ${atlasLibrary.generateComponent("heading", {
        text: "Contact Form",
        level: 1,
      })}
      ${atlasLibrary.generateComponent("paragraph", {
        text: "Please fill out the form below to get in touch with us.",
      })}
      ${atlasLibrary.generateComponent("input-field", {
        label: "Name",
        placeholder: "Enter your full name",
      })}
      ${atlasLibrary.generateComponent("input-field", {
        label: "Email",
        placeholder: "Enter your email address",
        type: "email",
      })}
      ${atlasLibrary.generateComponent("textarea-field", {
        label: "Message",
        placeholder: "Enter your message here",
        rows: 5,
      })}
      ${atlasLibrary.generateComponent("primary-button", {
        text: "Send Message",
      })}
    `,
  });
  const footer = atlasLibrary.generateComponent("footer");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form - Microsoft Learn</title>
</head>
<body>
    ${siteHeader}
    ${container}
    ${footer}
</body>
</html>`;
}

// Generate form wireframe based on description
function generateFormWireframe(description, colorScheme) {
  const desc = description.toLowerCase();

  // Extract specific number mentioned
  const numberMatch = desc.match(/(\d+)\s*(textbox|input|field)/);
  const requestedCount = numberMatch ? parseInt(numberMatch[1]) : 1;

  // Extract form details from description
  const hasName = desc.includes("name");
  const hasEmail = desc.includes("email");
  const hasPhone = desc.includes("phone");
  const hasMessage = desc.includes("message") || desc.includes("comment");
  const hasPassword = desc.includes("password");
  const hasAddress = desc.includes("address");

  let formFields = "";
  let fieldCount = 0;

  // Add fields based on specific requests or fill up to requested count
  if (hasName || (fieldCount < requestedCount && !hasEmail && !hasPhone)) {
    formFields += `
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" class="form-control" placeholder="Enter your name">
            </div>`;
    fieldCount++;
  }

  if (hasEmail || fieldCount < requestedCount) {
    formFields += `
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email">
            </div>`;
    fieldCount++;
  }

  if (hasPhone || fieldCount < requestedCount) {
    formFields += `
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" class="form-control" placeholder="Enter your phone">
            </div>`;
    fieldCount++;
  }

  // Add generic fields if we still need more to reach requested count
  while (fieldCount < requestedCount) {
    const fieldNum = fieldCount + 1;
    formFields += `
            <div class="form-group">
                <label for="field${fieldNum}">Field ${fieldNum}</label>
                <input type="text" id="field${fieldNum}" name="field${fieldNum}" class="form-control" placeholder="Enter text for field ${fieldNum}">
            </div>`;
    fieldCount++;
  }

  if (hasPassword) {
    formFields += `
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Enter password">
            </div>`;
  }

  if (hasAddress) {
    formFields += `
            <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" name="address" class="form-control" rows="3" placeholder="Enter your address"></textarea>
            </div>`;
  }

  if (hasMessage) {
    formFields += `
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" class="form-control" rows="4" placeholder="Enter your message"></textarea>
            </div>`;
  }

  // If no specific fields found, add default ones based on textbox count
  if (!formFields) {
    const defaultCount = Math.max(requestedCount, 2); // Default to 2 if no count specified
    for (let i = 1; i <= defaultCount; i++) {
      formFields += `
            <div class="form-group">
                <label for="field${i}">Field ${i}</label>
                <input type="text" id="field${i}" name="field${i}" class="form-control" placeholder="Enter field ${i}">
            </div>`;
    }
  }

  // Use Atlas Component Library for the site header
  const siteHeader = atlasLibrary.generateComponent("site-header");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f3f2f1; 
            color: #171717; 
            line-height: 1.5; 
        }
        .main { 
            max-width: 600px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .form-container { 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd; 
        }
        .form-title { 
            color: #0078d4; 
            margin-bottom: 24px; 
            font-size: 24px; 
            font-weight: 600; 
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        .form-group label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 500; 
            color: #323130; 
        }
        .form-control { 
            width: 100%; 
            padding: 12px 16px; 
            border: 1px solid #e1dfdd; 
            border-radius: 4px; 
            font-size: 14px; 
            font-family: inherit; 
            transition: border-color 0.2s; 
        }
        .form-control:focus { 
            outline: none; 
            border-color: #0078d4; 
            box-shadow: 0 0 0 1px #0078d4; 
        }
        .btn { 
            background: #0078d4; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            font-size: 14px; 
            cursor: pointer; 
            font-weight: 500; 
            width: 100%;
        }
        .btn:hover { 
            background: #106ebe; 
        }
        .footer { 
            background: #ffffff; 
            border-top: 1px solid #e1dfdd; 
            padding: 20px 24px; 
            margin-top: 60px; 
            text-align: center; 
            color: #737373; 
        }
        textarea.form-control {
            resize: vertical;
            min-height: 80px;
        }
    </style>
</head>
<body>
    ${siteHeader}
    <main class="main">
        <div class="form-container">
            <h1 class="form-title">${description}</h1>
            <form>${formFields}
            <button type="submit" class="btn">Submit</button>
            </form>
        </div>
    </main>
    <footer class="footer">
        <p>© Microsoft Learn - AI Wireframe Generator</p>
    </footer>
</body>
</html>`;
}

// Dashboard-focused wireframe
function generateDashboardWireframe(description, colorScheme) {
  // Use Atlas Component Library for the site header
  const siteHeader = atlasLibrary.generateComponent("site-header");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f8f9fa; 
            color: #171717; 
            line-height: 1.5; 
        }
        .main { 
            max-width: 1400px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .page-title { 
            font-size: 28px; 
            font-weight: 600; 
            color: #171717; 
            margin-bottom: 24px; 
        }
        .dashboard-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 300px)); 
            gap: 1rem; 
            margin-bottom: 2rem; 
            justify-content: start;
        }
        .card { 
            background: white; 
            padding: 1rem; 
            border-radius: 4px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd;
            max-width: 300px;
            width: 100%;
        }
        .card-title { 
            font-size: 1rem; 
            font-weight: 600; 
            color: #0078d4; 
            margin-bottom: 0.5rem; 
            line-height: 1.3;
        }
        .metric { 
            font-size: 1.5rem; 
            font-weight: 600; 
            color: #0078d4; 
            margin-bottom: 0.25rem; 
        }
        .metric-label { 
            font-size: 0.8125rem; 
            color: #605e5c; 
        }
        .chart-placeholder { 
            height: 200px; 
            background: #E8E6DF; 
            border: 2px dashed #605e5c; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #605e5c; 
            font-weight: 500; 
        }
        .table-container { 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.08); 
            border: 1px solid #e1dfdd; 
            overflow: hidden; 
        }
        .table-header { 
            padding: 20px 24px; 
            border-bottom: 1px solid #e1dfdd; 
            font-weight: 600; 
            color: #171717; 
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
        }
        .table th, .table td { 
            padding: 12px 24px; 
            text-align: left; 
            border-bottom: 1px solid #f3f2f1; 
        }
        .table th { 
            background: #f8f9fa; 
            font-weight: 600; 
            color: #171717; 
            font-size: 14px; 
        }
        .table td { 
            color: #505050; 
            font-size: 14px; 
        }
        .status { 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 12px; 
            font-weight: 500; 
        }
        .status.active { 
            background: #d1fae5; 
            color: #065f46; 
        }
        .status.pending { 
            background: #fef3c7; 
            color: #92400e; 
        }
    </style>
</head>
<body>
    ${siteHeader}
    <main class="main">
        <h1 class="page-title">${description}</h1>
        
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-title">Total Users</div>
                <div class="metric">2,847</div>
                <div class="metric-label">+12% from last month</div>
            </div>
            <div class="card">
                <div class="card-title">Active Sessions</div>
                <div class="metric">1,423</div>
                <div class="metric-label">Currently online</div>
            </div>
            <div class="card">
                <div class="card-title">Completion Rate</div>
                <div class="metric">87%</div>
                <div class="metric-label">+5% improvement</div>
            </div>
            <div class="card">
                <div class="card-title">Performance Chart</div>
                <div class="chart-placeholder">📊 Chart Visualization</div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">Recent Activity</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Status</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>Completed Module 1</td>
                        <td><span class="status active">Active</span></td>
                        <td>2 minutes ago</td>
                    </tr>
                    <tr>
                        <td>Jane Smith</td>
                        <td>Started Assessment</td>
                        <td><span class="status pending">Pending</span></td>
                        <td>5 minutes ago</td>
                    </tr>
                    <tr>
                        <td>Mike Johnson</td>
                        <td>Downloaded Certificate</td>
                        <td><span class="status active">Active</span></td>
                        <td>10 minutes ago</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>`;
}

// Landing page wireframe
function generateLandingWireframe(description, colorScheme) {
  // Use Atlas Component Library for the site header
  const siteHeader = atlasLibrary.generateComponent("site-header");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #ffffff; 
            color: #171717; 
            line-height: 1.6; 
        }
        ${getBreadcrumbStyles()}
        .hero { 
            background: #E8E6DF !important; 
            color: #161616 !important; 
            text-align: center; 
            padding: 120px 24px 80px; 
            margin-top: 70px; 
        }
        .hero-content { 
            max-width: 800px; 
            margin: 0 auto; 
        }
        .hero h1 { 
            font-size: 48px; 
            font-weight: 700; 
            margin-bottom: 24px; 
            line-height: 1.2; 
            color: #161616 !important; 
        }
        .hero p { 
            font-size: 20px; 
            margin-bottom: 32px; 
            color: #161616 !important; 
        }
        .hero-buttons { 
            display: flex; 
            gap: 16px; 
            justify-content: center; 
            flex-wrap: wrap; 
        }
        .btn-primary { 
            background: white; 
            color: #0078d4; 
            padding: 16px 32px; 
            border: none; 
            border-radius: 6px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
        }
        .btn-secondary { 
            background: transparent; 
            color: white; 
            padding: 16px 32px; 
            border: 2px solid white; 
            border-radius: 6px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
        }
        .features { 
            padding: 80px 24px; 
            background: #f8f9fa; 
        }
        .features-content { 
            max-width: 1200px; 
            margin: 0 auto; 
            text-align: center; 
        }
        .features h2 { 
            font-size: 36px; 
            margin-bottom: 16px; 
            color: #171717; 
        }
        .features-subtitle { 
            font-size: 18px; 
            color: #737373; 
            margin-bottom: 48px; 
        }
        .features-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 300px)); 
            gap: 1rem; 
            justify-content: start;
        }
        .feature-card { 
            background: white; 
            padding: 1rem; 
            border-radius: 4px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            text-align: center;
            border: 1px solid #e1dfdd;
            max-width: 300px;
            width: 100%;
        }
        .feature-icon { 
            width: 40px; 
            height: 40px; 
            background: #0078d4; 
            border-radius: 4px; 
            margin: 0 auto 0.75rem; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 18px; 
            color: white; 
        }
        .feature-card h3 { 
            font-size: 1rem; 
            margin-bottom: 0.5rem; 
            color: #0078d4;
            font-weight: 600;
            line-height: 1.3;
        }
        .feature-card p { 
            color: #605e5c;
            font-size: 0.8125rem;
            line-height: 1.4;
            margin: 0;
        }
    </style>
</head>
<body>
    ${siteHeader}
    <section class="hero">
        <div class="hero-content">
            <h1>${description}</h1>
            <p>Discover the power of Microsoft technologies through hands-on learning experiences and comprehensive documentation.</p>
            <div class="hero-buttons">
                <a href="#" class="btn-primary">Start Learning</a>
                <a href="#" class="btn-secondary">Browse Paths</a>
            </div>
        </div>
    </section>
    
    <section class="features">
        <div class="features-content">
            <h2>Why Choose Microsoft Learn?</h2>
            <p class="features-subtitle">Everything you need to build your skills and advance your career</p>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Structured Learning</h3>
                    <p>Follow curated learning paths designed by Microsoft experts to master specific technologies.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏆</div>
                    <h3>Earn Certifications</h3>
                    <p>Validate your skills with industry-recognized Microsoft certifications and badges.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <h3>Hands-on Practice</h3>
                    <p>Apply your knowledge with interactive labs and real-world scenarios in the cloud.</p>
                </div>
            </div>
        </div>
    </section>
    ${getBreadcrumbScript()}
</body>
</html>`;
}

// Content-focused wireframe
function generateContentWireframe(description, colorScheme) {
  // Use Atlas Component Library for the site header
  const siteHeader = atlasLibrary.generateComponent("site-header");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #ffffff; 
            color: #171717; 
            line-height: 1.6; 
        }
        ${getBreadcrumbStyles()}
        .container { 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .article-header { 
            margin-bottom: 40px; 
            text-align: center; 
        }
        .article-title { 
            font-size: 42px; 
            font-weight: 700; 
            color: #1f2937; 
            margin-bottom: 16px; 
            line-height: 1.2; 
        }
        .article-meta { 
            color: #6b7280; 
            font-size: 16px; 
        }
        .article-content { 
            font-size: 18px; 
            line-height: 1.8; 
        }
        .article-content h2 { 
            font-size: 28px; 
            color: #1f2937; 
            margin: 32px 0 16px 0; 
            font-weight: 600; 
        }
        .article-content h3 { 
            font-size: 22px; 
            color: #374151; 
            margin: 24px 0 12px 0; 
            font-weight: 600; 
        }
        .article-content p { 
            margin-bottom: 20px; 
            color: #374151; 
        }
        .article-content ul { 
            margin: 20px 0; 
            padding-left: 24px; 
        }
        .article-content li { 
            margin-bottom: 8px; 
            color: #374151; 
        }
        .highlight { 
            background: #f0f9ff; 
            border-left: 4px solid #0078d4; 
            padding: 16px 20px; 
            margin: 24px 0; 
            border-radius: 0 4px 4px 0; 
        }
        .code-block { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 20px 0; 
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; 
            font-size: 14px; 
            overflow-x: auto; 
        }
        .tags { 
            margin-top: 40px; 
            padding-top: 24px; 
            border-top: 1px solid #e5e7eb; 
        }
        .tag { 
            display: inline-block; 
            background: #f3f4f6; 
            color: #374151; 
            padding: 6px 12px; 
            border-radius: 16px; 
            font-size: 14px; 
            margin-right: 8px; 
            margin-bottom: 8px; 
        }
    </style>
</head>
<body>
    ${siteHeader}
    
    <div class="container">
        <header class="article-header">
            <h1 class="article-title">${description}</h1>
            <div class="article-meta">Published on Microsoft Learn • 5 min read</div>
        </header>
        
        <article class="article-content">
            <p>Welcome to this comprehensive guide about <strong>${description.toLowerCase()}</strong>. This article will walk you through the essential concepts and practical applications you need to know.</p>
            
            <h2>Overview</h2>
            <p>In this section, we'll cover the fundamental concepts and explain why this topic is important for modern development practices.</p>
            
            <div class="highlight">
                <strong>Key Takeaway:</strong> Understanding these concepts will help you build more efficient and maintainable solutions.
            </div>
            
            <h2>Getting Started</h2>
            <p>Let's begin with the basics. Here are the essential steps to get you started:</p>
            
            <ul>
                <li>Understand the core concepts and terminology</li>
                <li>Set up your development environment</li>
                <li>Follow the step-by-step implementation guide</li>
                <li>Test your implementation thoroughly</li>
            </ul>
            
            <h3>Implementation Example</h3>
            <p>Here's a practical example to demonstrate the concepts:</p>
            
            <div class="code-block">
// Example implementation
function example() {
    console.log("This is a sample code block");
    return "Success!";
}
            </div>
            
            <h2>Best Practices</h2>
            <p>When working with these concepts, consider the following best practices:</p>
            
            <ul>
                <li>Always follow established patterns and conventions</li>
                <li>Keep your code clean and well-documented</li>
                <li>Test thoroughly before deploying to production</li>
                <li>Monitor performance and optimize as needed</li>
            </ul>
            
            <h2>Next Steps</h2>
            <p>Now that you understand the basics, you can explore more advanced topics and integrate these concepts into your projects.</p>
            
            <div class="tags">
                <span class="tag">Tutorial</span>
                <span class="tag">Best Practices</span>
                <span class="tag">Development</span>
                <span class="tag">Microsoft Learn</span>
            </div>
        </article>
    </div>
    ${getBreadcrumbScript()}
</body>
</html>`;
}

// Simple fallback for when no pattern matches
function createSimpleFallback(description, colorScheme) {
  // ALWAYS use the official Microsoft Learn site header from Atlas Component Library
  const siteHeader = atlasLibrary.generateComponent("site-header");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f3f2f1; 
            color: #171717; 
            line-height: 1.5; 
        }
        ${getBreadcrumbStyles()}
        .main { 
            max-width: 1200px; 
            margin: 40px auto; 
            padding: 0 24px; 
        }
        .hero { 
            background: #E8E6DF !important; 
            color: #161616 !important; 
            padding: 60px 40px; 
            border-radius: 8px; 
            margin-bottom: 40px; 
            text-align: center; 
        }
        .hero h1 { 
            font-size: 32px; 
            margin-bottom: 16px; 
            font-weight: 600; 
            color: #161616 !important; 
        }
        .hero p { 
            font-size: 18px; 
            color: #161616 !important; 
        }
        .content { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 24px; 
        }
        .card { 
            background: white; 
            padding: 24px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd; 
        }
        .card h3 { 
            color: #0078d4; 
            margin-bottom: 12px; 
            font-size: 20px; 
        }
        .card p { 
            color: #505050; 
            margin-bottom: 16px; 
        }
        .btn { 
            background: #0078d4; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            font-size: 14px; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
        }
        .btn:hover { 
            background: #106ebe; 
        }
        .footer { 
            background: #ffffff; 
            border-top: 1px solid #e1dfdd; 
            padding: 40px 24px; 
            margin-top: 60px; 
            text-align: center; 
            color: #737373; 
        }
    </style>
</head>
<body>
    ${siteHeader}
    
    <main class="main">
        <section class="hero">
            <h1>${description}</h1>
            <p>Custom wireframe generated based on your description.</p>
        </section>
        <div class="content">
            <div class="card">
                <h3>Getting Started</h3>
                <p>Learn the fundamentals and build your first application with our guided tutorials.</p>
                <a href="#" class="btn">Start Learning</a>
            </div>
            <div class="card">
                <h3>Documentation</h3>
                <p>Comprehensive guides and API references to help you build amazing applications.</p>
                <a href="#" class="btn">View Docs</a>
            </div>
            <div class="card">
                <h3>Community</h3>
                <p>Connect with other developers and get help from our vibrant community.</p>
                <a href="#" class="btn">Join Now</a>
            </div>
        </div>
    </main>
    <footer class="footer">
        <p>© Microsoft Learn - AI Wireframe Generator</p>
    </footer>
    ${getBreadcrumbScript()}
</body>
</html>`;
}

// Breadcrumb utility for multi-page wireframes
function generateBreadcrumb(currentPage = 1, totalPages = 3) {
  if (totalPages <= 1) return "";

  let breadcrumbItems = "";
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    const activeClass = isActive ? "active" : "";
    breadcrumbItems += `
      <button class="breadcrumb-item ${activeClass}" onclick="navigateToPage(${i})">
        Page ${i}
      </button>`;
  }

  return `
    <div class="breadcrumb-nav">
      <div class="breadcrumb-container">
        <span class="breadcrumb-label">Navigate:</span>
        ${breadcrumbItems}
      </div>
    </div>`;
}

// Breadcrumb CSS styles
function getBreadcrumbStyles() {
  return `
    .breadcrumb-nav {
      background: #f8f9fa;
      border-bottom: 1px solid #e1dfdd;
      padding: 12px 24px;
      margin-bottom: 20px;
    }
    .breadcrumb-container {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .breadcrumb-label {
      font-size: 14px;
      color: #505050;
      font-weight: 500;
      margin-right: 8px;
    }
    .breadcrumb-item {
      background: #ffffff;
      border: 1px solid #e1dfdd;
      color: #0078d4;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    .breadcrumb-item:hover {
      background: #f3f2f1;
      border-color: #0078d4;
    }
    .breadcrumb-item.active {
      background: #0078d4;
      color: white;
      border-color: #0078d4;
      cursor: default;
    }
    .breadcrumb-item.active:hover {
      background: #0078d4;
    }`;
}

// JavaScript for breadcrumb navigation
function getBreadcrumbScript() {
  return `
    <script>
      function navigateToPage(pageNumber) {
        // Show loading state
        const clickedBtn = event.target;
        const originalText = clickedBtn.textContent;
        clickedBtn.textContent = 'Loading...';
        clickedBtn.style.opacity = '0.7';
        
        // Simulate page navigation (in a real app, this would navigate to different pages)
        setTimeout(() => {
          // Update active state
          document.querySelectorAll('.breadcrumb-item').forEach(btn => {
            btn.classList.remove('active');
          });
          clickedBtn.classList.add('active');
          
          // Reset button state
          clickedBtn.textContent = originalText;
          clickedBtn.style.opacity = '1';
          
          // In a real application, you would:
          // window.location.href = '/page-' + pageNumber;
          // or use your router to navigate to the specific page
          
          console.log('Navigated to Page ' + pageNumber);
        }, 500);
      }
    </script>`;
}

// Validation functions
function isValidDescription(description) {
  if (!description || typeof description !== "string") {
    return false;
  }

  if (description.trim().length < 3) {
    return false;
  }

  if (description.length > 1000) {
    return false;
  }

  return true;
}

module.exports = async function (context, req) {
  const correlationId = crypto.randomUUID();
  const startTime = Date.now();
  let analyticsData = {
    correlationId,
    sessionId: null,
    description: null,
    method: req.method,
    userAgent: req.headers["user-agent"],
    success: false,
    errorMessage: null,
    processingTimeMs: 0,
    aiGenerated: false,
    source: "unknown",
    htmlLength: 0,
    colorScheme: "primary",
    hasImageAnalysis: false,
    imageAnalysisConfidence: 0,
  };

  try {
    // Set CORS headers first
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Correlation-ID": correlationId,
        // Cache-busting headers for development
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Development-Mode": "true",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      // Log API performance for OPTIONS requests
      analyticsLogger.logAPIPerformance(
        "/api/generateWireframe",
        "OPTIONS",
        200,
        Date.now() - startTime
      );
      return;
    }

    logger.info("🚀 Wireframe generation started", {
      correlationId,
      method: req.method,
    });

    // Context-aware body handling with session management
    let description = "Sample wireframe";
    let colorScheme = "primary";
    let sessionId = null;
    let userAgent = null;
    let imageAnalysis = null; // New: Support for image analysis data
    let useFluentCommunity = true; // Fluent Community components are now mandatory

    if (req.method === "POST" && req.body) {
      description = req.body.description || req.body.prompt || description;
      colorScheme = req.body.colorScheme || colorScheme;
      sessionId =
        req.body.sessionId ||
        req.headers["x-session-id"] ||
        `session_${correlationId}`;
      userAgent = req.headers["user-agent"];
      imageAnalysis = req.body.imageAnalysis || null; // New: Extract image analysis data
    } else if (req.method === "GET" && req.query) {
      description = req.query.description || req.query.prompt || description;
      colorScheme = req.query.colorScheme || colorScheme;
      sessionId =
        req.query.sessionId ||
        req.headers["x-session-id"] ||
        `session_${correlationId}`;
      userAgent = req.headers["user-agent"];
      // Note: Image analysis not supported via GET for security reasons
    }

    // Update analytics data with request parameters
    analyticsData = {
      ...analyticsData,
      sessionId,
      description,
      colorScheme,
      hasImageAnalysis: !!imageAnalysis,
      imageAnalysisConfidence: imageAnalysis?.confidence || 0,
    };

    // Initialize context-aware session
    logger.info("🧠 Initializing context-aware session", {
      correlationId,
      sessionId,
      hasUserAgent: !!userAgent,
    });

    const session = contextManager.initializeSession(sessionId, userAgent);
    const generationContext = contextManager.getGenerationContext(
      sessionId,
      description
    );

    logger.info("📚 Context analysis completed", {
      correlationId,
      sessionId,
      hasHistory: generationContext?.recentHistory?.length > 0,
      successfulPatterns: generationContext?.successfulPatterns?.length || 0,
      userPreferences: generationContext?.userPreferences || {},
    });

    // Initialize OpenAI client if not already done
    if (!openai) {
      initializeOpenAI();
    }

    logger.info("🔧 Starting wireframe generation", {
      correlationId,
      description: description.substring(0, 50) + "...",
      hasOpenAI: !!openai,
    });

    // 🤖 AI-ONLY MODE: Always use AI for all requests
    // Fast mode is disabled - every request goes through AI generation
    const requestsFastMode = req.body?.fastMode || req.query?.fastMode;

    // Skip fast mode detection - always use AI
    logger.info("🤖 Using AI mode for all requests (fast mode disabled)", {
      correlationId,
      descriptionLength: description.length,
    });

    // REMOVED: Fast mode logic - now all requests use AI
    // This ensures every wireframe is generated by GPT-4o regardless of complexity

    // 🤖 AI-POWERED FLUENT WIREFRAME GENERATION
    logger.info(
      "🤖 Generating AI-powered wireframe with mandatory Microsoft Fluent UI Web Components",
      {
        correlationId,
        description,
        aiModel: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      }
    );

    // Determine generation method based on input
    let result;

    if (
      imageAnalysis &&
      imageAnalysis.components &&
      imageAnalysis.components.length > 0
    ) {
      // Priority 1: Image-based wireframe generation
      logger.info("📸 Using image-based wireframe generation", {
        correlationId,
        componentsDetected: imageAnalysis.components.length,
        confidence: imageAnalysis.confidence,
        layoutType: imageAnalysis.layout?.type,
      });

      const imageBasedHtml = await generateWireframeFromImageAnalysis(
        imageAnalysis,
        colorScheme,
        correlationId
      );

      if (imageBasedHtml) {
        result = {
          html: imageBasedHtml,
          source: "image-analysis-ai",
          aiGenerated: true,
          imageAnalysis: {
            confidence: imageAnalysis.confidence,
            componentsCount: imageAnalysis.components.length,
            layoutType: imageAnalysis.layout?.type,
          },
        };
      } else {
        // Fallback to description-based generation if image analysis fails
        logger.warn(
          "📸 Image-based generation failed, falling back to description-based",
          {
            correlationId,
          }
        );

        // Enhance description with image analysis context
        const enhancedDescription = `${description}. 
        Based on image analysis: detected ${
          imageAnalysis.components.length
        } components including ${imageAnalysis.components
          .map((c) => c.type)
          .join(", ")}. 
        Layout type: ${imageAnalysis.layout?.type}. 
        ${imageAnalysis.wireframeDescription}`;

        result = await generateWireframeFromDescription(
          enhancedDescription,
          colorScheme,
          correlationId,
          sessionId,
          generationContext
        );
      }
    } else {
      // Standard context-aware AI + pattern-based generation
      result = await generateWireframeFromDescription(
        description,
        colorScheme,
        correlationId,
        sessionId,
        generationContext
      );
    }
    const processingTime = Date.now() - startTime;

    // Update analytics data with results
    analyticsData = {
      ...analyticsData,
      success: true,
      processingTimeMs: processingTime,
      aiGenerated: result.aiGenerated,
      source: result.source,
      htmlLength: result.html.length,
      attempt: result.attempt || 1,
    };

    logger.info("✅ Wireframe generation completed successfully", {
      correlationId,
      processingTimeMs: processingTime,
      htmlLength: result.html.length,
      source: result.source,
      aiGenerated: result.aiGenerated,
    });

    // 📊 ENHANCED ANALYTICS LOGGING FOR POWER BI DASHBOARD
    analyticsLogger.logWireframeGeneration(analyticsData);

    // Log API performance metrics
    analyticsLogger.logAPIPerformance(
      "/api/generateWireframe",
      req.method,
      200,
      processingTime
    );

    // Log business metrics
    analyticsLogger.logBusinessMetrics("wireframe_generated", 1, {
      source: result.source,
      aiGenerated: result.aiGenerated,
      complexityLevel: analyticsData.description
        ? analyticsData.description.length > 100
          ? "complex"
          : "simple"
        : "simple",
    });

    context.res.status = 200;
    // Add cache-busting headers to existing response
    context.res.headers = {
      ...context.res.headers,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    // Fix image placeholders and convert to Fluent components before returning HTML
    let processedHtml = fixWireframeImages(result.html);
    processedHtml = addFluentPlaybookComponents(processedHtml);

    context.res.body = {
      html: processedHtml,
      fallback: result.source.includes("fallback"),
      correlationId,
      processingTimeMs: processingTime,
      theme: "microsoftlearn",
      colorScheme,
      aiGenerated: result.aiGenerated,
      source: result.source,
    };

    // Flush analytics before function completes
    analyticsLogger.flush();
  } catch (error) {
    const processingTime = Date.now() - startTime;

    // Update analytics data with error information
    analyticsData = {
      ...analyticsData,
      success: false,
      processingTimeMs: processingTime,
      errorMessage: error.message,
      source: "error-fallback",
    };

    logger.error("💥 Error in wireframe generation", error, {
      correlationId,
      processingTimeMs: processingTime,
    });

    // 📊 LOG ERROR ANALYTICS
    analyticsLogger.logWireframeGeneration(analyticsData);
    analyticsLogger.logAPIPerformance(
      "/api/generateWireframe",
      req.method,
      500,
      processingTime,
      error.message
    );

    // Emergency fallback
    const html = createSimpleFallback("Error fallback", "primary");
    let processedFallbackHtml = fixWireframeImages(html);
    processedFallbackHtml = addFluentPlaybookComponents(processedFallbackHtml);

    context.res.status = 200;
    context.res.body = {
      html: processedFallbackHtml,
      fallback: true,
      error: "Error occurred, using fallback",
      correlationId,
      processingTimeMs: processingTime,
      aiGenerated: false,
      source: "error-fallback",
    };

    // Flush analytics even on error
    analyticsLogger.flush();
  }
};

// Performance stats function
function getPerformanceStats() {
  return {
    openaiInitialized: openai !== null,
    initializationAttempts: openaiInitializationAttempts,
    lastError: lastOpenaiError,
    status: openai ? "ready" : "error",
  };
}

// Export the generateWireframeFromDescription function for use by other modules
module.exports.generateWireframeFromDescription =
  generateWireframeFromDescription;

// Export performance stats function
module.exports.getPerformanceStats = getPerformanceStats;

// Initialize OpenAI when module is loaded
initializeOpenAI();
