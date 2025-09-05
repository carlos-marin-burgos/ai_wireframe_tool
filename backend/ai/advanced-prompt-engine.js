/**
 * Advanced Prompt Engineering System
 * Creates sophisticated, context-aware prompts for enhanced AI wireframe generation
 */

// Import the official site header generator
const { generateSiteHeaderHTML } = require("../components/SiteHeaderGenerator");

class AdvancedPromptEngine {
  constructor() {
    this.promptTemplates = new Map();
    this.domainKnowledge = new Map();
    this.designPatterns = new Map();

    this.initializePromptTemplates();
    this.initializeDomainKnowledge();
    this.initializeDesignPatterns();
  }

  /**
   * Initialize sophisticated prompt templates
   */
  initializePromptTemplates() {
    // Base system prompts for different complexity levels
    this.promptTemplates.set("system-expert", {
      role: "You are a world-class Senior Frontend Architect and UX Designer with 15+ years of experience. You've led design systems at major tech companies and have deep expertise in accessibility, performance optimization, and modern web standards. You create production-ready, pixel-perfect interfaces that exceed industry standards.",
      traits: [
        "meticulous attention to detail",
        "accessibility champion",
        "performance optimizer",
        "modern standards advocate",
      ],
    });

    this.promptTemplates.set("system-creative", {
      role: "You are a visionary Creative Director who combines artistic excellence with technical expertise. You push the boundaries of web design while maintaining usability and accessibility. Your designs win awards and set industry trends.",
      traits: [
        "innovative thinking",
        "artistic vision",
        "trend setter",
        "user-centered design",
      ],
    });

    this.promptTemplates.set("system-technical", {
      role: "You are a Technical Lead specializing in scalable, maintainable frontend architectures. You write clean, semantic code that performs exceptionally and follows best practices. You're known for creating robust, future-proof solutions.",
      traits: [
        "technical excellence",
        "code quality",
        "scalability focus",
        "best practices",
      ],
    });

    // Contextual prompt enhancers
    this.promptTemplates.set("context-continuity", {
      template:
        "Building upon our previous work together, maintain design consistency and continue the established patterns while introducing appropriate evolution and refinement.",
    });

    this.promptTemplates.set("context-first-time", {
      template:
        "This is a new design exploration. Consider industry best practices and current design trends while creating something unique and appropriate for the specific use case.",
    });

    // Quality enhancement prompts
    this.promptTemplates.set("quality-accessibility", {
      template:
        "Prioritize accessibility excellence: implement proper ARIA labels, semantic HTML structure, keyboard navigation, color contrast compliance (WCAG 2.1 AA), and screen reader optimization.",
    });

    this.promptTemplates.set("quality-performance", {
      template:
        "Optimize for performance: use efficient CSS (avoid excessive nesting), implement proper image lazy loading attributes, minimize DOM complexity, and use modern CSS features like CSS Grid and custom properties.",
    });

    this.promptTemplates.set("quality-mobile", {
      template:
        "Mobile-first responsive design: touch-friendly interfaces (44px minimum touch targets), progressive enhancement, readable typography on small screens, and optimized navigation patterns.",
    });
  }

  /**
   * Initialize domain-specific knowledge bases
   */
  initializeDomainKnowledge() {
    this.domainKnowledge.set("e-commerce", {
      keyElements: [
        "product catalogs",
        "shopping cart",
        "checkout flow",
        "user reviews",
        "search filters",
      ],
      uxPatterns: [
        "card-based product display",
        "mega menu navigation",
        "breadcrumb navigation",
        "trust indicators",
      ],
      criticalFeatures: [
        "secure payment forms",
        "inventory status",
        "wishlist functionality",
        "comparison tools",
      ],
      designConsiderations: [
        "conversion optimization",
        "trust building",
        "mobile commerce",
        "accessibility for shopping",
      ],
    });

    this.domainKnowledge.set("dashboard", {
      keyElements: [
        "data visualization",
        "key metrics",
        "interactive charts",
        "filtering options",
        "real-time updates",
      ],
      uxPatterns: [
        "card-based metrics",
        "sidebar navigation",
        "tabbed interface",
        "drill-down capabilities",
      ],
      criticalFeatures: [
        "responsive data tables",
        "export functionality",
        "customizable views",
        "alert systems",
      ],
      designConsiderations: [
        "information hierarchy",
        "cognitive load",
        "data density",
        "actionable insights",
      ],
    });

    this.domainKnowledge.set("content", {
      keyElements: [
        "article layout",
        "typography hierarchy",
        "reading flow",
        "social sharing",
        "related content",
      ],
      uxPatterns: [
        "single column reading",
        "progressive disclosure",
        "infinite scroll",
        "table of contents",
      ],
      criticalFeatures: [
        "reading time estimates",
        "bookmark functionality",
        "print-friendly layout",
        "accessibility features",
      ],
      designConsiderations: [
        "readability",
        "content discoverability",
        "engagement metrics",
        "SEO optimization",
      ],
    });

    this.domainKnowledge.set("learning", {
      keyElements: [
        "course structure",
        "progress tracking",
        "interactive elements",
        "assessment tools",
        "resource library",
      ],
      uxPatterns: [
        "step-by-step navigation",
        "progress indicators",
        "modular content",
        "practice exercises",
      ],
      criticalFeatures: [
        "bookmark progress",
        "note-taking",
        "completion certificates",
        "discussion forums",
      ],
      designConsiderations: [
        "learning objectives",
        "cognitive load",
        "accessibility for education",
        "mobile learning",
      ],
    });
  }

  /**
   * Initialize advanced design patterns
   */
  initializeDesignPatterns() {
    this.designPatterns.set("hero-section", {
      structure:
        "impactful headline + supporting text + primary CTA + visual element",
      variations: ["centered", "split-screen", "video-background", "minimal"],
      bestPractices: [
        "clear value proposition",
        "single primary action",
        "visual hierarchy",
        "mobile optimization",
      ],
    });

    this.designPatterns.set("card-grid", {
      structure: "container with responsive grid of content cards",
      variations: [
        "equal-height",
        "masonry",
        "featured-card",
        "infinite-scroll",
      ],
      bestPractices: [
        "consistent spacing",
        "clear visual grouping",
        "responsive breakpoints",
        "loading states",
      ],
    });

    this.designPatterns.set("navigation-system", {
      structure: "primary navigation + breadcrumbs + contextual navigation",
      variations: ["horizontal-menu", "sidebar", "mega-menu", "mobile-drawer"],
      bestPractices: [
        "clear hierarchy",
        "current page indication",
        "keyboard navigation",
        "mobile-friendly",
      ],
    });

    this.designPatterns.set("form-design", {
      structure:
        "logical grouping + clear labels + validation + progress indication",
      variations: [
        "single-column",
        "multi-step",
        "inline-validation",
        "conversational",
      ],
      bestPractices: [
        "clear error messages",
        "proper field types",
        "accessibility labels",
        "mobile optimization",
      ],
    });
  }

  /**
   * Generate advanced, context-aware prompt
   */
  generateAdvancedPrompt(options) {
    const {
      description,
      context,
      designAnalysis,
      userPreferences,
      qualityTargets,
      designTheme = "microsoftlearn",
      colorScheme = "primary",
    } = options;

    // Select appropriate system prompt based on context
    const systemPrompt = this.selectSystemPrompt(context, designAnalysis);

    // Build domain-specific context
    const domainContext = this.buildDomainContext(designAnalysis);

    // Create contextual continuity section
    const continuityContext = this.buildContinuityContext(context);

    // Generate quality requirements
    const qualityRequirements = this.buildQualityRequirements(
      qualityTargets,
      userPreferences
    );

    // Build design pattern guidance
    const patternGuidance = this.buildPatternGuidance(designAnalysis);

    // Create the comprehensive prompt
    const prompt = `${systemPrompt.role}

DESIGN MISSION: Create an exceptional wireframe for "${description}"

${domainContext}

${continuityContext}

DESIGN ANALYSIS & REQUIREMENTS:
🎯 Primary Purpose: ${designAnalysis.primaryPurpose}
👥 Target Users: ${designAnalysis.userTypes.join(", ")}
🔧 Key Features: ${designAnalysis.keyFeatures.join(", ")}
📱 Responsive Needs: ${designAnalysis.responsiveNeeds.join(", ")}
♿ Accessibility Focus: ${designAnalysis.accessibilityFocus.join(", ")}
🎨 Complexity Level: ${designAnalysis.designComplexity}
⚡ Interaction Level: ${designAnalysis.interactionLevel}

DESIGN SYSTEM & BRANDING:
✨ Theme: ${designTheme} design system (LOW-FIDELITY WIREFRAME STYLE)
🎨 Color Scheme: Light blue components (#E3F2FD, #BBDEFB) with gray text placeholders (#BDBDBD)
🏢 Brand: Microsoft Learn wireframe aesthetic - clean, minimal, low-fidelity
📐 Layout: Spacious, wireframe-like, professional but simple

LOW-FIDELITY WIREFRAME REQUIREMENTS:
🎯 USE LIGHT BLUE backgrounds for all components and containers
📏 REPLACE generic text with gray horizontal placeholder lines
🔤 RESPECT user-specified text: If user mentions specific button labels, headings, or content - include that exact text
🎨 AVOID high-fidelity elements: no gradients, vivid colors, or decorative styling
� CLEAN AESTHETIC: Minimal shadows, simple borders, spacious layout

TEXT HANDLING STRATEGY:
- Generic headings → 2-3 gray bars of varying widths (width: 60%, 80%, 45%)
- Generic paragraphs → 3-5 gray lines (width: 100%, 85%, 92%, 70%)  
- Generic buttons → Short gray bar or user's specified label
- Generic navigation → Short gray bars for menu items
- User-specified content → Include the exact text requested

COMPONENT STYLING:
- Backgrounds: #E3F2FD (light blue), #BBDEFB (medium blue), #FAFAFA (light gray)
- Text placeholders: #BDBDBD, #E0E0E0 (gray bars/lines)
- Borders: #90CAF9 (soft blue), 1px solid
- Actual text: #333333 (dark gray)
- Minimal shadows: 0 1px 3px rgba(0,0,0,0.1)

${qualityRequirements}

${patternGuidance}

TECHNICAL EXCELLENCE REQUIREMENTS:
🏗️ Semantic HTML5 with proper document structure
🎨 Modern CSS with Grid, Flexbox, and custom properties
📱 Mobile-first responsive design (breakpoints: 320px, 768px, 1024px, 1440px)
♿ WCAG 2.1 AA compliance with proper ARIA labels
⚡ Performance-optimized markup and CSS
🔧 Component-based architecture thinking
🎭 Micro-interactions and smooth transitions
🔍 SEO-friendly structure

MICROSOFT LEARN INTEGRATION:
🧭 MANDATORY: Start with the exact official Microsoft Learn site header shown below
🎯 Use official Microsoft design tokens and colors
📊 Implement proper typography scale (Segoe UI family)
🎪 Add Microsoft Learn footer with proper links
🔗 Include contextual help and documentation links
📱 Ensure mobile navigation functionality
🎨 Use Microsoft's elevation and spacing system

MANDATORY SITE HEADER HTML:
You MUST start the body content with this exact official Microsoft Learn site header:

${generateSiteHeaderHTML()}

CRITICAL: Place this site header immediately after the opening <body> tag, before any other content.

CONTENT STRATEGY:
📝 LOW-FIDELITY CONTENT: Use gray bars for placeholder text unless user specifies exact content
📖 Proper heading hierarchy (h1 → h2 → h3) with placeholder bars or user text
🖼️ Simple placeholder rectangles for images (#E0E0E0 backgrounds)
🔗 Button placeholders or user-specified button labels
📋 Form field placeholders with gray bars for labels
📊 Simple data representations with placeholder elements

PLACEHOLDER TEXT CSS PATTERNS:
Use these CSS patterns for text placeholders:

/* Heading placeholder bars */
.text-placeholder-heading {
  background: #BDBDBD;
  height: 16px;
  border-radius: 2px;
  margin: 8px 0;
}
.text-placeholder-heading.short { width: 60%; }
.text-placeholder-heading.medium { width: 80%; }
.text-placeholder-heading.long { width: 45%; }

/* Paragraph placeholder lines */
.text-placeholder-line {
  background: #E0E0E0;
  height: 12px;
  border-radius: 2px;
  margin: 4px 0;
}
.text-placeholder-line.full { width: 100%; }
.text-placeholder-line.medium { width: 85%; }
.text-placeholder-line.short { width: 70%; }

/* Button placeholder */
.text-placeholder-button {
  background: #BDBDBD;
  height: 14px;
  width: 80px;
  border-radius: 2px;
}

EXAMPLE PLACEHOLDER HTML:
<!-- Instead of "Welcome to our website" use: -->
<div class="text-placeholder-heading medium"></div>

<!-- Instead of paragraph text use: -->
<div class="text-placeholder-line full"></div>
<div class="text-placeholder-line medium"></div>
<div class="text-placeholder-line short"></div>

INTERACTION DESIGN:
🎯 Clear visual feedback for all interactive elements
⌨️ Full keyboard navigation support
👆 Touch-friendly design (minimum 44px touch targets)
🎭 Loading states and progress indicators
🚨 Proper error handling and validation feedback
🔄 Logical tab order and focus management

OUTPUT REQUIREMENTS:
Return ONLY complete, valid HTML5 code starting with <!DOCTYPE html> and ending with </html>.
Include comprehensive inline CSS with modern best practices.
Ensure the code is production-ready and follows all specified requirements.
No explanations, markdown formatting, or additional text - just clean, semantic HTML.

Generate a wireframe that showcases expert-level frontend development and design skills while perfectly meeting the specified requirements.`;

    return prompt;
  }

  /**
   * Select appropriate system prompt based on context
   */
  selectSystemPrompt(context, designAnalysis) {
    if (
      designAnalysis.designComplexity === "complex" ||
      designAnalysis.interactionLevel === "dynamic"
    ) {
      return this.promptTemplates.get("system-technical");
    } else if (
      designAnalysis.primaryPurpose.includes("creative") ||
      designAnalysis.primaryPurpose.includes("marketing")
    ) {
      return this.promptTemplates.get("system-creative");
    } else {
      return this.promptTemplates.get("system-expert");
    }
  }

  /**
   * Build domain-specific context
   */
  buildDomainContext(designAnalysis) {
    const purpose = designAnalysis.primaryPurpose;
    let domain = "general";

    // Detect domain
    if (purpose.includes("commerce") || purpose.includes("shop"))
      domain = "e-commerce";
    else if (purpose.includes("dashboard") || purpose.includes("analytics"))
      domain = "dashboard";
    else if (purpose.includes("content") || purpose.includes("blog"))
      domain = "content";
    else if (purpose.includes("learning") || purpose.includes("education"))
      domain = "learning";

    const domainInfo = this.domainKnowledge.get(domain);
    if (!domainInfo) return "";

    return `DOMAIN EXPERTISE (${domain.toUpperCase()}):
🎯 Key Elements: ${domainInfo.keyElements.join(", ")}
🎨 UX Patterns: ${domainInfo.uxPatterns.join(", ")}
⚡ Critical Features: ${domainInfo.criticalFeatures.join(", ")}
💡 Design Considerations: ${domainInfo.designConsiderations.join(", ")}`;
  }

  /**
   * Build continuity context from previous work
   */
  buildContinuityContext(context) {
    if (
      !context ||
      !context.recentHistory ||
      context.recentHistory.length === 0
    ) {
      return this.promptTemplates.get("context-first-time").template;
    }

    const recentWork = context.recentHistory.slice(-2);
    const patterns = context.successfulPatterns || [];

    let continuityText =
      this.promptTemplates.get("context-continuity").template;

    if (patterns.length > 0) {
      continuityText += `\n\nSUCCESSFUL PATTERNS FROM PREVIOUS WORK:
${patterns
  .map(
    (p) =>
      `• ${p.patterns.join(", ")} (Quality: ${Math.round(p.quality * 100)}%)`
  )
  .join("\n")}`;
    }

    if (context.userPreferences && context.userPreferences.preferredPatterns) {
      continuityText += `\n\nUSER'S PREFERRED PATTERNS: ${context.userPreferences.preferredPatterns.join(
        ", "
      )}`;
    }

    return continuityText;
  }

  /**
   * Build quality requirements based on targets
   */
  buildQualityRequirements(qualityTargets, userPreferences) {
    const targets = qualityTargets || {};

    let requirements = "QUALITY EXCELLENCE TARGETS:\n";

    if (targets.targetAccessibility >= 0.9) {
      requirements +=
        this.promptTemplates.get("quality-accessibility").template + "\n";
    }

    if (targets.targetPerformance >= 0.9) {
      requirements +=
        this.promptTemplates.get("quality-performance").template + "\n";
    }

    if (
      targets.targetResponsive >= 0.9 ||
      userPreferences?.deviceFocus === "mobile"
    ) {
      requirements +=
        this.promptTemplates.get("quality-mobile").template + "\n";
    }

    return requirements;
  }

  /**
   * Build design pattern guidance
   */
  buildPatternGuidance(designAnalysis) {
    const recommendedComponents = designAnalysis.recommendedComponents || [];
    let guidance = "DESIGN PATTERN GUIDANCE:\n";

    recommendedComponents.forEach((component) => {
      const pattern = this.designPatterns.get(component);
      if (pattern) {
        guidance += `\n${component.toUpperCase()}:\n`;
        guidance += `Structure: ${pattern.structure}\n`;
        guidance += `Best Practices: ${pattern.bestPractices.join(", ")}\n`;
      }
    });

    // Add layout pattern specific guidance
    const layoutPattern = designAnalysis.layoutPattern;
    if (layoutPattern && this.designPatterns.has(layoutPattern)) {
      const pattern = this.designPatterns.get(layoutPattern);
      guidance += `\nLAYOUT PATTERN (${layoutPattern.toUpperCase()}):\n`;
      guidance += `Structure: ${pattern.structure}\n`;
      guidance += `Variations: ${pattern.variations.join(", ")}\n`;
      guidance += `Best Practices: ${pattern.bestPractices.join(", ")}\n`;
    }

    return guidance;
  }

  /**
   * Generate improvement suggestions for existing wireframes
   */
  generateImprovementPrompt(currentHTML, originalDescription, analysisResults) {
    return `You are a Senior UX Consultant reviewing this wireframe for improvements.

ORIGINAL REQUEST: "${originalDescription}"

CURRENT WIREFRAME ANALYSIS:
${
  analysisResults.issues
    ? `Issues Found: ${analysisResults.issues.join(", ")}`
    : ""
}
${
  analysisResults.scores
    ? `Quality Scores: ${JSON.stringify(analysisResults.scores)}`
    : ""
}

CURRENT HTML (first 1000 chars):
${currentHTML.substring(0, 1000)}...

IMPROVEMENT TASK:
Provide 5 specific, actionable improvements that would enhance this wireframe's:
1. User Experience
2. Accessibility
3. Visual Design
4. Performance
5. Mobile Responsiveness

For each improvement, provide:
- Clear description of the issue
- Specific solution
- Expected impact (High/Medium/Low)
- Implementation priority

Format as JSON:
{
  "improvements": [
    {
      "category": "category",
      "issue": "description of current issue",
      "solution": "specific solution",
      "impact": "High|Medium|Low",
      "priority": "1-5"
    }
  ]
}`;
  }

  /**
   * Generate A/B testing prompt for design variations
   */
  generateVariationPrompt(baseDescription, variationType = "layout") {
    return `Create a design variation for A/B testing.

BASE DESCRIPTION: "${baseDescription}"

VARIATION TYPE: ${variationType}

Create a significantly different ${variationType} approach while maintaining:
✅ Same core functionality
✅ Brand consistency
✅ Accessibility standards
✅ User goals

VARIATION OBJECTIVES:
• Test different user flows
• Explore alternative visual hierarchies
• Experiment with interaction patterns
• Validate design assumptions

Ensure this variation is different enough to provide meaningful insights while remaining user-friendly and accessible.

Return complete HTML with inline CSS for the variation.`;
  }

  /**
   * Get domain-specific expertise
   */
  getDomainExpertise(domain) {
    return this.domainKnowledge.get(domain) || null;
  }

  /**
   * Get design pattern information
   */
  getDesignPattern(patternName) {
    return this.designPatterns.get(patternName) || null;
  }

  /**
   * Add custom domain knowledge
   */
  addDomainKnowledge(domain, knowledge) {
    this.domainKnowledge.set(domain, knowledge);
  }

  /**
   * Add custom design pattern
   */
  addDesignPattern(patternName, pattern) {
    this.designPatterns.set(patternName, pattern);
  }
}

module.exports = { AdvancedPromptEngine };
