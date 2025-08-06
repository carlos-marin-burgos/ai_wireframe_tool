#!/usr/bin/env node

// Quick OpenAI Debug Script (Backend)
// Tests Azure OpenAI connection using the same configuration as the wireframe function

console.log("🔍 Azure OpenAI Debug Script");
console.log("============================");

// Load environment variables the same way Azure Functions does
const fs = require("fs");
const path = require("path");

// Try to load local.settings.json
const settingsPath = path.join(__dirname, "local.settings.json");
console.log(`📁 Looking for settings at: ${settingsPath}`);

if (fs.existsSync(settingsPath)) {
  console.log("✅ Found local.settings.json");
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

  // Set environment variables from local.settings.json
  if (settings.Values) {
    Object.keys(settings.Values).forEach((key) => {
      process.env[key] = settings.Values[key];
    });
    console.log("✅ Loaded environment variables from local.settings.json");
  }
} else {
  console.log("❌ local.settings.json not found");
}

// Check environment variables
console.log("\n🔧 Environment Variables:");
console.log(
  `AZURE_OPENAI_ENDPOINT: ${
    process.env.AZURE_OPENAI_ENDPOINT ? "✅ SET" : "❌ MISSING"
  }`
);
console.log(
  `AZURE_OPENAI_KEY: ${process.env.AZURE_OPENAI_KEY ? "✅ SET" : "❌ MISSING"}`
);
console.log(
  `AZURE_OPENAI_DEPLOYMENT: ${
    process.env.AZURE_OPENAI_DEPLOYMENT ? "✅ SET" : "❌ MISSING"
  }`
);
console.log(
  `AZURE_OPENAI_API_VERSION: ${
    process.env.AZURE_OPENAI_API_VERSION ? "✅ SET" : "❌ MISSING"
  }`
);

if (process.env.AZURE_OPENAI_ENDPOINT) {
  console.log(`🔗 Endpoint: ${process.env.AZURE_OPENAI_ENDPOINT}`);
}
if (process.env.AZURE_OPENAI_DEPLOYMENT) {
  console.log(`🤖 Deployment: ${process.env.AZURE_OPENAI_DEPLOYMENT}`);
}

// Test OpenAI initialization
console.log("\n🤖 Testing OpenAI Client Initialization:");

async function testOpenAI() {
  try {
    const { OpenAI } = require("openai");

    console.log("✅ OpenAI package imported successfully");

    // Initialize the same way as the wireframe function
    const baseURL = `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`;
    console.log(`🔗 Base URL: ${baseURL}`);

    const openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: baseURL,
      defaultQuery: {
        "api-version":
          process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview",
      },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });

    console.log("✅ OpenAI client initialized");

    // Test a simple completion
    console.log("\n🧪 Testing OpenAI API call...");

    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Respond with exactly 'TEST_SUCCESS' if you receive this message.",
        },
        {
          role: "user",
          content: "Test connection",
        },
      ],
      max_tokens: 10,
    });

    console.log("✅ API call successful!");
    console.log(`Response: ${completion.choices[0]?.message?.content}`);
    console.log("🎉 OpenAI is working correctly!");
    console.log("🔧 The issue is NOT with OpenAI connection.");
  } catch (error) {
    console.error("❌ OpenAI test failed:");
    console.error(`Error: ${error.message}`);

    if (error.code) {
      console.error(`Error Code: ${error.code}`);
    }

    if (error.status) {
      console.error(`HTTP Status: ${error.status}`);
    }

    if (error.error) {
      console.error(`Details: ${JSON.stringify(error.error, null, 2)}`);
    }

    console.log("🔧 This might be why wireframe generation is failing!");
  }
}

testOpenAI();
