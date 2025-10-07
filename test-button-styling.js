#!/usr/bin/env node
/**
 * Test Button Styling in Generated Wireframes
 *
 * This script tests that buttons in generated wireframes have proper styling
 * by checking for inline style attributes or CSS classes.
 */

import axios from "axios";
import * as cheerio from "cheerio";

const BACKEND_URL = "http://localhost:7071";
const TEST_URL = "https://learn.microsoft.com";

async function testButtonStyling() {
  console.log("🧪 Testing Button Styling in Wireframe Generation\n");
  console.log(`📍 Test URL: ${TEST_URL}`);
  console.log(`🔗 Backend: ${BACKEND_URL}\n`);

  try {
    // Step 1: Analyze the website
    console.log("📊 Step 1: Analyzing website...");
    const analysisResponse = await axios.post(
      `${BACKEND_URL}/api/websiteAnalyzer`,
      {
        url: TEST_URL,
      },
      {
        timeout: 30000,
      }
    );

    const analysis = analysisResponse.data.analysis;
    console.log(`✅ Analysis complete`);
    console.log(`   Sections found: ${analysis.layout.sections.length}`);
    console.log(
      `   Buttons detected: ${analysis.interactive?.buttons?.length || 0}\n`
    );

    // Step 2: Generate wireframe
    console.log("🎨 Step 2: Generating wireframe with button styling...");
    const wireframeResponse = await axios.post(
      `${BACKEND_URL}/api/generateWireframe`,
      {
        description: `Create a wireframe based on ${TEST_URL}`,
        websiteAnalysis: analysis,
      },
      {
        timeout: 60000,
      }
    );

    const html = wireframeResponse.data.html;
    console.log(`✅ Wireframe generated (${html.length} characters)\n`);

    // Step 3: Parse and check button styling
    console.log("🔍 Step 3: Checking button styling...\n");
    const $ = cheerio.load(html);
    const buttons = $('button, .button, [role="button"], a.btn');

    console.log(`📊 Found ${buttons.length} button elements\n`);

    let styledButtons = 0;
    let unstyledButtons = 0;

    buttons.each((index, button) => {
      const $button = $(button);
      const hasInlineStyle =
        $button.attr("style") && $button.attr("style").length > 10;
      const hasClass =
        $button.attr("class") && $button.attr("class").length > 0;
      const text = $button.text().trim().substring(0, 30);

      if (hasInlineStyle) {
        styledButtons++;
        const style = $button.attr("style");
        const hasPadding = /padding\s*:/i.test(style);
        const hasBackground = /background(-color)?\s*:/i.test(style);
        const hasColor = /color\s*:/i.test(style);
        const hasBorderRadius = /border-radius\s*:/i.test(style);

        console.log(`✅ Button ${index + 1}: "${text}"`);
        console.log(
          `   Style attributes: ${[
            hasPadding && "✓ padding",
            hasBackground && "✓ background",
            hasColor && "✓ color",
            hasBorderRadius && "✓ border-radius",
          ]
            .filter(Boolean)
            .join(", ")}`
        );

        if (!hasPadding || !hasBackground || !hasColor) {
          console.log(
            `   ⚠️  Missing: ${[
              !hasPadding && "padding",
              !hasBackground && "background",
              !hasColor && "color",
            ]
              .filter(Boolean)
              .join(", ")}`
          );
        }
      } else if (hasClass) {
        styledButtons++;
        console.log(
          `✅ Button ${index + 1}: "${text}" (class: ${$button.attr("class")})`
        );
      } else {
        unstyledButtons++;
        console.log(`❌ Button ${index + 1}: "${text}" - NO STYLING`);
      }
    });

    // Summary
    console.log("\n📈 STYLING SUMMARY:");
    console.log(`   Total buttons: ${buttons.length}`);
    console.log(
      `   Styled: ${styledButtons} (${Math.round(
        (styledButtons / buttons.length) * 100
      )}%)`
    );
    console.log(
      `   Unstyled: ${unstyledButtons} (${Math.round(
        (unstyledButtons / buttons.length) * 100
      )}%)`
    );

    if (unstyledButtons === 0 && buttons.length > 0) {
      console.log("\n✅ SUCCESS: All buttons are properly styled!");
      return true;
    } else if (unstyledButtons > 0) {
      console.log("\n⚠️  WARNING: Some buttons lack proper styling");
      return false;
    } else {
      console.log("\n❓ No buttons found in wireframe");
      return false;
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response?.data) {
      console.error("Response:", error.response.data);
    }
    return false;
  }
}

// Run test
testButtonStyling().then((success) => {
  process.exit(success ? 0 : 1);
});
