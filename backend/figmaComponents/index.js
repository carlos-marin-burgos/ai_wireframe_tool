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

    // Comprehensive component database for realistic search and import
    const mockComponents = [
      // Fluent UI Components
      {
        id: "fluent-button-001",
        name: "Button Primary",
        description: "Primary action button with Fluent UI styling",
        category: "Actions",
        library: "Fluent UI",
        preview: null,
        variants: ["Default", "Hover", "Disabled", "Loading"],
        usageCount: 45,
        tags: ["button", "primary", "action", "cta"],
        type: "component",
        lastModified: "2025-08-22T10:00:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "fluent-button-002",
        name: "Button Secondary",
        description: "Secondary action button with outline styling",
        category: "Actions",
        library: "Fluent UI",
        preview: null,
        variants: ["Default", "Hover", "Disabled"],
        usageCount: 32,
        tags: ["button", "secondary", "outline"],
        type: "component",
        lastModified: "2025-08-22T09:45:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "fluent-input-001",
        name: "Text Input",
        description: "Standard text input field with validation support",
        category: "Forms",
        library: "Fluent UI",
        preview: null,
        variants: ["Default", "Error", "Success", "Disabled"],
        usageCount: 67,
        tags: ["input", "text", "form", "field"],
        type: "component",
        lastModified: "2025-08-22T08:30:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "fluent-dropdown-001",
        name: "Dropdown Select",
        description: "Dropdown selection component with search",
        category: "Forms",
        library: "Fluent UI",
        preview: null,
        variants: ["Single Select", "Multi Select", "With Search"],
        usageCount: 28,
        tags: ["dropdown", "select", "form", "menu"],
        type: "component",
        lastModified: "2025-08-22T07:15:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "fluent-nav-001",
        name: "Navigation Bar",
        description: "Horizontal navigation with logo and menu items",
        category: "Navigation",
        library: "Fluent UI",
        preview: null,
        variants: ["Light", "Dark", "Transparent"],
        usageCount: 19,
        tags: ["navigation", "navbar", "header", "menu"],
        type: "component",
        lastModified: "2025-08-22T06:00:00Z",
        createdBy: "Design System Team",
      },

      // Atlas Design Components
      {
        id: "atlas-hero-001",
        name: "Hero Section",
        description: "Atlas design hero section with call-to-action",
        category: "Marketing",
        library: "Atlas Design",
        preview: null,
        variants: ["Light", "Dark", "Gradient"],
        usageCount: 23,
        tags: ["hero", "marketing", "cta", "banner"],
        type: "component",
        lastModified: "2025-08-22T09:30:00Z",
        createdBy: "Marketing Team",
      },
      {
        id: "atlas-card-001",
        name: "Learning Path Card",
        description: "Card component for learning paths and courses",
        category: "Cards",
        library: "Atlas Design",
        preview: null,
        variants: ["Standard", "Featured", "Compact"],
        usageCount: 41,
        tags: ["card", "learning", "course", "content"],
        type: "component",
        lastModified: "2025-08-22T08:45:00Z",
        createdBy: "Content Team",
      },
      {
        id: "atlas-breadcrumb-001",
        name: "Breadcrumb Navigation",
        description: "Hierarchical navigation breadcrumb trail",
        category: "Navigation",
        library: "Atlas Design",
        preview: null,
        variants: ["With Icons", "Text Only", "Compact"],
        usageCount: 15,
        tags: ["breadcrumb", "navigation", "hierarchy"],
        type: "component",
        lastModified: "2025-08-22T07:30:00Z",
        createdBy: "UX Team",
      },
      {
        id: "atlas-footer-001",
        name: "Site Footer",
        description: "Comprehensive site footer with links and branding",
        category: "Layout",
        library: "Atlas Design",
        preview: null,
        variants: ["Full", "Minimal", "Legal Only"],
        usageCount: 12,
        tags: ["footer", "links", "branding", "legal"],
        type: "component",
        lastModified: "2025-08-22T06:45:00Z",
        createdBy: "Marketing Team",
      },
      {
        id: "atlas-testimonial-001",
        name: "Customer Testimonial",
        description: "Customer quote with photo and attribution",
        category: "Marketing",
        library: "Atlas Design",
        preview: null,
        variants: ["With Photo", "Text Only", "Carousel"],
        usageCount: 9,
        tags: ["testimonial", "quote", "customer", "social proof"],
        type: "component",
        lastModified: "2025-08-22T05:30:00Z",
        createdBy: "Marketing Team",
      },

      // Additional Component Types
      {
        id: "fluent-table-001",
        name: "Data Table",
        description: "Sortable and filterable data table component",
        category: "Data Display",
        library: "Fluent UI",
        preview: null,
        variants: ["Basic", "Sortable", "Paginated", "Selectable"],
        usageCount: 34,
        tags: ["table", "data", "grid", "sortable"],
        type: "component",
        lastModified: "2025-08-22T04:15:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "fluent-modal-001",
        name: "Modal Dialog",
        description: "Modal dialog with customizable content and actions",
        category: "Overlays",
        library: "Fluent UI",
        preview: null,
        variants: ["Small", "Medium", "Large", "Full Screen"],
        usageCount: 26,
        tags: ["modal", "dialog", "popup", "overlay"],
        type: "component",
        lastModified: "2025-08-22T03:00:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "atlas-pricing-001",
        name: "Pricing Card",
        description: "Pricing tier card with features and CTA",
        category: "Marketing",
        library: "Atlas Design",
        preview: null,
        variants: ["Basic", "Popular", "Enterprise"],
        usageCount: 7,
        tags: ["pricing", "plan", "subscription", "features"],
        type: "component",
        lastModified: "2025-08-22T02:30:00Z",
        createdBy: "Sales Team",
      },
      {
        id: "fluent-alert-001",
        name: "Alert Banner",
        description: "Informational alert with various severity levels",
        category: "Feedback",
        library: "Fluent UI",
        preview: null,
        variants: ["Info", "Success", "Warning", "Error"],
        usageCount: 18,
        tags: ["alert", "notification", "banner", "message"],
        type: "component",
        lastModified: "2025-08-22T01:45:00Z",
        createdBy: "Design System Team",
      },
      {
        id: "atlas-search-001",
        name: "Search Interface",
        description: "Advanced search with filters and suggestions",
        category: "Forms",
        library: "Atlas Design",
        preview: null,
        variants: ["Simple", "With Filters", "Auto-complete"],
        usageCount: 21,
        tags: ["search", "filter", "autocomplete", "find"],
        type: "component",
        lastModified: "2025-08-22T01:00:00Z",
        createdBy: "Search Team",
      },
    ];

    const mockCategories = [
      "Actions",
      "Forms",
      "Navigation",
      "Marketing",
      "Cards",
      "Layout",
      "Data Display",
      "Overlays",
      "Feedback",
    ];

    const mockStatistics = {
      totalComponents: mockComponents.length,
      categories: [
        {
          name: "Actions",
          count: mockComponents.filter((c) => c.category === "Actions").length,
        },
        {
          name: "Forms",
          count: mockComponents.filter((c) => c.category === "Forms").length,
        },
        {
          name: "Navigation",
          count: mockComponents.filter((c) => c.category === "Navigation")
            .length,
        },
        {
          name: "Marketing",
          count: mockComponents.filter((c) => c.category === "Marketing")
            .length,
        },
        {
          name: "Cards",
          count: mockComponents.filter((c) => c.category === "Cards").length,
        },
        {
          name: "Layout",
          count: mockComponents.filter((c) => c.category === "Layout").length,
        },
        {
          name: "Data Display",
          count: mockComponents.filter((c) => c.category === "Data Display")
            .length,
        },
        {
          name: "Overlays",
          count: mockComponents.filter((c) => c.category === "Overlays").length,
        },
        {
          name: "Feedback",
          count: mockComponents.filter((c) => c.category === "Feedback").length,
        },
      ],
      libraries: [
        {
          name: "Fluent UI",
          count: mockComponents.filter((c) => c.library === "Fluent UI").length,
        },
        {
          name: "Atlas Design",
          count: mockComponents.filter((c) => c.library === "Atlas Design")
            .length,
        },
      ],
      totalUsage: mockComponents.reduce((sum, c) => sum + c.usageCount, 0),
    };

    const response = {
      components: mockComponents,
      categories: mockCategories,
      popular: mockComponents
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5),
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
