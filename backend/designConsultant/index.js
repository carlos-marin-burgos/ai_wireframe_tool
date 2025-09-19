/**
 * Azure Function: Design Consultant AI Agent
 *
 * AI Foundry-powered agent that analyzes wireframes and provides design feedback
 * Uses Azure OpenAI as the AI Foundry backend for the hackathon demo
 */

// AI Foundry Configuration (using Azure OpenAI as backend for demo)
const AI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
const AI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;

/**
 * Design Consultant Agent - Specialized AI for wireframe analysis
 */
class WireframeDesignConsultant {
  constructor() {
    // Validate required environment variables
    if (!AI_ENDPOINT || !AI_API_KEY || !AI_DEPLOYMENT) {
      throw new Error("Missing required Azure OpenAI environment variables");
    }

    this.endpoint = AI_ENDPOINT;
    this.apiKey = AI_API_KEY;
    this.deployment = AI_DEPLOYMENT;
    this.apiVersion = AI_API_VERSION || "2024-08-01-preview";

    this.systemPrompt = `You are a Senior UX/UI Design Consultant specializing in wireframe analysis.

YOUR ROLE:
- Analyze wireframe HTML structure and content
- Provide actionable design feedback and suggestions
- Recommend improvements for user experience
- Suggest component enhancements and layout optimizations

ANALYSIS FOCUS:
1. User Experience (navigation, flow, accessibility)
2. Visual Design (layout, hierarchy, spacing)
3. Responsive Design (mobile-first approach)
4. Performance (loading, optimization)
5. Implementation (technical feasibility)

RESPONSE FORMAT:
- Start with a brief summary
- Provide 3-5 specific actionable recommendations
- Include implementation suggestions
- End with one "pro tip" for advanced improvement

Keep responses concise but comprehensive. Focus on wireframe-specific feedback.`;
  }

  /**
   * Analyze wireframe and provide design consultation
   */
  async analyzeWireframe(wireframeHtml, userContext = "") {
    try {
      const analysisPrompt = `
WIREFRAME TO ANALYZE:
${wireframeHtml}

USER CONTEXT: ${userContext}

Please provide a comprehensive design analysis with specific recommendations.`;

      const result = await this.callAzureOpenAI([
        { role: "system", content: this.systemPrompt },
        { role: "user", content: analysisPrompt },
      ]);

      return {
        success: true,
        analysis: result,
        model: this.deployment,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Design Analysis Error:", error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackAnalysis(),
      };
    }
  }

  /**
   * Get quick design tips for specific wireframe types
   */
  async getQuickTips(wireframeType = "landing page", platform = "desktop") {
    try {
      const tipsPrompt = `
Please provide 5 quick design tips for a ${wireframeType} wireframe targeting ${platform} users.

Focus on:
- Best practices specific to ${wireframeType}
- ${platform}-specific considerations  
- Common pitfalls to avoid
- Quick wins for better UX

Format as numbered list with brief explanations.`;

      const result = await this.callAzureOpenAI([
        { role: "system", content: this.systemPrompt },
        { role: "user", content: tipsPrompt },
      ]);

      return {
        success: true,
        tips: result,
        wireframeType,
        platform,
        model: this.deployment,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Quick Tips Error:", error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackTips(wireframeType, platform),
      };
    }
  }

  /**
   * Call Azure OpenAI API
   */
  async callAzureOpenAI(messages) {
    const url = `${this.endpoint}openai/deployments/${this.deployment}/chat/completions?api-version=${this.apiVersion}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Azure OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from Azure OpenAI API");
    }

    return data.choices[0].message.content;
  }

  /**
   * Fallback analysis when AI is unavailable
   */
  getFallbackAnalysis() {
    return `**Design Analysis Fallback**

I'm currently experiencing technical difficulties connecting to the AI analysis service. However, here are some general wireframe design best practices:

1. **Layout Structure**: Ensure clear visual hierarchy with proper spacing and alignment
2. **Navigation**: Make navigation intuitive and easily accessible
3. **Content Flow**: Guide users through the page with logical content organization
4. **Responsive Design**: Consider mobile-first approach for better accessibility
5. **Call-to-Actions**: Make primary actions prominent and easy to find

**Pro Tip**: Test your wireframe with real users to validate the design decisions.

*Powered by Azure AI Foundry Design Consultant*`;
  }

  /**
   * Fallback tips when AI is unavailable
   */
  getFallbackTips(wireframeType, platform) {
    return `**Quick Design Tips for ${wireframeType} (${platform})**

1. **Above the Fold**: Place most important content in the first screen view
2. **Visual Hierarchy**: Use size, color, and spacing to guide attention
3. **White Space**: Don't overcrowd - give elements room to breathe
4. **Consistency**: Maintain consistent patterns throughout the design
5. **Accessibility**: Ensure good contrast and readable typography

*Powered by Azure AI Foundry Design Consultant*`;
  }
}

/**
 * Azure Function HTTP Trigger
 */
module.exports = async function (context, req) {
  // CORS Headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: "",
    };
    return;
  }

  try {
    const consultant = new WireframeDesignConsultant();
    const { action, wireframeHtml, userContext, wireframeType, platform } =
      req.body || {};

    let result;

    switch (action) {
      case "analyze":
        if (!wireframeHtml) {
          throw new Error("wireframeHtml is required for analysis");
        }
        result = await consultant.analyzeWireframe(wireframeHtml, userContext);
        break;

      case "quickTips":
        result = await consultant.getQuickTips(
          wireframeType || "landing page",
          platform || "desktop"
        );
        break;

      default:
        throw new Error('Invalid action. Use "analyze" or "quickTips"');
    }

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        agent: "Wireframe Design Consultant",
        powered_by: "Azure AI Foundry",
        model: AI_DEPLOYMENT,
        ...result,
      }),
    };
  } catch (error) {
    context.log.error("Design Consultant Function Error:", error);

    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.message,
        agent: "Wireframe Design Consultant",
        powered_by: "Azure AI Foundry",
      }),
    };
  }
};
