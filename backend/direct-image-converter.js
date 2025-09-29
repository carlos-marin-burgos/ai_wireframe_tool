const { OpenAI } = require("openai");

// HTML quality validation functions
function validateGeneratedHTML(html) {
  const issues = [];
  const suggestions = [];
  let score = 100;

  // Check for basic HTML structure
  if (!html.includes("<!DOCTYPE html>")) {
    issues.push("Missing DOCTYPE declaration");
    score -= 10;
  }

  if (!html.includes("<html")) {
    issues.push("Missing html element");
    score -= 15;
  }

  if (!html.includes("<head>") || !html.includes("</head>")) {
    issues.push("Missing or malformed head section");
    score -= 10;
  }

  if (!html.includes("<body>") || !html.includes("</body>")) {
    issues.push("Missing or malformed body section");
    score -= 15;
  }

  // Check for viewport meta tag (responsive design)
  if (!html.includes("viewport")) {
    issues.push("Missing viewport meta tag for mobile responsiveness");
    suggestions.push(
      'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
    score -= 5;
  }

  // Check for semantic HTML elements
  const semanticElements = [
    "header",
    "nav",
    "main",
    "section",
    "article",
    "aside",
    "footer",
  ];
  const foundSemanticElements = semanticElements.filter(
    (element) => html.includes(`<${element}`) || html.includes(`<${element} `)
  );

  if (foundSemanticElements.length === 0) {
    issues.push("No semantic HTML elements found");
    suggestions.push(
      "Use semantic elements like <header>, <nav>, <main>, <section> for better structure"
    );
    score -= 10;
  }

  // Check for accessibility attributes
  if (html.includes("<img") && !html.includes("alt=")) {
    issues.push("Images missing alt attributes");
    suggestions.push("Add alt attributes to all images for accessibility");
    score -= 8;
  }

  // Check for proper heading hierarchy
  const headingMatches = html.match(/<h[1-6]/g);
  if (headingMatches && headingMatches.length > 0) {
    const headingLevels = headingMatches
      .map((h) => parseInt(h.charAt(2)))
      .sort();
    if (headingLevels[0] !== 1) {
      issues.push("Heading hierarchy doesn't start with h1");
      suggestions.push(
        "Start heading hierarchy with h1 for proper document structure"
      );
      score -= 5;
    }
  }

  // Check for inline styles vs. external (we want inline for wireframes)
  const styleCount = (html.match(/style\s*=/g) || []).length;
  if (styleCount === 0) {
    issues.push("No inline styles found - wireframe may not render correctly");
    score -= 20;
  }

  // Check for minimum content length (avoid empty generations)
  if (html.length < 500) {
    issues.push("Generated HTML appears too short/incomplete");
    score -= 25;
  }

  return {
    score: Math.max(0, score),
    issues,
    suggestions,
    isValid: score >= 70, // Consider valid if score >= 70
    hasSemanticElements: foundSemanticElements.length > 0,
    hasInlineStyles: styleCount > 0,
    estimatedComplexity:
      styleCount > 20 ? "high" : styleCount > 10 ? "medium" : "low",
  };
}

// Enhance HTML with missing essential elements
function enhanceHTMLQuality(html) {
  let enhanced = html;

  // Add viewport if missing
  if (!enhanced.includes("viewport")) {
    enhanced = enhanced.replace(
      "<head>",
      '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
  }

  // Add basic charset if missing
  if (!enhanced.includes("charset")) {
    enhanced = enhanced.replace("<head>", '<head>\n    <meta charset="UTF-8">');
  }

  // Add title if missing
  if (!enhanced.includes("<title>")) {
    enhanced = enhanced.replace(
      "</head>",
      "    <title>Generated Wireframe</title>\n</head>"
    );
  }

  return enhanced;
}

// Direct image-to-HTML converter with intelligent color extraction
// Prioritizes actual image colors over theme colors for pixel-perfect accuracy
async function generateDirectWireframeFromImage(
  imageDataUrl,
  correlationId,
  designTheme = "microsoftlearn",
  colorScheme = "light"
) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

  if (!endpoint || !apiKey) {
    throw new Error("Missing OpenAI configuration");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: `${endpoint}/openai/deployments/${deployment}`,
    defaultQuery: { "api-version": apiVersion },
    defaultHeaders: { "api-key": apiKey },
  });

  // Neutral fallback colors for pure wireframes only
  const neutralColors = {
    primary: "#0078D4",
    text: "#323130",
    textSecondary: "#605E5C",
    background: "#FFFFFF",
    backgroundNeutral: "#F3F2F1",
    border: "#E1DFDD",
    success: "#107C10",
    warning: "#FFB900",
    error: "#D13438",
  };

  // Build minimal fallback color guidance for pure wireframes only
  const fallbackColorGuidance = `
  * Background: #FFFFFF (white)
  * Text: #323130 (dark gray for readability)
  * Primary: #0078D4 (neutral blue for buttons/links)
  * Secondary: #605E5C (medium gray for secondary text)
  * Borders: #E1DFDD (light gray for dividers)
  * NOTE: Only use these if no specific colors are visible in the image`;

  // Enhanced multi-phase analysis prompt for superior accuracy
  const directPrompt = `You are an expert UI/UX developer specializing in pixel-perfect wireframe recreation from screenshots.

🎨 CRITICAL INSTRUCTION: Your PRIMARY goal is to extract and preserve the EXACT colors from the uploaded image. Do not impose any brand assumptions or theme restrictions. If the image has specific colors (blue headers, red buttons, green accents, etc.), use those exact colors in your HTML output.

ANALYSIS PHASE 1: COMPONENT DETECTION & CLASSIFICATION
- Systematically scan the image from top to bottom, left to right
- Identify ALL UI components: headers, navigation bars, hero sections, cards, buttons, forms, inputs, images, lists, footers
- Note component hierarchy and nesting relationships
- Identify interactive elements (buttons, links, form controls) and their visual states
- Classify layout patterns (grid, flexbox, single-column, multi-column)

ANALYSIS PHASE 2: PRECISE LAYOUT & SPACING MEASUREMENT
- Analyze relative spacing between elements (margins, padding)
- Identify consistent spacing patterns (8px, 16px, 24px grid systems)
- Measure element proportions and aspect ratios
- Note alignment patterns (left, center, right, justified)
- Identify responsive design indicators (breakpoints, flexible layouts)

ANALYSIS PHASE 3: COMPREHENSIVE CONTENT EXTRACTION
- Extract ALL text content EXACTLY as written (preserve capitalization, punctuation, line breaks)
- Distinguish between headings, body text, labels, placeholders, and button text
- Note text hierarchy (H1, H2, H3, etc.) and typography patterns
- Identify any icons or symbolic elements and their context
- Preserve text formatting (bold, italic, underlined)

ANALYSIS PHASE 4: VISUAL DESIGN & COLOR EXTRACTION
- PRIMARY STRATEGY: Extract and preserve the ACTUAL colors from the uploaded image
  * CRITICAL: Look closely at the image to identify exact colors from ANY interface or design:
    - Header/navigation background colors (blue, purple, red, green, or any branded colors)
    - Primary button colors and accent colors
    - Text colors on different backgrounds
    - Card backgrounds and borders
    - Any brand-specific colors present in the interface
  * Extract dominant colors by sampling from large areas (headers, backgrounds, primary buttons)
  * Preserve the exact color relationships and contrast ratios from the image
  * Use hex color codes that match the image colors as closely as possible
  * Test all extracted colors for accessibility (4.5:1 contrast minimum)
  * DO NOT impose any theme restrictions - extract colors from ANY design system or brand
  
- FALLBACK STRATEGY: Only if the image appears to be a pure wireframe/mockup with no specific colors, use neutral colors:
  * Background: #FFFFFF (white)
  * Text: #323130 (dark gray)
  * Primary: #0078D4 (neutral blue)
  * Borders: #E1DFDD (light gray)

- COLOR ACCURACY PRINCIPLES:
  * ANY branded interface: Match colors exactly to preserve the original design identity
  * Custom designs: Extract and preserve the exact color palette used
  * Wireframes: Use clean, neutral colors only if no specific colors are visible
  * Mixed content: Prioritize actual colors but ensure good contrast (4.5:1 minimum)
  * Color naming: Use descriptive names in CSS (--primary-color, --header-bg, --text-color, etc.)
  * Consistency: Apply the same extracted color palette throughout the entire document
  * VALIDATION: After color extraction, verify that interactive elements are visually distinct

IMPLEMENTATION REQUIREMENTS:
1. Generate complete HTML5 document with proper DOCTYPE and semantic structure
2. Use semantic HTML elements (header, nav, main, section, article, aside, footer)
3. Apply inline CSS for precise styling and positioning with EXACT COLOR MATCHING from the image
4. Ensure responsive viewport meta tag for mobile compatibility
5. Include ALL visible text content exactly as shown
6. Implement proper accessibility attributes (alt text, ARIA labels, semantic roles)
7. Use consistent spacing and typography scale
8. Maintain exact visual hierarchy and component relationships
9. Ensure interactive elements have proper hover/focus states
10. Generate clean, production-ready code structure
11. CRITICAL: Use hex colors that precisely match the image colors, not theme defaults

QUALITY STANDARDS:
- The rendered HTML must be visually IDENTICAL to the source image, including all colors
- All colors must precisely match the image - no arbitrary theme color substitutions
- CRITICAL: Extract colors from ANY design system, brand, or interface - do not favor any specific brand
- All text must be searchable and selectable (no text-as-images)
- Layout must maintain proportions and spacing relationships
- Code must be clean, semantic, and accessible
- Color contrast ratios must meet accessibility standards (preserve original if good, improve if poor)
- Styling must preserve the original design aesthetic and brand identity regardless of the source

Return ONLY the complete, valid HTML code starting with <!DOCTYPE html> and ending with </html>.
NO explanations, NO markdown formatting, NO code blocks - just the raw HTML document.`;

  // Fallback prompts for retry mechanism
  const fallbackPrompt = `You are an experienced web developer. Convert this UI screenshot into clean, semantic HTML.

REQUIREMENTS:
1. Extract ALL visible text exactly as shown
2. Use semantic HTML5 elements (header, nav, main, section, etc.)
3. CRITICAL: Extract and use the ACTUAL colors from the image - analyze the image carefully for any brand colors, interface colors, or design-specific colors
4. Match colors exactly using hex codes - do not impose any theme or brand assumptions
5. Only use neutral fallback colors if the image appears to be a pure wireframe with no specific colors:
${fallbackColorGuidance}
6. Recreate the exact layout and spacing
7. Include proper accessibility attributes

Return complete HTML document from <!DOCTYPE html> to </html>. No explanations.`;

  const basicPrompt = `Convert this UI screenshot to HTML. Extract all text exactly. Use inline CSS. 

CRITICAL: Use the actual colors from the image, not theme colors. Match the image colors precisely.

Only use these fallback colors if the image is clearly a neutral wireframe:
${fallbackColorGuidance}

Return only HTML code, no explanations.`;

  const prompts = [
    {
      name: "enhanced",
      content: directPrompt,
      temperature: 0.05,
      maxTokens: 6000,
    },
    {
      name: "fallback",
      content: fallbackPrompt,
      temperature: 0.1,
      maxTokens: 4000,
    },
    { name: "basic", content: basicPrompt, temperature: 0.15, maxTokens: 3000 },
  ];

  // Retry logic - try enhanced prompt first, fallback if quality is poor
  let lastError;
  let bestResult = null;

  for (let attempt = 0; attempt < prompts.length; attempt++) {
    const promptConfig = prompts[attempt];

    try {
      console.log(
        `[${correlationId}] Attempt ${attempt + 1}: Using ${
          promptConfig.name
        } prompt`
      );

      const response = await client.chat.completions.create({
        model: deployment,
        temperature: promptConfig.temperature,
        max_tokens: promptConfig.maxTokens,
        top_p: 0.95,
        messages: [
          {
            role: "system",
            content:
              "You are a senior UI/UX developer and design systems expert with 10+ years of experience recreating pixel-perfect interfaces from screenshots. You specialize in semantic HTML5, responsive design, accessibility compliance, and Microsoft design language. Your wireframes are known for their accuracy, clean code structure, and perfect visual fidelity to the source material.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: promptConfig.content },
              {
                type: "image_url",
                image_url: { url: imageDataUrl, detail: "high" },
              },
            ],
          },
        ],
      });

      const htmlContent = response.choices[0]?.message?.content?.trim();

      if (htmlContent && htmlContent.includes("<!DOCTYPE html>")) {
        // Validate and enhance the generated HTML
        const validation = validateGeneratedHTML(htmlContent);

        console.log(
          `[${correlationId}] ${promptConfig.name} prompt - Quality score: ${validation.score}%`
        );

        if (validation.issues.length > 0) {
          console.log(
            `[${correlationId}] Quality issues found:`,
            validation.issues.slice(0, 3)
          ); // Log first 3 issues
        }

        // Enhance HTML with missing essential elements
        const enhancedHTML = enhanceHTMLQuality(htmlContent);

        // Re-validate after enhancements
        const finalValidation = validateGeneratedHTML(enhancedHTML);

        const result = {
          html: enhancedHTML,
          source: `direct-vision-${promptConfig.name}`,
          confidence: Math.min(0.95, finalValidation.score / 100),
          quality: {
            score: finalValidation.score,
            issues: finalValidation.issues,
            suggestions: finalValidation.suggestions,
            complexity: finalValidation.estimatedComplexity,
            hasSemanticElements: finalValidation.hasSemanticElements,
            hasInlineStyles: finalValidation.hasInlineStyles,
          },
          promptUsed: promptConfig.name,
          attempt: attempt + 1,
        };

        // If quality is good enough (score >= 80) or this is our last attempt, return result
        if (finalValidation.score >= 80 || attempt === prompts.length - 1) {
          console.log(
            `[${correlationId}] Accepting result from ${promptConfig.name} prompt (score: ${finalValidation.score}%)`
          );
          return result;
        }

        // Save best result so far in case all attempts fail to meet threshold
        if (!bestResult || finalValidation.score > bestResult.quality.score) {
          bestResult = result;
        }

        console.log(
          `[${correlationId}] Score ${finalValidation.score}% below threshold (80%), trying next prompt...`
        );
      } else {
        throw new Error(
          `${promptConfig.name} prompt generated invalid HTML structure`
        );
      }
    } catch (error) {
      console.error(
        `[${correlationId}] ${promptConfig.name} prompt failed:`,
        error.message
      );
      lastError = error;

      // If this is our last attempt and we have no good result, we'll throw
      if (attempt === prompts.length - 1 && !bestResult) {
        throw error;
      }
    }
  }

  // If we get here, return the best result we found
  if (bestResult) {
    console.log(
      `[${correlationId}] Returning best result found (score: ${bestResult.quality.score}%)`
    );
    return bestResult;
  }

  // This should not happen, but just in case
  throw lastError || new Error("All conversion attempts failed");
}

module.exports = {
  generateDirectWireframeFromImage,
};
