const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const FigmaService = require(path.join(
  __dirname,
  "..",
  "designetica-services",
  "figmaService.js"
));

async function fetchAndSaveAtlasHero() {
  try {
    console.log("🎨 Fetching real Atlas Hero component from Figma...");

    const figmaService = new FigmaService();
    const nodeId = "14647:163530";

    const heroHTML = await figmaService.generateAtlasHeroFromFigma(nodeId);

    // Save to a file for inspection
    const outputPath = path.join(__dirname, "atlas-hero-output.html");
    fs.writeFileSync(outputPath, heroHTML);

    console.log("✅ Successfully fetched and saved Atlas Hero component");
    console.log("📁 Saved to:", outputPath);
    console.log("📏 HTML length:", heroHTML.length);

    // Show if we got an image URL or fallback
    if (heroHTML.includes("https://figma-alpha-api.s3")) {
      console.log("🎯 SUCCESS: Got real Figma image URL!");
    } else {
      console.log("⚠️ Got fallback component (no image)");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fetchAndSaveAtlasHero();
