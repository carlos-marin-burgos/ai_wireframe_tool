/**
 * Minimal AI Wireframe Generator - Let AI be naturally intelligent
 */

const { OpenAI } = require("openai");

class MinimalWireframeGenerator {
  constructor() {
    require("dotenv").config();

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
    const apiVersion =
      process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

    this.openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });
  }

  async generateWireframe(description, colorScheme = "primary") {
    // Minimal, natural prompt - let AI be intelligent
    const prompt = `Create a modern, responsive HTML wireframe for: "${description}"

Requirements:
- Complete HTML document with inline CSS
- Professional, clean design
- Color scheme: ${colorScheme}
- Modern web design standards

Generate the complete HTML now:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a professional web designer. Create clean, modern HTML wireframes with inline CSS styling.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const htmlContent = response.choices[0]?.message?.content?.trim();

      if (!htmlContent) {
        throw new Error("No content generated");
      }

      return {
        html: htmlContent,
        source: "minimal-ai-generator",
        aiGenerated: true,
        unlimited: true,
        framework: "html",
        styling: "inline-css",
      };
    } catch (error) {
      console.error("Minimal wireframe generation failed:", error);
      throw error;
    }
  }
}

module.exports = { MinimalWireframeGenerator };
