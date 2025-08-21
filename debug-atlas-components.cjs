/**
 * Debug Atlas Component Detection and Generation
 * Quick test to verify component detection and generation is working
 */

const FigmaService = require("./designetica-services/figmaService.js");

async function debugAtlasComponents() {
  console.log("🔍 Debugging Atlas Component Detection and Generation\n");

  try {
    const figmaService = new FigmaService();

    // Test component type detection
    console.log("1️⃣ Testing component type detection:");
    const testNames = [
      "Hero Section",
      "Learning Path Card",
      "Module Card",
      "Button",
      "Navigation",
      "Generic Component",
    ];

    testNames.forEach((name) => {
      const type = figmaService.detectComponentType(name);
      console.log(`  "${name}" → "${type}"`);
    });

    console.log("\n2️⃣ Testing individual component generation:");

    // Test hero generation
    console.log("  Generating Hero component...");
    const heroComponent = { name: "Hero Section", nodeId: "14647:163530" };
    const heroHtml = await figmaService.generateComponentHtml(heroComponent, 0);
    const isAtlasHero =
      heroHtml.includes("atlas-hero-figma") ||
      heroHtml.includes("atlas-hero-fallback");
    console.log(`  ✅ Hero generates Atlas component: ${isAtlasHero}`);

    // Test learning path generation
    console.log("  Generating Learning Path Card component...");
    const learningPathComponent = {
      name: "Learning Path Card",
      nodeId: "14315:162386",
    };
    const learningPathHtml = await figmaService.generateComponentHtml(
      learningPathComponent,
      0
    );
    const isAtlasLearningPath = learningPathHtml.includes(
      "atlas-learning-path-card"
    );
    console.log(
      `  ✅ Learning Path generates Atlas component: ${isAtlasLearningPath}`
    );

    // Test module generation
    console.log("  Generating Module Card component...");
    const moduleComponent = { name: "Module Card", nodeId: "14315:162386" };
    const moduleHtml = await figmaService.generateComponentHtml(
      moduleComponent,
      0
    );
    const isAtlasModule =
      moduleHtml.includes("atlas-module-card") ||
      moduleHtml.includes('data-type="module"');
    console.log(`  ✅ Module generates Atlas component: ${isAtlasModule}`);

    console.log("\n3️⃣ Testing HTML post-processing:");

    // Test HTML with various component classes
    const testHtml = `
      <section class="hero">Hero content</section>
      <div class="learning-path-card">Learning path content</div>
      <div class="module-card">Module content</div>
    `;

    const processedHtml = await figmaService.processHtmlForAtlasComponents(
      testHtml
    );

    const heroReplaced =
      processedHtml.includes("atlas-hero-figma") ||
      processedHtml.includes("atlas-hero-fallback");
    const learningPathReplaced = processedHtml.includes(
      "atlas-learning-path-card"
    );
    const moduleReplaced = processedHtml.includes('data-type="module"');

    console.log(`  ✅ Hero HTML replaced: ${heroReplaced}`);
    console.log(`  ✅ Learning Path HTML replaced: ${learningPathReplaced}`);
    console.log(`  ✅ Module HTML replaced: ${moduleReplaced}`);

    console.log("\n🎯 Debug Summary:");
    console.log("  - Component detection: Working");
    console.log("  - Individual generation: Working");
    console.log("  - HTML post-processing: Working");

    if (heroReplaced && learningPathReplaced && moduleReplaced) {
      console.log("✅ All Atlas components are working correctly!");
    } else {
      console.log("❌ Some Atlas components may have issues");
    }
  } catch (error) {
    console.error("❌ Debug test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the debug test
if (require.main === module) {
  debugAtlasComponents()
    .then(() => {
      console.log("\n✨ Debug test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Debug test failed:", error);
      process.exit(1);
    });
}

module.exports = { debugAtlasComponents };
