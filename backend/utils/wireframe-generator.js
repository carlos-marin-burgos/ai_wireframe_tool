/**
 * Generates a wireframe using Azure OpenAI with robust error handling and fallbacks
 * @param {string} description Description of the wireframe to generate
 * @param {string} designTheme Design theme to use
 * @param {string} colorScheme Color scheme to use
 * @returns {Promise<string>} The generated wireframe HTML
 */
async function generateWireframe(description, designTheme = "microsoftlearn", colorScheme = "primary") {
  // Basic validation
  if (!description || description.trim().length === 0) {
    console.log("⚠️ Empty description provided, using fallback wireframe");
    return createFallbackWireframe("Empty wireframe description", designTheme, colorScheme);
  }

  // Sanitize inputs
  const sanitizedDescription = description.trim().replace(/[<>]/g, "");
  const sanitizedTheme = (designTheme || "microsoftlearn").trim().toLowerCase();
  const sanitizedColorScheme = (colorScheme || "primary").trim().toLowerCase();

  try {
    console.log(`🔄 Generating wireframe for: "${sanitizedDescription.substring(0, 100)}${sanitizedDescription.length > 100 ? '...' : ''}"`);
    console.log(`🎨 Theme: ${sanitizedTheme}, Color scheme: ${sanitizedColorScheme}`);
    
    // Use our secure OpenAI call with retry logic
    const generatedHtml = await secureOpenAICall(async (openai) => {
      // Prepare system prompt with design guidelines
      const systemPrompt = `You are a professional front-end developer who creates React component code based on wireframe descriptions.
Follow these guidelines:
1. Create clean, accessible React component code that matches the requested description
2. Use semantic HTML elements (header, nav, main, section, article, footer) appropriately
3. Apply the ${sanitizedTheme} design system with ${sanitizedColorScheme} color scheme
4. Include responsive design with flexbox/grid layouts
5. Generate only the component code, no imports or exports
6. Add helpful comments explaining key sections
7. Focus on structure and layout more than detailed styling
8. Include reasonable placeholder content where needed
9. Ensure the code is valid and free of syntax errors`;

      // Create example prompt based on theme
      const examplePrompt = sanitizedTheme === "microsoftlearn" 
        ? `Here's an example of a Microsoft Learn card component:\n${microsoftLearnCardExample}`
        : "";

      // Make the API call
      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...(examplePrompt ? [{ role: "assistant", content: examplePrompt }] : []),
          { role: "user", content: `Create a React component for: ${sanitizedDescription}. Theme: ${sanitizedTheme}. Colors: ${sanitizedColorScheme}.` }
        ],
        temperature: 0.7,
        max_tokens: 2500,
        top_p: 0.95,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      return response.choices[0].message.content;
    }, 3); // 3 retries maximum

    // Validate the generated code
    if (!validateGeneratedCode(generatedHtml)) {
      console.warn("⚠️ Generated code failed validation, using fallback wireframe");
      return createFallbackWireframe(sanitizedDescription, sanitizedTheme, sanitizedColorScheme);
    }

    console.log("✅ Successfully generated wireframe from Azure OpenAI");
    return generatedHtml;
  } catch (error) {
    console.error("❌ Error generating wireframe with Azure OpenAI:", error);
    // Fallback to local generation if OpenAI fails
    return createFallbackWireframe(sanitizedDescription, sanitizedTheme, sanitizedColorScheme);
  }
}

/**
 * Validates the generated code for security and quality issues
 * @param {string} code The code to validate
 * @returns {boolean} Whether the code is valid
 */
function validateGeneratedCode(code) {
  // Basic sanitization and validation
  if (!code || typeof code !== 'string' || code.trim().length < 50) {
    return false;
  }
  
  // Check for potential script injection attempts
  const scriptInjectionPattern = /<script>[^<]*eval\(|<script>[^<]*document\.cookie|<script>[^<]*localStorage/i;
  if (scriptInjectionPattern.test(code)) {
    console.warn("⚠️ Potential script injection detected in generated code");
    return false;
  }
  
  // Check for basic React component structure
  const hasReactComponent = code.includes('function') || code.includes('const') || 
                          code.includes('<div') || code.includes('<section');
  if (!hasReactComponent) {
    console.warn("⚠️ Generated code does not appear to be a React component");
    return false;
  }
  
  return true;
}

// Export the wireframe generator functions
module.exports = {
  generateWireframe,
  validateGeneratedCode
};
