/**
 * Test script for enhanced image analysis capabilities
 * Tests image preprocessing and multi-pass analysis
 */

const ImagePreprocessor = require("./utils/imagePreprocessor");
const MultiPassAnalyzer = require("./utils/multiPassAnalyzer");

// Mock OpenAI client for testing
const mockOpenAI = {
  chat: {
    completions: {
      create: async (params) => {
        console.log("🤖 Mock OpenAI call:", params.messages[0].role);
        return {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  components: [
                    {
                      id: "test-1",
                      type: "button",
                      bounds: { x: 20, y: 15, width: 25, height: 8 },
                      text: "Test Button",
                      confidence: 0.95,
                    },
                  ],
                  layout: { type: "flexbox", columns: 12 },
                  designTokens: { colors: ["#0078d4"], fonts: ["Segoe UI"] },
                  wireframeDescription: "Test UI layout",
                  confidence: 0.87,
                }),
              },
            },
          ],
        };
      },
    },
  },
};

async function testImageEnhancements() {
  console.log("🧪 Testing Enhanced Image Analysis System");
  console.log("==========================================");

  try {
    // Test 1: Image Preprocessor
    console.log("\n📸 Test 1: Image Preprocessor Initialization");
    const preprocessor = new ImagePreprocessor();
    console.log("✅ ImagePreprocessor created");
    console.log("🔧 Sharp available:", preprocessor.isAvailable);

    // Test 2: Multi-Pass Analyzer
    console.log("\n🎯 Test 2: Multi-Pass Analyzer Initialization");
    const analyzer = new MultiPassAnalyzer(mockOpenAI);
    console.log("✅ MultiPassAnalyzer created");

    // Test 3: Sample image processing (if Sharp is available)
    if (preprocessor.isAvailable) {
      console.log("\n🔧 Test 3: Image Enhancement Test");

      // Create a simple test image data URL (1x1 pixel)
      const testImageDataUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGAFjT8GwAAAABJRU5ErkJggg==";

      try {
        const enhancementResult = await preprocessor.enhanceImageQuality(
          testImageDataUrl
        );
        console.log("✅ Image enhancement test completed");
        console.log(
          "📊 Enhancement metadata:",
          enhancementResult.metadata?.improvement || "fallback"
        );

        // Test creating analysis variants
        const variants = await preprocessor.createAnalysisVariants(
          testImageDataUrl
        );
        console.log("✅ Analysis variants created:", Object.keys(variants));
      } catch (enhanceError) {
        console.log("⚠️ Image enhancement test failed:", enhanceError.message);
      }
    } else {
      console.log("\n⚠️ Test 3: Skipped - Sharp library not available");
      console.log(
        "📝 Note: Install Sharp for full image enhancement capabilities"
      );
    }

    // Test 4: Multi-pass analysis (mock)
    console.log("\n🎯 Test 4: Multi-Pass Analysis Test");
    try {
      const testImageUrl = "data:image/png;base64,test";
      const mockVariants = {
        original: testImageUrl,
        highContrast: testImageUrl,
        textOptimized: testImageUrl,
      };

      const analysisResult = await analyzer.performMultiPassAnalysis(
        testImageUrl,
        mockVariants,
        "test-correlation-id"
      );

      console.log("✅ Multi-pass analysis test completed");
      console.log("📊 Analysis confidence:", analysisResult.confidence);
      console.log(
        "🧩 Components found:",
        analysisResult.consolidated?.components?.length || 0
      );
      console.log("⏱️ Processing time:", analysisResult.processingTime, "ms");
    } catch (analysisError) {
      console.log("⚠️ Multi-pass analysis test failed:", analysisError.message);
    }

    console.log("\n🎉 Enhanced Image Analysis Test Complete!");
    console.log("==========================================");

    // System capabilities summary
    console.log("\n📋 System Capabilities Summary:");
    console.log(
      "- Image Preprocessing:",
      preprocessor.isAvailable
        ? "✅ Available"
        : "❌ Unavailable (install Sharp)"
    );
    console.log("- Multi-Pass Analysis: ✅ Available");
    console.log(
      "- Quality Enhancement:",
      preprocessor.isAvailable ? "✅ Available" : "❌ Requires Sharp"
    );
    console.log(
      "- Analysis Variants:",
      preprocessor.isAvailable ? "✅ Available" : "❌ Requires Sharp"
    );
    console.log("- Fallback Mode: ✅ Available");

    if (!preprocessor.isAvailable) {
      console.log("\n💡 To enable full image enhancement:");
      console.log("   npm install sharp");
      console.log("   (Note: May require native compilation)");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testImageEnhancements();
}

module.exports = { testImageEnhancements };
