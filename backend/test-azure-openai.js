const { OpenAI } = require("openai");
require("dotenv").config();

// Load environment variables from local.settings.json if needed
const fs = require("fs");
const path = require("path");

// Load local.settings.json
try {
  const localSettingsPath = path.join(__dirname, "local.settings.json");
  const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, "utf8"));

  // Set environment variables
  Object.keys(localSettings.Values).forEach((key) => {
    if (!process.env[key]) {
      process.env[key] = localSettings.Values[key];
    }
  });

  console.log("📁 Loaded local.settings.json");
} catch (error) {
  console.error("❌ Failed to load local.settings.json:", error.message);
}

async function testAzureOpenAI() {
  console.log("\n🔍 Testing Azure OpenAI Configuration");
  console.log("=====================================");

  // Check environment variables
  console.log("\n📋 Environment Variables:");
  console.log(
    "AZURE_OPENAI_KEY:",
    process.env.AZURE_OPENAI_KEY
      ? `${process.env.AZURE_OPENAI_KEY.substring(0, 10)}...`
      : "NOT SET"
  );
  console.log(
    "AZURE_OPENAI_ENDPOINT:",
    process.env.AZURE_OPENAI_ENDPOINT || "NOT SET"
  );
  console.log(
    "AZURE_OPENAI_DEPLOYMENT:",
    process.env.AZURE_OPENAI_DEPLOYMENT || "NOT SET"
  );
  console.log(
    "AZURE_OPENAI_API_VERSION:",
    process.env.AZURE_OPENAI_API_VERSION || "NOT SET"
  );

  if (!process.env.AZURE_OPENAI_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
    console.error("❌ Missing required environment variables");
    return;
  }

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
    const apiVersion =
      process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

    console.log("\n🔧 OpenAI Client Configuration:");
    console.log("Base URL:", `${endpoint}/openai/deployments/${deployment}`);
    console.log("API Version:", apiVersion);

    const openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });

    console.log("\n🧪 Testing Simple Completion...");

    const response = await openai.chat.completions.create({
      model: deployment,
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 50,
      temperature: 0.1,
    });

    console.log("✅ Success! Response:", response.choices[0]?.message?.content);
  } catch (error) {
    console.error("❌ Azure OpenAI Error:");
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Message:", error.message);

    if (error.status === 401) {
      console.error("\n💡 401 Error Troubleshooting:");
      console.error("1. Check if the API key is correct and not expired");
      console.error("2. Verify the endpoint URL is correct");
      console.error("3. Ensure the deployment name exists in Azure OpenAI");
      console.error("4. Check if the resource is active and not suspended");
    }
  }
}

testAzureOpenAI().catch(console.error);
