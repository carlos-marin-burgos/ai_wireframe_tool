const { OpenAI } = require("openai");
const SmartDualResourceGenerator = require("../SmartDualResourceGenerator");

// Initialize Smart Dual Resource Generator
let smartGenerator = null;

function initializeOpenAI() {
  try {
    // Initialize Smart Dual Resource Generator
    console.log("🔄 Initializing Smart Dual Resource Generator...");
    smartGenerator = new SmartDualResourceGenerator();
    console.log("✅ Smart Dual Resource Generator initialized!");
    console.log(
      "🎯 Benefits: Double quota, automatic failover, smart load balancing"
    );
    return true;
  } catch (error) {
    console.error(
      "❌ Failed to initialize Smart Dual Resource Generator:",
      error
    );
    return false;
  }
}

// Initialize on startup
initializeOpenAI();

// Simple fallback wireframe generator
// NO MORE FALLBACK FUNCTIONS - AI ONLY!

// Load available components from library
async function loadComponentLibrary() {
  try {
    const fs = require("fs");
    const path = require("path");

    // Try to load the fluent-library.json from the public folder
    const libraryPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "fluent-library.json"
    );
    if (fs.existsSync(libraryPath)) {
      const libraryData = JSON.parse(fs.readFileSync(libraryPath, "utf8"));
      return libraryData.components || [];
    }

    console.log("⚠️ fluent-library.json not found, using default components");
    return [];
  } catch (error) {
    console.error("Error loading component library:", error);
    return [];
  }
}

// AI wireframe generation
async function generateWithAI(description) {
  if (!openai) {
    throw new Error("OpenAI not initialized");
  }

  // Load available components
  const availableComponents = await loadComponentLibrary();
  console.log(
    `📦 Loaded ${availableComponents.length} components from library`
  );

  // AI-powered component analysis and selection
  async function analyzeComponentsWithAI(description, availableComponents) {
    if (!openai || availableComponents.length === 0) {
      return { componentSuggestions: "", designGuidance: "" };
    }

    try {
      // Let AI analyze which components would be most relevant
      const analysisPrompt = `Analyze this Microsoft Learn platform request: "${description}"

Available components:
${availableComponents
  .map(
    (comp, index) =>
      `${index + 1}. ${comp.name} - ${comp.description}
     Category: ${comp.category}`
  )
  .join("\n")}

As an expert Microsoft Learn UX designer, provide:
1. Which components (by number) would best serve this request and WHY
2. How these components should be adapted for Microsoft Learn context
3. What additional Microsoft Learn specific elements are needed

Focus on Microsoft Learn patterns: documentation layouts, learning paths, code examples, tutorials, certification content, etc.

Respond in this format:
RECOMMENDED_COMPONENTS: [list component numbers that fit best]
MICROSOFT_LEARN_ADAPTATION: [how to adapt for Learn platform]
ADDITIONAL_ELEMENTS: [what else is needed for Learn context]`;

      const analysisResponse = await smartGenerator.generateCompletion({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for more focused analysis
      });

      const analysis = analysisResponse.choices[0]?.message?.content || "";

      // Parse the AI analysis
      const recommendedNumbers =
        analysis
          .match(/RECOMMENDED_COMPONENTS:\s*\[(.*?)\]/)?.[1]
          ?.split(",")
          .map((n) => parseInt(n.trim()))
          .filter((n) => !isNaN(n)) || [];

      const adaptationMatch = analysis.match(
        /MICROSOFT_LEARN_ADAPTATION:\s*(.*?)(?=\nADDITIONAL_ELEMENTS:|$)/s
      );
      const adaptationGuidance = adaptationMatch
        ? adaptationMatch[1].trim()
        : "";

      const elementsMatch = analysis.match(/ADDITIONAL_ELEMENTS:\s*(.*?)$/s);
      const additionalElements = elementsMatch ? elementsMatch[1].trim() : "";

      // Get the recommended components
      const recommendedComponents = recommendedNumbers
        .map((num) => availableComponents[num - 1])
        .filter((comp) => comp);

      const componentSuggestions =
        recommendedComponents.length > 0
          ? `
RECOMMENDED COMPONENTS FOR THIS REQUEST:
${recommendedComponents
  .map(
    (comp) =>
      `- ${comp.name}: ${comp.description}
    HTML: ${comp.htmlCode}`
  )
  .join("\n\n")}

AI GUIDANCE: ${adaptationGuidance}
`
          : "";

      const designGuidance = `
MICROSOFT LEARN CONTEXT:
${additionalElements}

AI ANALYSIS: This request requires a Microsoft Learn approach with focus on educational content, clear navigation, and learning-oriented UI patterns.
`;

      return { componentSuggestions, designGuidance };
    } catch (error) {
      console.error("AI component analysis failed:", error);
      return { componentSuggestions: "", designGuidance: "" };
    }
  }

  // Use AI to analyze and recommend components
  const { componentSuggestions, designGuidance } =
    await analyzeComponentsWithAI(description, availableComponents);
  console.log("🧠 AI component analysis completed");

  // Extract semantic keywords from component for better AI matching
  function extractComponentKeywords(component) {
    const keywords = [];
    const name = component.name.toLowerCase();
    const desc = component.description.toLowerCase();
    const category = component.category.toLowerCase();

    // Functionality keywords
    if (
      name.includes("button") ||
      desc.includes("button") ||
      desc.includes("click")
    )
      keywords.push("buttons", "interactions");
    if (
      name.includes("menu") ||
      desc.includes("menu") ||
      desc.includes("dropdown")
    )
      keywords.push("navigation", "menus");
    if (
      name.includes("form") ||
      desc.includes("form") ||
      desc.includes("input")
    )
      keywords.push("forms", "data entry");
    if (
      name.includes("card") ||
      desc.includes("card") ||
      desc.includes("container")
    )
      keywords.push("content containers", "layouts");
    if (
      name.includes("table") ||
      desc.includes("table") ||
      desc.includes("grid")
    )
      keywords.push("data display", "tables");
    if (
      name.includes("modal") ||
      desc.includes("modal") ||
      desc.includes("dialog")
    )
      keywords.push("dialogs", "overlays");
    if (
      name.includes("header") ||
      desc.includes("header") ||
      desc.includes("navigation")
    )
      keywords.push("page headers", "site navigation");
    if (
      name.includes("hero") ||
      desc.includes("hero") ||
      desc.includes("banner")
    )
      keywords.push("hero sections", "banners");
    if (
      name.includes("command") ||
      desc.includes("command") ||
      desc.includes("toolbar")
    )
      keywords.push("toolbars", "action bars");

    // Style/quality keywords
    if (
      category.includes("extended") ||
      desc.includes("figma") ||
      desc.includes("modern")
    )
      keywords.push("modern designs", "premium UI");
    if (category.includes("github") || desc.includes("official"))
      keywords.push("standard components");
    if (desc.includes("interactive") || desc.includes("animation"))
      keywords.push("interactive elements");
    if (desc.includes("responsive") || desc.includes("mobile"))
      keywords.push("responsive design");

    // UI pattern keywords
    if (name.includes("search") || desc.includes("search"))
      keywords.push("search functionality");
    if (name.includes("filter") || desc.includes("filter"))
      keywords.push("filtering");
    if (name.includes("list") || desc.includes("list"))
      keywords.push("lists", "collections");
    if (name.includes("tab") || desc.includes("tab"))
      keywords.push("tabbed interfaces");
    if (
      name.includes("step") ||
      desc.includes("step") ||
      desc.includes("wizard")
    )
      keywords.push("multi-step processes");

    // Fallback to category if no specific keywords found
    if (keywords.length === 0) {
      keywords.push(
        category
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .trim()
      );
    }

    return [...new Set(keywords)]; // Remove duplicates
  }

  const prompt = `Create a complete HTML wireframe for Microsoft Learn platform based on: "${description}"

MICROSOFT LEARN FOCUS:
- This is specifically for Microsoft Learn platform (learn.microsoft.com)
- Focus on educational content, tutorials, documentation, learning paths
- Use Microsoft Learn design patterns and content structures
- Include learning-oriented UI elements (progress indicators, code blocks, step-by-step guides)
- Optimize for developers and IT professionals learning Microsoft technologies

${designGuidance}

${componentSuggestions}

DESIGN REQUIREMENTS:
- ALWAYS start with the official Microsoft Learn site header as the FIRST element in the body
- Use Microsoft Learn design system with header background #ffffff and black text #000000
- Include Segoe UI font family consistently
- Make it responsive and accessible (WCAG 2.1 AA)
- Use semantic HTML5 and modern CSS
- Include Microsoft Learn specific elements like breadcrumbs, learning progress, related modules
- Use the AI-recommended components above when they enhance the learning experience

MICROSOFT LEARN PATTERNS TO INCLUDE:
- Learning path navigation
- Module progress indicators  
- Code snippet containers with syntax highlighting
- Step-by-step tutorial layouts
- Related content suggestions
- Skill level indicators
- Estimated completion times

MICROSOFT LEARN HEADER TEMPLATE (ALWAYS INCLUDE FIRST):
<header style="background: #ffffff; color: #000000; padding: 12px 24px; border-bottom: 1px solid #e5e5e5; font-family: 'Segoe UI', system-ui, sans-serif;">
  <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
    <div style="display: flex; align-items: center;">
      <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-right: 16px;">
        <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
        <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
        <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
        <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
      </svg>
      <div style="width: 1px; height: 24px; background: #e1e5e9; margin-right: 16px;"></div>
      <span style="font-weight: 600; font-size: 16px; color: #000000;">Microsoft Learn</span>
    </div>
    <nav style="display: flex; gap: 24px;">
      <a href="#" style="color: #000000; text-decoration: none; font-size: 14px;">Documentation</a>
      <a href="#" style="color: #000000; text-decoration: none; font-size: 14px;">Training</a>
      <a href="#" style="color: #000000; text-decoration: none; font-size: 14px;">Certifications</a>
    </nav>
  </div>
</header>

COLOR GUIDELINES:
- Header background: #ffffff with black text (#000000)
- Primary buttons: #0078d4 (keep blue for buttons and links)
- Hero/banner sections: #ffffff background

Generate ONLY the HTML code (starting with <!DOCTYPE html>).`;

  const response = await smartGenerator.generateCompletion({
    model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
    messages: [{ role: "user", content: combinedPrompt }],
    max_tokens: 2000, // EMERGENCY: Reduced from 4000 to 2000 to save quota
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

// Main Azure Function

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
    } catch (aiError) {
      console.error("❌ AI generation failed:", aiError.message);

      // Check if it's a rate limit error
      if (
        aiError.message.includes("429") ||
        aiError.message.includes("rate limit")
      ) {
        console.log("🚦 Rate limit detected - suggesting solutions");

        context.res.status = 429;
        context.res.body = JSON.stringify({
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          message: `Rate limit exceeded. Your Azure OpenAI S0 tier has limited quota. Solutions:
          
IMMEDIATE:
• Wait 60 seconds and try again
• Try a shorter, simpler description
• Consider upgrading to Pay-as-you-go

LONG-TERM:
• Upgrade Azure OpenAI pricing tier
• Request quota increase at https://aka.ms/oai/quotaincrease
• This system has been optimized to use 50% less quota

The system is running in emergency optimization mode with reduced token usage.`,
          timestamp: new Date().toISOString(),
          details: aiError.message,
          retryAfter: 60,
          optimizationMode: "emergency",
          quotaReduction: "50%",
        });
        return;
      }

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

    context.res.status = 200;
    context.res.body = {
      html,
      source,
      aiGenerated: source === "openai",
      processingTimeMs: processingTime,
      fallback: source === "fallback",
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
