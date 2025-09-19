const { app } = require("@azure/functions");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

/**
 * Website Analyzer Azure Function
 * Analyzes live websites to extract structure, components, and layout information
 * for accurate wireframe generation
 */

// Utility function to extract layout information from DOM
function extractLayoutInfo($) {
  const layoutInfo = {
    header: null,
    navigation: null,
    main: null,
    sidebar: null,
    footer: null,
    sections: [],
    components: [],
  };

  // Detect header
  const headerSelectors = [
    "header",
    '[role="banner"]',
    ".header",
    "#header",
    "nav:first-of-type",
  ];
  headerSelectors.forEach((selector) => {
    if (!layoutInfo.header && $(selector).length > 0) {
      const element = $(selector).first();
      layoutInfo.header = {
        selector,
        text: element.text().trim().substring(0, 200),
        height: element.height() || "auto",
        hasNav: element.find('nav, .nav, [role="navigation"]').length > 0,
      };
    }
  });

  // Detect navigation
  const navSelectors = [
    "nav",
    '[role="navigation"]',
    ".navigation",
    ".nav",
    ".navbar",
  ];
  navSelectors.forEach((selector) => {
    if (!layoutInfo.navigation && $(selector).length > 0) {
      const element = $(selector).first();
      const links = element
        .find("a")
        .map((i, el) => $(el).text().trim())
        .get();
      layoutInfo.navigation = {
        selector,
        links: links.slice(0, 10), // Limit to first 10 nav items
        isHorizontal:
          element.css("flex-direction") !== "column" &&
          element.css("display") !== "block",
      };
    }
  });

  // Detect main content area
  const mainSelectors = [
    "main",
    '[role="main"]',
    ".main",
    ".content",
    "#main",
    "#content",
  ];
  mainSelectors.forEach((selector) => {
    if (!layoutInfo.main && $(selector).length > 0) {
      const element = $(selector).first();
      layoutInfo.main = {
        selector,
        hasColumns: element.find('.column, .col, [class*="col-"]').length > 0,
        sections: element.find("section, .section").length,
      };
    }
  });

  // Detect sidebar
  const sidebarSelectors = [
    ".sidebar",
    ".aside",
    "aside",
    '[role="complementary"]',
  ];
  sidebarSelectors.forEach((selector) => {
    if (!layoutInfo.sidebar && $(selector).length > 0) {
      const element = $(selector).first();
      layoutInfo.sidebar = {
        selector,
        position: element.css("float") === "right" ? "right" : "left",
        width: element.width() || "auto",
      };
    }
  });

  // Detect footer
  const footerSelectors = [
    "footer",
    '[role="contentinfo"]',
    ".footer",
    "#footer",
  ];
  footerSelectors.forEach((selector) => {
    if (!layoutInfo.footer && $(selector).length > 0) {
      const element = $(selector).first();
      layoutInfo.footer = {
        selector,
        text: element.text().trim().substring(0, 200),
        hasColumns: element.find('.column, .col, [class*="col-"]').length > 0,
      };
    }
  });

  // Extract sections
  $("section, .section, [data-section]").each((i, element) => {
    if (i < 10) {
      // Limit to first 10 sections
      const $el = $(element);
      layoutInfo.sections.push({
        tag: element.tagName,
        classes: $el.attr("class") || "",
        text: $el.text().trim().substring(0, 150),
        hasImages: $el.find("img").length > 0,
        hasButtons: $el.find('button, .btn, [role="button"]').length > 0,
      });
    }
  });

  return layoutInfo;
}

// Function to extract color scheme and styling
function extractStyling($, html) {
  const styling = {
    primaryColors: [],
    fonts: [],
    layout: "unknown",
    components: [],
  };

  // Try to extract CSS from style tags
  const styles = [];
  $("style").each((i, style) => {
    styles.push($(style).html());
  });

  // Extract background colors from inline styles and common patterns
  const colorPattern =
    /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;
  const foundColors = html.match(colorPattern) || [];
  styling.primaryColors = [...new Set(foundColors)].slice(0, 5);

  // Detect layout type
  if ($(".container, .wrapper").length > 0) {
    styling.layout = "container";
  } else if ($('[class*="grid"], .row, [class*="flex"]').length > 0) {
    styling.layout = "grid";
  } else if ($('.column, .col, [class*="col-"]').length > 0) {
    styling.layout = "columns";
  }

  // Extract common components
  const components = [
    { name: "buttons", count: $('button, .btn, [role="button"]').length },
    { name: "forms", count: $("form").length },
    { name: "cards", count: $(".card, .item, .post").length },
    { name: "modals", count: $('.modal, [role="dialog"]').length },
    { name: "tabs", count: $('.tab, [role="tab"]').length },
    { name: "accordions", count: $(".accordion, .collapse").length },
  ];

  styling.components = components.filter((comp) => comp.count > 0);

  return styling;
}

// Function to generate wireframe prompt based on analysis
function generateWireframePrompt(analysis) {
  let prompt = `Create a wireframe matching this website analysis:\n\n`;

  // Layout structure
  prompt += `LAYOUT STRUCTURE:\n`;
  if (analysis.layout.header) {
    prompt += `- Header: ${analysis.layout.header.text.substring(0, 100)}\n`;
    if (analysis.layout.header.hasNav)
      prompt += `  * Contains navigation menu\n`;
  }

  if (analysis.layout.navigation) {
    prompt += `- Navigation: ${analysis.layout.navigation.links.join(", ")}\n`;
    prompt += `  * Style: ${
      analysis.layout.navigation.isHorizontal ? "Horizontal" : "Vertical"
    }\n`;
  }

  if (analysis.layout.main) {
    prompt += `- Main content area with ${analysis.layout.main.sections} sections\n`;
    if (analysis.layout.main.hasColumns) prompt += `  * Uses column layout\n`;
  }

  if (analysis.layout.sidebar) {
    prompt += `- Sidebar positioned on the ${analysis.layout.sidebar.position}\n`;
  }

  if (analysis.layout.footer) {
    prompt += `- Footer: ${analysis.layout.footer.text.substring(0, 100)}\n`;
    if (analysis.layout.footer.hasColumns)
      prompt += `  * Multi-column footer\n`;
  }

  // Sections
  if (analysis.layout.sections.length > 0) {
    prompt += `\nCONTENT SECTIONS:\n`;
    analysis.layout.sections.forEach((section, i) => {
      prompt += `${i + 1}. ${section.text.substring(0, 80)}${
        section.text.length > 80 ? "..." : ""
      }\n`;
      if (section.hasImages) prompt += `   * Contains images\n`;
      if (section.hasButtons) prompt += `   * Contains buttons/CTAs\n`;
    });
  }

  // Styling
  if (analysis.styling.primaryColors.length > 0) {
    prompt += `\nCOLOR SCHEME:\n`;
    prompt += `Primary colors: ${analysis.styling.primaryColors.join(", ")}\n`;
  }

  prompt += `\nLAYOUT TYPE: ${analysis.styling.layout}\n`;

  // Components
  if (analysis.styling.components.length > 0) {
    prompt += `\nCOMPONENTS FOUND:\n`;
    analysis.styling.components.forEach((comp) => {
      prompt += `- ${comp.name}: ${comp.count}\n`;
    });
  }

  prompt += `\n=== INSTRUCTIONS ===\n`;
  prompt += `Create a wireframe that matches this structure exactly. Use Microsoft Design System components and maintain the same layout hierarchy, navigation structure, and content organization. Make it responsive and professional.`;

  return prompt;
}

app.http("websiteAnalyzer", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log("🔍 Website Analyzer function triggered");

    try {
      const requestBody = await request.text();
      let body;

      try {
        body = JSON.parse(requestBody);
      } catch (parseError) {
        context.log("❌ JSON parsing failed:", parseError);
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: false,
            error: "Invalid JSON in request body",
            details: parseError.message,
          }),
        };
      }

      const { url, options = {} } = body;

      if (!url) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: false,
            error: "URL is required",
          }),
        };
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (urlError) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: false,
            error: "Invalid URL format",
          }),
        };
      }

      context.log(`📋 Analyzing website: ${url}`);

      // Launch browser with error handling
      let browser;
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--remote-debugging-port=9222",
          ],
        });
      } catch (browserError) {
        context.log("❌ Browser launch failed:", browserError);
        return {
          status: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: false,
            error: "Failed to launch browser",
            details: browserError.message,
          }),
        };
      }

      let page;
      try {
        page = await browser.newPage();

        // Set viewport for consistent analysis
        await page.setViewport({ width: 1200, height: 800 });

        // Set user agent to avoid bot blocking
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        // Navigate to page with timeout
        context.log(`🌐 Navigating to: ${url}`);
        await page.goto(url, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });

        // Wait for dynamic content to load
        await page.waitForTimeout(3000);

        // Extract HTML content
        const html = await page.content();

        // Take screenshot for reference
        const screenshot = await page.screenshot({
          fullPage: true,
          type: "png",
          encoding: "base64",
        });

        // Get page title and meta description
        const pageInfo = await page.evaluate(() => {
          return {
            title: document.title,
            description:
              document
                .querySelector('meta[name="description"]')
                ?.getAttribute("content") || "",
            url: window.location.href,
          };
        });

        // Parse HTML with Cheerio for analysis
        const $ = cheerio.load(html);

        // Extract layout structure
        const layoutInfo = extractLayoutInfo($);

        // Extract styling information
        const stylingInfo = extractStyling($, html);

        // Generate wireframe prompt
        const wireframePrompt = generateWireframePrompt({
          layout: layoutInfo,
          styling: stylingInfo,
        });

        const analysis = {
          url,
          pageInfo,
          layout: layoutInfo,
          styling: stylingInfo,
          screenshot: `data:image/png;base64,${screenshot}`,
          wireframePrompt,
          analyzedAt: new Date().toISOString(),
        };

        context.log("✅ Website analysis completed successfully");

        return {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
          },
          body: JSON.stringify({
            success: true,
            analysis,
          }),
        };
      } finally {
        if (page) await page.close();
        if (browser) await browser.close();
      }
    } catch (error) {
      context.log("❌ Website analysis error:", error);

      return {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: false,
          error: "Website analysis failed",
          details: error.message,
        }),
      };
    }
  },
});
