const fs = require("fs").promises;
const path = require("path");

/**
 * Azure Function to Update Backend Color Configuration
 * This endpoint allows the frontend theme selector to update backend wireframe colors
 */
module.exports = async function (context, req) {
  context.log("UpdateThemeColors function processed a request.");

  // Set CORS headers
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    context.res.status = 200;
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    context.res.status = 405;
    context.res.body = {
      error: "Method not allowed. Use POST.",
    };
    return;
  }

  try {
    const { themeName, colors } = req.body;

    if (!themeName || !colors) {
      context.res.status = 400;
      context.res.body = {
        error: "Missing required fields: themeName and colors",
      };
      return;
    }

    // Validate required color properties
    const requiredColors = [
      "primary",
      "secondary",
      "accent",
      "light",
      "medium",
    ];
    const missingColors = requiredColors.filter((color) => !colors[color]);

    if (missingColors.length > 0) {
      context.res.status = 400;
      context.res.body = {
        error: `Missing required colors: ${missingColors.join(", ")}`,
      };
      return;
    }

    // Path to colors configuration file
    const colorsConfigPath = path.join(__dirname, "..", "config", "colors.js");

    // Read current colors configuration
    let configContent = await fs.readFile(colorsConfigPath, "utf8");

    // Create the new color configuration
    const newColorConfig = {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      light: colors.light,
      medium: colors.medium,
      dark: colors.accent, // Use accent as dark color

      // Text colors
      text: colors.accent,
      textSecondary: colors.primary,
      textLight: colors.secondary,

      // UI Elements
      border: colors.light,
      background: "#FFFFFF",
      surface: colors.light,

      // Hero sections
      heroBackground: colors.light,
      heroGradientStart: colors.light,
      heroGradientEnd: colors.medium,
      heroText: colors.accent,
      heroSecondary: colors.primary,

      // Buttons
      buttonPrimary: colors.primary,
      buttonSecondary: colors.secondary,
      buttonText: "#FFFFFF",
      buttonBorder: colors.primary,

      // States
      hover: colors.secondary,
      active: colors.accent,
      focus: colors.primary,
      disabled: colors.medium,
    };

    // Update the WIREFRAME_COLORS object in the config
    const colorEntries = Object.entries(newColorConfig)
      .map(([key, value]) => `  ${key}: "${value}",`)
      .join("\n");

    // Replace the WIREFRAME_COLORS object
    const wireframeColorsRegex = /const WIREFRAME_COLORS = \{[\s\S]*?\};/;
    const newWireframeColors = `const WIREFRAME_COLORS = {
  // Primary ${themeName} palette
${colorEntries}
};`;

    configContent = configContent.replace(
      wireframeColorsRegex,
      newWireframeColors
    );

    // Write the updated configuration back to file
    await fs.writeFile(colorsConfigPath, configContent, "utf8");

    context.log(`Successfully updated backend colors to ${themeName} theme`);

    context.res.status = 200;
    context.res.body = {
      success: true,
      message: `Backend colors updated to ${themeName} theme`,
      appliedColors: newColorConfig,
    };
  } catch (error) {
    context.log.error("Error updating theme colors:", error);

    context.res.status = 500;
    context.res.body = {
      error: "Internal server error while updating colors",
      details: error.message,
    };
  }
};
