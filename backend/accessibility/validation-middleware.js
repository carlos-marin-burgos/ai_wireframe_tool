/**
 * Accessibility Validation Middleware
 * Validates and fixes HTML content for WCAG 2.1 compliance
 */

const { AccessibilityColorValidator } = require("./color-validator.js");

class AccessibilityValidationMiddleware {
  constructor() {
    this.validator = new AccessibilityColorValidator();
  }

  /**
   * Validate and fix wireframe for accessibility
   */
  validateAndFixWireframe(wireframeContent, options = {}) {
    const { enforceCompliance = true, logIssues = true } = options;

    // Step 1: Validate current content
    const validation = this.validator.validateHtmlColors(wireframeContent);

    if (logIssues && !validation.isValid) {
      console.warn("🚨 Accessibility issues detected:", validation.issues);
    }

    // Step 2: Apply fixes if enforcement is enabled
    let fixedContent = wireframeContent;
    if (enforceCompliance && !validation.isValid) {
      fixedContent = this.applyAccessibilityFixes(
        wireframeContent,
        validation.issues
      );

      // Re-validate after fixes
      const revalidation = this.validator.validateHtmlColors(fixedContent);
      if (logIssues) {
        console.log(
          revalidation.isValid
            ? "✅ Wireframe accessibility issues fixed"
            : "⚠️ Some accessibility issues remain:",
          revalidation.issues
        );
      }
    }

    return {
      content: fixedContent,
      isValid: validation.isValid,
      issues: validation.issues,
      wasFixed: fixedContent !== wireframeContent,
    };
  }

  /**
   * Apply accessibility fixes to wireframe content
   */
  applyAccessibilityFixes(content, issues) {
    let fixedContent = content;
    const approvedColors = this.validator.getApprovedColorPalette();

    // Fix 1: Replace unapproved colors
    issues.forEach((issue) => {
      if (issue.type === "unapproved-color") {
        const regex = new RegExp(issue.color, "gi");
        fixedContent = fixedContent.replace(
          regex,
          issue.suggestion || approvedColors.primary
        );
      }

      // 🚨 NEW: Fix poor contrast combinations
      if (issue.type === "poor-contrast") {
        // Replace the problematic text color with the suggested accessible color
        const textColorRegex = new RegExp(
          `(color:\\s*)${issue.textColor.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}`,
          "gi"
        );
        fixedContent = fixedContent.replace(
          textColorRegex,
          `$1${issue.suggestion}`
        );
      }
    });

    // Fix 2: Replace common accessibility violations
    const accessibilityFixes = [
      // Low contrast fixes
      {
        pattern: /style\s*=\s*["'][^"']*color\s*:\s*#808080[^"']*/gi,
        replacement: (match) =>
          match.replace("#808080", approvedColors.textSecondary),
      },
      {
        pattern: /style\s*=\s*["'][^"']*color\s*:\s*lightgray[^"']*/gi,
        replacement: (match) => match.replace("lightgray", approvedColors.text),
      },
      {
        pattern: /style\s*=\s*["'][^"']*color\s*:\s*#999999[^"']*/gi,
        replacement: (match) =>
          match.replace("#999999", approvedColors.textSecondary),
      },

      // Background color fixes
      {
        pattern: /style\s*=\s*["'][^"']*background[^:]*:\s*yellow[^"']*/gi,
        replacement: (match) =>
          match.replace("yellow", approvedColors.background),
      },

      // Add proper contrast for common patterns
      {
        pattern: /(<div[^>]*className="[^"]*bg-blue-[^"]*"[^>]*>)/gi,
        replacement: "$1<style>div { color: #ffffff !important; }</style>",
      },

      // 🚨 NEW: Fix specific blue-on-blue violations
      {
        pattern: /(background[^:]*:\s*#0078d4[^;]*;[^}]*color:\s*)#005a9e/gi,
        replacement: "$1#ffffff",
      },
      {
        pattern: /(background[^:]*:\s*#00bcf2[^;]*;[^}]*color:\s*)#0078d4/gi,
        replacement: "$1#000000",
      },
      {
        pattern: /(background[^:]*:\s*#106ebe[^;]*;[^}]*color:\s*)#0078d4/gi,
        replacement: "$1#ffffff",
      },
    ];

    accessibilityFixes.forEach((fix) => {
      if (typeof fix.replacement === "function") {
        fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
      } else {
        fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
      }
    });

    // Fix 3: Ensure proper semantic structure
    fixedContent = this.addSemanticStructure(fixedContent);

    return fixedContent;
  }

  /**
   * Add proper semantic structure to wireframes
   */
  addSemanticStructure(content) {
    let enhanced = content;

    // Wrap content in proper main element if not present
    if (!/<main[^>]*>/i.test(enhanced)) {
      enhanced = enhanced.replace(
        /(<div[^>]*className="[^"]*p-\d+[^"]*"[^>]*>)/,
        "<main $1"
      );
      enhanced = enhanced.replace(/(<\/div>\s*<\/\w+>)$/, "</div></main>");
    }

    // Add ARIA landmarks if missing
    const ariaEnhancements = [
      // Navigation
      {
        pattern: /<nav(?![^>]*role=)/gi,
        replacement: '<nav role="navigation"',
      },
      // Main content
      { pattern: /<main(?![^>]*role=)/gi, replacement: '<main role="main"' },
      // Form sections
      {
        pattern: /<section(?![^>]*aria-label)([^>]*>.*?<form)/gi,
        replacement: '<section aria-label="Form section"$1',
      },
    ];

    ariaEnhancements.forEach((enhancement) => {
      enhanced = enhanced.replace(enhancement.pattern, enhancement.replacement);
    });

    return enhanced;
  }

  /**
   * Generate accessibility report
   */
  generateAccessibilityReport(wireframeContent) {
    const validation = this.validator.validateHtmlColors(wireframeContent);
    const approvedColors = this.validator.getApprovedColorPalette();

    return {
      timestamp: new Date().toISOString(),
      isCompliant: validation.isValid,
      wcagLevel: validation.isValid ? "AA" : "Non-compliant",
      issues: validation.issues,
      approvedColorPalette: approvedColors,
      recommendations: this.generateRecommendations(validation.issues),
      validationRules: [
        "WCAG 2.1 AA contrast ratio (4.5:1 minimum)",
        "Approved color palette enforcement",
        "Semantic HTML structure",
        "ARIA landmark roles",
      ],
    };
  }

  /**
   * Generate accessibility recommendations
   */
  generateRecommendations(issues) {
    const recommendations = [];

    if (issues.some((issue) => issue.type === "unapproved-color")) {
      recommendations.push(
        "Use only approved colors from the Microsoft design system"
      );
    }

    if (issues.some((issue) => issue.type === "accessibility-violation")) {
      recommendations.push("Increase color contrast to meet WCAG AA standards");
      recommendations.push("Test with screen readers and keyboard navigation");
    }

    recommendations.push("Add proper ARIA labels for complex interactions");
    recommendations.push(
      "Ensure all interactive elements are keyboard accessible"
    );
    recommendations.push("Test with high contrast mode enabled");

    return recommendations;
  }
}

module.exports = { AccessibilityValidationMiddleware };
