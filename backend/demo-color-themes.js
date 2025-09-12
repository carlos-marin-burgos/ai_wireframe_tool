#!/usr/bin/env node

/**
 * Color Theme Demonstration
 * Shows how easy it is to change the entire color scheme
 */

const fs = require("fs");
const path = require("path");

// Original color file path
const colorsFilePath = path.join(__dirname, "config", "colors.js");

// Different color themes
const themes = {
  neutral: {
    primary: "#8E9AAF",
    secondary: "#68769C",
    accent: "#3C4858",
    light: "#E9ECEF",
    medium: "#CBC2C2",
  },
  ocean: {
    primary: "#0ea5e9",
    secondary: "#0284c7",
    accent: "#0c4a6e",
    light: "#e0f2fe",
    medium: "#bae6fd",
  },
  forest: {
    primary: "#059669",
    secondary: "#047857",
    accent: "#064e3b",
    light: "#d1fae5",
    medium: "#a7f3d0",
  },
  sunset: {
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#92400e",
    light: "#fef3c7",
    medium: "#fde68a",
  },
  corporate: {
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#3730a3",
    light: "#e0e7ff",
    medium: "#c7d2fe",
  },
};

console.log("🎨 Designetica Color Theme Demo\n");
console.log(
  "With centralized color management, you can change themes instantly!\n"
);

Object.entries(themes).forEach(([themeName, colors]) => {
  console.log(`🎯 ${themeName.toUpperCase()} Theme:`);
  console.log(`   Primary: ${colors.primary}`);
  console.log(`   Secondary: ${colors.secondary}`);
  console.log(`   Accent: ${colors.accent}`);
  console.log(`   Light: ${colors.light}`);
  console.log(`   Medium: ${colors.medium}\n`);
});

console.log("💡 To switch themes:");
console.log("1. Edit /backend/config/colors.js");
console.log("2. Replace the WIREFRAME_COLORS values with any theme above");
console.log("3. All wireframes will automatically use the new colors!");
console.log("\n📝 Example - To use Ocean theme:");
console.log(`
const WIREFRAME_COLORS = {
  primary: "${themes.ocean.primary}",
  secondary: "${themes.ocean.secondary}", 
  accent: "${themes.ocean.accent}",
  light: "${themes.ocean.light}",
  medium: "${themes.ocean.medium}",
  // ... rest of the colors
};
`);

console.log("✨ Benefits of centralized colors:");
console.log("   • Change entire app theme in 30 seconds");
console.log("   • No hunting through 20+ files for color references");
console.log("   • Zero risk of missing a color somewhere");
console.log("   • Perfect consistency across all wireframes");
console.log("   • Easy A/B testing of different color schemes");

// Show current theme
try {
  delete require.cache[require.resolve("./config/colors")];
  const { WIREFRAME_COLORS } = require("./config/colors");
  console.log(`\n🎯 Current active theme colors:`);
  console.log(`   Primary: ${WIREFRAME_COLORS.primary}`);
  console.log(`   Secondary: ${WIREFRAME_COLORS.secondary}`);
  console.log(`   Light: ${WIREFRAME_COLORS.light}`);
} catch (error) {
  console.log("   (Could not load current colors)");
}

console.log("\n🚀 The days of scattered color management are over!");
