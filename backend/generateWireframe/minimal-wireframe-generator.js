/**
 * Minimal AI Wireframe Generator - Let AI be naturally intelligent
 */

const { OpenAI } = require("openai");
// Import centralized color configuration
const { WIREFRAME_COLORS, ColorUtils } = require("../config/colors");

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
    // Get centralized colors for the prompt
    const colors = WIREFRAME_COLORS;
    const colorPalette = `Primary: ${colors.primary}, Secondary: ${colors.secondary}, Dark: ${colors.dark}, Light: ${colors.light}, Subtle: ${colors.medium}`;

    // Minimal, natural prompt - let AI be intelligent with our neutral color palette
    const prompt = `Create a modern, responsive HTML wireframe for: "${description}"

Requirements:
- Complete HTML document with inline CSS
- Professional, clean design using neutral color palette
- Use these neutral colors: ${colorPalette}
- Avoid Microsoft branded colors (#6c757d, #5a6268, #f8f9fa, #212529, #dee2e6)
- Modern web design standards with professional aesthetic

Generate the complete HTML now:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a professional web designer specializing in neutral, modern wireframe aesthetics. Create clean HTML wireframes using the neutral color palette: Primary #8E9AAF, Secondary #68769C, Dark #3C4858, Light #E9ECEF, Subtle #CBC2C2. Avoid Microsoft branded colors like #6c757d, #5a6268, #f8f9fa, #212529, #dee2e6.",
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
