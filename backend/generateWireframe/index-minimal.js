// Minimal wireframe generator - simplified for production deployment
const { OpenAI } = require("openai");

// Initialize OpenAI client
let openaiClient = null;

function initializeOpenAI() {
  if (
    !openaiClient &&
    process.env.AZURE_OPENAI_KEY &&
    process.env.AZURE_OPENAI_ENDPOINT
  ) {
    try {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
      const apiVersion =
        process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

      openaiClient = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        baseURL: `${endpoint}/openai/deployments/${deployment}`,
        defaultQuery: { "api-version": apiVersion },
        defaultHeaders: {
          "api-key": process.env.AZURE_OPENAI_KEY,
        },
      });
      return true;
    } catch (error) {
      console.error("Failed to initialize OpenAI:", error);
      return false;
    }
  }
  return !!openaiClient;
}

// Simple wireframe generation
async function generateSimpleWireframe(description) {
  try {
    if (!initializeOpenAI()) {
      throw new Error("OpenAI not available");
    }

    const prompt = `Create a complete HTML wireframe for: ${description}

Requirements:
- Complete HTML document with DOCTYPE
- Microsoft Learn style (Segoe UI, #0078d4 primary color)
- Responsive design with inline CSS
- Professional layout with header, main content, and footer
- Clean, modern appearance

Return only valid HTML code.`;

    const response = await openaiClient.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert HTML/CSS developer." },
        { role: "user", content: prompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    let html = response.choices[0]?.message?.content;
    if (!html) throw new Error("No response from AI");

    // Clean up markdown
    html = html.replace(/^```html\n?/, "").replace(/\n?```$/, "");
    html = html.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");

    return html;
  } catch (error) {
    console.error("AI generation failed:", error);
    return null;
  }
}

// Fallback template
function getFallbackTemplate(description) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: #f8f9fa; 
            color: #171717; 
        }
        .header { 
            background: #0078d4; 
            color: white; 
            padding: 20px; 
            text-align: center; 
        }
        .main { 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 0 20px; 
        }
        .card { 
            background: white; 
            padding: 24px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            margin-bottom: 20px; 
        }
        .btn { 
            background: #0078d4; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
        }
        .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            margin-top: 40px; 
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>Microsoft Learn</h1>
        <p>Wireframe: ${description}</p>
    </header>
    <main class="main">
        <div class="card">
            <h2>Generated Wireframe</h2>
            <p>This wireframe was created based on: "${description}"</p>
            <button class="btn">Get Started</button>
        </div>
        <div class="card">
            <h3>Features</h3>
            <ul>
                <li>Responsive design</li>
                <li>Microsoft Learn styling</li>
                <li>Professional layout</li>
            </ul>
        </div>
    </main>
    <footer class="footer">
        <p>© Microsoft Learn - Wireframe Generator</p>
    </footer>
</body>
</html>`;
}

// Main Azure Function handler
module.exports = async function (context, req) {
  context.log("Wireframe generation request received");

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: "",
    };
    return;
  }

  try {
    // Get prompt from request
    const prompt =
      req.body?.prompt ||
      req.body?.description ||
      req.body?.requirements ||
      "Create a basic wireframe";

    context.log("Generating wireframe for:", prompt);

    // Try AI generation first
    let html = await generateSimpleWireframe(prompt);

    // Use fallback if AI fails
    if (!html || html.length < 100) {
      context.log("Using fallback template");
      html = getFallbackTemplate(prompt);
    }

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: {
        success: true,
        wireframe: html,
        aiGenerated: html.length > 1000,
        source: html.length > 1000 ? "openai" : "fallback",
        timestamp: new Date().toISOString(),
      },
    };

    context.log("Wireframe generated successfully");
  } catch (error) {
    context.log.error("Error generating wireframe:", error);

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: {
        success: true,
        wireframe: getFallbackTemplate("Error occurred"),
        aiGenerated: false,
        source: "error-fallback",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
    };
  }
};
