const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

// NO MORE MICROSOFT LEARN IMPORTS - CLEAN SLATE

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

// NO MORE MICROSOFT LEARN COMPONENTS OR LIBRARIES

// Middleware
app.use(cors());
app.use(express.json());

// 🛡️ Global error handling middleware to prevent crashes
app.use((err, req, res, next) => {
  console.error("🚨 Express error caught:", err);

  // Don't crash the server - always respond gracefully
  if (!res.headersSent) {
    res.status(500).json({
      error: "Internal Server Error",
      message:
        "The server encountered an unexpected error but is still running.",
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"] || "unknown",
    });
  }
});

// Serve static files from the parent directory (YOUR MAIN APP)
app.use(express.static("../"));
app.use("/public", express.static("../public"));

// Simple test interface on /test route instead
// Simple test interface for wireframe testing
app.get("/test", (req, res) => {
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
        <p>Welcome to the clean, intelligent AI Wireframe Generator!</p>
        
        <div class="endpoint">
            <strong>Health Check:</strong><br>
            <span class="method">GET</span> <span class="url">/api/health</span><br>
            <small>Check if the server is running</small>
        </div>
        
        <div class="endpoint">
            <strong>Generate Wireframe:</strong><br>
            <span class="method">POST</span> <span class="url">/api/generate-html-wireframe</span><br>
            <small>Generate a clean, professional wireframe using natural AI intelligence</small>
        </div>
        
        <div class="endpoint">
            <strong>Generate React Component (NEW!):</strong><br>
            <span class="method">POST</span> <span class="url">/api/generate-react-component</span><br>
            <small>Generate production-ready React components with Tailwind CSS - Lovable.dev style!</small>
        </div>
        
        <div class="endpoint">
            <strong>Generate React Wireframe (LOVABLE-STYLE!):</strong><br>
            <span class="method">POST</span> <span class="url">/api/generate-react-wireframe</span><br>
            <small>Generate visual wireframes using React components - just like Lovable.dev!</small>
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
            <button onclick="generateWireframe()">Generate HTML Wireframe</button>
            <button onclick="generateReactComponent()" style="background: #28a745; margin-left: 10px;">Generate React Component</button>
            <button onclick="generateReactWireframe()" style="background: #6f42c1; margin-left: 10px; color: white;">Generate React Wireframe (LOVABLE!)</button>
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

        async function generateReactComponent() {
            const description = document.getElementById('description').value;
            const resultDiv = document.getElementById('result');
            
            if (!description.trim()) {
                alert('Please enter a description');
                return;
            }
            
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Generating React component... (This may take longer)';
            
            try {
                const response = await fetch('/api/generate-react-component', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        description,
                        componentType: 'page',
                        designTheme: 'modern'
                    })
                });
                
                const data = await response.json();
                
                if (data.component) {
                    resultDiv.innerHTML = \`
                        <strong>🚀 React Component Generated Successfully!</strong><br>
                        Framework: \${data.framework}<br>
                        UI Library: \${data.uiLibrary}<br>
                        Dependencies: \${data.dependencies?.join(', ') || 'None'}<br>
                        <br>
                        <details>
                            <summary><strong>View Generated Code</strong></summary>
                            <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; white-space: pre-wrap;">\${data.component}</pre>
                        </details>
                    \`;
                } else {
                    resultDiv.textContent = 'Error: ' + (data.error || 'Unknown error occurred');
                }
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
            }
        }

        async function generateReactWireframe() {
            const description = document.getElementById('description').value;
            const resultDiv = document.getElementById('result');
            
            if (!description.trim()) {
                alert('Please enter a description');
                return;
            }
            
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Generating React wireframe... (Lovable.dev style!)';
            
            try {
                const response = await fetch('/api/generate-react-wireframe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        description,
                        componentType: 'wireframe',
                        designTheme: 'wireframe'
                    })
                });
                
                const data = await response.json();
                
                if (data.component) {
                    resultDiv.innerHTML = \`
                        <strong>🎨 React Wireframe Generated Successfully!</strong><br>
                        Framework: \${data.framework}<br>
                        Style: Wireframe (Lovable.dev style)<br>
                        Wireframe Mode: \${data.wireframeStyle ? 'Yes' : 'No'}<br>
                        Dependencies: \${data.dependencies?.join(', ') || 'None'}<br>
                        <br>
                        <details>
                            <summary><strong>View Generated Wireframe Code</strong></summary>
                            <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; white-space: pre-wrap;">\${data.component}</pre>
                        </details>
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

// Remove the duplicate static file serving that I added

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

// ✨ LOVABLE-STYLE WIREFRAME COMPONENT GENERATION - VISUAL WIREFRAMES WITH REACT!
app.post("/api/generate-react-wireframe", async (req, res) => {
  const {
    description = "",
    designTheme = "wireframe",
    colorScheme = "grayscale",
    componentType = "wireframe", // wireframe, mockup, prototype
  } = req.body;

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  console.log("🎨 Lovable-style React WIREFRAME generation:");
  console.log(`📝 Description: "${description}"`);
  console.log(`🎨 Theme: ${designTheme}, Type: ${componentType}`);

  try {
    const reactWireframe = await generateReactWireframeWithAI(
      description,
      designTheme,
      colorScheme,
      componentType
    );

    if (reactWireframe) {
      console.log("✅ React wireframe generation successful!");

      return res.json({
        component: reactWireframe.code,
        imports: reactWireframe.imports,
        dependencies: reactWireframe.dependencies,
        componentType: componentType,
        framework: "react",
        uiLibrary: "tailwind",
        wireframeStyle: true,
        fallback: false,
        timestamp: new Date().toISOString(),
        generatedBy: "AI-Wireframe-Engine",
      });
    }

    console.log("❌ React wireframe generation failed");
    return res.status(503).json({
      error: "React Wireframe Service Temporarily Unavailable",
      message: "Failed to generate React wireframe. Please try again.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in React wireframe generation:", error);
    return res.status(503).json({
      error: "React Wireframe Service Error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ✨ LOVABLE-STYLE COMPONENT GENERATION - NEXT GENERATION AI
app.post("/api/generate-react-component", async (req, res) => {
  const {
    description = "",
    designTheme = "modern",
    colorScheme = "primary",
    componentType = "page", // page, component, widget
  } = req.body;

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  console.log("🚀 Lovable-style React component generation:");
  console.log(`📝 Description: "${description}"`);
  console.log(`🎨 Theme: ${designTheme}, Type: ${componentType}`);

  try {
    const reactComponent = await generateReactComponentWithAI(
      description,
      designTheme,
      colorScheme,
      componentType
    );

    if (reactComponent) {
      console.log("✅ React component generation successful!");

      return res.json({
        component: reactComponent.code,
        imports: reactComponent.imports,
        dependencies: reactComponent.dependencies,
        componentType: componentType,
        framework: "react",
        uiLibrary: "tailwind",
        fallback: false,
        timestamp: new Date().toISOString(),
        generatedBy: "AI-Enhanced",
      });
    }

    console.log("❌ React component generation failed");
    return res.status(503).json({
      error: "React Component Service Temporarily Unavailable",
      message: "Failed to generate React component. Please try again.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in React component generation:", error);
    return res.status(503).json({
      error: "React Component Service Error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ✨ ENHANCED AI WIREFRAME GENERATION ENDPOINT - NEXT GENERATION AI
app.post("/api/generate-enhanced-wireframe", async (req, res) => {
  res.status(501).json({
    error: "Enhanced wireframe generation is disabled",
    message: "Use the main wireframe generation endpoint instead",
  });
});

// 💡 ENHANCED DESIGN SUGGESTIONS ENDPOINT
app.post("/api/generate-design-suggestions", async (req, res) => {
  res.status(501).json({
    error: "Design suggestions are disabled",
    message: "Focus on direct wireframe generation",
  });
});

// 📊 ENHANCED AI ANALYTICS ENDPOINT
app.get("/api/ai-analytics", (req, res) => {
  res.json({
    message: "Analytics disabled in clean mode",
    timestamp: new Date().toISOString(),
  });
});

// LOVABLE-STYLE REACT WIREFRAME GENERATION FUNCTION - VISUAL WIREFRAMES!
async function generateReactWireframeWithAI(
  description,
  designTheme = "wireframe",
  colorScheme = "grayscale",
  componentType = "wireframe"
) {
  if (!openai) {
    console.log("⚠️ OpenAI client not available for wireframe generation");
    return null;
  }

  try {
    console.log(
      "🎨 Generating Lovable-style React WIREFRAME for:",
      description
    );
    console.log(`🎨 Theme: ${designTheme}, Type: ${componentType}`);

    // WIREFRAME-SPECIFIC React Component Generation
    const prompt = `Create a React wireframe component for: "${description}"

WIREFRAME REQUIREMENTS:
1. Generate a VISUAL WIREFRAME using React + Tailwind CSS
2. Use wireframe styling: gray borders, placeholder content, box layouts
3. Show structure and layout, not final design
4. Use placeholder text like "Header", "Navigation", "Content Area", "Sidebar"
5. Use gray/black wireframe colors: bg-gray-100, border-gray-300, text-gray-600
6. Include TypeScript interfaces
7. Make it look like a traditional wireframe but built with React

WIREFRAME STYLE:
- Gray backgrounds (bg-gray-50, bg-gray-100)
- Dashed or solid gray borders (border-gray-300, border-dashed)
- Placeholder content in boxes
- Simple typography (text-gray-600, text-gray-800)
- Clear layout structure
- Responsive wireframe design

COMPONENT TYPE: ${componentType}
DESIGN THEME: ${designTheme}

FORMAT:
\`\`\`tsx
import React from 'react';

interface WireframeProps {
  // Props interface here
}

const WireframeName: React.FC<WireframeProps> = () => {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-4">
      {/* Wireframe structure here */}
      <div className="bg-gray-100 border border-gray-300 p-4 mb-4">
        <span className="text-gray-600">Header Area</span>
      </div>
      {/* More wireframe elements */}
    </div>
  );
};

export default WireframeName;
\`\`\`

CRITICAL: Create a VISUAL WIREFRAME that shows layout structure using React components and Tailwind CSS wireframe styling.`;

    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert wireframe designer who creates visual wireframes using React and Tailwind CSS. Focus on:
- Creating wireframe-style visual layouts
- Using gray color scheme for wireframe appearance (bg-gray-50, bg-gray-100, border-gray-300)
- Showing layout structure with boxes and placeholders
- Using dashed borders and wireframe styling
- Creating placeholder content like "Header", "Navigation", "Content Area"
- Making wireframes that look like traditional wireframes but built with React
- Using Tailwind CSS classes for wireframe styling
- Including proper TypeScript interfaces

IMPORTANT: Generate wireframe-styled React components that visually represent layout structure, not final designs.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5, // Lower temperature for consistent wireframe structure
        max_tokens: 4000,
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("React wireframe generation timeout")),
          30000
        )
      ),
    ]);

    const componentCode = response.choices[0]?.message?.content?.trim();

    if (!componentCode) {
      console.log("❌ No React wireframe code generated by AI");
      return null;
    }

    // Clean up markdown formatting and extract component
    const cleanedCode = componentCode
      .replace(/```typescript\n?/g, "")
      .replace(/```tsx\n?/g, "")
      .replace(/```javascript\n?/g, "")
      .replace(/```jsx\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Extract imports and dependencies
    const imports = extractImports(cleanedCode);
    const dependencies = extractDependencies(cleanedCode);

    console.log("✅ Lovable-style React WIREFRAME generated successfully");
    console.log(
      `📊 Generated ${cleanedCode.length} characters of wireframe code`
    );

    return {
      code: cleanedCode,
      imports: imports,
      dependencies: dependencies,
    };
  } catch (error) {
    if (error.message === "React wireframe generation timeout") {
      console.error("⏰ React wireframe generation timed out after 30 seconds");
    } else {
      console.error("❌ Error generating React wireframe:", error);
    }
    return null;
  }
}

// LOVABLE-STYLE REACT COMPONENT GENERATION FUNCTION
async function generateReactComponentWithAI(
  description,
  designTheme = "modern",
  colorScheme = "primary",
  componentType = "page"
) {
  if (!openai) {
    console.log("⚠️ OpenAI client not available for component generation");
    return null;
  }

  try {
    console.log(
      "🚀 Generating Lovable-style React component for:",
      description
    );
    console.log(`🎨 Theme: ${designTheme}, Type: ${componentType}`);

    // LOVABLE-STYLE React JSX Component Generation
    const prompt = `Create a React TypeScript component for: "${description}"

STRICT REQUIREMENTS:
1. Output ONLY React TSX code - NO HTML pages
2. Use React functional component with TypeScript
3. Include all necessary React imports
4. Use only Tailwind CSS classes for styling
5. Make component responsive and accessible
6. Include proper TypeScript interfaces

COMPONENT TYPE: ${componentType}
DESIGN THEME: ${designTheme}  
COLOR SCHEME: ${colorScheme}

FORMAT (start with imports):
\`\`\`tsx
import React, { useState } from 'react';

interface ComponentProps {
  // Props interface here
}

const ComponentName: React.FC<ComponentProps> = () => {
  return (
    <div className="tailwind-classes">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
\`\`\`

CRITICAL: Generate ONLY the React TSX component code above. Do NOT create HTML pages, CSS files, or explanations.`;

    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert React developer and component designer. Create professional React TSX components like Lovable.dev. Focus on:
- Complete React functional components with TypeScript
- Modern React patterns with hooks (useState, useEffect, etc.)
- Tailwind CSS for all styling (NO embedded CSS)
- Responsive design with Tailwind breakpoints
- Accessibility best practices with proper ARIA attributes
- Clean, production-ready component architecture
- Proper TypeScript interfaces and type safety
- Modern design principles with Tailwind utilities
- Interactive elements with React state management

IMPORTANT: Generate ONLY React TSX/JSX code, NOT HTML. Use Tailwind classes for styling.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7, // Increased for more creative React component generation
        max_tokens: 4000,
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("React component generation timeout")),
          30000
        )
      ),
    ]);

    const componentCode = response.choices[0]?.message?.content?.trim();

    if (!componentCode) {
      console.log("❌ No React component code generated by AI");
      return null;
    }

    // Clean up markdown formatting and extract component
    const cleanedCode = componentCode
      .replace(/```typescript\n?/g, "")
      .replace(/```tsx\n?/g, "")
      .replace(/```javascript\n?/g, "")
      .replace(/```jsx\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Extract imports and dependencies
    const imports = extractImports(cleanedCode);
    const dependencies = extractDependencies(cleanedCode);

    console.log("✅ Lovable-style React component generated successfully");
    console.log(
      `📊 Generated ${cleanedCode.length} characters of component code`
    );

    return {
      code: cleanedCode,
      imports: imports,
      dependencies: dependencies,
    };
  } catch (error) {
    if (error.message === "React component generation timeout") {
      console.error("⏰ React component generation timed out after 30 seconds");
    } else {
      console.error("❌ Error generating React component:", error);
    }
    return null;
  }
}

// Helper functions for component analysis
function extractImports(code) {
  const importRegex = /import\s+.*?\s+from\s+['"`].*?['"`];?/g;
  const imports = code.match(importRegex) || [];
  return imports;
}

function extractDependencies(code) {
  const dependencies = new Set();

  // Check for common UI library usage
  if (code.includes("lucide-react")) dependencies.add("lucide-react");
  if (code.includes("@heroicons")) dependencies.add("@heroicons/react");
  if (code.includes("framer-motion")) dependencies.add("framer-motion");
  if (code.includes("recharts")) dependencies.add("recharts");
  if (code.includes("react-hook-form")) dependencies.add("react-hook-form");

  return Array.from(dependencies);
}

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
        banner: "#ffffff",
        headerBg: "#ffffff",
        headerText: "#000000",
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
    const isMicrosoft = designTheme.toLowerCase() === "microsoft";

    // Enhanced AI prompt with mobile-specific instructions
    const isMobileRequest =
      description.toLowerCase().includes("mobile") ||
      description.toLowerCase().includes("hamburger") ||
      description.toLowerCase().includes("responsive");

    const mobileInstructions = isMobileRequest
      ? `
- CRITICAL: Include responsive mobile navigation with hamburger menu
- Add CSS media queries for mobile breakpoints (@media max-width: 768px)
- Hamburger menu should toggle navigation on mobile devices
- Include JavaScript for hamburger menu functionality
- Navigation should be hidden on mobile and shown when hamburger is clicked
- Use transform: translateX() for smooth slide-in navigation animations`
      : "";

    // CLEAN AI PROMPT - Let AI be naturally intelligent
    const prompt = `Create a modern, responsive HTML wireframe for: "${description}"

Requirements:
- Complete HTML document with inline CSS and JavaScript
- Professional, clean design
- Color scheme: ${colorScheme}
- Modern web design standards
- Fully responsive design (desktop, tablet, mobile)${mobileInstructions}
- NO Microsoft branding or Learn content

Generate the complete HTML now:`;

    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional web designer specializing in responsive design. Create clean, modern HTML wireframes with inline CSS styling and JavaScript functionality. When mobile navigation is requested, always include a working hamburger menu with proper CSS animations and JavaScript toggle functionality. Use semantic HTML5 elements and modern CSS Grid/Flexbox layouts.",
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

// Suggestions endpoint - DISABLED
app.post("/api/generate-suggestions", async (req, res) => {
  res.json({
    suggestions: [
      "Clean, minimal design with no branding",
      "Modern responsive layout",
      "Professional typography and spacing",
      "User-friendly navigation structure",
      "Accessible form design",
      "Mobile-first responsive design",
    ],
    fallback: false,
    source: "generic-clean",
  });
});

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

// 🛡️ CRITICAL: Prevent server crashes with robust error handling
process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception - Server will continue running:", error);
  // Don't exit the process - keep server alive for users
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "🚨 Unhandled Rejection - Server will continue running:",
    reason
  );
  // Log the promise for debugging but keep server running
  console.error("Promise:", promise);
});

process.on("SIGTERM", () => {
  console.log("🔄 Server received SIGTERM - graceful shutdown initiated");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🔄 Server received SIGINT - graceful shutdown initiated");
  process.exit(0);
});

// 💪 Keep the server alive and healthy
console.log("🛡️ Server crash protection enabled - your users are safe!");
