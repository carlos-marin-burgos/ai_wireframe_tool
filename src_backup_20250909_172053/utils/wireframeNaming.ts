/**
 * Smart wireframe naming utility
 * Generates comprehensive names based on wireframe content and description
 */

interface WireframeAnalysis {
  components: string[];
  purpose: string;
  industry: string;
  layout: string;
}

export function generateWireframeName(
  description: string,
  htmlContent?: string
): string {
  // Use description as primary source of truth
  if (description && description.trim()) {
    const descriptionBased = extractMainConceptFromDescription(description);
    if (descriptionBased) {
      return toTitleCase(descriptionBased + " Wireframe");
    }
  }

  // Only analyze HTML content if description is empty or very generic
  if (!description || description.trim().length < 10) {
    const analysis = analyzeWireframe(description || "", htmlContent);
    return generateNameFromAnalysis(analysis, description);
  }

  // Default fallback
  return "Custom Wireframe";
}

function generateNameFromAnalysis(
  analysis: WireframeAnalysis,
  description: string
): string {
  const nameParts: string[] = [];

  // Only add industry if it's very specific and confident
  if (
    analysis.industry &&
    isHighConfidenceIndustry(analysis.industry, description)
  ) {
    nameParts.push(analysis.industry);
  }

  // Add purpose/type
  if (analysis.purpose) {
    nameParts.push(analysis.purpose);
  }

  // Add layout type if specific and not redundant
  if (
    analysis.layout &&
    analysis.layout !== "standard" &&
    analysis.layout !== "grid"
  ) {
    nameParts.push(analysis.layout);
  }

  // Fallback to description-based name
  if (nameParts.length === 0) {
    nameParts.push(extractMainConcept(description || "Custom"));
  }

  // Join with appropriate connector
  let name = nameParts.join(" ");

  // Ensure it ends with appropriate suffix
  if (
    !name.toLowerCase().includes("wireframe") &&
    !name.toLowerCase().includes("mockup") &&
    !name.toLowerCase().includes("design")
  ) {
    name += " Wireframe";
  }

  // Capitalize appropriately
  return toTitleCase(name);
}

function isHighConfidenceIndustry(
  industry: string,
  description: string
): boolean {
  // Only include industry if it's explicitly mentioned in description
  const desc = description.toLowerCase();

  switch (industry) {
    case "ecommerce":
      return (
        desc.includes("ecommerce") ||
        desc.includes("e-commerce") ||
        (desc.includes("shop") && desc.includes("product"))
      );
    case "education":
      return (
        desc.includes("education") ||
        desc.includes("learn") ||
        desc.includes("course")
      );
    case "healthcare":
      return (
        desc.includes("health") ||
        desc.includes("medical") ||
        desc.includes("doctor")
      );
    default:
      return false;
  }
}

function extractMainConceptFromDescription(description: string): string {
  // Extract key concepts from the user's description
  const desc = description.toLowerCase().trim();

  // Look for specific wireframe types mentioned in description
  if (desc.includes("dashboard")) return "Dashboard";
  if (desc.includes("landing") || desc.includes("homepage"))
    return "Landing Page";
  if (desc.includes("login") || desc.includes("sign in")) return "Login Page";
  if (desc.includes("contact")) return "Contact Form";
  if (desc.includes("profile")) return "Profile Page";
  if (desc.includes("search")) return "Search Page";
  if (desc.includes("checkout")) return "Checkout Page";
  if (desc.includes("product")) return "Product Page";
  if (desc.includes("about")) return "About Page";
  if (desc.includes("blog")) return "Blog Page";
  if (desc.includes("portfolio")) return "Portfolio";

  // Extract first meaningful concept
  const words = desc
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        ![
          "the",
          "and",
          "for",
          "with",
          "create",
          "make",
          "build",
          "design",
          "wireframe",
        ].includes(word)
    );

  if (words.length > 0) {
    return words.slice(0, 2).join(" ");
  }

  return "Custom";
}

function analyzeWireframe(
  description: string,
  htmlContent?: string
): WireframeAnalysis {
  const desc = description.toLowerCase();
  const html = htmlContent?.toLowerCase() || "";

  // Detect industry/domain
  const industry = detectIndustry(desc);

  // Detect purpose/type
  const purpose = detectPurpose(desc, html);

  // Detect layout type
  const layout = detectLayout(desc, html);

  // Extract components
  const components = extractComponents(desc, html);

  return { components, purpose, industry, layout };
}

function detectIndustry(text: string): string {
  const industries = {
    healthcare: [
      "health",
      "medical",
      "doctor",
      "patient",
      "hospital",
      "clinic",
    ],
    ecommerce: [
      "shop",
      "store",
      "product",
      "cart",
      "checkout",
      "payment",
      "order",
    ],
    education: [
      "learn",
      "course",
      "student",
      "teacher",
      "school",
      "university",
      "education",
    ],
    finance: ["bank", "finance", "payment", "money", "investment", "trading"],
    "real estate": ["property", "house", "apartment", "real estate", "listing"],
    travel: ["travel", "hotel", "booking", "flight", "vacation", "trip"],
    food: ["restaurant", "food", "menu", "recipe", "cooking", "delivery"],
    fitness: ["fitness", "gym", "workout", "exercise", "health", "training"],
    social: ["social", "chat", "message", "friend", "community", "profile"],
    business: [
      "business",
      "corporate",
      "company",
      "professional",
      "enterprise",
    ],
    tech: ["software", "app", "technology", "digital", "platform", "system"],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return industry;
    }
  }

  return "";
}

function detectPurpose(desc: string, html: string): string {
  const purposes = {
    Dashboard: ["dashboard", "analytics", "metrics", "overview", "summary"],
    "Landing Page": ["landing", "homepage", "welcome", "intro", "main page"],
    "Login Page": ["login", "sign in", "authentication", "auth"],
    Registration: ["register", "sign up", "signup", "create account"],
    "Contact Form": ["contact", "contact us", "get in touch", "support"],
    "Product Page": ["product detail", "product page", "item detail"],
    "Search Results": ["search", "results", "listing", "browse"],
    "Profile Page": ["profile", "account", "user page", "settings"],
    Checkout: ["checkout", "payment", "purchase", "order"],
    Blog: ["blog", "article", "post", "news"],
    Portfolio: ["portfolio", "gallery", "showcase", "work"],
    "About Page": ["about", "about us", "team", "company info"],
    "Features Page": ["features", "capabilities", "functionality"],
    "Pricing Page": ["pricing", "plans", "subscription", "cost"],
    FAQ: ["faq", "frequently asked", "questions", "help"],
    Documentation: ["docs", "documentation", "guide", "manual"],
    "Admin Panel": ["admin", "management", "control panel", "backend"],
  };

  for (const [purpose, keywords] of Object.entries(purposes)) {
    if (
      keywords.some(
        (keyword) => desc.includes(keyword) || html.includes(keyword)
      )
    ) {
      return purpose;
    }
  }

  return "";
}

function detectLayout(desc: string, html: string): string {
  const layouts = {
    responsive: ["responsive", "mobile", "tablet", "adaptive"],
    grid: ["grid", "cards", "gallery", "masonry"],
    sidebar: ["sidebar", "side nav", "navigation"],
    "header-footer": ["header", "footer", "navigation"],
    "single-page": ["single page", "one page", "scrolling"],
    "multi-step": ["wizard", "steps", "multi-step", "flow"],
    modal: ["modal", "popup", "overlay", "dialog"],
  };

  for (const [layout, keywords] of Object.entries(layouts)) {
    if (
      keywords.some(
        (keyword) => desc.includes(keyword) || html.includes(keyword)
      )
    ) {
      return layout;
    }
  }

  return "standard";
}

function extractComponents(desc: string, html: string): string[] {
  const components = [];
  const componentKeywords = {
    form: ["form", "input", "field", "submit"],
    navigation: ["nav", "menu", "navigation", "breadcrumb"],
    search: ["search", "filter", "find"],
    table: ["table", "list", "data grid"],
    chart: ["chart", "graph", "analytics", "visualization"],
    card: ["card", "tile", "panel"],
    button: ["button", "cta", "action"],
    image: ["image", "photo", "gallery", "media"],
    video: ["video", "player", "streaming"],
    social: ["social", "share", "like", "follow"],
  };

  for (const [component, keywords] of Object.entries(componentKeywords)) {
    if (
      keywords.some(
        (keyword) => desc.includes(keyword) || html.includes(keyword)
      )
    ) {
      components.push(component);
    }
  }

  return components;
}

function extractMainConcept(description: string): string {
  // Remove common stop words and extract key concept
  const stopWords = [
    "a",
    "an",
    "the",
    "for",
    "with",
    "and",
    "or",
    "but",
    "create",
    "make",
    "build",
    "design",
  ];
  const words = description
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  // Return first meaningful word or phrase
  if (words.length > 0) {
    return words.slice(0, 2).join(" ");
  }

  return "Custom";
}

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Export additional utility functions
export function generateShortName(fullName: string): string {
  // Generate a shorter version for display in tight spaces
  const words = fullName.split(" ");
  if (words.length > 3) {
    return words.slice(0, 2).join(" ") + "...";
  }
  return fullName;
}

export function generateSlug(name: string): string {
  // Generate URL-friendly slug
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
