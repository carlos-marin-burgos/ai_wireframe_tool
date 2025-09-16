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

    // Approved accessible color combinations - Blue Monochromatic Palette
    this.ACCESSIBLE_COMBINATIONS = [
      // High contrast pairs (text on background) - BLACK TEXT PREFERRED
      { text: "#000000", bg: "#ffffff", ratio: 21 }, // Black on White (perfect)
      { text: "#ffffff", bg: "#000000", ratio: 21 }, // White on Black (perfect)

      // Blue Monochromatic Palette - HIGH CONTRAST combinations with BLACK TEXT
      { text: "#000000", bg: "#d1dbe4", ratio: 10.1 }, // Black on Lightest Blue (excellent)
      { text: "#000000", bg: "#a3b7ca", ratio: 6.8 }, // Black on Light Blue (excellent)
      { text: "#000000", bg: "#7593af", ratio: 4.7 }, // Black on Medium Blue (good)
      { text: "#000000", bg: "#ffffff", ratio: 21 }, // Black on White (perfect)

      // White text on dark backgrounds
      { text: "#ffffff", bg: "#194a7a", ratio: 8.2 }, // White on Dark Blue (excellent)
      { text: "#ffffff", bg: "#476f95", ratio: 5.1 }, // White on Medium-Dark Blue (good)

      // Dark blue text ONLY on white backgrounds (for links/accents)
      { text: "#194a7a", bg: "#ffffff", ratio: 8.2 }, // Dark Blue on White (excellent)
      { text: "#476f95", bg: "#ffffff", ratio: 5.1 }, // Medium-Dark Blue on White (good)

      // Light blue text ONLY on very light backgrounds (limited use)
      { text: "#194a7a", bg: "#d1dbe4", ratio: 4.8 }, // Dark Blue on Light Blue (OK for large text)

      // Microsoft Blue compatibility (for existing components)
      { text: "#ffffff", bg: "#0078d4", ratio: 4.53 }, // White on Microsoft Blue (just passes)
      { text: "#000000", bg: "#0078d4", ratio: 4.02 }, // Black on Microsoft Blue (close, but not ideal)
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

    // For our blue monochromatic palette, use specific rules
    const bgLower = backgroundColor.toLowerCase();

    // Light backgrounds - use black text
    if (
      bgLower === "#ffffff" ||
      bgLower === "#d1dbe4" ||
      bgLower === "#a3b7ca"
    ) {
      return "#000000";
    }

    // Dark backgrounds - use white text
    if (
      bgLower === "#194a7a" ||
      bgLower === "#476f95" ||
      bgLower === "#000000"
    ) {
      return "#ffffff";
    }

    // Medium blue - check which gives better contrast
    if (bgLower === "#7593af") {
      return blackContrast >= this.MIN_CONTRAST_NORMAL ? "#000000" : "#ffffff";
    }

    // Fallback to calculation for other colors
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

    // If neither meets AA standards, return the better one
    return blackContrast > whiteContrast ? "#000000" : "#ffffff";
  }

  /**
   * Automatically fix HTML content with poor contrast
   */
  fixContrastIssues(htmlContent) {
    let fixedContent = htmlContent;
    const fixes = [];

    // Find and fix style attributes with poor contrast
    const elementStyleRegex = /style\s*=\s*["']([^"']*)["']/gi;
    let match;

    while ((match = elementStyleRegex.exec(htmlContent)) !== null) {
      const fullMatch = match[0];
      const styleContent = match[1];

      // Extract background and color from the same style attribute
      const bgMatch = /background(?:-color)?:\s*([^;]+)/i.exec(styleContent);
      const colorMatch = /(?:^|;)\s*color:\s*([^;]+)/i.exec(styleContent);

      if (bgMatch && colorMatch) {
        const bgColor = bgMatch[1].trim();
        const textColor = colorMatch[1].trim();

        // Skip non-actual colors
        if (!this.isActualColor(bgColor) || !this.isActualColor(textColor)) {
          continue;
        }

        try {
          const contrastResult = this.validateColorCombination(
            textColor,
            bgColor
          );
          if (!contrastResult.isValid) {
            const betterTextColor = this.getAccessibleTextColor(bgColor);
            const newStyleContent = styleContent.replace(
              /color:\s*[^;]+/i,
              `color: ${betterTextColor}`
            );
            const newFullMatch = `style="${newStyleContent}"`;

            fixedContent = fixedContent.replace(fullMatch, newFullMatch);

            fixes.push({
              type: "contrast-fix",
              original: `${textColor} on ${bgColor}`,
              fixed: `${betterTextColor} on ${bgColor}`,
              improvement: `${contrastResult.actualRatio.toFixed(
                2
              )} → ${this.calculateContrastRatio(
                betterTextColor,
                bgColor
              ).toFixed(2)}`,
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

    return {
      fixedContent,
      fixes,
      hasChanges: fixes.length > 0,
    };
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
   * Get pre-approved color palette for AI generation - Blue Monochromatic
   */
  getApprovedColorPalette() {
    return {
      // New Blue Monochromatic Palette
      darkest: "#194a7a", // Darkest blue - for text and primary elements
      dark: "#476f95", // Dark blue - for secondary elements
      medium: "#7593af", // Medium blue - for accents
      light: "#a3b7ca", // Light blue - for backgrounds
      lightest: "#d1dbe4", // Lightest blue - for subtle backgrounds
      white: "#ffffff", // White - for contrast and clean backgrounds
      black: "#000000", // Black - for maximum contrast text

      // Semantic mappings
      primary: "#194a7a",
      secondary: "#476f95",
      accent: "#7593af",
      surface: "#ffffff",
      background: "#d1dbe4",
      backgroundLight: "#ffffff",
      text: "#000000", // Default to black for best contrast
      textSecondary: "#194a7a",
      border: "#a3b7ca",

      // State colors (accessible versions)
      error: "#d13438",
      success: "#0e7214",
      warning: "#b7472a",
    };
  }
}

module.exports = { AccessibilityColorValidator };
