/**
 * Clean AI Wireframe Generator - Zero Microsoft Learn Branding
 * Generates clean HTML wireframes without any corporate branding
 */

const { OpenAI } = require("openai");

class CleanWireframeGenerator {
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

  async generateCleanWireframe(description, colorScheme = "primary") {
    // Clean the description to remove any Microsoft references
    const cleanDescription = this.sanitizeDescription(description);

    const systemPrompt = `You are a web designer creating clean, modern UI wireframes. 

ABSOLUTE RULES - STRICTLY ENFORCED:
- Create ONLY what is described in the user request
- NEVER add Microsoft, Microsoft Learn, or ANY corporate branding
- PROHIBITED: "Learn", "Learning Path", "Certification", "Module", "Azure", "Microsoft"
- PROHIBITED: Any educational platform terminology or branding
- NO navigation bars, headers, or footers unless specifically requested
- Use generic terms like "Platform", "Portal", "Hub", "App", "Dashboard"
- Generate complete HTML with comprehensive inline CSS styling
- Make components visually appealing with modern design
- Focus purely on functionality, not branding
- If you detect any educational/learning context, convert to generic business terms`;

    const userPrompt = `Create a clean, styled HTML wireframe for: "${cleanDescription}"

CRITICAL REQUIREMENTS:
- Complete HTML document with inline CSS
- Modern, clean design with proper styling
- Responsive layout using flexbox/grid
- Professional appearance with colors, shadows, spacing
- Color scheme: ${colorScheme}
- ABSOLUTELY NO branding, logos, or company-specific content
- ABSOLUTELY NO educational, learning, or certification terminology
- Generic placeholder text and labels only
- Focus only on the requested functionality
- Convert any learning/educational concepts to generic business concepts

Structure:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireframe</title>
    <style>
        /* Comprehensive CSS styles here */
    </style>
</head>
<body>
    <!-- Clean HTML content here -->
</body>
</html>`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 3500,
        temperature: 0.3, // Lower temperature for more consistent output
      });

      const htmlContent = response.choices[0]?.message?.content?.trim();

      if (!htmlContent) {
        throw new Error("No content generated");
      }

      // Double-check for Microsoft references and clean them
      const finalHtml = this.sanitizeOutput(htmlContent);

      return {
        html: finalHtml,
        source: "clean-ai-generator",
        aiGenerated: true,
        unlimited: true,
        framework: "html",
        styling: "inline-css",
      };
    } catch (error) {
      console.error("Clean wireframe generation failed:", error);
      throw error;
    }
  }

  // Sanitize the input description to remove Microsoft references
  sanitizeDescription(description) {
    return description
      .replace(/microsoft learn/gi, "learning platform")
      .replace(/microsoft/gi, "platform")
      .replace(/learn\.microsoft\.com/gi, "learning portal")
      .replace(/ms learn/gi, "learning platform")
      .replace(/azure learn/gi, "cloud learning")
      .trim();
  }

  // Sanitize the output HTML to ensure no Microsoft branding slipped through
  sanitizeOutput(html) {
    return html
      .replace(/Microsoft Learn/g, "Learning Platform")
      .replace(/Microsoft/g, "Platform")
      .replace(/learn\.microsoft\.com/g, "learning-portal.com")
      .replace(/MS Learn/g, "Learning Platform")
      .replace(/Azure Learn/g, "Cloud Learning");
  }
}

module.exports = { CleanWireframeGenerator };
