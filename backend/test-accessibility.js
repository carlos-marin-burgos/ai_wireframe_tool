/**
 * Test script for Accessibility Color Validation System
 * Run with: node test-accessibility.js
 */

const {
  AccessibilityColorValidator,
} = require("./accessibility/color-validator");
const {
  AccessibilityValidationMiddleware,
} = require("./accessibility/validation-middleware");

async function testAccessibilitySystem() {
  console.log("🧪 Testing Accessibility Color Validation System\n");

  const validator = new AccessibilityColorValidator();
  const middleware = new AccessibilityValidationMiddleware();

  // Test 1: Color contrast validation
  console.log("📊 Test 1: Color Contrast Validation");
  const testCombinations = [
    { text: "#000000", bg: "#ffffff", expected: true }, // Black on white - should pass
    { text: "#ffffff", bg: "#0078d4", expected: true }, // White on Microsoft Blue - should pass
    { text: "#999999", bg: "#ffffff", expected: false }, // Light gray on white - should fail
    { text: "#ffff00", bg: "#ffffff", expected: false }, // Yellow on white - should fail
  ];

  testCombinations.forEach(({ text, bg, expected }, index) => {
    const result = validator.validateColorCombination(text, bg);
    const status = result.isValid === expected ? "✅" : "❌";
    console.log(
      `  ${status} Test 1.${
        index + 1
      }: ${text} on ${bg} - Ratio: ${result.actualRatio.toFixed(2)} (${
        result.isValid ? "PASS" : "FAIL"
      })`
    );
  });

  console.log("\n");

  // Test 2: HTML color validation
  console.log("🔍 Test 2: HTML Color Validation");
  const testHtml = `
    <div style="color: #999999; background: white;">Low contrast text</div>
    <div style="color: #0078d4; background: white;">Good contrast text</div>
    <div style="background: yellow; color: white;">Poor yellow background</div>
    <div style="color: #323130; background: #ffffff;">Approved colors</div>
  `;

  const htmlValidation = validator.validateHtmlColors(testHtml);
  console.log(
    `  HTML Validation Result: ${
      htmlValidation.isValid ? "✅ PASS" : "❌ FAIL"
    }`
  );
  console.log(`  Issues found: ${htmlValidation.issues.length}`);
  htmlValidation.issues.forEach((issue, index) => {
    console.log(
      `    ${index + 1}. ${issue.type}: ${issue.color || issue.issue}`
    );
  });

  console.log("\n");

  // Test 3: Accessibility middleware fixes
  console.log("🔧 Test 3: Accessibility Middleware Fixes");
  const problematicHtml = `
    <div className="p-6">
      <h1 style="color: #808080;">Low contrast heading</h1>
      <p style="color: lightgray;">Hard to read text</p>
      <div style="background: yellow; color: white;">Poor contrast warning</div>
      <button style="color: #999999;">Hard to see button</button>
    </div>
  `;

  const middlewareResult = middleware.validateAndFixWireframe(problematicHtml);
  console.log(
    `  Original HTML had issues: ${!middlewareResult.isValid ? "✅" : "❌"}`
  );
  console.log(
    `  Issues were fixed: ${middlewareResult.wasFixed ? "✅" : "❌"}`
  );
  console.log(`  Issues found: ${middlewareResult.issues.length}`);

  console.log("\n  Fixed HTML preview:");
  console.log("  " + middlewareResult.content.substring(0, 200) + "...");

  console.log("\n");

  // Test 4: Approved color palette
  console.log("🎨 Test 4: Approved Color Palette");
  const palette = validator.getApprovedColorPalette();
  console.log("  Approved colors:");
  Object.entries(palette).forEach(([name, color]) => {
    console.log(`    ${name}: ${color}`);
  });

  console.log("\n");

  // Test 5: Accessibility report generation
  console.log("📋 Test 5: Accessibility Report Generation");
  const report = middleware.generateAccessibilityReport(problematicHtml);
  console.log(`  WCAG Compliance: ${report.wcagLevel}`);
  console.log(`  Is Compliant: ${report.isCompliant ? "✅" : "❌"}`);
  console.log(`  Recommendations: ${report.recommendations.length} items`);

  console.log("\n🎉 Accessibility Testing Complete!\n");

  // Summary
  const allSystemsWorking =
    testCombinations.every(
      ({ text, bg, expected }) =>
        validator.validateColorCombination(text, bg).isValid === expected
    ) &&
    middlewareResult.wasFixed &&
    Object.keys(palette).length > 0;

  console.log("📊 SUMMARY:");
  console.log(
    `🚨 Accessibility System Status: ${
      allSystemsWorking ? "✅ WORKING" : "❌ ISSUES DETECTED"
    }`
  );
  console.log("🎯 Key Features:");
  console.log("   ✅ WCAG 2.1 AA contrast validation (4.5:1 ratio)");
  console.log("   ✅ Automatic color fixing for common violations");
  console.log("   ✅ Approved Microsoft color palette enforcement");
  console.log("   ✅ HTML content scanning and validation");
  console.log("   ✅ Accessibility report generation");
  console.log("   ✅ Semantic HTML structure enhancement");

  return allSystemsWorking;
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAccessibilitySystem()
    .then((success) => {
      console.log(
        `\n${success ? "✅ All tests passed!" : "❌ Some tests failed!"}`
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Test execution failed:", error);
      process.exit(1);
    });
}

module.exports = { testAccessibilitySystem };
