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
const { fixWireframeImages } = require("../utils/imagePlaceholders");

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

        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        const paragraphs = document.querySelectorAll("p");

        [...headings, ...paragraphs].forEach((el) => {
          const styles = window.getComputedStyle(el);
          if (styles.fontFamily) fonts.add(styles.fontFamily);
          if (styles.fontSize) fontSizes.add(styles.fontSize);
          if (styles.fontWeight) fontWeights.add(styles.fontWeight);
        });

        return {
          fonts: Array.from(fonts).slice(0, 5),
          sizes: Array.from(fontSizes).slice(0, 10),
          weights: Array.from(fontWeights).slice(0, 5),
        };
      };

      // NEW: Extract spacing patterns
      const extractSpacing = () => {
        const paddings = new Set();
        const margins = new Set();
        const gaps = new Set();

        const containers = document.querySelectorAll(
          "section, div, header, footer, nav, main"
        );
        containers.forEach((el) => {
          const styles = window.getComputedStyle(el);
          if (styles.padding !== "0px") paddings.add(styles.padding);
          if (styles.margin !== "0px") margins.add(styles.margin);
          if (styles.gap && styles.gap !== "normal") gaps.add(styles.gap);
        });

        return {
          paddings: Array.from(paddings).slice(0, 10),
          margins: Array.from(margins).slice(0, 10),
          gaps: Array.from(gaps).slice(0, 5),
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
            const forms = section.querySelectorAll(
              "form, input, textarea, select"
            );
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
              imageAlts: Array.from(images)
                .slice(0, 5)
                .map((img) => img.alt || "")
                .filter((t) => t),
              hasLinks: links.length > 0,
              linkCount: links.length,
              linkTexts: Array.from(links)
                .slice(0, 5)
                .map((l) => getTextContent(l))
                .filter((t) => t),
              hasForms: forms.length > 0,
              formElementCount: forms.length,
              hasParagraphs: paragraphs.length > 0,
              paragraphCount: paragraphs.length,
              paragraphSamples: Array.from(paragraphs)
                .slice(0, 2)
                .map((p) => getTextContent(p))
                .filter((t) => t),
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

      // Enhanced: Navigation analysis with MORE details
      const analyzeNavigation = () => {
        const navElements = document.querySelectorAll(
          'nav, [role="navigation"], header nav, .navbar, .nav'
        );
        const navLinks = [];

        navElements.forEach((nav) => {
          const links = nav.querySelectorAll("a");
          links.forEach((link) => {
            const text = getTextContent(link);
            const styles = window.getComputedStyle(link);
            if (text && text.length > 0 && text.length < 100) {
              navLinks.push({
                text: text,
                href: link.getAttribute("href") || "#",
                position: link.getBoundingClientRect(),
                styles: {
                  color: styles.color,
                  fontSize: styles.fontSize,
                  fontWeight: styles.fontWeight,
                  textDecoration: styles.textDecoration,
                  padding: styles.padding,
                },
              });
            }
          });
        });

        return navLinks.slice(0, 20); // Increased from 15 to 20
      };

      // NEW: Analyze visual hierarchy
      const analyzeHierarchy = () => {
        const h1 = document.querySelectorAll("h1");
        const h2 = document.querySelectorAll("h2");
        const h3 = document.querySelectorAll("h3");
        const body = document.body;

        return {
          h1Count: h1.length,
          h1Styles: h1.length > 0 ? getComputedStyles(h1[0]) : null,
          h2Count: h2.length,
          h2Styles: h2.length > 0 ? getComputedStyles(h2[0]) : null,
          h3Count: h3.length,
          h3Styles: h3.length > 0 ? getComputedStyles(h3[0]) : null,
          bodyStyles: getComputedStyles(body),
        };
      };

      return {
        title: document.title || "",
        url: window.location.href,
        colorPalette: extractColorPalette(),
        typography: extractTypography(),
        spacing: extractSpacing(),
        hierarchy: analyzeHierarchy(),
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

    // BUILD exact CSS from extracted data (don't trust AI with this!)
    const exactCSS = buildExactCSSFromAnalysis(analysis);
    context.log(`🎨 Generated exact CSS with ${exactCSS.length} characters`);

    // Generate wireframe using OpenAI (for structure only)
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

    // INJECT EXACT CSS into the wireframe (replace AI's generic styles)
    wireframeHtml = injectExactCSS(wireframeHtml, exactCSS);
    context.log(`💉 Injected exact CSS into wireframe HTML`);

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

    // Apply image processing to fix broken image references
    const processedHtml = fixWireframeImages(wireframeHtml);
    context.log("🖼️ Applied image placeholder processing");

    // Success response
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        html: processedHtml,
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
          // NEW: Include enhanced analysis data
          colorPalette: analysis.colorPalette || [],
          typography: analysis.typography || null,
          spacing: analysis.spacing || null,
          hierarchy: analysis.hierarchy || null,
          detailedSections: (analysis.detailedSections || []).length,
          navigationLinks: (analysis.navigationLinks || []).length,
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
    typography,
    spacing,
    hierarchy,
    bodyLayout,
    headerLayout,
    mainLayout,
  } = analysis;

  let prompt = `⚠️⚠️⚠️ THIS IS A WEBSITE CLONING REQUEST, NOT A REDESIGN ⚠️⚠️⚠️

🎯 TASK: Create a HIGH-FIDELITY HTML replica that looks NEARLY IDENTICAL to the real website.
- Use REAL colors from the site (not wireframe grays)
- Use EXACT text content provided (not placeholder text)
- Match ACTUAL layout (not simplified boxes)
- Copy REAL spacing and sizing (not estimated values)
- This should look like a SCREENSHOT of the site, not a sketch!

🎯 MAXIMUM ACCURACY WIREFRAME RECREATION REQUEST\n\n`;
  prompt += `Website: "${title}" (${analysis.url})\n\n`;

  // NEW: Typography system
  if (typography && typography.fonts.length > 0) {
    prompt += `📝 TYPOGRAPHY SYSTEM:\n`;
    prompt += `- Font Families: ${typography.fonts.slice(0, 3).join(", ")}\n`;
    if (typography.sizes.length > 0) {
      prompt += `- Font Sizes Detected: ${typography.sizes
        .slice(0, 5)
        .join(", ")}\n`;
    }
    if (typography.weights.length > 0) {
      prompt += `- Font Weights: ${typography.weights.join(", ")}\n`;
    }
    prompt += `\n`;
  }

  // NEW: Visual hierarchy
  if (hierarchy) {
    prompt += `📊 VISUAL HIERARCHY:\n`;
    if (hierarchy.h1Styles) {
      prompt += `- H1 (${hierarchy.h1Count}): ${hierarchy.h1Styles.fontSize}, weight: ${hierarchy.h1Styles.fontWeight}, color: ${hierarchy.h1Styles.color}\n`;
    }
    if (hierarchy.h2Styles) {
      prompt += `- H2 (${hierarchy.h2Count}): ${hierarchy.h2Styles.fontSize}, weight: ${hierarchy.h2Styles.fontWeight}, color: ${hierarchy.h2Styles.color}\n`;
    }
    if (hierarchy.h3Styles) {
      prompt += `- H3 (${hierarchy.h3Count}): ${hierarchy.h3Styles.fontSize}, weight: ${hierarchy.h3Styles.fontWeight}\n`;
    }
    prompt += `\n`;
  }

  // NEW: Spacing patterns
  if (spacing && (spacing.paddings.length > 0 || spacing.margins.length > 0)) {
    prompt += `📏 SPACING PATTERNS:\n`;
    if (spacing.paddings.length > 0) {
      prompt += `- Common Paddings: ${spacing.paddings
        .slice(0, 3)
        .join(", ")}\n`;
    }
    if (spacing.gaps.length > 0) {
      prompt += `- Common Gaps: ${spacing.gaps.join(", ")}\n`;
    }
    prompt += `\n`;
  }

  // Enhanced: Include detected layout patterns
  prompt += `📐 LAYOUT PATTERNS DETECTED:\n`;
  prompt += `- Body Layout: ${bodyLayout}\n`;
  prompt += `- Header Layout: ${headerLayout}\n`;
  prompt += `- Main Layout: ${mainLayout}\n\n`;

  // Enhanced: Include actual color palette with more detail
  if (colorPalette && colorPalette.length > 0) {
    prompt += `🎨 ACTUAL COLOR PALETTE FROM SITE (Use these EXACT colors):\n`;
    colorPalette.slice(0, 10).forEach((color, i) => {
      prompt += `- Color ${i + 1}: ${color}\n`;
    });
    prompt += `⚠️ CRITICAL: Use these exact colors, not generic wireframe grays!\n\n`;
  }

  // Enhanced: Detailed navigation with styling info
  if (navigationLinks && navigationLinks.length > 0) {
    prompt += `🧭 NAVIGATION STRUCTURE (Replicate EXACTLY):\n`;
    navigationLinks.forEach((link, i) => {
      prompt += `${i + 1}. "${link.text}"`;
      if (link.styles && link.styles.fontSize) {
        prompt += ` (size: ${link.styles.fontSize}, weight: ${link.styles.fontWeight})`;
      }
      prompt += `\n`;
    });
    prompt += `⚠️ Use these EXACT link texts in the EXACT order!\n\n`;
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

  // Enhanced: Detailed section-by-section breakdown with MORE info
  if (detailedSections && detailedSections.length > 0) {
    prompt += `\n🔍 DETAILED SECTIONS (Recreate PRECISELY, section by section):\n\n`;
    detailedSections.forEach((section) => {
      prompt += `══════ SECTION ${section.index} ══════\n`;
      if (section.heading) {
        prompt += `📌 ${section.headingTag.toUpperCase()}: "${
          section.heading
        }"\n`;
      }
      prompt += `📐 Layout: ${section.layout}`;
      if (section.styles && section.styles.display) {
        prompt += ` (display: ${section.styles.display})`;
      }
      prompt += `\n`;

      if (section.styles && section.styles.backgroundColor) {
        prompt += `🎨 Background: ${section.styles.backgroundColor}\n`;
      }

      if (section.styles && section.styles.padding) {
        prompt += `📏 Padding: ${section.styles.padding}\n`;
      }

      if (section.hasParagraphs && section.paragraphSamples.length > 0) {
        prompt += `📝 Content samples: ${section.paragraphSamples
          .map((p) => `"${p.substring(0, 80)}..."`)
          .join(", ")}\n`;
      }

      if (section.hasButtons && section.buttonTexts.length > 0) {
        prompt += `🔘 Buttons (${section.buttonCount}): ${section.buttonTexts
          .map((t) => `"${t}"`)
          .join(", ")}\n`;
      }

      if (section.hasImages) {
        prompt += `🖼️ Images: ${section.imageCount} image(s)`;
        if (section.imageAlts.length > 0) {
          prompt += ` - Alt texts: ${section.imageAlts.join(", ")}`;
        }
        prompt += `\n`;
      }

      if (section.hasLinks && section.linkTexts.length > 0) {
        prompt += `🔗 Links (${section.linkCount}): ${section.linkTexts
          .map((t) => `"${t}"`)
          .join(", ")}\n`;
      }

      if (section.hasForms) {
        prompt += `📋 Forms: ${section.formElementCount} form element(s)\n`;
      }

      if (section.hasLists) {
        prompt += `📃 Lists: ${section.listCount} list(s)\n`;
      }

      if (section.styles && section.styles.actualWidth) {
        prompt += `📐 Dimensions: ${Math.round(
          section.styles.actualWidth
        )}px × ${Math.round(section.styles.actualHeight)}px\n`;
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

  prompt += `\n🎯 MAXIMUM ACCURACY REQUIREMENTS:\n`;
  prompt += `1. ⚠️ CRITICAL: Use EXACT navigation link texts in EXACT order\n`;
  prompt += `2. ⚠️ CRITICAL: Use EXACT button texts from each section\n`;
  prompt += `3. ⚠️ CRITICAL: Use EXACT heading texts provided\n`;
  prompt += `4. Use the EXACT color palette extracted (not generic grays!)\n`;
  prompt += `5. Match font sizes and weights from typography system\n`;
  prompt += `6. Match layout patterns (${bodyLayout}, ${headerLayout}, ${mainLayout})\n`;
  prompt += `7. Apply detected spacing patterns (padding, gaps)\n`;
  prompt += `8. Maintain visual hierarchy (H1 > H2 > H3 sizing)\n`;
  prompt += `9. Preserve section order and structure EXACTLY\n`;
  prompt += `10. Include all ${
    detailedSections ? detailedSections.length : 0
  } sections with their exact content\n`;
  prompt += `11. Use actual dimensions and positioning where provided\n`;
  prompt += `12. Include image placeholders using https://placehold.co/WIDTHxHEIGHT format with descriptive alt text\n`;
  prompt += `\n⚠️⚠️⚠️ DO NOT INVENT OR CHANGE ANY TEXT - COPY EXACTLY AS PROVIDED! ⚠️⚠️⚠️\n`;

  return prompt;
}

/**
 * Build exact CSS from extracted analysis data
 * This removes AI interpretation and applies exact values
 */
function buildExactCSSFromAnalysis(analysis) {
  const { colorPalette, typography, spacing, hierarchy } = analysis;

  let css = `
    /* ============================================
       EXACT CSS FROM WEBSITE ANALYSIS
       These values are extracted directly from the site
       ============================================ */
    
    :root {
      /* Exact Colors from Site */`;

  // Add exact color variables
  if (colorPalette && colorPalette.length > 0) {
    console.log(
      `🎨 Adding ${colorPalette.length} exact colors to CSS variables`
    );
    colorPalette.slice(0, 20).forEach((color, index) => {
      css += `\n      --site-color-${index + 1}: ${color};`;
    });
  }

  // Add exact typography variables
  if (typography && typography.fonts.length > 0) {
    css += `\n\n      /* Exact Fonts from Site */`;
    typography.fonts.slice(0, 3).forEach((font, index) => {
      css += `\n      --site-font-${index + 1}: ${font};`;
    });
  }

  if (typography && typography.sizes.length > 0) {
    css += `\n\n      /* Exact Font Sizes from Site */`;
    typography.sizes.slice(0, 10).forEach((size, index) => {
      css += `\n      --site-fontsize-${index + 1}: ${size};`;
    });
  }

  // Add exact spacing variables
  if (spacing && spacing.paddings.length > 0) {
    css += `\n\n      /* Exact Padding Patterns from Site */`;
    spacing.paddings.slice(0, 5).forEach((pad, index) => {
      css += `\n      --site-padding-${index + 1}: ${pad};`;
    });
  }

  if (spacing && spacing.gaps.length > 0) {
    css += `\n\n      /* Exact Gap Patterns from Site */`;
    spacing.gaps.slice(0, 5).forEach((gap, index) => {
      css += `\n      --site-gap-${index + 1}: ${gap};`;
    });
  }

  css += `\n    }\n\n`;

  // Apply hierarchy styles
  if (hierarchy) {
    if (hierarchy.h1) {
      css += `    h1 {\n`;
      css += `      font-size: ${hierarchy.h1.fontSize || "48px"};\n`;
      css += `      font-weight: ${hierarchy.h1.fontWeight || "700"};\n`;
      if (hierarchy.h1.color) css += `      color: ${hierarchy.h1.color};\n`;
      css += `    }\n\n`;
    }

    if (hierarchy.h2) {
      css += `    h2 {\n`;
      css += `      font-size: ${hierarchy.h2.fontSize || "32px"};\n`;
      css += `      font-weight: ${hierarchy.h2.fontWeight || "600"};\n`;
      if (hierarchy.h2.color) css += `      color: ${hierarchy.h2.color};\n`;
      css += `    }\n\n`;
    }

    if (hierarchy.h3) {
      css += `    h3 {\n`;
      css += `      font-size: ${hierarchy.h3.fontSize || "24px"};\n`;
      css += `      font-weight: ${hierarchy.h3.fontWeight || "600"};\n`;
      if (hierarchy.h3.color) css += `      color: ${hierarchy.h3.color};\n`;
      css += `    }\n\n`;
    }
  }

  // Add body typography
  if (typography && typography.fonts.length > 0) {
    css += `    body {\n`;
    css += `      font-family: var(--site-font-1), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n`;
    if (typography.sizes.length > 0) {
      css += `      font-size: ${
        typography.sizes[Math.floor(typography.sizes.length / 2)] || "16px"
      };\n`;
    }
    css += `    }\n\n`;
  }

  return css;
}

/**
 * Inject exact CSS into the HTML wireframe AND force replace generic styles
 * This is more aggressive than just CSS variables - it directly replaces colors and fonts
 */
function injectExactCSS(html, exactCSS) {
  // First inject our CSS variables
  let updatedHtml = html;

  const styleRegex = /<style>([\s\S]*?)<\/style>/i;

  if (styleRegex.test(updatedHtml)) {
    // Replace the entire style section with exact CSS + existing styles
    updatedHtml = updatedHtml.replace(styleRegex, (match, existingStyles) => {
      return `<style>\n${exactCSS}\n\n/* Original AI-generated styles (enhanced with exact values above) */\n${existingStyles}\n</style>`;
    });
  } else {
    // No style tag found - inject into <head>
    updatedHtml = updatedHtml.replace(
      "</head>",
      `<style>\n${exactCSS}\n</style>\n</head>`
    );
  }

  // AGGRESSIVE: Force replace common generic colors with extracted ones
  const colorRegex =
    /#(?:333|444|555|666|777|888|999|aaa|bbb|ccc|ddd|eee|f5f5f5|e0e0e0)\b/gi;
  const rgbGenericRegex =
    /rgb\(\s*(?:51|68|85|102|119|136|153|170|187|204|221|238|240|224),\s*(?:51|68|85|102|119|136|153|170|187|204|221|238|240|224),\s*(?:51|68|85|102|119|136|153|170|187|204|221|238|240|224)\s*\)/gi;

  // Replace generic hex colors with real extracted colors
  let colorIndex = 0;
  updatedHtml = updatedHtml.replace(colorRegex, () => {
    const replacement = `var(--site-color-${(colorIndex % 20) + 1})`;
    colorIndex++;
    return replacement;
  });

  // Replace generic RGB colors
  updatedHtml = updatedHtml.replace(rgbGenericRegex, () => {
    const replacement = `var(--site-color-${(colorIndex % 20) + 1})`;
    colorIndex++;
    return replacement;
  });

  // Force replace common generic fonts
  updatedHtml = updatedHtml.replace(
    /font-family:\s*(['"]?)Arial\1/gi,
    "font-family: var(--site-font-1)"
  );
  updatedHtml = updatedHtml.replace(
    /font-family:\s*(['"]?)Helvetica\1/gi,
    "font-family: var(--site-font-1)"
  );
  updatedHtml = updatedHtml.replace(
    /font-family:\s*(['"]?)sans-serif\1/gi,
    "font-family: var(--site-font-1)"
  );

  return updatedHtml;
}

function getSystemPrompt(designSystem) {
  // Use the main WIREFRAME_COLORS object directly
  const colorTheme = WIREFRAME_COLORS;

  return `You are an EXPERT wireframe designer with OBSESSIVE ATTENTION TO DETAIL specializing in ${designSystem} design system.

🎯 YOUR MISSION: Create a PIXEL-PERFECT HTML wireframe that EXACTLY REPLICATES the analyzed website.

⚠️⚠️⚠️ CSS VARIABLES ARE PROVIDED - YOU MUST USE THEM! ⚠️⚠️⚠️

The <style> section will contain CSS variables extracted from the real website:
- --site-color-1, --site-color-2, etc. (EXACT colors from site)
- --site-font-1, --site-font-2 (EXACT fonts from site)
- --site-fontsize-1, --site-fontsize-2, etc. (EXACT font sizes)
- --site-padding-1, --site-padding-2, etc. (EXACT padding values)
- --site-gap-1, --site-gap-2, etc. (EXACT gap values)

🚨 YOU MUST USE THESE VARIABLES IN YOUR HTML:
- For backgrounds: background: var(--site-color-1);
- For text colors: color: var(--site-color-2);
- For fonts: font-family: var(--site-font-1);
- For padding: padding: var(--site-padding-1);
- DO NOT write your own rgb() or hex values - USE THE VARIABLES!

⚠️⚠️⚠️ THIS IS A REPLICATION JOB, NOT A DESIGN JOB! ⚠️⚠️⚠️
- You are NOT redesigning or improving the site
- You are NOT creating a "wireframe-style" or "sketch-style" version
- You ARE creating a HIGH-FIDELITY REPLICA that looks almost identical to the real site
- Think of this as CLONING the website, not wireframing it

⚠️⚠️⚠️ CRITICAL ACCURACY REQUIREMENTS (NON-NEGOTIABLE): ⚠️⚠️⚠️

1. **EXACT TEXT MATCHING** (ABSOLUTELY MANDATORY):
   - Copy EVERY navigation link text EXACTLY as provided - character for character
   - Copy EVERY button text EXACTLY as provided - no paraphrasing
   - Copy EVERY heading text EXACTLY as provided - no changes
   - Copy ALL content samples EXACTLY as provided
   - DO NOT invent, change, abbreviate, or rephrase ANY text
   - If text says "Azure training" use "Azure training" NOT "Azure Training" or "Training"
   - EXAMPLE: If navigation shows ["Products", "Solutions", "Resources"] you MUST use those exact 3 words in that exact order

2. **EXACT COLOR MATCHING** (MANDATORY):
   - Use the EXACT rgb() or rgba() values provided in the color palette
   - DO NOT use generic grays (#ccc, #ddd, #eee) - use ACTUAL site colors
   - Match background colors EXACTLY for each section
   - Match text colors EXACTLY from the palette
   - Match button colors EXACTLY from detected styles
   - EXAMPLE: If analysis shows "Purple banner: rgb(93, 58, 155)" you MUST use rgb(93, 58, 155) NOT #555 or #6c5ce7
   - EXAMPLE: If analysis shows "Blue button: #0078d4" you MUST use #0078d4 NOT generic blue or #007bff

3. **LAYOUT PATTERN MATCHING** (MANDATORY):
   - If analysis shows "flexbox" - use display: flex with exact flex properties
   - If analysis shows "grid" - use display: grid with exact grid properties
   - If analysis shows "block" - use display: block
   - Match flex-direction, justify-content, align-items EXACTLY as detected
   - Apply gap/padding values as specified in spacing patterns
   - EXAMPLE: If header shows "display: flex, justify-content: space-between, padding: 20px 40px" you MUST use exactly those CSS properties
   - EXAMPLE: If main content is "3-column grid with 30px gap" you MUST use display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;

4. **TYPOGRAPHY MATCHING** (MANDATORY):
   - Use the detected font families (or close web-safe alternatives)
   - Match font sizes EXACTLY as provided (e.g., H1: 48px, H2: 32px)
   - Match font weights EXACTLY (300, 400, 500, 600, 700)
   - Maintain the visual hierarchy: H1 must be larger than H2, H2 larger than H3
   - Use line-height and letter-spacing if provided

5. **SECTION STRUCTURE** (MANDATORY):
   - Create EXACTLY the number of sections identified in the analysis
   - Maintain EXACT section order (Section 1, Section 2, Section 3...)
   - Include ALL components in each section: buttons, images, links, forms, paragraphs, lists
   - Use section backgrounds EXACTLY as detected
   - Apply section padding/margins as specified

6. **COMPONENT PLACEMENT** (MANDATORY):
   - Place buttons where they were detected with EXACT text
   - Position navigation items in EXACT order as provided
   - Include image placeholders using https://placehold.co/WIDTHxHEIGHT format with descriptive alt text
   - Show paragraph samples with actual content snippets
   - Include form elements where detected
   - Include lists where detected

7. **DIMENSIONAL ACCURACY**:
   - Use actual width/height dimensions when provided
   - Match container widths (e.g., 1200px, 100%, etc.)
   - Apply actual padding values (e.g., "20px 40px", "16px")
   - Apply actual gap values (e.g., "10px", "20px")

**Design System Colors (use as fallback ONLY if site colors not detected):**
- Background: ${colorTheme.background}
- Text: ${colorTheme.text}  
- Primary: ${colorTheme.primary}
- Secondary: ${colorTheme.secondary}
- Accent: ${colorTheme.accent}

**Technical Requirements:**
- Complete HTML5 page with embedded CSS in <style> tag
- Semantic HTML5 elements (header, nav, main, section, footer)
- Responsive design (mobile-first approach)
- Hover effects on interactive elements (buttons, links)
- WCAG AA accessibility compliance
- Clean, production-ready code

**OUTPUT FORMAT:**
- Return ONLY the HTML code
- NO markdown code blocks (no \`\`\`html)
- NO explanations or comments outside the HTML
- Start directly with <!DOCTYPE html>

⚠️⚠️⚠️ REMEMBER: This is WIREFRAME RECREATION, not design exploration! ⚠️⚠️⚠️
Your ONLY goal is MAXIMUM FIDELITY to the analyzed website.
ACCURACY > CREATIVITY. PRECISION > INTERPRETATION.

Copy everything EXACTLY. Do not improvise. Do not simplify. Do not beautify.
REPLICATE with OBSESSIVE PRECISION.`;
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
