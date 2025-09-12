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
function createSimpleFallback(description) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Learn - ${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: #f3f2f1; 
            color: #171717; 
            line-height: 1.5; 
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .hero { 
            background: linear-gradient(135deg, #8E9AAF 0%, #68769C 100%); 
            color: white; 
            padding: 60px 20px; 
            text-align: center; 
            margin-bottom: 40px; 
        }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; font-weight: 600; }
        .hero p { font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .card { 
            background: white; 
            border-radius: 8px; 
            padding: 30px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            border: 1px solid #e1dfdd; 
        }
        .card h3 { color: #8E9AAF; margin-bottom: 15px; font-size: 1.5rem; }
        .card p { color: #68769C; margin-bottom: 20px; }
        .form-section { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #3C4858; }
        .form-group input { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #edebe9; 
            border-radius: 4px; 
            font-size: 16px; 
        }
        .form-group input:focus { border-color: #8E9AAF; outline: none; }
        .buttons { text-align: center; margin-top: 30px; }
        .btn { 
            display: inline-block; 
            padding: 12px 24px; 
            margin: 0 10px; 
            border: none; 
            border-radius: 4px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            text-decoration: none; 
        }
        .btn-primary { background: #8E9AAF; color: white; }
        .btn-primary:hover { background: #68769C; }
        .btn-secondary { background: #edebe9; color: #3C4858; }
        .btn-secondary:hover { background: #d2d0ce; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Microsoft Learn</h1>
        <p>${description}</p>
    </div>
    
    <div class="container">
        <div class="cards">
            <div class="card">
                <h3>Learn by Doing</h3>
                <p>Interactive tutorials and hands-on exercises to help you master new skills.</p>
            </div>
            <div class="card">
                <h3>Expert-Led Content</h3>
                <p>Learn from Microsoft experts and industry professionals with real-world experience.</p>
            </div>
        </div>
        
        <div class="form-section">
            <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" placeholder="Enter your name">
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email">
            </div>
            
            <div class="buttons">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Learn More</button>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// AI wireframe generation
async function generateWithAI(description) {
  if (!openai) {
    throw new Error("OpenAI not initialized");
  }

  const prompt = `Create a complete HTML wireframe for Microsoft Learn platform based on: "${description}"

Requirements:
- Use Microsoft Learn design system (Blues: #8E9AAF, #68769C; Grays: #f3f2f1, #68769C)
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
    let source = "fallback";

    // Try AI generation first
    try {
      if (openai) {
        html = await generateWithAI(description);
        if (html && html.includes("<!DOCTYPE html>") && html.length > 1000) {
          source = "openai";
        } else {
          throw new Error("AI response insufficient");
        }
      } else {
        throw new Error("OpenAI not available");
      }
    } catch (aiError) {
      console.log("AI generation failed, using fallback:", aiError.message);
      html = createSimpleFallback(description);
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
    console.error("Function error:", error);

    // Emergency fallback
    const html = createSimpleFallback("Error fallback");

    context.res.status = 200;
    context.res.body = {
      html,
      fallback: true,
      error: "Error occurred, using fallback",
      processingTimeMs: processingTime,
      aiGenerated: false,
      source: "error-fallback",
    };
  }
};
