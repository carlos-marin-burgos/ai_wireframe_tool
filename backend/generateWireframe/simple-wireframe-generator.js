/**
 * Simple Static HTML Wireframe Generator
 * No React, no Babel, no complexity - just clean HTML wireframes
 */

const { OpenAI } = require("openai");

class SimpleWireframeGenerator {
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

  async generateStaticWireframe(description, colorScheme = "primary") {
    const prompt = `Create a clean, static HTML wireframe for: "${description}"

CRITICAL REQUIREMENTS:
- Generate ONLY static HTML with EXTENSIVE inline CSS styling
- MUST include comprehensive CSS styles - no plain text elements
- ALL elements must be properly styled with colors, spacing, fonts, borders, shadows
- Create a visually appealing, professional-looking wireframe
- ABSOLUTELY NO Microsoft branding, logos, or navigation
- ABSOLUTELY NO "Microsoft Learn" text or branding of any kind
- NO navigation bars, NO headers, NO footers unless specifically requested in description
- Focus ONLY on the requested component/feature described
- Make it responsive and accessible
- Use placeholder content where needed
- Color scheme: ${colorScheme} (use appropriate colors)
- DO NOT add any corporate branding or navigation unless explicitly requested
- If this is about learning content, create GENERIC educational components without ANY specific branding
- IGNORE any mention of "Microsoft" in the description - create generic content instead
- Use generic terms like "Learning Platform", "Training Portal", "Education Hub" instead of any specific brand names
- NEVER include company names, logos, or branded navigation elements

STYLING REQUIREMENTS:
- Include modern CSS with flexbox/grid layouts
- Add proper spacing (padding, margins)
- Use shadows, borders, border-radius for visual appeal
- Apply appropriate colors based on the color scheme
- Style all buttons, forms, cards, and text elements
- Make it look like a real, polished UI component
- NO unstyled HTML - everything must have CSS

STRUCTURE:
- Complete HTML document with head and body
- All CSS inline in <style> tag
- No JavaScript needed
- No external dependencies
- Clean, minimal design WITHOUT any navigation or branding elements
- ONLY create what was specifically requested in the description

Example output structure:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        /* All CSS here */
    </style>
</head>
<body>
    <!-- Static HTML content here -->
</body>
</html>

Generate the complete wireframe now:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert web designer who creates beautifully styled, modern wireframes. CRITICAL RULES: 1) Generate ONLY the specific component requested with comprehensive CSS styling. 2) NEVER include Microsoft, Microsoft Learn, or any corporate branding. 3) Focus solely on the functionality described. 4) All elements MUST be properly styled with modern CSS (colors, spacing, shadows, typography). 5) Create visually appealing, professional-looking components. 6) NO plain HTML - everything needs proper styling. 7) Use modern design principles with clean aesthetics.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const htmlContent = response.choices[0]?.message?.content?.trim() || "";

      // Clean the response to ensure it's proper HTML
      const cleanedHTML = this.cleanHTMLResponse(htmlContent);

      return {
        html: cleanedHTML,
        source: "simple-static",
        framework: "html",
        styling: "inline-css",
        success: true,
      };
    } catch (error) {
      console.error("Simple wireframe generation error:", error);
      return this.getFallbackWireframe(description);
    }
  }

  cleanHTMLResponse(html) {
    // Remove any markdown code blocks
    let cleaned = html
      .replace(/```html\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Ensure it starts with DOCTYPE
    if (!cleaned.toLowerCase().includes("<!doctype")) {
      cleaned = `<!DOCTYPE html>\n${cleaned}`;
    }

    return cleaned;
  }

  getFallbackWireframe(description) {
    return {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            color: #2563eb;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        .content {
            line-height: 1.6;
            text-align: center;
        }
        .button {
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Wireframe: ${description}</div>
        <div class="content">
            <p>This is a clean, static HTML wireframe for: <strong>${description}</strong></p>
            <button class="button">Sample Button</button>
        </div>
    </div>
</body>
</html>`,
      source: "fallback",
      framework: "html",
      styling: "inline-css",
      success: true,
    };
  }
}

module.exports = { SimpleWireframeGenerator };
