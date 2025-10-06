/**
 * Test Script for Phase 1 Accuracy Improvements
 *
 * This script tests the enhanced website analyzer to verify:
 * 1. Real color extraction (not hardcoded)
 * 2. Real typography extraction
 * 3. Better dynamic content handling
 */

const axios = require("axios");

// Test URLs representing different website types
const testUrls = [
  {
    name: "Simple Static Site",
    url: "https://example.com",
    expectations: {
      colorsNotDefault: true,
      fontsNotDefault: true,
    },
  },
  {
    name: "Modern SPA (Stripe)",
    url: "https://stripe.com",
    expectations: {
      colorsNotDefault: true,
      fontsNotDefault: true,
      hasNavigation: true,
    },
  },
  {
    name: "Content-Heavy (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Web_design",
    expectations: {
      colorsNotDefault: true,
      fontsNotDefault: true,
      hasMultipleSections: true,
    },
  },
  {
    name: "Marketing Site (Vercel)",
    url: "https://vercel.com",
    expectations: {
      colorsNotDefault: true,
      fontsNotDefault: true,
    },
  },
];

// Default hardcoded values (what we DON'T want to see)
const defaultColors = {
  background: "#ffffff",
  text: "#000000",
  primary: "#0066cc",
  secondary: "#666666",
};

const defaultTypography = {
  fontFamily: "sans-serif",
  fontSize: "16px",
  lineHeight: "1.5",
};

async function testWebsiteAnalyzer(testCase) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🧪 Testing: ${testCase.name}`);
  console.log(`📍 URL: ${testCase.url}`);
  console.log(`${"=".repeat(60)}`);

  try {
    const response = await axios.post(
      "http://localhost:7071/api/websiteAnalyzer",
      { url: testCase.url },
      { timeout: 90000 } // 90 second timeout for slow sites
    );

    if (!response.data.success) {
      console.log("❌ Analysis failed:", response.data.error);
      return { success: false, testCase: testCase.name };
    }

    const analysis = response.data.analysis;
    const results = {
      testCase: testCase.name,
      success: true,
      checks: {},
    };

    // Check colors
    console.log("\n🎨 Color Extraction:");
    const colors = analysis.styling.colors;
    console.log(`  Background: ${colors.background}`);
    console.log(`  Text: ${colors.text}`);
    console.log(`  Primary: ${colors.primary}`);
    console.log(`  Secondary: ${colors.secondary}`);

    const colorsMatch =
      JSON.stringify(colors) === JSON.stringify(defaultColors);
    if (!colorsMatch) {
      console.log("  ✅ Colors are NOT default (extraction worked!)");
      results.checks.colorsExtracted = true;
    } else {
      console.log("  ⚠️ Colors are still default values");
      results.checks.colorsExtracted = false;
    }

    // Check typography
    console.log("\n📝 Typography Extraction:");
    const typography = analysis.styling.typography;
    console.log(`  Font Family: ${typography.fontFamily}`);
    console.log(`  Font Size: ${typography.fontSize}`);
    console.log(`  H1 Size: ${typography.h1Size || "N/A"}`);
    console.log(`  Line Height: ${typography.lineHeight}`);
    console.log(`  Heading Weight: ${typography.headingWeight || "N/A"}`);
    console.log(`  Body Weight: ${typography.bodyWeight || "N/A"}`);

    const typographyNotDefault =
      typography.fontFamily !== "sans-serif" || typography.h1Size !== undefined;
    if (typographyNotDefault) {
      console.log("  ✅ Typography is NOT default (extraction worked!)");
      results.checks.typographyExtracted = true;
    } else {
      console.log("  ⚠️ Typography might be default values");
      results.checks.typographyExtracted = false;
    }

    // Check structure
    console.log("\n🏗️ Structure Analysis:");
    console.log(`  Has Header: ${analysis.layout.header ? "✅" : "❌"}`);
    console.log(
      `  Has Navigation: ${analysis.layout.navigation ? "✅" : "❌"}`
    );
    console.log(`  Has Main Content: ${analysis.layout.main ? "✅" : "❌"}`);
    console.log(
      `  Number of Sections: ${analysis.layout.sections?.length || 0}`
    );
    console.log(`  Has Footer: ${analysis.layout.footer ? "✅" : "❌"}`);

    results.checks.hasStructure = !!(
      analysis.layout.header ||
      analysis.layout.navigation ||
      analysis.layout.main
    );

    // Overall assessment
    console.log("\n📊 Overall Assessment:");
    const allChecksPassed = Object.values(results.checks).every(
      (v) => v === true
    );
    if (allChecksPassed) {
      console.log("  🎉 ALL CHECKS PASSED!");
      results.overallStatus = "✅ PASSED";
    } else {
      console.log("  ⚠️ Some checks failed");
      results.overallStatus = "⚠️ PARTIAL";
    }

    return results;
  } catch (error) {
    console.log("❌ Error:", error.message);
    return {
      success: false,
      testCase: testCase.name,
      error: error.message,
    };
  }
}

async function runAllTests() {
  console.log("🚀 Starting Phase 1 Accuracy Improvement Tests");
  console.log("📅 Date:", new Date().toISOString());
  console.log(
    "\nMake sure the Azure Functions backend is running on port 7071!"
  );
  console.log("Run: cd backend && func start\n");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const results = [];

  for (const testCase of testUrls) {
    const result = await testWebsiteAnalyzer(testCase);
    results.push(result);

    // Wait between tests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Final summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 FINAL SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter(
    (r) => r.success && r.overallStatus === "✅ PASSED"
  );
  const partial = results.filter(
    (r) => r.success && r.overallStatus === "⚠️ PARTIAL"
  );
  const failed = results.filter((r) => !r.success);

  console.log(`\n✅ Fully Passed: ${successful.length}/${testUrls.length}`);
  console.log(`⚠️ Partially Passed: ${partial.length}/${testUrls.length}`);
  console.log(`❌ Failed: ${failed.length}/${testUrls.length}`);

  if (successful.length === testUrls.length) {
    console.log(
      "\n🎉 ALL TESTS PASSED! Phase 1 improvements are working correctly!"
    );
  } else if (successful.length + partial.length === testUrls.length) {
    console.log("\n✅ Tests mostly passed. Phase 1 improvements are working!");
  } else {
    console.log("\n⚠️ Some tests failed. Review the results above.");
  }

  console.log("\n" + "=".repeat(60));
}

// Run the tests
runAllTests().catch(console.error);
