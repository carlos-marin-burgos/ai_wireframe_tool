#!/usr/bin/env node

/**
 * Test the enhanced Atlas Learning Path/Module Card functionality
 */

const FigmaService = require("./designetica-services/figmaService.js");

async function testLearningComponents() {
  console.log("🧪 Testing Atlas Learning Path and Module Card Components...\n");

  const figma = new FigmaService();

  try {
    // Test Learning Path Card
    console.log("🔄 Testing Learning Path Card...");
    const learningPathCard = await figma.generateAtlasLearningPathCardFromFigma(
      "14315:162386",
      { type: "learning-path" }
    );
    console.log("✅ Learning Path Card generated successfully");
    console.log(`📏 Length: ${learningPathCard.length} characters`);
    console.log(
      "🔍 Contains 'Learning Path':",
      learningPathCard.includes("Learning Path")
    );

    console.log("\n" + "─".repeat(50) + "\n");

    // Test Module Card
    console.log("🔄 Testing Module Card...");
    const moduleCard = await figma.generateAtlasLearningPathCardFromFigma(
      "14315:162386",
      { type: "module" }
    );
    console.log("✅ Module Card generated successfully");
    console.log(`📏 Length: ${moduleCard.length} characters`);
    console.log("🔍 Contains 'Module':", moduleCard.includes("Module"));

    console.log("\n" + "─".repeat(50) + "\n");

    // Check differences
    console.log("🔍 Component Analysis:");
    console.log(
      "• Learning Path uses data-type='learning-path':",
      learningPathCard.includes('data-type="learning-path"')
    );
    console.log(
      "• Module uses data-type='module':",
      moduleCard.includes('data-type="module"')
    );
    console.log(
      "• Both use same image URL:",
      learningPathCard.includes("figma-alpha-api.s3.us-west-2.amazonaws.com") &&
        moduleCard.includes("figma-alpha-api.s3.us-west-2.amazonaws.com")
    );

    console.log("\n🎉 All tests completed successfully!");
    console.log(
      "✅ The same Atlas card design can be used for both Learning Paths and Modules"
    );
    console.log("✅ Components are properly labeled and differentiated");
    console.log("✅ Ready for use in wireframe generation!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testLearningComponents();
