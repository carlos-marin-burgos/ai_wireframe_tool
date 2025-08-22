/**
 * Figma Components API Endpoint
 * Serves component data for the Figma Component Browser
 */

module.exports = async function (context, req) {
  try {
    context.log("Fetching Figma components for browser");

    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      return;
    }

    // For now, return mock data to test the endpoint
    const mockComponents = [
      {
        id: "fluent-button-001",
        name: "Button Primary",
        description: "Primary action button with Fluent UI styling",
        category: "Actions",
        library: "Fluent UI",
        preview: null,
        variants: ["Default", "Hover", "Disabled"],
        usageCount: 15,
        tags: ["button", "primary", "action"],
        type: "component",
        lastModified: "2025-08-22T10:00:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "atlas-hero-001",
        name: "Hero Section",
        description: "Atlas design hero section with call-to-action",
        category: "Marketing",
        library: "Atlas Design",
        preview: null,
        variants: ["Light", "Dark", "Gradient"],
        usageCount: 8,
        tags: ["hero", "marketing", "cta"],
        type: "component",
        lastModified: "2025-08-22T09:30:00Z",
        createdBy: "Marketing Team",
      },
    ];

    const mockCategories = ["Actions", "Marketing", "Forms", "Navigation"];

    const mockStatistics = {
      totalComponents: 2,
      categories: [
        { name: "Actions", count: 1 },
        { name: "Marketing", count: 1 },
      ],
      libraries: [
        { name: "Fluent UI", count: 1 },
        { name: "Atlas Design", count: 1 },
      ],
      totalUsage: 23,
    };

    const response = {
      components: mockComponents,
      categories: mockCategories,
      popular: mockComponents.slice(0, 1),
      statistics: mockStatistics,
    };

    context.res.status = 200;
    context.res.body = response;
  } catch (error) {
    context.log.error("Error fetching Figma components:", error);

    context.res.status = 500;
    context.res.body = {
      error: "Failed to fetch components",
      details: error.message,
    };
  }
};
