// Test Pure AI system with explicit environment loading
require("dotenv").config();

console.log("🔧 Environment Variables Check:");
console.log(
  "AZURE_OPENAI_KEY:",
  process.env.AZURE_OPENAI_KEY ? "✅ SET" : "❌ NOT SET"
);
console.log(
  "AZURE_OPENAI_ENDPOINT:",
  process.env.AZURE_OPENAI_ENDPOINT ? "✅ SET" : "❌ NOT SET"
);
console.log(
  "AZURE_OPENAI_DEPLOYMENT:",
  process.env.AZURE_OPENAI_DEPLOYMENT ? "✅ SET" : "❌ NOT SET"
);

if (!process.env.AZURE_OPENAI_KEY) {
  console.log("❌ Missing Azure OpenAI credentials. Check .env file.");
  process.exit(1);
}

const {
  generateWireframeFromDescription,
} = require("./generateWireframe/index-pure-ai.js");

async function testPureAI() {
  console.log("\n🚀 Testing Pure AI System");

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
    console.log("🔮 Unlimited:", result.unlimited);

    // Show first 200 chars of React code
    if (result.reactCode) {
      console.log(
        "⚛️ React Code Preview:",
        result.reactCode.substring(0, 200) + "..."
      );
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    console.log("Stack:", error.stack);
  }
}

testPureAI();
