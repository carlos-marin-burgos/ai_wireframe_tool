const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const FigmaService = require(path.join(
  __dirname,
  "..",
  "designetica-services",
  "figmaService.js"
));

async function testAtlasHeroFetch() {
  try {
    console.log("🔄 Testing Atlas Hero fetch from Figma...");
    console.log(
      "FIGMA_ACCESS_TOKEN:",
      process.env.FIGMA_ACCESS_TOKEN ? "Configured" : "Missing"
    );

    const figmaService = new FigmaService();
    const nodeId = "14647:163530";

    console.log(`🔍 Fetching Atlas Hero component with node ID: ${nodeId}`);
    const heroHTML = await figmaService.generateAtlasHeroFromFigma(nodeId);

    console.log("✅ Successfully fetched Atlas Hero component");
    console.log("📏 HTML length:", heroHTML.length);
    console.log("🔍 HTML preview:", heroHTML.substring(0, 200) + "...");

    return heroHTML;
  } catch (error) {
    console.error("❌ Error testing Atlas Hero fetch:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
}

// Run the test
testAtlasHeroFetch()
  .then(() => {
    console.log("🎉 Test completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test failed:", error.message);
    process.exit(1);
  });
