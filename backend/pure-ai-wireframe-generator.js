/**
 * Pure AI Wireframe Generator - 100% AI-driven React component generation
 * Handles ANY user input without templates or pattern matching
 */

const { OpenAI } = require("openai");

class PureAIWireframeGenerator {
  constructor() {
    // Load environment variables if not already loaded
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

  /**
   * Generate ANY wireframe from user description using pure AI
   * Examples it can handle:
   * - "left navigation with dashboard"
   * - "data table with sorting and filters"
   * - "e-commerce product grid"
   * - "user profile settings page"
   * - "chat interface with message bubbles"
   * - "kanban board with drag and drop"
   * - "calendar view with events"
   * - "analytics dashboard with charts"
   * - "login form with social buttons"
   * - "video player with controls"
   * - "file upload interface"
   * - "notification center"
   * - "pricing comparison table"
   * - "image gallery with lightbox"
   * - "search results with facets"
   * - "admin panel with sidebar"
   * - "blog layout with comments"
   * - "invoice template"
   * - "landing page with hero section"
   * - "shopping cart checkout flow"
   * - "user onboarding wizard"
   * - LITERALLY ANYTHING!
   */
  async generateReactWireframe(description, options = {}) {
    const {
      colorScheme = "primary",
      framework = "react",
      styling = "tailwind",
      includeInteractivity = true,
      accessibility = true,
      responsive = true,
    } = options;

    const prompt = this.buildAdvancedPrompt(description, {
      colorScheme,
      framework,
      styling,
      includeInteractivity,
      accessibility,
      responsive,
    });

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.9, // Higher temperature for more creativity and variation
        top_p: 0.95, // Add nucleus sampling for more diverse outputs
      });

      const reactCode = this.cleanAIResponse(
        response.choices[0].message.content
      );

      return {
        code: reactCode,
        framework: "react",
        styling: "tailwind",
        generatedAt: new Date().toISOString(),
        description,
        aiGenerated: true,
        source: "pure-ai",
      };
    } catch (error) {
      console.error("AI wireframe generation failed:", error);
      throw new Error(`Failed to generate wireframe: ${error.message}`);
    }
  }

  getSystemPrompt() {
    return `You are an expert React developer. Generate ONLY JavaScript React components for BROWSER execution. NO TYPESCRIPT EVER.

JAVASCRIPT ONLY - NEVER USE:
- interface declarations
- type annotations like ": string" or ": number" 
- React.FC<Props>
- TypeScript syntax
- exports. or module.exports
- require() statements
- Node.js specific syntax

ALWAYS USE:
- Plain JavaScript function components
- Tailwind CSS classes
- Regular JavaScript props (no typing)
- Browser-compatible syntax only
- export default ComponentName; (only this export style)

Example:
const Dashboard = ({ title = "Dashboard" }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-blue-500 text-white p-4 rounded">Card 1</div>
        <div className="bg-green-500 text-white p-4 rounded">Card 2</div>
        <div className="bg-red-500 text-white p-4 rounded">Card 3</div>
      </div>
    </div>
  );
};

export default Dashboard;

RULES:
1. JAVASCRIPT ONLY - no TypeScript syntax
2. Use Tailwind CSS for styling
3. Follow user description exactly
4. Make it functional and interactive
5. Include realistic placeholder content`;
  }

  buildAdvancedPrompt(description, options) {
    const uniqueId = Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    return (
      "Create a React component wireframe that EXACTLY matches this specification: " +
      description +
      "\n\nCRITICAL: Follow the description EXACTLY. If it mentions specific numbers (like 'two buttons'), create exactly that number - no more, no less.\n\nUNIQUE REQUEST ID: " +
      uniqueId +
      " (Generate completely fresh code - no caching)\n\nSPECIFICATIONS:\n- Framework: " +
      (options.framework || "react") +
      "\n- Styling: " +
      (options.styling || "tailwind") +
      "\n- Color Scheme: " +
      (options.colorScheme || "primary") +
      "\n- Responsive: " +
      (options.responsive !== false) +
      "\n- Accessibility: " +
      (options.accessibility !== false) +
      "\n\nGENERATE ONLY THE REACT COMPONENT CODE - NO EXPLANATIONS, NO MARKDOWN, JUST THE JAVASCRIPT CODE."
    );
  }

  cleanAIResponse(response) {
    let cleaned = response.trim();
    if (cleaned.startsWith("```tsx") || cleaned.startsWith("```typescript")) {
      cleaned = cleaned.replace(/^```tsx?\n?/, "").replace(/\n?```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");
    }
    return cleaned;
  }
}

module.exports = { PureAIWireframeGenerator };
