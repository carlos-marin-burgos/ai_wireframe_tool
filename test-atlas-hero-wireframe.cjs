/**
 * Test Atlas Hero Integration in Wireframes
 * Tests the new functionality that replaces class="hero" sections with Atlas Hero components
 */

const FigmaService = require("./designetica-services/figmaService.js");
const ComponentDrivenWireframeGenerator = require("./designetica-services/componentDrivenWireframeGenerator.js");

async function testAtlasHeroIntegration() {
  console.log("🧪 Testing Atlas Hero Integration in Wireframes\n");

  try {
    // Initialize services
    const figmaService = new FigmaService();
    const wireframeGenerator = new ComponentDrivenWireframeGenerator();

    await wireframeGenerator.init();

    // Connect figma service to wireframe generator
    wireframeGenerator.figmaService = figmaService;

    console.log("1️⃣ Testing HTML processing for hero sections...");

    // Test 1: Basic hero section replacement
    const testHtml = `
      <div class="container">
        <section class="hero">
          <h1>Generic Hero Title</h1>
          <p>This should be replaced with Atlas Hero</p>
        </section>
        <div class="content">
          <p>Other content should remain unchanged</p>
        </div>
      </div>
    `;

    const processedHtml = await figmaService.processHtmlForAtlasComponents(
      testHtml
    );

    if (
      processedHtml.includes("atlas-hero-figma") ||
      processedHtml.includes("atlas-hero-fallback")
    ) {
      console.log("✅ Hero section successfully replaced with Atlas component");
    } else {
      console.log("❌ Hero section was not replaced");
      console.log(
        "Processed HTML preview:",
        processedHtml.substring(0, 200) + "..."
      );
    }

    console.log("\n2️⃣ Testing wireframe generation with hero section...");

    // Test 2: Generate a wireframe that includes a hero
    const wireframeResult = await wireframeGenerator.generateWireframe(
      "Create a landing page with a hero section and navigation"
    );

    if (
      wireframeResult.html.includes("atlas-hero-figma") ||
      wireframeResult.html.includes("atlas-hero-fallback")
    ) {
      console.log("✅ Wireframe generation successfully integrated Atlas hero");
    } else {
      console.log("❌ Wireframe generation did not include Atlas hero");

      // Check if there are any hero classes in the output
      if (wireframeResult.html.includes('class="hero"')) {
        console.log("🔍 Found unreplaced hero sections in wireframe");
      }
    }

    console.log("\n3️⃣ Testing multiple hero patterns...");

    // Test 3: Multiple hero patterns
    const multiHeroHtml = `
      <header class="hero-banner">Header Hero</header>
      <section class="main-hero">Main Hero</section>
      <div class="hero-section">Div Hero</div>
    `;

    const multiProcessed = await figmaService.processHtmlForAtlasComponents(
      multiHeroHtml
    );
    const atlasMatches = (multiProcessed.match(/atlas-hero/g) || []).length;

    console.log(
      `✅ Processed ${atlasMatches} hero sections with Atlas components`
    );

    console.log("\n🎉 Atlas Hero Integration Test Complete!");

    // Save a sample output for inspection
    const sampleOutput = `
<!DOCTYPE html>
<html>
<head>
    <title>Atlas Hero Test Output</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Atlas Hero Integration Test Results</h1>
    
    <div class="test-section">
        <h2>Processed HTML Test</h2>
        ${processedHtml}
    </div>
    
    <div class="test-section">
        <h2>Generated Wireframe Test</h2>
        ${wireframeResult.html}
    </div>
</body>
</html>
    `;

    require("fs").writeFileSync("atlas-hero-test-output.html", sampleOutput);
    console.log("\n💾 Test output saved to: atlas-hero-test-output.html");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
if (require.main === module) {
  testAtlasHeroIntegration()
    .then(() => {
      console.log("\n✨ Test execution completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Test execution failed:", error);
      process.exit(1);
    });
}

module.exports = { testAtlasHeroIntegration };
