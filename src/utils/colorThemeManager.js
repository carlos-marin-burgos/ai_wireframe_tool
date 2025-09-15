import { getApiUrl } from "../config/api.ts";

/**
 * Color Theme Manager for Designetica
 *
 * This utility provides functions to easily change the entire color palette
 * without manually editing individual CSS files.
 */

// Define available color themes
export const COLOR_THEMES = {
  neutral: {
    name: "Neutral Gray",
    description: "Professional neutral gray palette (default)",
    colors: {
      primary: "#8E9AAF",
      secondary: "#68769C",
      accent: "#3C4858",
      light: "#E9ECEF",
      medium: "#CBC2C2",
    },
  },

  blue: {
    name: "Microsoft Blue",
    description: "Microsoft-inspired blue palette",
    colors: {
      primary: "#0078d4",
      secondary: "#106ebe",
      accent: "#005a9e",
      light: "#f3f9fd",
      medium: "#deecf9",
    },
  },

  green: {
    name: "Fresh Green",
    description: "Nature-inspired green palette",
    colors: {
      primary: "#107c10",
      secondary: "#0e6e0e",
      accent: "#0b5d0b",
      light: "#f3f9f3",
      medium: "#e1f1e1",
    },
  },

  purple: {
    name: "Creative Purple",
    description: "Creative and modern purple palette",
    colors: {
      primary: "#8764b8",
      secondary: "#744da9",
      accent: "#5d3b85",
      light: "#f7f5fb",
      medium: "#ede7f3",
    },
  },

  warm: {
    name: "Warm Tan",
    description: "Warm and friendly tan palette",
    colors: {
      primary: "#d2b48c",
      secondary: "#bc9a6a",
      accent: "#8b7355",
      light: "#faf8f5",
      medium: "#f0ebe3",
    },
  },
};

/**
 * Apply a color theme to the application AND sync with backend
 * @param {string} themeName - Name of the theme to apply
 */
export async function applyColorTheme(themeName) {
  const theme = COLOR_THEMES[themeName];
  if (!theme) {
    console.error(
      `Theme "${themeName}" not found. Available themes:`,
      Object.keys(COLOR_THEMES)
    );
    return false;
  }

  // Apply theme to document root
  const root = document.documentElement;

  // Set CSS custom properties
  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty("--color-secondary", theme.colors.secondary);
  root.style.setProperty("--color-accent", theme.colors.accent);
  root.style.setProperty("--color-light", theme.colors.light);
  root.style.setProperty("--color-medium", theme.colors.medium);

  // Update derived colors
  root.style.setProperty("--color-text", theme.colors.accent);
  root.style.setProperty("--color-text-secondary", theme.colors.primary);
  root.style.setProperty("--color-text-light", theme.colors.secondary);
  root.style.setProperty("--color-surface", theme.colors.light);
  root.style.setProperty("--color-border", theme.colors.medium);

  // Update button colors
  root.style.setProperty("--color-button-primary", theme.colors.primary);
  root.style.setProperty("--color-button-secondary", theme.colors.secondary);

  // Update interactive states
  root.style.setProperty("--color-hover", theme.colors.secondary);
  root.style.setProperty("--color-active", theme.colors.accent);
  root.style.setProperty("--color-focus", theme.colors.primary);
  root.style.setProperty("--color-disabled", theme.colors.medium);

  // Store the selected theme
  localStorage.setItem("designetica_color_theme", themeName);

  // Sync with backend for wireframe generation
  try {
    await syncThemeWithBackend(themeName, theme.colors);
    console.log(
      `Applied "${theme.name}" color theme (frontend + backend synced)`
    );
  } catch (error) {
    console.warn(
      `Applied "${theme.name}" color theme (frontend only - backend sync failed):`,
      error.message
    );
  }

  return true;
}

/**
 * Sync theme colors with backend for wireframe generation
 * @param {string} themeName - Name of the theme
 * @param {Object} colors - Color palette object
 */
async function syncThemeWithBackend(themeName, colors) {
  try {
    const response = await fetch(getApiUrl("/api/update-theme-colors"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        themeName,
        colors,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Backend sync failed: ${errorData.error || "Unknown error"}`
      );
    }

    const result = await response.json();
    console.log("✅ Backend colors synced:", result.message);
    return result;
  } catch (error) {
    console.error("❌ Failed to sync theme with backend:", error);
    throw error;
  }
}

/**
 * Get the currently applied theme
 * @returns {string} Current theme name - always returns 'blue' for Microsoft Blue
 */
export function getCurrentTheme() {
  // Always return Microsoft Blue theme (theme selector is hidden)
  return "blue";
}

/**
 * Load the saved theme on application start
 */
export function loadSavedTheme() {
  const savedTheme = getCurrentTheme();
  applyColorTheme(savedTheme);
}

/**
 * Create a custom color theme
 * @param {string} name - Theme name
 * @param {Object} colors - Color palette object
 */
export function createCustomTheme(name, colors) {
  COLOR_THEMES[name] = {
    name: name,
    description: "Custom theme",
    colors: colors,
  };
}

/**
 * Export current colors to backend format
 * @returns {Object} Color configuration for backend
 */
export function exportToBackendFormat() {
  const currentTheme = COLOR_THEMES[getCurrentTheme()];
  if (!currentTheme) return null;

  return {
    WIREFRAME_COLORS: {
      primary: currentTheme.colors.primary,
      secondary: currentTheme.colors.secondary,
      accent: currentTheme.colors.accent,
      light: currentTheme.colors.light,
      medium: currentTheme.colors.medium,
      dark: currentTheme.colors.accent,
      text: currentTheme.colors.accent,
      textSecondary: currentTheme.colors.primary,
      textLight: currentTheme.colors.secondary,
      border: currentTheme.colors.light,
      background: "#FFFFFF",
      surface: currentTheme.colors.light,
      heroBackground: currentTheme.colors.light,
      buttonPrimary: currentTheme.colors.primary,
      buttonSecondary: currentTheme.colors.secondary,
      hover: currentTheme.colors.secondary,
      active: currentTheme.colors.accent,
      focus: currentTheme.colors.primary,
      disabled: currentTheme.colors.medium,
    },
  };
}

// Auto-apply Microsoft Blue theme when module is imported
if (typeof window !== "undefined") {
  // Always apply Microsoft Blue theme (no theme selector)
  applyColorTheme("blue");
}
