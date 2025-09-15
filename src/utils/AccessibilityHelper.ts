/**
 * Frontend Accessibility Utilities
 * Client-side helpers for accessibility validation
 */

export class AccessibilityHelper {
  private API_BASE: string;

  constructor() {
    this.API_BASE = "/api"; // Adjust based on your API setup
  }

  /**
   * Validate HTML content for accessibility issues
   */
  async validateHtml(htmlContent, enforceCompliance = false) {
    try {
      const response = await fetch(`${this.API_BASE}/validateAccessibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          enforceCompliance,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Accessibility validation failed: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Accessibility validation error:", error);
      throw error;
    }
  }

  /**
   * Get the approved color palette
   */
  getApprovedColors() {
    return {
      primary: "#0078d4", // Microsoft Blue
      secondary: "#106ebe", // Darker Blue
      accent: "#005a9e", // Dark Blue
      neutral: "#323130", // Dark Gray
      surface: "#ffffff", // White
      background: "#f3f2f1", // Light Gray
      border: "#edebe9", // Border Gray
      text: "#323130", // Dark Text
      textSecondary: "#605e5c", // Medium Gray
      error: "#d13438", // Red
      success: "#0e7214", // Green
      warning: "#fff4ce", // Light Yellow
    };
  }

  /**
   * Check if a color combination has sufficient contrast
   */
  checkContrast(textColor, backgroundColor, isLargeText = false) {
    const contrast = this.calculateContrastRatio(textColor, backgroundColor);
    const minRequired = isLargeText ? 3.0 : 4.5; // WCAG AA standards

    return {
      ratio: contrast,
      isValid: contrast >= minRequired,
      level: contrast >= 7 ? "AAA" : contrast >= minRequired ? "AA" : "Fail",
    };
  }

  /**
   * Calculate contrast ratio between two hex colors
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
   * Convert hex to RGB
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
   * Calculate relative luminance
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
   * Get accessible text color for a background
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

    // Return the color with better contrast
    return blackContrast >= whiteContrast ? "#000000" : "#ffffff";
  }

  /**
   * Apply accessibility fixes to an HTML element
   */
  applyAccessibilityFixes(element) {
    const fixes = [];
    const approvedColors = this.getApprovedColors();

    // Check all elements with inline styles
    const elementsWithStyles = element.querySelectorAll("[style]");

    elementsWithStyles.forEach((el) => {
      const style = el.style;

      // Check text color contrast
      if (style.color && style.backgroundColor) {
        const contrast = this.checkContrast(style.color, style.backgroundColor);
        if (!contrast.isValid) {
          const newTextColor = this.getAccessibleTextColor(
            style.backgroundColor
          );
          el.style.color = newTextColor;
          fixes.push(
            `Fixed text contrast: ${style.color} → ${newTextColor} on ${style.backgroundColor}`
          );
        }
      }

      // Replace problematic colors
      if (
        style.color &&
        (style.color.includes("#999") || style.color === "lightgray")
      ) {
        el.style.color = approvedColors.textSecondary;
        fixes.push(`Replaced low-contrast text color with approved color`);
      }

      // Fix problematic backgrounds
      if (style.backgroundColor === "yellow") {
        el.style.backgroundColor = approvedColors.warning;
        el.style.color = approvedColors.text;
        fixes.push(`Fixed yellow background with proper contrast`);
      }
    });

    return fixes;
  }

  /**
   * Generate accessibility report for current page
   */
  generatePageReport() {
    const report = {
      timestamp: new Date().toISOString(),
      issues: [],
      recommendations: [],
    };

    // Check all images for alt text
    const images = document.querySelectorAll("img");
    images.forEach((img, index) => {
      if (!img.alt) {
        report.issues.push({
          type: "missing-alt",
          element: `Image ${index + 1}`,
          recommendation: "Add descriptive alt text",
        });
      }
    });

    // Check heading hierarchy
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let previousLevel = 0;
    headings.forEach((heading) => {
      const currentLevel = parseInt(heading.tagName.substring(1));
      if (currentLevel > previousLevel + 1) {
        report.issues.push({
          type: "heading-hierarchy",
          element: heading.tagName,
          recommendation: "Maintain proper heading hierarchy",
        });
      }
      previousLevel = currentLevel;
    });

    // Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll(
      "button, a, input, select, textarea, [tabindex]"
    );
    interactiveElements.forEach((el) => {
      if (!el.hasAttribute("tabindex") && (el as HTMLElement).tabIndex < 0) {
        report.issues.push({
          type: "keyboard-access",
          element: el.tagName.toLowerCase(),
          recommendation: "Ensure element is keyboard accessible",
        });
      }
    });

    // General recommendations
    report.recommendations = [
      "Use semantic HTML elements where appropriate",
      "Ensure all interactive elements have focus indicators",
      "Test with screen readers and keyboard navigation",
      "Maintain color contrast ratios of 4.5:1 or higher",
      "Provide alternative text for images and media",
    ];

    return report;
  }
}

// Export default instance
export const accessibilityHelper = new AccessibilityHelper();

// Named exports for convenience
export const {
  validateHtml,
  getApprovedColors,
  checkContrast,
  getAccessibleTextColor,
  applyAccessibilityFixes,
  generatePageReport,
} = accessibilityHelper;
