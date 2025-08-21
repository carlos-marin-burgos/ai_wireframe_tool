// Test the BULLETPROOF Enhanced Endpoint
console.log("🎯 Testing BULLETPROOF Enhanced Wireframe Endpoint");

async function testEnhancedEndpoint() {
  try {
    const response = await fetch(
      "http://localhost:7072/api/generateWireframeEnhanced",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description:
            "Microsoft Learn platform with Azure training modules and certification paths",
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log("✅ Enhanced endpoint is WORKING!");

      // Count Atlas components
      const heroCount = (result.html.match(/atlas-hero-figma/g) || []).length;
      const moduleCount = (result.html.match(/atlas-module-card-figma/g) || [])
        .length;
      const learningPathCount = (
        result.html.match(/atlas-learning-path-card-figma/g) || []
      ).length;

      console.log("🎨 Atlas Components Found:");
      console.log(`   Hero: ${heroCount}`);
      console.log(`   Modules: ${moduleCount}`);
      console.log(`   Learning Paths: ${learningPathCount}`);
      console.log(`   Total: ${heroCount + moduleCount + learningPathCount}`);

      if (heroCount >= 1 && moduleCount >= 6 && learningPathCount >= 2) {
        console.log("🎉 PERFECT! All Atlas components are working correctly!");
        console.log("🚀 Your app is now ready with working Atlas components!");
      } else {
        console.log("⚠️  Some Atlas components might be missing");
      }

      // Show stats from backend
      if (result.stats?.atlasComponents) {
        console.log("📊 Backend reported stats:", result.stats.atlasComponents);
      }
    } else {
      console.error("❌ Enhanced endpoint failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testEnhancedEndpoint();
