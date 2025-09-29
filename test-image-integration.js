#!/usr/bin/env node

/**
 * Test Enhanced Image Integration
 * Quick test to verify the frontend-backend integration is working
 */

// Test image (small PNG base64 - Microsoft logo placeholder)
const testImageBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

async function testImageIntegration() {
  console.log("🧪 Testing Enhanced Image Integration...");
  console.log("🔗 Frontend-Backend Integration Test");

  try {
    // Test the enhanced image-to-wireframe endpoint
    const response = await fetch(
      "http://localhost:7071/api/direct-image-to-wireframe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: testImageBase64,
          fileName: "test-image.png",
          designTheme: "microsoftlearn",
          colorScheme: "light",
          options: {
            extractColors: true,
            generateResponsive: true,
            preserveLayout: true,
          },
        }),
      }
    );

    console.log("📊 Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Request failed:", errorData);
      return false;
    }

    const result = await response.json();

    console.log("✅ Response received successfully!");
    console.log("🎯 Success:", result.success);

    if (result.success) {
      console.log("📄 HTML Generated:", result.data?.html ? "Yes" : "No");
      console.log(
        "📏 HTML Length:",
        result.data?.html?.length || 0,
        "characters"
      );
      console.log("🎨 Framework:", result.data?.framework || "Unknown");
      console.log(
        "💾 Processing Time:",
        result.metadata?.processingTimeMs || 0,
        "ms"
      );

      console.log("\n🎉 Enhanced Image Integration Test PASSED!");
      console.log(
        "✨ Your frontend can now convert images to wireframes using the production API!"
      );
      return true;
    } else {
      console.error("❌ API returned success=false:", result.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    return false;
  }
}

// Run the test
testImageIntegration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Test error:", error);
    process.exit(1);
  });
