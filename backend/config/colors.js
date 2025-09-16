/**
 * Centralized Color Configuration for Designetica Wireframe Generation
 *
 * This is the SINGLE SOURCE OF TRUTH for all colors used in wireframe generation.
 * To change the color scheme, modify colors here and they will apply everywhere.
 */

// MAIN WIREFRAME COLOR PALETTE - New Blue Monochromatic Theme
const WIREFRAME_COLORS = {
  // Blue monochromatic palette matching frontend CSS variables
  primary: "#194a7a", // Darkest blue (--color-primary-dark)
  secondary: "#476f95", // Medium-dark blue (--color-primary-medium-dark)
  accent: "#7593af", // Medium blue (--color-primary-medium)
  light: "#d1dbe4", // Lightest blue-gray (--color-primary-light)
  medium: "#a3b7ca", // Light blue-gray (--color-primary-medium-light)
  dark: "#194a7a", // Darkest blue
  text: "#194a7a", // Dark blue text
  textSecondary: "#476f95", // Medium-dark blue text
  textLight: "#7593af", // Medium blue text
  border: "#a3b7ca", // Light blue-gray border
  background: "#FFFFFF", // White background
  surface: "#d1dbe4", // Light blue-gray surface
  heroBackground: "#d1dbe4", // Light hero background
  heroGradientStart: "#d1dbe4", // Light blue-gray
  heroGradientEnd: "#a3b7ca", // Medium light blue-gray
  heroText: "#194a7a", // Dark blue hero text
  heroSecondary: "#476f95", // Medium-dark blue secondary text
  buttonPrimary: "#194a7a", // Dark blue primary button
  buttonSecondary: "#476f95", // Medium-dark blue secondary button
  buttonText: "#FFFFFF", // White button text
  buttonBorder: "#194a7a", // Dark blue button border
  hover: "#476f95", // Medium-dark blue hover
  active: "#194a7a", // Dark blue active
  focus: "#7593af", // Medium blue focus
  disabled: "#a3b7ca", // Light blue-gray disabled
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
