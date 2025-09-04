/**
 * Enhanced OpenAI-powered wireframe generation
 * Uses advanced prompting and multiple validation passes for accurate HTML generation
 */

class EnhancedWireframeGenerator {
  constructor(openaiClient) {
    this.openai = openaiClient;
  }

  /**
   * Generates enhanced wireframes using OpenAI with detailed component analysis
   */
  async generateEnhancedWireframe(
    description,
    imageAnalysis = null,
    correlationId
  ) {
    console.log("🎨 Starting enhanced OpenAI wireframe generation", {
      correlationId,
      hasImageAnalysis: !!imageAnalysis,
      componentsCount: imageAnalysis?.components?.length || 0,
    });

    try {
      // Phase 1: Intelligent Prompt Engineering
      const enhancedPrompt = this.buildIntelligentPrompt(
        description,
        imageAnalysis
      );

      // Phase 2: Generate Initial Wireframe
      const initialWireframe = await this.generateInitialWireframe(
        enhancedPrompt,
        correlationId
      );

      // Phase 3: Component Validation and Enhancement
      const validatedWireframe = await this.validateAndEnhanceComponents(
        initialWireframe,
        imageAnalysis,
        correlationId
      );

      // Phase 4: Accessibility and Quality Enhancement
      const finalWireframe = await this.enhanceAccessibilityAndQuality(
        validatedWireframe,
        correlationId
      );

      console.log("✅ Enhanced wireframe generation completed", {
        correlationId,
        htmlLength: finalWireframe.length,
        hasValidStructure: finalWireframe.includes("<!DOCTYPE html>"),
        enhancementLevel: "maximum",
      });

      return finalWireframe;
    } catch (error) {
      console.error("❌ Enhanced wireframe generation failed:", error);
      // Fallback to basic generation
      return this.generateBasicWireframe(description);
    }
  }

  /**
   * Builds intelligent prompts based on image analysis and context
   */
  buildIntelligentPrompt(description, imageAnalysis) {
    let prompt = `Create a professional HTML wireframe for: ${description}`;

    if (imageAnalysis && imageAnalysis.components) {
      prompt += `\n\n🎯 BASED ON UPLOADED IMAGE ANALYSIS:\n`;
      prompt += `- Detected ${imageAnalysis.components.length} UI components\n`;
      prompt += `- Layout type: ${imageAnalysis.layout?.type || "flexible"}\n`;
      prompt += `- Confidence level: ${Math.round(
        (imageAnalysis.confidence || 0.8) * 100
      )}%\n`;

      // Add component-specific guidance
      const componentTypes = imageAnalysis.components.reduce((acc, comp) => {
        acc[comp.type] = (acc[comp.type] || 0) + 1;
        return acc;
      }, {});

      prompt += `- Component breakdown: ${Object.entries(componentTypes)
        .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
        .join(", ")}\n`;

      // Extract and use colors from the uploaded image
      if (imageAnalysis.designTokens) {
        if (imageAnalysis.designTokens.colors?.length > 0) {
          const extractedColors = imageAnalysis.designTokens.colors.slice(0, 5);
          prompt += `- Colors extracted from image: ${extractedColors.join(
            ", "
          )}\n`;
          prompt += `- USE THESE EXACT COLORS in the wireframe styling\n`;
        }
        if (imageAnalysis.designTokens.fonts?.length > 0) {
          prompt += `- Typography detected: ${imageAnalysis.designTokens.fonts
            .slice(0, 2)
            .join(", ")}\n`;
        }
      }

      // Use the wireframe description from analysis
      if (imageAnalysis.wireframeDescription) {
        prompt += `\n📝 WIREFRAME CONTEXT FROM IMAGE:\n${imageAnalysis.wireframeDescription}\n`;
      }

      // CRITICAL: NO Microsoft branding for uploaded images
      prompt += `\n🚫 IMPORTANT RESTRICTIONS FOR UPLOADED IMAGE WIREFRAMES:
- DO NOT include Microsoft navigation/header elements
- DO NOT include Microsoft Learn branding or logos
- DO NOT include Microsoft footer elements
- CREATE ONLY what was shown in the uploaded image
- Use ONLY the colors detected from the uploaded image
- Focus on the actual content from the image, not Microsoft templates\n`;
    }

    prompt += `\n\n🎨 ENHANCED REQUIREMENTS:
1. **Clean Design**: Use clean, minimal styling without Microsoft branding (for uploaded images)
2. **Responsive Design**: Mobile-first approach with proper viewport meta
3. **Accessibility**: ARIA labels, semantic HTML, proper heading hierarchy
4. **Modern Layout**: CSS Grid/Flexbox, modern spacing (8px grid)
5. **Interactive Elements**: Proper hover states and focus indicators
6. **Performance**: Optimized CSS, minimal inline styles
7. **Professional Quality**: Production-ready code structure
8. **Color Accuracy**: Use EXACT colors from uploaded image when available

🏗️ STRUCTURE REQUIREMENTS:
- Complete HTML document with DOCTYPE, head, and body
- Semantic HTML5 elements (header, main, section, article, footer if needed)
- Proper meta tags for viewport and charset
- Internal CSS with organized sections
- Extract and use colors from uploaded image analysis
- Responsive breakpoints for mobile, tablet, desktop
- Consistent spacing using 8px grid system

🎯 COMPONENT GUIDELINES FOR UPLOADED IMAGES:
- Navigation: Create custom nav matching the uploaded image (NO Microsoft branding)
- Buttons: Use colors extracted from the uploaded image
- Cards: Match styling and colors from the image
- Forms: Use image-extracted colors and styling
- Content: Typography and colors based on image analysis
- Layout: Replicate the exact layout structure from the image
- NO Microsoft Learn templates or branding elements

Return ONLY the complete HTML code, no explanations or markdown.`;

    return prompt;
  }

  /**
   * Generates initial wireframe with enhanced prompting
   */
  async generateInitialWireframe(prompt, correlationId) {
    console.log("🔧 Phase 1: Generating initial wireframe", { correlationId });

    const response = await this.openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert frontend developer specializing in accurate wireframe recreation from uploaded images. 
          You create production-quality HTML wireframes that EXACTLY match what was shown in uploaded images.
          When working with uploaded images: NO Microsoft branding, NO Microsoft Learn elements, NO default templates.
          Use ONLY the colors, layout, and components visible in the uploaded image.
          Always return complete, valid HTML documents that replicate the uploaded image accurately.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 6000,
      temperature: 0.1, // Low temperature for consistent, professional output
    });

    return response.choices[0].message.content.trim();
  }

  /**
   * Validates and enhances components based on image analysis
   */
  async validateAndEnhanceComponents(html, imageAnalysis, correlationId) {
    if (!imageAnalysis || !imageAnalysis.components) {
      return html; // Skip if no analysis available
    }

    console.log("🔍 Phase 2: Validating and enhancing components", {
      correlationId,
    });

    const validationPrompt = `
Review and enhance this HTML wireframe to better match the detected components from the uploaded image:

DETECTED COMPONENTS FROM UPLOADED IMAGE:
${JSON.stringify(imageAnalysis.components, null, 2)}

EXTRACTED COLORS FROM IMAGE:
${
  imageAnalysis.designTokens?.colors
    ? JSON.stringify(imageAnalysis.designTokens.colors, null, 2)
    : "No colors detected"
}

CURRENT HTML:
${html}

Please enhance the HTML to:
1. **Match Component Count**: Ensure similar number and types of components as in uploaded image
2. **Accurate Positioning**: Reflect the exact layout structure from image analysis
3. **Use Image Colors**: Apply ONLY the colors extracted from the uploaded image
4. **Component Properties**: Use detected text, styling, and positioning from image
5. **NO Microsoft Branding**: Remove any Microsoft navigation, logos, or footer elements
6. **Responsive Behavior**: Maintain professional responsive design
7. **Accessibility**: Keep all accessibility features intact

CRITICAL: This wireframe should match ONLY what was in the uploaded image. 
Do NOT add Microsoft Learn branding, navigation, or footer elements.
Use ONLY the extracted colors from the image analysis.

Return ONLY the complete enhanced HTML code.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a senior frontend developer expert in accurately recreating components from uploaded images. Focus on matching the uploaded image exactly, using detected colors and layout. NO Microsoft branding for uploaded image wireframes.",
          },
          {
            role: "user",
            content: validationPrompt,
          },
        ],
        max_tokens: 6000,
        temperature: 0.05,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.warn("⚠️ Component validation failed:", error.message);
      return html; // Return original if validation fails
    }
  }

  /**
   * Enhances accessibility and overall quality while preserving uploaded image accuracy
   */
  async enhanceAccessibilityAndQuality(html, correlationId) {
    console.log("♿ Phase 3: Enhancing accessibility and quality", {
      correlationId,
    });

    const accessibilityPrompt = `
Enhance this HTML wireframe for maximum accessibility and quality while preserving the original uploaded image design:

${html}

Apply these enhancements:

🌟 **ACCESSIBILITY**:
- ARIA landmarks and labels
- Proper heading hierarchy (h1 -> h2 -> h3)
- Alt text for images
- Focus management and keyboard navigation
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader friendly structure

🎨 **QUALITY IMPROVEMENTS**:
- Consistent spacing and alignment
- Professional hover and focus states
- Smooth transitions and animations
- Optimized CSS organization
- Performance optimizations
- Cross-browser compatibility

🔧 **CODE QUALITY**:
- Clean, semantic HTML structure
- Organized CSS with comments
- Consistent naming conventions
- Proper meta tags and SEO basics
- Valid HTML5 structure

🚫 **CRITICAL RESTRICTIONS**:
- DO NOT add Microsoft branding, navigation, or footer elements
- PRESERVE the colors and design from the uploaded image
- MAINTAIN the exact layout and components from the original image
- NO Microsoft Learn templates or default styling

Return the final enhanced HTML that represents professional, production-ready code that matches the uploaded image.
Return ONLY the complete HTML code.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an accessibility expert and senior frontend architect who creates perfect, production-ready web interfaces from uploaded images. Preserve the original image design while enhancing accessibility. NO Microsoft branding for uploaded image wireframes.",
          },
          {
            role: "user",
            content: accessibilityPrompt,
          },
        ],
        max_tokens: 6000,
        temperature: 0.02, // Minimal creativity for consistency
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.warn("⚠️ Accessibility enhancement failed:", error.message);
      return html; // Return current version if enhancement fails
    }
  }

  /**
   * Fallback basic wireframe generation
   */
  generateBasicWireframe(description) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireframe - ${description}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #323130; margin-bottom: 24px; }
        .placeholder { background: #e1dfdd; padding: 40px; text-align: center; border-radius: 4px; color: #605e5c; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Wireframe: ${description}</h1>
        <div class="placeholder">
            Enhanced wireframe generation is temporarily unavailable. Basic fallback wireframe displayed.
        </div>
    </div>
</body>
</html>`;
  }
}

module.exports = EnhancedWireframeGenerator;
