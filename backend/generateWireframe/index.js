const { OpenAI } = require("openai");

// Initialize OpenAI client
let openai = null;

function initializeOpenAI() {
  try {
    if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
      const apiVersion =
        process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: {
          "api-key": process.env.AZURE_OPENAI_KEY,
        },
      });

      console.log("✅ OpenAI client initialized successfully");
      return true;
    }
    console.log("⚠️ OpenAI environment variables not found");
    return false;
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI client:", error);
    return false;
  }
}

// Initialize on startup
initializeOpenAI();

// Simple fallback wireframe generator
// NO MORE FALLBACK FUNCTIONS - AI ONLY!

// AI wireframe generation
async function generateWithAI(description) {
  if (!openai) {
    throw new Error("OpenAI not initialized");
  }

  const prompt = `Create a complete HTML wireframe for Microsoft Learn platform based on: "${description}"

Requirements:
- Use Microsoft Learn design system (Blues: #0078d4, #005a9e; Grays: #f3f2f1, #605e5c)
- Include Segoe UI font family
- Make it responsive and accessible
- Include the exact components requested in the description
- Use semantic HTML and modern CSS

Generate ONLY the HTML code (starting with <!DOCTYPE html>).`;

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

// Main Azure Function
module.exports = async function (context, req) {
  const startTime = Date.now();

  try {
    // Set CORS headers
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    };

    // Handle OPTIONS request
    if (req.method === "OPTIONS") {
      context.res.status = 200;
      context.res.body = "";
      return;
    }

    // Validate request
    if (req.method !== "POST") {
      context.res.status = 405;
      context.res.body = JSON.stringify({ error: "Method not allowed" });
      return;
    }

    const { description } = req.body || {};

    if (!description) {
      context.res.status = 400;
      context.res.body = JSON.stringify({ error: "Description is required" });
      return;
    }

    let html;
    let source = "openai";

    // ONLY AI generation - NO FALLBACKS!
    if (!openai) {
      context.res.status = 503;
      context.res.body = JSON.stringify({
        success: false,
        error: "AI_SERVICE_UNAVAILABLE",
        message:
          "AI service is not available. Please check the service status and try again.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      html = await generateWithAI(description);
      if (!html || !html.includes("<!DOCTYPE html>") || html.length < 1000) {
        throw new Error("AI response insufficient or invalid");
      }
    } catch (aiError) {
      console.error("❌ AI generation failed:", aiError.message);

      context.res.status = 503;
      context.res.body = JSON.stringify({
        success: false,
        error: "AI_GENERATION_FAILED",
        message: `AI generation failed: ${aiError.message}. No fallback templates available - only real AI generation.`,
        timestamp: new Date().toISOString(),
        details: aiError.message,
      });
      return;
    }

    const processingTime = Date.now() - startTime;

    context.res.status = 200;
    context.res.body = {
      html,
      source,
      aiGenerated: source === "openai",
      processingTimeMs: processingTime,
      fallback: source === "fallback",
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("❌ Function error:", error);

    // NO EMERGENCY FALLBACK - Return proper error
    context.res.status = 500;
    context.res.body = JSON.stringify({
      success: false,
      error: "FUNCTION_ERROR",
      message:
        "Internal server error occurred. No fallback templates available.",
      timestamp: new Date().toISOString(),
      processingTimeMs: processingTime,
    });
  }
};
