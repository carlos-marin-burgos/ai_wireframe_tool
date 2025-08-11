const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const {
  generateMicrosoftNavHTML,
  generateMicrosoftFooterHTML,
} = require("./components/HeroGenerator");
const { createFallbackWireframe } = require("./fallback-generator");

// Import Enhanced AI System
const {
  AIEnhancedWireframeGenerator,
} = require("./ai/ai-enhanced-wireframe-generator");

require("dotenv").config();

// Initialize OpenAI client for Azure OpenAI
let openai = null;
try {
  if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
    openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${endpoint}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
    });
    console.log("✅ Azure OpenAI client initialized successfully");
  } else {
    console.log(
      "⚠️ Azure OpenAI credentials not found in environment variables"
    );
  }
} catch (error) {
  console.error("❌ Failed to initialize OpenAI client:", error);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Enhanced AI System
const enhancedAI = new AIEnhancedWireframeGenerator();
console.log("🚀 Enhanced AI Wireframe Generator initialized");

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static("../")); // Serve files from the parent directory
app.use("/public", express.static("../public")); // Serve public assets

// Root route - serve a simple interface
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Wireframe Generator</title>
    <style>
        body { 
            font-family: 'Segoe UI', sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem; 
            background: #f5f5f5; 
        }
        .container { 
            background: white; 
            padding: 2rem; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { color: #0078d4; margin-bottom: 1rem; }
        .endpoint { 
            background: #f8f9fa; 
            padding: 1rem; 
            border-left: 4px solid #0078d4; 
            margin: 1rem 0; 
        }
        .method { color: #28a745; font-weight: bold; }
        .url { font-family: monospace; background: #e9ecef; padding: 0.2rem 0.4rem; }
        .test-section { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #dee2e6; }
        textarea { width: 100%; height: 100px; margin: 0.5rem 0; padding: 0.5rem; }
        button { 
            background: #0078d4; 
            color: white; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 1rem;
        }
        button:hover { background: #106ebe; }
        .result { 
            margin-top: 1rem; 
            padding: 1rem; 
            background: #f8f9fa; 
            border-radius: 4px; 
            white-space: pre-wrap; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 AI Wireframe Generator</h1>
        <p>Welcome to the AI-Enhanced Wireframe Generator with Microsoft Learn integration!</p>
        
        <div class="endpoint">
            <strong>Health Check:</strong><br>
            <span class="method">GET</span> <span class="url">/api/health</span><br>
            <small>Check if the server is running</small>
        </div>
        
        <div class="endpoint">
            <strong>Generate Wireframe:</strong><br>
            <span class="method">POST</span> <span class="url">/api/generate-html-wireframe</span><br>
            <small>Generate an AI-powered wireframe with Microsoft Learn styling</small>
        </div>
        
        <div class="endpoint">
            <strong>AI Analytics:</strong><br>
            <span class="method">GET</span> <span class="url">/api/ai-analytics</span><br>
            <small>View AI generation analytics and performance metrics</small>
        </div>

        <div class="test-section">
            <h3>🧪 Test Wireframe Generation</h3>
            <p>Enter a description for your wireframe:</p>
            <textarea id="description" placeholder="Example: Create a learning dashboard with course cards and a hero section"></textarea>
            <br>
            <button onclick="generateWireframe()">Generate Wireframe</button>
            <div id="result" class="result" style="display:none;"></div>
        </div>
    </div>

    <script>
        async function generateWireframe() {
            const description = document.getElementById('description').value;
            const resultDiv = document.getElementById('result');
            
            if (!description.trim()) {
                alert('Please enter a description');
                return;
            }
            
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Generating wireframe...';
            
            try {
                const response = await fetch('/api/generate-html-wireframe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ description })
                });
                
                const data = await response.json();
                
                if (data.html) {
                    // Open the generated HTML in a new window
                    const newWindow = window.open('', '_blank');
                    newWindow.document.write(data.html);
                    newWindow.document.close();
                    
                    resultDiv.innerHTML = \`
                        <strong>✅ Wireframe Generated Successfully!</strong><br>
                        Generated by: \${data.generatedBy || 'AI System'}<br>
                        Timestamp: \${data.timestamp || new Date().toISOString()}<br>
                        Theme: \${data.theme || 'default'}<br>
                        <small>The wireframe opened in a new window.</small>
                    \`;
                } else {
                    resultDiv.textContent = 'Error: ' + (data.error || 'Unknown error occurred');
                }
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
  `);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Azure OpenAI monitoring status endpoint
app.get("/api/azure-openai-status", async (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");

    // Try to read the Azure OpenAI monitor log
    const logFile = path.join(__dirname, "azure-openai-monitor.log");
    let status = {
      isHealthy: false,
      lastCheck: new Date().toISOString(),
      error: "Monitor log not found",
      consecutiveFailures: 0,
    };

    if (fs.existsSync(logFile)) {
      // Read last few lines of log file to determine status
      const logContent = fs.readFileSync(logFile, "utf8");
      const lines = logContent
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        const timestamp = lastLine.match(/\[([\d-T:.Z]+)\]/)?.[1];

        // Check if there are recent health check failures
        const recentLines = lines.slice(-10); // Last 10 entries
        const failures = recentLines.filter((line) =>
          line.includes("Health check failed")
        );
        const alerts = recentLines.filter((line) =>
          line.includes("ALERT: SERVICE_DOWN")
        );

        status = {
          isHealthy: failures.length === 0 || alerts.length === 0,
          lastCheck: timestamp || new Date().toISOString(),
          error:
            failures.length > 0
              ? "Recent health check failures detected"
              : null,
          consecutiveFailures: failures.length,
          recentFailures: failures.length,
          totalLogEntries: lines.length,
        };
      }
    }

    // Also check if Azure OpenAI client is initialized
    const clientStatus = {
      clientInitialized: openai !== null,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT ? "configured" : "missing",
      apiKey: process.env.AZURE_OPENAI_KEY ? "configured" : "missing",
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT
        ? "configured"
        : "missing",
    };

    res.json({
      ...status,
      client: clientStatus,
      systemCheck: {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    res.status(500).json({
      isHealthy: false,
      error: `Failed to check Azure OpenAI status: ${error.message}`,
      lastCheck: new Date().toISOString(),
    });
  }
});

// Azure OpenAI monitoring logs endpoint
app.get("/api/azure-openai-logs", (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");

    const logFile = path.join(__dirname, "azure-openai-monitor.log");

    if (!fs.existsSync(logFile)) {
      return res.json({
        logs: [],
        message: "No monitoring logs found",
      });
    }

    const logContent = fs.readFileSync(logFile, "utf8");
    const lines = logContent
      .trim()
      .split("\n")
      .filter((line) => line.trim());

    // Parse log entries
    const logs = lines
      .slice(-50)
      .map((line) => {
        // Last 50 entries
        const timestampMatch = line.match(/\[([\d-T:.Z]+)\]/);
        const timestamp = timestampMatch ? timestampMatch[1] : null;

        let level = "info";
        if (line.includes("ALERT:") || line.includes("failed")) level = "error";
        else if (line.includes("WARNING") || line.includes("⚠️"))
          level = "warning";
        else if (line.includes("✅") || line.includes("recovered"))
          level = "success";

        return {
          timestamp,
          level,
          message: line.replace(/\[[\d-T:.Z]+\]\s*/, ""), // Remove timestamp from message
          raw: line,
        };
      })
      .reverse(); // Most recent first

    res.json({
      logs,
      total: lines.length,
      lastUpdate: logs.length > 0 ? logs[0].timestamp : null,
    });
  } catch (error) {
    res.status(500).json({
      error: `Failed to read monitoring logs: ${error.message}`,
      logs: [],
    });
  }
});

// Rate limiting tracking
let lastRequestTime = 0;
let rateLimitRetryAfter = 0;

function checkRateLimit() {
  const now = Date.now();
  if (
    rateLimitRetryAfter > 0 &&
    now < lastRequestTime + rateLimitRetryAfter * 1000
  ) {
    const waitTime = Math.ceil(
      (lastRequestTime + rateLimitRetryAfter * 1000 - now) / 1000
    );
    return { rateLimited: true, waitTime };
  }
  return { rateLimited: false };
}

// MAIN WIREFRAME GENERATION ENDPOINT - PURE AI-FIRST APPROACH
app.post("/api/generate-html-wireframe", async (req, res) => {
  const {
    description = "",
    designTheme = "modern",
    colorScheme = "primary",
    customColors = null,
  } = req.body;

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  console.log("🎯 Pure AI-driven wireframe generation request:");
  console.log(`📝 Description: "${description}"`);
  console.log(`🎨 Theme: ${designTheme}, Color Scheme: ${colorScheme}`);

  // Check rate limit
  const { rateLimited, waitTime } = checkRateLimit();
  if (rateLimited) {
    return res.status(429).json({
      error: `Rate limit exceeded. Please wait ${waitTime} seconds before retrying.`,
      retryAfter: waitTime,
    });
  }

  try {
    // STEP 1: Always try AI generation first - this is the only path
    console.log("🧠 Attempting AI-powered wireframe generation...");
    const aiGeneratedHtml = await generateWireframeWithAI(
      description,
      designTheme,
      colorScheme,
      customColors
    );

    if (aiGeneratedHtml) {
      console.log("✅ AI generation successful!");
      return res.json({
        html: aiGeneratedHtml,
        fallback: false,
        cached: false,
        theme: designTheme,
        colorScheme: colorScheme,
        generatedBy: "AI",
        timestamp: new Date().toISOString(),
        aiPowered: true,
      });
    }

    // STEP 2: If AI fails, return error message instead of fallback
    console.log("❌ AI generation failed - no fallback available");
    return res.status(503).json({
      error: "AI Wireframe Service Temporarily Unavailable",
      message:
        "The AI wireframe generation service is currently down. Please try again in a few minutes.",
      suggestions: [
        "Wait a few minutes and try again",
        "Check if your internet connection is stable",
        "Contact support if the issue persists",
      ],
      retryAfter: 60,
      timestamp: new Date().toISOString(),
      serviceStatus: "down",
    });
  } catch (error) {
    console.error("❌ Error in wireframe generation:", error);

    // Handle rate limiting
    if (error.status === 429) {
      lastRequestTime = Date.now();
      rateLimitRetryAfter = parseInt(error.headers["retry-after"] || "60");
      console.log(
        `⏳ Rate limit hit, will retry after ${rateLimitRetryAfter} seconds`
      );

      return res.status(429).json({
        error: `AI service is temporarily rate-limited. Please wait ${rateLimitRetryAfter} seconds and try again.`,
        retryAfter: rateLimitRetryAfter,
        rateLimited: true,
        suggestions: [
          "Wait a moment and try again",
          "Try a simpler description",
          "Consider upgrading your Azure OpenAI pricing tier for higher limits",
        ],
      });
    }

    // Handle connection errors (like DNS resolution failures)
    if (error.cause && error.cause.code === "ENOTFOUND") {
      console.log(
        "🔌 DNS resolution failed - Azure OpenAI endpoint not reachable"
      );
      return res.status(503).json({
        error: "AI Service Connection Failed",
        message:
          "Unable to connect to the Azure OpenAI service. The service may be down or misconfigured.",
        suggestions: [
          "Try again in a few minutes",
          "Check if the Azure OpenAI service is properly configured",
          "Contact your administrator if the issue persists",
        ],
        retryAfter: 300, // 5 minutes
        timestamp: new Date().toISOString(),
        serviceStatus: "unreachable",
      });
    }

    // Handle other API errors
    console.log("💥 General AI service error occurred");
    return res.status(503).json({
      error: "AI Wireframe Service Error",
      message:
        "The AI wireframe generation service encountered an error. Please try again later.",
      suggestions: [
        "Wait a few minutes and try again",
        "Try a simpler description",
        "Contact support if the issue persists",
      ],
      retryAfter: 120,
      timestamp: new Date().toISOString(),
      serviceStatus: "error",
      errorDetails: error.message,
    });
  }
});

// ✨ ENHANCED AI WIREFRAME GENERATION ENDPOINT - NEXT GENERATION AI
app.post("/api/generate-enhanced-wireframe", async (req, res) => {
  const {
    description = "",
    sessionId = null,
    designTheme = "microsoftlearn",
    colorScheme = "primary",
    enhanceQuality = true,
    userAgent = req.get("User-Agent"),
    userFeedback = null,
  } = req.body;

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  console.log("✨ Enhanced AI wireframe generation request:");
  console.log(`📝 Description: "${description}"`);
  console.log(`🎨 Theme: ${designTheme}, Color Scheme: ${colorScheme}`);
  console.log(`🔧 Enhancement: ${enhanceQuality ? "enabled" : "disabled"}`);
  console.log(`👤 Session: ${sessionId || "new"}`);

  try {
    const result = await enhancedAI.generateEnhancedWireframe({
      description,
      sessionId,
      userAgent,
      designTheme,
      colorScheme,
      enhanceQuality,
      userFeedback,
    });

    return res.json({
      ...result,
      timestamp: new Date().toISOString(),
      version: "enhanced-v2.0",
    });
  } catch (error) {
    console.error("❌ Enhanced AI generation failed:", error);

    // Emergency fallback
    const emergencyHtml = generateEmergencyFallback(
      description,
      designTheme,
      colorScheme
    );

    res.status(500).json({
      html: emergencyHtml,
      fallback: true,
      enhanced: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      generatedBy: "EmergencyFallback",
    });
  }
});

// 💡 ENHANCED DESIGN SUGGESTIONS ENDPOINT
app.post("/api/generate-design-suggestions", async (req, res) => {
  const {
    description = "",
    sessionId = null,
    currentWireframe = null,
  } = req.body;

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    console.log("💡 Generating enhanced design suggestions...");

    const suggestions = await enhancedAI.generateDesignSuggestions(
      description,
      sessionId,
      currentWireframe
    );

    return res.json({
      ...suggestions,
      timestamp: new Date().toISOString(),
      sessionId,
    });
  } catch (error) {
    console.error("❌ Enhanced suggestion generation failed:", error);

    res.status(500).json({
      suggestions: [
        {
          title: "Enhance User Experience",
          description: "Focus on improving usability and accessibility",
          impact: "high",
          category: "ux",
        },
      ],
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// 📊 ENHANCED AI ANALYTICS ENDPOINT
app.get("/api/ai-analytics", (req, res) => {
  try {
    const stats = enhancedAI.getEnhancedStats();

    return res.json({
      ...stats,
      timestamp: new Date().toISOString(),
      version: "enhanced-v2.0",
    });
  } catch (error) {
    console.error("❌ Analytics retrieval failed:", error);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// PURE AI WIREFRAME GENERATION FUNCTION
async function generateWireframeWithAI(
  description,
  designTheme = "modern",
  colorScheme = "primary",
  customColors = null
) {
  if (!openai) {
    console.log("⚠️ OpenAI client not available for wireframe generation");
    return null;
  }

  try {
    console.log("🧠 Generating PURE AI wireframe for:", description);
    console.log(`🎨 Theme: ${designTheme}, Color Scheme: ${colorScheme}`);

    // Define color schemes for AI to use
    const colorSchemes = {
      primary: {
        main: "#0078d4",
        secondary: "#106ebe",
        bg: "#ffffff",
        text: "#323130",
        border: "#e5e5e5",
        banner: "#E8E6DF",
      },
      success: {
        main: "#107c10",
        secondary: "#0b6413",
        bg: "#f1faf1",
        text: "#000000",
        border: "#e5e5e5",
      },
      info: {
        main: "#d1ccf0",
        secondary: "#c3b8eb",
        bg: "#ebf3fc",
        text: "#000000",
        border: "#e5e5e5",
      },
      warning: {
        main: "#ffb900",
        secondary: "#d19700",
        bg: "#fff9e6",
        text: "#000000",
        border: "#e5e5e5",
      },
      danger: {
        main: "#d13438",
        secondary: "#c50f1f",
        bg: "#fdf3f4",
        text: "#000000",
        border: "#e5e5e5",
      },
    };

    const colors =
      customColors || colorSchemes[colorScheme] || colorSchemes.primary;
    const isMicrosoftLearn = designTheme.toLowerCase() === "microsoftlearn";

    // ADVANCED AI PROMPT - Let AI decide everything
    const prompt = `You are an expert frontend developer and UX designer. Create a complete, functional HTML wireframe with inline CSS based on this description:

USER REQUEST: "${description}"

DESIGN SPECIFICATIONS:
- Theme: ${designTheme}
- Color scheme: ${colorScheme}
- Primary color: ${colors.main}
- Secondary color: ${colors.secondary}
- Background: ${colors.bg}
- Text color: ${colors.text}
- Border color: ${colors.border}
- Banner/Hero background: ${colors.banner || "#E7E5DE"}

${
  isMicrosoftLearn
    ? `
MICROSOFT LEARN DESIGN SYSTEM:
- Use Segoe UI font family: 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif
- Clean, minimal documentation-style interface
- Subtle borders instead of heavy shadows
- White backgrounds with excellent typography
- Professional Microsoft aesthetic
- Use proper semantic HTML5 structure
`
    : `
MODERN WEB DESIGN:
- Contemporary, visually appealing interface
- Proper spacing and visual hierarchy
- Responsive design principles
- Accessible and user-friendly
- Clean, professional aesthetic
`
}

REQUIREMENTS:
1. ANALYZE the user's request carefully and understand exactly what they want
2. CREATE the exact interface they described (forms, textboxes, buttons, layouts, etc.)
3. GENERATE complete HTML with inline CSS (no external dependencies)
4. INCLUDE proper semantic structure (header, main, nav, sections, etc.)
5. MAKE it responsive and production-ready
6. ADD interactive elements where appropriate (hover states, focus styles)
7. USE the specified color scheme throughout
8. ENSURE accessibility (proper labels, contrast, semantic HTML)
9. INCLUDE realistic placeholder content that matches the context
10. MAKE it look polished and production-ready

COLOR USAGE GUIDELINES:
- Use PRIMARY COLOR (#0078d4) for buttons, links, and interactive elements
- Use BANNER/HERO BACKGROUND (#E8E6DF) for large background sections, hero areas, and banners
- Keep button backgrounds blue (#0078d4) - do not change button colors
- Use banner background color only for large sections, not for buttons or small elements

HERO SECTION DESIGN REQUIREMENTS:
- Use exact Microsoft Learn Accent Hero pattern with background-color-body-accent (#E8E6DF)
- Implement hero-image class structure: section.hero.hero-image
- Background images: Use CSS custom properties --hero-background-image-light and --hero-background-image-dark
- Gradient border: Add gradient-border-right gradient-border-body-accent
- Content structure: Use .hero-content div with proper typography classes
- Typography: letter-spacing-wide text-transform-uppercase for eyebrow, font-size-h1 font-weight-semibold for title
- Buttons: Use .button.border.button-clear class structure

IMPORTANT INSTRUCTIONS:
- Build EXACTLY what the user asked for
- If they want "two textboxes", create exactly two textboxes
- If they want a "dashboard", create a dashboard layout
- If they want a "contact form", create a contact form
- Be creative and comprehensive - don't just create basic elements
- Include proper styling for a polished, professional look
- Make it look like a real production interface
- Add subtle animations and transitions where appropriate

OUTPUT FORMAT:
Return ONLY the HTML code with inline CSS. No markdown formatting, no explanations, just clean HTML that can be rendered directly.`;

    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert frontend developer and UI/UX designer who creates beautiful, production-ready HTML interfaces with inline CSS. You analyze user requirements and generate complete, functional wireframes that match exactly what users describe. You are creative, thorough, and build realistic interfaces that look professional and polished.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7, // Balanced creativity and consistency
        max_tokens: 4000, // Comprehensive output
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI generation timeout")), 30000)
      ),
    ]);

    const html = response.choices[0]?.message?.content?.trim();

    if (!html) {
      console.log("❌ No HTML content generated by AI");
      return null;
    }

    // Clean up any markdown formatting
    const cleanedHtml = html
      .replace(/```html\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    console.log("✅ PURE AI wireframe generated successfully");
    console.log(`📊 Generated ${cleanedHtml.length} characters of HTML`);
    return cleanedHtml;
  } catch (error) {
    if (error.message === "AI generation timeout") {
      console.error("⏰ AI generation timed out after 30 seconds");
    } else {
      console.error("❌ Error generating AI wireframe:", error);
    }
    return null;
  }
}

// INTELLIGENT FALLBACK SYSTEM - Dynamic analysis without hardcoded conditions
async function generateIntelligentFallback(
  description,
  designTheme = "modern",
  colorScheme = "primary",
  customColors = null
) {
  console.log("🤖 Using Smart Dynamic Fallback System");
  console.log(`🔍 Analyzing request: "${description}"`);

  const lowerDesc = description.toLowerCase();

  // PRIORITY CHECK: Microsoft Learn special handling
  if (
    designTheme === "microsoftlearn" ||
    lowerDesc.includes("learn") ||
    lowerDesc.includes("microsoft")
  ) {
    // Always use our enhanced fallback generator for Microsoft Learn content
    console.log(
      "🎯 Using enhanced fallback generator for Microsoft Learn content"
    );
    return createFallbackWireframe(description, designTheme, colorScheme);
  }

  // Define color schemes
  const colorSchemes = {
    primary: {
      main: "#0078d4",
      secondary: "#106ebe",
      bg: "#ffffff",
      text: "#323130",
      border: "#e5e5e5",
    },
    success: {
      main: "#107c10",
      secondary: "#0b6413",
      bg: "#f1faf1",
      text: "#000000",
      border: "#e5e5e5",
    },
    info: {
      main: "#0078d4",
      secondary: "#106ebe",
      bg: "#ebf3fc",
      text: "#000000",
      border: "#e5e5e5",
    },
    warning: {
      main: "#ffb900",
      secondary: "#d19700",
      bg: "#fff9e6",
      text: "#000000",
      border: "#e5e5e5",
    },
    danger: {
      main: "#d13438",
      secondary: "#c50f1f",
      bg: "#fdf3f4",
      text: "#000000",
      border: "#e5e5e5",
    },
  };

  const colors =
    customColors || colorSchemes[colorScheme] || colorSchemes.primary;
  // lowerDesc already defined above

  // Dynamic component detection
  const detectedComponents = {
    textboxes: 0,
    buttons: 0,
    forms: 0,
    tables: 0,
    cards: 0,
    sections: 0,
  };

  // Smart number extraction
  const words = lowerDesc.split(/\s+/);
  const numberWords = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  words.forEach((word, index) => {
    if (numberWords[word] || /^\d+$/.test(word)) {
      const number = numberWords[word] || parseInt(word);
      const nextWord = words[index + 1];

      if (
        nextWord &&
        (nextWord.includes("textbox") ||
          nextWord.includes("input") ||
          nextWord.includes("field"))
      ) {
        detectedComponents.textboxes = number;
      }
      if (
        nextWord &&
        (nextWord.includes("button") || nextWord.includes("btn"))
      ) {
        detectedComponents.buttons = number;
      }
      if (
        nextWord &&
        (nextWord.includes("card") || nextWord.includes("item"))
      ) {
        detectedComponents.cards = number;
      }
    }
  });

  // Detect component types
  if (
    lowerDesc.includes("textbox") ||
    lowerDesc.includes("input") ||
    lowerDesc.includes("field")
  ) {
    if (detectedComponents.textboxes === 0) detectedComponents.textboxes = 1;
  }
  if (lowerDesc.includes("button")) {
    if (detectedComponents.buttons === 0) detectedComponents.buttons = 1;
  }
  if (lowerDesc.includes("form")) {
    detectedComponents.forms = 1;
  }
  if (
    lowerDesc.includes("table") ||
    lowerDesc.includes("list") ||
    lowerDesc.includes("data")
  ) {
    detectedComponents.tables = 1;
  }
  if (
    lowerDesc.includes("card") ||
    lowerDesc.includes("product") ||
    lowerDesc.includes("item")
  ) {
    if (detectedComponents.cards === 0) detectedComponents.cards = 3;
  }

  console.log("🔍 Detected components:", detectedComponents);

  // Generate appropriate wireframe based on detected components
  let wireframeHtml = "";

  if (detectedComponents.textboxes > 0) {
    wireframeHtml = generateFormWireframe(
      detectedComponents,
      colors,
      description
    );
  } else if (detectedComponents.tables > 0) {
    wireframeHtml = generateTableWireframe(
      detectedComponents,
      colors,
      description
    );
  } else if (detectedComponents.cards > 0) {
    wireframeHtml = generateCardWireframe(
      detectedComponents,
      colors,
      description
    );
  } else {
    wireframeHtml = generateGeneralWireframe(description, colors);
  }

  console.log(`✅ Generated intelligent fallback wireframe`);
  return wireframeHtml;
}

// Helper function to generate form wireframes
function generateFormWireframe(components, colors, description) {
  const fieldNames = [
    "Name",
    "Email",
    "Phone",
    "Address",
    "Message",
    "Subject",
    "Company",
    "Title",
  ];
  const fieldTypes = [
    "text",
    "email",
    "tel",
    "text",
    "textarea",
    "text",
    "text",
    "text",
  ];

  let formHtml = `
  <div style="max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid ${
    colors.border
  }; border-radius: 8px; background: ${
    colors.bg
  }; font-family: 'Segoe UI', system-ui, sans-serif;">
    <h2 style="color: ${
      colors.text
    }; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; text-align: center;">
      ${components.forms > 0 ? "Form" : "Input Fields"} ${
    components.textboxes > 1 ? `with ${components.textboxes} Fields` : ""
  }
    </h2>
    <form style="display: flex; flex-direction: column; gap: 20px;">`;

  for (let i = 0; i < components.textboxes; i++) {
    const fieldName = fieldNames[i] || `Field ${i + 1}`;
    const fieldType = fieldTypes[i] || "text";

    if (fieldType === "textarea") {
      formHtml += `
      <div>
        <label style="display: block; color: ${
          colors.text
        }; font-weight: 500; margin-bottom: 8px;">${fieldName}</label>
        <textarea placeholder="Enter ${fieldName.toLowerCase()}" rows="4" style="width: 100%; padding: 12px 16px; border: 2px solid ${
        colors.border
      }; border-radius: 6px; font-size: 16px; transition: border-color 0.2s ease; resize: vertical; font-family: inherit;"></textarea>
      </div>`;
    } else {
      formHtml += `
      <div>
        <label style="display: block; color: ${
          colors.text
        }; font-weight: 500; margin-bottom: 8px;">${fieldName}</label>
        <input type="${fieldType}" placeholder="Enter ${fieldName.toLowerCase()}" style="width: 100%; padding: 12px 16px; border: 2px solid ${
        colors.border
      }; border-radius: 6px; font-size: 16px; transition: border-color 0.2s ease; font-family: inherit;">
      </div>`;
    }
  }

  // Add buttons
  if (components.buttons > 0) {
    formHtml += `<div style="display: flex; gap: 12px; margin-top: 12px;">`;
    for (let i = 0; i < components.buttons; i++) {
      const buttonText =
        i === 0 ? "Submit" : i === 1 ? "Cancel" : `Button ${i + 1}`;
      const buttonStyle =
        i === 0
          ? `background: ${colors.main}; color: white; border: none;`
          : `background: transparent; color: ${colors.text}; border: 2px solid ${colors.border};`;

      formHtml += `
        <button type="${
          i === 0 ? "submit" : "button"
        }" style="${buttonStyle} padding: 14px 24px; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit;">
          ${buttonText}
        </button>`;
    }
    formHtml += `</div>`;
  } else {
    formHtml += `
      <button type="submit" style="background: ${colors.main}; color: white; padding: 14px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 12px; transition: background-color 0.2s ease; font-family: inherit;">
        Submit
      </button>`;
  }

  formHtml += `
    </form>
  </div>
  <style>
    input:focus, textarea:focus {
      outline: none !important;
      border-color: ${colors.main} !important;
      box-shadow: 0 0 0 3px ${colors.main}20 !important;
    }
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  </style>`;

  return formHtml;
}

// Helper function to generate table wireframes
function generateTableWireframe(components, colors, description) {
  return `
  <div style="max-width: 1000px; margin: 40px auto; padding: 32px; font-family: 'Segoe UI', system-ui, sans-serif;">
    <h2 style="color: ${
      colors.text
    }; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; text-align: center;">Data Table</h2>
    <div style="overflow-x: auto; border: 1px solid ${
      colors.border
    }; border-radius: 8px; background: ${colors.bg};">
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background: ${colors.border};">
          <tr>
            <th style="padding: 16px; text-align: left; color: ${
              colors.text
            }; font-weight: 600; border-bottom: 2px solid ${
    colors.border
  };">Name</th>
            <th style="padding: 16px; text-align: left; color: ${
              colors.text
            }; font-weight: 600; border-bottom: 2px solid ${
    colors.border
  };">Email</th>
            <th style="padding: 16px; text-align: left; color: ${
              colors.text
            }; font-weight: 600; border-bottom: 2px solid ${
    colors.border
  };">Status</th>
            <th style="padding: 16px; text-align: left; color: ${
              colors.text
            }; font-weight: 600; border-bottom: 2px solid ${
    colors.border
  };">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from(
            { length: 5 },
            (_, i) => `
            <tr style="border-bottom: 1px solid ${colors.border};">
              <td style="padding: 16px; color: ${colors.text};">User ${
              i + 1
            }</td>
              <td style="padding: 16px; color: ${
                colors.text
              }; opacity: 0.8;">user${i + 1}@example.com</td>
              <td style="padding: 16px;">
                <span style="background: ${
                  i % 2 === 0 ? colors.main : colors.secondary
                }; color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px;">
                  ${i % 2 === 0 ? "Active" : "Pending"}
                </span>
              </td>
              <td style="padding: 16px;">
                <button style="background: transparent; border: 1px solid ${
                  colors.border
                }; color: ${
              colors.text
            }; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 8px; font-family: inherit;">Edit</button>
                <button style="background: transparent; border: 1px solid ${
                  colors.border
                }; color: ${
              colors.text
            }; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: inherit;">Delete</button>
              </td>
            </tr>
          `
          ).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

// Helper function to generate card wireframes
function generateCardWireframe(components, colors, description) {
  return `
  <div style="max-width: 1200px; margin: 40px auto; padding: 32px; font-family: 'Segoe UI', system-ui, sans-serif;">
    <h2 style="color: ${
      colors.text
    }; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; text-align: center;">Card Layout</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
      ${Array.from(
        { length: components.cards },
        (_, i) => `
        <div style="border: 1px solid ${
          colors.border
        }; border-radius: 8px; padding: 24px; background: ${
          colors.bg
        }; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s ease, box-shadow 0.2s ease;">
          <h3 style="color: ${
            colors.main
          }; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">Card ${
          i + 1
        }</h3>
          <p style="color: ${
            colors.text
          }; line-height: 1.6; margin: 0 0 16px 0;">
            This is a dynamically generated card component. Content is created based on your description and requirements.
          </p>
          <button style="background: ${
            colors.main
          }; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; font-family: inherit; transition: background-color 0.2s ease;">
            Action ${i + 1}
          </button>
        </div>
      `
      ).join("")}
    </div>
  </div>
  <style>
    div[style*="grid-template-columns"] > div:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  </style>`;
}

// Helper function to generate general wireframes
function generateGeneralWireframe(description, colors) {
  return `
  <div style="max-width: 800px; margin: 40px auto; padding: 32px; font-family: 'Segoe UI', system-ui, sans-serif;">
    <h2 style="color: ${colors.text}; font-size: 28px; font-weight: 600; margin: 0 0 16px 0;">${description}</h2>
    <p style="color: ${colors.text}; opacity: 0.8; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
      This wireframe was dynamically generated based on your description. The system analyzed your request and created the most appropriate layout.
    </p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
      <div style="border: 1px solid ${colors.border}; padding: 24px; border-radius: 8px; background: ${colors.bg};">
        <h4 style="color: ${colors.main}; margin: 0 0 12px 0;">✨ Dynamic Content</h4>
        <p style="color: ${colors.text}; margin: 0; font-size: 14px;">Content generated based on your specific requirements.</p>
      </div>
      <div style="border: 1px solid ${colors.border}; padding: 24px; border-radius: 8px; background: ${colors.bg};">
        <h4 style="color: ${colors.main}; margin: 0 0 12px 0;">🎯 Smart Layout</h4>
        <p style="color: ${colors.text}; margin: 0; font-size: 14px;">Intelligent wireframe structure tailored to your needs.</p>
      </div>
    </div>
  </div>`;
}

// Emergency fallback for critical errors
function generateEmergencyFallback(description, designTheme, colorScheme) {
  return `
  <div style="max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #e5e5e5; border-radius: 8px; background: #ffffff; font-family: 'Segoe UI', system-ui, sans-serif;">
    <h2 style="color: #323130; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">⚠️ Service Temporarily Unavailable</h2>
    <p style="color: #605e5c; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
      We're experiencing technical difficulties with our wireframe generation service. Please try again in a few moments.
    </p>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #d1ccf0;">
      <p style="color: #323130; margin: 0 0 8px 0; font-weight: 500;">Your request:</p>
      <p style="color: #605e5c; margin: 0; font-style: italic;">"${description}"</p>
    </div>
    <div style="text-align: center; margin-top: 24px;">
      <button style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; font-family: inherit;">
        Try Again
      </button>
    </div>
  </div>`;
}

// Suggestions endpoint
app.post("/api/generate-suggestions", async (req, res) => {
  const { description = "" } = req.body;

  try {
    console.log("📝 Microsoft Learn suggestions requested for:", description);

    // Microsoft Learn-focused suggestions based on description
    const suggestions = generateMicrosoftLearnSuggestions(description);

    res.json({
      suggestions: suggestions,
      fallback: false,
      source: "microsoft-learn-focused",
    });
  } catch (error) {
    console.error("❌ Error in suggestions endpoint:", error);
    res.status(500).json({
      error: "Failed to generate suggestions",
      details: error.message,
    });
  }
});

// Microsoft Learn-focused suggestion generator
function generateMicrosoftLearnSuggestions(description) {
  const lowerDescription = description.toLowerCase();

  // Microsoft Learn wireframe-focused suggestion categories
  const categories = {
    layout: [
      "Add Microsoft Learn's signature header with Microsoft logo and Learn branding",
      "Include Microsoft Learn's left navigation sidebar with expandable learning paths",
      "Create Microsoft Learn's main content area with documentation-style typography",
      "Add Microsoft Learn's right sidebar with 'In this article' table of contents",
      "Include Microsoft Learn's footer with community links and feedback options",
      "Design Microsoft Learn's breadcrumb trail showing learning path progression",
    ],
    navigation: [
      "Add Microsoft Learn's global navigation with 'Documentation', 'Learning', 'Certifications' tabs",
      "Include Microsoft Learn's search bar with technology and role-based filters",
      "Create Microsoft Learn's learning path navigation with module completion indicators",
      "Add Microsoft Learn's 'Previous' and 'Next Unit' navigation for sequential learning",
      "Include Microsoft Learn's floating progress indicator for current learning module",
      "Design Microsoft Learn's mobile hamburger menu with nested learning categories",
    ],
    content: [
      "Create Microsoft Learn's hero banner with technology focus and learning objectives",
      "Add Microsoft Learn's 'Learning objectives' card with checkboxes for goal tracking",
      "Include Microsoft Learn's code block containers with 'Try it' and 'Copy' buttons",
      "Design Microsoft Learn's unit progress bar showing completion within a module",
      "Add Microsoft Learn's collapsible content sections for step-by-step tutorials",
      "Create Microsoft Learn's achievement badge display for completed learning paths",
    ],
    forms: [
      "Add Microsoft Learn's knowledge check quiz with multiple choice and explanations",
      "Include Microsoft Learn's skills assessment form with role-based questions",
      "Design Microsoft Learn's certification exam registration form with prerequisites",
      "Create Microsoft Learn's learning preferences form with technology interests",
      "Add Microsoft Learn's community Q&A submission form with tagging system",
      "Include Microsoft Learn's feedback form for rating learning module quality",
    ],
    cards: [
      "Design Microsoft Learn's learning path cards with technology logos and difficulty badges",
      "Create Microsoft Learn's certification cards with exam codes and preparation time estimates",
      "Add Microsoft Learn's documentation cards with API references and code samples",
      "Include Microsoft Learn's community cards showing Q&A discussions and expert answers",
      "Design Microsoft Learn's instructor-led training cards with schedule and registration info",
      "Create Microsoft Learn's hands-on lab cards with Azure sandbox environment links",
    ],
    interactive: [
      "Add Microsoft Learn's interactive Azure portal simulations with guided steps",
      "Include Microsoft Learn's code playground with live Azure resource deployment",
      "Design Microsoft Learn's decision tree diagrams for choosing Azure services",
      "Create Microsoft Learn's interactive tutorials with real-time feedback",
      "Add Microsoft Learn's sandbox environment for hands-on Azure practice",
      "Include Microsoft Learn's progress tracking with badges and achievement unlocks",
    ],
  };

  let suggestions = [];

  // Check for layout-related keywords
  if (
    lowerDescription.includes("page") ||
    lowerDescription.includes("layout") ||
    lowerDescription.includes("structure") ||
    lowerDescription.includes("website") ||
    lowerDescription.includes("site") ||
    lowerDescription.includes("landing")
  ) {
    suggestions.push(...categories.layout.slice(0, 2));
  }

  // Check for navigation-related keywords
  if (
    lowerDescription.includes("navigation") ||
    lowerDescription.includes("menu") ||
    lowerDescription.includes("nav") ||
    lowerDescription.includes("header") ||
    lowerDescription.includes("search")
  ) {
    suggestions.push(...categories.navigation.slice(0, 2));
  }

  // Check for content-related keywords
  if (
    lowerDescription.includes("content") ||
    lowerDescription.includes("article") ||
    lowerDescription.includes("documentation") ||
    lowerDescription.includes("tutorial") ||
    lowerDescription.includes("learning") ||
    lowerDescription.includes("lesson")
  ) {
    suggestions.push(...categories.content.slice(0, 2));
  }

  // Check for form-related keywords (THIS IS THE KEY ONE FOR YOUR "FORM" TEST)
  if (
    lowerDescription.includes("form") ||
    lowerDescription.includes("input") ||
    lowerDescription.includes("quiz") ||
    lowerDescription.includes("assessment") ||
    lowerDescription.includes("exam") ||
    lowerDescription.includes("test") ||
    lowerDescription.includes("feedback") ||
    lowerDescription.includes("survey")
  ) {
    suggestions.push(...categories.forms.slice(0, 2));
  }

  // Check for card-related keywords
  if (
    lowerDescription.includes("card") ||
    lowerDescription.includes("module") ||
    lowerDescription.includes("course") ||
    lowerDescription.includes("certification") ||
    lowerDescription.includes("path") ||
    lowerDescription.includes("training")
  ) {
    suggestions.push(...categories.cards.slice(0, 2));
  }

  // Check for interactive keywords
  if (
    lowerDescription.includes("interactive") ||
    lowerDescription.includes("exercise") ||
    lowerDescription.includes("playground") ||
    lowerDescription.includes("simulation") ||
    lowerDescription.includes("sandbox") ||
    lowerDescription.includes("hands-on")
  ) {
    suggestions.push(...categories.interactive.slice(0, 2));
  }

  // If no specific matches, provide general Microsoft Learn suggestions
  if (suggestions.length === 0) {
    suggestions = [
      "Create Microsoft Learn's learning path overview with module cards and progress tracking",
      "Design Microsoft Learn's documentation page with table of contents and code examples",
      "Add Microsoft Learn's certification journey with exam preparation and study guides",
      "Include Microsoft Learn's community-driven Q&A section with expert moderation",
      "Build Microsoft Learn's hands-on lab environment with Azure sandbox integration",
      "Generate Microsoft Learn's assessment portal with skills validation and feedback",
    ];
  }

  // Ensure we return exactly 6 unique suggestions
  const uniqueSuggestions = [...new Set(suggestions)];
  return uniqueSuggestions.slice(0, 6);
}

app.listen(PORT, () => {
  console.log(`🚀 Clean AI-driven wireframe server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `🎯 Wireframe generation: http://localhost:${PORT}/api/generate-html-wireframe`
  );
  console.log(
    `🧠 AI-first approach: Always tries AI generation first, smart fallbacks when needed`
  );
});
