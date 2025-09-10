// Fast Local Suggestions System
// Provides immediate suggestions based on keywords while AI processes in background

interface FastSuggestion {
  keywords: string[];
  suggestions: string[];
}

// Fast local suggestions database
const FAST_SUGGESTIONS: FastSuggestion[] = [
  {
    keywords: ["dashboard", "admin", "analytics"],
    suggestions: [
      "Dashboard with key metrics and charts",
      "Admin panel with user management",
      "Analytics dashboard with real-time data",
    ],
  },
  {
    keywords: ["form", "input", "submit", "contact"],
    suggestions: [
      "Contact form with validation",
      "Multi-step registration form",
      "Login form with forgot password",
    ],
  },
  {
    keywords: ["landing", "hero", "homepage"],
    suggestions: [
      "Hero section with call-to-action",
      "Product landing page with features",
      "Marketing homepage with testimonials",
    ],
  },
  {
    keywords: ["navigation", "menu", "navbar", "header"],
    suggestions: [
      "Navigation bar with search",
      "Sidebar menu with icons",
      "Breadcrumb navigation system",
    ],
  },
  {
    keywords: ["card", "grid", "list"],
    suggestions: [
      "Card grid layout with hover effects",
      "Product list with filters",
      "Team member cards with bios",
    ],
  },
  {
    keywords: ["table", "data", "report"],
    suggestions: [
      "Data table with sorting and filters",
      "Financial report layout",
      "User activity table with actions",
    ],
  },
  {
    keywords: ["modal", "popup", "dialog"],
    suggestions: [
      "Modal dialog with form",
      "Confirmation popup with actions",
      "Image gallery with lightbox",
    ],
  },
  {
    keywords: ["ecommerce", "shop", "product", "cart"],
    suggestions: [
      "Product showcase with cart",
      "E-commerce checkout flow",
      "Shopping cart with totals",
    ],
  },
  {
    keywords: ["learn", "education", "course", "tutorial"],
    suggestions: [
      "Learning module with progress tracker",
      "Course overview with lessons",
      "Tutorial page with step-by-step guide",
    ],
  },
  {
    keywords: ["blog", "article", "news"],
    suggestions: [
      "Blog layout with sidebar",
      "Article page with comments",
      "News feed with pagination",
    ],
  },
];

// Get instant suggestions based on input
export const getFastSuggestions = (input: string): string[] => {
  if (!input || input.length < 2) return [];

  const normalizedInput = input.toLowerCase().trim();
  const matchedSuggestions: string[] = [];

  // Check each fast suggestion group
  for (const group of FAST_SUGGESTIONS) {
    const hasMatch = group.keywords.some(
      (keyword) =>
        normalizedInput.includes(keyword) || keyword.includes(normalizedInput)
    );

    if (hasMatch) {
      matchedSuggestions.push(...group.suggestions);
    }
  }

  // Remove duplicates and limit to 5 suggestions
  const uniqueSuggestions = [...new Set(matchedSuggestions)];
  return uniqueSuggestions.slice(0, 5);
};

// Get contextual suggestions based on patterns
export const getContextualSuggestions = (input: string): string[] => {
  const normalizedInput = input.toLowerCase();
  const suggestions: string[] = [];

  // Microsoft Learn specific patterns
  if (
    normalizedInput.includes("microsoft") ||
    normalizedInput.includes("learn")
  ) {
    suggestions.push(
      "Microsoft Learn module with exercises",
      "Documentation page with code samples",
      "Learning path with prerequisites"
    );
  }

  // Responsive design patterns
  if (
    normalizedInput.includes("responsive") ||
    normalizedInput.includes("mobile")
  ) {
    suggestions.push(
      "Responsive layout with mobile-first design",
      "Mobile navigation with hamburger menu",
      "Adaptive grid that works on all devices"
    );
  }

  // Accessibility patterns
  if (
    normalizedInput.includes("accessible") ||
    normalizedInput.includes("aria")
  ) {
    suggestions.push(
      "Accessible form with proper labels",
      "Screen reader friendly navigation",
      "High contrast design with ARIA support"
    );
  }

  return suggestions.slice(0, 3);
};

// Combine fast and contextual suggestions
export const getInstantSuggestions = (input: string): string[] => {
  const fastSuggestions = getFastSuggestions(input);
  const contextualSuggestions = getContextualSuggestions(input);

  // Combine and deduplicate
  const allSuggestions = [...fastSuggestions, ...contextualSuggestions];
  const uniqueSuggestions = [...new Set(allSuggestions)];

  return uniqueSuggestions.slice(0, 6);
};

// Check if input should trigger AI suggestions (longer, more complex inputs)
export const shouldUseAI = (input: string): boolean => {
  if (input.length < 10) return false;

  // Use AI for complex requests
  const complexIndicators = [
    "complex",
    "advanced",
    "custom",
    "specific",
    "detailed",
    "integrate",
    "with authentication",
    "with database",
    "real-time",
    "dynamic",
    "interactive",
  ];

  const normalizedInput = input.toLowerCase();
  return complexIndicators.some((indicator) =>
    normalizedInput.includes(indicator)
  );
};
