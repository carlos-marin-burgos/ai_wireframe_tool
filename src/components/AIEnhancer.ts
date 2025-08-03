// Enhanced AI utilities for wireframe generation
export interface WireframeContext {
  previousPrompts: string[];
  generatedComponents: string[];
  userPreferences: {
    style: "modern" | "minimal" | "corporate" | "creative";
    complexity: "simple" | "medium" | "complex";
    platform: "web" | "mobile" | "desktop";
  };
  sessionHistory: {
    timestamp: number;
    prompt: string;
    result: string;
    feedback?: "positive" | "negative";
  }[];
}

export class AIWireframeEnhancer {
  private context: WireframeContext;

  constructor() {
    this.context = {
      previousPrompts: [],
      generatedComponents: [],
      userPreferences: {
        style: "modern",
        complexity: "medium",
        platform: "web",
      },
      sessionHistory: [],
    };
  }

  // Enhance user prompt with context and best practices
  enhancePrompt(userPrompt: string): string {
    const enhancements = [];

    // Add accessibility considerations
    if (
      !userPrompt.toLowerCase().includes("accessibility") &&
      !userPrompt.toLowerCase().includes("aria")
    ) {
      enhancements.push("with proper accessibility features and ARIA labels");
    }

    // Add responsive design if not mentioned
    if (
      !userPrompt.toLowerCase().includes("responsive") &&
      !userPrompt.toLowerCase().includes("mobile")
    ) {
      enhancements.push("responsive design that works on mobile and desktop");
    }

    // Add modern design patterns
    if (
      !userPrompt.toLowerCase().includes("modern") &&
      !userPrompt.toLowerCase().includes("clean")
    ) {
      enhancements.push(
        "modern, clean design with proper spacing and typography"
      );
    }

    // Add semantic HTML suggestion
    if (!userPrompt.toLowerCase().includes("semantic")) {
      enhancements.push("semantic HTML structure");
    }

    const enhancedPrompt =
      userPrompt +
      (enhancements.length > 0
        ? ". Please ensure " + enhancements.join(", ")
        : "") +
      ". Use modern React components with TypeScript.";

    return enhancedPrompt;
  }

  // Analyze prompt and suggest related components
  suggestRelatedComponents(prompt: string): string[] {
    const suggestions = [];
    const lowercasePrompt = prompt.toLowerCase();

    // Form-related suggestions
    if (
      lowercasePrompt.includes("form") ||
      lowercasePrompt.includes("input") ||
      lowercasePrompt.includes("submit")
    ) {
      suggestions.push(
        "Form validation with real-time feedback",
        "Multi-step form wizard with progress indicator",
        "Auto-save functionality for form data"
      );
    }

    // Dashboard-related suggestions
    if (
      lowercasePrompt.includes("dashboard") ||
      lowercasePrompt.includes("analytics") ||
      lowercasePrompt.includes("chart")
    ) {
      suggestions.push(
        "Interactive data filters and date range picker",
        "Export functionality for charts and data",
        "Customizable dashboard layout with drag-and-drop"
      );
    }

    // Navigation-related suggestions
    if (
      lowercasePrompt.includes("navigation") ||
      lowercasePrompt.includes("menu") ||
      lowercasePrompt.includes("header")
    ) {
      suggestions.push(
        "Search functionality in navigation",
        "User profile dropdown with quick actions",
        "Notification center with unread indicators"
      );
    }

    // E-commerce suggestions
    if (
      lowercasePrompt.includes("product") ||
      lowercasePrompt.includes("shop") ||
      lowercasePrompt.includes("cart")
    ) {
      suggestions.push(
        "Product comparison feature",
        "Wishlist functionality",
        "Recently viewed products section"
      );
    }

    // Social features
    if (
      lowercasePrompt.includes("social") ||
      lowercasePrompt.includes("comment") ||
      lowercasePrompt.includes("share")
    ) {
      suggestions.push(
        "Like and reaction system",
        "User mention functionality",
        "Content moderation tools"
      );
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  // Generate accessibility recommendations
  generateAccessibilityTips(componentType: string): string[] {
    const tips = [];

    switch (componentType.toLowerCase()) {
      case "form":
        tips.push(
          "Add proper label associations with htmlFor attributes",
          "Include form validation with clear error messages",
          "Ensure keyboard navigation between form fields",
          "Add required field indicators for screen readers"
        );
        break;
      case "navigation":
        tips.push(
          "Use semantic nav elements and ARIA landmarks",
          "Ensure keyboard navigation with tab order",
          "Add skip navigation links for screen readers",
          "Include current page indicators"
        );
        break;
      case "modal":
      case "dialog":
        tips.push(
          "Implement focus trapping within the modal",
          "Add proper ARIA roles and labels",
          "Enable Escape key to close modal",
          "Return focus to trigger element when closed"
        );
        break;
      case "button":
        tips.push(
          "Use descriptive button text or aria-label",
          "Ensure sufficient color contrast",
          "Add loading states for async actions",
          "Include keyboard support for all interactions"
        );
        break;
      default:
        tips.push(
          "Ensure proper color contrast ratios",
          "Add meaningful alt text for images",
          "Use semantic HTML elements",
          "Test with keyboard navigation"
        );
    }

    return tips;
  }

  // Smart prompt categorization
  categorizePrompt(prompt: string): {
    category: string;
    confidence: number;
    suggestedEnhancements: string[];
  } {
    const categories = {
      "E-commerce": ["shop", "product", "cart", "checkout", "payment", "order"],
      Dashboard: ["dashboard", "analytics", "chart", "graph", "metrics", "kpi"],
      Social: ["social", "feed", "post", "comment", "like", "share", "follow"],
      Form: ["form", "input", "submit", "validation", "register", "login"],
      Navigation: ["nav", "menu", "header", "sidebar", "breadcrumb"],
      Content: ["blog", "article", "news", "content", "text", "page"],
      Media: ["video", "image", "gallery", "photo", "media", "upload"],
      Communication: ["chat", "message", "notification", "email", "contact"],
    };

    const lowercasePrompt = prompt.toLowerCase();
    let bestMatch: {
      category: string;
      confidence: number;
      suggestedEnhancements: string[];
    } = {
      category: "General",
      confidence: 0,
      suggestedEnhancements: [],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      const matches = keywords.filter((keyword) =>
        lowercasePrompt.includes(keyword)
      ).length;
      const confidence = matches / keywords.length;

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          category,
          confidence,
          suggestedEnhancements: this.suggestRelatedComponents(prompt),
        };
      }
    }

    return bestMatch;
  }

  // Update context with user interaction
  updateContext(
    prompt: string,
    result: string,
    feedback?: "positive" | "negative"
  ) {
    this.context.previousPrompts.push(prompt);
    this.context.sessionHistory.push({
      timestamp: Date.now(),
      prompt,
      result,
      feedback,
    });

    // Learn from feedback
    if (feedback === "positive") {
      // Extract successful patterns for future recommendations
      this.learnFromSuccess(prompt, result);
    }
  }

  private learnFromSuccess(_prompt: string, _result: string) {
    // This could be enhanced with ML in the future
    // For now, just log the successful interaction
    console.log("Success pattern logged for future enhancement");
  }

  // Get context-aware suggestions
  getContextualSuggestions(): string[] {
    const recentPrompts = this.context.sessionHistory.slice(-3);
    const suggestions = [];

    if (recentPrompts.length > 0) {
      const lastPrompt = recentPrompts[recentPrompts.length - 1];
      const category = this.categorizePrompt(lastPrompt.prompt);

      suggestions.push(
        `Continue building your ${category.category.toLowerCase()} with additional features`,
        "Add responsive breakpoints for mobile optimization",
        "Include loading states and error handling"
      );
    }

    return suggestions;
  }

  // Generate smart prompt suggestions based on current input
  getSmartSuggestions(partialInput: string): string[] {
    if (partialInput.length < 3) return [];

    const suggestions = [];
    const input = partialInput.toLowerCase();

    // Smart completions based on partial input
    if (input.includes("dashb")) {
      suggestions.push("dashboard with analytics cards and charts");
    }

    if (input.includes("form")) {
      suggestions.push("form with validation and multi-step wizard");
    }

    if (input.includes("nav")) {
      suggestions.push("navigation with search and user menu");
    }

    if (input.includes("card")) {
      suggestions.push("card layout with hover effects and actions");
    }

    return suggestions;
  }
}

// Export singleton instance
export const aiEnhancer = new AIWireframeEnhancer();

// Design system recommendations
export const designSystemSuggestions = {
  colors: {
    primary: "#3d90d7",
    secondary: "#7ac6d2",
    accent: "#3a59d1",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1a1a1a",
    textSecondary: "#6b7280",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  typography: {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
};

// Export utility functions
export const generateComponentId = () => {
  return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validateComponentStructure = (jsx: string): boolean => {
  // Basic validation for React component structure
  return jsx.includes("return") && jsx.includes("<") && jsx.includes(">");
};
