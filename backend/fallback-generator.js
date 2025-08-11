const { validateWireframeParams } = require("./types");
const { TemplateManager, selectTemplate } = require("./template-manager");
const { generateSiteHeaderHTML } = require("./components/SiteHeaderGenerator");

// Initialize template manager
const templateManager = new TemplateManager();

/**
 * Enhanced fallback wireframe generator with template-based system
 * This prevents template corruption by separating HTML from JavaScript
 */
function createFallbackWireframe(
  description,
  designTheme = "microsoftlearn",
  colorScheme = "primary"
) {
  // Validate parameters
  const validated = validateWireframeParams(
    description,
    designTheme,
    colorScheme
  );
  console.log(`📊 Parameter validation result:`, validated);

  if (!validated.isValid) {
    console.log(`⚠️ Parameter validation warnings:`, validated.errors);
  }

  // Use validated parameters
  const {
    description: validDesc,
    theme,
    colorScheme: validColorScheme,
  } = validated;

  // Microsoft Learn Design System - Official Colors
  const colors = {
    primary: "#0078d4", // Microsoft Learn Primary Blue
    blue: "#0078d4", // Microsoft Learn Blue
    green: "#107c10", // Microsoft Learn Green
    purple: "#5c2d91", // Microsoft Learn Purple
    red: "#d13438", // Microsoft Learn Red
    orange: "#ff8c00", // Microsoft Learn Orange
    teal: "#008272", // Microsoft Learn Teal
    gray: "#605e5c", // Microsoft Learn Gray
    // Microsoft Learn Hero/Banner Specific Colors - UPDATED TO USE TAN BACKGROUNDS
    heroBackground: "#E8E6DF", // Primary hero background - Tan color (no blue!)
    heroGradientStart: "#E8E6DF", // Gradient start (Tan)
    heroGradientEnd: "#D4D1C7", // Gradient end (Slightly darker tan)
    heroText: "#161616", // Hero text color - Black text for tan background
    heroSecondary: "#605e5c", // Secondary hero text
  };

  const primaryColor = colors[validColorScheme] || colors.primary;

  console.log(`🔍 Template selection debug:`, {
    description: validDesc,
    designTheme: theme,
    colorScheme: validColorScheme,
  });

  // Microsoft Learn special handling with template-based system
  if (theme === "microsoftlearn") {
    // Select appropriate template based on description
    const templateName = selectTemplate(validDesc);

    // If no template is selected (null), skip template rendering and use AI-generated inline template
    if (templateName === null) {
      console.log(
        `🤖 No template match - using AI-generated wireframe for: ${validDesc}`
      );
      return createInlineFallbackTemplate(validDesc, theme, primaryColor);
    }

    // Try to render the selected template
    const renderedTemplate = templateManager.renderTemplate(templateName, {
      title: generateCleanTitle(validDesc),
      primaryColor: primaryColor,
      colorScheme: validColorScheme,
    });

    if (renderedTemplate) {
      console.log(`✅ Successfully rendered template: ${templateName}`);
      return renderedTemplate;
    } else {
      console.warn(
        `⚠️ Failed to render template: ${templateName}, falling back to AI-generated wireframe`
      );
    }
  }

  // Fallback to AI-generated inline template for non-Microsoft Learn themes or if template loading fails
  console.log(`🔄 Using AI-generated inline wireframe for theme: ${theme}`);

  return createInlineFallbackTemplate(validDesc, theme, primaryColor);
}

/**
 * AI-powered fallback wireframe generator with Microsoft Learn styling
 */
function analyzeDescription(description) {
  const desc = description.toLowerCase();

  // Extract UI elements using NLP patterns
  const elements = {
    buttons: extractButtons(desc),
    forms: extractForms(desc),
    navigation: extractNavigation(desc),
    content: extractContent(desc),
    layout: extractLayout(desc),
    colors: extractColors(desc),
    actions: extractActions(desc),
    cards: extractCards(desc),
  };

  // Determine primary purpose
  const purpose = determinePurpose(desc);

  // Extract specific requirements
  const requirements = extractRequirements(desc);

  return { elements, purpose, requirements, originalDescription: description };
}

/**
 * Extract button specifications from description
 */
function extractButtons(desc) {
  const buttons = [];

  // Count buttons
  const buttonMatches =
    desc.match(/(\w+)\s+button[s]?|button[s]?\s+(\w+)/g) || [];
  const numberWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

  // Look for specific numbers
  const numberMatch = desc.match(
    /(\d+|one|two|three|four|five|six)\s+button[s]?/
  );
  let buttonCount = 1; // default

  if (numberMatch) {
    const num = numberMatch[1];
    buttonCount = numberWords[num] || parseInt(num) || 1;
  }

  // Extract button labels and actions
  const actionWords = [
    "submit",
    "cancel",
    "save",
    "delete",
    "edit",
    "create",
    "send",
    "login",
    "signup",
    "download",
    "upload",
    "start",
    "stop",
    "next",
    "previous",
    "back",
    "continue",
    "finish",
  ];

  for (let i = 0; i < buttonCount; i++) {
    let label = "Button " + (i + 1);
    let type = "primary";

    // Try to find specific button labels
    if (desc.includes("submit")) {
      label = "Submit";
      type = "primary";
    } else if (desc.includes("cancel")) {
      label = "Cancel";
      type = "secondary";
    } else if (desc.includes("save")) {
      label = "Save";
      type = "primary";
    } else if (desc.includes("send")) {
      label = "Send";
      type = "primary";
    } else if (desc.includes("login")) {
      label = "Login";
      type = "primary";
    } else if (desc.includes("signup")) {
      label = "Sign Up";
      type = "primary";
    } else if (desc.includes("download")) {
      label = "Download";
      type = "primary";
    } else if (desc.includes("start")) {
      label = "Get Started";
      type = "primary";
    } else if (desc.includes("next")) {
      label = "Next";
      type = "primary";
    } else if (desc.includes("back")) {
      label = "Back";
      type = "secondary";
    }

    // For multiple buttons, create logical combinations
    if (buttonCount === 2) {
      if (i === 0) {
        label = desc.includes("form") ? "Submit" : "Primary Action";
        type = "primary";
      }
      if (i === 1) {
        label = "Cancel";
        type = "secondary";
      }
    } else if (buttonCount === 3) {
      if (i === 0) {
        label = "Save";
        type = "primary";
      }
      if (i === 1) {
        label = "Cancel";
        type = "secondary";
      }
      if (i === 2) {
        label = "Delete";
        type = "danger";
      }
    }

    buttons.push({ label, type, action: label.toLowerCase() });
  }

  return buttons;
}

/**
 * Extract form specifications
 */
function extractForms(desc) {
  const forms = [];

  if (
    desc.includes("form") ||
    desc.includes("input") ||
    desc.includes("field") ||
    desc.includes("textbox") ||
    desc.includes("text box")
  ) {
    const fields = [];

    // Common form fields
    if (desc.includes("email"))
      fields.push({ type: "email", label: "Email", required: true });
    if (desc.includes("password"))
      fields.push({ type: "password", label: "Password", required: true });
    if (desc.includes("name"))
      fields.push({ type: "text", label: "Name", required: true });
    if (desc.includes("phone"))
      fields.push({ type: "tel", label: "Phone", required: false });
    if (desc.includes("message"))
      fields.push({ type: "textarea", label: "Message", required: true });
    if (desc.includes("address"))
      fields.push({ type: "text", label: "Address", required: false });
    if (desc.includes("company"))
      fields.push({ type: "text", label: "Company", required: false });

    // Extract specific textbox counts
    const textboxMatch = desc.match(
      /(\d+|one|two|three|four|five|six)\s+(textbox|text\s*box)/i
    );
    if (textboxMatch) {
      const numberWords = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
      };
      const count =
        numberWords[textboxMatch[1].toLowerCase()] ||
        parseInt(textboxMatch[1]) ||
        2;

      // Clear existing default fields if we have specific textbox count
      if (fields.length === 0) {
        for (let i = 0; i < count; i++) {
          fields.push({
            type: "text",
            label: i === 0 ? "Input " + (i + 1) : "Input " + (i + 1),
            required: false,
          });
        }
      }
    }

    // If no specific fields mentioned, create a default contact form
    if (fields.length === 0) {
      fields.push({ type: "text", label: "Name", required: true });
      fields.push({ type: "email", label: "Email", required: true });
      fields.push({ type: "textarea", label: "Message", required: true });
    }

    forms.push({ type: "contact", fields });
  }

  return forms;
}

/**
 * Extract navigation requirements
 */
function extractNavigation(desc) {
  const nav = { type: "none", items: [] };

  if (
    desc.includes("nav") ||
    desc.includes("menu") ||
    desc.includes("header")
  ) {
    nav.type = "horizontal";
    nav.items = ["Home", "About", "Services", "Contact"];
  }

  return nav;
}

/**
 * Extract content specifications
 */
function extractContent(desc) {
  const content = {
    title: "",
    subtitle: "",
    sections: [],
  };

  // Extract title from description
  content.title = desc.charAt(0).toUpperCase() + desc.slice(1);
  content.subtitle = "AI-Generated Wireframe";

  // Determine content sections based on purpose
  if (desc.includes("dashboard")) {
    content.sections = ["Overview", "Analytics", "Reports"];
  } else if (desc.includes("landing")) {
    content.sections = ["Hero", "Features", "Testimonials", "Contact"];
  } else if (desc.includes("product")) {
    content.sections = ["Product Info", "Specifications", "Reviews"];
  } else {
    content.sections = ["Introduction", "Features", "Contact"];
  }

  return content;
}

/**
 * Extract layout type
 */
function extractLayout(desc) {
  if (desc.includes("sidebar")) return "sidebar";
  if (desc.includes("grid")) return "grid";
  if (desc.includes("list")) return "list";
  if (desc.includes("card")) return "cards";
  return "standard";
}

/**
 * Detect if description requires a hero/banner section
 */
function detectHeroSection(desc) {
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

  return (
    heroKeywords.some((keyword) => desc.includes(keyword)) ||
    desc.includes("page") ||
    desc.includes("site") ||
    desc.includes("website")
  );
}

/**
 * Extract color preferences
 */
function extractColors(desc) {
  const colors = {};
  if (desc.includes("blue")) colors.accent = "#0078d4";
  if (desc.includes("green")) colors.accent = "#107c10";
  if (desc.includes("red")) colors.accent = "#d13438";
  if (desc.includes("purple")) colors.accent = "#5c2d91";
  if (desc.includes("dark")) colors.theme = "dark";
  if (desc.includes("light")) colors.theme = "light";
  return colors;
}

/**
 * Extract specific actions
 */
function extractActions(desc) {
  const actions = [];
  if (desc.includes("search")) actions.push("search");
  if (desc.includes("filter")) actions.push("filter");
  if (desc.includes("sort")) actions.push("sort");
  if (desc.includes("upload")) actions.push("upload");
  if (desc.includes("download")) actions.push("download");
  return actions;
}

/**
 * Detect if description requires card components
 */
function extractCards(desc) {
  const cards = [];
  const cardKeywords = [
    "card",
    "cards",
    "grid",
    "gallery",
    "showcase",
    "portfolio",
    "products",
    "items",
    "collection",
    "catalog",
    "listing",
    "courses",
    "articles",
    "posts",
    "content",
  ];

  // Check if cards are mentioned
  const hasCards = cardKeywords.some((keyword) => desc.includes(keyword));

  if (hasCards || desc.includes("multiple") || desc.includes("several")) {
    // Determine card type based on content
    let cardType = "content";
    let cardCount = 3; // default

    // Extract number of cards
    const numberMatch = desc.match(
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(card|item|product|course|article)/i
    );
    if (numberMatch) {
      const numberWords = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
      };
      cardCount =
        numberWords[numberMatch[1].toLowerCase()] ||
        parseInt(numberMatch[1]) ||
        3;
    }

    // Determine card content type
    if (desc.includes("course") || desc.includes("learning")) {
      cardType = "course";
    } else if (desc.includes("product") || desc.includes("shop")) {
      cardType = "product";
    } else if (desc.includes("article") || desc.includes("blog")) {
      cardType = "article";
    } else if (desc.includes("team") || desc.includes("people")) {
      cardType = "profile";
    }

    // Generate cards
    for (let i = 0; i < cardCount; i++) {
      cards.push({
        type: cardType,
        title: getCardTitle(cardType, i + 1),
        supertitle: getCardSupertitle(cardType),
        description: getCardDescription(cardType, i + 1),
        hasFooter: cardType === "course" || cardType === "product",
        hasIcon: cardType === "course" || cardType === "product",
      });
    }
  }

  return cards;
}

/**
 * Generate card titles based on type
 */
function getCardTitle(type, index) {
  const titles = {
    course: [
      "Introduction to Web Development",
      "Advanced JavaScript Concepts",
      "Building Modern Web Apps",
      "Database Design Fundamentals",
    ],
    product: [
      "Premium Wireless Headphones",
      "Smart Home Security Camera",
      "Ergonomic Office Chair",
      "Bluetooth Speaker Set",
    ],
    article: [
      "Getting Started with AI",
      "Best Practices for Remote Work",
      "Future of Technology",
      "Design Trends 2025",
    ],
    profile: [
      "Sarah Johnson - Product Manager",
      "Mike Chen - Senior Developer",
      "Elena Rodriguez - UX Designer",
      "David Kim - Data Scientist",
    ],
    content: [
      "Featured Content Item",
      "Popular Resource",
      "Recommended Reading",
      "Trending Topic",
    ],
  };

  return titles[type]
    ? titles[type][(index - 1) % titles[type].length]
    : `${type} Item ${index}`;
}

/**
 * Generate card supertitles based on type
 */
function getCardSupertitle(type) {
  const supertitles = {
    course: "COURSE",
    product: "PRODUCT",
    article: "ARTICLE",
    profile: "TEAM MEMBER",
    content: "CONTENT",
  };

  return supertitles[type] || "ITEM";
}

/**
 * Generate card descriptions based on type
 */
function getCardDescription(type, index) {
  const descriptions = {
    course: [
      "Learn the fundamentals of modern web development with hands-on projects.",
      "Master advanced JavaScript concepts including async programming and frameworks.",
      "Build responsive, interactive web applications using modern tools.",
      "Design efficient database schemas and optimize query performance.",
    ],
    product: [
      "High-quality wireless audio with noise cancellation and 30-hour battery life.",
      "Monitor your home with 4K video, night vision, and smart alerts.",
      "Ergonomic design with lumbar support for all-day comfort.",
      "Rich, immersive sound with wireless connectivity and voice control.",
    ],
    article: [
      "Explore how artificial intelligence is transforming industries.",
      "Essential strategies for productive remote work environments.",
      "Upcoming technology trends that will shape the next decade.",
      "Visual design trends and patterns for modern interfaces.",
    ],
    profile: [
      "Experienced product manager with expertise in user research.",
      "Full-stack developer specializing in modern web technologies.",
      "Creative designer focused on user experience and accessibility.",
      "Data scientist with machine learning and analytics expertise.",
    ],
    content: [
      "Discover featured content curated for your interests.",
      "Popular resources recommended by the community.",
      "Essential reading materials for professional development.",
      "Current trending topics in technology and design.",
    ],
  };

  return descriptions[type]
    ? descriptions[type][(index - 1) % descriptions[type].length]
    : `Description for ${type} item ${index}.`;
}

/**
 * Determine primary purpose
 */
function determinePurpose(desc) {
  if (desc.includes("form") || desc.includes("contact")) return "form";
  if (desc.includes("dashboard") || desc.includes("admin")) return "dashboard";
  if (desc.includes("landing") || desc.includes("home")) return "landing";
  if (desc.includes("shop") || desc.includes("product")) return "ecommerce";
  if (desc.includes("blog") || desc.includes("article")) return "content";
  if (desc.includes("gallery") || desc.includes("portfolio")) return "gallery";
  return "general";
}

/**
 * Extract specific requirements
 */
function extractRequirements(desc) {
  const req = {
    responsive: true,
    accessible: true,
    interactive: desc.includes("interactive") || desc.includes("dynamic"),
    animated: desc.includes("animated") || desc.includes("smooth"),
    modern: desc.includes("modern") || desc.includes("contemporary"),
    minimal: desc.includes("minimal") || desc.includes("clean"),
    professional: desc.includes("professional") || desc.includes("business"),
  };
  return req;
}

/**
 * Generate smart layout based on AI analysis
 */
function generateSmartLayout(analysis, description, primaryColor) {
  const { elements, purpose, requirements } = analysis;

  // Generate intelligent CSS based on analysis
  const styles = generateIntelligentStyles(
    elements,
    purpose,
    requirements,
    primaryColor
  );

  // Generate dynamic HTML content
  const htmlContent = generateDynamicContent(
    elements,
    purpose,
    analysis.originalDescription
  );

  return {
    layout: purpose,
    elements: elements,
    content: htmlContent,
    styles: styles,
  };
}

/**
 * Generate intelligent CSS styles
 */
function generateIntelligentStyles(
  elements,
  purpose,
  requirements,
  primaryColor
) {
  // Detect if this should have a hero/banner section
  const hasHero =
    detectHeroSection(purpose) ||
    elements.navigation.type !== "none" ||
    purpose === "landing" ||
    purpose === "general";

  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #323130;
      background: ${requirements.modern ? "#faf9f8" : "#f3f2f1"};
      font-size: 14px;
      ${
        requirements.minimal
          ? "font-weight: 400;"
          : "/* minimal styling disabled */"
      }
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .hero-section {
      background: ${
        hasHero
          ? "#E8E6DF" // Use tan background for hero sections (no blue!)
          : requirements.modern
          ? "#E8E6DF" // Use tan background for modern headers too
          : "#E8E6DF" // Always use tan background (no blue!)
      };
      color: #161616; // Black text for tan background
      padding: ${
        hasHero ? "5rem 0" : requirements.minimal ? "3rem 0" : "4rem 0"
      };
      text-align: center;
      ${
        requirements.modern
          ? "box-shadow: 0 4px 20px rgba(232, 230, 223, 0.5);"
          : ""
      }
      position: relative;
      overflow: hidden;
    }
    
    .header-content {
      position: relative;
      z-index: 2;
    }
    
    .header-content h2 {
      font-size: ${requirements.minimal ? "1.25rem" : "1.5rem"};
      margin-bottom: 1rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    
    .header-content p {
      font-size: 1.25rem;
      opacity: 0.95;
      font-weight: 400;
      margin-bottom: 0;
    }
    
    main {
      padding: 3rem 0;
    }
    
    .content-section {
      background: white;
      margin: 2rem 0;
      padding: 3rem 2rem;
      border-radius: ${requirements.modern ? "8px" : "4px"};
      box-shadow: ${
        requirements.modern
          ? "0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)"
          : "0 2px 4px rgba(0,0,0,0.1)"
      };
      border: 1px solid #edebe9;
    }
    
    .content-section h2 {
      color: #323130;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      letter-spacing: -0.01em;
    }
    
    .content-section p {
      color: #605e5c;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
      flex-wrap: wrap;
      ${
        elements.buttons.length > 2
          ? "justify-content: center;"
          : "justify-content: flex-start;"
      }
    }
    
    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: ${requirements.modern ? "4px" : "2px"};
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: none;
      letter-spacing: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }
    
    .btn-primary {
      background: #0078d4;
      color: white;
      border: 2px solid #0078d4;
    }
    
    .btn-primary:hover {
      background: #106ebe;
      border-color: #106ebe;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,120,212,0.4);
    }
    
    .btn-secondary {
      background: transparent;
      color: #0078d4;
      border: 2px solid #0078d4;
    }
    
    .btn-secondary:hover {
      background: #0078d4;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,120,212,0.3);
    }
    
    .btn-danger {
      background: #d13438;
      color: white;
      border: 2px solid #d13438;
    }
    
    .btn-danger:hover {
      background: #c82333;
      border-color: #c82333;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(209,52,56,0.4);
    }
    
    .form-section {
      max-width: 600px;
      margin: 2rem auto;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #323130;
      font-size: 0.875rem;
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #8a8886;
      border-radius: 2px;
      font-size: 1rem;
      font-family: 'Segoe UI', system-ui, sans-serif;
      transition: all 0.2s ease;
      background: white;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #0078d4;
      box-shadow: 0 0 0 2px rgba(0,120,212,0.3);
    }
    
    .form-group input:hover,
    .form-group textarea:hover {
      border-color: #323130;
    }
    
    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }
    
    /* Microsoft Atlas Design Card Components */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
      gap: 1rem;
      margin: 1.5rem 0;
      justify-content: start;
    }
    
    .card {
      background: white;
      border: 1px solid #e1dfdd;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-width: 300px;
      width: 100%;
    }
    
    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
    
    .card-header {
      padding: 0.75rem;
      background: #f8f6f4;
      border-bottom: 1px solid #e1dfdd;
      position: relative;
    }
    
    .card-header-image img {
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }
    
    .card-template,
    .card-content {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .card-template {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto 1fr;
      grid-template-areas: 
        "supertitle icon"
        "title icon"
        "detail icon";
      gap: 0.5rem 1rem;
    }
    
    .card-supertitle {
      grid-area: supertitle;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #605e5c;
      letter-spacing: 0.5px;
      margin: 0 0 0.25rem 0;
    }
    
    .card-title {
      grid-area: title;
      font-size: 1rem;
      font-weight: 600;
      color: #0078d4;
      text-decoration: none;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-title:hover {
      color: #106ebe;
      text-decoration: underline;
    }
    
    .card-template-icon {
      grid-area: icon;
      width: 40px;
      height: 40px;
      border-radius: 4px;
      align-self: start;
    }
    
    .card-template-detail {
      grid-area: detail;
      color: #605e5c;
      font-size: 0.8125rem;
      line-height: 1.4;
      margin-top: 0.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-content-description {
      color: #605e5c;
      font-size: 0.8125rem;
      line-height: 1.5;
      margin: 0.5rem 0 0 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-footer {
      padding: 0.75rem 1rem;
      background: #faf9f8;
      border-top: 1px solid #e1dfdd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      min-height: auto;
    }
    
    .card-footer-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
    
    .card-footer .buttons {
      display: flex;
      gap: 0.375rem;
    }
    
    .card-footer .btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      min-width: auto;
      font-weight: 500;
    }
    
    .card-horizontal {
      flex-direction: row;
    }
    
    .card-horizontal .card-header {
      width: 120px;
      flex-shrink: 0;
    }
    
    .card-horizontal .card-content {
      flex: 1;
    }
    
    progress {
      height: 4px;
      border-radius: 2px;
      background: #e1dfdd;
      border: none;
      width: 50px;
    }
    
    progress::-webkit-progress-bar {
      background: #e1dfdd;
      border-radius: 3px;
    }
    
    progress::-webkit-progress-value {
      background: #0078d4;
      border-radius: 3px;
    }
    
    progress::-moz-progress-bar {
      background: #0078d4;
      border-radius: 3px;
      border: none;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      
      .header-content h2 {
        font-size: 1.125rem;
      }
      
      .button-group {
        flex-direction: column;
        align-items: stretch;
      }
      
      .btn {
        width: 100%;
        margin-bottom: 0.5rem;
      }
      
      .cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 280px));
        gap: 0.75rem;
        justify-content: center;
      }
      
      .card {
        max-width: 280px;
      }
      
      .card-template,
      .card-content {
        padding: 0.875rem;
      }
      
      .card-footer {
        padding: 0.625rem 0.875rem;
      }
    }
  `;

  return baseStyles;
}

/**
 * Generate clean demo title based on description keywords
 */
function generateCleanTitle(description) {
  const desc = description.toLowerCase();

  // Microsoft Learn specific titles
  if (desc.includes("microsoft learn") && desc.includes("course")) {
    return "Microsoft Learn Course Page";
  }
  if (desc.includes("microsoft") && desc.includes("doc")) {
    return "Microsoft Documentation";
  }
  if (desc.includes("learning path") || desc.includes("learning module")) {
    return "Learning Path Overview";
  }

  // Generic titles based on purpose
  if (desc.includes("dashboard") || desc.includes("admin")) {
    return "Admin Dashboard";
  }
  if (
    desc.includes("ecommerce") ||
    desc.includes("product") ||
    desc.includes("shopping")
  ) {
    return "E-commerce Platform";
  }
  if (desc.includes("landing") || desc.includes("home")) {
    return "Landing Page";
  }
  if (desc.includes("documentation") || desc.includes("docs")) {
    return "Documentation Hub";
  }
  if (desc.includes("profile") || desc.includes("user")) {
    return "User Profile";
  }
  if (desc.includes("form") || desc.includes("contact")) {
    return "Contact Form";
  }

  // Default clean title
  return "Demo Wireframe Layout";
}

/**
 * Generate dynamic HTML content based on analysis
 */
function generateDynamicContent(elements, purpose, description) {
  const cleanTitle = generateCleanTitle(description);

  let content = `
    <section class="hero-section">
      <div class="container">
        <div class="header-content">
          <h2>${cleanTitle}</h2>
          <p>AI-Generated Smart Wireframe</p>
        </div>
      </div>
    </section>
    
    <main>
      <div class="container">
  `;

  // Add form if detected
  if (elements.forms.length > 0) {
    content += `
      <div class="content-section">
        <h2>Form</h2>
        <div class="form-section">
          <form>
    `;

    elements.forms[0].fields.forEach((field) => {
      if (field.type === "textarea") {
        content += `
          <div class="form-group">
            <label for="${field.label.toLowerCase()}">${field.label}${
          field.required ? " *" : ""
        }</label>
            <textarea id="${field.label.toLowerCase()}" name="${field.label.toLowerCase()}" ${
          field.required ? "required" : ""
        }></textarea>
          </div>
        `;
      } else {
        content += `
          <div class="form-group">
            <label for="${field.label.toLowerCase()}">${field.label}${
          field.required ? " *" : ""
        }</label>
            <input type="${
              field.type
            }" id="${field.label.toLowerCase()}" name="${field.label.toLowerCase()}" ${
          field.required ? "required" : ""
        }>
          </div>
        `;
      }
    });

    content += `
          </form>
        </div>
      </div>
    `;
  }

  // Add cards if detected
  if (elements.cards.length > 0) {
    content += `
      <div class="content-section">
        <h2>Featured Content</h2>
        <div class="cards-grid">
          ${elements.cards.map((card) => generateAtlasCard(card)).join("")}
        </div>
      </div>
    `;
  }

  // Add main content section
  content += `
    <div class="content-section">
      <h2>Content Section</h2>
      <p>This AI-generated wireframe was created based on your description: "${description}"</p>
      
      ${
        elements.buttons.length > 0
          ? `
        <div class="button-group">
          ${elements.buttons
            .map(
              (button) => `
            <button class="btn btn-${button.type}" onclick="alert('${button.label} clicked!')">${button.label}</button>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `;

  content += `
      </div>
    </main>
  `;

  return content;
}

/**
 * Generate Microsoft Atlas Design card component
 */
function generateAtlasCard(card) {
  const iconSrc = getCardIconSrc(card.type);

  return `
    <article class="card">
      ${
        card.hasIcon
          ? `
      <div class="card-template">
        <p class="card-supertitle">${card.supertitle}</p>
        <a href="#" class="card-title">${card.title}</a>
        <img
          aria-hidden="true"
          class="card-template-icon"
          src="${iconSrc}"
          alt=""
        />
        <div class="card-template-detail">
          <p>${card.description}</p>
        </div>
      </div>
      `
          : `
      <div class="card-content">
        <p class="card-supertitle">${card.supertitle}</p>
        <a href="#" class="card-title">${card.title}</a>
        <p class="card-content-description">${card.description}</p>
      </div>
      `
      }
      ${
        card.hasFooter
          ? `
      <div class="card-footer">
        <div class="card-footer-item">
          ${
            card.type === "course"
              ? `
          <progress style="width: 60px;" max="100" value="${Math.floor(
            Math.random() * 100
          )}"></progress>
          `
              : `
          <span style="color: #107c10; font-size: 0.875rem;">✓ Available</span>
          `
          }
        </div>
        <div class="card-footer-item">
          <div class="buttons">
            <button class="btn btn-primary">View Details</button>
          </div>
        </div>
      </div>
      `
          : ""
      }
    </article>
  `;
}

/**
 * Get appropriate icon source for card type
 */
function getCardIconSrc(type) {
  const icons = {
    course: "course.png",
    product:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNCIgZmlsbD0iIzAwNzhkNCIvPgo8cGF0aCBkPSJNMjQgMTJMMzAgMThIMThMMjQgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTggMThIMzBWMzZIMThWMThaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
    article:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNCIgZmlsbD0iIzEwN2MxMCIvPgo8cGF0aCBkPSJNMTQgMTZIMzRWMjBIMTRWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQgMjRIMzRWMjhIMTRWMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQgMzJIMjhWMzZIMTRWMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
    profile:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM1YzJkOTEiLz4KPGV5Y2xlIGN4PSIyNCIgY3k9IjIwIiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTAgMzZDMTAgMzAgMTYuNSAyNiAyNCAyNkMzMS41IDI2IDM4IDMwIDM4IDM2VjQwSDEwVjM2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
    content:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNCIgZmlsbD0iIzYwNWU1YyIvPgo8cGF0aCBkPSJNMTYgMTZIMzJWMjBIMTZWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMjRIMzJWMjhIMTZWMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMzJIMzJWMzZIMTZWMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
  };

  return icons[type] || icons.content;
}

/**
 * AI-powered wireframe generator that analyzes user descriptions and creates intelligent layouts
 * Uses natural language processing to understand requirements and generate appropriate UI elements
 */
function createInlineFallbackTemplate(description, theme, primaryColor) {
  // AI-powered description analysis
  const analysis = analyzeDescription(description);
  const { layout, elements, content, styles } = generateSmartLayout(
    analysis,
    description,
    primaryColor
  );

  // Get Microsoft Learn TopNav components
  const msLearnTopNav = createMicrosoftLearnTopNav();
  const msLearnTopNavCSS = getMicrosoftLearnTopNavCSS();

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        ${msLearnTopNavCSS}
        ${styles}
    </style>
</head>
<body>
    ${msLearnTopNav}
    
    ${content}
    
    <footer style="background: #333; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem;">
        <div class="container">
            <p>&copy; 2025 ${description} | AI-Generated by DesignEtica</p>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * Create Microsoft Learn Site Header HTML using official design system
 */
function createMicrosoftLearnTopNav() {
  return generateSiteHeaderHTML();
}

/**
 * Get Microsoft Learn TopNav CSS
 */
function getMicrosoftLearnTopNavCSS() {
  return `
    /* Microsoft Learn TopNav Styles */
    :root {
      --ms-color-primary: #0078d4;
      --ms-color-primary-hover: #106ebe;
      --ms-color-white: #ffffff;
      --ms-color-gray-100: #f1f1f1;
      --ms-color-gray-600: #5c5c5c;
      --ms-font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      --ms-shadow-nav: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .ms-learn-topnav {
      font-family: var(--ms-font-family);
      background-color: #ffffff !important;
      position: static;
      z-index: 1000;
      width: 100%;
      box-shadow: var(--ms-shadow-nav);
    }

    /* Main Navigation */
    .ms-learn-nav {
      background-color: #ffffff !important;
      border-bottom: 1px solid #e1e1e1;
    }

    .ms-learn-nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
        background-color: #fff;

    }

    .ms-learn-nav-left {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .ms-learn-nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* Logo */
    .ms-learn-logo-link {
      text-decoration: none;
      color: inherit;
    }

    .ms-learn-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ms-learn-logo-text {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }

    /* Primary Navigation */
    .ms-learn-primary-nav {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .ms-learn-nav-item {
      position: relative;
    }

    .ms-learn-nav-button,
    .ms-learn-nav-link {
      background: none;
      border: none;
      color: #1a1a1a;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      padding: 8px 0;
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .ms-learn-nav-button:hover,
    .ms-learn-nav-link:hover {
      color: var(--ms-color-primary);
    }

    /* Search */
    .ms-learn-search-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .ms-learn-search-input {
      border: 1px solid #d1d1d1;
      border-radius: 4px;
      padding: 8px 40px 8px 12px;
      font-size: 14px;
      width: 280px;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .ms-learn-search-input:focus {
      border-color: var(--ms-color-primary);
    }

    .ms-learn-search-button {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #5c5c5c;
      padding: 4px;
    }

    /* Mobile Toggle */
    .ms-learn-mobile-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .ms-learn-nav-container {
        padding: 0 12px;
      }
      
      .ms-learn-search-input {
        width: 200px;
      }
    }

    @media (max-width: 768px) {
      .ms-learn-primary-nav {
        display: none;
      }
      
      .ms-learn-search {
        display: none;
      }
      
      .ms-learn-mobile-toggle {
        display: block;
      }
      
      .ms-learn-nav-container {
        padding: 0 8px;
        height: 48px;
      }
      
      .ms-learn-logo-text {
        font-size: 16px;
      }
    }

    @media (max-width: 480px) {
      .ms-learn-nav-container {
        padding: 0 4px;
        height: 44px;
      }
      
      .ms-learn-logo {
        gap: 8px;
      }
      
      .ms-learn-logo-text {
        font-size: 14px;
      }
    }
  `;
}

// Export functions for use in other modules
module.exports = {
  createFallbackWireframe,
  createInlineFallbackTemplate,
  createMicrosoftLearnTopNav,
  getMicrosoftLearnTopNavCSS,
  analyzeDescription,
};
