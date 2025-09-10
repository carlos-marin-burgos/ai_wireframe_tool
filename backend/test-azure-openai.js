const { OpenAI } = require("openai");
require("dotenv").config();

async function testAzureOpenAI() {
  try {
    console.log("Testing Azure OpenAI connection...");
    console.log("Endpoint:", process.env.AZURE_OPENAI_ENDPOINT);
    console.log("Deployment:", process.env.AZURE_OPENAI_DEPLOYMENT);

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
    const apiVersion =
      process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

    const openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });

    console.log("Making test request...");
    const response = await openai.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: "user",
          content: "Say 'Hello, Azure OpenAI is working!' and nothing else.",
        },
      ],
      max_tokens: 50,
      temperature: 0.1,
    });

    console.log("✅ SUCCESS:", response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("Full error:", error);
    return false;
  }
}

testAzureOpenAI();
