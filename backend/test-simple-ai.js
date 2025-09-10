// Simple test for Pure AI system
const {
  generateWireframeFromDescription,
} = require("./generateWireframe/index-pure-ai.js");

async function testPureAI() {
  console.log("🚀 Testing Pure AI System");

  try {
    const result = await generateWireframeFromDescription(
      "left navigation sidebar with user dashboard",
      "primary",
      "test-123"
    );

    console.log("✅ SUCCESS!");
    console.log("📊 Source:", result.source);
    console.log("🤖 AI Generated:", result.aiGenerated);
    console.log("📏 HTML Length:", result.html.length);
    console.log("🎯 Has React Code:", !!result.reactCode);
  } catch (error) {
    console.log("❌ ERROR:", error.message);
  }
}

testPureAI();
