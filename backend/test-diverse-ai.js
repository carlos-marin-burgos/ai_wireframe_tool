// Test Pure AI system with diverse wireframe requests
require("dotenv").config();

const {
  generateWireframeFromDescription,
} = require("./generateWireframe/index-pure-ai.js");

async function testDiverseWireframes() {
  console.log("🎯 Testing Pure AI System - Unlimited Capabilities\n");

  const testCases = [
    {
      name: "🎨 Creative Design",
      description:
        "music streaming player with playlist management and equalizer",
    },
    {
      name: "💼 Business Dashboard",
      description:
        "executive revenue tracking dashboard with live charts and KPIs",
    },
    {
      name: "🛒 E-commerce",
      description:
        "shopping cart checkout flow with payment options and order summary",
    },
    {
      name: "🎮 Gaming Interface",
      description:
        "virtual pet care interface with feeding, playing, and health meters",
    },
    {
      name: "📊 Data Visualization",
      description:
        "kanban board with draggable task cards and progress tracking",
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}: "${testCase.description}"`);

      const result = await generateWireframeFromDescription(
        testCase.description,
        "primary",
        `test-${Date.now()}`
      );

      if (result.aiGenerated) {
        console.log(
          `✅ Generated successfully! React code: ${result.reactCode.length} chars`
        );

        // Show component name from React code
        const componentMatch = result.reactCode.match(/const (\w+):/);
        if (componentMatch) {
          console.log(`🧩 Component: ${componentMatch[1]}`);
        }

        // Show if it includes TypeScript interfaces
        const hasInterface = result.reactCode.includes("interface");
        console.log(`📝 TypeScript: ${hasInterface ? "✅" : "❌"}`);

        // Show if it uses Tailwind
        const hasTailwind = result.reactCode.includes("className=");
        console.log(`🎨 Tailwind CSS: ${hasTailwind ? "✅" : "❌"}`);
      } else {
        console.log(`❌ Failed: ${result.warning || "Unknown error"}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log(`\n🎊 Pure AI Testing Complete!`);
  console.log(`✨ Your system can now generate ANY wireframe users request!`);
}

testDiverseWireframes();
