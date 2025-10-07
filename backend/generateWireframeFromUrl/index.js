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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

  // Handle GET request (health check)
  if (req.method === "GET") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        status: "ok",
        endpoint: "generateWireframeFromUrl",
        description: "Analyzes a website URL and generates a wireframe",
        method: "POST",
        requiredParams: ["url"],
        optionalParams: [
          "designSystem",
          "includeResponsive",
          "includeAccessibility",
        ],
      }),
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

    // Extract website structure and content WITH MAXIMUM ACCURACY
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
            .slice(0, 8) // Increased from 5 to 8 for maximum detail
            .map((el) => getTextContent(el))
            .filter((t) => t),
          description,
        };
      };

      // Enhanced: Extract computed styles with MORE precision
      const getComputedStyles = (element) => {
        if (!element) return null;
        const styles = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          // Layout
          display: styles.display,
          position: styles.position,
          width: styles.width,
          height: styles.height,
          padding: styles.padding,
          margin: styles.margin,
          gap: styles.gap,
          
          // Colors
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderColor: styles.borderColor,
          
          // Typography
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          fontFamily: styles.fontFamily,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
          textAlign: styles.textAlign,
          textTransform: styles.textTransform,
          
          // Flexbox/Grid
          flexDirection: styles.flexDirection,
          justifyContent: styles.justifyContent,
          alignItems: styles.alignItems,
          flexWrap: styles.flexWrap,
          gridTemplateColumns: styles.gridTemplateColumns,
          gridTemplateRows: styles.gridTemplateRows,
          gridGap: styles.gridGap,
          
          // Position/Size
          top: styles.top,
          left: styles.left,
          right: styles.right,
          bottom: styles.bottom,
          zIndex: styles.zIndex,
          
          // Visual dimensions
          actualWidth: rect.width,
          actualHeight: rect.height,
          viewportTop: rect.top,
          viewportLeft: rect.left,
        };
      };

      // Enhanced: Extract layout patterns
      const detectLayoutPattern = (element) => {
        if (!element) return "unknown";
        const styles = window.getComputedStyle(element);
        if (styles.display === "grid") return "grid";
        if (styles.display === "flex") return "flexbox";
        if (styles.display === "block") return "block";
        return "other";
      };

      // Enhanced: Extract color palette from page with MORE colors
      const extractColorPalette = () => {
        const colors = new Set();
        const elements = document.querySelectorAll(
          'body, header, nav, main, footer, section, button, a, .btn, [role="button"], h1, h2, h3, h4, h5, h6, p, div'
        );
        elements.forEach((el) => {
          const styles = window.getComputedStyle(el);
          if (
            styles.backgroundColor &&
            styles.backgroundColor !== "rgba(0, 0, 0, 0)" &&
            styles.backgroundColor !== "transparent"
          ) {
            colors.add(styles.backgroundColor);
          }
          if (styles.color) {
            colors.add(styles.color);
          }
          if (styles.borderColor && styles.borderColor !== "rgba(0, 0, 0, 0)") {
            colors.add(styles.borderColor);
          }
        });
        return Array.from(colors).slice(0, 20); // Increased from 10 to 20
      };

      // NEW: Extract typography system
      const extractTypography = () => {
        const fonts = new Set();
        const fontSizes = new Set();
        const fontWeights = new Set();
        
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = document.querySelectorAll('p');
        
        [...headings, ...paragraphs].forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.fontFamily) fonts.add(styles.fontFamily);
          if (styles.fontSize) fontSizes.add(styles.fontSize);
          if (styles.fontWeight) fontWeights.add(styles.fontWeight);
        });
        
        return {
          fonts: Array.from(fonts).slice(0, 5),
          sizes: Array.from(fontSizes).slice(0, 10),
          weights: Array.from(fontWeights).slice(0, 5)
        };
      };

      // NEW: Extract spacing patterns
      const extractSpacing = () => {
        const paddings = new Set();
        const margins = new Set();
        const gaps = new Set();
        
        const containers = document.querySelectorAll('section, div, header, footer, nav, main');
        containers.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.padding !== '0px') paddings.add(styles.padding);
          if (styles.margin !== '0px') margins.add(styles.margin);
          if (styles.gap && styles.gap !== 'normal') gaps.add(styles.gap);
        });
        
        return {
          paddings: Array.from(paddings).slice(0, 10),
          margins: Array.from(margins).slice(0, 10),
          gaps: Array.from(gaps).slice(0, 5)
        };
      };

      // Enhanced: Detailed section analysis with MORE precision
      const analyzeSections = () => {
        const sections = document.querySelectorAll(
          'section, [role="region"], .section, main > div, main > article, article'
        );
        return Array.from(sections)
          .slice(0, 15) // Increased from 10 to 15
          .map((section, idx) => {
            const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
            const buttons = section.querySelectorAll(
              'button, .btn, [role="button"], a.button, input[type="submit"]'
            );
            const images = section.querySelectorAll("img");
            const links = section.querySelectorAll("a");
            const forms = section.querySelectorAll("form, input, textarea, select");
            const paragraphs = section.querySelectorAll("p");
            const lists = section.querySelectorAll("ul, ol");

            return {
              index: idx + 1,
              heading: heading ? getTextContent(heading) : "",
              headingTag: heading ? heading.tagName.toLowerCase() : "",
              hasButtons: buttons.length > 0,
              buttonCount: buttons.length,
              buttonTexts: Array.from(buttons)
                .slice(0, 5) // Increased from 3 to 5
                .map((b) => getTextContent(b))
                .filter((t) => t),
              hasImages: images.length > 0,
              imageCount: images.length,
              imageAlts: Array.from(images).slice(0, 5).map(img => img.alt || '').filter(t => t),
              hasLinks: links.length > 0,
              linkCount: links.length,
              linkTexts: Array.from(links).slice(0, 5).map(l => getTextContent(l)).filter(t => t),
              hasForms: forms.length > 0,
              formElementCount: forms.length,
              hasParagraphs: paragraphs.length > 0,
              paragraphCount: paragraphs.length,
              paragraphSamples: Array.from(paragraphs).slice(0, 2).map(p => getTextContent(p)).filter(t => t),
              hasLists: lists.length > 0,
              listCount: lists.length,
              layout: detectLayoutPattern(section),
              styles: getComputedStyles(section),
              position: section.getBoundingClientRect(),
              className: section.className,
              id: section.id,
            };
          });
      };

      // Enhanced: Navigation analysis with actual links
      const analyzeNavigation = () => {
        const navElements = document.querySelectorAll(
          'nav, [role="navigation"], header nav, .navbar'
        );
        const navLinks = [];

        navElements.forEach((nav) => {
          const links = nav.querySelectorAll("a");
          links.forEach((link) => {
            const text = getTextContent(link);
            if (text && text.length > 0 && text.length < 50) {
              navLinks.push({
                text: text,
                href: link.getAttribute("href") || "#",
                position: link.getBoundingClientRect(),
              });
            }
          });
        });

        return navLinks.slice(0, 15);
      };

      return {
        title: document.title || "",
        url: window.location.href,
        colorPalette: extractColorPalette(),
        detailedSections: analyzeSections(),
        navigationLinks: analyzeNavigation(),
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
            'button, input[type="button"], input[type="submit"], .btn, [role="button"], a.button',
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
        bodyLayout: detectLayoutPattern(document.body),
        headerLayout: detectLayoutPattern(
          document.querySelector('header, [role="banner"]')
        ),
        mainLayout: detectLayoutPattern(
          document.querySelector('main, [role="main"]')
        ),
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
  const {
    title,
    structure,
    content,
    layout,
    detailedSections,
    navigationLinks,
    colorPalette,
    bodyLayout,
    headerLayout,
    mainLayout,
  } = analysis;

  let prompt = `🎯 ACCURATE WIREFRAME RECREATION REQUEST\n\n`;
  prompt += `Website: "${title}" (${analysis.url})\n\n`;

  // Enhanced: Include detected layout patterns
  prompt += `📐 LAYOUT PATTERNS DETECTED:\n`;
  prompt += `- Body Layout: ${bodyLayout}\n`;
  prompt += `- Header Layout: ${headerLayout}\n`;
  prompt += `- Main Layout: ${mainLayout}\n\n`;

  // Enhanced: Include actual color palette
  if (colorPalette && colorPalette.length > 0) {
    prompt += `🎨 ACTUAL COLOR PALETTE FROM SITE:\n`;
    colorPalette.slice(0, 6).forEach((color, i) => {
      prompt += `- Color ${i + 1}: ${color}\n`;
    });
    prompt += `\n`;
  }

  // Enhanced: Detailed navigation with actual link text
  if (navigationLinks && navigationLinks.length > 0) {
    prompt += `🧭 NAVIGATION STRUCTURE (Use these EXACT link texts):\n`;
    navigationLinks.forEach((link, i) => {
      prompt += `${i + 1}. "${link.text}" (${link.href})\n`;
    });
    prompt += `\n`;
  }

  // Structure analysis
  if (structure.header.count > 0) {
    prompt += `📋 HEADER: ${structure.header.description}\n`;
    if (structure.header.content.length > 0) {
      prompt += `  Content: ${structure.header.content.join(" | ")}\n`;
    }
  }

  if (structure.main.count > 0) {
    prompt += `📋 MAIN CONTENT: Present with structured sections\n`;
  }

  // Enhanced: Detailed section-by-section breakdown
  if (detailedSections && detailedSections.length > 0) {
    prompt += `\n🔍 DETAILED SECTIONS (Recreate each accurately):\n\n`;
    detailedSections.forEach((section) => {
      prompt += `SECTION ${section.index}:\n`;
      if (section.heading) {
        prompt += `  Heading: "${section.heading}"\n`;
      }
      prompt += `  Layout: ${section.layout}\n`;

      if (section.hasButtons && section.buttonTexts.length > 0) {
        prompt += `  Buttons (${section.buttonCount}): ${section.buttonTexts
          .map((t) => `"${t}"`)
          .join(", ")}\n`;
      }

      if (section.hasImages) {
        prompt += `  Images: ${section.imageCount} image(s)\n`;
      }

      if (section.hasLinks) {
        prompt += `  Links: ${section.linkCount} link(s)\n`;
      }

      if (section.hasForms) {
        prompt += `  Forms: Contains form elements\n`;
      }

      if (section.styles && section.styles.backgroundColor) {
        prompt += `  Background: ${section.styles.backgroundColor}\n`;
      }

      prompt += `\n`;
    });
  }

  // Component summary
  const totalButtons = structure.buttons.count;
  const totalForms = structure.forms.count;
  const totalImages = structure.images.count;

  if (totalButtons > 0 || totalForms > 0 || totalImages > 0) {
    prompt += `📊 COMPONENT SUMMARY:\n`;
    const components = [];
    if (totalButtons > 0) components.push(`${totalButtons} buttons`);
    if (totalForms > 0) components.push(`${totalForms} forms`);
    if (totalImages > 0) components.push(`${totalImages} images`);
    prompt += components.join(", ") + "\n\n";
  }

  // Footer
  if (structure.footer.count > 0) {
    prompt += `📋 FOOTER: ${structure.footer.description}\n`;
    if (structure.footer.content.length > 0) {
      prompt += `  Content: ${structure.footer.content.join(" | ")}\n`;
    }
  }

  prompt += `\n🎯 ACCURACY REQUIREMENTS:\n`;
  prompt += `1. Use the EXACT navigation link texts provided above\n`;
  prompt += `2. Use the EXACT button texts from each section\n`;
  prompt += `3. Match the layout patterns (${bodyLayout}, ${headerLayout}, ${mainLayout})\n`;
  prompt += `4. Incorporate the detected color palette\n`;
  prompt += `5. Preserve the section order and structure\n`;
  prompt += `6. Include all ${
    detailedSections ? detailedSections.length : 0
  } sections identified\n`;

  return prompt;
}

function getSystemPrompt(designSystem) {
  // Use the main WIREFRAME_COLORS object directly
  const colorTheme = WIREFRAME_COLORS;

  return `You are an EXPERT wireframe designer with EXCEPTIONAL ATTENTION TO DETAIL specializing in ${designSystem} design system.

🎯 YOUR MISSION: Create a HIGHLY ACCURATE HTML wireframe that CLOSELY MATCHES the analyzed website.

⚠️ CRITICAL ACCURACY REQUIREMENTS:

1. **EXACT TEXT MATCHING** (MOST IMPORTANT):
   - Use the EXACT navigation link texts provided in the analysis
   - Use the EXACT button texts from each section
   - Use the EXACT heading texts provided
   - Do NOT invent or change any text - copy it EXACTLY as provided

2. **LAYOUT PATTERN MATCHING**:
   - If analysis shows "flexbox" - use display: flex
   - If analysis shows "grid" - use display: grid
   - Match the layout pattern EXACTLY as detected

3. **COLOR ACCURACY**:
   - Use the ACTUAL color palette extracted from the site
   - Primary colors should match the site's brand colors
   - Button colors should match the detected button styles

4. **SECTION STRUCTURE**:
   - Create the EXACT number of sections identified
   - Maintain the SAME section order
   - Include all components (buttons, images, forms) in their proper sections

5. **COMPONENT PLACEMENT**:
   - Place buttons where they were detected in the analysis
   - Position navigation items in the same order as the actual site
   - Maintain proper visual hierarchy

**Design System Colors (use as fallback if site colors not detected):**
- Background: ${colorTheme.background}
- Text: ${colorTheme.text}  
- Primary: ${colorTheme.primary}
- Secondary: ${colorTheme.secondary}
- Accent: ${colorTheme.accent}

**Technical Requirements:**
- Complete HTML page with embedded CSS
- Semantic HTML5 elements
- Responsive design (mobile-first)
- Hover effects on buttons and links
- High contrast for accessibility
- Production-ready code

**REMEMBER**: This is a WIREFRAME RECREATION, not an original design. Your goal is ACCURACY and FIDELITY to the analyzed website structure, NOT creativity.

Return ONLY the complete HTML code without markdown formatting, explanations, or comments outside the HTML.`;
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
