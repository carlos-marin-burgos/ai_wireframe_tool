/**
 * Fast Suggestions Azure Function
 * Provides instant suggestions with minimal AI calls
 */

// Import secure OpenAI client utility (supports OAuth2 and API key auth)
const { getOpenAIClient } = require('../utils/secure-openai');

// Fast pattern-based suggestions
const FAST_SUGGESTION_PATTERNS = {
  dashboard: [
    "Analytics dashboard with charts and KPIs",
    "Admin dashboard with user management",
    "Executive dashboard with key metrics",
  ],
  form: [
    "Contact form with validation",
    "Registration form with multi-step flow",
    "Login form with social authentication",
  ],
  landing: [
    "Product landing page with hero section",
    "Marketing page with testimonials",
    "App landing page with feature showcase",
  ],
  navigation: [
    "Header navigation with search",
    "Sidebar navigation with icons",
    "Breadcrumb navigation system",
  ],
  ecommerce: [
    "Product catalog with filters",
    "Shopping cart with checkout",
    "E-commerce homepage with categories",
  ],
  learn: [
    "Learning module with progress tracking",
    "Course overview with lessons",
    "Tutorial page with interactive examples",
  ],
};

// Get fast suggestions based on keywords
function getFastSuggestions(input) {
  const normalizedInput = input.toLowerCase();
  const suggestions = [];

  for (const [pattern, patternSuggestions] of Object.entries(
    FAST_SUGGESTION_PATTERNS
  )) {
    if (normalizedInput.includes(pattern)) {
      suggestions.push(...patternSuggestions);
    }
  }

  // Remove duplicates and limit to 5
  return [...new Set(suggestions)].slice(0, 5);
}

// Determine if input needs AI processing
function needsAI(input) {
  if (input.length < 10) return false;

  const complexIndicators = [
    "complex",
    "advanced",
    "custom",
    "specific",
    "detailed",
    "integration",
    "real-time",
    "dynamic",
    "interactive",
  ];

  return complexIndicators.some((indicator) =>
    input.toLowerCase().includes(indicator)
  );
}

module.exports = async function (context, req) {
  // Enable CORS
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    context.res.status = 200;
    return;
  }

  try {
    const { userInput } = req.body;

    if (!userInput || typeof userInput !== "string") {
      context.res = {
        ...context.res,
        status: 400,
        body: {
          error: "Missing or invalid userInput",
          suggestions: [
            "Dashboard with analytics",
            "Landing page with hero",
            "Contact form with validation",
          ],
        },
      };
      return;
    }

    const trimmedInput = userInput.trim();

    // Always provide fast suggestions first
    const fastSuggestions = getFastSuggestions(trimmedInput);

    // For simple inputs, return fast suggestions immediately
    if (!needsAI(trimmedInput) && fastSuggestions.length > 0) {
      context.log(`⚡ Fast suggestions for: "${trimmedInput}"`);
      context.res = {
        ...context.res,
        status: 200,
        body: {
          suggestions: fastSuggestions,
          source: "fast",
          responseTime: Date.now(),
        },
      };
      return;
    }

    // For complex inputs, try AI with fallback
    let aiSuggestions = [];

    // Use secure OpenAI client with OAuth2 support
    const openai = await getOpenAIClient();

    if (openai) {
      try {
        context.log(`🧠 AI suggestions for complex input: "${trimmedInput}"`);

        // Optimized prompt for speed
        const prompt = `Generate 5 specific Microsoft Learn-style suggestions for: "${trimmedInput}"

Format as JSON array of strings. Focus on educational/learning design patterns.
Be concise and specific. Example: ["Learning module with progress tracker", "Course overview with lessons"]`;

        const response = await openai.chat.completions.create({
          model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are a Microsoft Learn UX expert. Respond only with a JSON array of 5 specific suggestion strings.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500, // Reduced for faster response
        });

        const aiContent = response.choices[0]?.message?.content?.trim();

        if (aiContent) {
          try {
            const parsed = JSON.parse(aiContent);
            aiSuggestions = Array.isArray(parsed) ? parsed : [];
          } catch (parseError) {
            context.log.warn(
              "Failed to parse AI response, using fast suggestions"
            );
          }
        }
      } catch (aiError) {
        context.log.warn("AI request failed:", aiError.message);
      }
    }

    // Return AI suggestions if available, otherwise fast suggestions
    const finalSuggestions =
      aiSuggestions.length > 0 ? aiSuggestions : fastSuggestions;

    context.res = {
      ...context.res,
      status: 200,
      body: {
        suggestions:
          finalSuggestions.length > 0
            ? finalSuggestions
            : [
                "Dashboard with key metrics",
                "Landing page with hero section",
                "Form with validation",
                "Navigation with search",
                "Card layout with actions",
              ],
        source: aiSuggestions.length > 0 ? "ai" : "fast",
        responseTime: Date.now(),
      },
    };
  } catch (error) {
    context.log.error("Fast suggestions error:", error);

    // Always provide fallback suggestions
    context.res = {
      ...context.res,
      status: 200,
      body: {
        suggestions: [
          "Dashboard with analytics and charts",
          "Landing page with hero section",
          "Contact form with validation",
          "Navigation with search functionality",
          "Card grid layout with hover effects",
        ],
        source: "fallback",
        error: "Service temporarily unavailable",
      },
    };
  }
};
