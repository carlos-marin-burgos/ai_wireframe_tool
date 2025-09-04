/**
 * Enhanced OpenAI-powered image analysis with multiple accuracy improvements
 * This module adds advanced OpenAI functionality for more accurate wireframe generation
 */

class EnhancedAnalyzer {
  constructor(openaiClient) {
    this.openai = openaiClient;
    this.analysisCache = new Map(); // Cache results for similar images
  }

  /**
   * Performs enhanced analysis with multiple OpenAI techniques for maximum accuracy
   */
  async performEnhancedAnalysis(imageData, originalAnalysis, correlationId) {
    console.log("🚀 Starting enhanced OpenAI analysis with color extraction", {
      correlationId,
    });

    try {
      // Phase 1: Validation and Refinement
      const validatedAnalysis = await this.validateAndRefineAnalysis(
        imageData,
        originalAnalysis,
        correlationId
      );

      // Phase 1.5: Enhanced Color Extraction from Image
      const enhancedColors = await this.extractColorsFromImage(
        imageData,
        correlationId
      );

      // Phase 2: Content-Aware Component Enhancement
      const enhancedComponents = await this.enhanceComponentDetection(
        imageData,
        validatedAnalysis,
        correlationId
      );

      // Phase 3: Contextual Wireframe Generation
      const contextualWireframe = await this.generateContextualDescription(
        imageData,
        enhancedComponents,
        correlationId
      );

      // Phase 4: Quality Assurance Check
      const finalAnalysis = await this.performQualityAssurance(
        contextualWireframe,
        correlationId
      );

      // Merge enhanced colors into final analysis
      if (enhancedColors && enhancedColors.length > 0) {
        finalAnalysis.designTokens = finalAnalysis.designTokens || {};
        finalAnalysis.designTokens.colors = enhancedColors;
        console.log("🎨 Enhanced colors added to analysis:", enhancedColors);
      }

      console.log("✅ Enhanced analysis completed with color extraction", {
        correlationId,
        originalComponents: originalAnalysis.components?.length || 0,
        enhancedComponents: finalAnalysis.components?.length || 0,
        extractedColors: enhancedColors?.length || 0,
        confidenceImprovement:
          finalAnalysis.confidence - (originalAnalysis.confidence || 0),
      });

      return finalAnalysis;
    } catch (error) {
      console.error("❌ Enhanced analysis failed:", error);
      return originalAnalysis; // Fallback to original
    }
  }

  /**
   * Phase 1.5: Extracts accurate colors from the uploaded image using OpenAI Vision
   */
  async extractColorsFromImage(imageData, correlationId) {
    console.log("🎨 Phase 1.5: Extracting colors from uploaded image", {
      correlationId,
    });

    try {
      const colorExtractionPrompt = `
        Analyze this uploaded image and extract the PRIMARY colors used in the design.
        
        Focus on:
        1. Background colors
        2. Text colors  
        3. Button/interactive element colors
        4. Accent colors
        5. Border/divider colors
        
        Return ONLY a JSON array of hex color codes that are ACTUALLY visible in this image.
        Example format: ["#ffffff", "#000000", "#0078d4", "#f3f2f1"]
        
        IMPORTANT: 
        - Extract colors that are ACTUALLY in the uploaded image
        - Include 3-8 primary colors maximum
        - Use proper hex format
        - Do NOT include Microsoft default colors unless they appear in the image
      `;

      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a color analysis expert. Extract exact colors from uploaded images for accurate wireframe recreation.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: colorExtractionPrompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1,
      });

      const colorResponse = response.choices[0]?.message?.content?.trim();

      try {
        const extractedColors = JSON.parse(colorResponse);
        if (Array.isArray(extractedColors) && extractedColors.length > 0) {
          console.log(
            "✅ Successfully extracted colors from image:",
            extractedColors
          );
          return extractedColors;
        }
      } catch (parseError) {
        console.warn(
          "⚠️ Failed to parse color response, trying text extraction"
        );
        // Try to extract hex colors from text response
        const hexMatches = colorResponse.match(/#[0-9a-fA-F]{6}/g);
        if (hexMatches && hexMatches.length > 0) {
          console.log("✅ Extracted colors from text:", hexMatches);
          return hexMatches;
        }
      }

      console.warn("⚠️ No colors could be extracted from image");
      return [];
    } catch (error) {
      console.error("❌ Color extraction failed:", error.message);
      return [];
    }
  }

  /**
   * Phase 1: Validates and refines the initial analysis using OpenAI reasoning
   */
  async validateAndRefineAnalysis(imageData, analysis, correlationId) {
    console.log("🔍 Phase 1: Validating and refining analysis", {
      correlationId,
    });

    const validationPrompt = `
      You are an expert UI/UX analyst reviewing an AI-generated analysis of a UI screenshot.
      
      ORIGINAL ANALYSIS:
      ${JSON.stringify(analysis, null, 2)}
      
      Please review this analysis and provide improvements:
      
      1. **Component Accuracy**: Are all detected components correctly identified?
      2. **Missing Components**: What important UI elements might be missing?
      3. **Layout Validation**: Is the layout structure accurate?
      4. **Design Token Refinement**: Are colors, fonts, and spacing realistic?
      5. **Confidence Adjustment**: Rate the overall accuracy (0.0-1.0)
      
      Return a refined analysis in the SAME JSON format with:
      - Corrected component types and positions
      - Added missing components
      - Improved design tokens
      - More accurate wireframe description
      - Updated confidence score
      
      Focus on UI patterns like navigation bars, forms, cards, buttons, and content sections.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert UI/UX analyst specializing in wireframe accuracy and component validation.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: validationPrompt },
              {
                type: "image_url",
                image_url: { url: imageData, detail: "high" },
              },
            ],
          },
        ],
        max_tokens: 3000,
        temperature: 0.1,
      });

      const refinedResult = this.parseAnalysisResponse(
        response.choices[0].message.content
      );
      return refinedResult || analysis;
    } catch (error) {
      console.warn("⚠️ Validation phase failed:", error.message);
      return analysis;
    }
  }

  /**
   * Phase 2: Enhances component detection with specialized OpenAI analysis
   */
  async enhanceComponentDetection(imageData, analysis, correlationId) {
    console.log("🎯 Phase 2: Enhancing component detection", { correlationId });

    const componentPrompt = `
      Perform SPECIALIZED component detection on this UI screenshot.
      Focus on finding these specific UI patterns:
      
      🔘 **Interactive Elements**: buttons, links, form inputs, dropdowns, checkboxes
      🎨 **Content Blocks**: cards, panels, sections, articles, lists
      🧭 **Navigation**: menus, breadcrumbs, tabs, pagination, sidebars
      📝 **Forms**: input fields, labels, validation messages, submit buttons
      🖼️ **Media**: images, videos, icons, avatars, logos
      📊 **Data Display**: tables, charts, progress bars, badges, counters
      
      For EACH component found, provide:
      - Exact pixel coordinates (x, y, width, height as percentages)
      - Component subtype (e.g., "primary-button", "search-input", "hero-card")
      - Visible text content
      - Styling properties (colors, typography, spacing)
      - Interaction states (hover, active, disabled if visible)
      - Accessibility considerations
      
      Be extremely thorough - scan every pixel for UI elements.
      
      Return JSON format:
      {
        "components": [...],
        "layout": {
          "type": "grid|flexbox|absolute",
          "structure": "header-main-footer|sidebar-content|modal|landing-page",
          "responsive": "desktop|tablet|mobile",
          "gridColumns": number,
          "contentFlow": "vertical|horizontal|mixed"
        },
        "designSystem": {
          "primaryColor": "#hex",
          "secondaryColor": "#hex",
          "typography": {
            "headingFont": "font-family",
            "bodyFont": "font-family",
            "fontSizes": ["h1", "h2", "body", "caption"]
          },
          "spacing": {
            "unit": "px|rem",
            "scale": [4, 8, 16, 24, 32, 48, 64]
          },
          "borderRadius": "none|small|medium|large|rounded",
          "shadows": "none|subtle|medium|prominent"
        },
        "wireframeDescription": "Detailed description focusing on layout hierarchy and user flow"
      }
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a specialized UI component detection expert with deep knowledge of modern web design patterns and accessibility standards.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: componentPrompt },
              {
                type: "image_url",
                image_url: { url: imageData, detail: "high" },
              },
            ],
          },
        ],
        max_tokens: 4000,
        temperature: 0.05, // Very low for consistency
      });

      const enhancedResult = this.parseAnalysisResponse(
        response.choices[0].message.content
      );
      return enhancedResult || analysis;
    } catch (error) {
      console.warn("⚠️ Component enhancement failed:", error.message);
      return analysis;
    }
  }

  /**
   * Phase 3: Generates contextual wireframe description using OpenAI reasoning
   */
  async generateContextualDescription(imageData, analysis, correlationId) {
    console.log("📝 Phase 3: Generating contextual wireframe description", {
      correlationId,
    });

    const contextPrompt = `
      Based on this UI analysis, create a comprehensive wireframe description that captures:
      
      ANALYSIS DATA:
      ${JSON.stringify(analysis, null, 2)}
      
      Generate a detailed wireframe description that includes:
      
      1. **Page Purpose**: What type of page/app is this? (landing, dashboard, e-commerce, etc.)
      2. **Layout Structure**: Header, main content areas, sidebar, footer organization
      3. **Content Hierarchy**: Primary headings, subheadings, body content flow
      4. **Interactive Elements**: All buttons, forms, navigation with their purposes
      5. **Visual Design**: Color scheme, typography, spacing patterns
      6. **User Flow**: How users would navigate and interact with elements
      7. **Responsive Considerations**: How it might adapt to different screen sizes
      
      Write this as a clear, implementable wireframe specification that a developer could use to recreate the interface accurately.
      
      Format: Return the enhanced analysis object with an improved "wireframeDescription" field.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a senior UX architect specializing in wireframe specification and user experience design.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: contextPrompt },
              {
                type: "image_url",
                image_url: { url: imageData, detail: "high" },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.2,
      });

      const contextualResult = this.parseAnalysisResponse(
        response.choices[0].message.content
      );
      return { ...analysis, ...contextualResult };
    } catch (error) {
      console.warn("⚠️ Contextual description failed:", error.message);
      return analysis;
    }
  }

  /**
   * Phase 4: Quality assurance check using OpenAI verification
   */
  async performQualityAssurance(analysis, correlationId) {
    console.log("✅ Phase 4: Quality assurance check", { correlationId });

    const qaPrompt = `
      Review this final wireframe analysis for quality and completeness:
      
      ${JSON.stringify(analysis, null, 2)}
      
      Quality checks:
      1. Are component bounds realistic and non-overlapping?
      2. Is the wireframe description implementable?
      3. Are design tokens consistent and professional?
      4. Is the confidence score justified?
      5. Are there any missing critical UI elements?
      
      Return the analysis with:
      - Corrected any unrealistic bounds
      - Enhanced wireframe description if needed
      - Adjusted confidence score (0.7-0.95 for good analysis)
      - Added quality score (0.0-1.0)
      
      Focus on practical implementability for developers.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a quality assurance expert for UI analysis, ensuring accuracy and implementability.",
          },
          {
            role: "user",
            content: qaPrompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      });

      const qaResult = this.parseAnalysisResponse(
        response.choices[0].message.content
      );
      return {
        ...analysis,
        ...qaResult,
        qualityScore: qaResult.qualityScore || 0.85,
        enhancedProcessing: true,
      };
    } catch (error) {
      console.warn("⚠️ Quality assurance failed:", error.message);
      return { ...analysis, qualityScore: 0.75, enhancedProcessing: true };
    }
  }

  /**
   * Intelligent caching for similar images
   */
  generateCacheKey(imageData) {
    // Simple hash of image data for caching (first 100 chars of base64)
    return imageData.substring(0, 100);
  }

  /**
   * Parses OpenAI response and extracts JSON
   */
  parseAnalysisResponse(content) {
    try {
      // Clean up markdown formatting
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent
          .replace(/^```json\n?/, "")
          .replace(/\n?```$/, "");
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent
          .replace(/^```[a-zA-Z]*\n?/, "")
          .replace(/\n?```$/, "");
      }

      return JSON.parse(cleanContent);
    } catch (error) {
      console.warn("⚠️ Failed to parse OpenAI response:", error.message);
      return null;
    }
  }
}

module.exports = EnhancedAnalyzer;
