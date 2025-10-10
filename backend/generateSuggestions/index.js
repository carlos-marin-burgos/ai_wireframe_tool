// Generic wireframe suggestion generator
const { requireMicrosoftAuth } = require("../lib/authMiddleware");

function generateCleanSuggestions(description) {
  const lowerDescription = description.toLowerCase();

  // Generic wireframe-focused suggestion categories
  const categories = {
    layout: [
      "Add a clean header with company logo and main navigation",
      "Include a sidebar with organized menu items and quick links",
      "Create a main content area with clear typography hierarchy",
      "Add a secondary sidebar with helpful navigation elements",
      "Include a footer with essential links and contact information",
      "Design a breadcrumb trail for easy navigation tracking",
    ],
    navigation: [
      "Add a primary navigation bar with clear category sections",
      "Include a search bar with helpful filters and options",
      "Create structured navigation with logical grouping",
      "Add pagination controls for content browsing",
      "Include progress indicators for multi-step processes",
      "Design mobile-friendly hamburger menu with clear hierarchy",
    ],
    content: [
      "Create an engaging hero section with clear value proposition",
      "Add informational cards with key features and benefits",
      "Include content sections with proper spacing and organization",
      "Design progress indicators for user guidance",
      "Add expandable content sections for detailed information",
      "Create highlight areas for important announcements",
    ],
    forms: [
      "Add user-friendly forms with clear labels and validation",
      "Include interactive elements like quizzes or assessments",
      "Design registration forms with intuitive field organization",
      "Create preference settings with easy-to-use controls",
      "Add feedback forms with rating systems",
      "Include survey forms with logical question flow",
    ],
    cards: [
      "Design feature cards with icons and clear descriptions",
      "Create product cards with images and key information",
      "Add service cards with pricing and feature details",
      "Include team member cards with photos and roles",
      "Design testimonial cards with customer feedback",
      "Create resource cards with downloadable content",
    ],
    interactive: [
      "Add interactive elements like image galleries or sliders",
      "Include dynamic content areas that respond to user input",
      "Design interactive diagrams or process flows",
      "Create engaging user interface elements",
      "Add interactive tutorials or guided experiences",
      "Include real-time feedback and progress tracking",
    ],
    dashboard: [
      "Create analytics dashboard with key performance metrics",
      "Design user activity dashboard with engagement tracking",
      "Add reporting dashboard with visual data representations",
      "Include monitoring dashboard with status indicators",
      "Build management dashboard with administrative controls",
      "Design overview dashboard with summary information",
    ],
  };

  let suggestions = [];

  // Check for dashboard-related keywords
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
    lowerDescription.includes("section") ||
    lowerDescription.includes("information")
  ) {
    suggestions.push(...categories.content.slice(0, 2));
  }

  // Check for form-related keywords
  if (
    lowerDescription.includes("form") ||
    lowerDescription.includes("input") ||
    lowerDescription.includes("quiz") ||
    lowerDescription.includes("assessment") ||
    lowerDescription.includes("registration") ||
    lowerDescription.includes("feedback") ||
    lowerDescription.includes("survey")
  ) {
    suggestions.push(...categories.forms.slice(0, 2));
  }

  // Check for card-related keywords
  if (
    lowerDescription.includes("card") ||
    lowerDescription.includes("feature") ||
    lowerDescription.includes("product") ||
    lowerDescription.includes("service") ||
    lowerDescription.includes("team") ||
    lowerDescription.includes("testimonial")
  ) {
    suggestions.push(...categories.cards.slice(0, 2));
  }

  // Check for interactive keywords
  if (
    lowerDescription.includes("interactive") ||
    lowerDescription.includes("dynamic") ||
    lowerDescription.includes("gallery") ||
    lowerDescription.includes("slider") ||
    lowerDescription.includes("tutorial") ||
    lowerDescription.includes("guided")
  ) {
    suggestions.push(...categories.interactive.slice(0, 2));
  }

  // If no specific matches, provide general suggestions
  if (suggestions.length === 0) {
    suggestions = [
      "Create a clean and organized layout with clear navigation",
      "Design user-friendly interface with intuitive controls",
      "Add engaging content areas with proper visual hierarchy",
      "Include interactive elements for better user engagement",
      "Build responsive design elements for all device types",
      "Generate accessible interface with inclusive design principles",
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
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-MS-CLIENT-PRINCIPAL",
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

  // Require Microsoft employee authentication
  const auth = requireMicrosoftAuth(req);
  if (!auth.valid) {
    context.res = {
      status: 403,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Unauthorized",
        message: auth.error || "Microsoft employee authentication required",
      }),
    };
    return;
  }

  context.log(`👤 Generate Suggestions accessed by: ${auth.email}`);

  try {
    // Get the user input from the request body
    const { userInput, description } = req.body || {};
    const inputDescription =
      userInput || description || "general Microsoft Learn content";

    // Generate clean suggestions based on the input
    const suggestions = generateCleanSuggestions(inputDescription);

    context.res = {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: {
        suggestions,
        source: "clean-suggestions",
        fallback: false,
      },
    };
  } catch (error) {
    // Fallback to general clean suggestions if there's an error
    const fallbackSuggestions = [
      "Create a clean and organized layout with clear navigation",
      "Design user-friendly interface with intuitive controls",
      "Add engaging content areas with proper visual hierarchy",
      "Include interactive elements for better user engagement",
      "Build responsive design elements for all device types",
      "Generate accessible interface with inclusive design principles",
    ];

    context.res = {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: {
        suggestions: fallbackSuggestions,
        source: "clean-suggestions-fallback",
        fallback: true,
      },
    };
  }
};
