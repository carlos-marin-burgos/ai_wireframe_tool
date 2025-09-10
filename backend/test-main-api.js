// Test the main wireframe API endpoint to ensure Pure AI integration
require("dotenv").config();

const {
  generateWireframeFromDescription,
} = require("./generateWireframe/index.js");

async function testMainAPI() {
  console.log("🔥 Testing MAIN WIREFRAME API with Pure AI Integration\n");

  const testCases = [
    {
      name: "🎯 Original Problem Test",
      description: "ecommerce dashboard with product grid",
      expected:
        "Should NOT show 'Ecommerce Dashboard Grid Wireframe' generic title",
    },
    {
      name: "🚀 Unlimited Test 1",
      description:
        "cryptocurrency trading platform with live price charts and portfolio tracking",
    },
    {
      name: "🚀 Unlimited Test 2",
      description:
        "recipe sharing social network with ingredient matching and cooking timers",
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}`);
      console.log(`📝 Description: "${testCase.description}"`);
      if (testCase.expected) {
        console.log(`🎯 Expected: ${testCase.expected}`);
      }

      const result = await generateWireframeFromDescription(
        testCase.description,
        "primary",
        `test-main-${Date.now()}`
      );

      console.log(`✅ Generated! Source: ${result.source}`);
      console.log(`🤖 AI Generated: ${result.aiGenerated}`);
      console.log(`📏 HTML Length: ${result.html.length}`);

      if (result.reactCode) {
        console.log(`⚛️ React Code: ${result.reactCode.length} chars`);

        // Check for component name
        const componentMatch = result.reactCode.match(/const (\w+):/);
        if (componentMatch) {
          console.log(`🧩 Component Name: ${componentMatch[1]}`);
        }
      }

      if (result.unlimited) {
        console.log(`🔮 Unlimited Generation: ✅`);
      }

      // Check if it's using templates (old system)
      if (
        result.source.includes("template") ||
        result.source.includes("pattern")
      ) {
        console.log(`⚠️ WARNING: Still using old template system!`);
      } else if (result.source === "pure-ai") {
        console.log(`🎊 SUCCESS: Using Pure AI system!`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log(`\n🎉 Main API Integration Test Complete!`);
}

testMainAPI();
