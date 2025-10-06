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
    // Parse request body with validation
    const { url } = req.body || {};

    if (!url) {
      context.log("❌ Validation error: URL is required");
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: "URL is required",
          code: "MISSING_URL",
        }),
      };
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      context.log(`❌ Invalid URL format: ${url}`);
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: "Invalid URL format",
          code: "INVALID_URL",
          details: urlError.message,
        }),
      };
      return;
    }

    context.log(`📋 Starting analysis for: ${url}`);

    // Launch browser with error handling
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      context.log("✅ Browser launched successfully");
    } catch (browserError) {
      context.log(`❌ Failed to launch browser: ${browserError.message}`);
      context.res = {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: "Failed to launch browser",
          code: "BROWSER_LAUNCH_ERROR",
          details: browserError.message,
        }),
      };
      return;
    }

    const page = await browser.newPage();

    // Set user agent and viewport
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setViewport({ width: 1200, height: 800 });

    // Detect if it's likely a SPA (Single Page Application)
    const isSPA =
      url.includes("react") ||
      url.includes("vue") ||
      url.includes("angular") ||
      url.includes("app") ||
      url.includes("dashboard");

    context.log(
      `🎯 Page type: ${isSPA ? "SPA (longer wait times)" : "Standard"}`
    );

    // Navigate to page with error handling
    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000, // 60 second timeout
      });
      context.log("✅ Page loaded successfully");
    } catch (navigationError) {
      context.log(`⚠️ Navigation error: ${navigationError.message}`);

      // Try with a more lenient wait condition
      try {
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        context.log("✅ Page loaded with fallback method");
      } catch (fallbackError) {
        await browser.close();
        context.res = {
          status: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: "Failed to load page",
            code: "PAGE_LOAD_ERROR",
            details: fallbackError.message,
          }),
        };
        return;
      }
    }

    // Enhanced content loading strategy
    try {
      // Wait for body to be available
      await page.waitForSelector("body", { timeout: 10000 });
      context.log("✅ Body loaded");

      // Wait for common content indicators
      const contentSelectors = [
        "nav",
        ".nav",
        ".navigation",
        '[role="navigation"]',
        "main",
        ".main",
        ".content",
        '[role="main"]',
        "h1, h2, h3",
        ".title",
        ".heading",
        "header",
        ".header",
        '[role="banner"]',
        "article",
        ".article",
        ".post",
        "footer",
        ".footer",
        '[role="contentinfo"]',
      ];

      // Try to wait for multiple indicators
      let foundCount = 0;
      for (const selector of contentSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          foundCount++;
          context.log(`✅ Found: ${selector}`);
          if (foundCount >= 3) break; // Found enough indicators
        } catch (e) {
          // Continue trying other selectors
        }
      }

      // Additional wait for SPAs or if few indicators found
      if (isSPA || foundCount < 2) {
        context.log(
          "⏳ Waiting longer for dynamic content (SPA detected or low indicator count)..."
        );
        await page.waitForTimeout(10000); // 10 seconds for SPAs
      } else {
        await page.waitForTimeout(5000); // 5 seconds for standard sites
      }

      // Aggressive scrolling to trigger lazy loading
      context.log("📜 Scrolling to trigger lazy-loaded content...");
      await page.evaluate(async () => {
        // Scroll to 25%
        window.scrollTo(0, document.body.scrollHeight * 0.25);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Scroll to 50%
        window.scrollTo(0, document.body.scrollHeight * 0.5);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Scroll to 75%
        window.scrollTo(0, document.body.scrollHeight * 0.75);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Scroll back to top
        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // Final wait for any lazy-loaded content to render
      await page.waitForTimeout(3000);

      // Wait for network to be idle again after scrolling
      try {
        await page.waitForNetworkIdle({ timeout: 5000, idleTime: 500 });
        context.log("✅ Network idle after scrolling");
      } catch (e) {
        context.log("⚠️ Network still active, proceeding anyway");
      }

      context.log("✅ Content loading complete");
    } catch (e) {
      context.log("⚠️ Content loading timeout:", e.message);
      context.log("📝 Proceeding with analysis of available content");
    }

    // Get page content
    const content = await page.content();
    const title = await page.title();

    // Extract colors, typography, and layout from live page (using Puppeteer)
    const extractedColors = await extractColorsFromPage(page, context);
    const extractedTypography = await extractTypographyFromPage(page, context);
    const extractedLayout = await extractLayoutMeasurements(page, context);
    const advancedCSS = await extractAdvancedCSS(page, context);
    const detectedFrameworks = await detectComponentLibraries(page, context);

    // Phase 2: Capture screenshot for reference
    const screenshotData = await captureScreenshot(page, context);

    // Phase 2: Test responsive breakpoints
    const responsiveData = await testResponsiveBreakpoints(page, context);

    // Phase 3: Interactive & Dynamic Analysis
    const interactiveStates = await extractInteractiveStates(page, context);
    const animations = await extractAnimations(page, context);
    const formIntelligence = await extractFormIntelligence(page, context);
    const loadingStates = await extractLoadingStates(page, context);

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
        measurements: extractedLayout, // Phase 2: Add layout measurements
      },
      styling: {
        colors: extractedColors,
        typography: extractedTypography,
        components: extractComponents($),
        advancedCSS: advancedCSS, // Phase 2: Advanced CSS properties
      },
      frameworks: detectedFrameworks, // Phase 2: Detected frameworks/libraries
      responsive: responsiveData, // Phase 2: Responsive breakpoints
      screenshot: screenshotData, // Phase 2: Include screenshot
      interactive: interactiveStates, // Phase 3: Interactive states (hover, focus, active)
      animations: animations, // Phase 3: Animations and transitions
      forms: formIntelligence, // Phase 3: Form intelligence
      loadingStates: loadingStates, // Phase 3: Loading indicators
      wireframePrompt: generateWireframePrompt($, title, url),
    };

    // Phase 4: Pattern Recognition & Suggestions with error handling
    let detectedPatterns = [];
    let patternSuggestions = [];

    try {
      detectedPatterns = detectPatterns(analysis, context);
      context.log(`✅ Detected ${detectedPatterns.length} patterns`);
    } catch (patternError) {
      context.log(`⚠️ Pattern detection error: ${patternError.message}`);
      // Continue without patterns rather than failing completely
    }

    try {
      patternSuggestions = generateSuggestions(detectedPatterns, context);
      context.log(
        `✅ Generated ${patternSuggestions.length} suggestion groups`
      );
    } catch (suggestionError) {
      context.log(`⚠️ Suggestion generation error: ${suggestionError.message}`);
      // Continue without suggestions rather than failing completely
    }

    // Clean patterns before sending (remove internal _metadata)
    const cleanedPatterns = detectedPatterns.map(
      ({ _metadata, ...pattern }) => pattern
    );

    await browser.close();

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        analysis: analysis,
        patterns: cleanedPatterns, // Phase 4: Detected UX patterns (cleaned)
        suggestions: patternSuggestions, // Phase 4: Actionable suggestions
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    context.log("❌ Website analysis error:", error);
    context.log("Error stack:", error.stack);

    // Close browser gracefully
    if (browser) {
      try {
        await browser.close();
        context.log("✅ Browser closed after error");
      } catch (closeError) {
        context.log("⚠️ Browser close error:", closeError.message);
      }
    }

    // Determine error type and status code
    let statusCode = 500;
    let errorCode = "ANALYSIS_ERROR";
    let errorMessage = "Website analysis failed";

    if (
      error.message.includes("timeout") ||
      error.message.includes("Navigation timeout")
    ) {
      statusCode = 504;
      errorCode = "TIMEOUT_ERROR";
      errorMessage = "Page load timeout - site took too long to respond";
    } else if (error.message.includes("net::ERR")) {
      statusCode = 502;
      errorCode = "NETWORK_ERROR";
      errorMessage = "Network error - could not reach the website";
    } else if (error.message.includes("Cannot find module")) {
      statusCode = 500;
      errorCode = "DEPENDENCY_ERROR";
      errorMessage = "Server configuration error";
    }

    context.res = {
      status: statusCode,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        code: errorCode,
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

// ==========================================
// PUPPETEER-BASED EXTRACTION FUNCTIONS
// Extract actual styles from rendered page
// ==========================================

async function extractColorsFromPage(page, context) {
  try {
    const colors = await page.evaluate(() => {
      // Helper to convert RGB to hex
      const rgbToHex = (rgb) => {
        if (!rgb) return null;
        const match = rgb.match(/\d+/g);
        if (!match || match.length < 3) return null;
        const r = parseInt(match[0]);
        const g = parseInt(match[1]);
        const b = parseInt(match[2]);
        return (
          "#" +
          [r, g, b]
            .map((x) => {
              const hex = x.toString(16);
              return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
        );
      };

      // Helper to check if color is valid (not transparent/white/black)
      const isValidColor = (color) => {
        if (!color) return false;
        const normalized = color.toLowerCase();
        return (
          normalized !== "rgba(0, 0, 0, 0)" &&
          normalized !== "transparent" &&
          normalized !== "rgb(255, 255, 255)" &&
          normalized !== "rgb(0, 0, 0)"
        );
      };

      // Helper to get most common color from elements
      const getMostCommonColor = (selector, property) => {
        const elements = document.querySelectorAll(selector);
        const colorMap = {};
        elements.forEach((el) => {
          const style = window.getComputedStyle(el);
          const color = style[property];
          if (isValidColor(color)) {
            colorMap[color] = (colorMap[color] || 0) + 1;
          }
        });
        const sortedColors = Object.entries(colorMap).sort(
          (a, b) => b[1] - a[1]
        );
        return sortedColors.length > 0 ? sortedColors[0][0] : null;
      };

      // Extract background color
      const bodyStyle = window.getComputedStyle(document.body);
      let background = bodyStyle.backgroundColor;

      if (!isValidColor(background)) {
        const mainEl = document.querySelector(
          'main, [role="main"], #main, .main, .wrapper, .container'
        );
        if (mainEl) {
          background = window.getComputedStyle(mainEl).backgroundColor;
        }
      }

      // Extract text color
      let textColor = bodyStyle.color;
      if (!textColor) {
        textColor = getMostCommonColor("p, div, span, body", "color");
      }

      // Extract primary color from buttons and CTAs
      const primaryColor =
        getMostCommonColor(
          'button:not([disabled]), .btn, .button, [role="button"], a.cta, .cta',
          "backgroundColor"
        ) || getMostCommonColor("a[href]:not(nav a), .link", "color");

      // Extract secondary/accent color from headers and navigation
      const secondaryColor =
        getMostCommonColor("h1, h2, h3, nav a, header a, .nav-link", "color") ||
        getMostCommonColor("nav, header, .navbar", "backgroundColor");

      return {
        background: rgbToHex(background) || "#ffffff",
        text: rgbToHex(textColor) || "#000000",
        primary: rgbToHex(primaryColor) || "#0066cc",
        secondary: rgbToHex(secondaryColor) || "#666666",
      };
    });

    context.log("✅ Extracted colors:", colors);
    return colors;
  } catch (error) {
    context.log("⚠️ Error extracting colors:", error.message);
    return {
      background: "#ffffff",
      text: "#000000",
      primary: "#0066cc",
      secondary: "#666666",
    };
  }
}

async function extractTypographyFromPage(page, context) {
  try {
    const typography = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);

      // Get primary font from body
      const fontFamily = bodyStyle.fontFamily || "sans-serif";

      // Get common font sizes
      const h1 = document.querySelector("h1");
      const h1Size = h1 ? window.getComputedStyle(h1).fontSize : "32px";

      const p = document.querySelector("p, div");
      const fontSize = p
        ? window.getComputedStyle(p).fontSize
        : bodyStyle.fontSize || "16px";

      // Get line height
      const lineHeight = bodyStyle.lineHeight || "1.5";

      // Get font weights
      const h1Weight = h1 ? window.getComputedStyle(h1).fontWeight : "700";
      const bodyWeight = bodyStyle.fontWeight || "400";

      return {
        fontFamily: fontFamily.split(",")[0].replace(/['"]/g, "").trim(),
        fontSize: fontSize,
        h1Size: h1Size,
        lineHeight: lineHeight,
        headingWeight: h1Weight,
        bodyWeight: bodyWeight,
      };
    });

    context.log("✅ Extracted typography:", typography);
    return typography;
  } catch (error) {
    context.log("⚠️ Error extracting typography:", error.message);
    return {
      fontFamily: "sans-serif",
      fontSize: "16px",
      h1Size: "32px",
      lineHeight: "1.5",
      headingWeight: "700",
      bodyWeight: "400",
    };
  }
}

async function detectComponentLibraries(page, context) {
  try {
    context.log("🔍 Detecting component libraries and frameworks...");

    const detected = await page.evaluate(() => {
      const results = {
        frameworks: [],
        libraries: [],
        buildTools: [],
        meta: [],
      };

      // Check for React
      if (
        window.React ||
        document.querySelector("[data-reactroot], [data-reactid]") ||
        document.querySelector('*[id^="react-"]') ||
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__
      ) {
        results.frameworks.push("React");
      }

      // Check for Vue
      if (
        window.Vue ||
        document.querySelector("[data-v-]") ||
        document.querySelector('*[id^="app"].__vue__')
      ) {
        results.frameworks.push("Vue.js");
      }

      // Check for Angular
      if (
        window.ng ||
        window.angular ||
        document.querySelector("[ng-app], [ng-controller]") ||
        document.querySelector("*[_nghost-], *[_ngcontent-]")
      ) {
        results.frameworks.push("Angular");
      }

      // Check for Svelte
      if (document.querySelector('*[class^="svelte-"]')) {
        results.frameworks.push("Svelte");
      }

      // Check for Next.js
      if (document.querySelector("#__next") || window.__NEXT_DATA__) {
        results.buildTools.push("Next.js");
      }

      // Check for Gatsby
      if (document.querySelector("#___gatsby")) {
        results.buildTools.push("Gatsby");
      }

      // Check for Material-UI
      if (
        document.querySelector(
          '[class*="MuiButton"], [class*="MuiCard"], [class*="MuiAppBar"]'
        )
      ) {
        results.libraries.push("Material-UI");
      }

      // Check for Bootstrap
      if (
        document.querySelector(
          '[class*="btn-"], [class*="col-"], [class*="container"]'
        ) ||
        document.querySelector('link[href*="bootstrap"]')
      ) {
        results.libraries.push("Bootstrap");
      }

      // Check for Tailwind CSS
      if (
        document.querySelector(
          '[class*="flex"], [class*="grid"], [class*="p-"], [class*="m-"]'
        ) &&
        document.querySelector('*[class*="text-"], *[class*="bg-"]')
      ) {
        // Additional check for Tailwind patterns
        const hasManyTailwind =
          document.querySelectorAll(
            '[class*="flex-"], [class*="items-"], [class*="justify-"]'
          ).length > 3;
        if (hasManyTailwind) {
          results.libraries.push("Tailwind CSS");
        }
      }

      // Check for Chakra UI
      if (document.querySelector('[class*="chakra-"]')) {
        results.libraries.push("Chakra UI");
      }

      // Check for Ant Design
      if (document.querySelector('[class*="ant-"]')) {
        results.libraries.push("Ant Design");
      }

      // Check for Semantic UI
      if (document.querySelector('[class*="ui "], [class*="ui."]')) {
        results.libraries.push("Semantic UI");
      }

      // Check for Foundation
      if (
        document.querySelector(
          '[class*="foundation"], [class*="row"], [class*="column"]'
        ) &&
        document.querySelector('link[href*="foundation"]')
      ) {
        results.libraries.push("Foundation");
      }

      // Check for Bulma
      if (
        document.querySelector(
          '[class*="bulma"], [class*="column"], [class*="section"]'
        ) &&
        document.querySelector('link[href*="bulma"]')
      ) {
        results.libraries.push("Bulma");
      }

      // Check meta generators
      const generator = document.querySelector('meta[name="generator"]');
      if (generator) {
        results.meta.push(generator.getAttribute("content"));
      }

      // Check for WordPress
      if (
        document.querySelector('link[href*="wp-content"]') ||
        document.querySelector('meta[name="generator"][content*="WordPress"]')
      ) {
        results.meta.push("WordPress");
      }

      // Check for Shopify
      if (
        window.Shopify ||
        document.querySelector('meta[name="shopify-checkout-api-token"]')
      ) {
        results.meta.push("Shopify");
      }

      // Check for Wix
      if (document.querySelector('meta[name="generator"][content*="Wix"]')) {
        results.meta.push("Wix");
      }

      // Check for Squarespace
      if (
        document.querySelector('meta[name="generator"][content*="Squarespace"]')
      ) {
        results.meta.push("Squarespace");
      }

      return results;
    });

    // Remove duplicates
    detected.frameworks = [...new Set(detected.frameworks)];
    detected.libraries = [...new Set(detected.libraries)];
    detected.buildTools = [...new Set(detected.buildTools)];
    detected.meta = [...new Set(detected.meta)];

    context.log("✅ Detected frameworks/libraries:", {
      frameworks: detected.frameworks,
      libraries: detected.libraries,
      buildTools: detected.buildTools,
      meta: detected.meta,
    });

    return detected;
  } catch (error) {
    context.log("⚠️ Error detecting component libraries:", error.message);
    return {
      frameworks: [],
      libraries: [],
      buildTools: [],
      meta: [],
    };
  }
}

// ==========================================
// PHASE 3: INTERACTIVE STATE DETECTION
// Capture hover, focus, active, and loading states
// ==========================================

async function extractInteractiveStates(page, context) {
  try {
    context.log("🎯 Extracting interactive states (hover, focus, active)...");

    const interactiveStates = await page.evaluate(async () => {
      const results = {
        buttons: [],
        links: [],
        inputs: [],
        hasHoverEffects: false,
        hasFocusStyles: false,
        hasActiveStates: false,
      };

      // Helper to get computed styles
      const getStyles = (element) => {
        const styles = window.getComputedStyle(element);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderColor: styles.borderColor,
          borderWidth: styles.borderWidth,
          boxShadow: styles.boxShadow,
          transform: styles.transform,
          opacity: styles.opacity,
          cursor: styles.cursor,
        };
      };

      // Extract button states (up to 5 buttons)
      const buttons = document.querySelectorAll(
        'button, .btn, [role="button"], input[type="button"], input[type="submit"]'
      );
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const button = buttons[i];
        const normalState = getStyles(button);

        // Create a clone to test hover state without affecting the page
        const buttonData = {
          selector:
            button.tagName.toLowerCase() +
            (button.className ? "." + button.className.split(" ")[0] : ""),
          normal: normalState,
          hover: null,
          hasTransition:
            window.getComputedStyle(button).transition !== "all 0s ease 0s",
        };

        // Check if button has :hover styles defined
        try {
          // We can't directly trigger :hover, but we can check for transition property
          // which indicates interactive state changes
          const transition = window.getComputedStyle(button).transition;
          if (transition && transition !== "all 0s ease 0s") {
            buttonData.hover = {
              hasHoverEffect: true,
              transition: transition,
            };
            results.hasHoverEffects = true;
          }
        } catch (e) {
          // Silent fail
        }

        results.buttons.push(buttonData);
      }

      // Extract link states (up to 5 links)
      const links = document.querySelectorAll("a[href]");
      for (let i = 0; i < Math.min(links.length, 5); i++) {
        const link = links[i];
        const normalState = getStyles(link);

        results.links.push({
          selector:
            "a" + (link.className ? "." + link.className.split(" ")[0] : ""),
          normal: normalState,
          hasTransition:
            window.getComputedStyle(link).transition !== "all 0s ease 0s",
        });

        if (window.getComputedStyle(link).transition !== "all 0s ease 0s") {
          results.hasHoverEffects = true;
        }
      }

      // Extract input focus states (up to 5 inputs)
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea'
      );
      for (let i = 0; i < Math.min(inputs.length, 5); i++) {
        const input = inputs[i];
        const normalState = getStyles(input);

        results.inputs.push({
          type: input.type || input.tagName.toLowerCase(),
          normal: normalState,
          placeholder: input.placeholder || "",
          hasFocusRing: window.getComputedStyle(input).outline !== "none",
        });

        if (
          window.getComputedStyle(input).outline !== "none" ||
          window.getComputedStyle(input).borderWidth !== "0px"
        ) {
          results.hasFocusStyles = true;
        }
      }

      return results;
    });

    context.log("✅ Extracted interactive states:", {
      buttonCount: interactiveStates.buttons.length,
      linkCount: interactiveStates.links.length,
      inputCount: interactiveStates.inputs.length,
      hasHoverEffects: interactiveStates.hasHoverEffects,
    });

    return interactiveStates;
  } catch (error) {
    context.log("⚠️ Error extracting interactive states:", error.message);
    return {
      buttons: [],
      links: [],
      inputs: [],
      hasHoverEffects: false,
      hasFocusStyles: false,
      hasActiveStates: false,
    };
  }
}

async function extractAnimations(page, context) {
  try {
    context.log("🎬 Extracting animations and transitions...");

    const animations = await page.evaluate(() => {
      const results = {
        cssTransitions: [],
        cssAnimations: [],
        scrollAnimations: [],
        hasParallax: false,
        hasMicroInteractions: false,
      };

      // Find elements with CSS transitions
      const allElements = document.querySelectorAll("*");
      const transitionElements = [];
      const animationElements = [];

      allElements.forEach((element, index) => {
        if (index > 500) return; // Limit to first 500 elements for performance

        const styles = window.getComputedStyle(element);

        // Check for transitions
        if (styles.transition && styles.transition !== "all 0s ease 0s") {
          transitionElements.push({
            selector:
              element.tagName.toLowerCase() +
              (element.className ? "." + element.className.split(" ")[0] : ""),
            transition: styles.transition,
            transitionProperty: styles.transitionProperty,
            transitionDuration: styles.transitionDuration,
            transitionTimingFunction: styles.transitionTimingFunction,
          });
        }

        // Check for CSS animations
        if (styles.animation && styles.animation !== "none") {
          animationElements.push({
            selector:
              element.tagName.toLowerCase() +
              (element.className ? "." + element.className.split(" ")[0] : ""),
            animation: styles.animation,
            animationName: styles.animationName,
            animationDuration: styles.animationDuration,
            animationTimingFunction: styles.animationTimingFunction,
            animationIterationCount: styles.animationIterationCount,
          });
        }
      });

      // Get top 10 transitions
      results.cssTransitions = transitionElements.slice(0, 10);

      // Get top 10 animations
      results.cssAnimations = animationElements.slice(0, 10);

      // Check for scroll-triggered animations (common libraries)
      const hasAOS = !!document.querySelector("[data-aos]");
      const hasScrollReveal = !!window.ScrollReveal;
      const hasGSAP = !!window.gsap;
      const hasAnimate = !!document.querySelector('[class*="animate"]');

      if (hasAOS || hasScrollReveal || hasGSAP || hasAnimate) {
        results.scrollAnimations.push({
          library: hasAOS
            ? "AOS"
            : hasScrollReveal
            ? "ScrollReveal"
            : hasGSAP
            ? "GSAP"
            : "Custom",
          detected: true,
        });
      }

      // Check for parallax effects
      const hasParallaxClass = !!document.querySelector('[class*="parallax"]');
      const hasTransform3d = Array.from(allElements)
        .slice(0, 100)
        .some((el) => {
          const transform = window.getComputedStyle(el).transform;
          return transform && transform.includes("matrix3d");
        });

      results.hasParallax = hasParallaxClass || hasTransform3d;

      // Micro-interactions indicator
      results.hasMicroInteractions =
        transitionElements.length > 0 || animationElements.length > 0;

      return results;
    });

    context.log("✅ Extracted animations:", {
      transitionCount: animations.cssTransitions.length,
      animationCount: animations.cssAnimations.length,
      hasScrollAnimations: animations.scrollAnimations.length > 0,
      hasParallax: animations.hasParallax,
    });

    return animations;
  } catch (error) {
    context.log("⚠️ Error extracting animations:", error.message);
    return {
      cssTransitions: [],
      cssAnimations: [],
      scrollAnimations: [],
      hasParallax: false,
      hasMicroInteractions: false,
    };
  }
}

async function extractFormIntelligence(page, context) {
  try {
    context.log("📝 Extracting form intelligence...");

    const formData = await page.evaluate(() => {
      const results = {
        forms: [],
        totalForms: 0,
        hasValidation: false,
        hasErrorStates: false,
      };

      const forms = document.querySelectorAll("form");
      results.totalForms = forms.length;

      forms.forEach((form, index) => {
        if (index >= 5) return; // Limit to 5 forms

        const formInfo = {
          index: index,
          action: form.action || null,
          method: form.method || "get",
          fields: [],
          hasSubmitButton: false,
          hasRequiredFields: false,
        };

        // Extract input fields
        const inputs = form.querySelectorAll("input, textarea, select");
        inputs.forEach((input, inputIndex) => {
          if (inputIndex >= 10) return; // Limit to 10 fields per form

          const fieldInfo = {
            type: input.type || input.tagName.toLowerCase(),
            name: input.name || null,
            placeholder: input.placeholder || "",
            required: input.required || input.hasAttribute("required"),
            pattern: input.pattern || null,
            maxLength: input.maxLength > 0 ? input.maxLength : null,
            styles: {
              borderColor: window.getComputedStyle(input).borderColor,
              borderWidth: window.getComputedStyle(input).borderWidth,
              borderRadius: window.getComputedStyle(input).borderRadius,
              padding: window.getComputedStyle(input).padding,
              fontSize: window.getComputedStyle(input).fontSize,
            },
          };

          // Check for validation classes
          if (
            input.className.includes("invalid") ||
            input.className.includes("error") ||
            input.getAttribute("aria-invalid") === "true"
          ) {
            results.hasErrorStates = true;
          }

          if (input.pattern || input.required) {
            results.hasValidation = true;
            formInfo.hasRequiredFields = true;
          }

          formInfo.fields.push(fieldInfo);
        });

        // Check for submit button
        const submitButton = form.querySelector(
          'button[type="submit"], input[type="submit"]'
        );
        if (submitButton) {
          formInfo.hasSubmitButton = true;
          formInfo.submitButton = {
            text: submitButton.textContent || submitButton.value || "Submit",
            styles: {
              backgroundColor:
                window.getComputedStyle(submitButton).backgroundColor,
              color: window.getComputedStyle(submitButton).color,
              borderRadius: window.getComputedStyle(submitButton).borderRadius,
              padding: window.getComputedStyle(submitButton).padding,
            },
          };
        }

        results.forms.push(formInfo);
      });

      return results;
    });

    context.log("✅ Extracted form intelligence:", {
      totalForms: formData.totalForms,
      hasValidation: formData.hasValidation,
      hasErrorStates: formData.hasErrorStates,
    });

    return formData;
  } catch (error) {
    context.log("⚠️ Error extracting form intelligence:", error.message);
    return {
      forms: [],
      totalForms: 0,
      hasValidation: false,
      hasErrorStates: false,
    };
  }
}

async function extractLoadingStates(page, context) {
  try {
    context.log("⏳ Detecting loading states and indicators...");

    const loadingStates = await page.evaluate(() => {
      const results = {
        spinners: [],
        skeletons: [],
        progressBars: [],
        loadingIndicators: [],
        hasLoadingStates: false,
      };

      // Detect spinners (common patterns)
      const spinnerSelectors = [
        ".spinner",
        ".loading",
        ".loader",
        '[class*="spin"]',
        '[class*="loading"]',
        '[role="status"]',
        '[aria-busy="true"]',
      ];

      spinnerSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          if (index >= 3) return; // Limit to 3

          const styles = window.getComputedStyle(el);
          if (styles.animation && styles.animation !== "none") {
            results.spinners.push({
              selector: selector,
              animation: styles.animation,
              display: styles.display,
              visible: styles.display !== "none",
            });
            results.hasLoadingStates = true;
          }
        });
      });

      // Detect skeleton screens
      const skeletonSelectors = [
        ".skeleton",
        '[class*="skeleton"]',
        ".placeholder",
        '[class*="placeholder"]',
        '[class*="shimmer"]',
      ];

      skeletonSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          results.skeletons.push({
            selector: selector,
            count: elements.length,
          });
          results.hasLoadingStates = true;
        }
      });

      // Detect progress bars
      const progressBars = document.querySelectorAll(
        'progress, [role="progressbar"], .progress, [class*="progress"]'
      );
      progressBars.forEach((bar, index) => {
        if (index >= 3) return;

        results.progressBars.push({
          selector:
            bar.tagName.toLowerCase() +
            (bar.className ? "." + bar.className.split(" ")[0] : ""),
          value: bar.value || bar.getAttribute("aria-valuenow") || null,
          max: bar.max || bar.getAttribute("aria-valuemax") || 100,
        });
        results.hasLoadingStates = true;
      });

      return results;
    });

    context.log("✅ Detected loading states:", {
      spinnerCount: loadingStates.spinners.length,
      skeletonCount: loadingStates.skeletons.length,
      progressBarCount: loadingStates.progressBars.length,
      hasLoadingStates: loadingStates.hasLoadingStates,
    });

    return loadingStates;
  } catch (error) {
    context.log("⚠️ Error detecting loading states:", error.message);
    return {
      spinners: [],
      skeletons: [],
      progressBars: [],
      loadingIndicators: [],
      hasLoadingStates: false,
    };
  }
}

// ==========================================
// PHASE 4: PATTERN RECOGNITION
// Detect common UX patterns and generate suggestions
// ==========================================

function detectPatterns(analysis, context) {
  try {
    context.log("🔍 Detecting UX patterns from analysis...");

    const patterns = [];
    const confidence = (score) => Math.min(Math.max(score, 0), 1); // 0-1 range

    // Pattern 1: Multi-Step Form
    if (analysis.forms?.totalForms > 0) {
      const firstForm = analysis.forms.forms[0];
      const fieldCount = firstForm?.fields?.length || 0;

      if (fieldCount >= 5 && fieldCount <= 15) {
        patterns.push({
          type: "multi-step-form",
          title: "Multi-Step Form Pattern",
          confidence: confidence(0.75 + fieldCount / 100), // 0.75-0.90
          context: `Detected ${fieldCount} form fields. Form has ${
            analysis.forms.hasValidation ? "validation" : "no validation"
          } and ${
            firstForm?.hasSubmitButton ? "a submit button" : "no submit button"
          }.`,
          tags: ["forms", "ux-flow", "progressive-disclosure"],
          priority: "high",
          // Internal metadata for suggestion generation (not sent to frontend)
          _metadata: {
            fieldCount: fieldCount,
            hasValidation: analysis.forms.hasValidation,
            hasSubmitButton: firstForm?.hasSubmitButton,
          },
        });
      }

      // Pattern 2: Long Form
      if (fieldCount > 8) {
        patterns.push({
          type: "long-form",
          title: "Long Form Pattern",
          confidence: confidence(0.8 + fieldCount / 150), // 0.80-0.95
          context: `Found a form with ${fieldCount} fields. ${
            analysis.forms.hasValidation
              ? "Has validation."
              : "No validation detected."
          } ${fieldCount > 12 ? "Consider organizing into sections." : ""}`,
          tags: ["forms", "information-architecture", "user-burden"],
          priority: "high",
          // Internal metadata for suggestion generation (not sent to frontend)
          _metadata: {
            fieldCount: fieldCount,
            hasValidation: analysis.forms.hasValidation,
            requiresOrganization: fieldCount > 12,
          },
        });
      }

      // Pattern 3: Form with Validation
      if (analysis.forms.hasValidation) {
        patterns.push({
          type: "validated-form",
          title: "Form with Validation",
          confidence: 0.95,
          context: `Form has validation enabled with ${
            analysis.forms.hasErrorStates
              ? "error states"
              : "no visible error states"
          }. ${fieldCount} total fields.`,
          tags: ["forms", "validation", "error-handling"],
          priority: "medium",
          // Internal metadata for suggestion generation (not sent to frontend)
          _metadata: {
            hasErrorStates: analysis.forms.hasErrorStates,
            fieldCount: fieldCount,
          },
        });
      }
    }

    // Pattern 4: Data Table (detect table-like structures)
    const hasTable = analysis.layout?.main?.hasTable;
    if (hasTable) {
      patterns.push({
        type: "data-table",
        title: "Data Table Pattern",
        confidence: 0.85,
        context:
          "Detected tabular data structure. Consider adding sorting and filtering capabilities.",
        tags: ["tables", "data-display", "interaction"],
        priority: "medium",
      });
    }

    // Pattern 5: Search Interface
    const hasSearchInput = analysis.forms?.forms?.some((form) =>
      form.fields?.some(
        (field) =>
          field.type === "search" ||
          field.name?.toLowerCase().includes("search")
      )
    );

    if (hasSearchInput) {
      patterns.push({
        type: "search-interface",
        title: "Search Interface Pattern",
        confidence: 0.9,
        context:
          "Found search input field. Consider enhancing with autocomplete and recent searches.",
        tags: ["search", "findability", "information-architecture"],
        priority: "medium",
      });
    }

    // Pattern 6: Complex Navigation
    const navLinks = analysis.layout?.navigation?.links?.length || 0;
    const hasSubNavs = analysis.layout?.navigation?.hasSubNavs;

    if (navLinks >= 7 || hasSubNavs) {
      patterns.push({
        type: "complex-navigation",
        title: "Complex Navigation Pattern",
        confidence: confidence(0.7 + navLinks / 100), // 0.70-0.85
        context: `Found ${navLinks} navigation links${
          hasSubNavs ? " with sub-navigation menus" : ""
        }. ${
          navLinks > 10
            ? "Consider using a mega menu or organizing into categories."
            : "Consider grouping related items."
        }`,
        tags: ["navigation", "information-architecture", "menu"],
        priority: navLinks > 10 ? "high" : "medium",
        // Internal metadata for suggestion generation (not sent to frontend)
        _metadata: {
          linkCount: navLinks,
          hasSubNavs: hasSubNavs,
          needsOrganization: navLinks > 10,
        },
      });
    }

    // Pattern 7: Interactive Components
    if (
      analysis.interactive?.hasHoverEffects ||
      analysis.animations?.hasMicroInteractions
    ) {
      const buttonCount = analysis.interactive?.buttons?.length || 0;
      patterns.push({
        type: "interactive-components",
        title: "Interactive Components Pattern",
        confidence: 0.88,
        context: `Detected ${buttonCount} interactive elements with ${
          analysis.interactive?.hasHoverEffects
            ? "hover effects"
            : "no hover effects"
        } and ${
          analysis.animations?.hasMicroInteractions
            ? "micro-interactions"
            : "no animations"
        }.`,
        tags: ["interactivity", "animations", "feedback"],
        priority: "low",
      });
    }

    // Pattern 8: Content-Heavy Page
    const sectionCount = analysis.layout?.sections?.length || 0;
    const headingCount = analysis.layout?.main?.headings?.length || 0;

    if (sectionCount >= 5 || headingCount >= 8) {
      patterns.push({
        type: "content-heavy",
        title: "Content-Heavy Page Pattern",
        confidence: confidence(0.75 + sectionCount / 50), // 0.75-0.90
        context: `Found ${sectionCount} content sections and ${headingCount} headings. ${
          sectionCount > 6
            ? "Recommend adding a sticky navigation menu."
            : "Page has substantial content."
        }`,
        tags: ["content", "information-architecture", "navigation"],
        priority: "medium",
        // Internal metadata for suggestion generation (not sent to frontend)
        _metadata: {
          sectionCount: sectionCount,
          headingCount: headingCount,
          needsNavigation: sectionCount > 6,
        },
      });
    }

    // Pattern 9: Hero Section
    const hasLargeHeading = analysis.layout?.main?.headings?.some(
      (h) => h.level === 1
    );
    if (hasLargeHeading && sectionCount > 0) {
      patterns.push({
        type: "hero-section",
        title: "Hero Section Pattern",
        confidence: 0.8,
        context:
          "Found hero banner with H1 heading. Likely a landing page with primary call-to-action.",
        tags: ["landing-page", "marketing", "first-impression"],
        priority: "low",
      });
    }

    // Pattern 10: Loading/Async Content
    if (analysis.loadingStates?.hasLoadingStates) {
      const spinnerCount = analysis.loadingStates?.spinners?.length || 0;
      const skeletonCount = analysis.loadingStates?.skeletons?.length || 0;
      const progressCount = analysis.loadingStates?.progressBars?.length || 0;
      patterns.push({
        type: "async-content",
        title: "Asynchronous Content Pattern",
        confidence: 0.92,
        context: `Detected asynchronous content loading: ${spinnerCount} spinners, ${skeletonCount} skeleton screens, ${progressCount} progress bars.`,
        tags: ["loading", "performance", "user-feedback"],
        priority: "medium",
      });
    }

    // Sort by priority and confidence
    patterns.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    context.log("✅ Detected patterns:", {
      count: patterns.length,
      types: patterns.map((p) => p.type),
      highPriority: patterns.filter((p) => p.priority === "high").length,
    });

    return patterns;
  } catch (error) {
    context.log("⚠️ Error detecting patterns:", error.message);
    return [];
  }
}

function generateSuggestions(patterns, context) {
  try {
    context.log("💡 Generating suggestions for detected patterns...");

    const suggestions = [];

    patterns.forEach((pattern) => {
      let patternSuggestions = [];

      switch (pattern.type) {
        case "multi-step-form":
          const multiStepFieldCount = pattern._metadata?.fieldCount || 10; // Default fallback
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Split into multiple steps",
              description: `Break the ${multiStepFieldCount}-field form into 3-4 logical steps to reduce cognitive load.`,
              category: "structure",
              impact: "high",
              effort: "medium",
              example:
                "Step 1: Account Info, Step 2: Personal Details, Step 3: Preferences",
            },
            {
              id: `${pattern.type}-2`,
              title: "Add progress indicator",
              description:
                "Show users where they are in the form completion process with a clear progress bar or step numbers.",
              category: "feedback",
              impact: "high",
              effort: "low",
              example: "Progress: 1 of 3 steps completed",
            },
            {
              id: `${pattern.type}-3`,
              title: "Enable 'Save and Continue Later'",
              description:
                "Allow users to save their progress and return later to complete the form.",
              category: "functionality",
              impact: "medium",
              effort: "high",
              example: "Save Draft button with auto-save functionality",
            },
            {
              id: `${pattern.type}-4`,
              title: "Add Back/Next navigation",
              description:
                "Include clear Back and Next buttons for easy navigation between steps.",
              category: "navigation",
              impact: "high",
              effort: "low",
              example: "← Back | Next → buttons at bottom of each step",
            },
          ];
          break;

        case "long-form":
          const longFormFieldCount = pattern._metadata?.fieldCount || 10; // Default fallback
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Group fields into sections",
              description: `Organize the ${longFormFieldCount} fields into logical sections with clear headings.`,
              category: "structure",
              impact: "high",
              effort: "low",
              example:
                "Personal Info | Contact Details | Address | Preferences",
            },
            {
              id: `${pattern.type}-2`,
              title: "Use collapsible sections",
              description:
                "Implement accordion-style collapsible sections to show only relevant fields at a time.",
              category: "interaction",
              impact: "medium",
              effort: "medium",
              example: "Click section headers to expand/collapse field groups",
            },
            {
              id: `${pattern.type}-3`,
              title: "Add inline validation",
              description:
                "Validate fields as users complete them to catch errors early and provide immediate feedback.",
              category: "validation",
              impact: "high",
              effort: "medium",
              example:
                "Show green checkmark for valid email, red X for invalid",
            },
            {
              id: `${pattern.type}-4`,
              title: "Include field descriptions",
              description:
                "Add helpful hints or tooltips to complex fields to guide users.",
              category: "guidance",
              impact: "medium",
              effort: "low",
              example:
                "? icon with tooltip: 'Enter your business registration number'",
            },
          ];
          break;

        case "validated-form":
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Show validation inline",
              description:
                "Display validation messages directly below each field, not just at form submission.",
              category: "validation",
              impact: "high",
              effort: "low",
              example:
                "❌ Email format is invalid. Please use format: user@example.com",
            },
            {
              id: `${pattern.type}-2`,
              title: "Use clear error states",
              description:
                "Style invalid fields with red borders and error icons for immediate visual feedback.",
              category: "visual-feedback",
              impact: "high",
              effort: "low",
              example: "Red border + error icon + error message below field",
            },
            {
              id: `${pattern.type}-3`,
              title: "Add success indicators",
              description:
                "Show green checkmarks or success states for correctly completed fields.",
              category: "feedback",
              impact: "medium",
              effort: "low",
              example: "✅ Email format is valid",
            },
          ];
          break;

        case "data-table":
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Add column sorting",
              description:
                "Enable users to sort data by clicking column headers (ascending/descending).",
              category: "interaction",
              impact: "high",
              effort: "medium",
              example: "↑↓ icons in column headers, click to toggle sort",
            },
            {
              id: `${pattern.type}-2`,
              title: "Include search/filter",
              description:
                "Add search box and filter options to help users find specific data quickly.",
              category: "findability",
              impact: "high",
              effort: "medium",
              example: "Search box above table + dropdown filters per column",
            },
            {
              id: `${pattern.type}-3`,
              title: "Implement pagination",
              description:
                "Break large datasets into pages (e.g., 10-50 rows per page) for better performance.",
              category: "performance",
              impact: "medium",
              effort: "medium",
              example: "Showing 1-10 of 100 | ← Previous | Next →",
            },
            {
              id: `${pattern.type}-4`,
              title: "Make columns resizable",
              description:
                "Allow users to adjust column widths by dragging column dividers.",
              category: "customization",
              impact: "low",
              effort: "high",
              example: "Drag column borders to resize",
            },
          ];
          break;

        case "search-interface":
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Add search autocomplete",
              description:
                "Show suggested results as users type to help them find content faster.",
              category: "findability",
              impact: "high",
              effort: "high",
              example: "Dropdown with top 5 matching results while typing",
            },
            {
              id: `${pattern.type}-2`,
              title: "Include filters/facets",
              description:
                "Add category filters or faceted search to refine results.",
              category: "refinement",
              impact: "medium",
              effort: "medium",
              example: "Filter by: Category, Date, Price Range",
            },
            {
              id: `${pattern.type}-3`,
              title: "Show search results count",
              description:
                "Display the number of results found to set expectations.",
              category: "feedback",
              impact: "low",
              effort: "low",
              example: "Found 42 results for 'user guide'",
            },
          ];
          break;

        case "complex-navigation":
          const navLinkCount = pattern._metadata?.linkCount || 15; // Default fallback
          const navNeedsOrganization =
            pattern._metadata?.needsOrganization || navLinkCount > 10;
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: navNeedsOrganization
                ? "Use mega menu"
                : "Organize into categories",
              description: navNeedsOrganization
                ? `With ${navLinkCount} links, consider a mega menu with visual categories.`
                : "Group navigation items into logical categories with clear labels.",
              category: "structure",
              impact: "high",
              effort: "high",
              example: "Products | Solutions | Resources | Company",
            },
            {
              id: `${pattern.type}-2`,
              title: "Add hamburger menu for mobile",
              description:
                "Implement a collapsible hamburger menu for smaller screens.",
              category: "responsive",
              impact: "high",
              effort: "medium",
              example: "☰ icon expands to full navigation menu",
            },
            {
              id: `${pattern.type}-3`,
              title: "Include search in navigation",
              description:
                "Add a search option in the navigation bar for quick access.",
              category: "findability",
              impact: "medium",
              effort: "low",
              example: "🔍 Search icon in top-right corner",
            },
          ];
          break;

        case "content-heavy":
          const contentSectionCount = pattern._metadata?.sectionCount || 8; // Default fallback
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Add sticky table of contents",
              description: `With ${contentSectionCount} sections, add a sticky sidebar TOC for easy navigation.`,
              category: "navigation",
              impact: "high",
              effort: "medium",
              example: "Left sidebar with jump links to each section",
            },
            {
              id: `${pattern.type}-2`,
              title: "Include 'Back to Top' button",
              description:
                "Add a floating button to quickly return to the top of the page.",
              category: "navigation",
              impact: "medium",
              effort: "low",
              example: "↑ floating button in bottom-right corner",
            },
            {
              id: `${pattern.type}-3`,
              title: "Show reading progress",
              description:
                "Display a progress bar indicating how much of the content has been read.",
              category: "feedback",
              impact: "low",
              effort: "low",
              example: "Thin progress bar at top of page (0-100%)",
            },
            {
              id: `${pattern.type}-4`,
              title: "Use collapsible sections",
              description:
                "Allow users to expand/collapse content sections to focus on what they need.",
              category: "interaction",
              impact: "medium",
              effort: "medium",
              example: "Click section headers to toggle visibility",
            },
          ];
          break;

        case "hero-section":
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Add clear call-to-action",
              description:
                "Include a prominent CTA button in the hero section (above the fold).",
              category: "conversion",
              impact: "high",
              effort: "low",
              example: "'Get Started Free' button with contrasting color",
            },
            {
              id: `${pattern.type}-2`,
              title: "Include value proposition",
              description:
                "Add a brief, compelling description of the main benefit or feature.",
              category: "messaging",
              impact: "high",
              effort: "low",
              example: "Subheading: 'Build wireframes 10x faster with AI'",
            },
            {
              id: `${pattern.type}-3`,
              title: "Add visual element",
              description:
                "Include a hero image, video, or illustration to reinforce the message.",
              category: "visual",
              impact: "medium",
              effort: "medium",
              example: "Product screenshot or animated demo",
            },
          ];
          break;

        case "async-content":
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Use skeleton screens",
              description:
                "Show content placeholders while loading instead of blank spaces or spinners.",
              category: "loading",
              impact: "high",
              effort: "medium",
              example: "Gray placeholder boxes matching final content layout",
            },
            {
              id: `${pattern.type}-2`,
              title: "Add loading progress",
              description:
                "Show a progress bar or percentage for longer loading operations.",
              category: "feedback",
              impact: "medium",
              effort: "low",
              example: "Loading... 45%",
            },
            {
              id: `${pattern.type}-3`,
              title: "Implement optimistic UI",
              description:
                "Show immediate UI updates while requests process in the background.",
              category: "performance",
              impact: "high",
              effort: "high",
              example: "Item appears in list immediately, syncs with server",
            },
          ];
          break;

        case "interactive-components":
          patternSuggestions = [
            {
              id: `${pattern.type}-1`,
              title: "Ensure hover feedback",
              description:
                "All interactive elements should have visible hover states.",
              category: "feedback",
              impact: "medium",
              effort: "low",
              example: "Buttons darken on hover, cursor changes to pointer",
            },
            {
              id: `${pattern.type}-2`,
              title: "Add focus indicators",
              description:
                "Ensure keyboard navigation has clear focus states for accessibility.",
              category: "accessibility",
              impact: "high",
              effort: "low",
              example: "Blue outline ring on focused elements",
            },
          ];
          break;

        default:
          patternSuggestions = [];
      }

      if (patternSuggestions.length > 0) {
        suggestions.push({
          pattern: pattern.type, // Use pattern type string, not the full object
          suggestions: patternSuggestions,
          applicability: calculateApplicability(pattern),
        });
      }
    });

    context.log("✅ Generated suggestions:", {
      patternCount: suggestions.length,
      totalSuggestions: suggestions.reduce(
        (sum, s) => sum + s.suggestions.length,
        0
      ),
    });

    return suggestions;
  } catch (error) {
    context.log("⚠️ Error generating suggestions:", error.message);
    return [];
  }
}

function calculateApplicability(pattern) {
  // Calculate how applicable suggestions are based on confidence and context
  const baseScore = pattern.confidence; // Already 0-1

  // Adjust based on priority
  const priorityBonus = {
    high: 0.1,
    medium: 0.05,
    low: 0,
  };

  const score = Math.min(baseScore + priorityBonus[pattern.priority], 1.0);

  return score; // Return number between 0-1
}

async function extractAdvancedCSS(page, context) {
  try {
    context.log("🎨 Extracting advanced CSS properties...");

    const cssProperties = await page.evaluate(() => {
      const results = {
        buttons: [],
        cards: [],
        images: [],
        commonEffects: {
          shadows: [],
          gradients: [],
          borderRadius: [],
          transitions: [],
        },
      };

      // Helper to extract shadow
      const extractShadow = (el) => {
        const style = window.getComputedStyle(el);
        return style.boxShadow !== "none" ? style.boxShadow : null;
      };

      // Helper to extract gradient
      const extractGradient = (el) => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundImage;
        return bg && bg.includes("gradient") ? bg : null;
      };

      // Extract button styles
      const buttons = document.querySelectorAll(
        'button, .btn, .button, [role="button"]'
      );
      buttons.forEach((btn, i) => {
        if (i < 5) {
          // Limit to first 5
          const style = window.getComputedStyle(btn);
          results.buttons.push({
            borderRadius: style.borderRadius,
            boxShadow: extractShadow(btn),
            background: style.background,
            border: style.border,
            transition:
              style.transition !== "all 0s ease 0s" ? style.transition : null,
            transform: style.transform !== "none" ? style.transform : null,
          });
        }
      });

      // Extract card styles
      const cards = document.querySelectorAll(
        '.card, .tile, [class*="card"], .box, .panel'
      );
      cards.forEach((card, i) => {
        if (i < 5) {
          const style = window.getComputedStyle(card);
          results.cards.push({
            borderRadius: style.borderRadius,
            boxShadow: extractShadow(card),
            background: style.background,
            border: style.border,
          });
        }
      });

      // Extract image styles
      const images = document.querySelectorAll("img");
      images.forEach((img, i) => {
        if (i < 5) {
          const style = window.getComputedStyle(img);
          results.images.push({
            borderRadius: style.borderRadius,
            objectFit: style.objectFit,
            filter: style.filter !== "none" ? style.filter : null,
          });
        }
      });

      // Collect common effects
      document.querySelectorAll("*").forEach((el) => {
        const style = window.getComputedStyle(el);

        // Shadows
        const shadow = extractShadow(el);
        if (shadow && !results.commonEffects.shadows.includes(shadow)) {
          results.commonEffects.shadows.push(shadow);
        }

        // Gradients
        const gradient = extractGradient(el);
        if (gradient && !results.commonEffects.gradients.includes(gradient)) {
          results.commonEffects.gradients.push(gradient);
        }

        // Border radius
        const radius = style.borderRadius;
        if (
          radius !== "0px" &&
          !results.commonEffects.borderRadius.includes(radius)
        ) {
          results.commonEffects.borderRadius.push(radius);
        }
      });

      // Limit common effects arrays
      results.commonEffects.shadows = results.commonEffects.shadows.slice(0, 5);
      results.commonEffects.gradients = results.commonEffects.gradients.slice(
        0,
        5
      );
      results.commonEffects.borderRadius =
        results.commonEffects.borderRadius.slice(0, 5);

      return results;
    });

    context.log("✅ Extracted advanced CSS:", {
      buttons: cssProperties.buttons.length,
      cards: cssProperties.cards.length,
      shadows: cssProperties.commonEffects.shadows.length,
      gradients: cssProperties.commonEffects.gradients.length,
    });

    return cssProperties;
  } catch (error) {
    context.log("⚠️ Error extracting advanced CSS:", error.message);
    return {
      buttons: [],
      cards: [],
      images: [],
      commonEffects: {
        shadows: [],
        gradients: [],
        borderRadius: [],
        transitions: [],
      },
    };
  }
}

async function testResponsiveBreakpoints(page, context) {
  try {
    context.log("📱 Testing responsive breakpoints...");

    const breakpoints = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1200, height: 800 },
    ];

    const results = {};

    for (const bp of breakpoints) {
      context.log(`  Testing ${bp.name} (${bp.width}x${bp.height})`);

      // Set viewport
      await page.setViewport({ width: bp.width, height: bp.height });

      // Wait for layout to adjust
      await page.waitForTimeout(1000);

      // Extract layout info at this breakpoint
      const layoutInfo = await page.evaluate(() => {
        const header = document.querySelector(
          'header, .header, [role="banner"]'
        );
        const nav = document.querySelector("nav, .nav, .navigation");
        const main = document.querySelector('main, .main, [role="main"]');
        const sidebar = document.querySelector("aside, .sidebar");

        return {
          headerVisible: header
            ? window.getComputedStyle(header).display !== "none"
            : false,
          navVisible: nav
            ? window.getComputedStyle(nav).display !== "none"
            : false,
          navPosition: nav ? window.getComputedStyle(nav).position : null,
          mainWidth: main ? main.offsetWidth : 0,
          sidebarVisible: sidebar
            ? window.getComputedStyle(sidebar).display !== "none"
            : false,
          bodyFontSize: window.getComputedStyle(document.body).fontSize,
          hasHamburgerMenu: !!document.querySelector(
            '.hamburger, .menu-toggle, .mobile-menu, [aria-label*="menu"]'
          ),
        };
      });

      results[bp.name] = {
        viewport: { width: bp.width, height: bp.height },
        layout: layoutInfo,
      };
    }

    // Reset to desktop viewport
    await page.setViewport({ width: 1200, height: 800 });

    context.log("✅ Responsive breakpoints tested:", Object.keys(results));
    return results;
  } catch (error) {
    context.log("⚠️ Error testing responsive breakpoints:", error.message);
    return null;
  }
}

async function captureScreenshot(page, context) {
  try {
    context.log("📸 Capturing screenshot...");

    // Capture full page screenshot
    const screenshot = await page.screenshot({
      encoding: "base64",
      fullPage: false, // Just viewport for performance
      type: "jpeg",
      quality: 80,
    });

    // Get page dimensions
    const dimensions = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollHeight: document.body.scrollHeight,
    }));

    context.log("✅ Screenshot captured:", {
      size: `${Math.round(screenshot.length / 1024)}KB`,
      dimensions: `${dimensions.width}x${dimensions.height}`,
    });

    return {
      data: screenshot, // Base64 encoded
      format: "jpeg",
      dimensions: dimensions,
      capturedAt: new Date().toISOString(),
    };
  } catch (error) {
    context.log("⚠️ Error capturing screenshot:", error.message);
    return null;
  }
}

async function extractLayoutMeasurements(page, context) {
  try {
    const measurements = await page.evaluate(() => {
      const results = {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        header: null,
        navigation: null,
        main: null,
        sidebar: null,
        footer: null,
        sections: [],
      };

      // Helper to get element measurements
      const getMeasurements = (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);

        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          padding: {
            top: styles.paddingTop,
            right: styles.paddingRight,
            bottom: styles.paddingBottom,
            left: styles.paddingLeft,
          },
          margin: {
            top: styles.marginTop,
            right: styles.marginRight,
            bottom: styles.marginBottom,
            left: styles.marginLeft,
          },
          display: styles.display,
          position: styles.position,
          flexDirection: styles.flexDirection || null,
          gridTemplateColumns:
            styles.gridTemplateColumns !== "none"
              ? styles.gridTemplateColumns
              : null,
        };
      };

      // Extract header measurements
      const header = document.querySelector('header, .header, [role="banner"]');
      if (header) {
        results.header = getMeasurements(header);
      }

      // Extract navigation measurements
      const nav = document.querySelector(
        'nav, .nav, .navigation, [role="navigation"]'
      );
      if (nav) {
        results.navigation = getMeasurements(nav);
      }

      // Extract main content measurements
      const main = document.querySelector(
        'main, .main, [role="main"], .content'
      );
      if (main) {
        results.main = getMeasurements(main);
      }

      // Extract sidebar measurements
      const sidebar = document.querySelector(
        'aside, .sidebar, [role="complementary"]'
      );
      if (sidebar) {
        results.sidebar = getMeasurements(sidebar);
      }

      // Extract footer measurements
      const footer = document.querySelector(
        'footer, .footer, [role="contentinfo"]'
      );
      if (footer) {
        results.footer = getMeasurements(footer);
      }

      // Extract section measurements (up to 5 main sections)
      const sections = document.querySelectorAll(
        'section, .section, [role="region"]'
      );
      sections.forEach((section, index) => {
        if (index < 5) {
          results.sections.push({
            index: index,
            measurements: getMeasurements(section),
          });
        }
      });

      // Extract container/wrapper measurements
      const container = document.querySelector(
        ".container, .wrapper, .max-w, .mx-auto"
      );
      if (container) {
        results.container = getMeasurements(container);
      }

      return results;
    });

    context.log("✅ Extracted layout measurements:", {
      viewport: measurements.viewport,
      hasHeader: !!measurements.header,
      hasNav: !!measurements.navigation,
      hasMain: !!measurements.main,
      sectionsCount: measurements.sections.length,
    });
    return measurements;
  } catch (error) {
    context.log("⚠️ Error extracting layout measurements:", error.message);
    return {
      viewport: { width: 1200, height: 800 },
      header: null,
      navigation: null,
      main: null,
      sidebar: null,
      footer: null,
      sections: [],
    };
  }
}

// ==========================================
// CHEERIO-BASED EXTRACTION FUNCTIONS
// Extract structure from HTML
// ==========================================

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

// Note: extractColors and extractTypography are now handled by
// extractColorsFromPage and extractTypographyFromPage using Puppeteer

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

function generateWireframePrompt($, title, url) {
  const sections = [];
  const components = [];

  // Analyze main content areas
  const mainContent = $("main, .main, .content, #content").first();
  const hasMainContent = mainContent.length > 0;

  // Check for navigation
  const navigation = $('nav, .nav, .navigation, [role="navigation"]');
  const navLinks = navigation.find("a").length;

  // Check for header
  const header = $("header, .header");
  const headerText = header.text().trim().substring(0, 100);

  // Check for sections and content blocks
  $("section, .section, article, .article").each((i, el) => {
    const $el = $(el);
    const hasHeading = $el.find("h1, h2, h3, h4, h5, h6").length > 0;
    const hasImages = $el.find("img").length > 0;
    const hasButtons = $el.find("button, .btn, .button").length > 0;
    const hasLinks = $el.find("a").length > 0;

    sections.push({
      type: "content-block",
      heading: $el
        .find("h1, h2, h3, h4, h5, h6")
        .first()
        .text()
        .trim()
        .substring(0, 50),
      text: $el.text().trim().substring(0, 100),
      hasImages,
      hasButtons,
      hasLinks,
    });
  });

  // Identify component types
  const buttonCount = $(
    'button, .btn, input[type="button"], input[type="submit"]'
  ).length;
  const formCount = $("form").length;
  const imageCount = $("img").length;
  const cardCount = $(".card, .tile, .item").length;

  if (buttonCount > 0) components.push(`${buttonCount} buttons`);
  if (formCount > 0) components.push(`${formCount} forms`);
  if (imageCount > 0) components.push(`${imageCount} images`);
  if (cardCount > 0) components.push(`${cardCount} cards/tiles`);

  // Generate descriptive prompt
  let prompt = `Website "${title}" (${url}) analysis:\n\n`;

  if (headerText) {
    prompt += `Header: ${headerText}\n`;
  }

  if (navLinks > 0) {
    prompt += `Navigation: ${navLinks} navigation links\n`;
  }

  if (hasMainContent) {
    prompt += `Main content area: Present with structured content\n`;
  }

  if (sections.length > 0) {
    prompt += `\nContent sections (${sections.length}):\n`;
    sections.slice(0, 5).forEach((section, i) => {
      prompt += `${i + 1}. ${section.heading || "Untitled section"}: ${
        section.text
      }\n`;
      if (section.hasImages) prompt += "   - Contains images\n";
      if (section.hasButtons) prompt += "   - Contains buttons\n";
      if (section.hasLinks) prompt += "   - Contains links\n";
    });
  }

  if (components.length > 0) {
    prompt += `\nComponents found: ${components.join(", ")}\n`;
  }

  return prompt;
}
