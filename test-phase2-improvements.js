/**
 * Phase 2 Test Script - Comprehensive Testing
 *
 * Tests all Phase 2 features:
 * 1. Layout measurements extraction
 * 2. Screenshot analysis
 * 3. Responsive breakpoint detection
 * 4. Advanced CSS extraction
 * 5. Component library detection
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Test URLs with expected Phase 2 features
const testCases = [
  {
    name: "Material-UI + React (Stripe)",
    url: "https://stripe.com",
    expectations: {
      hasLayoutMeasurements: true,
      hasScreenshot: true,
      hasResponsive: true,
      hasAdvancedCSS: true,
      expectedFrameworks: ["React"],
      expectedLibraries: [], // May vary
      hasGradients: true,
      hasShadows: true,
    },
  },
  {
    name: "Bootstrap Site",
    url: "https://getbootstrap.com",
    expectations: {
      hasLayoutMeasurements: true,
      hasScreenshot: true,
      hasResponsive: true,
      hasAdvancedCSS: true,
      expectedLibraries: ["Bootstrap"],
      hasShadows: true,
    },
  },
  {
    name: "Tailwind CSS Site",
    url: "https://tailwindcss.com",
    expectations: {
      hasLayoutMeasurements: true,
      hasScreenshot: true,
      hasResponsive: true,
      expectedLibraries: ["Tailwind CSS"],
      hasRoundedCorners: true,
    },
  },
  {
    name: "Next.js Site (Vercel)",
    url: "https://vercel.com",
    expectations: {
      hasLayoutMeasurements: true,
      hasScreenshot: true,
      hasResponsive: true,
      hasAdvancedCSS: true,
      expectedFrameworks: ["React"],
      expectedBuildTools: ["Next.js"],
      hasGradients: true,
    },
  },
];

async function testPhase2Feature(testCase) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`🧪 Testing: ${testCase.name}`);
  console.log(`📍 URL: ${testCase.url}`);
  console.log(`${"=".repeat(70)}\n`);

  try {
    const startTime = Date.now();

    const response = await axios.post(
      "http://localhost:7071/api/websiteAnalyzer",
      { url: testCase.url },
      { timeout: 120000 } // 2 minute timeout for Phase 2 features
    );

    const elapsed = Date.now() - startTime;
    console.log(`⏱️  Analysis completed in ${(elapsed / 1000).toFixed(2)}s`);

    if (!response.data.success) {
      console.log("❌ Analysis failed:", response.data.error);
      return { success: false, testCase: testCase.name };
    }

    const analysis = response.data.analysis;
    const results = {
      testCase: testCase.name,
      success: true,
      phase2Checks: {},
    };

    // 1. Check Layout Measurements
    console.log("\n📏 Layout Measurements:");
    if (analysis.layout?.measurements) {
      console.log(`  ✅ Layout measurements present`);
      console.log(
        `     Viewport: ${analysis.layout.measurements.viewport?.width}×${analysis.layout.measurements.viewport?.height}`
      );
      console.log(
        `     Header: ${analysis.layout.measurements.header ? "✅" : "❌"}`
      );
      console.log(
        `     Navigation: ${
          analysis.layout.measurements.navigation ? "✅" : "❌"
        }`
      );
      console.log(
        `     Main: ${analysis.layout.measurements.main ? "✅" : "❌"}`
      );
      console.log(
        `     Sections: ${analysis.layout.measurements.sections?.length || 0}`
      );

      if (analysis.layout.measurements.header) {
        console.log(
          `     Header dimensions: ${analysis.layout.measurements.header.width}×${analysis.layout.measurements.header.height}`
        );
      }

      results.phase2Checks.layoutMeasurements = true;
    } else {
      console.log(`  ❌ Layout measurements missing`);
      results.phase2Checks.layoutMeasurements = false;
    }

    // 2. Check Screenshot
    console.log("\n📸 Screenshot:");
    if (analysis.screenshot) {
      const screenshotSize = analysis.screenshot.data
        ? Math.round(analysis.screenshot.data.length / 1024)
        : 0;
      console.log(`  ✅ Screenshot captured`);
      console.log(`     Size: ${screenshotSize}KB`);
      console.log(`     Format: ${analysis.screenshot.format}`);
      console.log(
        `     Dimensions: ${analysis.screenshot.dimensions?.width}×${analysis.screenshot.dimensions?.height}`
      );

      // Optionally save screenshot
      if (process.env.SAVE_SCREENSHOTS === "true") {
        const screenshotPath = path.join(
          __dirname,
          "test-screenshots",
          `${testCase.name.replace(/[^a-z0-9]/gi, "-")}.jpg`
        );
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        fs.writeFileSync(screenshotPath, analysis.screenshot.data, "base64");
        console.log(`     Saved to: ${screenshotPath}`);
      }

      results.phase2Checks.screenshot = true;
    } else {
      console.log(`  ❌ Screenshot missing`);
      results.phase2Checks.screenshot = false;
    }

    // 3. Check Responsive Breakpoints
    console.log("\n📱 Responsive Breakpoints:");
    if (analysis.responsive) {
      console.log(`  ✅ Responsive data present`);

      ["mobile", "tablet", "desktop"].forEach((bp) => {
        if (analysis.responsive[bp]) {
          console.log(`     ${bp.toUpperCase()}:`);
          console.log(
            `       Viewport: ${analysis.responsive[bp].viewport?.width}×${analysis.responsive[bp].viewport?.height}`
          );
          console.log(
            `       Nav visible: ${
              analysis.responsive[bp].layout?.navVisible ? "✅" : "❌"
            }`
          );
          console.log(
            `       Sidebar visible: ${
              analysis.responsive[bp].layout?.sidebarVisible ? "✅" : "❌"
            }`
          );
          console.log(
            `       Has hamburger: ${
              analysis.responsive[bp].layout?.hasHamburgerMenu ? "✅" : "❌"
            }`
          );
        }
      });

      results.phase2Checks.responsive = true;
    } else {
      console.log(`  ❌ Responsive data missing`);
      results.phase2Checks.responsive = false;
    }

    // 4. Check Advanced CSS
    console.log("\n🎨 Advanced CSS:");
    if (analysis.styling?.advancedCSS) {
      console.log(`  ✅ Advanced CSS present`);
      console.log(
        `     Buttons analyzed: ${
          analysis.styling.advancedCSS.buttons?.length || 0
        }`
      );
      console.log(
        `     Cards analyzed: ${
          analysis.styling.advancedCSS.cards?.length || 0
        }`
      );
      console.log(
        `     Images analyzed: ${
          analysis.styling.advancedCSS.images?.length || 0
        }`
      );
      console.log(
        `     Shadows found: ${
          analysis.styling.advancedCSS.commonEffects?.shadows?.length || 0
        }`
      );
      console.log(
        `     Gradients found: ${
          analysis.styling.advancedCSS.commonEffects?.gradients?.length || 0
        }`
      );
      console.log(
        `     Border radius values: ${
          analysis.styling.advancedCSS.commonEffects?.borderRadius?.length || 0
        }`
      );

      if (analysis.styling.advancedCSS.commonEffects?.shadows?.length > 0) {
        console.log(
          `     Example shadow: ${analysis.styling.advancedCSS.commonEffects.shadows[0]}`
        );
      }

      results.phase2Checks.advancedCSS = true;
    } else {
      console.log(`  ❌ Advanced CSS missing`);
      results.phase2Checks.advancedCSS = false;
    }

    // 5. Check Framework Detection
    console.log("\n🔍 Framework Detection:");
    if (analysis.frameworks) {
      console.log(`  ✅ Framework detection present`);
      console.log(
        `     Frameworks: ${
          analysis.frameworks.frameworks?.join(", ") || "None"
        }`
      );
      console.log(
        `     UI Libraries: ${
          analysis.frameworks.libraries?.join(", ") || "None"
        }`
      );
      console.log(
        `     Build Tools: ${
          analysis.frameworks.buildTools?.join(", ") || "None"
        }`
      );
      console.log(
        `     Platform/CMS: ${analysis.frameworks.meta?.join(", ") || "None"}`
      );

      results.phase2Checks.frameworkDetection = true;

      // Verify expected frameworks
      if (testCase.expectations.expectedFrameworks) {
        const foundExpected = testCase.expectations.expectedFrameworks.every(
          (f) => analysis.frameworks.frameworks?.includes(f)
        );
        if (foundExpected) {
          console.log(`     ✅ Expected frameworks detected`);
        } else {
          console.log(`     ⚠️  Some expected frameworks not detected`);
        }
      }
    } else {
      console.log(`  ❌ Framework detection missing`);
      results.phase2Checks.frameworkDetection = false;
    }

    // Overall Phase 2 Assessment
    console.log("\n📊 Phase 2 Assessment:");
    const phase2Passed = Object.values(results.phase2Checks).filter(
      (v) => v === true
    ).length;
    const phase2Total = Object.keys(results.phase2Checks).length;
    const phase2Score = ((phase2Passed / phase2Total) * 100).toFixed(0);

    console.log(
      `  Phase 2 Features: ${phase2Passed}/${phase2Total} (${phase2Score}%)`
    );

    if (phase2Score >= 80) {
      console.log(`  🎉 EXCELLENT - Phase 2 working well!`);
      results.overallStatus = "✅ PASSED";
    } else if (phase2Score >= 60) {
      console.log(`  ✅ GOOD - Most Phase 2 features working`);
      results.overallStatus = "⚠️ PARTIAL";
    } else {
      console.log(`  ⚠️ NEEDS WORK - Some Phase 2 features missing`);
      results.overallStatus = "❌ NEEDS IMPROVEMENT";
    }

    return results;
  } catch (error) {
    console.log("❌ Error:", error.message);
    if (error.response) {
      console.log("   Response status:", error.response.status);
      console.log(
        "   Response data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
    return {
      success: false,
      testCase: testCase.name,
      error: error.message,
    };
  }
}

async function runPhase2Tests() {
  console.log("🚀 Starting Phase 2 Accuracy Improvement Tests");
  console.log("📅 Date:", new Date().toISOString());
  console.log(
    "\n⚡ Make sure the Azure Functions backend is running on port 7071!"
  );
  console.log("   Run: cd backend && func start\n");
  console.log(
    "⏱️  Phase 2 tests may take longer due to responsive testing and screenshots...\n"
  );

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const results = [];

  for (const testCase of testCases) {
    const result = await testPhase2Feature(testCase);
    results.push(result);

    // Wait between tests
    console.log("\n⏳ Waiting 5 seconds before next test...\n");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // Final summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 PHASE 2 FINAL SUMMARY");
  console.log("=".repeat(70));

  const passed = results.filter(
    (r) => r.success && r.overallStatus === "✅ PASSED"
  );
  const partial = results.filter(
    (r) => r.success && r.overallStatus === "⚠️ PARTIAL"
  );
  const failed = results.filter(
    (r) => !r.success || r.overallStatus === "❌ NEEDS IMPROVEMENT"
  );

  console.log(`\n✅ Fully Passed: ${passed.length}/${testCases.length}`);
  console.log(`⚠️ Partially Passed: ${partial.length}/${testCases.length}`);
  console.log(`❌ Failed/Needs Work: ${failed.length}/${testCases.length}`);

  // Feature-by-feature summary
  console.log("\n📋 Feature Summary:");
  const features = [
    "layoutMeasurements",
    "screenshot",
    "responsive",
    "advancedCSS",
    "frameworkDetection",
  ];
  features.forEach((feature) => {
    const count = results.filter(
      (r) => r.phase2Checks?.[feature] === true
    ).length;
    const percentage = ((count / testCases.length) * 100).toFixed(0);
    const icon = percentage >= 80 ? "✅" : percentage >= 60 ? "⚠️" : "❌";
    console.log(
      `  ${icon} ${feature}: ${count}/${testCases.length} (${percentage}%)`
    );
  });

  if (passed.length === testCases.length) {
    console.log("\n🎉🎉🎉 ALL PHASE 2 TESTS PASSED! 🎉🎉🎉");
    console.log("Phase 2 improvements are working perfectly!");
  } else if (passed.length + partial.length === testCases.length) {
    console.log("\n✅ Phase 2 tests mostly passed!");
    console.log("Most features are working, review partial results above.");
  } else {
    console.log("\n⚠️ Some Phase 2 tests failed. Review the results above.");
  }

  console.log("\n" + "=".repeat(70));
  console.log("💡 Tip: Set SAVE_SCREENSHOTS=true to save screenshots to disk");
  console.log(
    "   Example: SAVE_SCREENSHOTS=true node test-phase2-improvements.js"
  );
  console.log("=".repeat(70));
}

// Run the tests
runPhase2Tests().catch(console.error);
