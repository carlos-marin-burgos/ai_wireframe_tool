/**
 * Quick Wireframe Test for Atlas Components
 * Tests if wireframes now correctly use Atlas Hero and Module components
 */

const ComponentDrivenWireframeGenerator = require("./designetica-services/componentDrivenWireframeGenerator.js");
const FigmaService = require("./designetica-services/figmaService.js");

async function testWireframeAtlasComponents() {
  console.log("🧪 Quick Wireframe Atlas Components Test\n");

  try {
    // Initialize services
    const figmaService = new FigmaService();
    const wireframeGenerator = new ComponentDrivenWireframeGenerator();

    await wireframeGenerator.init();

    // Connect figma service to wireframe generator
    wireframeGenerator.figmaService = figmaService;

    console.log("🎨 Generating wireframe with hero and learning content...");

    // Generate a wireframe that should contain hero and learning components
    const wireframeResult = await wireframeGenerator.generateWireframe(
      "Create a learning platform homepage with a hero section, learning path cards, and module cards"
    );

    console.log("\n🔍 Analyzing generated wireframe:");

    // Check what Atlas components are in the wireframe
    const atlasComponents = {
      hero: (
        wireframeResult.html.match(/atlas-hero-figma|atlas-hero-fallback/g) ||
        []
      ).length,
      learningPath: (
        wireframeResult.html.match(/atlas-learning-path-card/g) || []
      ).length,
      module: (
        wireframeResult.html.match(/atlas-module-card|data-type="module"/g) ||
        []
      ).length,
    };

    console.log(`  Hero components: ${atlasComponents.hero}`);
    console.log(`  Learning Path components: ${atlasComponents.learningPath}`);
    console.log(`  Module components: ${atlasComponents.module}`);

    // Check for any generic/fallback components that should have been Atlas
    const genericHero = (wireframeResult.html.match(/class="hero"/g) || [])
      .length;
    const genericModule = (wireframeResult.html.match(/class="module"/g) || [])
      .length;

    console.log(`\n🔍 Checking for unreplaced components:`);
    console.log(`  Generic hero sections remaining: ${genericHero}`);
    console.log(`  Generic module sections remaining: ${genericModule}`);

    // Determine success
    const success =
      atlasComponents.hero > 0 &&
      (atlasComponents.learningPath > 0 || atlasComponents.module > 0) &&
      genericHero === 0;

    if (success) {
      console.log("\n✅ SUCCESS: Wireframe correctly uses Atlas components!");
    } else {
      console.log(
        "\n❌ ISSUE: Wireframe may not be using Atlas components correctly"
      );

      if (atlasComponents.hero === 0) {
        console.log("  - No Atlas hero components found");
      }
      if (atlasComponents.learningPath === 0 && atlasComponents.module === 0) {
        console.log("  - No Atlas learning/module components found");
      }
      if (genericHero > 0) {
        console.log("  - Found unreplaced generic hero sections");
      }
    }

    // Save a sample for inspection
    const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Wireframe Atlas Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .analysis { background: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; }
    </style>
</head>
<body>
    <h1>Wireframe Atlas Components Test Results</h1>
    
    <div class="analysis ${success ? "success" : "warning"}">
        <h3>Analysis Results</h3>
        <p><strong>Hero components:</strong> ${atlasComponents.hero}</p>
        <p><strong>Learning Path components:</strong> ${
          atlasComponents.learningPath
        }</p>
        <p><strong>Module components:</strong> ${atlasComponents.module}</p>
        <p><strong>Status:</strong> ${
          success ? "✅ SUCCESS" : "❌ NEEDS ATTENTION"
        }</p>
    </div>

    <div style="margin-top: 30px;">
        <h3>Generated Wireframe:</h3>
        ${wireframeResult.html}
    </div>
</body>
</html>
    `;

    require("fs").writeFileSync(
      "wireframe-atlas-test-results.html",
      sampleHtml
    );
    console.log(
      `\n💾 Test results saved to: wireframe-atlas-test-results.html`
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
if (require.main === module) {
  testWireframeAtlasComponents()
    .then(() => {
      console.log("\n✨ Wireframe test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Wireframe test failed:", error);
      process.exit(1);
    });
}

module.exports = { testWireframeAtlasComponents };
