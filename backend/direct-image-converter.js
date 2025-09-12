const { OpenAI } = require("openai");

// Direct image-to-HTML converter that actually works
async function generateDirectWireframeFromImage(imageDataUrl, correlationId) {
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

  const directPrompt = `You are an expert web developer. Look at this UI screenshot and recreate it as a clean wireframe-style HTML.

CRITICAL REQUIREMENTS:
1. Extract ALL text EXACTLY as it appears in the image
2. For colors: If the image has specific branded colors, match them exactly. If the image appears to be a wireframe or has neutral colors, use clean wireframe colors:
   - Backgrounds: #F8F9FA (very light gray) or #FFFFFF (white)
   - Text: #3C4858 (dark slate gray for readability)
   - Borders: #E9ECEF (very light borders)
   - Secondary elements: #CBC2C2 (light warm gray)
   - Buttons/accents: #8E9AAF (medium blue-gray) or #68769C (darker blue-gray)
3. Recreate the EXACT layout and positioning
4. Use inline CSS for precise styling
5. Include ALL visible elements

Return ONLY the complete HTML code (starting with <!DOCTYPE html> and ending with </html>). 
The HTML should look IDENTICAL to the uploaded image when rendered, with clean wireframe styling when appropriate.

DO NOT add any explanations or markdown - just the raw HTML code.`;

  try {
    const response = await client.chat.completions.create({
      model: deployment,
      temperature: 0.1,
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content:
            "You are an expert web developer who recreates UIs pixel-perfectly from screenshots.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: directPrompt },
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
      return {
        html: htmlContent,
        source: "direct-vision",
        confidence: 0.9,
      };
    } else {
      throw new Error("Generated content is not valid HTML");
    }
  } catch (error) {
    console.error(`[${correlationId}] Direct conversion failed:`, error);
    throw error;
  }
}

module.exports = {
  generateDirectWireframeFromImage,
};
