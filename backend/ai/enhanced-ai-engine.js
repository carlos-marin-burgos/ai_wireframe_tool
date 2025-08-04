/**
 * Enhanced AI Engine for Advanced Wireframe Generation
 * Implements advanced Azure OpenAI capabilities with multi-modal support
 */

const { OpenAI } = require("openai");
const crypto = require("crypto");

class EnhancedAIEngine {
  constructor() {
    this.openai = null;
    this.conversationHistory = new Map(); // Store conversation context
    this.designPatterns = new Map(); // Cache successful design patterns
    this.performanceMetrics = {
      totalRequests: 0,
      successfulGenerations: 0,
      averageResponseTime: 0,
      failureRate: 0
    };
    
    this.initializeAI();
  }

  /**
   * Initialize Azure OpenAI with enhanced configuration
   */
  async initializeAI() {
    try {
      if (!process.env.AZURE_OPENAI_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
        console.warn("⚠️ Azure OpenAI credentials not found");
        return false;
      }

      this.openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
        defaultQuery: { "api-version": "2024-06-01" }, // Latest API version
        defaultHeaders: {
          "api-key": process.env.AZURE_OPENAI_KEY,
        },
      });

      console.log("🤖 Enhanced AI Engine initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize Enhanced AI Engine:", error);
      return false;
    }
  }

  /**
   * Generate wireframe with advanced AI capabilities
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Enhanced generation result
   */
  async generateAdvancedWireframe(options) {
    const startTime = Date.now();
    const sessionId = options.sessionId || crypto.randomUUID();
    
    try {
      this.performanceMetrics.totalRequests++;

      // Analyze user intent and extract design requirements
      const designAnalysis = await this.analyzeDesignIntent(options.description);
      
      // Get conversation context for continuity
      const context = this.getConversationContext(sessionId);
      
      // Generate enhanced prompt with context awareness
      const enhancedPrompt = this.createAdvancedPrompt({
        ...options,
        designAnalysis,
        context,
        sessionId
      });

      // Use advanced generation with multiple passes
      const wireframeResult = await this.multiPassGeneration(enhancedPrompt, options);
      
      // Analyze and improve the generated wireframe
      const enhancedResult = await this.enhanceGeneratedWireframe(wireframeResult, options);
      
      // Update conversation context
      this.updateConversationContext(sessionId, options, enhancedResult);
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.updatePerformanceMetrics(responseTime, true);

      return {
        html: enhancedResult.html,
        metadata: {
          sessionId,
          designAnalysis,
          generationMethod: "enhanced-ai",
          aiGenerated: true,
          enhancementApplied: true,
          responseTime,
          confidenceScore: enhancedResult.confidenceScore,
          designPatterns: enhancedResult.detectedPatterns,
          suggestions: enhancedResult.suggestions
        }
      };

    } catch (error) {
      console.error("❌ Enhanced AI generation failed:", error);
      this.updatePerformanceMetrics(Date.now() - startTime, false);
      
      // Intelligent fallback with context preservation
      return this.intelligentFallback(options, sessionId);
    }
  }

  /**
   * Analyze design intent using AI
   */
  async analyzeDesignIntent(description) {
    try {
      const analysisPrompt = `
Analyze this design request and extract key information:

Description: "${description}"

Provide a JSON response with:
{
  "primaryPurpose": "string",
  "userTypes": ["array of user types"],
  "keyFeatures": ["array of features"],
  "designComplexity": "simple|moderate|complex",
  "recommendedComponents": ["array of UI components"],
  "layoutPattern": "string",
  "interactionLevel": "static|interactive|dynamic",
  "dataRequirements": ["array of data types"],
  "responsiveNeeds": ["mobile", "tablet", "desktop"],
  "accessibilityFocus": ["array of a11y considerations"]
}`;

      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT,
        messages: [
          { role: "system", content: "You are a UX analyst who extracts design requirements from user descriptions. Return only valid JSON." },
          { role: "user", content: analysisPrompt }
        ],
        temperature: 0.3, // Lower temperature for analysis
        max_tokens: 1000
      });

      // Clean the response content to handle markdown code blocks
      const content = response.choices[0].message.content;
      let cleanContent = content;
      
      // Remove markdown code blocks if present
      if (content.includes('```json')) {
        cleanContent = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (content.includes('```')) {
        cleanContent = content.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      return JSON.parse(cleanContent.trim());
    } catch (error) {
      console.warn("⚠️ Design analysis failed, using basic analysis:", error);
      return this.getBasicDesignAnalysis(description);
    }
  }

  /**
   * Create advanced prompt with context awareness
   */
  createAdvancedPrompt(options) {
    const { description, designAnalysis, context, designTheme = "microsoftlearn", colorScheme = "primary" } = options;

    const contextualInformation = context ? `
Previous context: The user previously worked on ${context.lastDesign} with focus on ${context.preferences.join(", ")}.
Continue this design language and maintain consistency.` : "";

    const advancedPrompt = `You are an expert UI/UX designer with deep knowledge of modern web design, accessibility, and user experience principles.

DESIGN REQUEST: "${description}"

DESIGN ANALYSIS:
- Primary Purpose: ${designAnalysis.primaryPurpose}
- Target Users: ${designAnalysis.userTypes.join(", ")}
- Complexity Level: ${designAnalysis.designComplexity}
- Key Features: ${designAnalysis.keyFeatures.join(", ")}
- Recommended Components: ${designAnalysis.recommendedComponents.join(", ")}
- Layout Pattern: ${designAnalysis.layoutPattern}
- Interaction Level: ${designAnalysis.interactionLevel}

DESIGN REQUIREMENTS:
✅ Use ${designTheme} design system with ${colorScheme} color scheme
✅ Implement responsive design for: ${designAnalysis.responsiveNeeds.join(", ")}
✅ Focus on accessibility: ${designAnalysis.accessibilityFocus.join(", ")}
✅ Include proper semantic HTML structure
✅ Add inline CSS with modern techniques (Grid, Flexbox, CSS Variables)
✅ Implement Microsoft Learn navigation and branding
✅ Use proper ARIA labels and semantic elements
✅ Ensure excellent color contrast and typography
✅ Add interactive elements with proper hover/focus states
✅ Include loading states and micro-interactions where appropriate

ADVANCED FEATURES TO INCLUDE:
🎨 Modern CSS Grid and Flexbox layouts
🎯 Progressive enhancement techniques
⚡ Performance-optimized structure
🔧 Component-based architecture
📱 Mobile-first responsive design
♿ WCAG 2.1 AA compliance
🎭 Smooth transitions and animations
🔍 SEO-friendly markup
🛡️ Security best practices

${contextualInformation}

CONTENT STRATEGY:
- Use realistic, contextual placeholder content
- Include proper headings hierarchy (h1, h2, h3)
- Add meaningful alt text for images
- Use descriptive link text
- Include proper form labels and instructions

Generate a complete, production-ready HTML wireframe with inline CSS that demonstrates expert-level frontend development skills.

Return ONLY the HTML code, starting with <!DOCTYPE html> and ending with </html>.`;

    return advancedPrompt;
  }

  /**
   * Multi-pass generation for enhanced quality
   */
  async multiPassGeneration(prompt, options) {
    try {
      // First pass: Generate initial wireframe
      const initialResponse = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT,
        messages: [
          { role: "system", content: "You are an expert frontend developer creating production-ready HTML wireframes." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });

      let html = initialResponse.choices[0].message.content.trim();
      
      // Clean up any markdown formatting
      html = html.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

      // Second pass: Enhancement and optimization (if needed)
      if (options.enhanceQuality && html.length > 1000) {
        const enhancementPrompt = `
Review and enhance this HTML wireframe for better accessibility, performance, and modern design practices:

${html.substring(0, 2000)}...

Provide specific improvements for:
1. Accessibility (ARIA labels, semantic HTML)
2. Performance (optimized CSS, efficient structure)
3. Modern design (better spacing, typography, colors)
4. Responsiveness (better mobile experience)

Return only the improved HTML code.`;

        const enhancedResponse = await this.openai.chat.completions.create({
          model: process.env.AZURE_OPENAI_DEPLOYMENT,
          messages: [
            { role: "system", content: "You are a frontend optimization expert focusing on accessibility and performance." },
            { role: "user", content: enhancementPrompt }
          ],
          temperature: 0.5,
          max_tokens: 4000
        });

        const enhancedHtml = enhancedResponse.choices[0].message.content.trim();
        if (enhancedHtml.includes("<!DOCTYPE html>")) {
          html = enhancedHtml.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();
        }
      }

      return { html, source: "multi-pass-ai" };
    } catch (error) {
      console.error("❌ Multi-pass generation failed:", error);
      throw error;
    }
  }

  /**
   * Enhance generated wireframe with AI analysis
   */
  async enhanceGeneratedWireframe(wireframeResult, options) {
    try {
      // Analyze the generated wireframe
      const analysis = await this.analyzeGeneratedWireframe(wireframeResult.html);
      
      return {
        html: wireframeResult.html,
        confidenceScore: analysis.confidenceScore,
        detectedPatterns: analysis.patterns,
        suggestions: analysis.improvements,
        qualityMetrics: analysis.metrics
      };
    } catch (error) {
      console.warn("⚠️ Wireframe enhancement failed:", error);
      return {
        html: wireframeResult.html,
        confidenceScore: 0.8,
        detectedPatterns: ["standard-layout"],
        suggestions: [],
        qualityMetrics: {}
      };
    }
  }

  /**
   * Analyze generated wireframe quality
   */
  async analyzeGeneratedWireframe(html) {
    try {
      const analysisPrompt = `
Analyze this HTML wireframe and provide quality assessment:

${html.substring(0, 1500)}...

Provide JSON response with:
{
  "confidenceScore": 0.0-1.0,
  "patterns": ["detected design patterns"],
  "improvements": ["suggested improvements"],
  "metrics": {
    "accessibilityScore": 0.0-1.0,
    "performanceScore": 0.0-1.0,
    "modernityScore": 0.0-1.0,
    "responsiveScore": 0.0-1.0
  }
}`;

      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT,
        messages: [
          { role: "system", content: "You are a code quality analyzer. Return only valid JSON." },
          { role: "user", content: analysisPrompt }
        ],
        temperature: 0.2,
        max_tokens: 800
      });

      // Clean the response content to handle markdown code blocks
      const content = response.choices[0].message.content;
      let cleanContent = content;
      
      // Remove markdown code blocks if present
      if (content.includes('```json')) {
        cleanContent = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (content.includes('```')) {
        cleanContent = content.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      return JSON.parse(cleanContent.trim());
    } catch (error) {
      return {
        confidenceScore: 0.8,
        patterns: ["standard"],
        improvements: [],
        metrics: {
          accessibilityScore: 0.8,
          performanceScore: 0.8,
          modernityScore: 0.8,
          responsiveScore: 0.8
        }
      };
    }
  }

  /**
   * Get conversation context for continuity
   */
  getConversationContext(sessionId) {
    return this.conversationHistory.get(sessionId) || null;
  }

  /**
   * Update conversation context
   */
  updateConversationContext(sessionId, options, result) {
    const context = {
      lastDesign: options.description,
      timestamp: Date.now(),
      preferences: result.detectedPatterns || [],
      successfulPatterns: result.qualityMetrics || {}
    };
    
    this.conversationHistory.set(sessionId, context);
    
    // Clean up old contexts (keep last 50)
    if (this.conversationHistory.size > 50) {
      const oldestKey = this.conversationHistory.keys().next().value;
      this.conversationHistory.delete(oldestKey);
    }
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(responseTime, success) {
    if (success) {
      this.performanceMetrics.successfulGenerations++;
    }
    
    // Update average response time
    const totalTime = this.performanceMetrics.averageResponseTime * (this.performanceMetrics.totalRequests - 1);
    this.performanceMetrics.averageResponseTime = (totalTime + responseTime) / this.performanceMetrics.totalRequests;
    
    // Update failure rate
    this.performanceMetrics.failureRate = 
      ((this.performanceMetrics.totalRequests - this.performanceMetrics.successfulGenerations) / this.performanceMetrics.totalRequests) * 100;
  }

  /**
   * Intelligent fallback with context preservation
   */
  intelligentFallback(options, sessionId) {
    // Implement smart fallback that maintains conversation context
    return {
      html: this.generateBasicWireframe(options.description, options.designTheme, options.colorScheme),
      metadata: {
        sessionId,
        generationMethod: "intelligent-fallback",
        aiGenerated: false,
        fallbackReason: "AI generation failed",
        suggestions: ["Try simplifying the description", "Check AI service availability"]
      }
    };
  }

  /**
   * Basic design analysis fallback
   */
  getBasicDesignAnalysis(description) {
    const desc = description.toLowerCase();
    
    return {
      primaryPurpose: desc.includes("dashboard") ? "data-visualization" : "content-display",
      userTypes: ["general-users"],
      keyFeatures: desc.includes("form") ? ["forms"] : ["content"],
      designComplexity: "moderate",
      recommendedComponents: ["header", "main", "footer"],
      layoutPattern: "standard",
      interactionLevel: "interactive",
      dataRequirements: ["text"],
      responsiveNeeds: ["mobile", "desktop"],
      accessibilityFocus: ["keyboard-navigation", "screen-reader"]
    };
  }

  /**
   * Generate basic wireframe fallback
   */
  generateBasicWireframe(description, theme, colorScheme) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { color: #0078d4; margin-bottom: 20px; }
        .content { line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Enhanced Wireframe</h1>
        <div class="content">
            <p>This is an intelligent fallback wireframe for: <strong>${description}</strong></p>
            <p>Theme: ${theme} | Color Scheme: ${colorScheme}</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Generate design suggestions based on description
   */
  async generateDesignSuggestions(description, currentWireframe = null) {
    try {
      const suggestionPrompt = `
Analyze this design request and provide 5 creative suggestions for improvement:

Request: "${description}"
${currentWireframe ? `Current wireframe provided: Yes` : ''}

Provide JSON response with:
{
  "suggestions": [
    {
      "title": "suggestion title",
      "description": "detailed description",
      "impact": "high|medium|low",
      "category": "layout|interaction|accessibility|performance|visual"
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT,
        messages: [
          { role: "system", content: "You are a creative UX consultant providing design suggestions. Return only valid JSON." },
          { role: "user", content: suggestionPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      // Clean the response content to handle markdown code blocks
      const content = response.choices[0].message.content;
      let cleanContent = content;
      
      // Remove markdown code blocks if present
      if (content.includes('```json')) {
        cleanContent = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (content.includes('```')) {
        cleanContent = content.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      return JSON.parse(cleanContent.trim());
    } catch (error) {
      console.warn("⚠️ Suggestion generation failed:", error);
      return {
        suggestions: [
          {
            title: "Enhance Visual Hierarchy",
            description: "Improve the visual hierarchy with better typography and spacing",
            impact: "high",
            category: "visual"
          }
        ]
      };
    }
  }
}

module.exports = { EnhancedAIEngine };
