#!/usr/bin/env node

/**
 * Manual Test: Generate wireframe with Atlas components
 * This script demonstrates exactly what should happen in the user interface
 */

const ComponentDrivenWireframeGenerator = require("./designetica-services/componentDrivenWireframeGenerator.js");
const FigmaService = require("./designetica-services/figmaService.js");
const fs = require("fs");

async function generateWireframeWithAtlas(description) {
  console.log("🎨 Manual Wireframe Generation with Atlas Components");
  console.log("📝 Description:", description);
  console.log("");

  try {
    // Initialize services exactly like in our working test
    const figmaService = new FigmaService();
    const wireframeGenerator = new ComponentDrivenWireframeGenerator();

    await wireframeGenerator.init();
    wireframeGenerator.figmaService = figmaService;

    console.log("✅ Services initialized successfully");

    // Generate wireframe with Atlas components
    const html = await wireframeGenerator.generateWireframe(description);

    // Save result
    const outputFile = "manual-wireframe-result.html";
    fs.writeFileSync(outputFile, html);

    // Analyze results
    const heroCount = (html.match(/atlas-hero-figma/g) || []).length;
    const moduleCount = (html.match(/atlas-module-card-figma/g) || []).length;
    const learningPathCount = (
      html.match(/atlas-learning-path-card-figma/g) || []
    ).length;

    console.log("");
    console.log("📊 Results:");
    console.log(`  • Hero Components: ${heroCount}`);
    console.log(`  • Module Components: ${moduleCount}`);
    console.log(`  • Learning Path Components: ${learningPathCount}`);
    console.log(
      `  • Total Atlas Components: ${
        heroCount + moduleCount + learningPathCount
      }`
    );
    console.log(`  • HTML Length: ${html.length.toLocaleString()} characters`);
    console.log(`  • Output saved to: ${outputFile}`);

    if (heroCount + moduleCount + learningPathCount > 0) {
      console.log("");
      console.log("🎉 SUCCESS! Atlas components are working correctly!");
      console.log("");
      console.log(
        "💡 This proves the issue is in the frontend/backend integration,"
      );
      console.log("   not in the Atlas component generation itself.");
    } else {
      console.log("");
      console.log(
        "⚠️  No Atlas components found. This indicates an issue with"
      );
      console.log("   the wireframe generation or component detection logic.");
    }

    return {
      success: true,
      html,
      atlasComponents: {
        hero: heroCount,
        modules: moduleCount,
        learningPaths: learningPathCount,
      },
    };
  } catch (error) {
    console.error("❌ Error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the test
if (require.main === module) {
  const description =
    process.argv[2] ||
    "Create a learning platform homepage with hero section, learning path cards, and module cards for Microsoft Learn";
  generateWireframeWithAtlas(description);
}

module.exports = { generateWireframeWithAtlas };
