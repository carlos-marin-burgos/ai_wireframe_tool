#!/usr/bin/env node

/**
 * 🧪 TEST DUAL RESOURCES
 * Tests both OpenAI resources to verify they're working
 */

const { OpenAI } = require("openai");

// Load environment variables
require("dotenv").config();

async function testResource(name, apiKey, endpoint) {
  console.log(`\n🧪 Testing ${name}...`);
  console.log(`Endpoint: ${endpoint}`);

  try {
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: `${endpoint}/openai/deployments/gpt-4o`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: { "api-key": apiKey },
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: "Say 'Hello from dual resource test!'" },
      ],
      max_tokens: 20,
    });

    console.log(`✅ ${name} WORKING!`);
    console.log(`Response: ${response.choices[0].message.content}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} FAILED!`);
    console.log(`Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("🔄 DUAL RESOURCE TEST");
  console.log("====================");

  // Test primary resource
  const primaryKey = process.env.AZURE_OPENAI_KEY || "MISSING";
  const primaryEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "MISSING";

  // Test secondary resource
  const secondaryKey = process.env.AZURE_OPENAI_SECONDARY_KEY || "MISSING";
  const secondaryEndpoint =
    process.env.AZURE_OPENAI_SECONDARY_ENDPOINT ||
    "https://cog-production-txknroiw7uvto.openai.azure.com/";

  console.log(`Primary Key: ${primaryKey.substring(0, 10)}...`);
  console.log(`Secondary Key: ${secondaryKey.substring(0, 10)}...`);

  const results = await Promise.allSettled([
    testResource("PRIMARY (cog-designetica)", primaryKey, primaryEndpoint),
    testResource("SECONDARY (cog-production)", secondaryKey, secondaryEndpoint),
  ]);

  console.log("\n📊 RESULTS:");
  console.log("===========");

  const primaryWorking = results[0].status === "fulfilled" && results[0].value;
  const secondaryWorking =
    results[1].status === "fulfilled" && results[1].value;

  if (primaryWorking && secondaryWorking) {
    console.log("🎉 BOTH RESOURCES WORKING!");
    console.log("✅ Dual resource system ready!");
    console.log("✅ You now have DOUBLE quota capacity!");
    console.log("✅ Rate limits will be automatically handled!");
  } else if (primaryWorking) {
    console.log("⚠️  Only primary resource working");
    console.log("   Check secondary resource configuration");
  } else if (secondaryWorking) {
    console.log("⚠️  Only secondary resource working");
    console.log("   Check primary resource configuration");
  } else {
    console.log("❌ Neither resource working");
    console.log("   Check API keys and endpoints");
  }
}

main().catch(console.error);
