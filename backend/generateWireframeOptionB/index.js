const { OpenAI } = require("openai");

// Import FigmaService for Option B HTML generation with exact colors
const FigmaService = require("../../designetica-services/figmaService.js");

module.exports = async function (context, req) {
  console.log("🚀 Option B Wireframe Generator - HTML with Exact Atlas Colors");

  // CORS headers
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };

  if (req.method === "OPTIONS") {
    context.res.status = 200;
    context.res.body = "";
    return;
  }

  if (req.method !== "POST") {
    context.res.status = 405;
    context.res.body = { error: "Method not allowed" };
    return;
  }

  try {
    const { description } = req.body;

    if (!description) {
      context.res.status = 400;
      context.res.body = {
        error: "Description is required",
      };
      return;
    }

    console.log("📝 Description:", description);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_API_KEY,
      },
    });

    // Create system prompt for Option B
    const systemPrompt = `You are an expert wireframe generator that creates modern, responsive HTML wireframes with semantic structure. 

IMPORTANT: This is Option B implementation - you will generate clean HTML structure, and Atlas components will be injected with EXACT FIGMA COLORS afterwards.

Generate a complete HTML wireframe that includes:
1. Semantic HTML5 structure with proper tags
2. Clean, minimal CSS for layout and basic styling
3. Responsive design principles
4. Appropriate sections for the content type

For LEARNING PLATFORMS specifically, include these component placeholders:
- Hero section (will be replaced with exact Atlas colors)
- Learning path cards (will be replaced with exact Atlas colors)  
- Module cards (will be replaced with exact Atlas colors)
- Navigation (will be replaced with exact Atlas colors)
- Form inputs (will be replaced with exact Atlas colors)
- Buttons (will be replaced with exact Atlas colors)

Use semantic class names like:
- "hero-section" for hero areas
- "learning-path-card" for learning paths
- "module-card" for individual modules
- "navigation-main" for main navigation
- "form-input" for form inputs
- "button-primary" and "button-secondary" for buttons

The HTML should be clean and well-structured. Don't worry about specific colors or detailed styling - the Atlas color injection will handle exact visual design.

Return only valid HTML with embedded CSS.`;

    // Generate wireframe with OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: description },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    let wireframeHtml = completion.choices[0].message.content;

    // Clean up the response
    wireframeHtml = wireframeHtml
      .replace(/```html\n?/g, "")
      .replace(/```\n?/g, "");

    console.log("✅ Base wireframe generated");

    // Now apply Option B: Replace placeholders with HTML components using exact Atlas colors
    const processedHtml = await applyOptionBComponents(
      wireframeHtml,
      description
    );

    console.log("🎨 Option B components applied with exact Atlas colors");

    context.res.status = 200;
    context.res.body = {
      html: processedHtml,
      message:
        "✨ Option B: Wireframe generated with exact Atlas colors from Figma",
      method: "HTML with Exact Colors",
      componentsGenerated: "Atlas components with real Figma color extraction",
    };
  } catch (error) {
    console.error("❌ Error generating Option B wireframe:", error);
    context.res.status = 500;
    context.res.body = {
      error: "Failed to generate wireframe",
      details: error.message,
    };
  }
};

/**
 * Apply Option B: Replace component placeholders with HTML using exact Atlas colors
 */
async function applyOptionBComponents(html, description) {
  if (!html || typeof html !== "string") return html;

  console.log(
    "🎨 Applying Option B: HTML components with exact Atlas colors..."
  );

  // Check if this is a learning platform
  const isLearningPlatform =
    /learning|training|module|course|certification|education|path|skill|tutorial|hero|homepage/i.test(
      description
    );

  if (!isLearningPlatform) {
    console.log(
      "ℹ️ Not a learning platform, applying standard components with Atlas colors"
    );
    return await applyStandardComponentsWithAtlasColors(html);
  }

  // Initialize FigmaService for exact color extraction
  const figmaService = new FigmaService();

  let processedHtml = html;

  try {
    // 1. Replace hero sections with HTML using exact Atlas colors
    const heroPattern =
      /<section[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
    if (processedHtml.match(heroPattern)) {
      const heroComponent = { name: "Atlas Hero", nodeId: "14647:163530" };
      const heroHtml = await figmaService.generateComponentHtmlWithExactColors(
        heroComponent,
        0
      );

      processedHtml = processedHtml.replace(
        heroPattern,
        `
        <section class="hero atlas-hero-section">
          <div class="container">
            ${heroHtml}
          </div>
        </section>
      `
      );
      console.log(
        "✅ Hero section replaced with Option B HTML (exact Atlas colors)"
      );
    }

    // 2. Replace learning path cards
    const learningPathPattern =
      /<div[^>]*class="[^"]*learning[^"]*path[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    const learningPaths = processedHtml.match(learningPathPattern);
    if (learningPaths) {
      for (let i = 0; i < learningPaths.length; i++) {
        const cardComponent = {
          name: "Learning Path Card",
          nodeId: "14315:162386",
        };
        const cardHtml =
          await figmaService.generateComponentHtmlWithExactColors(
            cardComponent,
            i
          );
        processedHtml = processedHtml.replace(
          learningPaths[i],
          `
          <div class="learning-path-card atlas-component-container">
            ${cardHtml}
          </div>
        `
        );
      }
      console.log(
        `✅ ${learningPaths.length} learning path cards replaced with Option B HTML`
      );
    }

    // 3. Replace module cards
    const modulePattern =
      /<div[^>]*class="[^"]*module[^"]*card[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    const modules = processedHtml.match(modulePattern);
    if (modules) {
      for (let i = 0; i < modules.length; i++) {
        const moduleComponent = { name: "Module Card", nodeId: "14315:162386" };
        const moduleHtml =
          await figmaService.generateComponentHtmlWithExactColors(
            moduleComponent,
            i
          );
        processedHtml = processedHtml.replace(
          modules[i],
          `
          <div class="module-card atlas-component-container">
            ${moduleHtml}
          </div>
        `
        );
      }
      console.log(
        `✅ ${modules.length} module cards replaced with Option B HTML`
      );
    }

    // 4. Replace navigation
    const navPattern = /<nav[^>]*>[\s\S]*?<\/nav>/gi;
    const navs = processedHtml.match(navPattern);
    if (navs) {
      const navComponent = { name: "Main Navigation", nodeId: "nav-001" };
      const navHtml = await figmaService.generateComponentHtmlWithExactColors(
        navComponent,
        0
      );
      processedHtml = processedHtml.replace(navs[0], navHtml);
      console.log("✅ Navigation replaced with Option B HTML");
    }

    // 5. Replace buttons
    const buttonPattern =
      /<button[^>]*class="[^"]*button[^"]*"[^>]*>[\s\S]*?<\/button>/gi;
    const buttons = processedHtml.match(buttonPattern);
    if (buttons) {
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        // Limit to 5 buttons
        const isPrimary = buttons[i].includes("primary") || i === 0;
        const buttonComponent = {
          name: isPrimary ? "Primary Button" : "Secondary Button",
          nodeId: `btn-${i}`,
        };
        const buttonHtml =
          await figmaService.generateComponentHtmlWithExactColors(
            buttonComponent,
            i
          );
        processedHtml = processedHtml.replace(buttons[i], buttonHtml);
      }
      console.log(
        `✅ ${Math.min(buttons.length, 5)} buttons replaced with Option B HTML`
      );
    }

    // 6. Replace form inputs
    const inputPattern = /<input[^>]*class="[^"]*input[^"]*"[^>]*>/gi;
    const inputs = processedHtml.match(inputPattern);
    if (inputs) {
      for (let i = 0; i < Math.min(inputs.length, 3); i++) {
        // Limit to 3 inputs
        const inputComponent = { name: "Form Input", nodeId: `input-${i}` };
        const inputHtml =
          await figmaService.generateComponentHtmlWithExactColors(
            inputComponent,
            i
          );
        processedHtml = processedHtml.replace(inputs[i], inputHtml);
      }
      console.log(
        `✅ ${Math.min(inputs.length, 3)} inputs replaced with Option B HTML`
      );
    }

    console.log(
      "🎨 Option B processing complete: All components now use exact Atlas colors"
    );

    return processedHtml;
  } catch (error) {
    console.error("❌ Error applying Option B components:", error);
    // Return original HTML if Option B fails
    return html;
  }
}

/**
 * Apply standard components with Atlas colors for non-learning platforms
 */
async function applyStandardComponentsWithAtlasColors(html) {
  console.log("🎨 Applying standard components with Atlas colors...");

  try {
    const figmaService = new FigmaService();
    let processedHtml = html;

    // Replace any buttons with Atlas-styled buttons
    const buttonPattern = /<button[^>]*>[\s\S]*?<\/button>/gi;
    const buttons = processedHtml.match(buttonPattern);
    if (buttons && buttons.length > 0) {
      const buttonComponent = { name: "Primary Button", nodeId: "std-btn-1" };
      const buttonHtml =
        await figmaService.generateComponentHtmlWithExactColors(
          buttonComponent,
          0
        );
      processedHtml = processedHtml.replace(buttons[0], buttonHtml);
      console.log("✅ Standard button replaced with Atlas colors");
    }

    // Replace any cards with Atlas-styled cards
    const cardPattern =
      /<div[^>]*class="[^"]*card[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    const cards = processedHtml.match(cardPattern);
    if (cards && cards.length > 0) {
      const cardComponent = { name: "Standard Card", nodeId: "std-card-1" };
      const cardHtml = await figmaService.generateComponentHtmlWithExactColors(
        cardComponent,
        0
      );
      processedHtml = processedHtml.replace(cards[0], cardHtml);
      console.log("✅ Standard card replaced with Atlas colors");
    }

    return processedHtml;
  } catch (error) {
    console.error("❌ Error applying standard components:", error);
    return html;
  }
}
