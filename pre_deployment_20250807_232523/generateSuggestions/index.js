// Microsoft Learn-focused suggestion generator
function generateMicrosoftLearnSuggestions(description) {
  const lowerDescription = description.toLowerCase();

  // Microsoft Learn wireframe-focused suggestion categories
  const categories = {
    layout: [
      "Add Microsoft Learn's signature header with Microsoft logo and Learn branding",
      "Include Microsoft Learn's left navigation sidebar with expandable learning paths",
      "Create Microsoft Learn's main content area with documentation-style typography",
      "Add Microsoft Learn's right sidebar with 'In this article' table of contents",
      "Include Microsoft Learn's footer with community links and feedback options",
      "Design Microsoft Learn's breadcrumb trail showing learning path progression",
    ],
    navigation: [
      "Add Microsoft Learn's global navigation with 'Documentation', 'Learning', 'Certifications' tabs",
      "Include Microsoft Learn's search bar with technology and role-based filters",
      "Create Microsoft Learn's learning path navigation with module completion indicators",
      "Add Microsoft Learn's 'Previous' and 'Next Unit' navigation for sequential learning",
      "Include Microsoft Learn's floating progress indicator for current learning module",
      "Design Microsoft Learn's mobile hamburger menu with nested learning categories",
    ],
    content: [
      "Create Microsoft Learn's hero banner with technology focus and learning objectives",
      "Add Microsoft Learn's 'Learning objectives' card with checkboxes for goal tracking",
      "Include Microsoft Learn's code block containers with 'Try it' and 'Copy' buttons",
      "Design Microsoft Learn's unit progress bar showing completion within a module",
      "Add Microsoft Learn's collapsible content sections for step-by-step tutorials",
      "Create Microsoft Learn's achievement badge display for completed learning paths",
    ],
    forms: [
      "Add Microsoft Learn's knowledge check quiz with multiple choice and explanations",
      "Include Microsoft Learn's skills assessment form with role-based questions",
      "Design Microsoft Learn's certification exam registration form with prerequisites",
      "Create Microsoft Learn's learning preferences form with technology interests",
      "Add Microsoft Learn's community Q&A submission form with tagging system",
      "Include Microsoft Learn's feedback form for rating learning module quality",
    ],
    cards: [
      "Design Microsoft Learn's learning path cards with technology logos and difficulty badges",
      "Create Microsoft Learn's certification cards with exam codes and preparation time estimates",
      "Add Microsoft Learn's documentation cards with API references and code samples",
      "Include Microsoft Learn's community cards showing Q&A discussions and expert answers",
      "Design Microsoft Learn's instructor-led training cards with schedule and registration info",
      "Create Microsoft Learn's hands-on lab cards with Azure sandbox environment links",
    ],
    interactive: [
      "Add Microsoft Learn's interactive Azure portal simulations with guided steps",
      "Include Microsoft Learn's code playground with live Azure resource deployment",
      "Design Microsoft Learn's decision tree diagrams for choosing Azure services",
      "Create Microsoft Learn's interactive tutorials with real-time feedback",
      "Add Microsoft Learn's sandbox environment for hands-on Azure practice",
      "Include Microsoft Learn's progress tracking with badges and achievement unlocks",
    ],
    dashboard: [
      "Create Microsoft Learn's certification dashboard with exam progress and completion dates",
      "Design Microsoft Learn's learning analytics dashboard with study time and achievement metrics",
      "Add Microsoft Learn's skill assessment dashboard with competency tracking",
      "Include Microsoft Learn's learning path dashboard with module completion status",
      "Build Microsoft Learn's personalized recommendation dashboard with AI-suggested content",
      "Design Microsoft Learn's community activity dashboard with Q&A participation metrics",
    ],
  };

  let suggestions = [];

  // Check for dashboard-related keywords (addressing the "dashboard for tracking progress" test case)
  if (
    lowerDescription.includes("dashboard") ||
    lowerDescription.includes("analytics") ||
    lowerDescription.includes("progress") ||
    lowerDescription.includes("tracking") ||
    lowerDescription.includes("metrics") ||
    lowerDescription.includes("monitoring")
  ) {
    suggestions.push(...categories.dashboard.slice(0, 3));
  }

  // Check for layout-related keywords
  if (
    lowerDescription.includes("page") ||
    lowerDescription.includes("layout") ||
    lowerDescription.includes("structure") ||
    lowerDescription.includes("website") ||
    lowerDescription.includes("site") ||
    lowerDescription.includes("landing")
  ) {
    suggestions.push(...categories.layout.slice(0, 2));
  }

  // Check for navigation-related keywords
  if (
    lowerDescription.includes("navigation") ||
    lowerDescription.includes("menu") ||
    lowerDescription.includes("nav") ||
    lowerDescription.includes("header") ||
    lowerDescription.includes("search")
  ) {
    suggestions.push(...categories.navigation.slice(0, 2));
  }

  // Check for content-related keywords
  if (
    lowerDescription.includes("content") ||
    lowerDescription.includes("article") ||
    lowerDescription.includes("documentation") ||
    lowerDescription.includes("tutorial") ||
    lowerDescription.includes("learning") ||
    lowerDescription.includes("lesson")
  ) {
    suggestions.push(...categories.content.slice(0, 2));
  }

  // Check for form-related keywords
  if (
    lowerDescription.includes("form") ||
    lowerDescription.includes("input") ||
    lowerDescription.includes("quiz") ||
    lowerDescription.includes("assessment") ||
    lowerDescription.includes("exam") ||
    lowerDescription.includes("test") ||
    lowerDescription.includes("feedback") ||
    lowerDescription.includes("survey")
  ) {
    suggestions.push(...categories.forms.slice(0, 2));
  }

  // Check for card-related keywords
  if (
    lowerDescription.includes("card") ||
    lowerDescription.includes("module") ||
    lowerDescription.includes("course") ||
    lowerDescription.includes("certification") ||
    lowerDescription.includes("path") ||
    lowerDescription.includes("training")
  ) {
    suggestions.push(...categories.cards.slice(0, 2));
  }

  // Check for interactive keywords
  if (
    lowerDescription.includes("interactive") ||
    lowerDescription.includes("exercise") ||
    lowerDescription.includes("playground") ||
    lowerDescription.includes("simulation") ||
    lowerDescription.includes("sandbox") ||
    lowerDescription.includes("hands-on")
  ) {
    suggestions.push(...categories.interactive.slice(0, 2));
  }

  // If no specific matches, provide general Microsoft Learn suggestions
  if (suggestions.length === 0) {
    suggestions = [
      "Create Microsoft Learn's learning path overview with module cards and progress tracking",
      "Design Microsoft Learn's documentation page with table of contents and code examples",
      "Add Microsoft Learn's certification journey with exam preparation and study guides",
      "Include Microsoft Learn's community-driven Q&A section with expert moderation",
      "Build Microsoft Learn's hands-on lab environment with Azure sandbox integration",
      "Generate Microsoft Learn's assessment portal with skills validation and feedback",
    ];
  }

  // Ensure we return exactly 6 unique suggestions
  const uniqueSuggestions = [...new Set(suggestions)];
  return uniqueSuggestions.slice(0, 6);
}

module.exports = async function (context, req) {
  // Set CORS headers for all requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
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

  try {
    // Get the user input from the request body
    const { userInput, description } = req.body || {};
    const inputDescription =
      userInput || description || "general Microsoft Learn content";

    // Generate Microsoft Learn-focused suggestions based on the input
    const suggestions = generateMicrosoftLearnSuggestions(inputDescription);

    context.res = {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: {
        suggestions,
        source: "microsoft-learn-focused",
        fallback: false,
      },
    };
  } catch (error) {
    // Fallback to general Microsoft Learn suggestions if there's an error
    const fallbackSuggestions = [
      "Create Microsoft Learn's learning path overview with module cards and progress tracking",
      "Design Microsoft Learn's documentation page with table of contents and code examples",
      "Add Microsoft Learn's certification journey with exam preparation and study guides",
      "Include Microsoft Learn's community-driven Q&A section with expert moderation",
      "Build Microsoft Learn's hands-on lab environment with Azure sandbox integration",
      "Generate Microsoft Learn's assessment portal with skills validation and feedback",
    ];

    context.res = {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: {
        suggestions: fallbackSuggestions,
        source: "microsoft-learn-fallback",
        fallback: true,
      },
    };
  }
};
