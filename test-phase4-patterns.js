#!/usr/bin/env node

/**
 * Phase 4 Pattern Recognition Test Script
 * Tests UX pattern detection and suggestion generation
 */

import http from "http";

// Test URLs - sites with different patterns
const TEST_URLS = [
  {
    url: "https://github.com/login",
    name: "GitHub Login (Form patterns)",
    expectedPatterns: ["long-form", "validated-form", "multi-step-form"],
  },
  {
    url: "https://stripe.com",
    name: "Stripe (Interactive, hero, navigation)",
    expectedPatterns: [
      "interactive-components",
      "hero-section",
      "complex-navigation",
    ],
  },
  {
    url: "https://docs.github.com",
    name: "GitHub Docs (Content-heavy, search)",
    expectedPatterns: ["content-heavy", "search-interface"],
  },
  {
    url: "https://example.com",
    name: "Example.com (Simple baseline)",
    expectedPatterns: [],
  },
];

const API_URL = "http://localhost:7071/api/websiteAnalyzer";

console.log("🔍 Phase 4 Pattern Recognition Test\n");
console.log("=".repeat(60));

async function testWebsite(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📍 URL: ${testCase.url}`);
  console.log("-".repeat(60));

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ url: testCase.url });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(API_URL, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        try {
          const result = JSON.parse(data);

          if (result.success) {
            console.log(`\n✅ Analysis completed in ${duration}s\n`);

            // Phase 4 Validation
            console.log("📊 PHASE 4: PATTERN RECOGNITION");
            console.log("");

            // Patterns Detected
            const patterns = result.patterns || [];
            const suggestions = result.suggestions || [];

            console.log(`🎯 Patterns Detected: ${patterns.length}`);

            if (patterns.length > 0) {
              patterns.forEach((pattern, index) => {
                const priorityIcon = {
                  high: "🔴",
                  medium: "🟡",
                  low: "🟢",
                };

                console.log(`\n${index + 1}. ${pattern.title}`);
                console.log(`   Type: ${pattern.type}`);
                console.log(
                  `   Confidence: ${(pattern.confidence * 100).toFixed(1)}%`
                );
                console.log(
                  `   Priority: ${
                    priorityIcon[pattern.priority]
                  } ${pattern.priority.toUpperCase()}`
                );
                console.log(`   Tags: ${pattern.tags.join(", ")}`);

                // Check if pattern was expected
                if (testCase.expectedPatterns.includes(pattern.type)) {
                  console.log(`   ✅ Expected pattern found`);
                }
              });
            } else {
              console.log(
                "   No patterns detected (expected for simple sites)"
              );
            }

            console.log("");
            console.log(`💡 Suggestions Generated: ${suggestions.length}`);

            if (suggestions.length > 0) {
              suggestions.forEach((suggestionGroup, index) => {
                console.log(`\n${index + 1}. ${suggestionGroup.pattern.title}`);
                console.log(
                  `   Applicability: ${suggestionGroup.applicability.score}% - ${suggestionGroup.applicability.label}`
                );
                console.log(
                  `   Suggestions (${suggestionGroup.suggestions.length}):`
                );

                suggestionGroup.suggestions
                  .slice(0, 3)
                  .forEach((suggestion, sIndex) => {
                    console.log(`      ${sIndex + 1}. ${suggestion.title}`);
                    console.log(
                      `         Impact: ${suggestion.impact} | Effort: ${suggestion.effort}`
                    );
                    console.log(`         "${suggestion.description}"`);
                  });

                if (suggestionGroup.suggestions.length > 3) {
                  console.log(
                    `      ... and ${
                      suggestionGroup.suggestions.length - 3
                    } more`
                  );
                }
              });
            }

            // Validation Summary
            console.log("");
            console.log("📈 VALIDATION SUMMARY:");

            const expectedFound = testCase.expectedPatterns.filter((expected) =>
              patterns.some((p) => p.type === expected)
            );

            if (testCase.expectedPatterns.length > 0) {
              console.log(
                `   Expected patterns: ${testCase.expectedPatterns.length}`
              );
              console.log(`   Found: ${expectedFound.length}`);
              console.log(
                `   Success rate: ${(
                  (expectedFound.length / testCase.expectedPatterns.length) *
                  100
                ).toFixed(0)}%`
              );

              const missed = testCase.expectedPatterns.filter(
                (expected) => !patterns.some((p) => p.type === expected)
              );

              if (missed.length > 0) {
                console.log(`   ⚠️  Missed: ${missed.join(", ")}`);
              }
            } else {
              console.log(`   ✅ Simple site - no patterns expected`);
            }

            // Phase 1-3 Verification
            console.log("");
            console.log("📊 PHASE 1-3 DATA (for pattern detection):");
            console.log(`   Forms: ${result.analysis.forms?.totalForms || 0}`);
            console.log(
              `   Interactive elements: ${
                result.analysis.interactive ? "✅" : "❌"
              }`
            );
            console.log(
              `   Animations: ${result.analysis.animations ? "✅" : "❌"}`
            );
            console.log(
              `   Layout sections: ${
                result.analysis.layout?.sections?.length || 0
              }`
            );
            console.log(
              `   Loading states: ${
                result.analysis.loadingStates?.hasLoadingStates ? "✅" : "❌"
              }`
            );

            console.log("");

            resolve({
              success: true,
              url: testCase.url,
              duration: duration,
              patternsDetected: patterns.length,
              suggestionsGenerated: suggestions.length,
              patternTypes: patterns.map((p) => p.type),
              expectedFound: expectedFound.length,
              expectedTotal: testCase.expectedPatterns.length,
            });
          } else {
            console.log(
              `❌ Analysis failed: ${result.error || "Unknown error"}`
            );
            resolve({
              success: false,
              url: testCase.url,
              error: result.error,
            });
          }
        } catch (error) {
          console.log(`❌ JSON parse error: ${error.message}`);
          resolve({
            success: false,
            url: testCase.url,
            error: error.message,
          });
        }
      });
    });

    req.on("error", (error) => {
      console.log(`❌ Request error: ${error.message}`);
      resolve({
        success: false,
        url: testCase.url,
        error: error.message,
      });
    });

    req.setTimeout(120000); // 120 second timeout
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  const results = [];

  for (const testCase of TEST_URLS) {
    const result = await testWebsite(testCase);
    results.push(result);

    // Wait between tests
    if (testCase !== TEST_URLS[TEST_URLS.length - 1]) {
      console.log("\n⏸️  Waiting 3 seconds before next test...\n");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 PHASE 4 TEST SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    const avgPatterns = (
      successful.reduce((sum, r) => sum + (r.patternsDetected || 0), 0) /
      successful.length
    ).toFixed(1);
    const avgSuggestions = (
      successful.reduce((sum, r) => sum + (r.suggestionsGenerated || 0), 0) /
      successful.length
    ).toFixed(1);
    const avgDuration = (
      successful.reduce((sum, r) => sum + parseFloat(r.duration || 0), 0) /
      successful.length
    ).toFixed(1);

    console.log(`\n📈 Averages:`);
    console.log(`   Patterns per site: ${avgPatterns}`);
    console.log(`   Suggestions per site: ${avgSuggestions}`);
    console.log(`   Analysis time: ${avgDuration}s`);

    // Pattern type distribution
    const allPatternTypes = successful.reduce(
      (all, r) => [...all, ...(r.patternTypes || [])],
      []
    );
    const patternCounts = {};
    allPatternTypes.forEach((type) => {
      patternCounts[type] = (patternCounts[type] || 0) + 1;
    });

    console.log("\n🎯 Pattern Distribution:");
    Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} times`);
      });

    // Expected pattern detection rate
    const totalExpected = successful.reduce(
      (sum, r) => sum + (r.expectedTotal || 0),
      0
    );
    const totalFound = successful.reduce(
      (sum, r) => sum + (r.expectedFound || 0),
      0
    );

    if (totalExpected > 0) {
      const detectionRate = ((totalFound / totalExpected) * 100).toFixed(1);
      console.log(
        `\n🎯 Pattern Detection Accuracy: ${detectionRate}% (${totalFound}/${totalExpected})`
      );
    }
  }

  if (failed.length > 0) {
    console.log("\n❌ Failed tests:");
    failed.forEach((r) => {
      console.log(`   - ${r.url}: ${r.error}`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Phase 4 testing complete!");
  console.log("=".repeat(60));
}

// Run tests
runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
