/**
 * Website Analyzer Azure Function
 * Analyzes live websites to ex    // Wait for common content elements to load
    try {
      await page.waitForSelector('body', { timeout: 10000 });
      
      // Wait for specific elements that indicate the page has loaded
      const contentSelectors = [
        'nav', '.nav', '.navigation', 
        'main', '.main', '.content',
        'h1, h2, h3', '.title',
        '[role="navigation"]', '[role="main"]'
      ];
      
      // Try to wait for at least one content indicator
      for (const selector of contentSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          context.log(`✅ Found content: ${selector}`);
          break;
        } catch (e) {
          // Continue trying other selectors
        }
      }
      
      // Additional wait for dynamic content
      await page.waitForTimeout(5000);
      
      // Scroll to load any lazy content
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.waitForTimeout(2000);
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
    } catch (e) {
      context.log('⚠️ Content loading timeout, proceeding with analysis');
    }ructure, components, and layout information
 * for accurate wireframe generation
 */

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

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

  context.log("🔍 Website Analyzer function triggered");

  let browser;

  try {
    // Parse request body
    const { url } = req.body;

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

    context.log(`📋 Starting analysis for: ${url}`);

    // Launch browser
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

    // Navigate to page with extended waiting
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 45000,
    });

    // Wait for common content elements to load
    try {
      await page.waitForSelector("body", { timeout: 10000 });
      // Wait a bit more for dynamic content
      await page.waitForTimeout(3000);
    } catch (e) {
      context.log("⚠️ Content loading timeout, proceeding with analysis");
    }

    // Get page content
    const content = await page.content();
    const title = await page.title();

    // Parse HTML (skipping screenshot for better performance)
    const $ = cheerio.load(content);

    // Extract basic information
    const analysis = {
      url: url,
      pageInfo: {
        title: title,
        description: $('meta[name="description"]').attr("content") || "",
        url: url,
      },
      layout: {
        header: extractHeader($),
        navigation: extractNavigation($),
        main: extractMain($),
        sidebar: extractSidebar($),
        footer: extractFooter($),
        sections: extractSections($),
      },
      styling: {
        colors: extractColors($),
        typography: extractTypography($),
        components: extractComponents($),
      },
    };

    await browser.close();

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        analysis: analysis,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    context.log("❌ Website analysis error:", error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        context.log("Browser close error:", closeError);
      }
    }

    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Website analysis failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

// Helper functions for content extraction
function extractHeader($) {
  const header = $('header, .header, [role="banner"]').first();
  if (header.length === 0) return null;

  return {
    text: header.text().substring(0, 200).trim(),
    hasNav: header.find("nav, .nav, .navigation").length > 0,
  };
}

function extractNavigation($) {
  const navSelectors = [
    "nav, .nav, .navigation, .navbar",
    "[role='navigation']",
    ".nav-menu, .menu, .main-nav, .primary-nav",
    ".header nav, header nav, .site-header nav",
    "ul.nav, ul.menu, .nav-list",
    ".topnav, .top-nav, .main-menu",
    ".sidebar-nav, .side-nav, .nav-sidebar",
    "[data-testid*='nav'], [data-cy*='nav']", // Modern test attributes
    ".MuiAppBar nav, .chakra-ui nav", // Popular UI library patterns
  ];

  let nav = null;
  const foundNavs = [];

  // Find all navigation elements
  for (const selector of navSelectors) {
    const elements = $(selector);
    elements.each((i, el) => {
      foundNavs.push($(el));
    });
  }

  // Use the navigation element with the most links
  let bestNav = null;
  let maxLinks = 0;

  foundNavs.forEach((navEl) => {
    const linkCount = navEl.find(
      "a, button, [role='menuitem'], [role='button']"
    ).length;
    if (linkCount > maxLinks) {
      maxLinks = linkCount;
      bestNav = navEl;
    }
  });

  nav = bestNav || foundNavs[0];

  if (!nav || nav.length === 0) {
    // Fallback: look for any significant list of links
    const linkGroups = $("ul, ol, .menu, .links").filter(function () {
      return $(this).find("a").length >= 3;
    });
    nav = linkGroups.first();
  }

  if (!nav || nav.length === 0) return { links: [] };

  const links = [];
  nav.find("a, button, [role='menuitem'], [role='button']").each((i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    const href = $el.attr("href") || $el.attr("data-href") || "";
    const ariaLabel = $el.attr("aria-label") || "";

    if ((text || ariaLabel) && links.length < 25) {
      links.push({
        text: text || ariaLabel,
        href: href,
        isButton: el.name === "button" || $el.attr("role") === "button",
        hasDropdown: $el.find('[role="menu"], .dropdown, .submenu').length > 0,
      });
    }
  });

  return {
    links,
    structure: nav.get(0)?.tagName || "unknown",
    hasSubNavs: nav.find('.dropdown, .submenu, [role="menu"]').length > 0,
  };
}

function extractMain($) {
  const mainSelectors = [
    "main, .main, .content, #content",
    "[role='main']",
    ".main-content, .page-content",
    ".container .content, .wrapper .content",
  ];

  let main = null;
  for (const selector of mainSelectors) {
    main = $(selector).first();
    if (main.length > 0) break;
  }

  if (main.length === 0) {
    // Fallback to body content, excluding header/footer
    main = $("body").clone();
    main.find("header, .header, footer, .footer, nav, .nav").remove();
  }

  const headings = [];
  main.find("h1, h2, h3, h4, h5, h6").each((i, el) => {
    const text = $(el).text().trim();
    if (text && headings.length < 10) {
      headings.push({
        level: parseInt(el.name.charAt(1)),
        text: text,
      });
    }
  });

  return {
    text: main.text().substring(0, 1000).trim(),
    headings: headings,
    hasForm: main.find("form").length > 0,
    hasTable: main.find("table").length > 0,
  };
}

function extractSidebar($) {
  const sidebar = $("aside, .sidebar, .side-nav").first();
  if (sidebar.length === 0) return null;

  return {
    text: sidebar.text().substring(0, 200).trim(),
  };
}

function extractFooter($) {
  const footer = $('footer, .footer, [role="contentinfo"]').first();
  if (footer.length === 0) return null;

  return {
    text: footer.text().substring(0, 200).trim(),
  };
}

function extractSections($) {
  const sections = [];

  // Look for semantic sections
  $("section, .section, article, .article, .card, .panel, .box").each(
    (i, el) => {
      if (sections.length < 10) {
        const $el = $(el);
        const text = $el.text().trim();
        const heading = $el
          .find("h1, h2, h3, h4, h5, h6")
          .first()
          .text()
          .trim();

        if (text && text.length > 20) {
          sections.push({
            type: el.name || "section",
            heading: heading || "",
            text: text.substring(0, 200),
            hasImages: $el.find("img").length > 0,
            hasButtons: $el.find('button, .btn, [role="button"]').length > 0,
            hasLinks: $el.find("a").length > 0,
          });
        }
      }
    }
  );

  // If no sections found, look for divs with substantial content
  if (sections.length === 0) {
    $("div").each((i, el) => {
      if (sections.length < 5) {
        const $el = $(el);
        const text = $el.text().trim();

        // Only consider divs with meaningful content
        if (text.length > 100 && text.length < 1000) {
          const heading = $el
            .find("h1, h2, h3, h4, h5, h6")
            .first()
            .text()
            .trim();
          sections.push({
            type: "content-block",
            heading: heading || "",
            text: text.substring(0, 200),
            hasImages: $el.find("img").length > 0,
            hasButtons: $el.find('button, .btn, [role="button"]').length > 0,
            hasLinks: $el.find("a").length > 0,
          });
        }
      }
    });
  }

  return sections;
}

function extractColors($) {
  // Simple color extraction - would need more sophisticated analysis
  return {
    background: "#ffffff",
    text: "#000000",
    primary: "#0066cc",
    secondary: "#666666",
  };
}

function extractTypography($) {
  return {
    fontFamily: "sans-serif",
    fontSize: "16px",
    lineHeight: "1.5",
  };
}

function extractComponents($) {
  const components = [];

  // Count buttons
  const buttonCount = $(
    'button, .btn, input[type="button"], input[type="submit"]'
  ).length;
  if (buttonCount > 0) components.push({ type: "button", count: buttonCount });

  // Count forms
  const formCount = $("form").length;
  if (formCount > 0) components.push({ type: "form", count: formCount });

  // Count images
  const imageCount = $("img").length;
  if (imageCount > 0) components.push({ type: "image", count: imageCount });

  return components;
}
