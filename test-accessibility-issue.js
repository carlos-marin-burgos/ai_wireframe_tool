/**
 * Test script to reproduce the dark blue on blue accessibility issue
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const {
  AccessibilityColorValidator,
} = require("./backend/accessibility/color-validator");
const {
  AccessibilityValidationMiddleware,
} = require("./backend/accessibility/validation-middleware");

const validator = new AccessibilityColorValidator();
const middleware = new AccessibilityValidationMiddleware();

console.log("🔍 Testing Accessibility Issue Detection\n");

// Test cases that might be problematic
const testCases = [
  {
    name: "Dark blue text on blue background",
    html: `<div style="background: #0078d4; color: #005a9e;">Dark blue text on blue background</div>`,
  },
  {
    name: "Dark blue text on light blue background",
    html: `<div style="background: #00bcf2; color: #0078d4;">Dark blue text on light blue background</div>`,
  },
  {
    name: "Tailwind blue text on blue background",
    html: `<div class="bg-blue-600 text-blue-800">Blue text on blue background</div>`,
  },
  {
    name: "Multiple blue shades",
    html: `<div style="background-color: #106ebe; color: #0078d4;">Multiple blue shades</div>`,
  },
  {
    name: "Inline style combinations",
    html: `<span style="background: #0078d4;">
      <span style="color: #005a9e;">Dark blue text in blue container</span>
    </span>`,
  },
];

console.log("📊 Testing Individual Color Combinations:");
console.log("===========================================");

// Test specific color combinations
const colorCombinations = [
  { text: "#005a9e", bg: "#0078d4", name: "Dark Blue on Microsoft Blue" },
  { text: "#0078d4", bg: "#00bcf2", name: "Microsoft Blue on Light Blue" },
  { text: "#106ebe", bg: "#0078d4", name: "Secondary Blue on Microsoft Blue" },
  {
    text: "#323130",
    bg: "#0078d4",
    name: "Dark Gray on Microsoft Blue (should be good)",
  },
  {
    text: "#ffffff",
    bg: "#0078d4",
    name: "White on Microsoft Blue (should be good)",
  },
];

colorCombinations.forEach(({ text, bg, name }) => {
  const result = validator.validateColorCombination(text, bg);
  const status = result.isValid ? "✅ PASS" : "❌ FAIL";
  console.log(`  ${status} ${name}`);
  console.log(
    `    Contrast ratio: ${result.actualRatio.toFixed(2)}:1 (Required: ${
      result.requiredRatio
    }:1)`
  );
  if (!result.isValid) {
    const suggestedText = validator.getAccessibleTextColor(bg);
    console.log(`    💡 Suggested text color: ${suggestedText}`);
  }
  console.log("");
});

console.log("🧪 Testing HTML Content Validation:");
console.log("====================================");

testCases.forEach(({ name, html }) => {
  console.log(`\n📝 Test: ${name}`);
  console.log(`HTML: ${html}`);

  const validation = validator.validateHtmlColors(html);
  console.log(`Validation: ${validation.isValid ? "✅ PASS" : "❌ FAIL"}`);

  if (!validation.isValid) {
    console.log("Issues found:");
    validation.issues.forEach((issue, index) => {
      console.log(
        `  ${index + 1}. ${issue.issue || issue.type}: ${
          issue.color || issue.recommendation
        }`
      );
    });

    // Test if middleware can fix it
    const middlewareResult = middleware.validateAndFixWireframe(html, {
      logIssues: false,
    });
    console.log(
      `Middleware fix: ${
        middlewareResult.wasFixed ? "✅ FIXED" : "❌ NOT FIXED"
      }`
    );
    if (middlewareResult.wasFixed) {
      console.log(
        `Fixed HTML: ${middlewareResult.content.substring(0, 100)}...`
      );
    }
  }
});

console.log("\n🎯 Testing Real Wireframe Generation:");
console.log("=====================================");

// Test if the issue occurs during wireframe generation
const problematicWireframe = `
<div class="wireframe-container" style="font-family: 'Segoe UI', sans-serif;">
  <header style="background: #0078d4; padding: 16px;">
    <h1 style="color: #005a9e; margin: 0;">This might be hard to read</h1>
    <nav style="margin-top: 8px;">
      <a href="#" style="color: #106ebe; margin-right: 16px;">Dark blue link</a>
      <a href="#" style="color: #ffffff; margin-right: 16px;">White link</a>
    </nav>
  </header>
  <main style="padding: 16px; background: #f3f2f1;">
    <div style="background: #00bcf2; padding: 12px; margin-bottom: 16px;">
      <p style="color: #0078d4; margin: 0;">Blue text on light blue background</p>
    </div>
  </main>
</div>
`;

console.log("Testing complete wireframe with multiple potential issues...");
const wireframeValidation = validator.validateHtmlColors(problematicWireframe);
console.log(
  `Wireframe validation: ${wireframeValidation.isValid ? "✅ PASS" : "❌ FAIL"}`
);

if (!wireframeValidation.isValid) {
  console.log("Issues in wireframe:");
  wireframeValidation.issues.forEach((issue, index) => {
    console.log(
      `  ${index + 1}. ${issue.issue || issue.type}: ${
        issue.color || issue.recommendation
      }`
    );
  });

  const wireframeFixed = middleware.validateAndFixWireframe(
    problematicWireframe,
    {
      logIssues: true,
      enforceCompliance: true,
    }
  );

  console.log(`\nWireframe middleware result:`);
  console.log(`  Fixed: ${wireframeFixed.wasFixed}`);
  console.log(`  Valid: ${wireframeFixed.isValid}`);
  console.log(`  Issues found: ${wireframeFixed.issues.length}`);
}

console.log("\n🏁 Test Complete!");
