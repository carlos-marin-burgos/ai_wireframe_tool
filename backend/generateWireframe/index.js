const { app } = require("@azure/functions");
const { OpenAI } = require("openai");

// Initialize OpenAI
let openai;

function initializeOpenAI() {
  try {
    if (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY) {
      openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
        defaultQuery: { "api-version": "2024-08-01-preview" },
        defaultHeaders: {
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
      });
      console.log("✅ Azure OpenAI initialized successfully");
    }
  } catch (error) {
    console.error("❌ OpenAI initialization failed:", error.message);
  }
}

// Simple AI prompt for React wireframe generation
function createAIPrompt(description) {
  return `You are a React expert. Create a complete, modern React component wireframe based on: "${description}"

REQUIREMENTS:
- Generate a single React functional component
- Use modern React hooks (useState, useEffect if needed)
- Include all necessary UI elements for the requested functionality
- Use semantic HTML elements (header, main, section, etc.)
- Include basic inline styles for layout and visual structure
- Make it responsive and accessible
- Include interactive elements like buttons, forms, etc. as needed

COMPONENT RULES:
- Export as default function component
- Use descriptive component and variable names
- Include proper JSX structure
- Add onClick handlers for buttons (with console.log for now)
- Include form handling for any input fields
- Use modern CSS-in-JS style objects

DESIGN:
- Clean, professional appearance
- Good contrast and readability
- Proper spacing and typography
- Mobile-responsive layout
- Microsoft/modern design aesthetic

For data pages specifically:
- Include proper table structure with headers
- Add action buttons for common operations (Add, Edit, Delete, Filter)
- Include search/filter functionality
- Show pagination or data controls
- Display relevant data columns and sample data

Generate ONLY the React component code. No explanations.`;
}

// Main Azure Function
app.http("generateWireframe", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const startTime = Date.now();

    try {
      // Get description from request
      const description =
        request.query.get("description") ||
        (await request.json())?.description ||
        "Create a simple webpage";

      console.log(`🚀 Generating React wireframe for: "${description}"`);

      // Generate wireframe using AI
      if (!openai) {
        throw new Error("OpenAI not initialized");
      }

      const response = await openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a React expert who creates clean, functional wireframe components.",
          },
          {
            role: "user",
            content: createAIPrompt(description),
          },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const reactComponent = response.choices[0]?.message?.content;

      if (!reactComponent) {
        throw new Error("No component generated");
      }

      const processingTime = Date.now() - startTime;

      console.log(`✅ React wireframe generated in ${processingTime}ms`);

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
          success: true,
          component: reactComponent,
          description: description,
          processingTime: processingTime,
          timestamp: new Date().toISOString(),
        }),
      };
    } catch (error) {
      console.error("❌ Wireframe generation failed:", error);

      return {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
      };
    }
  },
});

// Health check endpoint
app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        status: "healthy",
        openai: !!openai,
        timestamp: new Date().toISOString(),
      }),
    };
  },
});

// Initialize OpenAI on startup
initializeOpenAI();
