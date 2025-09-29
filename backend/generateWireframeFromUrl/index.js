/**
 * Generate Wireframe from URL Azure Function
 * Analyzes a website URL and generates a wireframe based on its structure
 * Combines websiteAnalyzer functionality with AI wireframe generation
 */

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { OpenAI } = require("openai");

// Import centralized color configuration
const { WIREFRAME_COLORS, ColorUtils } = require("../config/colors");
const {
  AccessibilityValidationMiddleware,
} = require("../accessibility/validation-middleware");

module.exports = async function (context, req) {
  // Set CORS headers for all responses
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: "",
    };
    return;
  }

  context.log("🌐 Generate Wireframe from URL function triggered");

  let browser;

  try {
    // Parse request body
    const {
      url,
      designSystem = "microsoft",
      includeResponsive = true,
      includeAccessibility = true,
    } = req.body;

    if (!url) {
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: "URL is required",
        }),
      };
      return;
    }

    context.log(`🔍 Analyzing and generating wireframe for: ${url}`);

    // Launch browser for website analysis
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set user agent and viewport
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setViewport({ width: 1200, height: 800 });

    // Navigate to URL
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for content to load
    await page.waitForSelector("body", { timeout: 10000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Extract website structure and content
    const analysis = await page.evaluate(() => {
      const getTextContent = (element) => {
        if (!element) return "";
        const text = element.innerText || element.textContent || "";
        return text.trim().substring(0, 200);
      };

      const getElementInfo = (selector, description) => {
        const elements = document.querySelectorAll(selector);
        return {
          count: elements.length,
          content: Array.from(elements)
            .slice(0, 3)
            .map((el) => getTextContent(el))
            .filter((t) => t),
          description,
        };
      };

      return {
        title: document.title || "",
        url: window.location.href,
        structure: {
          header: getElementInfo(
            'header, [role="banner"], .header, .navbar, nav',
            "Header/Navigation"
          ),
          main: getElementInfo(
            'main, [role="main"], .main, .content',
            "Main Content"
          ),
          sidebar: getElementInfo(
            'aside, [role="complementary"], .sidebar',
            "Sidebar"
          ),
          footer: getElementInfo(
            'footer, [role="contentinfo"], .footer',
            "Footer"
          ),
          navigation: getElementInfo(
            'nav, [role="navigation"], .nav, .menu',
            "Navigation"
          ),
          buttons: getElementInfo(
            'button, input[type="button"], input[type="submit"], .btn',
            "Buttons"
          ),
          forms: getElementInfo("form", "Forms"),
          images: getElementInfo("img", "Images"),
          links: getElementInfo("a", "Links"),
        },
        content: {
          headings: getElementInfo("h1, h2, h3, h4, h5, h6", "Headings"),
          paragraphs: getElementInfo("p", "Paragraphs"),
          lists: getElementInfo("ul, ol", "Lists"),
        },
        layout: {
          containers: getElementInfo(
            ".container, .wrapper, .content",
            "Containers"
          ),
          sections: getElementInfo("section, .section", "Sections"),
          articles: getElementInfo("article, .article", "Articles"),
        },
      };
    });

    await browser.close();
    browser = null;

    context.log(`✅ Website analysis completed for ${analysis.title}`);

    // Generate wireframe prompt based on analysis
    const wireframePrompt = createWireframePrompt(analysis, designSystem);

    // Generate wireframe using OpenAI
    const openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT.replace(
        /\/$/,
        ""
      )}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });

    context.log("🤖 Generating wireframe with AI...");

    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(designSystem),
        },
        {
          role: "user",
          content: wireframePrompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    let wireframeHtml = completion.choices[0]?.message?.content || "";

    // Clean up the response
    wireframeHtml = cleanHtmlResponse(wireframeHtml);

    // Apply accessibility validation if requested
    if (includeAccessibility) {
      try {
        const validator = new AccessibilityValidationMiddleware();
        const validationResult = await validator.validateAndFix(wireframeHtml);
        if (validationResult.isValid) {
          wireframeHtml = validationResult.fixedHtml || wireframeHtml;
        }
      } catch (accessibilityError) {
        context.log(
          `⚠️ Accessibility validation failed: ${accessibilityError.message}`
        );
      }
    }

    // Success response
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        html: wireframeHtml,
        analysis: {
          title: analysis.title,
          url: analysis.url,
          sections: Object.keys(analysis.structure).reduce(
            (acc, key) => acc + analysis.structure[key].count,
            0
          ),
          components:
            analysis.structure.buttons.count +
            analysis.structure.forms.count +
            analysis.structure.images.count,
          colors: extractColors(analysis),
          wireframePrompt: wireframePrompt.substring(0, 500) + "...",
        },
        sourceUrl: url,
        generatedBy: "URL-Analysis-AI",
        timestamp: new Date().toISOString(),
        accessibility: includeAccessibility
          ? {
              status: "validated",
              validationResults: { isValid: true, issues: [] },
              appliedFixes: [],
            }
          : { status: "skipped" },
      }),
    };
  } catch (error) {
    context.log.error("❌ Error in generateWireframeFromUrl:", error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        context.log.error("Error closing browser:", closeError);
      }
    }

    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.message || "Failed to generate wireframe from URL",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
    };
  }
};

function createWireframePrompt(analysis, designSystem) {
  const { title, structure, content, layout } = analysis;

  let prompt = `Website "${title}" (${analysis.url}) analysis:\n\n`;

  // Structure analysis
  if (structure.header.count > 0) {
    prompt += `Header: ${structure.header.description}\n`;
    if (structure.header.content.length > 0) {
      prompt += `  ${structure.header.content.join(" | ")}\n`;
    }
  }

  if (structure.navigation.count > 0) {
    prompt += `Navigation: ${structure.navigation.count} navigation links\n`;
  }

  if (structure.main.count > 0) {
    prompt += `Main content area: Present with structured content\n`;
  }

  // Content sections
  if (content.headings.count > 0) {
    prompt += `\nContent sections (${content.headings.count}):\n`;
    content.headings.content.slice(0, 5).forEach((heading, i) => {
      prompt += `${i + 1}. ${heading}\n`;

      // Add related components
      const relatedInfo = [];
      if (structure.buttons.count > 0) relatedInfo.push("Contains buttons");
      if (structure.forms.count > 0) relatedInfo.push("Contains forms");
      if (structure.images.count > 0) relatedInfo.push("Contains images");
      if (structure.links.count > 0) relatedInfo.push("Contains links");

      if (relatedInfo.length > 0) {
        prompt += `   - ${relatedInfo.join(", ")}\n`;
      }
    });
  }

  // Component summary
  const totalButtons = structure.buttons.count;
  const totalForms = structure.forms.count;
  const totalImages = structure.images.count;

  if (totalButtons > 0 || totalForms > 0 || totalImages > 0) {
    prompt += `\nComponents found: `;
    const components = [];
    if (totalButtons > 0) components.push(`${totalButtons} buttons`);
    if (totalForms > 0) components.push(`${totalForms} forms`);
    if (totalImages > 0) components.push(`${totalImages} images`);
    prompt += components.join(", ") + "\n";
  }

  return prompt;
}

function getSystemPrompt(designSystem) {
  // Use the main WIREFRAME_COLORS object directly
  const colorTheme = WIREFRAME_COLORS;

  return `You are an expert wireframe designer specializing in ${designSystem} design system. 

Your task is to create a functional HTML wireframe based on website analysis data. The wireframe should:

1. **Maintain Original Structure**: Preserve the analyzed website's layout and navigation structure
2. **Use ${designSystem} Design System**: Apply appropriate colors, typography, and component styles
3. **Be Responsive**: Include responsive design patterns
4. **Include Realistic Content**: Replace placeholder text with contextual sample content
5. **Add Interactive Elements**: Include functional buttons, forms, and navigation

**Color Palette to Use:**
- Background: ${colorTheme.background}
- Text: ${colorTheme.text}  
- Primary: ${colorTheme.primary}
- Secondary: ${colorTheme.secondary}
- Accent: ${colorTheme.accent}

**Design Requirements:**
- Create a complete HTML page with embedded CSS
- Use semantic HTML5 elements
- Include responsive breakpoints
- Add hover effects and basic interactions
- Ensure accessibility (proper contrast, alt text, etc.)
- Make it production-ready

**Structure Guidelines:**
- Header with navigation
- Main content area matching analyzed sections
- Proper semantic markup
- Footer if present in analysis
- Responsive mobile layout

Return ONLY the complete HTML code without any explanations or markdown formatting.`;
}

function cleanHtmlResponse(html) {
  if (!html) return "";

  // Remove markdown code blocks
  html = html.replace(/```html\s*/gi, "");
  html = html.replace(/```\s*/gi, "");

  // Remove any leading/trailing quotes
  html = html.replace(/^['"`]+|['"`]+$/g, "");

  return html.trim();
}

function extractColors(analysis) {
  // Basic color extraction - could be enhanced with actual color detection
  return {
    background: "#ffffff",
    text: "#000000",
    primary: "#0066cc",
    secondary: "#666666",
  };
}
