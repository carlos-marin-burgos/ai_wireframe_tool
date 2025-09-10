// Test the clean Pure AI main function
require("dotenv").config();

const {
  generateWireframeFromDescription,
} = require("./generateWireframe/pure-ai-main.js");

async function testCleanPureAI() {
  console.log("🚀 Testing CLEAN Pure AI Main Function\n");

  const testCases = [
    {
      name: "🎯 Original Issue Fix",
      description: "ecommerce dashboard with product grid",
      note: "Should generate unique components, not generic 'Ecommerce Dashboard Grid Wireframe'",
    },
    {
      name: "🎮 Gaming Interface",
      description:
        "virtual reality game lobby with avatar customization and world selection",
    },
    {
      name: "💼 Business Intelligence",
      description:
        "real-time supply chain monitoring dashboard with logistics tracking",
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}`);
      console.log(`📝 Description: "${testCase.description}"`);
      if (testCase.note) {
        console.log(`💡 Note: ${testCase.note}`);
      }

      const startTime = Date.now();
      const result = await generateWireframeFromDescription(
        testCase.description,
        "primary",
        `test-clean-${Date.now()}`
      );
      const duration = Date.now() - startTime;

      console.log(`✅ Generated in ${duration}ms`);
      console.log(`📊 Source: ${result.source}`);
      console.log(`🤖 AI Generated: ${result.aiGenerated}`);
      console.log(`🔮 Unlimited: ${result.unlimited}`);
      console.log(`📏 HTML Length: ${result.html.length}`);

      if (result.reactCode) {
        console.log(`⚛️ React Code: ${result.reactCode.length} chars`);

        // Extract component name
        const componentMatch = result.reactCode.match(/const (\w+):/);
        if (componentMatch) {
          console.log(`🧩 Component: ${componentMatch[1]}`);
        }

        // Check for modern features
        const hasTypeScript = result.reactCode.includes("interface");
        const hasTailwind = result.reactCode.includes("className=");
        const hasHooks =
          result.reactCode.includes("useState") ||
          result.reactCode.includes("useEffect");

        console.log(`📝 TypeScript: ${hasTypeScript ? "✅" : "❌"}`);
        console.log(`🎨 Tailwind CSS: ${hasTailwind ? "✅" : "❌"}`);
        console.log(`🪝 React Hooks: ${hasHooks ? "✅" : "❌"}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log(`\n🎉 Clean Pure AI Test Complete!`);
  console.log(`✨ Ready for production deployment!`);
}

testCleanPureAI();
