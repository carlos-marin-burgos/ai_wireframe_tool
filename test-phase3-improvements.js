#!/usr/bin/env node

/**
 * Phase 3 Interactive Analysis Test Script
 * Tests hover states, animations, forms, and loading states
 */

const http = require("http");

// Test URLs - sites known for rich interactions
const TEST_URLS = [
  {
    url: "https://stripe.com",
    name: "Stripe (Interactive buttons, animations)",
  },
  { url: "https://www.airbnb.com", name: "Airbnb (Forms, hover effects)" },
  { url: "https://github.com/login", name: "GitHub Login (Form validation)" },
  {
    url: "https://tailwindcss.com",
    name: "Tailwind CSS (Animations, transitions)",
  },
  { url: "https://example.com", name: "Example.com (Simple baseline)" },
];

const API_URL = "http://localhost:7071/api/websiteAnalyzer";

console.log("🎯 Phase 3 Interactive Analysis Test\n");
console.log("=".repeat(60));

async function testWebsite(testCase) {
  console.log(`\n🔍 Testing: ${testCase.name}`);
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

          if (result.success && result.analysis) {
            const analysis = result.analysis;

            console.log(`\n✅ Analysis completed in ${duration}s\n`);

            // Phase 3 Validation
            console.log("📊 PHASE 3 FEATURES:");
            console.log("");

            // 1. Interactive States
            if (analysis.interactive) {
              console.log("🎯 Interactive States:");
              console.log(
                `   Buttons analyzed: ${
                  analysis.interactive.buttons?.length || 0
                }`
              );
              console.log(
                `   Links analyzed: ${analysis.interactive.links?.length || 0}`
              );
              console.log(
                `   Input fields: ${analysis.interactive.inputs?.length || 0}`
              );
              console.log(
                `   Has hover effects: ${
                  analysis.interactive.hasHoverEffects ? "✅" : "❌"
                }`
              );
              console.log(
                `   Has focus styles: ${
                  analysis.interactive.hasFocusStyles ? "✅" : "❌"
                }`
              );

              if (analysis.interactive.buttons?.length > 0) {
                const firstButton = analysis.interactive.buttons[0];
                console.log(`   Sample button: ${firstButton.selector}`);
                console.log(
                  `     - Normal BG: ${
                    firstButton.normal?.backgroundColor || "N/A"
                  }`
                );
                console.log(
                  `     - Has transition: ${
                    firstButton.hasTransition ? "✅" : "❌"
                  }`
                );
              }
            } else {
              console.log("🎯 Interactive States: ❌ NOT FOUND");
            }

            console.log("");

            // 2. Animations
            if (analysis.animations) {
              console.log("🎬 Animations & Transitions:");
              console.log(
                `   CSS Transitions: ${
                  analysis.animations.cssTransitions?.length || 0
                }`
              );
              console.log(
                `   CSS Animations: ${
                  analysis.animations.cssAnimations?.length || 0
                }`
              );
              console.log(
                `   Scroll animations: ${
                  analysis.animations.scrollAnimations?.length || 0
                }`
              );
              console.log(
                `   Has parallax: ${
                  analysis.animations.hasParallax ? "✅" : "❌"
                }`
              );
              console.log(
                `   Micro-interactions: ${
                  analysis.animations.hasMicroInteractions ? "✅" : "❌"
                }`
              );

              if (analysis.animations.cssTransitions?.length > 0) {
                const firstTransition = analysis.animations.cssTransitions[0];
                console.log(
                  `   Sample transition: ${firstTransition.selector}`
                );
                console.log(
                  `     - Property: ${
                    firstTransition.transitionProperty || "N/A"
                  }`
                );
                console.log(
                  `     - Duration: ${
                    firstTransition.transitionDuration || "N/A"
                  }`
                );
              }
            } else {
              console.log("🎬 Animations: ❌ NOT FOUND");
            }

            console.log("");

            // 3. Form Intelligence
            if (analysis.forms) {
              console.log("📝 Form Intelligence:");
              console.log(`   Total forms: ${analysis.forms.totalForms || 0}`);
              console.log(
                `   Has validation: ${
                  analysis.forms.hasValidation ? "✅" : "❌"
                }`
              );
              console.log(
                `   Has error states: ${
                  analysis.forms.hasErrorStates ? "✅" : "❌"
                }`
              );

              if (analysis.forms.forms?.length > 0) {
                const firstForm = analysis.forms.forms[0];
                console.log(`   Sample form:`);
                console.log(`     - Method: ${firstForm.method || "N/A"}`);
                console.log(`     - Fields: ${firstForm.fields?.length || 0}`);
                console.log(
                  `     - Has submit button: ${
                    firstForm.hasSubmitButton ? "✅" : "❌"
                  }`
                );
                console.log(
                  `     - Required fields: ${
                    firstForm.hasRequiredFields ? "✅" : "❌"
                  }`
                );

                if (firstForm.fields?.length > 0) {
                  const firstField = firstForm.fields[0];
                  console.log(`     - First field type: ${firstField.type}`);
                  console.log(
                    `     - Placeholder: "${firstField.placeholder || "none"}"`
                  );
                  console.log(
                    `     - Required: ${firstField.required ? "✅" : "❌"}`
                  );
                }
              }
            } else {
              console.log("📝 Forms: ❌ NOT FOUND");
            }

            console.log("");

            // 4. Loading States
            if (analysis.loadingStates) {
              console.log("⏳ Loading States:");
              console.log(
                `   Spinners: ${analysis.loadingStates.spinners?.length || 0}`
              );
              console.log(
                `   Skeletons: ${analysis.loadingStates.skeletons?.length || 0}`
              );
              console.log(
                `   Progress bars: ${
                  analysis.loadingStates.progressBars?.length || 0
                }`
              );
              console.log(
                `   Has loading indicators: ${
                  analysis.loadingStates.hasLoadingStates ? "✅" : "❌"
                }`
              );

              if (analysis.loadingStates.spinners?.length > 0) {
                const firstSpinner = analysis.loadingStates.spinners[0];
                console.log(`   Sample spinner: ${firstSpinner.selector}`);
                console.log(
                  `     - Animation: ${firstSpinner.animation || "N/A"}`
                );
                console.log(
                  `     - Visible: ${firstSpinner.visible ? "✅" : "❌"}`
                );
              }
            } else {
              console.log("⏳ Loading States: ❌ NOT FOUND");
            }

            console.log("");
            console.log("📈 PHASE 1 & 2 FEATURES (for comparison):");
            console.log(
              `   Colors extracted: ${analysis.styling?.colors ? "✅" : "❌"}`
            );
            console.log(
              `   Typography: ${analysis.styling?.typography ? "✅" : "❌"}`
            );
            console.log(
              `   Layout measurements: ${
                analysis.layout?.measurements ? "✅" : "❌"
              }`
            );
            console.log(`   Screenshot: ${analysis.screenshot ? "✅" : "❌"}`);
            console.log(`   Responsive: ${analysis.responsive ? "✅" : "❌"}`);
            console.log(`   Frameworks: ${analysis.frameworks ? "✅" : "❌"}`);

            // Calculate Phase 3 score
            let phase3Score = 0;
            if (analysis.interactive?.buttons?.length > 0) phase3Score += 25;
            if (analysis.animations?.cssTransitions?.length > 0)
              phase3Score += 25;
            if (analysis.forms?.totalForms > 0) phase3Score += 25;
            if (analysis.loadingStates?.hasLoadingStates) phase3Score += 25;

            console.log("");
            console.log(
              `🎯 Phase 3 Score: ${phase3Score}% (${phase3Score}/100)`
            );
            console.log("");

            resolve({
              success: true,
              url: testCase.url,
              duration: duration,
              phase3Score: phase3Score,
              hasInteractive: !!analysis.interactive,
              hasAnimations: !!analysis.animations,
              hasForms: !!analysis.forms,
              hasLoadingStates: !!analysis.loadingStates,
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
  console.log("📊 PHASE 3 TEST SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    const avgScore = (
      successful.reduce((sum, r) => sum + (r.phase3Score || 0), 0) /
      successful.length
    ).toFixed(1);
    const avgDuration = (
      successful.reduce((sum, r) => sum + parseFloat(r.duration || 0), 0) /
      successful.length
    ).toFixed(1);

    console.log(`\n📈 Average Phase 3 Score: ${avgScore}%`);
    console.log(`⏱️  Average Duration: ${avgDuration}s`);

    console.log("\n🎯 Phase 3 Feature Coverage:");
    console.log(
      `   Interactive States: ${
        successful.filter((r) => r.hasInteractive).length
      }/${successful.length}`
    );
    console.log(
      `   Animations: ${successful.filter((r) => r.hasAnimations).length}/${
        successful.length
      }`
    );
    console.log(
      `   Forms: ${successful.filter((r) => r.hasForms).length}/${
        successful.length
      }`
    );
    console.log(
      `   Loading States: ${
        successful.filter((r) => r.hasLoadingStates).length
      }/${successful.length}`
    );
  }

  if (failed.length > 0) {
    console.log("\n❌ Failed tests:");
    failed.forEach((r) => {
      console.log(`   - ${r.url}: ${r.error}`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Phase 3 testing complete!");
  console.log("=".repeat(60));
}

// Run tests
runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
