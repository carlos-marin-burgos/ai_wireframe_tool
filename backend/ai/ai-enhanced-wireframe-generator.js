/**
 * AI-Enhanced Wireframe Generator Integration
 * Integrates the new enhanced AI capabilities with the existing system
 */

const { EnhancedAIEngine } = require("./enhanced-ai-engine");
const { AIContextManager } = require("./ai-context-manager");
const { AdvancedPromptEngine } = require("./advanced-prompt-engine");
const { createFallbackWireframe } = require("../fallback-generator");

class AIEnhancedWireframeGenerator {
  constructor() {
    this.aiEngine = new EnhancedAIEngine();
    this.contextManager = new AIContextManager();
    this.promptEngine = new AdvancedPromptEngine();

    // Performance tracking
    this.stats = {
      totalRequests: 0,
      aiGeneratedCount: 0,
      fallbackCount: 0,
      averageQuality: 0,
      userSatisfactionScore: 0,
    };

    console.log("🚀 AI-Enhanced Wireframe Generator initialized");
  }

  /**
   * Main enhanced wireframe generation method
   */
  async generateEnhancedWireframe(options) {
    const {
      description,
      sessionId = null,
      userAgent = null,
      designTheme = "microsoft",
      colorScheme = "primary",
      enhanceQuality = true,
      userFeedback = null,
    } = options;

    this.stats.totalRequests++;
    const startTime = Date.now();

    try {
      console.log(
        `🧠 Starting enhanced AI generation for: "${description.substring(
          0,
          50
        )}..."`
      );

      // Initialize or get user session
      const session = this.contextManager.initializeSession(
        sessionId,
        userAgent
      );

      // Get generation context from user history
      const generationContext = this.contextManager.getGenerationContext(
        sessionId,
        description
      );

      // Enhanced generation with context awareness
      const result = await this.aiEngine.generateAdvancedWireframe({
        description,
        sessionId,
        designTheme,
        colorScheme,
        enhanceQuality,
        context: generationContext,
      });

      // Record this interaction
      this.contextManager.addDesignInteraction(sessionId, {
        description,
        generationMethod: result.metadata.generationMethod,
        success: true,
        detectedPatterns: result.metadata.designPatterns,
        qualityMetrics: {
          overall: result.metadata.confidenceScore,
          accessibilityScore: 0.9, // Placeholder - would be calculated
          performanceScore: 0.85,
          modernityScore: 0.9,
          responsiveScore: 0.95,
        },
        responseTime: Date.now() - startTime,
        enhancementsApplied: result.metadata.enhancementApplied
          ? ["ai-enhancement"]
          : [],
        userFeedback,
      });

      // Update statistics
      this.stats.aiGeneratedCount++;
      this.updateQualityStats(result.metadata.confidenceScore);

      console.log(
        `✅ Enhanced AI generation completed in ${Date.now() - startTime}ms`
      );
      console.log(
        `📊 Confidence Score: ${Math.round(
          result.metadata.confidenceScore * 100
        )}%`
      );

      return {
        html: result.html,
        fallback: false,
        aiGenerated: true,
        enhanced: true,
        metadata: {
          ...result.metadata,
          processingTime: Date.now() - startTime,
          userSession: sessionId,
          contextualSuggestions: result.metadata.suggestions || [],
        },
      };
    } catch (error) {
      console.error("❌ Enhanced AI generation failed:", error);

      // Record failed interaction
      if (sessionId) {
        this.contextManager.addDesignInteraction(sessionId, {
          description,
          generationMethod: "enhanced-ai-failed",
          success: false,
          responseTime: Date.now() - startTime,
        });
      }

      // Intelligent fallback with context preservation
      return this.intelligentFallbackWithContext(options, sessionId, startTime);
    }
  }

  /**
   * Intelligent fallback that maintains context
   */
  async intelligentFallbackWithContext(options, sessionId, startTime) {
    const { description, designTheme, colorScheme } = options;

    try {
      console.log("🔄 Using intelligent fallback with context preservation...");

      // Get user context for smarter fallback
      const context = this.contextManager.getGenerationContext(
        sessionId,
        description
      );

      // Try to use successful patterns from user's history
      if (context && context.successfulPatterns.length > 0) {
        const pattern = context.successfulPatterns[0];
        console.log(
          `🎯 Using successful pattern: ${pattern.patterns.join(", ")}`
        );

        // Generate contextual fallback
        const contextualFallback = this.generateContextualFallback(
          description,
          pattern,
          designTheme,
          colorScheme
        );

        // Record this interaction
        this.contextManager.addDesignInteraction(sessionId, {
          description,
          generationMethod: "contextual-fallback",
          success: true,
          detectedPatterns: pattern.patterns,
          responseTime: Date.now() - startTime,
        });

        this.stats.fallbackCount++;

        return {
          html: contextualFallback,
          fallback: true,
          aiGenerated: false,
          enhanced: false,
          contextual: true,
          metadata: {
            generationMethod: "contextual-fallback",
            usedPatterns: pattern.patterns,
            processingTime: Date.now() - startTime,
            userSession: sessionId,
          },
        };
      }

      // Standard fallback if no context available
      console.log("🔄 Using standard fallback generation...");
      const fallbackHtml = createFallbackWireframe(
        description,
        designTheme,
        colorScheme
      );

      this.stats.fallbackCount++;

      return {
        html: fallbackHtml,
        fallback: true,
        aiGenerated: false,
        enhanced: false,
        metadata: {
          generationMethod: "standard-fallback",
          processingTime: Date.now() - startTime,
          userSession: sessionId,
        },
      };
    } catch (fallbackError) {
      console.error("❌ Even fallback failed:", fallbackError);

      // Emergency fallback
      const emergencyHtml = this.generateEmergencyFallback(
        description,
        designTheme,
        colorScheme
      );

      return {
        html: emergencyHtml,
        fallback: true,
        aiGenerated: false,
        enhanced: false,
        emergency: true,
        metadata: {
          generationMethod: "emergency-fallback",
          processingTime: Date.now() - startTime,
          error: fallbackError.message,
        },
      };
    }
  }

  /**
   * Generate contextual fallback based on user's successful patterns
   */
  generateContextualFallback(
    description,
    successfulPattern,
    designTheme,
    colorScheme
  ) {
    const patterns = successfulPattern.patterns;

    // Basic template with learned patterns
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        :root {
            --primary-color: ${
              colorScheme === "primary" ? "#0078d4" : "#107c10"
            };
            --secondary-color: #f3f2f1;
            --text-color: #323130;
            --border-color: #edebe9;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: #faf9f8;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            padding: 20px 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 30px;
        }
        
        h1 {
            color: var(--primary-color);
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }`;

    // Add pattern-specific styles
    if (patterns.includes("card-grid")) {
      html += `
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .card {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            transition: box-shadow 0.2s ease;
        }
        
        .card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }`;
    }

    if (patterns.includes("hero-section")) {
      html += `
        .hero {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, var(--primary-color), #106ebe);
            color: white;
            border-radius: 12px;
            margin-bottom: 40px;
        }
        
        .hero h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .cta-button {
            background: white;
            color: var(--primary-color);
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }`;
    }

    html += `
        @media (max-width: 768px) {
            .container { padding: 10px; }
            h1 { font-size: 1.5rem; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Enhanced ${description}</h1>
            <p>Built with learned patterns: ${patterns.join(", ")}</p>
        </header>
        
        <main class="content">`;

    // Add pattern-specific content
    if (patterns.includes("hero-section")) {
      html += `
            <section class="hero">
                <h2>Welcome to Your Solution</h2>
                <p>Experience the power of context-aware design generation</p>
                <button class="cta-button">Get Started</button>
            </section>`;
    }

    if (patterns.includes("card-grid")) {
      html += `
            <section class="card-grid">
                <div class="card">
                    <h3>Feature One</h3>
                    <p>Enhanced with your preferred patterns</p>
                </div>
                <div class="card">
                    <h3>Feature Two</h3>
                    <p>Contextually generated content</p>
                </div>
                <div class="card">
                    <h3>Feature Three</h3>
                    <p>Based on successful designs</p>
                </div>
            </section>`;
    }

    html += `
        </main>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Generate emergency fallback
   */
  generateEmergencyFallback(description, designTheme, colorScheme) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Wireframe</title>
    <style>
        body { 
            font-family: 'Segoe UI', sans-serif; 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .emergency-container { 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { color: #d83b01; margin-bottom: 20px; }
        .description { background: #fff4ce; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="emergency-container">
        <h1>🚨 Emergency Wireframe</h1>
        <div class="description">
            <strong>Request:</strong> ${description}
        </div>
        <p>The AI enhancement system is temporarily unavailable. This emergency wireframe ensures your request is handled while we restore full capabilities.</p>
        <p><strong>Theme:</strong> ${designTheme} | <strong>Colors:</strong> ${colorScheme}</p>
    </div>
</body>
</html>`;
  }

  /**
   * Generate design suggestions using enhanced AI
   */
  async generateDesignSuggestions(
    description,
    sessionId = null,
    currentWireframe = null
  ) {
    try {
      console.log("💡 Generating enhanced design suggestions...");

      const context = this.contextManager.getGenerationContext(
        sessionId,
        description
      );
      const suggestions = await this.aiEngine.generateDesignSuggestions(
        description,
        currentWireframe
      );

      // Add contextual suggestions from user history
      if (context && context.contextualSuggestions) {
        suggestions.suggestions.push(
          ...context.contextualSuggestions.map((s) => ({
            title: s.suggestion,
            description: `Based on your design history`,
            impact: s.confidence > 0.8 ? "high" : "medium",
            category: s.type,
          }))
        );
      }

      return suggestions;
    } catch (error) {
      console.error("❌ Enhanced suggestion generation failed:", error);
      return {
        suggestions: [
          {
            title: "Enhance User Experience",
            description: "Focus on improving usability and accessibility",
            impact: "high",
            category: "ux",
          },
        ],
      };
    }
  }

  /**
   * Analyze and improve existing wireframe
   */
  async analyzeAndImprove(
    wireframeHTML,
    originalDescription,
    sessionId = null
  ) {
    try {
      console.log("🔍 Analyzing wireframe for improvements...");

      const analysisPrompt = this.promptEngine.generateImprovementPrompt(
        wireframeHTML,
        originalDescription,
        { issues: [], scores: {} }
      );

      // This would use the AI engine to analyze and suggest improvements
      // Implementation would depend on your specific needs

      return {
        improvements: [
          {
            category: "accessibility",
            issue: "Missing ARIA labels for interactive elements",
            solution: "Add proper ARIA labels and roles",
            impact: "High",
            priority: "1",
          },
        ],
      };
    } catch (error) {
      console.error("❌ Wireframe analysis failed:", error);
      return { improvements: [] };
    }
  }

  /**
   * Update quality statistics
   */
  updateQualityStats(qualityScore) {
    const totalGenerated = this.stats.aiGeneratedCount;
    this.stats.averageQuality =
      (this.stats.averageQuality * (totalGenerated - 1) + qualityScore) /
      totalGenerated;
  }

  /**
   * Get comprehensive statistics
   */
  getEnhancedStats() {
    return {
      ...this.stats,
      aiSuccessRate:
        this.stats.totalRequests > 0
          ? (this.stats.aiGeneratedCount / this.stats.totalRequests) * 100
          : 0,
      contextManagerStats: this.contextManager.getAnalytics(),
      aiEngineMetrics: this.aiEngine.getPerformanceMetrics(),
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.contextManager.cleanup();
  }
}

module.exports = { AIEnhancedWireframeGenerator };
