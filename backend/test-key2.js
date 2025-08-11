const { OpenAI } = require("openai");

// Test with key2
const endpoint = "https://cog-designetica-vdlmicyosd4ua.openai.azure.com/";
const deployment = "gpt-4o";
const apiVersion = "2024-08-01-preview";
const apiKey2 = "4IJwBriQOLsKJrCoOnJ3vAk7dOhxatG7qJgBbD1XgMPGjjpcpDN5JQQJ99BHACYeBjFXJ3w3AAABACOG4h4n";

const openai = new OpenAI({
  apiKey: apiKey2,
  baseURL: `${endpoint}/openai/deployments/${deployment}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: {
    "api-key": apiKey2,
  },
});

async function testApiKey() {
  try {
    console.log("�� Testing key2...");
    const response = await openai.chat.completions.create({
      model: deployment,
      messages: [{ role: "user", content: "Hello, test message" }],
      max_tokens: 10
    });
    console.log("✅ Key2 works! Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Key2 failed:", error.message);
  }
}

testApiKey();
