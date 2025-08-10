#!/usr/bin/env node

// Test to verify image placeholder generation in wireframes
console.log("🖼️ Testing Image Placeholder Generation\n");

const { exec } = require("child_process");

const testDescription =
  "Create a modern e-commerce product page with image gallery, product details, price, add to cart button, customer reviews, and related products section";

console.log("📝 Testing with description:");
console.log(`"${testDescription}"\n`);

const curlCommand = `curl -X POST "http://localhost:7072/api/generate-wireframe" \
  -H "Content-Type: application/json" \
  -d '{"description": "${testDescription}"}' \
  --max-time 30 -s`;

console.log("🚀 Sending request to wireframe API...\n");

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Error:", error.message);
    return;
  }

  if (stderr) {
    console.error("⚠️ Stderr:", stderr);
  }

  try {
    const response = JSON.parse(stdout);

    console.log("✅ Wireframe Generation Results:");
    console.log(`📊 Response Status: SUCCESS`);
    console.log(`🤖 AI Generated: ${response.aiGenerated}`);
    console.log(
      `📏 HTML Length: ${response.html ? response.html.length : 0} characters`
    );
    console.log(`⚡ Processing Time: ${response.processingTimeMs}ms`);
    console.log(`🎨 Source: ${response.source}\n`);

    if (response.html) {
      // Extract and analyze image placeholders
      const placeholderUrls =
        response.html.match(/https:\/\/via\.placeholder\.com\/[^"']*/g) || [];
      const onerrorHandlers = (response.html.match(/onerror=/g) || []).length;
      const imgTags = response.html.match(/<img[^>]*>/g) || [];
      const brokenImages =
        response.html.match(/src=['""][^'"]*\.(jpg|jpeg|png|gif|svg)['"]/g) ||
        [];

      console.log("🖼️ IMAGE GENERATION ANALYSIS:");
      console.log(`📸 Total image tags found: ${imgTags.length}`);
      console.log(`🔗 Placeholder URLs generated: ${placeholderUrls.length}`);
      console.log(`🛡️ Error handlers added: ${onerrorHandlers}`);
      console.log(`💔 Broken image references: ${brokenImages.length}\n`);

      if (placeholderUrls.length > 0) {
        console.log("✅ GENERATED PLACEHOLDER URLs:");
        placeholderUrls.slice(0, 8).forEach((url, index) => {
          console.log(`${index + 1}. ${url}`);
        });
        if (placeholderUrls.length > 8) {
          console.log(`... and ${placeholderUrls.length - 8} more\n`);
        } else {
          console.log("");
        }
      }

      if (brokenImages.length > 0) {
        console.log("❌ BROKEN IMAGE REFERENCES FOUND:");
        brokenImages.slice(0, 5).forEach((img, index) => {
          console.log(`${index + 1}. ${img}`);
        });
        console.log("");
      }

      // Check theming and quality
      const hasMSLearnBlue = response.html.includes("0078d4");
      const hasNeutralColors = response.html.includes("f3f2f1");
      const hasProperDimensions = response.html.includes("300x200");

      console.log("🎯 QUALITY CHECKS:");
      console.log(
        `✅ Microsoft Learn blue theme (#0078d4): ${
          hasMSLearnBlue ? "PASS ✓" : "FAIL ✗"
        }`
      );
      console.log(
        `✅ Neutral fallback colors (#f3f2f1): ${
          hasNeutralColors ? "PASS ✓" : "FAIL ✗"
        }`
      );
      console.log(
        `✅ Proper image dimensions: ${
          hasProperDimensions ? "PASS ✓" : "FAIL ✗"
        }`
      );
      console.log(
        `✅ Error handling implemented: ${
          onerrorHandlers > 0 ? "PASS ✓" : "FAIL ✗"
        }`
      );
      console.log(
        `✅ No broken image references: ${
          brokenImages.length === 0 ? "PASS ✓" : "FAIL ✗"
        }\n`
      );

      // Sample processed image tags
      if (imgTags.length > 0) {
        console.log("📄 SAMPLE PROCESSED IMAGE TAGS:");
        imgTags.slice(0, 3).forEach((tag, index) => {
          console.log(`${index + 1}. ${tag}`);
        });
        console.log("");
      }

      // Final assessment
      const allChecks =
        hasMSLearnBlue &&
        hasNeutralColors &&
        hasProperDimensions &&
        onerrorHandlers > 0 &&
        placeholderUrls.length > 0 &&
        brokenImages.length === 0;

      console.log("🏆 FINAL ASSESSMENT:");
      if (allChecks) {
        console.log("🎉 SUCCESS: Images are being generated correctly!");
        console.log("✅ All image placeholders are working perfectly");
        console.log("✅ Microsoft Learn theming is applied");
        console.log("✅ No broken image icons will appear");
        console.log("✅ Error handling is implemented");
      } else {
        console.log("⚠️ ISSUES DETECTED:");
        if (placeholderUrls.length === 0)
          console.log("❌ No placeholder URLs generated");
        if (brokenImages.length > 0)
          console.log("❌ Broken image references still present");
        if (!hasMSLearnBlue) console.log("❌ Missing Microsoft Learn theming");
        if (onerrorHandlers === 0)
          console.log("❌ No error handling implemented");
      }
    } else {
      console.log("❌ No HTML content received");
    }
  } catch (parseError) {
    console.error("❌ Failed to parse response:", parseError.message);
    console.log("Raw response:", stdout.substring(0, 200) + "...");
  }
});
