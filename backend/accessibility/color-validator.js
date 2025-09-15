/**
 * Accessibility Color Validator
 * Ensures all generated wireframes use WCAG-compliant colors
 */

const { ColorUtils } = require("../config/colors");

class AccessibilityColorValidator {
  constructor() {
    // WCAG AA minimum contrast ratios
    this.MIN_CONTRAST_NORMAL = 4.5;
    this.MIN_CONTRAST_LARGE = 3.0; // For text 18pt+ or 14pt+ bold

    // Approved accessible color combinations
    this.ACCESSIBLE_COMBINATIONS = [
      // High contrast pairs (text on background)
      { text: "#000000", bg: "#ffffff", ratio: 21 },
      { text: "#ffffff", bg: "#000000", ratio: 21 },
      { text: "#0078d4", bg: "#ffffff", ratio: 4.78 }, // Microsoft Blue
      { text: "#ffffff", bg: "#0078d4", ratio: 4.78 },
      { text: "#005a9e", bg: "#ffffff", ratio: 6.54 }, // Dark Blue
      { text: "#ffffff", bg: "#005a9e", ratio: 6.54 },
      { text: "#323130", bg: "#ffffff", ratio: 12.63 }, // Neutral Gray
      { text: "#ffffff", bg: "#323130", ratio: 12.63 },
      { text: "#106ebe", bg: "#ffffff", ratio: 4.63 }, // Secondary Blue
      { text: "#ffffff", bg: "#106ebe", ratio: 4.63 },
    ];
  }

  /**
   * Validate a text/background color combination
   */
  validateColorCombination(textColor, backgroundColor, isLargeText = false) {
    const contrast = this.calculateContrastRatio(textColor, backgroundColor);
    const minRequired = isLargeText
      ? this.MIN_CONTRAST_LARGE
      : this.MIN_CONTRAST_NORMAL;

    return {
      isValid: contrast >= minRequired,
      actualRatio: contrast,
      requiredRatio: minRequired,
      textColor,
      backgroundColor,
      isLargeText,
    };
  }

  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrastRatio(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const l1 = this.getRelativeLuminance(rgb1);
    const l2 = this.getRelativeLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Calculate relative luminance for a color
   */
  getRelativeLuminance({ r, g, b }) {
    const transform = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };

    const rLum = transform(r);
    const gLum = transform(g);
    const bLum = transform(b);

    return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
  }

  /**
   * Get accessible text color for a given background
   */
  getAccessibleTextColor(backgroundColor) {
    const whiteContrast = this.calculateContrastRatio(
      "#ffffff",
      backgroundColor
    );
    const blackContrast = this.calculateContrastRatio(
      "#000000",
      backgroundColor
    );

    // Return the color with better contrast, preferring black if both are good
    if (
      blackContrast >= this.MIN_CONTRAST_NORMAL &&
      blackContrast >= whiteContrast
    ) {
      return "#000000";
    }

    if (whiteContrast >= this.MIN_CONTRAST_NORMAL) {
      return "#ffffff";
    }

    // If neither meets AA standards, return the better one with a warning
    return blackContrast > whiteContrast ? "#000000" : "#ffffff";
  }

  /**
   * Validate HTML content for accessibility issues
   */
  validateHtmlColors(htmlContent) {
    const issues = [];

    // Extract style attributes and CSS
    const styleRegex = /style\s*=\s*["'][^"']*color\s*:\s*([^;"']+)/gi;
    let match;

    while ((match = styleRegex.exec(htmlContent)) !== null) {
      const color = match[1].trim();
      if (!ColorUtils.isApprovedColor(color)) {
        issues.push({
          type: "unapproved-color",
          color: color,
          suggestion: ColorUtils.getSuggestedReplacement(color),
        });
      }
    }

    // 🚨 NEW: Check for background/color combinations in the same element
    const elementStyleRegex = /style\s*=\s*["']([^"']*)["']/gi;
    let elementMatch;

    while ((elementMatch = elementStyleRegex.exec(htmlContent)) !== null) {
      const styleContent = elementMatch[1];

      // Extract background and color from the same style attribute
      const bgMatch = /background(?:-color)?:\s*([^;]+)/i.exec(styleContent);
      const colorMatch = /(?:^|;)\s*color:\s*([^;]+)/i.exec(styleContent);

      if (bgMatch && colorMatch) {
        const bgColor = bgMatch[1].trim();
        const textColor = colorMatch[1].trim();

        // Skip if either color is transparent, inherit, or a variable
        if (!this.isActualColor(bgColor) || !this.isActualColor(textColor)) {
          continue;
        }

        try {
          const contrastResult = this.validateColorCombination(
            textColor,
            bgColor
          );
          if (!contrastResult.isValid) {
            issues.push({
              type: "poor-contrast",
              issue: `Poor contrast: ${textColor} text on ${bgColor} background`,
              textColor: textColor,
              backgroundColor: bgColor,
              actualRatio: contrastResult.actualRatio,
              requiredRatio: contrastResult.requiredRatio,
              suggestion: this.getAccessibleTextColor(bgColor),
              recommendation: `Use higher contrast colors. Try ${this.getAccessibleTextColor(
                bgColor
              )} text instead.`,
            });
          }
        } catch (error) {
          console.warn(
            `Color validation error for ${textColor} on ${bgColor}:`,
            error
          );
        }
      }
    }

    // Check for common inaccessible patterns
    const inaccessiblePatterns = [
      { pattern: /color:\s*#808080/gi, issue: "Low contrast gray text" },
      {
        pattern: /color:\s*lightgray/gi,
        issue: "Low contrast light gray text",
      },
      { pattern: /color:\s*#999999/gi, issue: "Low contrast gray text" },
      {
        pattern: /background:\s*yellow.*color:\s*white/gi,
        issue: "Poor yellow/white contrast",
      },
      // 🚨 NEW: Add specific patterns for blue-on-blue violations
      {
        pattern: /background[^:]*:\s*#0078d4[^;]*;[^}]*color:\s*#005a9e/gi,
        issue:
          "Dark blue text on Microsoft blue background - very poor contrast",
      },
      {
        pattern: /background[^:]*:\s*#00bcf2[^;]*;[^}]*color:\s*#0078d4/gi,
        issue: "Microsoft blue text on light blue background - poor contrast",
      },
    ];

    inaccessiblePatterns.forEach(({ pattern, issue }) => {
      if (pattern.test(htmlContent)) {
        issues.push({
          type: "accessibility-violation",
          issue: issue,
          recommendation: "Use higher contrast color combinations",
        });
      }
    });

    return {
      isValid: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Check if a color value is an actual color (not transparent, inherit, etc.)
   */
  isActualColor(color) {
    const normalizedColor = color.toLowerCase().trim();
    const nonColors = [
      "transparent",
      "inherit",
      "initial",
      "unset",
      "auto",
      "none",
    ];

    // Skip CSS variables
    if (
      normalizedColor.startsWith("var(") ||
      normalizedColor.startsWith("--")
    ) {
      return false;
    }

    // Skip non-color values
    if (nonColors.includes(normalizedColor)) {
      return false;
    }

    // Must be hex color, named color, rgb(), rgba(), etc.
    return /^(#[0-9a-f]{3,8}|rgb|hsl|[a-z]+)/.test(normalizedColor);
  }

  /**
   * Generate accessibility-compliant CSS rules
   */
  generateAccessibleCSS() {
    return `
/* Accessibility-compliant color scheme */
:root {
  --text-primary: #323130;
  --text-secondary: #605e5c;
  --bg-primary: #ffffff;
  --bg-secondary: #f3f2f1;
  --accent-primary: #0078d4;
  --accent-secondary: #106ebe;
  --border-color: #edebe9;
  --focus-color: #0078d4;
}

/* High contrast text */
.text-high-contrast {
  color: #000000 !important;
  background: #ffffff !important;
}

/* Accessible link styles */
a, .link {
  color: #0078d4;
  text-decoration: underline;
}

a:hover, .link:hover {
  color: #106ebe;
  text-decoration: none;
}

/* Focus indicators */
:focus {
  outline: 2px solid #0078d4;
  outline-offset: 2px;
}

/* Error states */
.error {
  color: #d13438;
  background: #fdf2f2;
  border: 1px solid #d13438;
}

/* Success states */
.success {
  color: #0e7214;
  background: #f2fdf2;
  border: 1px solid #0e7214;
}
`;
  }

  /**
   * Get pre-approved color palette for AI generation
   */
  getApprovedColorPalette() {
    return {
      primary: "#0078d4",
      secondary: "#106ebe",
      accent: "#005a9e",
      neutral: "#323130",
      surface: "#ffffff",
      background: "#f3f2f1",
      border: "#edebe9",
      text: "#323130",
      textSecondary: "#605e5c",
      error: "#d13438",
      success: "#0e7214",
      warning: "#fff4ce",
    };
  }
}

module.exports = { AccessibilityColorValidator };
