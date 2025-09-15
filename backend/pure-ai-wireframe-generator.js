/**
 * Pure AI Wireframe Generator - 100% AI-driven React component generation
 * Handles ANY user input without templates or pattern matching
 * Now includes WCAG accessibility enforcement
 */

const { OpenAI } = require("openai");
const {
  AccessibilityColorValidator,
} = require("./accessibility/color-validator");

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

    // Initialize accessibility validator
    this.accessibilityValidator = new AccessibilityColorValidator();
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

      // Validate accessibility if enabled
      let accessibilityValidation = null;
      if (accessibility) {
        accessibilityValidation =
          this.accessibilityValidator.validateHtmlColors(reactCode);
        if (!accessibilityValidation.isValid) {
          console.warn(
            "⚠️ Generated wireframe has accessibility issues:",
            accessibilityValidation.issues
          );
          // Log but don't reject - provide feedback for improvement
        }
      }

      return {
        code: reactCode,
        framework: "react",
        styling: "tailwind",
        generatedAt: new Date().toISOString(),
        description,
        aiGenerated: true,
        source: "pure-ai",
        accessibilityValidation: accessibilityValidation,
      };
    } catch (error) {
      console.error("AI wireframe generation failed:", error);
      throw new Error(`Failed to generate wireframe: ${error.message}`);
    }
  }

  getSystemPrompt() {
    return `You are an expert React developer specializing in accessible, WCAG-compliant UI components. Generate ONLY JavaScript React components for BROWSER execution. NO TYPESCRIPT EVER.

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

🚨 CRITICAL ACCESSIBILITY REQUIREMENTS (MUST FOLLOW):

1. COLOR ACCESSIBILITY:
   - ONLY use these WCAG-compliant colors:
     * Primary: #0078d4 (Microsoft Blue)
     * Secondary: #106ebe (Darker Blue) 
     * Neutral: #323130 (Dark Gray)
     * Surface: #ffffff (White)
     * Background: #f3f2f1 (Light Gray)
     * Border: #edebe9 (Border Gray)
     * Text: #323130 (Dark Text)
     * Text Secondary: #605e5c (Medium Gray)
   - NEVER use: yellow, orange, light gray, #999, #ccc, or low-contrast colors
   - ALL text must have 4.5:1 contrast ratio minimum
   - Use dark text (#323130) on light backgrounds
   - Use white text (#ffffff) on dark backgrounds (#0078d4, #106ebe)

2. SEMANTIC HTML:
   - Use proper heading hierarchy (h1, h2, h3)
   - Include alt text for images
   - Use semantic elements (nav, main, section, article)
   - Include proper ARIA labels

3. KEYBOARD NAVIGATION:
   - All interactive elements must be keyboard accessible
   - Include tabIndex where needed
   - Proper focus indicators

Example:
const Dashboard = ({ title = "Dashboard" }) => {
Example:
const Dashboard = ({ title = "Dashboard" }) => {
  return (
    <main className="p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-blue-600 text-white p-4 rounded" style={{backgroundColor: '#0078d4'}}>
          <h2 className="font-semibold">Card 1</h2>
        </div>
        <div className="bg-blue-700 text-white p-4 rounded" style={{backgroundColor: '#106ebe'}}>
          <h2 className="font-semibold">Card 2</h2>
        </div>
        <div className="bg-gray-100 text-gray-800 p-4 rounded border" style={{backgroundColor: '#f3f2f1', color: '#323130', borderColor: '#edebe9'}}>
          <h2 className="font-semibold">Card 3</h2>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

RULES:
1. JAVASCRIPT ONLY - no TypeScript syntax
2. Use Tailwind CSS for styling + inline styles for exact colors
3. Follow user description exactly
4. Make it functional and interactive
5. Include realistic placeholder content
6. 🚨 MANDATORY: Use only approved accessible colors listed above
7. 🚨 MANDATORY: Ensure 4.5:1+ contrast ratio for all text
8. 🚨 MANDATORY: Include proper semantic HTML and ARIA labels`;
  }

  buildAdvancedPrompt(description, options) {
    const uniqueId = Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    const accessibilityRequirements =
      options.accessibility !== false
        ? `

🚨 ACCESSIBILITY REQUIREMENTS (MANDATORY):
- Use ONLY these approved colors: #0078d4, #106ebe, #323130, #ffffff, #f3f2f1, #edebe9, #605e5c
- Ensure 4.5:1+ contrast ratio for all text combinations
- Include proper ARIA labels and semantic HTML
- Make all interactive elements keyboard accessible
- Use proper heading hierarchy (h1, h2, h3)
`
        : "";

    return (
      "Create a React component wireframe that EXACTLY matches this specification: " +
      description +
      "\n\nCRITICAL: Follow the description EXACTLY. If it mentions specific numbers (like 'two buttons'), create exactly that number - no more, no less." +
      accessibilityRequirements +
      "\n\nUNIQUE REQUEST ID: " +
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
      "\n\nGENERATE ONLY THE REACT COMPONENT CODE WITH ACCESSIBLE COLORS - NO EXPLANATIONS, NO MARKDOWN, JUST THE JAVASCRIPT CODE."
    );
  }

  cleanAIResponse(response) {
    let cleaned = response.trim();
    if (cleaned.startsWith("```tsx") || cleaned.startsWith("```typescript")) {
      cleaned = cleaned.replace(/^```tsx?\n?/, "").replace(/\n?```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");
    }

    // Apply accessibility color fixes
    cleaned = this.enforceAccessibleColors(cleaned);

    return cleaned;
  }

  /**
   * Enforce accessible color usage by replacing problematic colors
   */
  enforceAccessibleColors(code) {
    const approvedColors =
      this.accessibilityValidator.getApprovedColorPalette();

    // Replace common inaccessible color patterns
    const colorReplacements = [
      // Replace generic Tailwind colors with approved ones
      {
        pattern: /bg-blue-500/g,
        replacement: `bg-blue-600" style={{backgroundColor: '${approvedColors.primary}'}}`,
      },
      {
        pattern: /bg-green-500/g,
        replacement: `bg-blue-600" style={{backgroundColor: '${approvedColors.primary}'}}`,
      },
      {
        pattern: /bg-red-500/g,
        replacement: `bg-blue-700" style={{backgroundColor: '${approvedColors.secondary}'}}`,
      },
      {
        pattern: /bg-yellow-500/g,
        replacement: `bg-gray-100" style={{backgroundColor: '${approvedColors.background}'}}`,
      },
      {
        pattern: /bg-purple-500/g,
        replacement: `bg-blue-600" style={{backgroundColor: '${approvedColors.primary}'}}`,
      },
      {
        pattern: /bg-pink-500/g,
        replacement: `bg-blue-600" style={{backgroundColor: '${approvedColors.primary}'}}`,
      },

      // Replace text colors
      {
        pattern: /text-gray-500/g,
        replacement: `text-gray-600" style={{color: '${approvedColors.textSecondary}'}}`,
      },
      {
        pattern: /text-gray-400/g,
        replacement: `text-gray-600" style={{color: '${approvedColors.textSecondary}'}}`,
      },
      {
        pattern: /text-gray-300/g,
        replacement: `text-gray-800" style={{color: '${approvedColors.text}'}}`,
      },

      // Replace border colors
      {
        pattern: /border-gray-300/g,
        replacement: `border-gray-200" style={{borderColor: '${approvedColors.border}'}}`,
      },
      {
        pattern: /border-gray-400/g,
        replacement: `border-gray-200" style={{borderColor: '${approvedColors.border}'}}`,
      },

      // Remove or replace problematic hex colors
      { pattern: /#999999/g, replacement: approvedColors.textSecondary },
      { pattern: /#cccccc/g, replacement: approvedColors.border },
      { pattern: /#808080/g, replacement: approvedColors.textSecondary },
      { pattern: /lightgray/g, replacement: approvedColors.background },
      { pattern: /yellow/g, replacement: approvedColors.background },
    ];

    let processedCode = code;
    colorReplacements.forEach(({ pattern, replacement }) => {
      processedCode = processedCode.replace(pattern, replacement);
    });

    return processedCode;
  }
}

module.exports = { PureAIWireframeGenerator };
