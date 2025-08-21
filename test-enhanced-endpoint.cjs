const fetch = require("node-fetch");

async function testEnhancedEndpoint() {
  console.log("🧪 Testing Enhanced Wireframe Endpoint...\n");

  try {
    const response = await fetch(
      "http://localhost:7072/api/generate-wireframe-enhanced",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description:
            "Create a learning platform homepage with hero section, learning path cards, and module cards",
          theme: "microsoftlearn",
          colorScheme: "primary",
        }),
      }
    );

    console.log("📡 Response Status:", response.status);
    console.log("📡 Response Headers:", [...response.headers.entries()]);

    if (response.ok) {
      const data = await response.json();
      console.log("\n✅ SUCCESS! Enhanced endpoint working");
      console.log("📊 Response Data:");
      console.log("  - Source:", data.source);
      console.log("  - AI Generated:", data.aiGenerated);
      console.log("  - Processing Time:", data.processingTimeMs + "ms");
      console.log("  - HTML Length:", data.html?.length || 0);
      console.log("  - Atlas Components:", data.atlasComponents);

      // Check for Atlas components
      if (data.html) {
        const hasHero = data.html.includes("atlas-hero-figma");
        const hasModules = data.html.includes("atlas-module-card-figma");
        const hasLearningPaths = data.html.includes(
          "atlas-learning-path-card-figma"
        );

        console.log("\n🎨 Atlas Component Detection:");
        console.log("  - Hero Component:", hasHero ? "✅" : "❌");
        console.log("  - Module Components:", hasModules ? "✅" : "❌");
        console.log(
          "  - Learning Path Components:",
          hasLearningPaths ? "✅" : "❌"
        );

        if (hasHero && hasModules && hasLearningPaths) {
          console.log(
            "\n🎉 ALL ATLAS COMPONENTS DETECTED! The enhanced endpoint is working correctly."
          );
        } else {
          console.log(
            "\n⚠️ Some Atlas components missing - may need debugging."
          );
        }
      }
    } else {
      const errorText = await response.text();
      console.log("\n❌ ERROR Response:");
      console.log(errorText);
    }
  } catch (error) {
    console.error("\n❌ Network Error:", error.message);
    console.log("\nThis likely means:");
    console.log("1. Backend is not running on port 7072");
    console.log("2. The generateWireframeEnhanced function is not deployed");
    console.log("3. Function.json configuration issue");
  }
}

testEnhancedEndpoint();
