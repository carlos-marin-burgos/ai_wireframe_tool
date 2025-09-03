/**
 * Multi-pass UI analysis engine for comprehensive image analysis
 * Performs specialized analysis passes to improve component detection accuracy
 */

class MultiPassAnalyzer {
  constructor(openaiClient) {
    this.openai = openaiClient;
    this.analysisCache = new Map();
    this.maxCacheSize = 25;
  }

  /**
   * Perform comprehensive multi-pass analysis on UI image
   * @param {string} originalImage - Original image data URL
   * @param {object} imageVariants - Preprocessed image variants
   * @param {string} correlationId - Tracking ID
   * @returns {Promise<object>} Comprehensive analysis results
   */
  async performMultiPassAnalysis(originalImage, imageVariants, correlationId) {
    console.log("🎯 Starting multi-pass UI analysis...", { correlationId });

    const analysisResults = {
      passes: {},
      consolidated: null,
      confidence: 0,
      processingTime: 0,
    };

    const startTime = Date.now();

    try {
      // Pass 1: Layout Structure Detection
      analysisResults.passes.layoutStructure =
        await this.analyzeLayoutStructure(
          imageVariants.layoutFocused || originalImage,
          correlationId
        );

      // Pass 2: Component Detection
      analysisResults.passes.componentDetection = await this.analyzeComponents(
        imageVariants.highContrast || originalImage,
        correlationId
      );

      // Pass 3: Text Content Extraction
      analysisResults.passes.textExtraction = await this.analyzeTextContent(
        imageVariants.textOptimized || originalImage,
        correlationId
      );

      // Pass 4: Design Token Analysis
      analysisResults.passes.designTokens = await this.analyzeDesignTokens(
        imageVariants.colorEnhanced || originalImage,
        correlationId
      );

      // Pass 5: Interactive Elements Detection
      analysisResults.passes.interactiveElements =
        await this.analyzeInteractiveElements(originalImage, correlationId);

      // Consolidate all analysis results
      analysisResults.consolidated = await this.consolidateAnalysis(
        analysisResults.passes,
        correlationId
      );

      analysisResults.processingTime = Date.now() - startTime;
      analysisResults.confidence = this.calculateOverallConfidence(
        analysisResults.passes
      );

      console.log("✅ Multi-pass analysis completed", {
        correlationId,
        processingTimeMs: analysisResults.processingTime,
        passesCompleted: Object.keys(analysisResults.passes).length,
        overallConfidence: analysisResults.confidence,
        componentsFound: analysisResults.consolidated?.components?.length || 0,
      });

      return analysisResults;
    } catch (error) {
      console.error("❌ Multi-pass analysis failed:", error);

      // Return fallback analysis
      return {
        passes: { error: error.message },
        consolidated: await this.createFallbackAnalysis(originalImage),
        confidence: 0.3,
        processingTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  /**
   * Pass 1: Analyze layout structure and grid systems
   */
  async analyzeLayoutStructure(imageUrl, correlationId) {
    console.log("📐 Pass 1: Analyzing layout structure...", { correlationId });

    const prompt = `
      Analyze this UI image and focus SPECIFICALLY on layout structure and organization.

      Identify:
      1. **Grid System**: Number of columns, grid type (CSS Grid, Flexbox, Float-based)
      2. **Layout Sections**: Header, navigation, main content, sidebar, footer
      3. **Content Flow**: How content is organized vertically and horizontally  
      4. **Spacing Patterns**: Consistent margins, padding, gaps between sections
      5. **Responsive Indicators**: Breakpoint hints, mobile-first patterns

      Return JSON format:
      {
        "gridSystem": {
          "type": "css-grid|flexbox|float|custom",
          "columns": 12,
          "rows": "auto",
          "areas": ["header", "nav", "main", "sidebar", "footer"]
        },
        "sections": [
          {
            "name": "header",
            "bounds": {"x": 0, "y": 0, "width": 100, "height": 10},
            "content": "navigation and branding"
          }
        ],
        "spacingPattern": {
          "basePadding": 16,
          "sectionGaps": 24,
          "contentMargins": 32
        },
        "confidence": 0.85
      }
    `;

    return await this.makeAnalysisCall(
      imageUrl,
      prompt,
      "layout-structure",
      correlationId
    );
  }

  /**
   * Pass 2: Detailed component detection and classification
   */
  async analyzeComponents(imageUrl, correlationId) {
    console.log("🧩 Pass 2: Analyzing UI components...", { correlationId });

    const prompt = `
      Analyze this UI image and focus on identifying ALL individual UI components with high precision.

      For EACH component, provide:
      1. **Exact Type**: button, input, textarea, select, checkbox, radio, link, card, modal, tooltip, badge, avatar, icon, image, video, form, table, list-item, navigation-item
      2. **Precise Position**: Percentage coordinates relative to image (x, y, width, height)
      3. **State**: enabled, disabled, active, hover, focus, selected
      4. **Hierarchy**: Primary, secondary, tertiary importance
      5. **Interaction**: clickable, inputable, draggable, hoverable

      Be EXTREMELY thorough - identify every clickable element, every input field, every piece of interactive content.

      Return JSON format:
      {
        "components": [
          {
            "id": "comp-1",
            "type": "button",
            "subtype": "primary",
            "bounds": {"x": 20, "y": 15, "width": 25, "height": 8},
            "state": "enabled",
            "hierarchy": "primary",
            "interactions": ["click", "hover"],
            "properties": {
              "style": "filled",
              "size": "medium",
              "variant": "primary"
            },
            "confidence": 0.95
          }
        ],
        "totalComponents": 15,
        "confidence": 0.88
      }
    `;

    return await this.makeAnalysisCall(
      imageUrl,
      prompt,
      "components",
      correlationId
    );
  }

  /**
   * Pass 3: Extract and analyze text content
   */
  async analyzeTextContent(imageUrl, correlationId) {
    console.log("📝 Pass 3: Analyzing text content...", { correlationId });

    const prompt = `
      Analyze this UI image and focus SPECIFICALLY on text content extraction and typography.

      Extract ALL visible text and analyze:
      1. **Text Content**: Exact text strings (including partial/cut-off text)
      2. **Typography**: Font families, sizes, weights, styles
      3. **Text Hierarchy**: H1, H2, H3, body, caption, labels
      4. **Text Purpose**: Headings, navigation, body content, labels, buttons, links
      5. **Reading Flow**: Left-to-right, top-to-bottom content organization

      Return JSON format:
      {
        "textElements": [
          {
            "id": "text-1",
            "content": "Get Started Today",
            "bounds": {"x": 20, "y": 30, "width": 30, "height": 5},
            "typography": {
              "hierarchy": "h1",
              "fontSize": "32px",
              "fontWeight": "600",
              "fontFamily": "Segoe UI",
              "color": "#323130"
            },
            "purpose": "heading",
            "confidence": 0.92
          }
        ],
        "readingFlow": ["header-title", "nav-items", "hero-heading", "body-content"],
        "overallTypography": {
          "primaryFont": "Segoe UI",
          "fontScale": [12, 14, 16, 20, 24, 32],
          "colorPalette": ["#323130", "#605e5c", "#0078d4"]
        },
        "confidence": 0.87
      }
    `;

    return await this.makeAnalysisCall(
      imageUrl,
      prompt,
      "text-content",
      correlationId
    );
  }

  /**
   * Pass 4: Design token and visual style analysis
   */
  async analyzeDesignTokens(imageUrl, correlationId) {
    console.log("🎨 Pass 4: Analyzing design tokens...", { correlationId });

    const prompt = `
      Analyze this UI image and focus on extracting design tokens and visual styling patterns.

      Extract:
      1. **Color Palette**: Primary, secondary, accent, neutral colors with hex values
      2. **Typography Scale**: Font sizes, weights, line heights, letter spacing
      3. **Spacing System**: Consistent padding, margins, gaps (4px, 8px, 16px, etc.)
      4. **Border Radius**: Consistent corner radius values
      5. **Shadow System**: Box shadows, elevations, depth layers
      6. **Animation/Transitions**: Any visible motion or state changes

      Return JSON format:
      {
        "colorPalette": {
          "primary": "#0078d4",
          "secondary": "#605e5c", 
          "accent": "#107c10",
          "neutral": ["#ffffff", "#f8f9fa", "#e1dfdd", "#323130"],
          "semantic": {
            "success": "#107c10",
            "warning": "#ff8c00",
            "error": "#d13438"
          }
        },
        "typography": {
          "fontFamilies": ["Segoe UI", "Arial", "sans-serif"],
          "fontSizes": [12, 14, 16, 20, 24, 28, 32],
          "fontWeights": [400, 500, 600, 700],
          "lineHeights": [1.2, 1.4, 1.6]
        },
        "spacing": {
          "scale": [4, 8, 12, 16, 20, 24, 32, 40, 48],
          "basePadding": 16,
          "baseMargin": 16
        },
        "borderRadius": [0, 2, 4, 6, 8, 12],
        "shadows": ["0 2px 4px rgba(0,0,0,0.1)", "0 4px 8px rgba(0,0,0,0.15)"],
        "confidence": 0.83
      }
    `;

    return await this.makeAnalysisCall(
      imageUrl,
      prompt,
      "design-tokens",
      correlationId
    );
  }

  /**
   * Pass 5: Interactive elements and behavior analysis
   */
  async analyzeInteractiveElements(imageUrl, correlationId) {
    console.log("🎯 Pass 5: Analyzing interactive elements...", {
      correlationId,
    });

    const prompt = `
      Analyze this UI image and focus on interactive elements and user interaction patterns.

      Identify:
      1. **Interactive Elements**: All clickable, hoverable, focusable elements
      2. **Navigation Patterns**: Main nav, breadcrumbs, pagination, tabs
      3. **Form Elements**: Inputs, selects, checkboxes, radio buttons, submit buttons
      4. **Call-to-Action Elements**: Primary and secondary action buttons
      5. **Feedback Elements**: Loading states, success/error messages, tooltips

      Return JSON format:
      {
        "interactiveElements": [
          {
            "id": "interactive-1",
            "type": "navigation-link",
            "bounds": {"x": 10, "y": 5, "width": 15, "height": 4},
            "interactions": ["click", "hover", "focus"],
            "state": "default",
            "importance": "primary",
            "targetAction": "navigation",
            "confidence": 0.90
          }
        ],
        "navigationPattern": "horizontal-top-nav",
        "primaryActions": ["get-started", "sign-up", "learn-more"],
        "formElements": ["email-input", "password-input", "submit-button"],
        "userFlowHints": ["landing → signup → dashboard"],
        "confidence": 0.85
      }
    `;

    return await this.makeAnalysisCall(
      imageUrl,
      prompt,
      "interactive-elements",
      correlationId
    );
  }

  /**
   * Make API call to OpenAI for specific analysis
   */
  async makeAnalysisCall(imageUrl, prompt, passType, correlationId) {
    try {
      const response = await Promise.race([
        this.openai.chat.completions.create({
          model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a specialized UI/UX analyzer focused on ${passType}. You provide detailed, accurate analysis in clean JSON format. Be precise and thorough.`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                    detail: "high",
                  },
                },
              ],
            },
          ],
          max_tokens: 3000,
          temperature: 0.1, // Very low for consistency
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`${passType} analysis timeout`)),
            30000
          )
        ),
      ]);

      if (response?.choices?.[0]?.message?.content) {
        let result = response.choices[0].message.content.trim();

        // Clean JSON formatting
        if (result.startsWith("```json")) {
          result = result.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        } else if (result.startsWith("```")) {
          result = result
            .replace(/^```[a-zA-Z]*\n?/, "")
            .replace(/\n?```$/, "");
        }

        try {
          return JSON.parse(result);
        } catch (parseError) {
          console.warn(
            `⚠️ Failed to parse ${passType} analysis JSON:`,
            parseError.message
          );
          return {
            error: `JSON parse failed for ${passType}`,
            rawResponse: result.substring(0, 500),
          };
        }
      }

      return { error: `No response from ${passType} analysis` };
    } catch (error) {
      console.error(`❌ ${passType} analysis failed:`, error.message);
      return { error: error.message, passType };
    }
  }

  /**
   * Consolidate results from all analysis passes
   */
  async consolidateAnalysis(passes, correlationId) {
    console.log("🔄 Consolidating multi-pass analysis results...", {
      correlationId,
    });

    try {
      const consolidated = {
        components: [],
        layout: {},
        designTokens: {},
        textContent: [],
        interactions: [],
        wireframeDescription: "",
        confidence: 0,
      };

      // Consolidate components from multiple passes
      if (passes.componentDetection?.components) {
        consolidated.components = passes.componentDetection.components;
      }

      // Add text elements as components
      if (passes.textExtraction?.textElements) {
        passes.textExtraction.textElements.forEach((textEl) => {
          consolidated.components.push({
            id: textEl.id,
            type: "text",
            bounds: textEl.bounds,
            text: textEl.content,
            properties: {
              typography: textEl.typography,
              purpose: textEl.purpose,
            },
            confidence: textEl.confidence,
          });
        });
      }

      // Consolidate layout information
      if (passes.layoutStructure?.gridSystem) {
        consolidated.layout = {
          type: passes.layoutStructure.gridSystem.type,
          columns: passes.layoutStructure.gridSystem.columns,
          sections: passes.layoutStructure.sections?.map((s) => s.name) || [],
          spacing: passes.layoutStructure.spacingPattern,
        };
      }

      // Consolidate design tokens
      if (passes.designTokens?.colorPalette) {
        consolidated.designTokens = {
          colors: Object.values(passes.designTokens.colorPalette.neutral || [])
            .concat([passes.designTokens.colorPalette.primary])
            .filter(Boolean),
          fonts: passes.designTokens.typography?.fontFamilies || ["Segoe UI"],
          spacing: passes.designTokens.spacing?.scale || [16, 24, 32],
        };
      }

      // Add interactive elements
      if (passes.interactiveElements?.interactiveElements) {
        consolidated.interactions =
          passes.interactiveElements.interactiveElements;
      }

      // Generate comprehensive wireframe description
      consolidated.wireframeDescription =
        this.generateWireframeDescription(passes);

      // Calculate consolidated confidence
      consolidated.confidence = this.calculateConsolidatedConfidence(passes);

      console.log("✅ Analysis consolidation completed", {
        consolidatedComponents: consolidated.components.length,
        layoutSections: consolidated.layout.sections?.length || 0,
        designTokens: Object.keys(consolidated.designTokens).length,
        confidence: consolidated.confidence,
      });

      return consolidated;
    } catch (error) {
      console.error("❌ Failed to consolidate analysis:", error);
      return this.createFallbackAnalysis();
    }
  }

  /**
   * Generate comprehensive wireframe description from all passes
   */
  generateWireframeDescription(passes) {
    const descriptions = [];

    if (passes.layoutStructure?.gridSystem) {
      descriptions.push(
        `${passes.layoutStructure.gridSystem.type} layout with ${passes.layoutStructure.gridSystem.columns} columns`
      );
    }

    if (passes.componentDetection?.totalComponents) {
      descriptions.push(
        `${passes.componentDetection.totalComponents} interactive components detected`
      );
    }

    if (passes.textExtraction?.textElements?.length) {
      descriptions.push(
        `${passes.textExtraction.textElements.length} text elements with typography hierarchy`
      );
    }

    if (passes.designTokens?.colorPalette?.primary) {
      descriptions.push(
        `consistent design system with ${passes.designTokens.colorPalette.primary} primary color`
      );
    }

    if (passes.interactiveElements?.primaryActions?.length) {
      descriptions.push(
        `${passes.interactiveElements.primaryActions.length} primary user actions identified`
      );
    }

    return descriptions.length > 0
      ? `A modern UI with ${descriptions.join(", ")}`
      : "A web interface with standard UI components and layout structure";
  }

  /**
   * Calculate overall confidence from all passes
   */
  calculateOverallConfidence(passes) {
    const confidences = [];

    Object.values(passes).forEach((pass) => {
      if (pass?.confidence && typeof pass.confidence === "number") {
        confidences.push(pass.confidence);
      }
    });

    if (confidences.length === 0) return 0.3;

    // Weighted average with slight boost for multiple successful passes
    const avgConfidence =
      confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    const passBonus = Math.min(confidences.length / 5, 0.1); // Up to 10% bonus for 5+ passes

    return Math.min(avgConfidence + passBonus, 1.0);
  }

  /**
   * Calculate consolidated confidence
   */
  calculateConsolidatedConfidence(passes) {
    return this.calculateOverallConfidence(passes);
  }

  /**
   * Create fallback analysis if multi-pass fails
   */
  async createFallbackAnalysis(imageUrl = null) {
    return {
      components: [
        {
          id: "fallback-1",
          type: "container",
          bounds: { x: 0, y: 0, width: 100, height: 100 },
          text: "UI components detected from uploaded image",
          properties: { color: "#323130" },
          confidence: 0.3,
        },
      ],
      layout: { type: "unknown", columns: "auto", sections: ["main"] },
      designTokens: {
        colors: ["#0078d4", "#ffffff"],
        fonts: ["Segoe UI"],
        spacing: [16, 24],
      },
      textContent: [],
      interactions: [],
      wireframeDescription:
        "Unable to perform detailed analysis - using basic layout detection",
      confidence: 0.3,
    };
  }

  /**
   * Clear analysis cache
   */
  clearCache() {
    this.analysisCache.clear();
    console.log("🧹 Multi-pass analysis cache cleared");
  }
}

module.exports = MultiPassAnalyzer;
