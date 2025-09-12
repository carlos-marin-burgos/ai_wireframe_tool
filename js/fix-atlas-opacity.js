#!/usr/bin/env node

/**
 * Fix Atlas Component Opacity and Contrast Issues
 * This script removes problematic opacity values and improves text contrast
 * in Atlas component labels across the enhanced wireframe generator.
 */

const fs = require("fs");
const path = require("path");

const filePath =
  "/Users/carlosmarinburgos/designetica/backend/generateWireframeEnhanced/index.js";

console.log("🛠️  Fixing Atlas component opacity and contrast issues...");

try {
  let content = fs.readFileSync(filePath, "utf8");

  // Fix 1: Remove opacity from Atlas component labels and improve colors
  content = content.replace(
    /color: #68769C; margin: 0; opacity: 0\.8;/g,
    "color: #3C4858; margin: 0; font-weight: 600;"
  );

  content = content.replace(
    /color: #8a8886; margin: ([^;]+); opacity: 0\.6;/g,
    "color: #68769C; margin: $1; font-weight: 500;"
  );

  // Fix 2: Add background to Atlas component info sections for better contrast
  content = content.replace(
    /style="text-align: center; margin-top: 8px; padding: 8px;"/g,
    'style="text-align: center; margin-top: 8px; padding: 8px; background: rgba(255,255,255,0.95); border-radius: 6px; border: 1px solid #e1e1e1;"'
  );

  // Fix 3: Fix any remaining problematic opacity in Atlas components
  content = content.replace(/opacity: 0\.[0-8]/g, "font-weight: 500");

  // Fix 4: Ensure Atlas section background has good contrast
  content = content.replace(
    /color: #8a8886; font-size: 12px; opacity: 0\.8;/g,
    "color: #3C4858; font-size: 12px; font-weight: 500;"
  );

  fs.writeFileSync(filePath, content);

  console.log("✅ Fixed Atlas component opacity and contrast issues!");
  console.log("📝 Changes made:");
  console.log("   • Removed problematic opacity values from Atlas labels");
  console.log(
    "   • Improved text colors (#3C4858 for primary, #68769C for secondary)"
  );
  console.log("   • Added font-weight for better readability");
  console.log("   • Added background containers for better contrast");
  console.log("   • Enhanced overall text visibility");
} catch (error) {
  console.error("❌ Error fixing opacity issues:", error);
  process.exit(1);
}
