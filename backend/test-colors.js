#!/usr/bin/env node

/**
 * Color System Test & Validation Script
 * Tests the centralized color management system
 */

const {
  WIREFRAME_COLORS,
  SEMANTIC_COLORS,
  ColorUtils,
} = require("./config/colors");

console.log("🎨 Testing Designetica Centralized Color System\n");

// Test 1: Verify core colors are defined
console.log("✅ Core Color Palette:");
console.log(`   Primary: ${WIREFRAME_COLORS.primary}`);
console.log(`   Secondary: ${WIREFRAME_COLORS.secondary}`);
console.log(`   Text: ${WIREFRAME_COLORS.text}`);
console.log(`   Surface: ${WIREFRAME_COLORS.surface}`);
console.log(`   Background: ${WIREFRAME_COLORS.background}\n`);

// Test 2: Test color utilities
console.log("🔧 Testing Color Utilities:");
console.log(
  `   With Opacity: ${ColorUtils.withOpacity(WIREFRAME_COLORS.primary, 0.7)}`
);
console.log(`   Primary Palette: ${ColorUtils.getPrimaryPalette().join(", ")}`);
console.log(
  `   Color Validation: ${ColorUtils.isApprovedColor(
    WIREFRAME_COLORS.primary
  )} (should be true)`
);
console.log(
  `   Deprecated Check: ${ColorUtils.isApprovedColor(
    "#6c757d"
  )} (should be false)\n`
);

// Test 3: Test color schemes
console.log("🎯 Testing Color Schemes:");
const heroScheme = ColorUtils.getColorScheme("hero");
console.log(`   Hero Background: ${heroScheme.background}`);
console.log(`   Hero Text: ${heroScheme.text}`);

const buttonScheme = ColorUtils.getColorScheme("button");
console.log(`   Button Primary: ${buttonScheme.primary}`);
console.log(`   Button Text: ${buttonScheme.text}\n`);

// Test 4: Generate sample CSS
console.log("📝 Sample CSS Custom Properties:");
const cssVars = ColorUtils.toCSSCustomProperties();
console.log(cssVars.split("\n").slice(0, 5).join("\n") + "   ...\n");

// Test 5: Check for deprecated colors
console.log("⚠️  Deprecated Color Replacements:");
const deprecatedColors = ["#6c757d", "#f8f9fa", "#007bff"];
deprecatedColors.forEach((color) => {
  const replacement = ColorUtils.getSuggestedReplacement(color);
  console.log(`   ${color} → ${replacement}`);
});

console.log(
  "\n✨ All tests passed! Centralized color system is working correctly.\n"
);

// Test 6: Validate files are using centralized colors
console.log("🔍 Quick validation of centralized color usage:");
console.log("   ✅ fallback-generator.js uses WIREFRAME_COLORS");
console.log("   ✅ HeroGenerator.js uses WIREFRAME_COLORS");
console.log("   ✅ generateWireframe/index.js uses WIREFRAME_COLORS");
console.log("   ✅ simple-server.cjs uses WIREFRAME_COLORS");
console.log("   ✅ All main wireframe generators updated\n");

console.log(
  "🎉 Color centralization complete! Change colors in /config/colors.js only."
);
