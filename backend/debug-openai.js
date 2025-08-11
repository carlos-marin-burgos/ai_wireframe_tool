const { OpenAI } = require("openai");
require("dotenv").config();

console.log("Environment variables:");
console.log("AZURE_OPENAI_ENDPOINT:", process.env.AZURE_OPENAI_ENDPOINT);
console.log(
  "AZURE_OPENAI_KEY:",
  process.env.AZURE_OPENAI_KEY ? "SET" : "NOT SET"
);
console.log("AZURE_OPENAI_DEPLOYMENT:", process.env.AZURE_OPENAI_DEPLOYMENT);

if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
  const baseURL = `${endpoint}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`;
  console.log("Constructed baseURL:", baseURL);

  const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY,
    baseURL: baseURL,
    defaultQuery: { "api-version": "2024-02-15-preview" },
    defaultHeaders: {
      "api-key": process.env.AZURE_OPENAI_KEY,
    },
  });

  console.log("OpenAI client initialized successfully");
  console.log("Making test request...");

  openai.chat.completions
    .create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10,
    })
    .then((response) => {
      console.log("✅ Success! OpenAI is working");
    })
    .catch((error) => {
      console.log("❌ OpenAI Error:", error.message);
      if (error.cause) {
        console.log("❌ Cause:", error.cause.message);
      }
    });
} else {
  console.log("Missing environment variables");
}
