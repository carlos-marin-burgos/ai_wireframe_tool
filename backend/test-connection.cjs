const { OpenAI } = require("openai");

async function testAzureOpenAI() {
  console.log("🔧 Testing Azure OpenAI connection...");

  // Configuration from your local.settings.json
  const endpoint = "https://cog-designetica-vdlmicyosd4ua.openai.azure.com/";
  const apiKey =
    "CnGZHVd6QVM4mHigBcWm7tQ2yqoGIHiImCozLODvVXBAG2QVUWp1JQQJ99BHACYeBjFXJ3w3AAABACOGFPTI";
  const deployment = "gpt-4o";

  // Try different API versions
  const apiVersions = [
    "2024-08-01-preview",
    "2024-06-01",
    "2024-05-01-preview",
    "2024-02-15-preview",
    "2023-12-01-preview",
  ];

  for (const apiVersion of apiVersions) {
    try {
      console.log(`\n🧪 Testing API version: ${apiVersion}`);

      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: `${endpoint}openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: {
          "api-key": apiKey,
        },
      });

      const response = await openai.chat.completions.create({
        model: deployment,
        messages: [
          {
            role: "user",
            content:
              "Hello! Just testing the connection. Reply with 'Connection successful!'",
          },
        ],
        max_tokens: 50,
        temperature: 0,
      });

      console.log(`✅ SUCCESS with API version ${apiVersion}!`);
      console.log(`📝 Response: ${response.choices[0].message.content}`);
      console.log(`🎯 Model used: ${response.model}`);
      console.log(`📊 Tokens used: ${response.usage.total_tokens}`);

      return apiVersion; // Return the working version
    } catch (error) {
      console.log(`❌ FAILED with API version ${apiVersion}: ${error.message}`);
    }
  }

  console.log("\n❌ All API versions failed!");
  return null;
}

testAzureOpenAI()
  .then((workingVersion) => {
    if (workingVersion) {
      console.log(`\n🎉 Working API version found: ${workingVersion}`);
      console.log(`\n📝 Update your local.settings.json with:`);
      console.log(`"AZURE_OPENAI_API_VERSION": "${workingVersion}"`);
    }
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
  });
