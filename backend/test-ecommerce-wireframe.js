#!/usr/bin/env node

// Comprehensive test for e-commerce wireframe with image placeholders
console.log(
  "🛒 Testing E-commerce Wireframe Generation with Image Placeholders\n"
);

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
      // Extract image placeholders
      const placeholderUrls =
        response.html.match(/https:\/\/via\.placeholder\.com\/[^"']*/g) || [];
      const onerrorHandlers = (response.html.match(/onerror=/g) || []).length;
      const imgTags = response.html.match(/<img[^>]*>/g) || [];

      console.log("🖼️ Image Analysis:");
      console.log(`📸 Total image tags: ${imgTags.length}`);
      console.log(`🔗 Placeholder URLs generated: ${placeholderUrls.length}`);
      console.log(`🛡️ Error handlers added: ${onerrorHandlers}\n`);

      console.log("🎨 Generated Placeholder URLs:");
      placeholderUrls.slice(0, 10).forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
      });

      if (placeholderUrls.length > 10) {
        console.log(`... and ${placeholderUrls.length - 10} more\n`);
      } else {
        console.log("");
      }

      // Analyze placeholder types
      const productImages = placeholderUrls.filter((url) =>
        url.includes("product")
      ).length;
      const galleryImages = placeholderUrls.filter((url) =>
        url.includes("gallery")
      ).length;
      const reviewImages = placeholderUrls.filter((url) =>
        url.includes("review")
      ).length;
      const logoImages = placeholderUrls.filter((url) =>
        url.includes("logo")
      ).length;

      console.log("📊 Image Type Analysis:");
      console.log(`🛍️ Product images: ${productImages}`);
      console.log(`🖼️ Gallery images: ${galleryImages}`);
      console.log(`⭐ Review images: ${reviewImages}`);
      console.log(`🏷️ Logo images: ${logoImages}\n`);

      // Check for Microsoft Learn theming
      const hasMSLearnBlue = response.html.includes("0078d4");
      const hasNeutralColors = response.html.includes("f3f2f1");
      const hasProperDimensions = response.html.includes("300x200");

      console.log("🎯 Quality Verification:");
      console.log(
        `✅ Microsoft Learn blue theme (#0078d4): ${
          hasMSLearnBlue ? "PASS" : "FAIL"
        }`
      );
      console.log(
        `✅ Neutral fallback colors (#f3f2f1): ${
          hasNeutralColors ? "PASS" : "FAIL"
        }`
      );
      console.log(
        `✅ Proper image dimensions: ${hasProperDimensions ? "PASS" : "FAIL"}`
      );
      console.log(
        `✅ Error handling implemented: ${
          onerrorHandlers > 0 ? "PASS" : "FAIL"
        }\n`
      );

      // Sample image tags
      console.log("📄 Sample processed image tags:");
      imgTags.slice(0, 3).forEach((tag, index) => {
        console.log(`${index + 1}. ${tag}`);
      });

      console.log("\n🎉 E-commerce Wireframe Test Results:");
      const allChecks =
        hasMSLearnBlue &&
        hasNeutralColors &&
        hasProperDimensions &&
        onerrorHandlers > 0 &&
        placeholderUrls.length > 0;
      console.log(
        `🏆 Overall Status: ${allChecks ? "✅ PERFECT" : "⚠️ NEEDS ATTENTION"}`
      );

      if (allChecks) {
        console.log(
          "🎊 All image placeholder functionality is working correctly!"
        );
        console.log(
          "🛒 E-commerce wireframes will now show beautiful placeholders instead of broken images."
        );
      }
    } else {
      console.log("❌ No HTML content received");
    }
  } catch (parseError) {
    console.error("❌ Failed to parse response:", parseError.message);
    console.log("Raw response:", stdout.substring(0, 200) + "...");
  }
});
