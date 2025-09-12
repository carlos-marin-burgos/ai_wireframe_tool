/**
 * Centralized Color Configuration for Designetica Wireframe Generation
 *
 * This is the SINGLE SOURCE OF TRUTH for all colors used in wireframe generation.
 * To change the color scheme, modify colors here and they will apply everywhere.
 */

// MAIN WIREFRAME COLOR PALETTE
const WIREFRAME_COLORS = {
  // Primary blue palette
  primary: "#0078d4",
  secondary: "#106ebe",
  accent: "#005a9e",
  light: "#f3f9fd",
  medium: "#deecf9",
  dark: "#005a9e",
  text: "#005a9e",
  textSecondary: "#0078d4",
  textLight: "#106ebe",
  border: "#f3f9fd",
  background: "#FFFFFF",
  surface: "#f3f9fd",
  heroBackground: "#f3f9fd",
  heroGradientStart: "#f3f9fd",
  heroGradientEnd: "#deecf9",
  heroText: "#005a9e",
  heroSecondary: "#0078d4",
  buttonPrimary: "#0078d4",
  buttonSecondary: "#106ebe",
  buttonText: "#FFFFFF",
  buttonBorder: "#0078d4",
  hover: "#106ebe",
  active: "#005a9e",
  focus: "#0078d4",
  disabled: "#deecf9",
};

// SEMANTIC COLOR VARIANTS (for specific use cases)
const SEMANTIC_COLORS = {
  success: "#107c10", // Green for success states
  warning: "#ffb900", // Amber for warnings
  error: "#d13438", // Red for errors
  info: "#8E9AAF", // Blue-gray for info (using our primary)
};

// DEPRECATED COLORS (colors we're moving away from)
const DEPRECATED_COLORS = {
  // Old Microsoft branded colors - DO NOT USE
  oldGray: "#6c757d",
  oldSecondary: "#5a6268",
  oldLight: "#f8f9fa",
  oldDark: "#212529",
  oldBorder: "#dee2e6",

  // Bootstrap colors - DO NOT USE
  bootstrapBlue: "#007bff",
  bootstrapHover: "#0056b3",
};

// COLOR UTILITIES
const ColorUtils = {
  /**
   * Get color with opacity
   */
  withOpacity: (color, opacity) => {
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },

  /**
   * Get all primary colors as array
   */
  getPrimaryPalette: () => [
    WIREFRAME_COLORS.primary,
    WIREFRAME_COLORS.secondary,
    WIREFRAME_COLORS.accent,
    WIREFRAME_COLORS.light,
    WIREFRAME_COLORS.medium,
  ],

  /**
   * Get color scheme for specific context
   */
  getColorScheme: (type = "default") => {
    switch (type) {
      case "hero":
        return {
          background: WIREFRAME_COLORS.heroBackground,
          text: WIREFRAME_COLORS.heroText,
          accent: WIREFRAME_COLORS.primary,
          secondary: WIREFRAME_COLORS.heroSecondary,
        };
      case "button":
        return {
          primary: WIREFRAME_COLORS.buttonPrimary,
          secondary: WIREFRAME_COLORS.buttonSecondary,
          text: WIREFRAME_COLORS.buttonText,
          border: WIREFRAME_COLORS.buttonBorder,
        };
      case "card":
        return {
          background: WIREFRAME_COLORS.surface,
          border: WIREFRAME_COLORS.border,
          text: WIREFRAME_COLORS.text,
          accent: WIREFRAME_COLORS.primary,
        };
      default:
        return WIREFRAME_COLORS;
    }
  },

  /**
   * Generate CSS custom properties
   */
  toCSSCustomProperties: () => {
    let css = ":root {\n";
    Object.entries(WIREFRAME_COLORS).forEach(([key, value]) => {
      css += `  --wireframe-${key
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()}: ${value};\n`;
    });
    Object.entries(SEMANTIC_COLORS).forEach(([key, value]) => {
      css += `  --wireframe-${key}: ${value};\n`;
    });
    css += "}\n";
    return css;
  },

  /**
   * Validate if color is approved
   */
  isApprovedColor: (color) => {
    const approvedColors = [
      ...Object.values(WIREFRAME_COLORS),
      ...Object.values(SEMANTIC_COLORS),
    ];
    return approvedColors.includes(color.toLowerCase());
  },

  /**
   * Get suggested replacement for deprecated color
   */
  getSuggestedReplacement: (deprecatedColor) => {
    const replacements = {
      [DEPRECATED_COLORS.oldGray]: WIREFRAME_COLORS.secondary,
      [DEPRECATED_COLORS.oldSecondary]: WIREFRAME_COLORS.dark,
      [DEPRECATED_COLORS.oldLight]: WIREFRAME_COLORS.light,
      [DEPRECATED_COLORS.oldDark]: WIREFRAME_COLORS.dark,
      [DEPRECATED_COLORS.oldBorder]: WIREFRAME_COLORS.border,
      [DEPRECATED_COLORS.bootstrapBlue]: WIREFRAME_COLORS.primary,
      [DEPRECATED_COLORS.bootstrapHover]: WIREFRAME_COLORS.hover,
    };
    return replacements[deprecatedColor] || WIREFRAME_COLORS.primary;
  },
};

// EXPORT EVERYTHING
module.exports = {
  WIREFRAME_COLORS,
  SEMANTIC_COLORS,
  DEPRECATED_COLORS,
  ColorUtils,

  // Convenient direct exports
  colors: WIREFRAME_COLORS,
  semanticColors: SEMANTIC_COLORS,
  utils: ColorUtils,
};
;
